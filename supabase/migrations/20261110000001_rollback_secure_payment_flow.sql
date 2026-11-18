-- Roll back only the additive payment hardening migration.
BEGIN;
DROP FUNCTION IF EXISTS public.create_booking_payment_plan(JSONB, JSONB, JSONB);
DROP FUNCTION IF EXISTS public.reconcile_verified_payment(TEXT, TEXT, BIGINT, JSONB, TEXT);
DROP FUNCTION IF EXISTS public.reconcile_manual_transfer(UUID, UUID, TEXT, BIGINT, TEXT);
DROP FUNCTION IF EXISTS public.mark_payment_failed(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.prepare_payment_refund(UUID, BIGINT, TEXT);
DROP FUNCTION IF EXISTS public.finalize_payment_refund(UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.submit_booking_cancellation(TEXT, TEXT, TEXT);
DROP INDEX IF EXISTS public.idx_payments_provider_order_unique;
DROP INDEX IF EXISTS public.idx_payments_one_pending_installment;
DROP TABLE IF EXISTS public.payment_provider_events;
ALTER TABLE public.payment_plans DROP COLUMN IF EXISTS cancellation_policy_text;
ALTER TABLE public.payment_plans DROP COLUMN IF EXISTS cancellation_policy_version;
ALTER TABLE public.payment_plans DROP COLUMN IF EXISTS terms_text;
ALTER TABLE public.country_payment_settings DROP COLUMN IF EXISTS approved_cancellation_policy_text;
ALTER TABLE public.country_payment_settings DROP COLUMN IF EXISTS approved_cancellation_policy_version;
ALTER TABLE public.country_payment_settings DROP COLUMN IF EXISTS approved_terms_text;
-- Keep payment_system_settings and its emergency state intact on rollback.
COMMIT;
