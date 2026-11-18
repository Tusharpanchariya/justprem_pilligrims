-- ROLLBACK: payment feature schema only.
-- Keep bookings because they contain customer booking history and may predate this feature.
BEGIN;
DROP FUNCTION IF EXISTS public.create_booking_payment_plan(JSONB, JSONB, JSONB);
DROP FUNCTION IF EXISTS public.reconcile_verified_payment(TEXT, TEXT, BIGINT, JSONB, TEXT);
DROP FUNCTION IF EXISTS public.reconcile_manual_transfer(UUID, UUID, TEXT, BIGINT, TEXT);
DROP FUNCTION IF EXISTS public.mark_payment_failed(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.prepare_payment_refund(UUID, BIGINT, TEXT);
DROP FUNCTION IF EXISTS public.finalize_payment_refund(UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.submit_booking_cancellation(TEXT, TEXT, TEXT);
DROP TABLE IF EXISTS payment_provider_events;
DROP TABLE IF EXISTS cancellation_requests;
DROP TABLE IF EXISTS payment_audit_logs;
DROP TABLE IF EXISTS refunds;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS installments;
DROP TABLE IF EXISTS payment_plans;
DROP TABLE IF EXISTS country_payment_settings;
DROP TABLE IF EXISTS payment_system_settings;
COMMIT;
