import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref')?.trim().toUpperCase();
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!ref || !email) {
      return NextResponse.json({ error: 'Booking reference and email are required' }, { status: 400 });
    }

    // Fetch booking
    const { data: booking, error: bErr } = await supabaseServer
      .from('bookings')
      .select('*')
      .eq('booking_reference', ref)
      .single();

    if (bErr || !booking) {
      return NextResponse.json({ error: 'Booking not found. Please check your reference and email.' }, { status: 404 });
    }

    // Verify email matches
    if (booking.customer_email.toLowerCase() !== email) {
      return NextResponse.json({ error: 'Booking not found. Please check your reference and email.' }, { status: 404 });
    }

    // Fetch payment plan
    const { data: plan } = await supabaseServer
      .from('payment_plans')
      .select('*')
      .eq('booking_id', booking.id)
      .single();

    // Fetch installments
    const { data: installments } = await supabaseServer
      .from('installments')
      .select('*')
      .eq('payment_plan_id', plan?.id || '')
      .order('installment_number', { ascending: true });

    // Fetch payments
    const { data: payments } = await supabaseServer
      .from('payments')
      .select('*')
      .eq('booking_id', booking.id)
      .order('created_at', { ascending: false });

    const { data: agreement } = await supabaseServer.from('signed_agreements')
      .select('agreement_reference, terms_version, signed_at').eq('booking_id', booking.id).maybeSingle();

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingReference: booking.booking_reference,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        countryCode: booking.country_code,
        pilgrimageTitle: booking.pilgrimage_title,
        departureDate: booking.departure_date,
        totalPriceCents: booking.total_price_cents,
        bookingStatus: booking.booking_status,
        createdAt: booking.created_at,
        agreementReference: agreement?.agreement_reference || null,
        agreementVersion: agreement?.terms_version || null,
        agreementSignedAt: agreement?.signed_at || null,
      },
      plan: plan ? {
        id: plan.id,
        planType: plan.plan_type,
        totalAmountCents: plan.total_amount_cents,
        initialPaymentCents: plan.initial_payment_cents,
        outstandingAmountCents: plan.outstanding_amount_cents,
        status: plan.status,
        currency: plan.currency,
      } : null,
      installments: installments || [],
      payments: payments || [],
    });
  } catch (err) {
    console.error('[booking-status] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
