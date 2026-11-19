'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { INITIAL_RETREAT_TERMS } from '@/lib/payments/initial-terms';

interface Agreement { version: string; title: string; content: string; }
interface Props { open: boolean; initialName: string; onSigned: (name: string, previewOnly: boolean) => void; onCancel: () => void; }

export default function AgreementReader({ open, initialName, onSigned, onCancel }: Props) {
  const [agreement, setAgreement] = useState<Agreement>({ version: '1.0', title: 'Heart of the Himalayas Retreat Terms & Conditions', content: INITIAL_RETREAT_TERMS });
  const [name, setName] = useState(initialName);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewOnly, setPreviewOnly] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setAccepted(false);
    setError('');
    setLoading(true);
    let active = true;
    fetch('/api/agreements?slug=nepal-himalaya-2027').then(async (response) => {
      const type = response.headers.get('content-type') || '';
      if (!type.includes('application/json')) throw new Error('Using local draft preview.');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load published terms.');
      if (active) { setAgreement(data.agreement); setPreviewOnly(false); }
    }).catch(() => {
      if (active) {
        setAgreement({ version: '1.0', title: 'Heart of the Himalayas Retreat Terms & Conditions', content: INITIAL_RETREAT_TERMS });
        setPreviewOnly(false);
      }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, initialName]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  if (!open) return null;
  const sign = () => {
    const normalized = name.trim().replace(/\s+/g, ' ');
    if (normalized.length < 2 || !accepted) { setError('Enter your full legal name and accept the electronic signature.'); return; }
    onSigned(normalized, previewOnly);
  };

  return <div className="fixed inset-0 z-[120] overflow-y-auto bg-[#f7f6f3] px-4 py-5 text-[#252521] sm:px-8 sm:py-7" role="dialog" aria-modal="true" aria-labelledby="agreement-title">
    <div className="mx-auto flex min-h-full max-w-5xl flex-col">
      <header className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-4"><span className="text-xl tracking-[0.18em]">JUSTPREM</span><button type="button" onClick={onCancel} aria-label="Close agreement" className="rounded-full p-2 text-neutral-500 hover:bg-neutral-200"><X size={21}/></button></header>
      <div className="mb-3 flex items-center justify-between"><h1 id="agreement-title" className="text-lg font-semibold">{agreement.title}</h1><span className="text-xs text-neutral-500">Version {agreement.version}</span></div>
      <article className="min-h-[45vh] flex-1 overflow-y-auto rounded-lg bg-[#dedbcd] px-6 py-7 sm:px-12 sm:py-10">
        {loading && <div className="mb-4 flex items-center gap-2 text-sm text-neutral-500"><Loader2 size={15} className="animate-spin"/>Checking for the current published agreement…</div>}
        <div className="whitespace-pre-wrap text-[14px] leading-7 sm:text-[15px]">{agreement.content}</div>
        <div className="mt-8 border-t border-[#aaa794] pt-4"><p className="text-[10px] uppercase tracking-[0.16em] text-[#69685d]">Electronic signature</p><p className="min-h-12 border-b border-[#777568] pb-1 text-center text-[34px] leading-10 text-[#33332f]" style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive", fontStyle: 'italic' }}>{name.trim() || 'Type your full name to sign'}</p></div>
      </article>
      <section className="mt-3 rounded-lg border border-neutral-200 bg-white p-4 sm:p-5">
        <label className="block text-sm font-medium text-neutral-700">Type your full legal name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-2 w-full border-b border-neutral-300 px-2 py-3 text-center text-[18px] outline-none focus:border-neutral-500" /></label>
        <label className="mt-4 flex items-start gap-3 border-t border-neutral-200 pt-4 text-sm text-neutral-700"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-cyan-500" /><span>I agree to electronically sign and be legally bound by this document.</span></label>
      </section>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <footer className="sticky bottom-0 mt-3 flex justify-end gap-3 border-t border-neutral-200 bg-[#f7f6f3] py-3"><button type="button" onClick={onCancel} className="rounded border border-sky-400 px-5 py-2.5 text-sm text-neutral-600">Cancel</button><button type="button" onClick={sign} disabled={loading} className="flex items-center gap-2 rounded bg-green-600 px-5 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"><Check size={16}/>Sign</button></footer>
    </div>
  </div>;
}
