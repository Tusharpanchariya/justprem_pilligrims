export const JUSTPREM_LEGAL_ENTITY = {
  legalName: 'VITTHAL PREM TRAVELS LLP',
  tradingBrand: 'JustPrem',
  registeredAddress: 'Registered Office in India & Operating International Offices',
  contactEmail: 'connect@justprem.shop',
  termsVersion: '2026.1',
  wiseIban: 'BE75 9059 5938 2951',
  wiseBic: 'TRWIBEB1XXX',
  wiseAccountName: 'vitthal prem travels llp',
};

export interface CancellationRefundCalculation {
  proposedRefundCents: number;
  percentageRefundable: number;
  policyClause: string;
  isFullRefund: boolean;
}

export function calculateProposedRefund(
  totalPaidCents: number,
  departureDateStr: string,
  isOrganizerCancellation: boolean = false,
  bookingDateStr?: string,
  bookingDepositCents?: number
): CancellationRefundCalculation {
  // If JustPrem / Organizer cancels: 100% full monetary refund
  if (isOrganizerCancellation) {
    return {
      proposedRefundCents: totalPaidCents,
      percentageRefundable: 100,
      policyClause: 'Clause 9.1: Organizer Cancellation Guarantee — 100% immediate monetary refund to the original payment method.',
      isFullRefund: true,
    };
  }

  // These retreat-specific dates are the agreed initial policy configuration.
  // The booking date determines the deposit tier when the actual deposit is not supplied.
  const cancellationDate = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`);
  const earlyBird = bookingDateStr ? bookingDateStr.slice(0, 10) <= '2026-12-31' : true;
  const depositCents = Math.max(0, Math.min(totalPaidCents, bookingDepositCents ?? (earlyBird ? 66_000 : 81_000)));
  const beforeJan30 = cancellationDate < new Date('2027-01-30T00:00:00.000Z');
  const beforeFeb28 = cancellationDate < new Date('2027-02-28T00:00:00.000Z');
  const paymentsBeyondDeposit = Math.max(0, totalPaidCents - depositCents);
  const refund = beforeJan30 ? paymentsBeyondDeposit : beforeFeb28 ? Math.floor(paymentsBeyondDeposit / 2) : 0;
  const percentageRefundable = totalPaidCents > 0 ? Math.floor((refund / totalPaidCents) * 100) : 0;
  return {
    proposedRefundCents: refund,
    percentageRefundable,
    policyClause: beforeJan30
      ? 'Cancellation before January 30, 2027: retain the booking deposit and refund other payments received.'
      : beforeFeb28
        ? 'Cancellation from January 30 through February 27, 2027: refund 50% of payments received beyond the booking deposit.'
        : 'Cancellation from February 28, 2027: payments already made are non-refundable, subject to applicable law.',
    isFullRefund: refund === totalPaidCents,
  };
}

export const BOOKING_AGREEMENT_SUMMARY = `
VITTHAL PREM TRAVELS LLP (Trading as JustPrem)
International Pilgrimage Booking & Scheduled Payment Terms (Version 2026.1)

1. Contractual Scope: JustPrem organizes sacred pilgrimages, retreats, and spiritual journeys. The total package price is agreed in Euros (€).
2. Scheduled Payments: Payment plans are direct, interest-free scheduled payments between the customer and JustPrem. They do not constitute a loan, consumer credit, or third-party BNPL financing.
3. Currency Conversion: Customers paying from non-EUR bank accounts (e.g., GBP, USD, CHF, NOK, SEK) will be charged in EUR; their respective financial institution applies standard exchange rates.
4. Non-Payment & Overdue Instalments: If an instalment becomes overdue, JustPrem will send notice reminders (7 days before, 3 days before, on due date, and 3 days post due date). Spots are held securely while communication remains open.
5. Cancellation & Refunds: For cancellations received before January 30, 2027, retain the booking deposit and refund other payments received. From January 30 through February 27, refund 50% of payments received beyond the deposit. From February 28, payments already made are non-refundable, subject to applicable law. Future instalments not yet due are not automatically payable after cancellation. Organizer cancellations are handled in accordance with applicable law and the signed retreat terms.
6. Customer Data & GDPR: Customer personal details are handled strictly under European General Data Protection Regulation standards and used exclusively for pilgrimage logistics and payment receipts.
`;

