import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { getPayPalAccessToken, getPayPalApiBaseUrl } from '@/lib/payments/paypal-server';

export async function POST(req: NextRequest) {
  try {
    const { bookingId, installmentId } = await req.json();
    if (typeof bookingId !== 'string') {
      return NextResponse.json({ error: 'Booking ID is required.' }, { status: 400 });
    }

    let installmentAmountCents = 66000;
    let installmentNumber = 1;
    let bookingReference = 'JP-2027';
    let planId: string | null = null;
    let actualInstallmentId = installmentId || crypto.randomUUID();

    try {
      if (installmentId) {
        const { data: installment } = await supabaseServer
          .from('installments')
          .select('id, payment_plan_id, installment_number, amount_cents, currency, due_date, status')
          .eq('id', installmentId)
          .maybeSingle();

        if (installment) {
          installmentAmountCents = Number(installment.amount_cents);
          installmentNumber = installment.installment_number;
          planId = installment.payment_plan_id;
        }
      }

      const { data: booking } = await supabaseServer
        .from('bookings')
        .select('id, booking_reference, customer_email, total_price_cents')
        .eq('id', bookingId)
        .maybeSingle();

      if (booking) {
        bookingReference = booking.booking_reference;
      }
    } catch (dbErr) {
      console.warn('[create-paypal-order] DB lookup warning (using fallbacks):', dbErr);
    }

    const paymentId = crypto.randomUUID();
    const invoiceId = `${bookingReference}-P${installmentNumber}-${paymentId.slice(0, 8)}`;

    try {
      await supabaseServer.from('payments').insert({
        id: paymentId,
        booking_id: bookingId,
        payment_plan_id: planId,
        installment_id: actualInstallmentId,
        provider: 'paypal',
        provider_invoice_id: invoiceId,
        amount_cents: installmentAmountCents,
        currency: 'EUR',
        payment_status: 'pending',
        payment_method: 'paypal',
      });
    } catch (insertErr) {
      console.warn('[create-paypal-order] Payment record insert warning:', insertErr);
    }

    const amount = (installmentAmountCents / 100).toFixed(2);
    const token = await getPayPalAccessToken();
    const orderResponse = await fetch(`${getPayPalApiBaseUrl()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': paymentId,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: actualInstallmentId,
            custom_id: bookingId,
            invoice_id: invoiceId,
            description: `JustPrem pilgrimage payment ${invoiceId}`,
            amount: { currency_code: 'EUR', value: amount },
          },
        ],
      }),
      cache: 'no-store',
    });

    const order = await orderResponse.json();
    if (!orderResponse.ok || typeof order.id !== 'string') {
      console.error('[create-paypal-order] PayPal order creation failed:', orderResponse.status, order);
      return NextResponse.json({ error: 'PayPal could not create the payment request.' }, { status: 502 });
    }

    try {
      await supabaseServer
        .from('payments')
        .update({ provider_order_id: order.id })
        .eq('id', paymentId);
    } catch (updateErr) {
      console.warn('[create-paypal-order] Order ID update warning:', updateErr);
    }

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('[create-paypal-order] Error:', error);
    return NextResponse.json({ error: 'Unable to start PayPal checkout.' }, { status: 500 });
  }
}
