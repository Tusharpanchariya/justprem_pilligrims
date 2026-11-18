-- ==============================================================================
-- MIGRATION: 20261109000000_international_instalments_system.sql
-- PURPOSE: JustPrem International Pilgrimage Instalment Payment System
-- ENTITY: VITTHAL PREM TRAVELS LLP (Trading as JustPrem)
-- ==============================================================================

BEGIN;

-- 1. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT NOT NULL UNIQUE,
  enquiry_id UUID REFERENCES Retreat_enquiries(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  pilgrimage_slug TEXT NOT NULL DEFAULT 'nepal-sacred-himalayas',
  pilgrimage_title TEXT NOT NULL DEFAULT 'Heart of the Himalayas',
  departure_date DATE NOT NULL DEFAULT '2027-04-24',
  total_price_cents BIGINT NOT NULL DEFAULT 190000,
  currency TEXT NOT NULL DEFAULT 'EUR',
  booking_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancellation_requested', 'cancelled'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. COUNTRY PAYMENT SETTINGS
CREATE TABLE IF NOT EXISTS country_payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  payment_plan_enabled BOOLEAN NOT NULL DEFAULT false,
  approved_plan_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  approved_terms_version TEXT,
  legal_review_date DATE,
  legal_review_reference TEXT,
  approved_terms_text TEXT,
  approved_cancellation_policy_version TEXT,
  approved_cancellation_policy_text TEXT,
  emergency_disabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE country_payment_settings ADD COLUMN IF NOT EXISTS approved_terms_text TEXT;
ALTER TABLE country_payment_settings ADD COLUMN IF NOT EXISTS approved_cancellation_policy_version TEXT;
ALTER TABLE country_payment_settings ADD COLUMN IF NOT EXISTS approved_cancellation_policy_text TEXT;

-- Global fail-closed switch. Existing plans remain payable when disabled.
CREATE TABLE IF NOT EXISTS payment_system_settings (
  singleton BOOLEAN PRIMARY KEY DEFAULT true CHECK (singleton),
  allow_new_installment_plans BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO payment_system_settings (singleton, allow_new_installment_plans)
VALUES (true, false)
ON CONFLICT (singleton) DO NOTHING;

-- 3. PAYMENT PLANS TABLE
CREATE TABLE IF NOT EXISTS payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  plan_type TEXT NOT NULL, -- 'full', 'two_parts', 'three_parts'
  currency TEXT NOT NULL DEFAULT 'EUR',
  total_amount_cents BIGINT NOT NULL,
  initial_payment_cents BIGINT NOT NULL,
  outstanding_amount_cents BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_first_payment', -- 'pending_first_payment', 'active', 'completed', 'overdue', 'cancelled'
  country_code TEXT NOT NULL,
  terms_version TEXT NOT NULL DEFAULT '2026.1',
  terms_accepted_at TIMESTAMPTZ,
  terms_text TEXT,
  cancellation_policy_version TEXT,
  cancellation_policy_text TEXT,
  legal_eligibility_status TEXT NOT NULL DEFAULT 'pending_review', -- 'approved', 'under_review', 'pending_review'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. INSTALLMENTS TABLE
CREATE TABLE IF NOT EXISTS installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_plan_id UUID NOT NULL REFERENCES payment_plans(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  amount_cents BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming', -- 'paid', 'pending_verification', 'upcoming', 'overdue', 'failed', 'refunded', 'disputed'
  paid_at TIMESTAMPTZ,
  payment_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_plan_id UUID NOT NULL REFERENCES payment_plans(id) ON DELETE CASCADE,
  installment_id UUID REFERENCES installments(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider TEXT NOT NULL, -- 'paypal', 'wise', 'bank_transfer'
  provider_transaction_id TEXT,
  provider_invoice_id TEXT,
  provider_order_id TEXT,
  amount_cents BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  payment_method TEXT NOT NULL DEFAULT 'paypal',
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. REFUNDS TABLE
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  amount_cents BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  refund_reason TEXT NOT NULL,
  refund_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'rejected'
  provider_refund_reference TEXT,
  processed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- 7. PAYMENT AUDIT LOGS
CREATE TABLE IF NOT EXISTS payment_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. CANCELLATION REQUESTS
CREATE TABLE IF NOT EXISTS cancellation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted', -- 'submitted', 'under_review', 'approved', 'rejected'
  proposed_refund_cents BIGINT NOT NULL DEFAULT 0,
  approved_refund_cents BIGINT NOT NULL DEFAULT 0,
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_provider_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);

-- 9. PERFORMANCE & INTEGRITY INDEXES
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_payment_plans_booking ON payment_plans(booking_id);
CREATE INDEX IF NOT EXISTS idx_installments_plan ON installments(payment_plan_id);
CREATE INDEX IF NOT EXISTS idx_installments_status ON installments(status);
CREATE INDEX IF NOT EXISTS idx_installments_due_date ON installments(due_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_installments_plan_number ON installments(payment_plan_id, installment_number);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_plan ON payments(payment_plan_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_tx ON payments(provider_transaction_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_transaction_unique ON payments(provider, provider_transaction_id) WHERE provider_transaction_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_order_unique ON payments(provider, provider_order_id) WHERE provider_order_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_one_pending_installment ON payments(provider, installment_id) WHERE payment_status = 'pending' AND installment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_plans_customer ON payment_plans(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_booking ON payment_audit_logs(booking_id);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_provider_events ENABLE ROW LEVEL SECURITY;

-- No client policies are granted until customer authentication and role checks
-- exist. Trusted server routes use the service role and must enforce ownership.
-- In particular, never expose booking, payment or refund rows to anon clients.

-- Atomically persist a booking, its plan, and every scheduled instalment.
CREATE OR REPLACE FUNCTION public.create_booking_payment_plan(
  p_booking JSONB,
  p_plan JSONB,
  p_installments JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking_id UUID;
  v_plan_id UUID;
  v_item JSONB;
BEGIN
  INSERT INTO public.bookings (
    id, booking_reference, customer_name, customer_email, customer_phone,
    customer_country, country_code, pilgrimage_slug, pilgrimage_title,
    departure_date, total_price_cents, currency, booking_status
  ) VALUES (
    (p_booking->>'id')::UUID, p_booking->>'booking_reference', p_booking->>'customer_name',
    p_booking->>'customer_email', p_booking->>'customer_phone', p_booking->>'customer_country',
    p_booking->>'country_code', p_booking->>'pilgrimage_slug', p_booking->>'pilgrimage_title',
    (p_booking->>'departure_date')::DATE, (p_booking->>'total_price_cents')::BIGINT,
    p_booking->>'currency', p_booking->>'booking_status'
  )
  RETURNING id INTO v_booking_id;

  INSERT INTO public.payment_plans (
    id, booking_id, plan_type, currency, total_amount_cents, initial_payment_cents,
    outstanding_amount_cents, status, country_code, terms_version, terms_accepted_at,
    terms_text, cancellation_policy_version, cancellation_policy_text, legal_eligibility_status
  ) VALUES (
    (p_plan->>'id')::UUID, v_booking_id, p_plan->>'plan_type', p_plan->>'currency',
    (p_plan->>'total_amount_cents')::BIGINT, (p_plan->>'initial_payment_cents')::BIGINT,
    (p_plan->>'outstanding_amount_cents')::BIGINT, p_plan->>'status', p_plan->>'country_code',
    p_plan->>'terms_version', NULLIF(p_plan->>'terms_accepted_at', '')::TIMESTAMPTZ,
    p_plan->>'terms_text', p_plan->>'cancellation_policy_version',
    p_plan->>'cancellation_policy_text', p_plan->>'legal_eligibility_status'
  )
  RETURNING id INTO v_plan_id;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_installments)
  LOOP
    INSERT INTO public.installments (
      id, payment_plan_id, installment_number, amount_cents, currency, due_date, status
    ) VALUES (
      (v_item->>'id')::UUID, v_plan_id, (v_item->>'installment_number')::INTEGER,
      (v_item->>'amount_cents')::BIGINT, v_item->>'currency',
      (v_item->>'due_date')::DATE, v_item->>'status'
    );
  END LOOP;

  RETURN jsonb_build_object('booking_id', v_booking_id, 'payment_plan_id', v_plan_id);
END;
$$;

-- Reconcile only a provider-verified capture, once, and update all related rows atomically.
CREATE OR REPLACE FUNCTION public.reconcile_verified_payment(
  p_provider_order_id TEXT,
  p_provider_transaction_id TEXT,
  p_amount_cents BIGINT,
  p_raw_response JSONB,
  p_verified_by TEXT DEFAULT 'paypal'
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment public.payments%ROWTYPE;
  v_outstanding BIGINT;
BEGIN
  SELECT * INTO v_payment FROM public.payments
  WHERE provider = 'paypal' AND provider_order_id = p_provider_order_id
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Payment order not found'; END IF;

  IF v_payment.payment_status = 'completed' THEN
    IF v_payment.provider_transaction_id = p_provider_transaction_id THEN RETURN FALSE; END IF;
    RAISE EXCEPTION 'Order was already reconciled with another transaction';
  END IF;
  IF v_payment.payment_status NOT IN ('pending', 'pending_verification') THEN
    RAISE EXCEPTION 'Payment is not eligible for reconciliation';
  END IF;
  IF v_payment.amount_cents <> p_amount_cents THEN RAISE EXCEPTION 'Payment amount mismatch'; END IF;

  UPDATE public.payments SET
    provider_transaction_id = p_provider_transaction_id,
    payment_status = 'completed', verified_at = now(), verified_by = p_verified_by,
    raw_response = p_raw_response
  WHERE id = v_payment.id;

  IF v_payment.installment_id IS NOT NULL THEN
    UPDATE public.installments SET status = 'paid', paid_at = now(), payment_id = v_payment.id, updated_at = now()
    WHERE id = v_payment.installment_id AND status <> 'paid';
    IF NOT FOUND THEN RAISE EXCEPTION 'Instalment already paid or unavailable'; END IF;
  END IF;

  SELECT COALESCE(SUM(amount_cents), 0) INTO v_outstanding
  FROM public.installments WHERE payment_plan_id = v_payment.payment_plan_id AND status <> 'paid';
  UPDATE public.payment_plans SET outstanding_amount_cents = v_outstanding,
    status = CASE WHEN v_outstanding = 0 THEN 'completed' ELSE 'active' END,
    updated_at = now()
  WHERE id = v_payment.payment_plan_id;
  UPDATE public.bookings SET booking_status = 'confirmed', updated_at = now()
  WHERE id = v_payment.booking_id;
  INSERT INTO public.payment_audit_logs (booking_id, action, performed_by, new_status, metadata)
  VALUES (v_payment.booking_id, 'provider_payment_verified', p_verified_by, 'completed',
    jsonb_build_object('payment_id', v_payment.id, 'order_id', p_provider_order_id,
      'transaction_id', p_provider_transaction_id, 'amount_cents', p_amount_cents));
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.reconcile_manual_transfer(
  p_booking_id UUID,
  p_installment_id UUID,
  p_transfer_reference TEXT,
  p_amount_cents BIGINT,
  p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_installment public.installments%ROWTYPE;
  v_plan public.payment_plans%ROWTYPE;
  v_payment_id UUID;
  v_outstanding BIGINT;
BEGIN
  SELECT i.* INTO v_installment FROM public.installments i
  JOIN public.payment_plans pp ON pp.id = i.payment_plan_id
  WHERE i.id = p_installment_id AND pp.booking_id = p_booking_id
  FOR UPDATE OF i;
  IF NOT FOUND THEN RAISE EXCEPTION 'Booking instalment not found'; END IF;
  IF v_installment.amount_cents <> p_amount_cents THEN RAISE EXCEPTION 'Transfer amount mismatch'; END IF;
  IF v_installment.status = 'paid' THEN RAISE EXCEPTION 'Instalment is already paid'; END IF;
  IF EXISTS (SELECT 1 FROM public.payments WHERE provider = 'wise' AND provider_transaction_id = p_transfer_reference) THEN
    RAISE EXCEPTION 'Transfer reference has already been reconciled';
  END IF;

  SELECT * INTO v_plan FROM public.payment_plans WHERE id = v_installment.payment_plan_id FOR UPDATE;
  INSERT INTO public.payments (booking_id, payment_plan_id, installment_id, customer_id,
    provider, provider_transaction_id, amount_cents, currency, payment_status, payment_method,
    verified_at, verified_by)
  VALUES (p_booking_id, v_plan.id, v_installment.id, v_plan.customer_id,
    'wise', p_transfer_reference, p_amount_cents, v_installment.currency, 'completed',
    'bank_transfer', now(), 'admin_manual_reconciliation')
  RETURNING id INTO v_payment_id;

  UPDATE public.installments SET status = 'paid', paid_at = now(), payment_id = v_payment_id, updated_at = now()
  WHERE id = v_installment.id;
  SELECT COALESCE(SUM(amount_cents), 0) INTO v_outstanding
  FROM public.installments WHERE payment_plan_id = v_plan.id AND status <> 'paid';
  UPDATE public.payment_plans SET outstanding_amount_cents = v_outstanding,
    status = CASE WHEN v_outstanding = 0 THEN 'completed' ELSE 'active' END, updated_at = now()
  WHERE id = v_plan.id;
  UPDATE public.bookings SET booking_status = 'confirmed', updated_at = now() WHERE id = p_booking_id;
  INSERT INTO public.payment_audit_logs (booking_id, action, performed_by, new_status, metadata)
  VALUES (p_booking_id, 'wise_manual_transfer_reconciled', 'admin_secret', 'completed',
    jsonb_build_object('payment_id', v_payment_id, 'transfer_reference', p_transfer_reference,
      'amount_cents', p_amount_cents, 'notes', p_notes));
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_payment_failed(
  p_provider_order_id TEXT,
  p_provider_transaction_id TEXT,
  p_reason TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment public.payments%ROWTYPE;
BEGIN
  SELECT * INTO v_payment FROM public.payments
  WHERE provider = 'paypal' AND provider_order_id = p_provider_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Payment order not found'; END IF;
  IF v_payment.payment_status = 'failed' THEN RETURN FALSE; END IF;
  IF v_payment.payment_status <> 'pending' THEN RAISE EXCEPTION 'Only pending payments can be marked failed'; END IF;
  UPDATE public.payments SET payment_status = 'failed', provider_transaction_id = p_provider_transaction_id
  WHERE id = v_payment.id;
  UPDATE public.installments SET status = 'failed', updated_at = now()
  WHERE id = v_payment.installment_id AND status <> 'paid';
  INSERT INTO public.payment_audit_logs (booking_id, action, performed_by, previous_status, new_status, metadata)
  VALUES (v_payment.booking_id, 'provider_payment_failed', 'paypal_webhook', 'pending', 'failed',
    jsonb_build_object('provider_order_id', p_provider_order_id, 'provider_transaction_id', p_provider_transaction_id, 'reason', p_reason));
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.prepare_payment_refund(
  p_payment_id UUID,
  p_amount_cents BIGINT,
  p_reason TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment public.payments%ROWTYPE;
  v_refund_id UUID;
  v_reserved BIGINT;
  v_pending public.refunds%ROWTYPE;
BEGIN
  SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;
  IF NOT FOUND OR v_payment.payment_status NOT IN ('completed', 'refunded') THEN
    RAISE EXCEPTION 'Only verified payments can be refunded';
  END IF;
  IF p_amount_cents <= 0 OR length(trim(p_reason)) < 5 THEN RAISE EXCEPTION 'Invalid refund amount or reason'; END IF;
  SELECT * INTO v_pending FROM public.refunds WHERE payment_id = p_payment_id AND refund_status = 'pending' FOR UPDATE;
  IF FOUND THEN
    IF v_pending.amount_cents = p_amount_cents AND v_pending.refund_reason = trim(p_reason) THEN
      RETURN v_pending.id;
    END IF;
    RAISE EXCEPTION 'A refund is already pending for this payment';
  END IF;
  SELECT COALESCE(SUM(amount_cents), 0) INTO v_reserved FROM public.refunds
    WHERE payment_id = p_payment_id AND refund_status IN ('pending', 'completed');
  IF v_reserved + p_amount_cents > v_payment.amount_cents THEN RAISE EXCEPTION 'Refund exceeds the verified payment balance'; END IF;

  INSERT INTO public.refunds (booking_id, payment_id, amount_cents, currency, refund_reason, refund_status)
  VALUES (v_payment.booking_id, p_payment_id, p_amount_cents, v_payment.currency, trim(p_reason), 'pending')
  RETURNING id INTO v_refund_id;
  INSERT INTO public.payment_audit_logs (booking_id, action, performed_by, new_status, metadata)
  VALUES (v_payment.booking_id, 'refund_requested_by_admin', 'admin_secret', 'pending',
    jsonb_build_object('refund_id', v_refund_id, 'payment_id', p_payment_id, 'amount_cents', p_amount_cents));
  RETURN v_refund_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_booking_cancellation(
  p_booking_reference TEXT,
  p_customer_email TEXT,
  p_reason TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking public.bookings%ROWTYPE;
  v_request_id UUID;
BEGIN
  IF length(trim(p_reason)) < 10 OR length(p_reason) > 2000 THEN RAISE EXCEPTION 'Cancellation reason is invalid'; END IF;
  SELECT * INTO v_booking FROM public.bookings
    WHERE booking_reference = upper(trim(p_booking_reference)) FOR UPDATE;
  IF NOT FOUND OR lower(v_booking.customer_email) <> lower(trim(p_customer_email)) THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;
  IF v_booking.booking_status IN ('cancelled', 'cancellation_requested') THEN
    RAISE EXCEPTION 'Cancellation request already exists';
  END IF;
  INSERT INTO public.cancellation_requests (booking_id, customer_email, reason, status)
  VALUES (v_booking.id, lower(trim(p_customer_email)), trim(p_reason), 'submitted')
  RETURNING id INTO v_request_id;
  UPDATE public.bookings SET booking_status = 'cancellation_requested', updated_at = now() WHERE id = v_booking.id;
  INSERT INTO public.payment_audit_logs (booking_id, action, performed_by, new_status, metadata)
  VALUES (v_booking.id, 'customer_cancellation_requested', 'customer_email_verified', 'cancellation_requested',
    jsonb_build_object('cancellation_request_id', v_request_id));
  RETURN v_request_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.finalize_payment_refund(
  p_refund_id UUID,
  p_refund_status TEXT,
  p_provider_reference TEXT,
  p_processed_by TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_refund public.refunds%ROWTYPE;
  v_refunded BIGINT;
BEGIN
  SELECT * INTO v_refund FROM public.refunds WHERE id = p_refund_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Refund request not found'; END IF;
  IF p_refund_status NOT IN ('pending', 'completed', 'rejected') THEN RAISE EXCEPTION 'Invalid refund status'; END IF;
  IF v_refund.refund_status = 'completed' THEN RETURN FALSE; END IF;
  IF v_refund.refund_status = 'rejected' THEN RAISE EXCEPTION 'Rejected refund cannot be completed'; END IF;

  UPDATE public.refunds SET refund_status = p_refund_status,
    provider_refund_reference = COALESCE(p_provider_reference, provider_refund_reference),
    processed_by = p_processed_by,
    processed_at = CASE WHEN p_refund_status IN ('completed', 'rejected') THEN now() ELSE NULL END
  WHERE id = p_refund_id;

  IF p_refund_status = 'completed' THEN
    SELECT COALESCE(SUM(amount_cents), 0) INTO v_refunded FROM public.refunds
      WHERE payment_id = v_refund.payment_id AND refund_status = 'completed';
    UPDATE public.payments SET payment_status = 'refunded'
      WHERE id = v_refund.payment_id AND v_refunded >= amount_cents;
    UPDATE public.installments SET status = 'refunded', updated_at = now()
      WHERE id = (SELECT installment_id FROM public.payments WHERE id = v_refund.payment_id)
        AND v_refunded >= (SELECT amount_cents FROM public.payments WHERE id = v_refund.payment_id);
  END IF;

  INSERT INTO public.payment_audit_logs (booking_id, action, performed_by, new_status, metadata)
  VALUES (v_refund.booking_id, 'refund_status_updated', p_processed_by, p_refund_status,
    jsonb_build_object('refund_id', p_refund_id, 'provider_reference', p_provider_reference,
      'amount_cents', v_refund.amount_cents));
  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.create_booking_payment_plan(JSONB, JSONB, JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reconcile_verified_payment(TEXT, TEXT, BIGINT, JSONB, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reconcile_manual_transfer(UUID, UUID, TEXT, BIGINT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.mark_payment_failed(TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prepare_payment_refund(UUID, BIGINT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.submit_booking_cancellation(TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.finalize_payment_refund(UUID, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_booking_payment_plan(JSONB, JSONB, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.reconcile_verified_payment(TEXT, TEXT, BIGINT, JSONB, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.reconcile_manual_transfer(UUID, UUID, TEXT, BIGINT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_payment_failed(TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.prepare_payment_refund(UUID, BIGINT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.submit_booking_cancellation(TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.finalize_payment_refund(UUID, TEXT, TEXT, TEXT) TO service_role;

COMMIT;

