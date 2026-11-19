import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingReference, installmentNumber = 1 } = body;
    if (typeof bookingReference !== 'string' || !Number.isInteger(installmentNumber) || installmentNumber < 1 || installmentNumber > 3) {
      return NextResponse.json({ error: 'Booking reference and valid instalment number are required.' }, { status: 400 });
    }
    const { data: booking } = await supabaseServer.from('bookings').select('id, booking_reference')
      .eq('booking_reference', bookingReference.trim().toUpperCase()).maybeSingle();
    if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    const { data: signedAgreement } = await supabaseServer.from('signed_agreements')
      .select('id').eq('booking_id', booking.id).maybeSingle();
    if (!signedAgreement) return NextResponse.json({ error: 'Sign the retreat agreement before making a payment.' }, { status: 409 });
    const { data: plan } = await supabaseServer.from('payment_plans').select('id')
      .eq('booking_id', booking.id).maybeSingle();
    if (!plan) return NextResponse.json({ error: 'Payment schedule not found.' }, { status: 404 });
    const { data: installment } = await supabaseServer.from('installments')
      .select('amount_cents, currency, status, due_date')
      .eq('payment_plan_id', plan.id).eq('installment_number', installmentNumber).maybeSingle();
    if (!installment || installment.status === 'paid' || installment.status === 'refunded') {
      return NextResponse.json({ error: 'This instalment is not payable.' }, { status: 409 });
    }
    const amountCents = Number(installment.amount_cents);
    const amountEuros = (amountCents / 100).toFixed(2);
    const ref = `${booking.booking_reference}-P${installmentNumber}`;

    return NextResponse.json({
      success: true,
      instructions: {
        accountName: 'VITTHAL PREM TRAVELS LLP',
        iban: 'BE75 9059 5938 2951',
        bic: 'TRWIBEB1XXX',
        bank: 'Wise (Formerly TransferWise)',
        currency: installment.currency,
        amount: `€${parseFloat(amountEuros).toLocaleString('en-IE', { minimumFractionDigits: 2 })}`,
        amountCents,
        reference: ref,
        note: `Please use the reference "${ref}" exactly when making your transfer so we can match your payment to your booking.`,
        bookingReference: booking.booking_reference,
        installmentNumber,
      },
    });
  } catch (err) {
    console.error('[wise-instructions] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
