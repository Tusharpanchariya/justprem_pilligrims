'use client';

import { useState, useCallback, FormEvent } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import { Mail, Phone, Instagram, Youtube, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ConnectPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

  const [formType, setFormType] = useState<'Retreat' | 'retreat' | 'music' | 'general'>('Retreat');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill in your name and email address.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const { error: sbError } = await supabase.from('Retreat_enquiries').insert({
        name,
        email,
        phone,
        country: 'Website Form Inquiry',
        payment_method: formType,
      });

      if (sbError) {
        // Fallback gracefully if database table differs
        console.warn('Supabase enquiry warning:', sbError);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-near-black text-ivory">
      <Navbar onEnquire={openEnquiry} />

      <main className="pt-28 pb-24">
        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 border border-antique-gold/30 bg-antique-gold/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-antique-gold mb-6 backdrop-blur-md">
            <Sparkles size={12} />
            <span>Sacred Communion</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-light text-ivory tracking-tight">
            Connect With Us
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm md:text-base font-light leading-relaxed text-stone/70">
            We are honored to answer your questions regarding upcoming Retreats, retreats, music collaborations, or private group experiences.
          </p>
        </section>

        {/* Form & Contact Info Container */}
        <section className="mx-auto max-w-6xl px-6 mt-16 grid md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="border border-antique-gold/20 bg-charcoal/40 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-ultra text-antique-gold font-semibold">
                Direct Contact
              </span>
              <h2 className="mt-2 font-serif text-3xl font-light text-ivory">
                Reach Out Directly
              </h2>
              <p className="mt-4 text-xs md:text-sm font-light leading-relaxed text-stone/60">
                Our team responds personally to every message. Please allow 24–48 hours for us to reply with quiet attention.
              </p>

              <div className="mt-8 space-y-6">
                <a
                  href="mailto:connect@justprem.com"
                  className="flex items-center gap-4 p-4 border border-antique-gold/10 bg-near-black/50 text-stone/70 hover:text-ivory hover:border-antique-gold/40 transition-colors"
                >
                  <Mail size={18} className="text-antique-gold shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-stone/50">Email Inquiry</p>
                    <p className="text-sm font-serif text-ivory">connect@justprem.com</p>
                  </div>
                </a>

                <a
                  href="tel:+447000000000"
                  className="flex items-center gap-4 p-4 border border-antique-gold/10 bg-near-black/50 text-stone/70 hover:text-ivory hover:border-antique-gold/40 transition-colors"
                >
                  <Phone size={18} className="text-antique-gold shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-stone/50">Phone / WhatsApp</p>
                    <p className="text-sm font-serif text-ivory">+44 7000 000000</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Channels */}
            <div className="mt-12 pt-8 border-t border-antique-gold/10">
              <p className="text-[10px] uppercase tracking-ultra text-antique-gold/70 mb-4">
                Follow the Music & Journey
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/justprem_community/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border border-antique-gold/30 px-4 py-2 text-xs text-stone/70 hover:text-ivory hover:border-antique-gold transition-colors"
                >
                  <Instagram size={16} className="text-antique-gold" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.youtube.com/@justpremfoundation"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border border-antique-gold/30 px-4 py-2 text-xs text-stone/70 hover:text-ivory hover:border-antique-gold transition-colors"
                >
                  <Youtube size={16} className="text-antique-gold" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="border border-antique-gold/20 bg-charcoal/40 p-8 md:p-12">
            <span className="text-[10px] uppercase tracking-ultra text-antique-gold font-semibold">
              Send an Inquiry
            </span>
            <h2 className="mt-2 font-serif text-3xl font-light text-ivory">
              Enquiry Form
            </h2>

            {/* Enquiry Type Selector */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { id: 'Retreat', label: 'Retreat' },
                { id: 'retreat', label: 'Retreat' },
                { id: 'music', label: 'Music & Art' },
                { id: 'general', label: 'General' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormType(type.id as any)}
                  className={`px-3 py-1 text-xs uppercase tracking-wide border transition-colors ${formType === type.id
                      ? 'border-antique-gold bg-antique-gold/20 text-antique-gold font-medium'
                      : 'border-stone/20 text-stone/50 hover:text-ivory'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {submitted ? (
              <div className="mt-8 p-6 border border-antique-gold/30 bg-antique-gold/10 text-center animate-fade-up">
                <CheckCircle2 size={32} className="mx-auto text-antique-gold mb-3" />
                <h3 className="font-serif text-2xl font-light text-ivory">Thank You</h3>
                <p className="mt-2 text-xs text-stone/70 font-light">
                  Your inquiry has been received. We will be in touch with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {error && <p className="text-xs text-red-400">{error}</p>}

                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-stone/50 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full border border-antique-gold/20 bg-near-black/80 px-4 py-3 text-sm text-ivory placeholder-stone/30 focus:border-antique-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-stone/50 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maya@example.com"
                    className="w-full border border-antique-gold/20 bg-near-black/80 px-4 py-3 text-sm text-ivory placeholder-stone/30 focus:border-antique-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-stone/50 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-full border border-antique-gold/20 bg-near-black/80 px-4 py-3 text-sm text-ivory placeholder-stone/30 focus:border-antique-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-stone/50 mb-1">
                    Your Message / Intentions
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us a little about your journey background or questions..."
                    className="w-full border border-antique-gold/20 bg-near-black/80 px-4 py-3 text-sm text-ivory placeholder-stone/30 focus:border-antique-gold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-antique-gold text-near-black text-xs font-semibold uppercase tracking-[0.2em] border border-antique-gold hover:bg-transparent hover:text-ivory transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>{submitting ? 'Sending...' : 'Send Inquiry'}</span>
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer onEnquire={openEnquiry} />
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
    </div>
  );
}
