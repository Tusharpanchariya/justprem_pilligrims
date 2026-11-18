import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET || '';
  const supplied = Buffer.from(req.headers.get('x-admin-secret') || '');
  const expected = Buffer.from(secret);
  if (!secret || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { refundId, transferReference } = await req.json();
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (typeof refundId !== 'string' || !uuidPattern.test(refundId) || typeof transferReference !== 'string' ||
        transferReference.trim().length < 3 || transferReference.trim().length > 120) {
      return NextResponse.json({ error: 'Refund ID and verified bank transfer reference are required.' }, { status: 400 });
    }
    const { data: refund, error: refundError } = await supabaseServer.from('refunds')
      .select('id, payment_id, refund_status, payments(provider)')
      .eq('id', refundId).maybeSingle();
    if (refundError || !refund || refund.refund_status !== 'pending' ||
        !['wise', 'bank_transfer'].includes((refund.payments as { provider?: string } | null)?.provider || '')) {
      return NextResponse.json({ error: 'Pending Wise refund not found.' }, { status: 404 });
    }
    const { error } = await supabaseServer.rpc('finalize_payment_refund', {
      p_refund_id: refundId,
      p_refund_status: 'completed',
      p_provider_reference: transferReference.trim(),
      p_processed_by: 'admin_manual_refund',
    });
    if (error) return NextResponse.json({ error: 'Refund could not be recorded.' }, { status: 409 });
    return NextResponse.json({ success: true, status: 'completed' });
  } catch (error) {
    console.error('[complete-manual-refund] Error:', error);
    return NextResponse.json({ error: 'Unable to record manual refund.' }, { status: 500 });
  }
}
