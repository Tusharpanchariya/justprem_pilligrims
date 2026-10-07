'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import ExperienceCard from '@/components/ExperienceCard';
import { experiences } from '@/data/experiences';
import { Compass, Sparkles } from 'lucide-react';

export default function PilgrimagesPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

  const pilgrimages = experiences.filter((e) => e.type === 'pilgrimage');

  return (
    <div className="relative min-h-screen bg-near-black text-ivory">
      <Navbar onEnquire={openEnquiry} />

      <main className="pt-28 pb-24">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 border border-antique-gold/30 bg-antique-gold/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-antique-gold mb-6 backdrop-blur-md">
            <Sparkles size={12} />
            <span>Himalayan Pilgrimages</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-light text-ivory tracking-tight">
            Nepal & Sacred Pilgrimages
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm md:text-base font-light leading-relaxed text-stone/70">
            A pilgrimage is not a trip outward; it is a sacred walk inward. Journey through ancient temples, high-altitude desert caves, living traditions, and the majestic Himalayan peaks of Nepal.
          </p>
        </section>

        {/* Pilgrimages Grid */}
        <section className="mx-auto max-w-[1400px] px-6 md:px-12 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pilgrimages.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </section>
      </main>

      <Footer onEnquire={openEnquiry} />
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
    </div>
  );
}
