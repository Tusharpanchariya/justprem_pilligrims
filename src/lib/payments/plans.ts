import { PlanType, CalculatedPlan, CalculatedInstallment } from './types';
import { getCountryByCode } from './countries';
import { DEFAULT_DEPARTURE_DATE, DEFAULT_INSTALLMENT_DUE_DATES, DEFAULT_PACKAGE_PRICE_CENTS, isInstallmentBookingWindowOpen } from './catalog';

export function formatCentsToEuros(cents: number): string {
  const euros = cents / 100;
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(euros);
}

export function formatDateToDisplay(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function calculateDefaultDueDates(departureDateStr: string) {
  const dep = new Date(departureDateStr);
  const now = new Date();

  // 60 days before departure
  const secondDueDate = new Date(dep);
  secondDueDate.setDate(dep.getDate() - 60);

  // 30 days before departure
  const thirdDueDate = new Date(dep);
  thirdDueDate.setDate(dep.getDate() - 30);

  // If departure is in the past or too close, default to 30 days and 60 days from now
  const finalSecondDue = secondDueDate > now ? secondDueDate : new Date(now.getTime() + 30 * 86400000);
  const finalThirdDue = thirdDueDate > now ? thirdDueDate : new Date(now.getTime() + 60 * 86400000);

  return {
    secondDueDate: finalSecondDue.toISOString().split('T')[0],
    thirdDueDate: finalThirdDue.toISOString().split('T')[0],
  };
}

export interface CalculatePlansOptions {
  totalPriceCents?: number;
  installmentTotalPriceCents?: number;
  bookingDueExtraCents?: number;
  departureDate?: string;
  countryCode?: string;
  isCountryPlanEnabled?: boolean;
  approvedPlanTypes?: PlanType[];
  emergencyDisabled?: boolean;
  customDueDates?: {
    secondDueDate?: string;
    thirdDueDate?: string;
  };
}

export function calculateAllPaymentPlans(options: CalculatePlansOptions = {}): CalculatedPlan[] {
  const totalPriceCents = options.totalPriceCents ?? DEFAULT_PACKAGE_PRICE_CENTS;
  const departureDate = options.departureDate || DEFAULT_DEPARTURE_DATE;
  const countryCode = options.countryCode || 'GB';
  const country = getCountryByCode(countryCode);

  const isEnabled = options.emergencyDisabled === true ? false : true;
  const isPlanApproved = (planType: PlanType) =>
    isEnabled && (options.approvedPlanTypes ? options.approvedPlanTypes.includes(planType) : true);

  const calculatedDates = departureDate === DEFAULT_DEPARTURE_DATE
    ? DEFAULT_INSTALLMENT_DUE_DATES
    : calculateDefaultDueDates(departureDate);
  const { secondDueDate: defaultSecond, thirdDueDate: defaultThird } = calculatedDates;
  const secondDueDate = options.customDueDates?.secondDueDate || defaultSecond;
  const thirdDueDate = options.customDueDates?.thirdDueDate || defaultThird;

  const todayStr = new Date().toISOString().split('T')[0];
  const hasFutureSchedule = secondDueDate >= todayStr && thirdDueDate >= todayStr && secondDueDate < thirdDueDate;
  const withinBookingWindow = isInstallmentBookingWindowOpen();
  const installmentTotalCents = options.installmentTotalPriceCents ?? totalPriceCents;
  const bookingDueExtraCents = Math.max(0, options.bookingDueExtraCents ?? 0);
  const installmentPlanTotalCents = installmentTotalCents + bookingDueExtraCents;

  // 1. Full Payment Plan
  const fullPlan: CalculatedPlan = {
    planType: 'full',
    title: 'Full Payment',
    subtitle: 'Pay in full today. Booking confirmed immediately.',
    totalAmountCents: totalPriceCents,
    formattedTotal: formatCentsToEuros(totalPriceCents),
    initialPaymentCents: totalPriceCents,
    formattedInitial: formatCentsToEuros(totalPriceCents),
    remainingBalanceCents: 0,
    formattedRemaining: formatCentsToEuros(0),
    legallyApproved: true,
    disclaimer: 'One-time payment in full. No future instalments required.',
    installments: [
      {
        number: 1,
        label: 'Payment in Full',
        amountCents: totalPriceCents,
        formattedAmount: formatCentsToEuros(totalPriceCents),
        dueDate: todayStr,
        formattedDueDate: 'Due Today',
        isInitial: true,
      },
    ],
  };

  // 2. Two-Part Payment Plan (50% / 50%)
  const twoPartBaseInitialCents = Math.floor(installmentTotalCents / 2);
  const twoPartInitialCents = twoPartBaseInitialCents + bookingDueExtraCents;
  const twoPartSecondCents = installmentTotalCents - twoPartBaseInitialCents;
  const twoPartsPlan: CalculatedPlan = {
    planType: 'two_parts',
    title: 'Two Instalments',
    subtitle: '50% today to secure your place, remainder before departure.',
    totalAmountCents: installmentPlanTotalCents,
    formattedTotal: formatCentsToEuros(installmentPlanTotalCents),
    initialPaymentCents: twoPartInitialCents,
    formattedInitial: formatCentsToEuros(twoPartInitialCents),
    remainingBalanceCents: twoPartSecondCents,
    formattedRemaining: formatCentsToEuros(twoPartSecondCents),
    legallyApproved: isPlanApproved('two_parts') && hasFutureSchedule && withinBookingWindow,
    disclaimer:
      'Interest-free scheduled payments offered directly by JustPrem (VITTHAL PREM TRAVELS LLP). Not a loan or third-party credit product.',
    installments: [
      {
        number: 1,
        label: 'First Instalment (50%)',
        amountCents: twoPartInitialCents,
        formattedAmount: formatCentsToEuros(twoPartInitialCents),
        dueDate: todayStr,
        formattedDueDate: 'Due Today',
        isInitial: true,
      },
      {
        number: 2,
        label: 'Final Instalment (50%)',
        amountCents: twoPartSecondCents,
        formattedAmount: formatCentsToEuros(twoPartSecondCents),
        dueDate: secondDueDate,
        formattedDueDate: formatDateToDisplay(secondDueDate),
        isInitial: false,
      },
    ],
  };

  // 3. Three equal instalments; the booking deposit is the first instalment.
  const threePartBaseInitialCents = Math.floor(installmentTotalCents / 3);
  const threePartInitialCents = threePartBaseInitialCents + bookingDueExtraCents;
  const threePartSecondCents = threePartBaseInitialCents;
  const threePartThirdCents = installmentTotalCents - threePartBaseInitialCents - threePartSecondCents;

  const threePartsPlan: CalculatedPlan = {
    planType: 'three_parts',
    title: 'Three Equal Instalments',
    subtitle: 'One-third due at booking, followed by two scheduled payments.',
    totalAmountCents: installmentPlanTotalCents,
    formattedTotal: formatCentsToEuros(installmentPlanTotalCents),
    initialPaymentCents: threePartInitialCents,
    formattedInitial: formatCentsToEuros(threePartInitialCents),
    remainingBalanceCents: threePartSecondCents + threePartThirdCents,
    formattedRemaining: formatCentsToEuros(threePartSecondCents + threePartThirdCents),
    legallyApproved: isPlanApproved('three_parts') && hasFutureSchedule && withinBookingWindow,
    disclaimer:
      'Interest-free scheduled payments offered directly by JustPrem (VITTHAL PREM TRAVELS LLP). Not a loan or third-party credit product.',
    installments: [
      {
        number: 1,
        label: 'Booking Deposit (First Instalment)',
        amountCents: threePartInitialCents,
        formattedAmount: formatCentsToEuros(threePartInitialCents),
        dueDate: todayStr,
        formattedDueDate: 'Due Today',
        isInitial: true,
      },
      {
        number: 2,
        label: 'Second Instalment',
        amountCents: threePartSecondCents,
        formattedAmount: formatCentsToEuros(threePartSecondCents),
        dueDate: secondDueDate,
        formattedDueDate: formatDateToDisplay(secondDueDate),
        isInitial: false,
      },
      {
        number: 3,
        label: 'Final Instalment',
        amountCents: threePartThirdCents,
        formattedAmount: formatCentsToEuros(threePartThirdCents),
        dueDate: thirdDueDate,
        formattedDueDate: formatDateToDisplay(thirdDueDate),
        isInitial: false,
      },
    ],
  };

  return [fullPlan, twoPartsPlan, threePartsPlan];
}

export function getPlanByType(planType: PlanType, options: CalculatePlansOptions = {}): CalculatedPlan {
  const plans = calculateAllPaymentPlans(options);
  const found = plans.find((p) => p.planType === planType);
  return found || plans[0];
}

