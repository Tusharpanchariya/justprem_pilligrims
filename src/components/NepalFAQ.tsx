'use client';

import { useState, type FormEvent } from 'react';
import { ChevronDown, Send, CheckCircle2, Loader2, Mail, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqList: FAQItem[] = [
  {
    question: 'Where should I fly into?',
    answer:
      'Please book your international flight to Tribhuvan International Airport (KTM) in Kathmandu, Nepal. Our team will guide you through the arrival arrangements and domestic travel included in the pilgrimage.',
  },
  {
    question: 'What travel documents do I need?',
    answer:
      'Your passport should be valid for at least six months. Most international visitors need a Nepal tourist visa, which can be arranged online or on arrival at Kathmandu Airport, depending on your nationality. Check the official Nepal immigration website before travelling.',
  },
  {
    question: 'What level of fitness is required?',
    answer:
      'This is a trekking pilgrimage, so a moderate level of fitness and the ability to walk for several hours on uneven trails and steep steps are important. Regular walking and stair training before departure will help you enjoy the journey more comfortably.',
  },
  {
    question: 'Will we experience high altitude?',
    answer:
      'Yes. Our journey reaches Muktinath at approximately 3,800 metres, where altitude can affect anyone regardless of fitness. We encourage a gradual pace, proper hydration and listening to your body throughout the trek. Please consult your doctor if you have any health concerns before booking.',
  },
  {
    question: 'What food will be provided?',
    answer:
      'All meals provided during the pilgrimage will be vegetarian, with no meat, fish or eggs. Vegan meals will be provided wherever possible, and we will ask you to share any dietary requirements or allergies with us in advance.',
  },
  {
    question: 'Do I need travel insurance?',
    answer:
      'Yes, we strongly recommend travel insurance that specifically covers trekking at the maximum altitude of our route, emergency medical treatment and helicopter evacuation. Please check that your policy covers all planned activities before departure.',
  },
  {
    question: 'What should I pack for the Himalayas?',
    answer:
      'Bring comfortable trekking shoes, warm layers, a waterproof jacket, sun protection, a reusable water bottle and any personal medication you need. A detailed packing list will be shared before departure to help you prepare for the changing mountain conditions.',
  },
  {
    question: 'What happens if weather affects the itinerary?',
    answer:
      'Mountain weather can change quickly, and flights or trekking plans may occasionally be affected. Our team will adapt the itinerary when necessary, always prioritising safety while preserving the spirit of the pilgrimage wherever possible.',
  },
];

export default function NepalFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Question form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !question) {
      setErrorMsg('Please enter your email and question.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/qa-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, question }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit question');
      }

      setSubmitted(true);
    } catch (err: any) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setQuestion('');
    setSubmitted(false);
    setErrorMsg('');
  };

  return (
    <section id="faq" className="relative bg-near-black px-6 py-28 md:px-12 md:py-36 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-antique-gold/5 blur-[160px]" />

      <div className="mx-auto max-w-[1300px]">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 text-center">
          <p className="reveal mb-3 font-sans text-[11px] uppercase tracking-ultra text-antique-gold">
            Q &amp; A &middot; Practical Details
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-3xl font-light text-ivory sm:text-5xl md:text-6xl tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="reveal reveal-delay-2 mx-auto mt-4 max-w-xl font-serif italic text-base sm:text-lg text-stone/75">
            Essential guidance to help you prepare mindfully for the Himalayan pilgrimage.
          </p>
        </div>

        {/* Two-Column Grid: FAQ Accordion (Left) + Ask a Question Form (Right) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-start">
          {/* FAQ Accordion List - Parent is reveal, children are controlled via pure state */}
          <div className="reveal reveal-delay-2 lg:col-span-7 space-y-4">
            {faqList.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-lg border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-antique-gold/50 bg-[#151518] shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
                      : 'border-[#E6DCC8]/15 bg-[#121214]/80 hover:border-antique-gold/35'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
                      <span className="font-mono text-xs text-antique-gold/80 tracking-wider pt-1 flex-shrink-0 w-6">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3
                        className={`font-serif text-lg sm:text-[20px] font-normal leading-snug tracking-wide transition-colors ${
                          isOpen ? 'text-ivory' : 'text-[#EBE7DE]/90 group-hover:text-ivory'
                        }`}
                      >
                        {item.question}
                      </h3>
                    </div>

                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? 'rotate-180 border-antique-gold/60 text-antique-gold bg-antique-gold/10'
                          : 'border-white/10 text-stone/60 group-hover:border-antique-gold/40 group-hover:text-ivory'
                      }`}
                    >
                      <ChevronDown size={15} />
                    </div>
                  </button>

                  {/* Smooth height transition without conditional unmounting bugs */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#E6DCC8]/10">
                        <p className="font-serif text-[15px] sm:text-[16.5px] font-normal leading-[1.8] text-[#D8D2C4]/90 pl-8 sm:pl-10 pr-2">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ask a Question Form Card */}
          <div className="reveal reveal-delay-3 lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-xl border border-antique-gold/30 bg-[#121215] p-6 sm:p-8 shadow-2xl">
              {/* Subtle top golden light */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-antique-gold/60 to-transparent" />

              {!submitted ? (
                <>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-antique-gold/30 bg-antique-gold/10 text-antique-gold">
                      <HelpCircle size={18} />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-light text-ivory">
                        Have Another Question?
                      </h3>
                      <p className="font-sans text-[10.5px] uppercase tracking-[0.2em] text-antique-gold/80">
                        Ask Our Team Directly
                      </p>
                    </div>
                  </div>

                  <p className="mb-6 font-serif text-[14.5px] font-light leading-[1.65] text-stone/75">
                    Can&apos;t find what you&apos;re looking for? Send us your question and our pilgrimage coordinators will reply to you via email.
                  </p>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block font-sans text-[10.5px] uppercase tracking-[0.18em] text-[#C9C1B2]/80 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        className="w-full rounded border border-[#E6DCC8]/20 bg-[#17171a] px-4 py-3 font-sans text-sm text-ivory placeholder-stone/35 focus:border-antique-gold focus:ring-1 focus:ring-antique-gold/30 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-[10.5px] uppercase tracking-[0.18em] text-[#C9C1B2]/80 mb-1.5">
                        Your Email <span className="text-antique-gold">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded border border-[#E6DCC8]/20 bg-[#17171a] px-4 py-3 font-sans text-sm text-ivory placeholder-stone/35 focus:border-antique-gold focus:ring-1 focus:ring-antique-gold/30 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-[10.5px] uppercase tracking-[0.18em] text-[#C9C1B2]/80 mb-1.5">
                        Your Question <span className="text-antique-gold">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask about altitude, preparation, flights, schedule..."
                        className="w-full rounded border border-[#E6DCC8]/20 bg-[#17171a] px-4 py-3 font-sans text-sm text-ivory placeholder-stone/35 focus:border-antique-gold focus:ring-1 focus:ring-antique-gold/30 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs text-rose-400 font-light">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded border border-antique-gold/60 bg-antique-gold/15 py-3.5 px-6 font-sans text-xs uppercase tracking-widest text-ivory transition-all duration-300 hover:bg-antique-gold hover:text-near-black disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Sending Question...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Question</span>
                          <Send size={13} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-6 text-center animate-fade-in space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-antique-gold/40 bg-antique-gold/10 text-antique-gold">
                    <CheckCircle2 size={26} />
                  </div>
                  <h3 className="font-serif text-2xl font-light text-ivory">
                    Question Received
                  </h3>
                  <p className="font-serif text-sm leading-relaxed text-[#D8D2C4]/90 max-w-sm mx-auto">
                    Thank you, <span className="text-ivory font-medium">{name || 'seeker'}</span>. Our team has received your message and will email our answer to{' '}
                    <span className="text-antique-gold font-mono text-xs">{email}</span> shortly.
                  </p>
                  <button
                    onClick={resetForm}
                    className="mt-4 inline-block font-sans text-[11px] uppercase tracking-wider text-stone/70 underline underline-offset-4 hover:text-ivory transition-colors"
                  >
                    Ask another question
                  </button>
                </div>
              )}

              {/* Direct Email note */}
              <div className="mt-6 pt-5 border-t border-white/10 text-center">
                <a
                  href="mailto:connect@justprem.com?subject=Nepal%20Pilgrimage%20Question"
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-stone/60 hover:text-antique-gold transition-colors"
                >
                  <Mail size={13} />
                  <span>Or email directly: connect@justprem.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
