'use client';

import { useState } from 'react';
import { Check, Clock, AlertTriangle, ChevronDown, ChevronUp, ArrowRight, Loader2, X } from 'lucide-react';

interface Installment {
  id: string;
  installment_number: number;
  amount_cents: number;
  currency: string;
  due_date: string;
  status: 'paid' | 'pending_verification' | 'upcoming' | 'overdue' | 'failed';
  paid_at?: string;
}

interface BookingData {
  id: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  pilgrimageTitle: string;
  departureDate: string;
  totalPriceCents: number;
  bookingStatus: string;
  createdAt: string;
}

interface PlanData {
  planType: string;
  totalAmountCents: number;
  outstandingAmountCents: number;
  status: string;
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    paid: { label: 'Paid', className: 'border-emerald-500/40 text-emerald-400 bg-emerald-900/20', icon: <Check size={11} /> },
    pending_verification: { label: 'Pending Verification', className: 'border-amber-500/40 text-amber-400 bg-amber-900/20', icon: <Clock size={11} /> },
    upcoming: { label: 'Upcoming', className: 'border-[#E6DCC8]/30 text-[#E6DCC8] bg-[#E6DCC8]/5', icon: <Clock size={11} /> },
    overdue: { label: 'Overdue', className: 'border-red-500/40 text-red-400 bg-red-900/20', icon: <AlertTriangle size={11} /> },
    confirmed: { label: 'Confirmed', className: 'border-emerald-500/40 text-emerald-400 bg-emerald-900/20', icon: <Check size={11} /> },
    pending: { label: 'Pending', className: 'border-amber-500/40 text-amber-400 bg-amber-900/20', icon: <Clock size={11} /> },
    cancellation_requested: { label: 'Cancellation Requested', className: 'border-red-500/40 text-red-400 bg-red-900/20', icon: <AlertTriangle size={11} /> },
  };
  const cfg = configs[status] || { label: status, className: 'border-[#E6DCC8]/20 text-[#EBE7DE]/60', icon: null };
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] ${cfg.className}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function PlanTypeLabel({ planType }: { planType: string }) {
  const labels: Record<string, string> = {
    full: 'Full Payment',
    two_parts: 'Two Instalments',
    three_parts: 'Three Instalments',
  };
  return <>{labels[planType] || planType}</>;
}

export default function MyBookingPage() {
  const [ref, setRef] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [showWiseDetails, setShowWiseDetails] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelStatus, setCancelStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [cancelMsg, setCancelMsg] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim() || !email.trim()) {
      setError('Please enter both your booking reference and email address.');
      return;
    }
    setLoading(true);
    setError('');
    setBooking(null);
    try {
      const res = await fetch(`/api/payments/booking-status?ref=${encodeURIComponent(ref.trim().toUpperCase())}&email=${encodeURIComponent(email.trim().toLowerCase())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Booking not found. Please check your reference and email.');
        return;
      }
      setBooking(data.booking);
      setPlan(data.plan);
      setInstallments(data.installments || []);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!cancelReason.trim() || cancelReason.trim().length < 10) {
      setCancelMsg('Please provide a reason (at least 10 characters).');
      setCancelStatus('error');
      return;
    }
    setCancelStatus('submitting');
    try {
      const res = await fetch('/api/payments/request-cancellation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingReference: booking?.bookingReference,
          email: booking?.customerEmail,
          reason: cancelReason.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCancelStatus('done');
        setCancelMsg(data.message);
      } else {
        setCancelStatus('error');
        setCancelMsg(data.error || 'Request failed. Please contact us at info@justprem.com');
      }
    } catch {
      setCancelStatus('error');
      setCancelMsg('Something went wrong. Please email us at info@justprem.com');
    }
  };

  const hasUnpaidInstallments = installments.some((i) => ['upcoming', 'overdue', 'pending_verification'].includes(i.status));
  const nextUnpaid = installments.find((i) => ['upcoming', 'overdue'].includes(i.status));

  return (
    <main className="min-h-screen bg-[#101012] px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#E6DCC8]/60">
            JustPrem
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-[-0.025em] text-[#F1EEE7]">
            My Booking
          </h1>
          <p className="mt-5 font-sans text-[13px] font-light leading-[1.7] text-[#EBE7DE]/60">
            Enter your booking reference and email to view your pilgrimage details and payment schedule.
          </p>
        </div>

        {/* Lookup Form */}
        {!booking && (
          <div className="border border-[#E6DCC8]/15 bg-[#141416] p-8 sm:p-10">
            <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-[#E6DCC8]/20" />
            <form onSubmit={handleLookup} className="space-y-6">
              <div>
                <label className="mb-2 block font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#E6DCC8]/60">
                  Booking Reference
                </label>
                <input
                  type="text"
                  value={ref}
                  onChange={(e) => setRef(e.target.value.toUpperCase())}
                  placeholder="JP-2027-XXXXXX"
                  className="w-full border-b border-[#E6DCC8]/20 bg-transparent py-3 font-sans text-[14px] font-light text-[#F1EEE7] placeholder-[#EBE7DE]/25 outline-none transition-colors focus:border-[#E6DCC8]/60 tracking-widest"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="mb-2 block font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#E6DCC8]/60">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full border-b border-[#E6DCC8]/20 bg-transparent py-3 font-sans text-[14px] font-light text-[#F1EEE7] placeholder-[#EBE7DE]/25 outline-none transition-colors focus:border-[#E6DCC8]/60"
                  autoComplete="email"
                />
              </div>
              {error && (
                <p className="font-sans text-[12px] font-light text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-[52px] w-full items-center justify-center gap-3 border border-[#E6DCC8]/30 bg-transparent font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#F1EEE7] transition-colors duration-500 hover:border-[#E6DCC8]/60 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 size={15} strokeWidth={1.2} className="animate-spin" /><span>Searching</span></>
                ) : (
                  <><span>Find My Booking</span><ArrowRight size={14} strokeWidth={1} className="transition-transform group-hover:translate-x-1" /></>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Booking Details */}
        {booking && (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => { setBooking(null); setError(''); setShowCancelForm(false); }}
              className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#EBE7DE]/50 transition-colors hover:text-[#F1EEE7]"
            >
              ← Search Again
            </button>

            {/* Booking Header Card */}
            <div className="border border-[#E6DCC8]/15 bg-[#141416] p-8">
              <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#E6DCC8]/50 mb-1">Booking Reference</p>
                  <p className="font-mono text-lg font-medium text-[#E6DCC8] tracking-widest">{booking.bookingReference}</p>
                </div>
                <StatusBadge status={booking.bookingStatus} />
              </div>
              <h2 className="font-serif text-2xl font-light text-[#F1EEE7] mb-2">{booking.pilgrimageTitle}</h2>
              <div className="flex flex-wrap gap-6 mt-4">
                <div>
                  <p className="font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-[#EBE7DE]/40 mb-1">Departure</p>
                  <p className="font-sans text-[13px] font-light text-[#F1EEE7]">{formatDate(booking.departureDate)}</p>
                </div>
                <div>
                  <p className="font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-[#EBE7DE]/40 mb-1">Total Price</p>
                  <p className="font-sans text-[13px] font-light text-[#F1EEE7]">{formatCents(booking.totalPriceCents)}</p>
                </div>
                {plan && (
                  <div>
                    <p className="font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-[#EBE7DE]/40 mb-1">Payment Plan</p>
                    <p className="font-sans text-[13px] font-light text-[#F1EEE7]"><PlanTypeLabel planType={plan.planType} /></p>
                  </div>
                )}
                {plan && plan.outstandingAmountCents > 0 && (
                  <div>
                    <p className="font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-[#EBE7DE]/40 mb-1">Outstanding</p>
                    <p className="font-sans text-[13px] font-light text-amber-400">{formatCents(plan.outstandingAmountCents)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Timeline */}
            {installments.length > 0 && (
              <div className="border border-[#E6DCC8]/15 bg-[#141416] p-8">
                <h3 className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#E6DCC8]/60 mb-6">
                  Payment Schedule
                </h3>
                <div className="space-y-4">
                  {installments.map((inst, idx) => (
                    <div
                      key={inst.id}
                      className={`flex items-center justify-between gap-4 border-b border-[#E6DCC8]/10 pb-4 last:border-0 last:pb-0 ${inst.status === 'overdue' ? 'opacity-100' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-8 w-8 items-center justify-center border text-[11px] font-medium ${inst.status === 'paid' ? 'border-emerald-500/40 text-emerald-400' : inst.status === 'overdue' ? 'border-red-500/40 text-red-400' : 'border-[#E6DCC8]/20 text-[#EBE7DE]/50'}`}>
                          {inst.status === 'paid' ? <Check size={13} /> : idx + 1}
                        </div>
                        <div>
                          <p className="font-sans text-[12px] font-light text-[#F1EEE7]">
                            Instalment {inst.installment_number}
                          </p>
                          <p className="font-sans text-[11px] font-light text-[#EBE7DE]/50">
                            {inst.status === 'paid' && inst.paid_at
                              ? `Paid on ${formatDate(inst.paid_at)}`
                              : `Due ${formatDate(inst.due_date)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-base font-light text-[#F1EEE7]">{formatCents(inst.amount_cents)}</span>
                        <StatusBadge status={inst.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wise Bank Details (for unpaid installments) */}
            {hasUnpaidInstallments && (
              <div className="border border-[#E6DCC8]/15 bg-[#141416]">
                <button
                  onClick={() => setShowWiseDetails((v) => !v)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#E6DCC8]/60">
                    Pay Via Bank Transfer (Wise)
                  </span>
                  {showWiseDetails ? <ChevronUp size={16} className="text-[#E6DCC8]/50" /> : <ChevronDown size={16} className="text-[#E6DCC8]/50" />}
                </button>
                {showWiseDetails && nextUnpaid && (
                  <div className="border-t border-[#E6DCC8]/10 p-6">
                    <p className="font-sans text-[11px] font-light text-[#EBE7DE]/60 mb-5 leading-[1.6]">
                      Transfer the amount for your next instalment to the account below. Use the reference exactly as shown so we can match your payment.
                    </p>
                    <div className="space-y-3">
                      {[
                        ['Account Name', 'VITTHAL PREM TRAVELS LLP'],
                        ['IBAN', 'BE75 9059 5938 2951'],
                        ['BIC / SWIFT', 'TRWIBEB1XXX'],
                        ['Bank', 'Wise'],
                        ['Amount', formatCents(nextUnpaid.amount_cents)],
                        ['Reference', `${booking.bookingReference}-P${nextUnpaid.installment_number}`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between items-center border-b border-[#E6DCC8]/10 pb-3 last:border-0">
                          <span className="font-sans text-[11px] text-[#EBE7DE]/50">{label}</span>
                          <span className="font-sans text-[12px] font-medium text-[#F1EEE7] text-right max-w-[60%]">{value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 font-sans text-[10px] text-[#EBE7DE]/40 leading-[1.6] border-t border-[#E6DCC8]/10 pt-4">
                      After transferring, our team will verify your payment within 1–2 business days and update your booking status.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cancellation Section */}
            {booking.bookingStatus !== 'cancelled' && booking.bookingStatus !== 'cancellation_requested' && (
              <div className="border border-[#E6DCC8]/10 bg-[#141416] p-6">
                {!showCancelForm ? (
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#EBE7DE]/40 mb-1">Need to Cancel?</p>
                      <p className="font-sans text-[11px] font-light text-[#EBE7DE]/50">Our cancellation policy applies based on days before departure.</p>
                    </div>
                    <button
                      onClick={() => setShowCancelForm(true)}
                      className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-red-400/70 transition-colors hover:text-red-400 border border-red-500/20 px-4 py-2"
                    >
                      Request Cancellation
                    </button>
                  </div>
                ) : cancelStatus === 'done' ? (
                  <div className="text-center py-2">
                    <Check size={20} className="text-emerald-400 mx-auto mb-3" />
                    <p className="font-sans text-[12px] font-light text-[#EBE7DE]/70 leading-[1.6]">{cancelMsg}</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#EBE7DE]/50">Request Cancellation</p>
                      <button onClick={() => { setShowCancelForm(false); setCancelStatus('idle'); setCancelMsg(''); }}>
                        <X size={15} className="text-[#EBE7DE]/40" />
                      </button>
                    </div>
                    <p className="font-sans text-[11px] font-light text-[#EBE7DE]/50 mb-4 leading-[1.6]">
                      Please explain why you need to cancel. Our team will review and respond within 2 business days.
                    </p>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Please describe the reason for your cancellation request..."
                      rows={3}
                      className="w-full border border-[#E6DCC8]/15 bg-[#101012] p-3 font-sans text-[13px] font-light text-[#F1EEE7] placeholder-[#EBE7DE]/25 outline-none focus:border-[#E6DCC8]/30 resize-none"
                    />
                    {cancelStatus === 'error' && cancelMsg && (
                      <p className="mt-2 font-sans text-[11px] text-red-400">{cancelMsg}</p>
                    )}
                    <button
                      onClick={handleCancelRequest}
                      disabled={cancelStatus === 'submitting'}
                      className="mt-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-red-400/70 border border-red-500/20 px-5 py-2 hover:text-red-400 disabled:opacity-50 transition-colors"
                    >
                      {cancelStatus === 'submitting' ? 'Submitting...' : 'Submit Cancellation Request'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {booking.bookingStatus === 'cancellation_requested' && (
              <div className="border border-amber-500/20 bg-amber-900/10 p-6">
                <p className="font-sans text-[11px] font-light text-amber-400/80 leading-[1.6]">
                  Your cancellation request is being processed. Our team will contact you within 2 business days. For urgent queries, please email info@justprem.com.
                </p>
              </div>
            )}

            <p className="text-center font-sans text-[9px] font-light text-[#EBE7DE]/30 tracking-[0.1em]">
              For support, contact us at info@justprem.com
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
