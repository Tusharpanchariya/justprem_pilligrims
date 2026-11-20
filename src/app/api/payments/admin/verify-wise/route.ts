import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { timingSafeEqual } from 'node:crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, installmentId, transferReference, amountCents, notes } = body;

    // Validate admin key
    const adminSecret = process.env.ADMIN_SECRET;
    const suppliedSecret = req.headers.get('x-admin-secret') || '';
    const supplied = Buffer.from(suppliedSecret);
    const expected = Buffer.from(adminSecret || '');
    if (!adminSecret || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (typeof bookingId !== 'string' || !uuidPattern.test(bookingId) || typeof installmentId !== 'string' ||
        !uuidPattern.test(installmentId) || typeof transferReference !== 'string' ||
        transferReference.trim().length < 3 || transferReference.trim().length > 120 ||
        !Number.isSafeInteger(amountCents) || amountCents <= 0) {
      return NextResponse.json({ error: 'bookingId, installmentId and transferReference are required' }, { status: 400 });
    }

    const { data: reconciled, error: reconciliationError } = await supabaseServer.rpc('reconcile_manual_transfer', {
      p_booking_id: bookingId,
      p_installment_id: installmentId,
      p_transfer_reference: transferReference.trim(),
      p_amount_cents: amountCents,
      p_notes: typeof notes === 'string' ? notes.slice(0, 1000) : null,
    });
    if (reconciliationError) {
      console.error('[admin/verify-wise] Transfer reconciliation failed:', reconciliationError);
      return NextResponse.json({ error: 'Transfer could not be reconciled. Check the amount, reference, and instalment status.' }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      duplicate: reconciled === false,
      message: 'Wise transfer verified and installment marked as paid.',
    });
  } catch (err) {
    console.error('[admin/verify-wise] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
