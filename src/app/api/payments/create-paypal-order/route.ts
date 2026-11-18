import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { getPayPalAccessToken, getPayPalApiBaseUrl } from '@/lib/payments/paypal-server';

export async function POST(req: NextRequest) {
  try {
    const { bookingId, installmentId } = await req.json();
    if (typeof bookingId !== 'string' || typeof installmentId !== 'string') {
      return NextResponse.json({ error: 'Booking and instalment are required.' }, { status: 400 });
    }

    const { data: installment, error: installmentError } = await supabaseServer.from('installments')
      .select('id, payment_plan_id, installment_number, amount_cents, currency, due_date, status')
      .eq('id', installmentId).maybeSingle();
    if (installmentError || !installment || installment.status === 'paid' || installment.due_date > new Date().toISOString().slice(0, 10)) {
      return NextResponse.json({ error: 'This instalment is not currently payable.' }, { status: 409 });
    }

    const [{ data: plan }, { data: booking }] = await Promise.all([
      supabaseServer.from('payment_plans').select('id, booking_id, plan_type, country_code, status').eq('id', installment.payment_plan_id).maybeSingle(),
      supabaseServer.from('bookings').select('id, booking_reference, customer_email').eq('id', bookingId).maybeSingle(),
    ]);
    if (!plan || !booking || plan.booking_id !== booking.id || plan.status === 'cancelled') {
      return NextResponse.json({ error: 'Booking payment schedule was not found.' }, { status: 404 });
    }

    const { data: existing } = await supabaseServer.from('payments').select('id, provider_order_id, provider_invoice_id')
      .eq('provider', 'paypal').eq('installment_id', installmentId).eq('payment_status', 'pending')
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (existing?.provider_order_id) return NextResponse.json({ orderId: existing.provider_order_id });

    const paymentId = existing?.id || crypto.randomUUID();
    const invoiceId = existing?.provider_invoice_id || `${booking.booking_reference}-P${installment.installment_number}-${paymentId.slice(0, 8)}`;
    if (!existing) {
      const { error: intentError } = await supabaseServer.from('payments').insert({
        id: paymentId,
        booking_id: booking.id,
        payment_plan_id: plan.id,
        installment_id: installment.id,
        provider: 'paypal',
        provider_invoice_id: invoiceId,
        amount_cents: installment.amount_cents,
        currency: 'EUR',
        payment_status: 'pending',
        payment_method: 'paypal',
      });
      if (intentError) {
        console.error('[create-paypal-order] Payment intent creation failed:', intentError);
        return NextResponse.json({ error: 'Unable to record the payment request.' }, { status: 503 });
      }
    }

    const amount = (Number(installment.amount_cents) / 100).toFixed(2);
    if (!/^\d+\.\d{2}$/.test(amount)) throw new Error('Invalid stored instalment amount');
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
        purchase_units: [{
          reference_id: installment.id,
          custom_id: booking.id,
          invoice_id: invoiceId,
          description: `JustPrem pilgrimage ${invoiceId}`,
          amount: { currency_code: 'EUR', value: amount },
        }],
      }),
      cache: 'no-store',
    });
    const order = await orderResponse.json();
    if (!orderResponse.ok || typeof order.id !== 'string') {
      console.error('[create-paypal-order] PayPal order creation failed:', orderResponse.status, order.name);
      return NextResponse.json({ error: 'PayPal could not create the payment request.' }, { status: 502 });
    }

    const { error: paymentError } = await supabaseServer.from('payments')
      .update({ provider_order_id: order.id }).eq('id', paymentId);
    if (paymentError) {
      console.error('[create-paypal-order] Payment intent persistence failed:', paymentError);
      return NextResponse.json({ error: 'Unable to record the payment request.' }, { status: 503 });
    }
    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('[create-paypal-order] Error:', error);
    return NextResponse.json({ error: 'Unable to start PayPal checkout.' }, { status: 500 });
  }
}
