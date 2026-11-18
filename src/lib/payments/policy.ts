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
  bookingDateStr?: string
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

  const now = new Date();
  const departureDate = new Date(departureDateStr);
  const diffDaysToDeparture = Math.floor((departureDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Statutory 14-day cooling off period from booking date if departure is > 30 days away
  if (bookingDateStr) {
    const bookingDate = new Date(bookingDateStr);
    const diffDaysFromBooking = Math.floor((now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDaysFromBooking <= 14 && diffDaysToDeparture > 30) {
      return {
        proposedRefundCents: totalPaidCents,
        percentageRefundable: 100,
        policyClause: 'Clause 8.1: Statutory 14-Day Cooling-off Cancellation — 100% full refund.',
        isFullRefund: true,
      };
    }
  }

  if (diffDaysToDeparture > 60) {
    const refund = Math.floor(totalPaidCents * 0.75);
    return {
      proposedRefundCents: refund,
      percentageRefundable: 75,
      policyClause: 'Clause 8.2: Early cancellation (>60 days prior to departure) — 75% refund of total payments received.',
      isFullRefund: false,
    };
  }

  if (diffDaysToDeparture >= 30) {
    const refund = Math.floor(totalPaidCents * 0.5);
    return {
      proposedRefundCents: refund,
      percentageRefundable: 50,
      policyClause: 'Clause 8.3: Standard cancellation (30–60 days prior to departure) — 50% refund of total payments received.',
      isFullRefund: false,
    };
  }

  const refund = Math.floor(totalPaidCents * 0.25);
  return {
    proposedRefundCents: refund,
    percentageRefundable: 25,
    policyClause: 'Clause 8.4: Late cancellation (<30 days prior to departure) — 25% refund, plus discretionary transfer to a future retreat.',
    isFullRefund: false,
  };
}

export const BOOKING_AGREEMENT_SUMMARY = `
VITTHAL PREM TRAVELS LLP (Trading as JustPrem)
International Pilgrimage Booking & Scheduled Payment Terms (Version 2026.1)

1. Contractual Scope: JustPrem organizes sacred pilgrimages, retreats, and spiritual journeys. The total package price is agreed in Euros (€).
2. Scheduled Payments: Payment plans are direct, interest-free scheduled payments between the customer and JustPrem. They do not constitute a loan, consumer credit, or third-party BNPL financing.
3. Currency Conversion: Customers paying from non-EUR bank accounts (e.g., GBP, USD, CHF, NOK, SEK) will be charged in EUR; their respective financial institution applies standard exchange rates.
4. Non-Payment & Overdue Instalments: If an instalment becomes overdue, JustPrem will send notice reminders (7 days before, 3 days before, on due date, and 3 days post due date). Spots are held securely while communication remains open.
5. Cancellation & Refunds: In the unforeseen event that JustPrem cancels a retreat, all customers receive a guaranteed 100% monetary refund. If a customer cancels, refund schedules apply based on the advance notice period as detailed in Clause 8.
6. Customer Data & GDPR: Customer personal details are handled strictly under European General Data Protection Regulation standards and used exclusively for pilgrimage logistics and payment receipts.
`;

