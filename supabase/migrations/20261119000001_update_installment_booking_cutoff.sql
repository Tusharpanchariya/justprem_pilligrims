-- Keep the existing unsigned draft agreement aligned with the retreat's
-- January 31 installment booking cutoff. Published terms and signed snapshots
-- are intentionally left unchanged and immutable.
BEGIN;

UPDATE public.retreat_terms
SET content = replace(
  content,
  'For later bookings, the schedule and final due date shown and accepted at booking apply; no due date may be in the past.',
  'Instalment bookings are available only for bookings completed by January 31, 2027. From February 1, 2027, the full applicable price is due at booking. For eligible bookings, the three payments are EUR 660 Early Bird or EUR 810 Standard at booking, February 28, 2027, and March 30, 2027. The first payment is the non-refundable booking deposit, subject to applicable law, and forms part of the instalment total. No due date may be in the past.'
)
WHERE pilgrimage_slug = 'nepal-himalaya-2027'
  AND status = 'draft'
  AND version = 'initial-draft-2026-11';

COMMIT;
