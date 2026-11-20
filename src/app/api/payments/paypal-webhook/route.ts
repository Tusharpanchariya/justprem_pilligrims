import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { getPayPalAccessToken, getPayPalApiBaseUrl } from '@/lib/payments/paypal-server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    if (rawBody.length > 1_000_000) return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
    const event = JSON.parse(rawBody);
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const headers = {
      auth_algo: req.headers.get('paypal-auth-algo'),
      cert_url: req.headers.get('paypal-cert-url'),
      transmission_id: req.headers.get('paypal-transmission-id'),
      transmission_sig: req.headers.get('paypal-transmission-sig'),
      transmission_time: req.headers.get('paypal-transmission-time'),
    };
    if (!webhookId || Object.values(headers).some((value) => !value)) {
      return NextResponse.json({ error: 'Webhook verification is not configured.' }, { status: 503 });
    }

    const token = await getPayPalAccessToken();
    const verification = await fetch(`${getPayPalApiBaseUrl()}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...headers, webhook_id: webhookId, webhook_event: event }),
      cache: 'no-store',
    });
    const verificationData = await verification.json();
    if (!verification.ok || verificationData.verification_status !== 'SUCCESS') {
      return NextResponse.json({ error: 'Invalid PayPal webhook signature.' }, { status: 401 });
    }

    if (typeof event.id !== 'string' || typeof event.event_type !== 'string') {
      return NextResponse.json({ error: 'Invalid webhook event.' }, { status: 400 });
    }
    const { data: duplicate } = await supabaseServer.from('payment_provider_events').select('id')
      .eq('provider', 'paypal').eq('event_id', event.id).maybeSingle();
    if (duplicate) return NextResponse.json({ received: true, duplicate: true });

    const resource = event.resource || {};
    const orderId = resource.supplementary_data?.related_ids?.order_id;
    if (['PAYMENT.CAPTURE.COMPLETED', 'PAYMENT.CAPTURE.DENIED', 'PAYMENT.CAPTURE.DECLINED'].includes(event.event_type)) {
      if (typeof orderId !== 'string' || typeof resource.id !== 'string') {
        return NextResponse.json({ error: 'PayPal event is missing its order or capture reference.' }, { status: 400 });
      }
      const { data: payment, error: paymentError } = await supabaseServer.from('payments')
        .select('amount_cents, currency').eq('provider', 'paypal').eq('provider_order_id', orderId).maybeSingle();
      if (paymentError || !payment) return NextResponse.json({ error: 'Payment intent not found.' }, { status: 503 });

      if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const amountCents = Math.round(Number(resource.amount?.value) * 100);
        if (resource.status !== 'COMPLETED' || resource.amount?.currency_code !== payment.currency ||
            !Number.isSafeInteger(amountCents) || amountCents !== Number(payment.amount_cents)) {
          return NextResponse.json({ error: 'Webhook payment did not match the expected amount.' }, { status: 409 });
        }
        const { error } = await supabaseServer.rpc('reconcile_verified_payment', {
          p_provider_order_id: orderId,
          p_provider_transaction_id: resource.id,
          p_amount_cents: amountCents,
          p_raw_response: { eventId: event.id, captureId: resource.id, status: resource.status, amount: resource.amount },
          p_verified_by: 'paypal_webhook',
        });
        if (error) return NextResponse.json({ error: 'Payment reconciliation failed.' }, { status: 503 });
      } else {
        const { error } = await supabaseServer.rpc('mark_payment_failed', {
          p_provider_order_id: orderId,
          p_provider_transaction_id: resource.id,
          p_reason: String(resource.status || event.event_type).slice(0, 200),
        });
        if (error) return NextResponse.json({ error: 'Failed payment update did not complete.' }, { status: 503 });
      }
    }

    if (event.event_type === 'PAYMENT.CAPTURE.REFUNDED') {
      if (typeof resource.id !== 'string') return NextResponse.json({ error: 'Refund event is missing its capture ID.' }, { status: 400 });
      const { data: payment } = await supabaseServer.from('payments').select('id')
        .eq('provider', 'paypal').eq('provider_transaction_id', resource.id).maybeSingle();
      if (!payment) return NextResponse.json({ error: 'Refunded capture was not found.' }, { status: 503 });
      const { data: refund } = await supabaseServer.from('refunds').select('id, created_at')
        .eq('payment_id', payment.id).eq('refund_status', 'pending').maybeSingle();
      if (refund && typeof event.create_time === 'string' && new Date(event.create_time) >= new Date(refund.created_at)) {
        const { error } = await supabaseServer.rpc('finalize_payment_refund', {
          p_refund_id: refund.id, p_refund_status: 'completed', p_provider_reference: null, p_processed_by: 'paypal_webhook',
        });
        if (error) return NextResponse.json({ error: 'Refund reconciliation failed.' }, { status: 503 });
      } else if (!refund) {
        const { data: priorRefund } = await supabaseServer.from('refunds').select('id')
          .eq('payment_id', payment.id).eq('refund_status', 'completed').limit(1).maybeSingle();
        if (!priorRefund) return NextResponse.json({ error: 'No pending refund matches this capture.' }, { status: 503 });
      }
    }

    if (event.event_type === 'PAYMENT.REFUND.FAILED') {
      if (typeof resource.id !== 'string') return NextResponse.json({ error: 'Refund failure event is missing its ID.' }, { status: 400 });
      const { data: refund } = await supabaseServer.from('refunds').select('id')
        .eq('provider_refund_reference', resource.id).eq('refund_status', 'pending').maybeSingle();
      if (!refund) return NextResponse.json({ error: 'Pending refund was not found.' }, { status: 503 });
      const { error } = await supabaseServer.rpc('finalize_payment_refund', {
        p_refund_id: refund.id, p_refund_status: 'rejected', p_provider_reference: resource.id, p_processed_by: 'paypal_webhook',
      });
      if (error) return NextResponse.json({ error: 'Refund failure reconciliation failed.' }, { status: 503 });
    }

    const { error: eventError } = await supabaseServer.from('payment_provider_events').insert({
      provider: 'paypal', event_id: event.id, event_type: event.event_type,
    });
    if (eventError && eventError.code !== '23505') {
      console.error('[paypal-webhook] Event ledger insert failed:', eventError);
      return NextResponse.json({ error: 'Unable to record webhook event.' }, { status: 503 });
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[paypal-webhook] Error:', error);
    return NextResponse.json({ error: 'Unable to process PayPal webhook.' }, { status: 500 });
  }
}
