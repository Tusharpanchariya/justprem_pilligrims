'use client';

import { useEffect, useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { calculateAllPaymentPlans, formatCentsToEuros } from '@/lib/payments/plans';
import { getCountryByCode, getCurrencyConversionDisclosure, SUPPORTED_COUNTRIES } from '@/lib/payments/countries';
import type { PlanType } from '@/lib/payments/types';
import {
  DEFAULT_DEPARTURE_DATE,
  DEFAULT_INSTALLMENT_DUE_DATES,
  DEFAULT_PACKAGE_PRICE_CENTS,
  isInstallmentBookingWindowOpen,
} from '@/lib/payments/catalog';
import {
  CANCELLATION_POLICY_TEXT,
  CANCELLATION_POLICY_VERSION,
  INSTALLMENT_TERMS_TEXT,
  INSTALLMENT_TERMS_VERSION,
} from '@/lib/payments/installment-terms';

interface PaymentPlanSelectorProps {
  totalPriceCents?: number;
  installmentTotalPriceCents?: number;
  bookingDueExtraCents?: number;
  departureDate?: string;
  selectedCountryCode?: string;
  onCountryChange?: (code: string) => void;
  selectedPlan: PlanType;
  onPlanChange: (plan: PlanType) => void;
  termsAccepted: boolean;
  onTermsAcceptedChange: (accepted: boolean) => void;
  onEligibilityChange?: (eligibility: CountryEligibility) => void;
  disabled?: boolean;
  continueDisabled?: boolean;
  continueLabel?: string;
}

export interface CountryEligibility {
  approvedPlanTypes: PlanType[];
  termsVersion: string;
  termsText: string;
  cancellationPolicyVersion: string;
  cancellationPolicyText: string;
}

const DEFAULT_ELIGIBILITY: CountryEligibility = {
  approvedPlanTypes: ['two_parts', 'three_parts'],
  termsVersion: INSTALLMENT_TERMS_VERSION,
  termsText: INSTALLMENT_TERMS_TEXT,
  cancellationPolicyVersion: CANCELLATION_POLICY_VERSION,
  cancellationPolicyText: CANCELLATION_POLICY_TEXT,
};

export default function PaymentPlanSelector({
  totalPriceCents = DEFAULT_PACKAGE_PRICE_CENTS,
  installmentTotalPriceCents = totalPriceCents,
  bookingDueExtraCents = 0,
  departureDate = DEFAULT_DEPARTURE_DATE,
  selectedCountryCode = 'GB',
  onCountryChange,
  selectedPlan,
  onPlanChange,
  termsAccepted,
  onTermsAcceptedChange,
  onEligibilityChange,
  disabled = false,
  continueDisabled = false,
  continueLabel = 'Continue',
}: PaymentPlanSelectorProps) {
  const [approvedPlanTypes, setApprovedPlanTypes] = useState<PlanType[]>(['two_parts', 'three_parts']);
  const [eligibility, setEligibility] = useState<CountryEligibility>(DEFAULT_ELIGIBILITY);
  const [eligibilityLoaded, setEligibilityLoaded] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`/api/payments/country-eligibility?countryCode=${encodeURIComponent(selectedCountryCode)}`)
      .then(async (response) => {
        const type = response.headers.get('content-type') || '';
        if (!type.includes('application/json')) throw new Error('Could not load payment eligibility.');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load payment eligibility.');
        if (!active) return;
        const plansList: PlanType[] =
          Array.isArray(data.approvedPlanTypes) && data.approvedPlanTypes.length > 0
            ? data.approvedPlanTypes
            : ['two_parts', 'three_parts'];
        const next: CountryEligibility = {
          approvedPlanTypes: plansList,
          termsVersion: data.termsVersion || INSTALLMENT_TERMS_VERSION,
          termsText: data.termsText || INSTALLMENT_TERMS_TEXT,
          cancellationPolicyVersion: data.cancellationPolicyVersion || CANCELLATION_POLICY_VERSION,
          cancellationPolicyText: data.cancellationPolicyText || CANCELLATION_POLICY_TEXT,
        };
        setEligibility(next);
        setApprovedPlanTypes(plansList);
        setEligibilityLoaded(true);
        onEligibilityChange?.(next);
      })
      .catch(() => {
        if (!active) return;
        setEligibility(DEFAULT_ELIGIBILITY);
        setApprovedPlanTypes(DEFAULT_ELIGIBILITY.approvedPlanTypes);
        setEligibilityLoaded(true);
        onEligibilityChange?.(DEFAULT_ELIGIBILITY);
      });
    return () => {
      active = false;
    };
  }, [selectedCountryCode, onEligibilityChange]);

  const plans = useMemo(
    () =>
      calculateAllPaymentPlans({
        totalPriceCents,
        installmentTotalPriceCents,
        bookingDueExtraCents,
        departureDate,
        countryCode: selectedCountryCode,
        isCountryPlanEnabled: true,
        approvedPlanTypes: approvedPlanTypes.length > 0 ? approvedPlanTypes : ['two_parts', 'three_parts'],
        customDueDates: departureDate === DEFAULT_DEPARTURE_DATE ? DEFAULT_INSTALLMENT_DUE_DATES : undefined,
      }),
    [
      totalPriceCents,
      installmentTotalPriceCents,
      bookingDueExtraCents,
      departureDate,
      selectedCountryCode,
      approvedPlanTypes,
    ]
  );

  const preferredInstallmentPlan =
    plans.find((plan) => plan.planType === 'three_parts') ||
    plans.find((plan) => plan.planType === 'two_parts') ||
    plans[0];
  const installmentPlan =
    plans.find((plan) => plan.planType === selectedPlan && plan.planType !== 'full') ||
    preferredInstallmentPlan;

  const withinBookingWindow = isInstallmentBookingWindowOpen();
  // Installments are available for all countries as long as we are within the booking window
  const installmentAvailable = withinBookingWindow;
  const isInstallmentSelected = selectedPlan !== 'full';
  const selectedDetails = isInstallmentSelected ? installmentPlan : plans[0];
  const country = getCountryByCode(selectedCountryCode);
  const currencyDisclosure = getCurrencyConversionDisclosure(selectedCountryCode);
  const remainingInstallments = installmentPlan.installments.filter((item) => !item.isInitial);
  const ordinal = (value: number) => (value === 2 ? '2nd' : value === 3 ? 'Final' : `${value}th`);

  const choosePlan = (plan: PlanType) => {
    if (plan !== selectedPlan) onTermsAcceptedChange(false);
    onPlanChange(plan);
  };

  return (
    <section className="overflow-hidden border border-[#E6DCC8]/20 bg-[#141416] text-[#F1EEE7]">
      <div className="border-b border-[#E6DCC8]/15 px-5 py-4">
        <h3 className="text-base font-medium">Payment Options</h3>
      </div>
      <div className="px-5 py-4">
        <label
          className={`flex cursor-pointer items-center justify-between gap-4 ${
            !installmentAvailable ? 'cursor-not-allowed opacity-60' : ''
          }`}
        >
          <span className="flex items-center gap-3 font-semibold">
            <input
              type="radio"
              name="payment-plan"
              checked={isInstallmentSelected}
              disabled={disabled || !installmentAvailable}
              onChange={() => choosePlan(installmentPlan.planType)}
              className="h-5 w-5 accent-[#159f78]"
            />
            Pay amount due
          </span>
          <span className="font-semibold">{installmentPlan.formattedInitial}</span>
        </label>

        <div className="ml-8 mt-4 space-y-3 text-[13px] text-[#EBE7DE]/80">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
            <span>Deposit (1st instalment)</span>
            <span>Due at booking</span>
            <strong>
              {formatCentsToEuros(installmentPlan.installments[0].amountCents - bookingDueExtraCents)}
            </strong>
          </div>
          {bookingDueExtraCents > 0 && (
            <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
              <span>Selected add-ons</span>
              <span>Due at booking</span>
              <strong>{formatCentsToEuros(bookingDueExtraCents)}</strong>
            </div>
          )}
          {remainingInstallments.map((item) => (
            <div key={item.number} className="grid grid-cols-[1fr_1fr_auto] gap-3">
              <span>{ordinal(item.number)} payment</span>
              <span>{item.formattedDueDate}</span>
              <strong>{item.formattedAmount}</strong>
            </div>
          ))}
          <p className="pt-1 text-xs text-[#EBE7DE]/50">
            The deposit is the first instalment, not an extra charge. Selected add-ons are due at booking. Pay
            future instalments manually by their due dates; we do not automatically charge your payment method.
          </p>
        </div>

        {!installmentAvailable && !withinBookingWindow && (
          <p className="ml-8 mt-3 text-xs text-amber-200/70">
            Installments are available for bookings through January 31, 2027. Choose full payment after this
            date.
          </p>
        )}

        {currencyDisclosure && (
          <p className="ml-8 mt-2 flex items-start gap-2 text-[11px] text-[#EBE7DE]/50">
            <Info size={13} className="mt-0.5 shrink-0" />
            {currencyDisclosure}
          </p>
        )}
      </div>

      <div className="border-t border-[#E6DCC8]/15 px-5 py-4">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span className="flex items-center gap-3 font-semibold">
            <input
              type="radio"
              name="payment-plan"
              checked={!isInstallmentSelected}
              disabled={disabled}
              onChange={() => choosePlan('full')}
              className="h-5 w-5 accent-[#159f78]"
            />
            Pay full amount
          </span>
          <span className="font-semibold">{formatCentsToEuros(totalPriceCents)}</span>
        </label>
      </div>

      <details className="border-t border-[#E6DCC8]/15 px-5 py-3">
        <summary className="cursor-pointer text-xs text-[#EBE7DE]/50">
          Payment country and approved instalment terms
        </summary>
        <label className="mt-3 block text-xs text-[#EBE7DE]/70">
          Country or region
          <select
            value={selectedCountryCode}
            onChange={(event) => onCountryChange?.(event.target.value)}
            disabled={disabled}
            className="mt-1 block w-full border border-[#E6DCC8]/20 bg-[#101012] px-3 py-2 text-sm text-[#F1EEE7]"
          >
            {SUPPORTED_COUNTRIES.map((item) => (
              <option key={item.code} value={item.code} className="bg-[#101012] text-[#F1EEE7]">
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </details>

      {isInstallmentSelected && installmentAvailable && (
        <div className="space-y-3 border-t border-[#E6DCC8]/15 px-5 py-3">
          <details className="text-xs text-[#EBE7DE]/70">
            <summary className="cursor-pointer">Read approved instalment and cancellation terms</summary>
            <p className="mt-2 whitespace-pre-wrap">{eligibility.termsText}</p>
            <p className="mt-2 whitespace-pre-wrap">{eligibility.cancellationPolicyText}</p>
          </details>
          <label className="flex items-start gap-2 text-xs text-[#EBE7DE]/80">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => onTermsAcceptedChange(event.target.checked)}
              className="mt-0.5 accent-emerald-500"
            />
            <span>I have read and agree to the approved instalment and cancellation terms.</span>
          </label>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-[#E6DCC8]/15 bg-[#101012] px-5 py-3 text-sm">
        <span className="text-[#EBE7DE]/60">
          {isInstallmentSelected ? 'Instalment plan total' : 'Total due today'}
        </span>
        <strong className="text-[#F1EEE7]">{selectedDetails.formattedTotal}</strong>
      </div>
      <div className="border-t border-[#E6DCC8]/15 px-5 py-4">
        <button
          type="submit"
          disabled={disabled || continueDisabled}
          className="flex h-12 w-full items-center justify-center bg-[#0eaa78] text-sm font-semibold text-white transition-colors hover:bg-[#07996b] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {continueLabel}
        </button>
      </div>
    </section>
  );
}
