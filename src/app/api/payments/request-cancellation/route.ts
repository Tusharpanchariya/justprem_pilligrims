import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingReference, email, reason } = body;

    if (!bookingReference || !email || !reason) {
      return NextResponse.json({ error: 'bookingReference, email and reason are required' }, { status: 400 });
    }

    const { data: requestId, error } = await supabaseServer.rpc('submit_booking_cancellation', {
      p_booking_reference: bookingReference,
      p_customer_email: email,
      p_reason: reason,
    });
    if (error || !requestId) {
      const alreadyExists = error?.message?.includes('already exists');
      return NextResponse.json(
        { error: alreadyExists ? 'A cancellation request already exists for this booking.' : 'Booking could not be verified.' },
        { status: alreadyExists ? 409 : 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your cancellation request has been received. Our team will contact you within 2 business days to process your request and confirm any applicable refund.',
      bookingReference: bookingReference.toUpperCase(),
      cancellationRequestId: requestId,
      nextSteps: 'Please do not make any additional payments while your cancellation is being processed. For urgent queries, please email us at info@justprem.com.',
    });
  } catch (err) {
    console.error('[request-cancellation] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
