import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { supabaseServer } from '@/lib/supabase-server';
import { getPayPalAccessToken, getPayPalApiBaseUrl } from '@/lib/payments/paypal-server';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET || '';
  const supplied = Buffer.from(req.headers.get('x-admin-secret') || '');
  const expected = Buffer.from(secret);
  return Boolean(secret && supplied.length === expected.length && timingSafeEqual(supplied, expected));
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { paymentId, amountCents, reason } = await req.json();
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (typeof paymentId !== 'string' || !uuidPattern.test(paymentId) || !Number.isSafeInteger(amountCents) || amountCents <= 0 ||
        typeof reason !== 'string' || reason.trim().length < 5 || reason.length > 1000) {
      return NextResponse.json({ error: 'Valid payment, positive amount, and refund reason are required.' }, { status: 400 });
    }
    const { data: payment, error: paymentError } = await supabaseServer.from('payments')
      .select('id, provider, provider_transaction_id, amount_cents, currency, payment_status')
      .eq('id', paymentId).maybeSingle();
    if (paymentError || !payment || !['completed', 'refunded'].includes(payment.payment_status)) {
      return NextResponse.json({ error: 'Only verified payments can be refunded.' }, { status: 409 });
    }

    const { data: refundId, error: prepareError } = await supabaseServer.rpc('prepare_payment_refund', {
      p_payment_id: paymentId, p_amount_cents: amountCents, p_reason: reason.trim(),
    });
    if (prepareError || typeof refundId !== 'string') {
      console.error('[process-refund] Refund preparation failed:', prepareError);
      return NextResponse.json({ error: 'Refund exceeds the remaining verified amount or is otherwise unavailable.' }, { status: 409 });
    }

    if (payment.provider === 'wise' || payment.provider === 'bank_transfer') {
      return NextResponse.json({
        success: true,
        refundId,
        status: 'pending',
        message: 'Refund is recorded as pending. Complete the bank transfer, then confirm it using the manual refund endpoint.',
      }, { status: 202 });
    }
    if (payment.provider !== 'paypal' || !payment.provider_transaction_id) {
      return NextResponse.json({ error: 'This payment provider does not support an automated refund request.' }, { status: 409 });
    }

    const token = await getPayPalAccessToken();
    const response = await fetch(`${getPayPalApiBaseUrl()}/v2/payments/captures/${encodeURIComponent(payment.provider_transaction_id)}/refund`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': refundId,
      },
      body: JSON.stringify({ amount: { currency_code: payment.currency, value: (amountCents / 100).toFixed(2) } }),
      cache: 'no-store',
    });
    const result = await response.json();
    if (!response.ok || !result.id) {
      await supabaseServer.rpc('finalize_payment_refund', {
        p_refund_id: refundId, p_refund_status: 'rejected', p_provider_reference: null, p_processed_by: 'paypal_api',
      });
      console.error('[process-refund] PayPal refund request failed:', response.status, result.name);
      return NextResponse.json({ error: 'PayPal rejected the refund request.' }, { status: 502 });
    }

    if (!['COMPLETED', 'PENDING'].includes(result.status)) {
      await supabaseServer.rpc('finalize_payment_refund', {
        p_refund_id: refundId, p_refund_status: 'rejected', p_provider_reference: result.id, p_processed_by: 'paypal_api',
      });
      return NextResponse.json({ error: 'PayPal did not accept the refund for processing.' }, { status: 502 });
    }

    const finalStatus = result.status === 'COMPLETED' ? 'completed' : 'pending';
    const { error: finalizeError } = await supabaseServer.rpc('finalize_payment_refund', {
      p_refund_id: refundId,
      p_refund_status: finalStatus,
      p_provider_reference: result.id,
      p_processed_by: 'paypal_api',
    });
    if (finalizeError) {
      console.error('[process-refund] Provider refund created but ledger update failed:', finalizeError);
      return NextResponse.json({ error: 'Provider refund exists but the ledger needs administrator review.', refundId, providerRefundId: result.id }, { status: 503 });
    }
    return NextResponse.json({ success: true, refundId, providerRefundId: result.id, status: finalStatus });
  } catch (error) {
    console.error('[process-refund] Error:', error);
    return NextResponse.json({ error: 'Unable to process refund.' }, { status: 500 });
  }
}
