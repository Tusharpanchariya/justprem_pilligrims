'use client';

import { useState } from 'react';
import { INITIAL_RETREAT_TERMS } from '@/lib/payments/initial-terms';

export default function AgreementPreviewPage() {
  const [name, setName] = useState('');
  const [accepted, setAccepted] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f6f3] px-4 py-8 text-[#242320] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[900px]">
        <header className="mb-7 flex items-center justify-between border-b border-neutral-200 pb-5">
          <span className="text-xl tracking-[0.18em]">JUSTPREM</span>
          <span className="text-sm text-neutral-500">Agreement preview · Version 1.0</span>
        </header>

        <article className="rounded-xl bg-[#dedbcd] px-6 py-10 shadow-sm sm:px-12 sm:py-14">
          <h1 className="mb-8 text-center text-2xl font-medium sm:text-3xl text-[#242320]">
            Heart of the Himalayas Retreat Terms &amp; Conditions
          </h1>

          <div className="whitespace-pre-wrap text-[15px] leading-7 sm:text-base text-[#2e2d29]">
            {INITIAL_RETREAT_TERMS}
          </div>

          <div className="mt-10 border-t border-[#aaa794] pt-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#69685d]">Electronic signature</p>
            <p
              className="min-h-14 border-b border-[#777568] pb-1 text-center text-[34px] leading-10 text-[#33332f]"
              style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive", fontStyle: 'italic' }}
            >
              {name.trim() || 'Type your full name to sign'}
            </p>
          </div>
        </article>

        <section className="mt-5 rounded-xl border border-neutral-200 bg-white p-5 sm:p-7">
          <h2 className="mb-4 text-lg font-medium">Sign Your Agreement</h2>
          <label className="block text-sm">
            Type your full legal name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="First and last name"
              className="mt-2 w-full rounded border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
            />
          </label>
          <label className="mt-5 flex items-start gap-3 border-t border-neutral-200 pt-5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="mt-1 accent-emerald-600 h-4 w-4"
            />
            <span>I agree to electronically sign and be legally bound by this document.</span>
          </label>
        </section>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">Preview only. No booking or signature is submitted.</p>
          <button
            type="button"
            disabled={!name.trim() || !accepted}
            className="rounded bg-emerald-600 px-6 py-2.5 text-sm text-white disabled:opacity-50"
          >
            Sign Agreement
          </button>
        </div>
      </div>
    </main>
  );
}
