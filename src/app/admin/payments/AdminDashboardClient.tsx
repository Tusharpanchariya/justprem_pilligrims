'use client';

import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Download } from 'lucide-react';

function formatCents(cents: number): string {
  if (!cents) return '€0';
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

type FilterTab = 'all' | 'pending' | 'confirmed' | 'overdue' | 'cancellation_requested';

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, string> = {
    confirmed: 'border-emerald-500/40 text-emerald-400',
    pending: 'border-amber-500/40 text-amber-400',
    cancellation_requested: 'border-red-500/40 text-red-400',
    cancelled: 'border-red-500/40 text-red-400',
    overdue: 'border-red-500/40 text-red-400',
    paid: 'border-emerald-500/40 text-emerald-400',
    upcoming: 'border-[#E6DCC8]/30 text-[#EBE7DE]/70',
    pending_verification: 'border-amber-500/40 text-amber-400',
  };
  return (
    <span className={`border px-2 py-0.5 font-sans text-[9px] font-medium uppercase tracking-[0.1em] ${configs[status] || 'border-[#E6DCC8]/20 text-[#EBE7DE]/50'}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

interface Props {
  initialBookings: any[];
  initialInstallments: any[];
  initialPayments: any[];
  dbError: string | null;
  adminKey: string;
}

export default function AdminDashboardClient({ initialBookings, initialInstallments, initialPayments, dbError, adminKey }: Props) {
  const [bookings] = useState(initialBookings);
  const [installments] = useState(initialInstallments);
  const [payments] = useState(initialPayments);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [wiseForm, setWiseForm] = useState({ bookingId: '', installmentId: '', transferRef: '', amountCents: '', notes: '' });
  const [wiseStatus, setWiseStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [wiseMsg, setWiseMsg] = useState('');
  const [agreementTitle, setAgreementTitle] = useState('Heart of the Himalayas Retreat Terms & Conditions');
  const [agreementVersion, setAgreementVersion] = useState('2026-11-v1');
  const [agreementContent, setAgreementContent] = useState('');
  const [agreementLegalReviewed, setAgreementLegalReviewed] = useState(false);
  const [agreementMessage, setAgreementMessage] = useState('');
  const [agreementBusy, setAgreementBusy] = useState(false);

  useEffect(() => {
    fetch('/api/agreements?admin=1', { headers: { 'x-admin-secret': adminKey } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load agreement versions.');
        const current = data.terms?.find((item: any) => item.pilgrimage_slug === 'nepal-himalaya-2027' && item.status === 'published')
          || data.terms?.find((item: any) => item.pilgrimage_slug === 'nepal-himalaya-2027');
        if (current) { setAgreementTitle(current.title); setAgreementVersion(current.version); setAgreementContent(current.content); }
      }).catch((error) => setAgreementMessage(error.message));
  }, [adminKey]);

  const saveAgreement = async (status: 'draft' | 'published') => {
    setAgreementBusy(true); setAgreementMessage('');
    try {
      const response = await fetch('/api/agreements', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminKey }, body: JSON.stringify({ action: 'manage_terms', pilgrimageSlug: 'nepal-himalaya-2027', title: agreementTitle, version: agreementVersion, content: agreementContent, status, legalReviewed: agreementLegalReviewed }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save the agreement.');
      setAgreementMessage(status === 'published' ? `Version ${agreementVersion} is published.` : `Draft ${agreementVersion} is saved.`);
    } catch (error) { setAgreementMessage(error instanceof Error ? error.message : 'Could not save the agreement.'); }
    finally { setAgreementBusy(false); }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    return b.booking_status === activeTab;
  });

  const totalRevenue = payments
    .filter((p) => p.payment_status === 'completed')
    .reduce((sum: number, p: any) => sum + (p.amount_cents || 0), 0);

  const confirmedCount = bookings.filter((b) => b.booking_status === 'confirmed').length;
  const overdueCount = installments.filter((i) => i.status === 'overdue').length;

  const handleWiseVerify = async () => {
    if (!wiseForm.bookingId || !wiseForm.installmentId || !wiseForm.transferRef) {
      setWiseStatus('error');
      setWiseMsg('Please fill in Booking ID, Installment ID and Transfer Reference.');
      return;
    }
    setWiseStatus('submitting');
    try {
      const res = await fetch('/api/payments/admin/verify-wise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: wiseForm.bookingId,
          installmentId: wiseForm.installmentId,
          adminKey,
          transferReference: wiseForm.transferRef,
          amountCents: wiseForm.amountCents ? parseInt(wiseForm.amountCents, 10) * 100 : 0,
          notes: wiseForm.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWiseStatus('done');
        setWiseMsg('Payment verified successfully. Booking confirmed.');
      } else {
        setWiseStatus('error');
        setWiseMsg(data.error || 'Verification failed.');
      }
    } catch {
      setWiseStatus('error');
      setWiseMsg('Network error. Please try again.');
    }
  };

  const exportCSV = () => {
    const rows = [
      ['Reference', 'Name', 'Email', 'Country', 'Status', 'Total', 'Created'],
      ...bookings.map((b) => [
        b.booking_reference,
        b.customer_name,
        b.customer_email,
        b.country_code,
        b.booking_status,
        (b.total_price_cents / 100).toFixed(2),
        formatDate(b.created_at),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `justprem-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-[#101012] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-[#E6DCC8]/40 mb-2">JustPrem Admin</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#F1EEE7]">Payment Dashboard</h1>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 border border-[#E6DCC8]/20 px-4 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-[#EBE7DE]/60 transition-colors hover:text-[#F1EEE7] hover:border-[#E6DCC8]/40"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>

        {dbError && (
          <div className="mb-6 border border-amber-500/20 bg-amber-900/10 p-4">
            <p className="font-sans text-[11px] text-amber-400">
              <strong>Database Note:</strong> {dbError}. Run the SQL migration in Supabase first, then add SUPABASE_SERVICE_ROLE_KEY to .env
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Bookings', value: bookings.length.toString() },
            { label: 'Confirmed', value: confirmedCount.toString() },
            { label: 'Revenue Collected', value: formatCents(totalRevenue) },
            { label: 'Overdue Instalments', value: overdueCount.toString() },
          ].map(({ label, value }) => (
            <div key={label} className="border border-[#E6DCC8]/15 bg-[#141416] p-5">
              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-[#EBE7DE]/40 mb-2">{label}</p>
              <p className="font-serif text-2xl font-light text-[#F1EEE7]">{value}</p>
            </div>
          ))}
        </div>

        <section className="mb-10 border border-[#E6DCC8]/15 bg-[#141416] p-5 sm:p-7">
          <h2 className="mb-2 font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#E6DCC8]/70">Retreat Terms &amp; Conditions</h2>
          <p className="mb-5 text-[11px] leading-relaxed text-[#EBE7DE]/45">Edit a versioned agreement. Publishing archives the previous live version; existing signed agreements keep their original snapshot. Verify legal and jurisdiction-specific language before publishing.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-[10px] uppercase tracking-widest text-[#EBE7DE]/50">Version<input value={agreementVersion} onChange={(event) => setAgreementVersion(event.target.value)} className="mt-2 block w-full border border-[#E6DCC8]/15 bg-[#101012] px-3 py-2 text-sm normal-case tracking-normal text-[#F1EEE7]" /></label>
            <label className="text-[10px] uppercase tracking-widest text-[#EBE7DE]/50">Document title<input value={agreementTitle} onChange={(event) => setAgreementTitle(event.target.value)} className="mt-2 block w-full border border-[#E6DCC8]/15 bg-[#101012] px-3 py-2 text-sm normal-case tracking-normal text-[#F1EEE7]" /></label>
          </div>
          <label className="mt-4 block text-[10px] uppercase tracking-widest text-[#EBE7DE]/50">Agreement content<textarea value={agreementContent} onChange={(event) => setAgreementContent(event.target.value)} rows={12} className="mt-2 block w-full border border-[#E6DCC8]/15 bg-[#101012] px-3 py-3 text-sm normal-case leading-relaxed tracking-normal text-[#F1EEE7]" placeholder="Enter the complete retreat agreement, including payment, cancellation, safety, privacy, and governing-law terms." /></label>
          <label className="mt-4 flex items-start gap-2 text-xs text-[#EBE7DE]/60"><input type="checkbox" checked={agreementLegalReviewed} onChange={(event) => setAgreementLegalReviewed(event.target.checked)} className="mt-0.5 accent-[#DFC498]" />I confirm the jurisdiction-specific clauses and commercial policy have been reviewed before publication.</label>
          {agreementMessage && <p className="mt-3 text-xs text-amber-300">{agreementMessage}</p>}
          <div className="mt-4 flex flex-wrap gap-3"><button disabled={agreementBusy} onClick={() => saveAgreement('draft')} className="border border-[#E6DCC8]/25 px-4 py-2 text-xs text-[#EBE7DE]/80 disabled:opacity-50">Save Draft</button><button disabled={agreementBusy || !agreementLegalReviewed} onClick={() => saveAgreement('published')} className="bg-[#DFC498] px-4 py-2 text-xs text-[#101012] disabled:opacity-50">Publish New Version</button></div>
        </section>

        {/* Bookings Table */}
        <div className="border border-[#E6DCC8]/15 bg-[#141416] mb-10">
          <div className="border-b border-[#E6DCC8]/10 p-5 flex items-center justify-between flex-wrap gap-4">
            <h2 className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#E6DCC8]/60">Bookings</h2>
            <div className="flex gap-1 flex-wrap">
              {(['all', 'pending', 'confirmed', 'overdue', 'cancellation_requested'] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 font-sans text-[9px] font-medium uppercase tracking-[0.12em] transition-colors ${
                    activeTab === tab
                      ? 'bg-[#E6DCC8]/10 text-[#F1EEE7] border border-[#E6DCC8]/30'
                      : 'text-[#EBE7DE]/40 hover:text-[#EBE7DE]/70 border border-transparent'
                  }`}
                >
                  {tab.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-sans text-[12px] font-light text-[#EBE7DE]/40">
                {dbError ? 'Run the database migration to see bookings here.' : 'No bookings found.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E6DCC8]/10">
                    {['Reference', 'Customer', 'Country', 'Plan', 'Status', 'Total', 'Date', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-sans text-[9px] font-medium uppercase tracking-[0.15em] text-[#EBE7DE]/35">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b: any) => {
                    const isExpanded = expandedId === b.id;
                    return (
                      <React.Fragment key={b.id}>
                        <tr className="border-b border-[#E6DCC8]/8 hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono text-[11px] font-medium text-[#E6DCC8] tracking-wider">{b.booking_reference}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-sans text-[12px] font-light text-[#F1EEE7]">{b.customer_name}</p>
                              <p className="font-sans text-[10px] text-[#EBE7DE]/40">{b.customer_email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-sans text-[11px] text-[#EBE7DE]/60">{b.country_code}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-sans text-[10px] text-[#EBE7DE]/50">
                              {b.plan_type?.replace(/_/g, ' ') || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={b.booking_status} />
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-sans text-[12px] font-light text-[#F1EEE7]">{formatCents(b.total_price_cents)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-sans text-[10px] text-[#EBE7DE]/50">{formatDate(b.created_at)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : b.id)}
                              className="text-[#EBE7DE]/40 hover:text-[#F1EEE7] transition-colors"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="border-b border-[#E6DCC8]/8">
                            <td colSpan={8} className="px-4 py-4 bg-[#101012]">
                              <div className="grid grid-cols-2 gap-4 text-[11px]">
                                <div>
                                  <p className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#EBE7DE]/35 mb-2">Customer Details</p>
                                  <p className="text-[#EBE7DE]/70">Phone: {b.customer_phone}</p>
                                  <p className="text-[#EBE7DE]/70">Email: {b.customer_email}</p>
                                  <p className="text-[#EBE7DE]/70">Booking ID: <span className="font-mono text-[10px]">{b.id}</span></p>
                                </div>
                                <div>
                                  <p className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#EBE7DE]/35 mb-2">Pilgrimage</p>
                                  <p className="text-[#EBE7DE]/70">{b.pilgrimage_title}</p>
                                  <p className="text-[#EBE7DE]/70">Departure: {formatDate(b.departure_date)}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Manual Wise Verification */}
        <div className="border border-[#E6DCC8]/15 bg-[#141416] p-8">
          <h2 className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#E6DCC8]/60 mb-6">
            Manual Wise Transfer Verification
          </h2>
          <p className="font-sans text-[11px] font-light text-[#EBE7DE]/50 mb-6 leading-[1.6]">
            Use this form to mark a Wise bank transfer as received and confirmed. Only use after verifying the transfer in your Wise dashboard.
          </p>

          {wiseStatus === 'done' ? (
            <div className="flex items-center gap-3 border border-emerald-500/20 bg-emerald-900/10 p-4">
              <Check size={16} className="text-emerald-400" />
              <p className="font-sans text-[12px] font-light text-emerald-400">{wiseMsg}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { key: 'bookingId', label: 'Booking ID (UUID)', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
                { key: 'installmentId', label: 'Installment ID (UUID)', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
                { key: 'transferRef', label: 'Transfer Reference (from Wise)', placeholder: 'JP-2027-XXXXXX-P1' },
                { key: 'amountCents', label: 'Amount in EUR (whole number)', placeholder: '950' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="mb-2 block font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-[#E6DCC8]/50">{label}</label>
                  <input
                    type="text"
                    value={wiseForm[key as keyof typeof wiseForm]}
                    onChange={(e) => setWiseForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border-b border-[#E6DCC8]/20 bg-transparent py-2.5 font-sans text-[13px] font-light text-[#F1EEE7] placeholder-[#EBE7DE]/20 outline-none focus:border-[#E6DCC8]/50"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="mb-2 block font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-[#E6DCC8]/50">Notes (Optional)</label>
                <input
                  type="text"
                  value={wiseForm.notes}
                  onChange={(e) => setWiseForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Any notes about this verification"
                  className="w-full border-b border-[#E6DCC8]/20 bg-transparent py-2.5 font-sans text-[13px] font-light text-[#F1EEE7] placeholder-[#EBE7DE]/20 outline-none focus:border-[#E6DCC8]/50"
                />
              </div>

              {wiseStatus === 'error' && wiseMsg && (
                <p className="sm:col-span-2 font-sans text-[11px] text-red-400">{wiseMsg}</p>
              )}

              <div className="sm:col-span-2">
                <button
                  onClick={handleWiseVerify}
                  disabled={wiseStatus === 'submitting'}
                  className="flex items-center gap-2 border border-[#E6DCC8]/30 px-6 py-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#F1EEE7] transition-colors hover:border-[#E6DCC8]/60 disabled:opacity-50"
                >
                  {wiseStatus === 'submitting' ? 'Verifying...' : 'Verify & Confirm Payment'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

