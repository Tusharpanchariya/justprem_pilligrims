import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { X, Check, Loader2, ArrowRight, ChevronDown } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { countries } from '@/lib/countries';
import PaymentPlanSelector from '@/components/payments/PaymentPlanSelector';
import type { PlanType } from '@/lib/payments/types';
import { calculateAllPaymentPlans } from '@/lib/payments/plans';
import { DEFAULT_DEPARTURE_DATE, DEFAULT_INSTALLMENT_DUE_DATES, getRetreatPrices, isInstallmentBookingWindowOpen } from '@/lib/payments/catalog';
import { SUPPORTED_COUNTRIES } from '@/lib/payments/countries';
import type { CountryEligibility } from '@/components/payments/PaymentPlanSelector';
import { INITIAL_RETREAT_TERMS } from '@/lib/payments/initial-terms';
import AgreementReader from '@/components/payments/AgreementReader';

type PaymentMethod = 'paypal' | 'wise';

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ open, onClose }: EnquiryModalProps) {
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dialCode, setDialCode] = useState('+44');
  const [country, setCountry] = useState('United Kingdom');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
  const [paymentPlan, setPaymentPlan] = useState<PlanType>('full');
  const [countryCode, setCountryCode] = useState('GB');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [eligibility, setEligibility] = useState<CountryEligibility | null>(null);
  const [bookingId, setBookingId] = useState('');
  const [installmentId, setInstallmentId] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [step, setStep] = useState(1);
  const [signerFullName, setSignerFullName] = useState('');
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [agreementContent, setAgreementContent] = useState('');
  const [agreementVersion, setAgreementVersion] = useState('');
  const [agreementLoadError, setAgreementLoadError] = useState('');
  const [agreementPreviewOnly, setAgreementPreviewOnly] = useState(false);
  const [agreementDialogOpen, setAgreementDialogOpen] = useState(false);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [signedInPreview, setSignedInPreview] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'payment-method' | 'paypal-checkout' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetch('/api/agreements?slug=nepal-himalaya-2027').then(async (response) => {
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) throw new Error('Agreement service is unavailable. Showing the local draft for review.');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The retreat agreement is not available.');
      if (active) { setAgreementContent(data.agreement.content); setAgreementVersion(data.agreement.version); setAgreementLoadError(''); setAgreementPreviewOnly(false); }
    }).catch(() => {
      if (active) {
        setAgreementContent(INITIAL_RETREAT_TERMS);
        setAgreementVersion('1.0');
        setAgreementLoadError('');
        setAgreementPreviewOnly(false);
      }
    });
    return () => { active = false; };
  }, [open]);

  const resetForm = () => {
    setName('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setConfirmEmail('');
    setPhone('');
    setDialCode('+44');
    setCountry('United Kingdom');
    setPaymentMethod('paypal');
    setPaymentPlan('full');
    setCountryCode('GB');
    setTermsAccepted(false);
    setEligibility(null);
    setBookingId('');
    setInstallmentId('');
    setBookingReference('');
    setStep(1);
    setSignerFullName('');
    setAgreementAccepted(false);
    setAgreementContent('');
    setAgreementVersion('');
    setAgreementLoadError('');
    setAgreementPreviewOnly(false);
    setAgreementDialogOpen(false);
    setAgreementSigned(false);
    setSignedInPreview(false);
    setStatus('idle');
    setErrorMsg('');
  };

  const selectedPlan = calculateAllPaymentPlans({
    totalPriceCents: getRetreatPrices().fullPaymentCents,
    installmentTotalPriceCents: getRetreatPrices().installmentTotalCents,
    countryCode,
    customDueDates: DEFAULT_INSTALLMENT_DUE_DATES,
  }).find((plan) => plan.planType === paymentPlan)!;

  const handleEligibilityChange = useCallback((next: CountryEligibility) => {
    setEligibility(next);
    setTermsAccepted(false);
    setPaymentPlan((current) => {
      if (current !== 'full' || !isInstallmentBookingWindowOpen()) return current;
      if (next.approvedPlanTypes.includes('three_parts')) return 'three_parts';
      if (next.approvedPlanTypes.includes('two_parts')) return 'two_parts';
      return current;
    });
  }, []);

  const handleClose = () => {
    if (status === 'success') resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    if (step === 1) { setStep(2); return; }

    const travelerName = `${firstName} ${lastName}`.trim().replace(/\s+/g, ' ');
    if (!travelerName || !email.trim() || !phone.trim() || !country.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (step === 2 && email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setStatus('error'); setErrorMsg('Email addresses do not match.'); return;
    }

    if (step === 2) {
      if (!agreementContent || !agreementAccepted || !agreementSigned || signerFullName.trim().replace(/\s+/g, ' ').toLowerCase() !== travelerName.toLowerCase()) {
        setStatus('error');
        setErrorMsg(agreementLoadError || 'Read the agreement, type your full name exactly as entered above, and confirm electronic signing.');
        return;
      }
      setName(travelerName);
      setStatus('idle');
      setStep(3);
      return;
    }

    if (step === 4) {
      setStatus(paymentMethod === 'paypal' ? 'paypal-checkout' : 'success');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/payments/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: (name || `${firstName} ${lastName}`).trim(),
          email: email.trim(),
          phone: `${dialCode} ${phone.trim()}`,
          countryCode,
          planType: paymentPlan,
          termsAccepted,
          acceptedTermsVersion: eligibility?.termsVersion,
          acceptedCancellationPolicyVersion: eligibility?.cancellationPolicyVersion,
          signerFullName,
          agreementAccepted,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data?.error || 'Something went wrong. Please try again.');
        return;
      }

      setBookingId(data.bookingId || '');
      setBookingReference(data.bookingReference || '');
      setInstallmentId(data.planDetails?.installmentId || '');
      setStep(4);
      setStatus('payment-method');
    } catch (err) {
      console.error('Enquiry request error:', err);
      setStatus('error');
      setErrorMsg('We could not save your booking. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-near-black/80 backdrop-blur-sm p-4 md:p-6"
      onClick={handleClose}
    >
      <div
        className="relative my-auto w-full max-w-6xl border border-[#E6DCC8]/20 bg-gradient-to-b from-[#101012] to-near-black p-6 shadow-2xl md:p-10 lg:pr-[390px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner accents */}
        <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-[#E6DCC8]/30" />
        <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-[#E6DCC8]/30" />
        <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-[#E6DCC8]/30" />
        <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-[#E6DCC8]/30" />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 text-[#EBE7DE]/50 transition-colors hover:text-[#F1EEE7]"
          aria-label="Close form"
        >
          <X size={20} strokeWidth={1} />
        </button>

        {status !== 'paypal-checkout' && status !== 'success' && <aside className="mb-8 border border-[#E6DCC8]/15 bg-[#141416] p-5 text-left lg:absolute lg:right-10 lg:top-24 lg:mb-0 lg:w-[340px]">
          <h3 className="mb-4 font-sans text-xs font-medium text-[#F1EEE7]">Your Booking</h3>
          <p className="border-b border-[#E6DCC8]/10 pb-3 text-[12px] text-[#EBE7DE]/70">Heart of the Himalayas · Apr 2027</p>
          <div className="mt-4 flex justify-between text-[12px]"><span className="text-[#EBE7DE]/60">Retreat total</span><span className="text-[#F1EEE7]">{selectedPlan.formattedTotal}</span></div>
          <div className="mt-3 flex justify-between border-t border-[#E6DCC8]/10 pt-3 text-[12px]"><span className="font-medium text-[#F1EEE7]">Due at booking</span><span className="font-medium text-[#F1EEE7]">{selectedPlan.formattedInitial}</span></div>
          {selectedPlan.remainingBalanceCents > 0 && <div className="mt-2 flex justify-between text-[11px]"><span className="text-[#EBE7DE]/50">Remaining balance</span><span className="text-[#EBE7DE]/70">{selectedPlan.formattedRemaining}</span></div>}
          {bookingReference && <p className="mt-4 border-t border-[#E6DCC8]/10 pt-3 font-mono text-[10px] text-[#DFC498]">{bookingReference}</p>}
        </aside>}

        {status === 'paypal-checkout' ? (
          <div className="py-6 text-center">
            <h3 className="mb-3 font-serif text-3xl font-medium tracking-[-0.02em] text-[#F1EEE7]">
              {`Pay ${selectedPlan.formattedInitial} today`}
            </h3>
            <p className="mb-6 font-sans text-[13px] md:text-[14px] font-light leading-[1.6] text-[#EBE7DE]/70 max-w-sm mx-auto">
              {`Your details have been saved. The total pilgrimage price is ${selectedPlan.formattedTotal}.`}
            </p>

            <div className="relative z-50 min-h-[150px]">
              <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: "EUR" }}>
                <PayPalButtons
                  key={paymentPlan}
                  style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                  createOrder={async () => {
                    const response = await fetch('/api/payments/create-paypal-order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ bookingId, installmentId }),
                    });
                    const order = await response.json();
                    if (!response.ok || !order.orderId) throw new Error(order.error || 'Unable to start PayPal checkout');
                    return order.orderId;
                  }}
                  onApprove={async (data) => {
                    const response = await fetch('/api/payments/capture-paypal-order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ orderId: data.orderID }),
                    });
                    const result = await response.json();
                    if (!response.ok || !result.success) {
                      setStatus('error');
                      setErrorMsg(result.error || 'Payment verification failed. Contact support before retrying.');
                      return;
                    }
                    setStatus('success');
                  }}
                  onError={(error) => {
                    console.error('PayPal checkout error:', error);
                    setStatus('error');
                    setErrorMsg('PayPal could not complete this payment. Please try again or choose Wise transfer.');
                  }}
                />
              </PayPalScriptProvider>
            </div>

            <button
              onClick={handleClose}
              className="mt-8 font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#EBE7DE]/60 transition-colors hover:text-[#F1EEE7]"
            >
              Cancel Payment
            </button>
          </div>
        ) : status === 'success' ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#E6DCC8]/30">
              <Check size={24} strokeWidth={1} className="text-[#E6DCC8]" />
            </div>

            {paymentMethod === 'wise' ? (
              <>
                <h3 className="mb-4 font-serif text-3xl font-medium tracking-[-0.02em] text-[#F1EEE7]">
                  Enquiry Received
                </h3>
                <p className="mb-8 font-sans text-[14px] font-light leading-[1.6] text-[#EBE7DE]/70">
                  Thank you, {name.split(' ')[0] || 'traveler'}. Your booking {bookingReference} is saved. The bank transfer will remain pending until our team verifies it.
                </p>

                <div className="mt-8 text-left border border-[#E6DCC8]/20 bg-[#141416] p-6 shadow-inner">
                  <h4 className="font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/80 mb-5">Wise Transfer Details</h4>

                  <div className="space-y-4 font-sans text-[13px] font-light text-[#F1EEE7]">
                    <div className="flex justify-between items-center border-b border-[#E6DCC8]/10 pb-3">
                      <span className="text-[#EBE7DE]/50">Account Name</span>
                      <span className="font-medium text-right">vitthal prem travels llp</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#E6DCC8]/10 pb-3">
                      <span className="text-[#EBE7DE]/50">IBAN</span>
                      <span className="font-medium text-right">BE75 9059 5938 2951</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#E6DCC8]/10 pb-3">
                      <span className="text-[#EBE7DE]/50">Swift/BIC</span>
                      <span className="font-medium text-right">TRWIBEB1XXX</span>
                    </div>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-[#EBE7DE]/50">Amount</span>
                      <span className="font-medium text-right">
                        {selectedPlan.formattedInitial}
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 font-sans text-[10px] text-[#EBE7DE]/40 leading-[1.6] text-center border-t border-[#E6DCC8]/10 pt-4">
                    Important: Please transfer {selectedPlan.formattedInitial} and use "{bookingReference}-P1" as the transfer reference so we can match your payment.
                  </p>
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-4 font-serif text-3xl font-medium tracking-[-0.02em] text-[#F1EEE7]">
                  Payment Successful
                </h3>
                <p className="mb-4 font-sans text-[14px] font-light leading-[1.6] text-[#EBE7DE]/70">
                  Thank you, {name.split(' ')[0] || 'traveler'}. PayPal confirmed your first payment for booking {bookingReference}. We will contact you shortly with preparation details.
                </p>
              </>
            )}

            <button
              onClick={handleClose}
              className="mt-10 font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#EBE7DE]/60 transition-colors hover:text-[#F1EEE7]"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 font-sans text-[10px] md:text-[11px] font-medium uppercase tracking-[0.28em] text-[#E6DCC8]/75">
              Begin Your Retreat
            </p>
            <h3 className="mb-4 font-serif text-3xl md:text-4xl font-medium tracking-[-0.025em] text-[#F1EEE7]">
              {['Select Package', 'Traveler Info', 'Add-ons', 'Payment'][step - 1]}
            </h3>
            <p className="mb-10 font-sans text-[13px] md:text-[14px] font-light leading-[1.6] text-[#EBE7DE]/70">
              Complete your booking in four simple steps.
            </p>

            <nav aria-label="Booking progress" className="mb-8 grid grid-cols-4 border-y border-[#E6DCC8]/15 py-3">
              {['Package', 'Traveler info', 'Add-ons', 'Payment'].map((label, index) => <button key={label} type="button" onClick={() => { if (index + 1 < step && status !== 'submitting') setStep(index + 1); }} className={`text-center font-sans text-[9px] uppercase tracking-[0.12em] ${step === index + 1 ? 'font-semibold text-[#DFC498]' : step > index + 1 ? 'text-emerald-400' : 'text-[#EBE7DE]/35'}`}>{index + 1}. {label}</button>)}
            </nav>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && <section className="border border-[#E6DCC8]/25 bg-[#141416] p-5 text-left">
                <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#E6DCC8]/60">Select your retreat</p>
                <div className="flex items-start justify-between gap-4"><div><h4 className="font-serif text-xl text-[#F1EEE7]">Heart of the Himalayas</h4><p className="mt-2 text-[12px] leading-relaxed text-[#EBE7DE]/60">A Himalayan journey with guided experiences, accommodation, and retreat activities as described in the itinerary.</p></div><span className="whitespace-nowrap font-serif text-lg text-[#F1EEE7]">{selectedPlan.formattedTotal}</span></div>
                <p className="mt-4 border-t border-[#E6DCC8]/10 pt-3 text-[11px] text-[#EBE7DE]/45">11 nights · 12 days · April 2027 · EUR</p>
              </section>}
              {/* Name */}
              <div hidden={step !== 2} className="grid grid-cols-2 gap-4">
                <label htmlFor="enq-first-name" className="block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60">First Name
                  <input id="enq-first-name" type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); setAgreementSigned(false); setAgreementAccepted(false); }} className="mt-2 w-full border-b border-[#E6DCC8]/20 bg-transparent py-3 font-sans text-[14px] font-light normal-case tracking-normal text-[#F1EEE7] placeholder-[#EBE7DE]/30 outline-none focus:border-[#E6DCC8]/60" placeholder="First name" autoComplete="given-name" />
                </label>
                <label htmlFor="enq-last-name" className="block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60">Last Name
                  <input id="enq-last-name" type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); setAgreementSigned(false); setAgreementAccepted(false); }} className="mt-2 w-full border-b border-[#E6DCC8]/20 bg-transparent py-3 font-sans text-[14px] font-light normal-case tracking-normal text-[#F1EEE7] placeholder-[#EBE7DE]/30 outline-none focus:border-[#E6DCC8]/60" placeholder="Last name" autoComplete="family-name" />
                </label>
              </div>

              {/* Email */}
              <div hidden={step !== 2}>
                <label
                  htmlFor="enq-email"
                  className="mb-2 block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60"
                >
                  Email
                </label>
                <input
                  id="enq-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-[#E6DCC8]/20 bg-transparent py-3 font-sans text-[14px] font-light text-[#F1EEE7] placeholder-[#EBE7DE]/30 outline-none transition-colors focus:border-[#E6DCC8]/60"
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>

              {/* Phone */}
              <div hidden={step !== 2}>
                <label
                  htmlFor="enq-phone"
                  className="mb-2 block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60"
                >
                  Phone Number
                </label>
                <div className="flex items-end gap-3">
                  <div className="relative w-[100px] border-b border-[#E6DCC8]/20 transition-colors focus-within:border-[#E6DCC8]/60">
                  <select
                      value={dialCode}
                      onChange={(e) => setDialCode(e.target.value)}
                      className="w-full appearance-none bg-transparent py-3 pl-2 pr-6 font-sans text-[14px] font-light text-[#F1EEE7] outline-none cursor-pointer"
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.dialCode} className="bg-[#101012] text-[#F1EEE7]">
                          {c.code} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#E6DCC8]/60" />
                  </div>
                  <div className="flex-1 border-b border-[#E6DCC8]/20 transition-colors focus-within:border-[#E6DCC8]/60">
                    <input
                      id="enq-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent py-3 font-sans text-[14px] font-light text-[#F1EEE7] placeholder-[#EBE7DE]/30 outline-none"
                      placeholder="123 456 7890"
                      autoComplete="tel-national"
                    />
                  </div>
                </div>
              </div>

              <div hidden={step !== 2}>
                <label htmlFor="enq-confirm-email" className="mb-2 block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60">Confirm Email</label>
                <input id="enq-confirm-email" type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} className="w-full border-b border-[#E6DCC8]/20 bg-transparent py-3 font-sans text-[14px] font-light text-[#F1EEE7] placeholder-[#EBE7DE]/30 outline-none focus:border-[#E6DCC8]/60" placeholder="Re-enter your email" autoComplete="email" />
              </div>

              {/* Country */}
              <div hidden={step !== 2}>
                <label
                  htmlFor="enq-country"
                  className="mb-2 block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60"
                >
                  Country
                </label>
                <div className="relative border-b border-[#E6DCC8]/20 transition-colors focus-within:border-[#E6DCC8]/60">
                    <select
                    id="enq-country"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setCountryCode(countries.find((c) => c.name === e.target.value)?.code || 'OTHER');
                    }}
                    className="w-full appearance-none bg-transparent py-3 pl-2 pr-10 font-sans text-[14px] font-light text-[#F1EEE7] outline-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#101012] text-[#EBE7DE]/30">Select your country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.name} className="bg-[#101012] text-[#F1EEE7]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#E6DCC8]/60" />
                </div>
              </div>

              {step === 2 && <section className="flex flex-wrap items-center justify-between gap-4 border-y border-[#E6DCC8]/15 py-5 text-left">
                <p className="max-w-md text-[13px] leading-relaxed text-[#F1EEE7]">Please read and sign the document before proceeding to complete your booking.</p>
                <button type="button" onClick={() => setAgreementDialogOpen(true)} className={`rounded border px-4 py-3 text-[13px] font-medium ${agreementSigned ? 'border-emerald-500/30 bg-emerald-900/10 text-emerald-300' : 'border-[#E6DCC8]/25 text-[#F1EEE7] hover:border-[#E6DCC8]/50'}`}>{agreementSigned ? 'View Signed Document' : 'Sign Document'} <span className="text-red-400">*</span></button>
                {agreementSigned && <div className="w-full rounded bg-emerald-900/15 px-3 py-2 text-[12px] text-emerald-300">Document signed</div>}
              </section>}
              <AgreementReader open={step === 2 && agreementDialogOpen} initialName={signerFullName || `${firstName} ${lastName}`.trim()} onCancel={() => setAgreementDialogOpen(false)} onSigned={(signedName, previewOnly) => { setSignerFullName(signedName); setAgreementAccepted(true); setAgreementSigned(true); setSignedInPreview(previewOnly); setAgreementDialogOpen(false); }} />
              {step === 3 && <PaymentPlanSelector
                totalPriceCents={getRetreatPrices().fullPaymentCents}
                installmentTotalPriceCents={getRetreatPrices().installmentTotalCents}
                departureDate={DEFAULT_DEPARTURE_DATE}
                selectedCountryCode={countryCode}
                onCountryChange={(code) => {
                  setCountryCode(code);
                  const selectedCountry = countries.find((item) => item.code === code)
                    || SUPPORTED_COUNTRIES.find((item) => item.code === code);
                  if (selectedCountry) setCountry(selectedCountry.name);
                }}
                selectedPlan={paymentPlan}
                onPlanChange={setPaymentPlan}
                termsAccepted={termsAccepted}
                onTermsAcceptedChange={setTermsAccepted}
                onEligibilityChange={handleEligibilityChange}
                continueDisabled={status === 'submitting' || (paymentPlan !== 'full' && !termsAccepted)}
                continueLabel={status === 'submitting' ? 'Saving booking…' : 'Continue'}
              />}

              {/* Payment method */}
              {step === 4 && <div className="pt-2">
                <label className="mb-4 block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60">
                  Preferred Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex items-center justify-center border h-[52px] transition-colors duration-500 ${paymentMethod === 'paypal'
                        ? 'border-[#E6DCC8]/40 bg-[#E6DCC8]/10 text-[#F1EEE7]'
                        : 'border-[#E6DCC8]/15 bg-transparent text-[#EBE7DE]/50 hover:bg-white/5 hover:text-[#EBE7DE]/80'
                      }`}
                  >
                    <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase">
                      PayPal
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wise')}
                    className={`flex items-center justify-center border h-[52px] transition-colors duration-500 ${paymentMethod === 'wise'
                        ? 'border-[#E6DCC8]/40 bg-[#E6DCC8]/10 text-[#F1EEE7]'
                        : 'border-[#E6DCC8]/15 bg-transparent text-[#EBE7DE]/50 hover:bg-white/5 hover:text-[#EBE7DE]/80'
                      }`}
                  >
                    <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase">
                      Wise
                    </span>
                  </button>
                </div>
              </div>}

              {/* Error */}
              {status === 'error' && (
                <p className="pt-2 text-[12px] font-light text-red-400">{errorMsg}</p>
              )}

              {/* Submit */}
              {step !== 3 && <button
                type="submit"
                disabled={status === 'submitting' || (step === 2 && (!agreementAccepted || !agreementSigned)) || (step === 3 && paymentPlan !== 'full' && !termsAccepted)}
                className={`group mt-6 flex h-[52px] w-full items-center justify-center gap-3 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${step >= 3 ? 'rounded-md border border-[#0eaa78] bg-[#0eaa78] text-white hover:bg-[#07996b]' : 'border border-[#E6DCC8]/30 bg-transparent hover:border-[#E6DCC8]/60'}`}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={16} strokeWidth={1.2} className="animate-spin text-[#F1EEE7]" />
                    <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#F1EEE7]">
                      Submitting
                    </span>
                  </>
                ) : (
                  <>
                    <span className={`font-sans text-[10px] md:text-[11px] font-medium tracking-[0.12em] ${step >= 3 ? '' : 'uppercase text-[#F1EEE7]'}`}>
                      {step === 1 ? 'Continue to Traveler Info' : step === 2 ? 'Continue to Add-ons' : step === 3 ? 'Continue' : paymentMethod === 'paypal' ? 'Continue to PayPal' : 'Show Bank Transfer Details'}
                    </span>
                    <ArrowRight
                      size={14}
                      strokeWidth={1}
                      className={`transition-transform duration-300 group-hover:translate-x-1 ${step >= 3 ? 'text-white' : 'text-[#E6DCC8]/70'}`}
                    />
                  </>
                )}
              </button>}

              {step === 4 && <p className="pt-4 text-center font-sans text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-[#EBE7DE]/40">
                {paymentMethod === 'paypal'
                  ? 'Complete your payment instantly via PayPal after applying'
                  : 'You will receive Wise bank details upon applying'}
              </p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
