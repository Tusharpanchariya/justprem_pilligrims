-- Digital agreements for retreat bookings. Agreement text is snapshotted so
-- later edits to published terms cannot alter a participant's signed record.
BEGIN;

CREATE TABLE IF NOT EXISTS public.retreat_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilgrimage_slug TEXT NOT NULL,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pilgrimage_slug, version)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_retreat_terms_one_published
  ON public.retreat_terms (pilgrimage_slug) WHERE status = 'published';

INSERT INTO public.retreat_terms (pilgrimage_slug, version, title, content, status)
VALUES (
  'nepal-himalaya-2027', 'initial-draft-2026-11',
  'Heart of the Himalayas Retreat Terms & Conditions',
  $terms$1. Booking and Confirmation
A booking is confirmed only after the required first payment has been successfully received and the participant has signed this agreement. The first instalment is the booking deposit for an instalment plan and forms part of the total price; it is not charged on top. Availability is not guaranteed until confirmation.

2. Pricing and Payment
The initial per-person full-payment prices are EUR 1,900 Early Bird (eligible through December 31, 2026) and EUR 2,350 Standard (from January 1, 2027). Instalment-plan prices are EUR 1,980 Early Bird and EUR 2,430 Standard. Early Bird eligibility is determined by booking date and configured eligibility. Initial plans use three equal payments: EUR 660 or EUR 810 at booking, followed by payments on February 28, 2027 and March 30, 2027. The first instalment is the booking deposit. For later bookings, the schedule and final due date shown and accepted at booking apply; no due date may be in the past. All amounts are in EUR. Banks or payment providers may charge their own fees or currency conversion costs. A missed due date may lead to a reminder and, after reasonable notice, cancellation under applicable law and the accepted booking arrangement. Full payment is due at booking when that option is selected.

3. Travel Arrangements
Unless a booking expressly says otherwise, flights, visas, passports, travel to and from the retreat, and independent travel arrangements are not included and remain the participant's responsibility. Participants are responsible for valid travel documents and arriving at the communicated meeting point on time. Included accommodation, meals, activities, and local transport must be described in the applicable retreat itinerary.

4. Cancellations and Refunds
Cancellation must be submitted in writing to JustPrem; the effective date is the date the notice is received. For cancellations received before January 30, 2027, the booking deposit is retained and other payments received are refunded. For cancellations received January 30 through February 27, 2027, 50% of payments received beyond the deposit is refunded. From February 28, 2027 onward, payments already made are non-refundable, subject to applicable law. Future instalments not yet due are not automatically payable after cancellation unless a separate enforceable obligation applies. JustPrem will provide a transparent refund calculation and record any refund. If the retreat is cancelled by JustPrem, the participant will be informed of available refund or alternative arrangements in accordance with applicable law and the booking terms.

5. Travel and Cancellation Insurance
Participants are strongly encouraged to arrange comprehensive travel insurance covering cancellation, illness, injury, belongings, travel disruption, and retreat activities. Check that the selected policy covers the participant's itinerary and activities.

6. Health and Safety
Before booking, disclose relevant health conditions, injuries, physical limitations, allergies, and dietary requirements. Inform instructors of changes during the retreat. Participate within personal ability, follow reasonable safety instructions, and stop any activity that causes pain or distress. Natural and rural environments may include uneven terrain, weather exposure, insects, and animals. Contact a healthcare professional if unsure that an activity or journey is suitable.

7. Force Majeure
The parties will communicate promptly if circumstances outside reasonable control, including natural disasters, government restrictions, transport disruption, strikes, or other exceptional events affect the retreat. JustPrem will consider reasonable alternatives, rescheduling, and refunds in light of the circumstances and applicable law. Force majeure does not automatically make all payments non-refundable.

8. Complaints and Participant Conduct
Raise concerns with the organizer as soon as possible so there is an opportunity to address them. Participants must treat others respectfully and follow reasonable community and safety rules. The organizer may take proportionate steps to address disruptive or unsafe conduct, subject to applicable law and the circumstances.

9. Participant Responsibilities
Provide accurate booking and contact information, keep travel documents current, arrive punctually, follow communicated itinerary instructions, and cooperate with reasonable requests needed to deliver the retreat safely.

10. Changes to the Retreat
If a significant change to accommodation, schedule, activities, instructors, or other arrangements becomes necessary, JustPrem will notify participants and explain available options. Material changes and any remedy will be handled under the booking terms and applicable law.

11. Group Bookings
A person booking for a group confirms they are authorized to provide the other participants' information and communicate these terms to them. Personal information must only be provided where the booker has an appropriate legal basis.

12. Personal Property and Liability
Participants are responsible for taking reasonable care of personal belongings. Nothing in these terms excludes or limits liability that cannot lawfully be excluded or limited. Any other liability limitation is subject to applicable law.

13. Photography and Videography
Photography or video for promotional use requires a separate, optional consent where required. Agreement to these booking terms is not consent to promotional photography. Participants may contact JustPrem to state a preference or withdraw optional consent.

14. Privacy
Personal information, payment records, and signed agreements are used to administer bookings, payments, safety, and related communications, and are handled under the JustPrem Privacy Policy: https://justprem.com/privacy. Information is shared only as needed to provide the retreat, process payments, meet legal obligations, or as otherwise described in that policy.

15. Governing Law and Jurisdiction — REVIEW REQUIRED BEFORE PUBLICATION
The governing law, jurisdiction, contracting legal entity, and any consumer or package-travel disclosures must be completed after legal review of the organizer's actual legal structure and the participant's applicable rights. Do not publish this draft until those details have been reviewed and inserted.$terms$,
  'draft'
)
ON CONFLICT (pilgrimage_slug, version) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.signed_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  terms_id UUID REFERENCES public.retreat_terms(id),
  terms_version TEXT NOT NULL,
  terms_snapshot TEXT NOT NULL,
  signer_full_name TEXT NOT NULL,
  acceptance_text TEXT NOT NULL,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  agreement_reference TEXT NOT NULL UNIQUE,
  document_hash TEXT NOT NULL,
  pdf_storage_path TEXT,
  audit_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.signed_agreements ADD COLUMN IF NOT EXISTS pdf_storage_path TEXT;

-- Private PDF bucket: only server-side service-role code may upload/download.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('signed-agreements', 'signed-agreements', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf'];

-- Payment webhooks and manual reconciliation may only confirm a booking after
-- the agreement snapshot exists. This check runs inside the same DB transaction.
CREATE OR REPLACE FUNCTION public.require_signed_agreement_for_confirmation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.booking_status = 'confirmed' AND OLD.booking_status IS DISTINCT FROM 'confirmed'
     AND NOT EXISTS (SELECT 1 FROM public.signed_agreements WHERE booking_id = NEW.id) THEN
    RAISE EXCEPTION 'A signed retreat agreement is required before booking confirmation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_require_signed_agreement ON public.bookings;
CREATE TRIGGER bookings_require_signed_agreement
  BEFORE UPDATE OF booking_status ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.require_signed_agreement_for_confirmation();
REVOKE ALL ON FUNCTION public.require_signed_agreement_for_confirmation() FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS public.payment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  installment_id UUID REFERENCES public.installments(id),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_by TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  delivery_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')),
  provider_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.retreat_addon_catalog (
  slug TEXT PRIMARY KEY,
  pilgrimage_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cents BIGINT NOT NULL CHECK (price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.retreat_addon_catalog (slug, pilgrimage_slug, title, description, price_cents)
VALUES ('personal-travel-concierge', 'nepal-himalaya-2027', 'Personal Travel Concierge', 'Personalized help coordinating travel arrangements.', 13500)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.booking_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  addon_slug TEXT NOT NULL REFERENCES public.retreat_addon_catalog(slug),
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  unit_price_cents BIGINT NOT NULL CHECK (unit_price_cents >= 0),
  total_price_cents BIGINT NOT NULL CHECK (total_price_cents = unit_price_cents * quantity),
  currency TEXT NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (booking_id, addon_slug)
);

CREATE INDEX IF NOT EXISTS idx_signed_agreements_booking ON public.signed_agreements(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_booking ON public.payment_reminders(booking_id, created_at DESC);

ALTER TABLE public.retreat_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signed_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retreat_addon_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_addons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "published_retreat_terms_read" ON public.retreat_terms;
CREATE POLICY "published_retreat_terms_read" ON public.retreat_terms
  FOR SELECT TO anon, authenticated USING (status = 'published');

-- Signed records and reminder history are server-only. Access is through
-- service-role API routes after booking verification / admin authorization.
REVOKE ALL ON public.signed_agreements FROM anon, authenticated;
REVOKE ALL ON public.payment_reminders FROM anon, authenticated;
REVOKE ALL ON public.booking_addons FROM anon, authenticated;
REVOKE ALL ON public.retreat_addon_catalog FROM anon, authenticated;
REVOKE ALL ON public.retreat_terms FROM anon, authenticated;
GRANT SELECT ON public.retreat_terms TO anon, authenticated;
DROP POLICY IF EXISTS "active_retreat_addons_read" ON public.retreat_addon_catalog;
CREATE POLICY "active_retreat_addons_read" ON public.retreat_addon_catalog
  FOR SELECT TO anon, authenticated USING (active = true);
GRANT SELECT ON public.retreat_addon_catalog TO anon, authenticated;
GRANT ALL ON public.retreat_terms, public.signed_agreements, public.payment_reminders,
  public.retreat_addon_catalog, public.booking_addons TO service_role;

COMMIT;
