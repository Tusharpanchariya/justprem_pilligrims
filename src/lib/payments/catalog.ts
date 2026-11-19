// Current live Nepal retreat offer. When package pricing moves to Supabase/CMS,
// resolve this value by pilgrimage slug on the server before creating a plan.
export const DEFAULT_PACKAGE_PRICE_CENTS = 190_000;
export const DEFAULT_DEPARTURE_DATE = '2027-04-24';

export const EARLY_BIRD_DEADLINE = '2026-12-31';
export const INSTALLMENT_BOOKING_DEADLINE = '2027-01-31';
export const DEFAULT_INSTALLMENT_DUE_DATES = {
  secondDueDate: '2027-02-28',
  thirdDueDate: '2027-03-30',
};

export function isInstallmentBookingWindowOpen(bookedAt = new Date()) {
  return bookedAt.toISOString().slice(0, 10) <= INSTALLMENT_BOOKING_DEADLINE;
}

export function getRetreatPrices(bookedAt = new Date()) {
  const bookingDate = bookedAt.toISOString().slice(0, 10);
  const earlyBird = bookingDate <= EARLY_BIRD_DEADLINE;
  return earlyBird
    ? { tier: 'early_bird' as const, fullPaymentCents: 190_000, installmentTotalCents: 198_000 }
    : { tier: 'standard' as const, fullPaymentCents: 235_000, installmentTotalCents: 243_000 };
}
