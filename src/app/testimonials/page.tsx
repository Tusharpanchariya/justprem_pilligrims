'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import { Quote, Sparkles, Star } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  role: string;
  journeyAttended: string;
  quote: string;
  image: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Elena Rostova',
    location: 'Zurich, Switzerland',
    role: 'Artist & Yoga Practitioner',
    journeyAttended: 'A Journey Through Sacred Nepal',
    quote: 'This Retreat was not a vacation; it was a homecoming. Walking through Nepal with JustPrem created space for my soul to breathe in ways I never thought possible. The music circles at dusk will stay with me for life.',
    image: 'https://images.pexels.com/photos/19375318/pexels-photo-19375318.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 't2',
    name: 'Marcus Vance',
    location: 'Melbourne, Australia',
    role: 'Architect',
    journeyAttended: 'Himalayan Bhakti Retreat',
    quote: 'The harmony of sacred devotional music, Himalayan silence, and thoughtful guidance made this the single most profound experience of my life. I came carrying heavy stress and returned with a clear heart.',
    image: 'https://images.pexels.com/photos/37371223/pexels-photo-37371223.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 't3',
    name: 'Sarah Jenkins',
    location: 'Vancouver, Canada',
    role: 'Therapist',
    journeyAttended: 'Silence & Sacred Sound Retreat',
    quote: '3 days of noble silence along the Ganga in Rishikesh reset my entire nervous system. Listening to classical sitar ragas as dusk settled over the river felt like a divine gift.',
    image: 'https://images.pexels.com/photos/20808434/pexels-photo-20808434.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 't4',
    name: 'Julian & Maya',
    location: 'London, UK',
    role: 'Documentary Filmmakers',
    journeyAttended: 'Upper Mustang Retreat',
    quote: 'Upper Mustang with JustPrem felt like stepping into an ancient biblical landscape. Prem and the local guides held the container with so much reverence and authenticity.',
    image: 'https://images.pexels.com/photos/29764242/pexels-photo-29764242.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export default function TestimonialsPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

  return (
    <div className="relative min-h-screen bg-near-black text-ivory">
      <Navbar onEnquire={openEnquiry} />

      <main className="pt-28 pb-24">
        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 border border-antique-gold/30 bg-antique-gold/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-antique-gold mb-6 backdrop-blur-md">
            <Sparkles size={12} />
            <span>Pilgrim Voices</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-light text-ivory tracking-tight">
            Reflections & Stories
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm md:text-base font-light leading-relaxed text-stone/70">
            Hear from seekers, artists, and travelers who have walked the Himalayan path with JustPrem.
          </p>
        </section>

        {/* Testimonials Grid */}
        <section className="mx-auto max-w-6xl px-6 mt-16 space-y-12">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={item.id}
              className="group border border-antique-gold/20 bg-charcoal/40 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center transition-all hover:border-antique-gold/50 shadow-xl"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-32 w-32 md:h-40 md:w-40 object-cover border border-antique-gold/30 shrink-0"
              />

              <div className="flex-1">
                <div className="flex items-center gap-1 text-antique-gold mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <blockquote className="font-serif text-xl md:text-2xl font-light italic leading-relaxed text-ivory">
                  "{item.quote}"
                </blockquote>

                <div className="mt-6 pt-4 border-t border-antique-gold/10 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-ivory">{item.name}</h3>
                    <p className="text-xs text-stone/50 font-light">{item.role} &middot; {item.location}</p>
                  </div>

                  <span className="text-[10px] uppercase tracking-wide bg-antique-gold/10 border border-antique-gold/20 text-antique-gold px-3 py-1">
                    {item.journeyAttended}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="mt-24 text-center">
          <button
            onClick={openEnquiry}
            className="bg-antique-gold text-near-black px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-transparent hover:text-ivory border border-antique-gold transition-all"
          >
            Join Our Next Journey
          </button>
        </section>
      </main>

      <Footer onEnquire={openEnquiry} />
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
    </div>
  );
}
