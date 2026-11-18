'use client';

import { useState, useMemo, useEffect } from 'react';
import { Check, ChevronDown, Info } from 'lucide-react';
import { calculateAllPaymentPlans, formatCentsToEuros } from '@/lib/payments/plans';
import { getCurrencyConversionDisclosure, SUPPORTED_COUNTRIES } from '@/lib/payments/countries';
import type { CalculatedPlan, PlanType } from '@/lib/payments/types';
import { DEFAULT_DEPARTURE_DATE, DEFAULT_PACKAGE_PRICE_CENTS } from '@/lib/payments/catalog';

interface PaymentPlanSelectorProps {
  totalPriceCents?: number;
  departureDate?: string;
  selectedCountryCode?: string;
  onCountryChange?: (code: string) => void;
  selectedPlan: PlanType;
  onPlanChange: (plan: PlanType) => void;
  termsAccepted: boolean;
  onTermsAcceptedChange: (accepted: boolean) => void;
  onEligibilityChange?: (eligibility: CountryEligibility) => void;
  disabled?: boolean;
}

export interface CountryEligibility {
  approvedPlanTypes: PlanType[];
  termsVersion: string;
  termsText: string;
  cancellationPolicyVersion: string;
  cancellationPolicyText: string;
}

const PLAN_BADGES: Record<PlanType, { label: string; show: boolean }> = {
  full: { label: 'Immediate Confirmation', show: true },
  two_parts: { label: 'Most Popular', show: true },
  three_parts: { label: 'Maximum Flexibility', show: true },
};

export default function PaymentPlanSelector({
  totalPriceCents = DEFAULT_PACKAGE_PRICE_CENTS,
  departureDate = DEFAULT_DEPARTURE_DATE,
  selectedCountryCode = 'GB',
  onCountryChange,
  selectedPlan,
  onPlanChange,
  termsAccepted,
  onTermsAcceptedChange,
  onEligibilityChange,
  disabled = false,
}: PaymentPlanSelectorProps) {
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [approvedPlanTypes, setApprovedPlanTypes] = useState<PlanType[]>([]);
  const [eligibilityText, setEligibilityText] = useState<CountryEligibility>({
    approvedPlanTypes: [], termsVersion: '', termsText: '',
    cancellationPolicyVersion: '', cancellationPolicyText: '',
  });

  useEffect(() => {
    let active = true;
    setApprovedPlanTypes([]);
    fetch(`/api/payments/country-eligibility?countryCode=${encodeURIComponent(selectedCountryCode)}`)
      .then((response) => response.ok ? response.json() : { approvedPlanTypes: [] })
      .then((data) => {
        if (active && Array.isArray(data.approvedPlanTypes)) {
          const eligibility = {
            approvedPlanTypes: data.approvedPlanTypes,
            termsVersion: data.termsVersion || '',
            termsText: data.termsText || '',
            cancellationPolicyVersion: data.cancellationPolicyVersion || '',
            cancellationPolicyText: data.cancellationPolicyText || '',
          } as CountryEligibility;
          setEligibilityText(eligibility);
          setApprovedPlanTypes(eligibility.approvedPlanTypes);
          onEligibilityChange?.(eligibility);
        }
      })
      .catch(() => {
        if (active) {
          setApprovedPlanTypes([]);
          const emptyEligibility = { approvedPlanTypes: [], termsVersion: '', termsText: '', cancellationPolicyVersion: '', cancellationPolicyText: '' };
          setEligibilityText(emptyEligibility);
          onEligibilityChange?.(emptyEligibility);
        }
      });
    return () => { active = false; };
  }, [selectedCountryCode, onEligibilityChange]);

  const country = SUPPORTED_COUNTRIES.find((c) => c.code === selectedCountryCode)
    || SUPPORTED_COUNTRIES.find((c) => c.code === 'GB')!;

  const plans = useMemo(() => {
    return calculateAllPaymentPlans({
      totalPriceCents,
      departureDate,
      countryCode: selectedCountryCode,
      isCountryPlanEnabled: approvedPlanTypes.length > 0,
      approvedPlanTypes,
    });
  }, [totalPriceCents, departureDate, selectedCountryCode, approvedPlanTypes]);

  const selectedPlanDetails = plans.find((p) => p.planType === selectedPlan) || plans[0];
  const currencyDisclosure = getCurrencyConversionDisclosure(selectedCountryCode);

  const handleCountryChange = (code: string) => {
    if (onCountryChange) onCountryChange(code);
    setShowCountrySelect(false);
  };

  return (
    <div className="mt-8 border border-[#E6DCC8]/15 bg-[#0C0C0E] p-6 md:p-8">

      {/* Section Header */}
      <div className="mb-6">
        <p className="mb-1 font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-[#E6DCC8]/60">
          Payment Options
        </p>
        <h4 className="font-serif text-xl font-light text-[#F1EEE7]">
          Choose Your Payment Plan
        </h4>
        <p className="mt-1.5 font-sans text-[12px] font-light text-[#EBE7DE]/50 leading-relaxed">
          Make your pilgrimage booking easier with flexible payment options. Total pilgrimage price:{' '}
          <strong className="text-[#DFC498]">{formatCentsToEuros(totalPriceCents)}</strong>
        </p>
      </div>

      {/* Country Selection */}
      <div className="mb-6">
        <label className="mb-2 block font-sans text-[9px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/50">
          Your Country (determines plan availability)
        </label>
        <div className="relative">
          <select
            value={selectedCountryCode}
            onChange={(e) => handleCountryChange(e.target.value)}
            disabled={disabled}
            className="w-full appearance-none border border-[#E6DCC8]/20 bg-transparent py-3 pl-4 pr-10 font-sans text-[13px] font-light text-[#F1EEE7] outline-none cursor-pointer transition-colors focus:border-[#E6DCC8]/40 disabled:opacity-50"
          >
            {SUPPORTED_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#101012] text-[#F1EEE7]">
                {c.name} ({c.currency})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#E6DCC8]/50" />
        </div>
        {currencyDisclosure && (
          <div className="mt-2 flex items-start gap-2">
            <Info size={11} className="mt-0.5 shrink-0 text-[#DFC498]/70" />
            <p className="font-sans text-[10px] font-light text-[#EBE7DE]/45 leading-relaxed">
              {currencyDisclosure}
            </p>
          </div>
        )}
      </div>

      {/* Plan Cards */}
      <div className="space-y-3">
        {plans.map((plan) => {
          const isSelected = plan.planType === selectedPlan;
          const isDisabled = !plan.legallyApproved && plan.planType !== 'full';
          const badge = PLAN_BADGES[plan.planType];

          return (
            <button
              key={plan.planType}
              type="button"
              disabled={disabled || isDisabled}
              onClick={() => !isDisabled && onPlanChange(plan.planType)}
              className={`group relative w-full text-left border transition-all duration-500 p-5 ${
                isDisabled
                  ? 'border-[#E6DCC8]/08 bg-[#E6DCC8]/02 opacity-50 cursor-not-allowed'
                  : isSelected
                  ? 'border-[#DFC498]/60 bg-[#DFC498]/08 cursor-pointer'
                  : 'border-[#E6DCC8]/15 bg-transparent hover:border-[#E6DCC8]/30 hover:bg-[#E6DCC8]/04 cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Plan Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`font-sans text-[10px] font-semibold uppercase tracking-[0.22em] ${
                      isSelected ? 'text-[#DFC498]' : 'text-[#E6DCC8]/70'
                    }`}>
                      {plan.title}
                    </span>
                    {badge.show && !isDisabled && (
                      <span className={`inline-block font-sans text-[8px] uppercase tracking-[0.18em] px-2 py-0.5 ${
                        isSelected
                          ? 'bg-[#DFC498]/20 text-[#DFC498]'
                          : 'bg-[#E6DCC8]/08 text-[#E6DCC8]/50'
                      }`}>
                        {badge.label}
                      </span>
                    )}
                    {isDisabled && (
                      <span className="inline-block font-sans text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 bg-red-900/20 text-red-400/60">
                        Pending Legal Review
                      </span>
                    )}
                  </div>

                  {/* Initial Payment Prominent */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`font-serif text-2xl font-light ${
                      isSelected ? 'text-[#F1EEE7]' : 'text-[#EBE7DE]/80'
                    }`}>
                      {plan.formattedInitial}
                    </span>
                    <span className="font-sans text-[10px] text-[#EBE7DE]/40 font-light">
                      due today
                    </span>
                  </div>

                  {/* Installment Schedule */}
                  <div className="space-y-1">
                    {plan.installments.map((inst) => (
                      <div key={inst.number} className="flex items-center justify-between gap-4">
                        <span className={`font-sans text-[11px] font-light ${
                          isSelected ? 'text-[#EBE7DE]/70' : 'text-[#EBE7DE]/40'
                        }`}>
                          {inst.isInitial ? '✦ Pay today' : `✦ ${inst.formattedDueDate}`}
                        </span>
                        <span className={`font-sans text-[12px] font-medium ${
                          isSelected ? 'text-[#F1EEE7]/90' : 'text-[#EBE7DE]/50'
                        }`}>
                          {inst.formattedAmount}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Remaining Balance */}
                  {plan.remainingBalanceCents > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#E6DCC8]/08 flex items-center justify-between">
                      <span className="font-sans text-[10px] text-[#EBE7DE]/35 font-light">
                        Remaining balance
                      </span>
                      <span className={`font-sans text-[11px] font-medium ${
                        isSelected ? 'text-[#EBE7DE]/60' : 'text-[#EBE7DE]/30'
                      }`}>
                        {plan.formattedRemaining}
                      </span>
                    </div>
                  )}

                  {/* Legal disclaimer */}
                  {isSelected && plan.planType !== 'full' && !isDisabled && (
                    <p className="mt-3 font-sans text-[9px] text-[#EBE7DE]/35 leading-relaxed">
                      {plan.disclaimer}
                    </p>
                  )}
                </div>

                {/* Selection Indicator */}
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border mt-1 transition-all duration-300 ${
                  isSelected
                    ? 'border-[#DFC498] bg-[#DFC498]/20'
                    : 'border-[#E6DCC8]/20'
                }`}>
                  {isSelected && <Check size={10} strokeWidth={2.5} className="text-[#DFC498]" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Total & Legal Footer */}
      {selectedPlan !== 'full' && selectedPlanDetails.legallyApproved && (
        <div className="mt-5 border border-[#E6DCC8]/15 p-4">
          <details className="font-sans text-[11px] text-[#EBE7DE]/65">
            <summary className="cursor-pointer text-[#DFC498]">Read the approved booking terms and cancellation policy</summary>
            <h5 className="mt-4 font-medium text-[#F1EEE7]">Booking terms</h5>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed">{eligibilityText?.termsText || 'Loading approved terms…'}</p>
            <h5 className="mt-4 font-medium text-[#F1EEE7]">Cancellation and refund policy</h5>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed">{eligibilityText?.cancellationPolicyText || 'Loading approved policy…'}</p>
          </details>
          <label className="mt-4 flex cursor-pointer items-start gap-3 font-sans text-[11px] leading-relaxed text-[#EBE7DE]/70">
            <input type="checkbox" checked={termsAccepted} onChange={(event) => onTermsAcceptedChange(event.target.checked)} className="mt-0.5 accent-[#DFC498]" />
            <span>I have read and agree to the booking terms and cancellation policy shown above.</span>
          </label>
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-[#E6DCC8]/10">
        <div className="flex items-center justify-between mb-3">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#E6DCC8]/45 font-medium">
            Total Pilgrimage Price
          </span>
          <span className="font-serif text-lg font-light text-[#F1EEE7]">
            {formatCentsToEuros(totalPriceCents)}
          </span>
        </div>
        {selectedPlanDetails.remainingBalanceCents > 0 && (
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#E6DCC8]/35 font-medium">
              Balance after today
            </span>
            <span className="font-sans text-[13px] font-light text-[#EBE7DE]/55">
              {selectedPlanDetails.formattedRemaining}
            </span>
          </div>
        )}
        <p className="font-sans text-[9px] text-[#EBE7DE]/30 leading-relaxed">
          Scheduled payment options are shown only after country-specific approval. Your bank or payment provider may apply its own exchange rate when converting the EUR charge; JustPrem does not add a currency conversion charge.
        </p>
      </div>
    </div>
  );
}

