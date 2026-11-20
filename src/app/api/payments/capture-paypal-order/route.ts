import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { getPayPalAccessToken, getPayPalApiBaseUrl } from '@/lib/payments/paypal-server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (typeof orderId !== 'string' || orderId.length > 128) {
      return NextResponse.json({ error: 'A valid PayPal order ID is required.' }, { status: 400 });
    }

    const { data: payment, error: paymentError } = await supabaseServer.from('payments')
      .select('id, booking_id, payment_plan_id, installment_id, amount_cents, currency, payment_status, provider_transaction_id')
      .eq('provider', 'paypal').eq('provider_order_id', orderId).maybeSingle();
    if (paymentError || !payment) return NextResponse.json({ error: 'Payment order was not found.' }, { status: 404 });
    if (payment.payment_status === 'completed' && payment.provider_transaction_id) {
      return NextResponse.json({ success: true, status: 'completed', transactionId: payment.provider_transaction_id });
    }
    if (!['pending', 'pending_verification'].includes(payment.payment_status)) {
      return NextResponse.json({ error: 'Payment is not awaiting capture.' }, { status: 409 });
    }

    const token = await getPayPalAccessToken();
    let response = await fetch(`${getPayPalApiBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: '{}',
      cache: 'no-store',
    });
    let captureData = await response.json();
    if (!response.ok && captureData.name === 'ORDER_ALREADY_CAPTURED') {
      response = await fetch(`${getPayPalApiBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
        headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
      });
      captureData = await response.json();
    }
    if (!response.ok) {
      console.error('[capture-paypal-order] PayPal capture rejected:', response.status, captureData.name);
      return NextResponse.json({ error: 'PayPal has not confirmed this payment.' }, { status: 502 });
    }

    const purchaseUnit = captureData.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];
    if (captureData.status !== 'COMPLETED' || capture?.status !== 'COMPLETED' ||
        purchaseUnit?.custom_id !== payment.booking_id || purchaseUnit?.reference_id !== payment.installment_id ||
        capture.amount?.currency_code !== payment.currency) {
      return NextResponse.json({ error: 'PayPal payment details did not match this booking.' }, { status: 409 });
    }
    const paidCents = Math.round(Number(capture.amount.value) * 100);
    if (!Number.isSafeInteger(paidCents) || paidCents !== Number(payment.amount_cents) || !capture.id) {
      return NextResponse.json({ error: 'PayPal confirmed an unexpected amount; payment needs review.' }, { status: 409 });
    }

    const { data: reconciled, error: reconcileError } = await supabaseServer.rpc('reconcile_verified_payment', {
      p_provider_order_id: orderId,
      p_provider_transaction_id: capture.id,
      p_amount_cents: paidCents,
      p_raw_response: { orderId, captureId: capture.id, status: capture.status, amount: capture.amount },
      p_verified_by: 'paypal_capture_api',
    });
    if (reconcileError) {
      console.error('[capture-paypal-order] Reconciliation failed:', reconcileError);
      return NextResponse.json({ error: 'Payment was received but booking reconciliation needs review.' }, { status: 503 });
    }
    return NextResponse.json({ success: true, status: 'completed', transactionId: capture.id, duplicate: reconciled === false });
  } catch (error) {
    console.error('[capture-paypal-order] Error:', error);
    return NextResponse.json({ error: 'Unable to verify PayPal payment.' }, { status: 500 });
  }
}
