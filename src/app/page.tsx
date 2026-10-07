'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Mountain, Music, Compass, Heart, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import ExperienceCard from '@/components/ExperienceCard';
import { experiences } from '@/data/experiences';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function HomePage() {
  useScrollReveal();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

  const featuredExperiences = experiences.slice(0, 3);

  return (
    <div className="relative min-h-screen bg-near-black text-ivory selection:bg-antique-gold/30 selection:text-ivory">
      <Navbar onEnquire={openEnquiry} />

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* Background image & cinematic gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/38902559/pexels-photo-38902559.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="JustPrem Himalayan Background"
              className="h-full w-full object-cover scale-105 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/60 to-near-black/30" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-near-black/50 to-near-black" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <div className="inline-flex items-center gap-2 border border-antique-gold/30 bg-antique-gold/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-antique-gold mb-8 backdrop-blur-md">
              <Sparkles size={12} />
              <span>Sacred Journeys & Retreats</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-ivory leading-[1.1]">
              Journeys that take you closer to what matters.
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base md:text-lg font-light leading-relaxed text-stone/80">
              JustPrem brings together sacred pilgrimages, retreats, devotional music, ancient Himalayan culture, and deeply authentic human experiences.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
              <Link
                href="/retreats-and-pilgrimages"
                className="group relative inline-flex items-center gap-3 bg-antique-gold border border-antique-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-near-black transition-all duration-500 hover:bg-transparent hover:text-ivory shadow-2xl"
              >
                <span>Explore Journeys</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/our-story"
                className="inline-flex items-center gap-2 border border-antique-gold/40 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:border-antique-gold hover:bg-antique-gold/10 transition-all"
              >
                <span>Our Story</span>
              </Link>
            </div>
          </div>

          {/* Bottom indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone/40">
            <span className="text-[9px] uppercase tracking-ultra">Scroll</span>
            <div className="h-8 w-[1px] bg-gradient-to-b from-antique-gold/50 to-transparent animate-pulse" />
          </div>
        </section>

        {/* BRAND PILLARS / INTRODUCTION STATEMENT */}
        <section className="relative py-28 border-b border-antique-gold/10 bg-charcoal/30">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <span className="text-[10px] uppercase tracking-ultra text-antique-gold/70">
              The Essence of JustPrem
            </span>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl font-light leading-snug text-ivory">
              "We travel not to escape life, but so life does not escape us."
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-sm md:text-base font-light leading-relaxed text-stone/60">
              In a world of constant noise and shallow movement, JustPrem creates space for sacred pause. Through Himalayan pilgrimages, silence retreats, acoustic devotional music, and genuine heart communion, we guide seekers back home to themselves.
            </p>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-antique-gold/15 pt-12">
              <div className="text-center">
                <Mountain size={24} className="mx-auto text-antique-gold mb-3" />
                <h4 className="font-serif text-xl font-light text-ivory">Sacred Valleys</h4>
                <p className="mt-1 text-xs text-stone/50 font-light">Untouched Himalayan Sanctuaries</p>
              </div>

              <div className="text-center">
                <Music size={24} className="mx-auto text-antique-gold mb-3" />
                <h4 className="font-serif text-xl font-light text-ivory">Devotional Music</h4>
                <p className="mt-1 text-xs text-stone/50 font-light">Kirtan, Raga & Sound Baths</p>
              </div>

              <div className="text-center">
                <Heart size={24} className="mx-auto text-antique-gold mb-3" />
                <h4 className="font-serif text-xl font-light text-ivory">Inner Presence</h4>
                <p className="mt-1 text-xs text-stone/50 font-light">Meditation & Noble Silence</p>
              </div>

              <div className="text-center">
                <Users size={24} className="mx-auto text-antique-gold mb-3" />
                <h4 className="font-serif text-xl font-light text-ivory">Soul Connection</h4>
                <p className="mt-1 text-xs text-stone/50 font-light">Intimate Gatherings of Seekers</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FEATURED RETREATS & PILGRIMAGES SECTION */}
        <section className="py-28 px-6 md:px-12 mx-auto max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-antique-gold/70">
                Curated Experiences
              </span>
              <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-ivory">
                Retreats & Pilgrimages
              </h2>
            </div>
            <Link
              href="/retreats-and-pilgrimages"
              className="inline-flex items-center gap-2 text-xs uppercase font-medium tracking-wide-sm text-antique-gold hover:text-ivory transition-colors"
            >
              <span>View All Experiences</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </section>

        {/* 3. OUR STORY TEASER */}
        <section className="relative py-28 bg-charcoal/50 border-y border-antique-gold/10 overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] overflow-hidden border border-antique-gold/20">
              <img
                src="https://images.pexels.com/photos/32225795/pexels-photo-32225795.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Our Story Himalayan Wisdom"
                className="h-full w-full object-cover img-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-transparent opacity-60" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-antique-gold">
                Our Story & Origins
              </span>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl font-light text-ivory leading-tight">
                Born in the Silence of the Himalayan Mountains
              </h2>
              <p className="mt-6 text-sm md:text-base font-light leading-relaxed text-stone/70">
                JustPrem was born out of a deep reverence for the sacred mountains, devotional music, and the timeless tradition of Retreat. We believe that true travel transforms the inner landscape as much as the outer.
              </p>
              <p className="mt-4 text-sm font-light leading-relaxed text-stone/60">
                Each journey is carefully crafted to honor local Himalayan traditions, monastic wisdom, and intimate group harmony.
              </p>

              <div className="mt-10">
                <Link
                  href="/our-story"
                  className="group inline-flex items-center gap-3 border border-antique-gold/40 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:border-antique-gold hover:bg-antique-gold/10 transition-all"
                >
                  <span>Read Full Story</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. GALLERY & MUSIC SHOWCASE */}
        <section className="py-28 px-6 md:px-12 mx-auto max-w-[1400px]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-antique-gold/70">
              Atmosphere & Imagery
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-ivory">
              Moments from the Path
            </h2>
            <p className="mt-4 text-sm font-light text-stone/60">
              A visual journal of sacred temples, silent dawns, and heart-centered music circles.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square overflow-hidden border border-antique-gold/10">
              <img
                src="https://images.pexels.com/photos/34792307/pexels-photo-34792307.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Sacred River Meditation"
                className="h-full w-full object-cover img-zoom"
              />
            </div>
            <div className="aspect-square overflow-hidden border border-antique-gold/10">
              <img
                src="https://images.pexels.com/photos/32436570/pexels-photo-32436570.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Devotional Music Gathering"
                className="h-full w-full object-cover img-zoom"
              />
            </div>
            <div className="aspect-square overflow-hidden border border-antique-gold/10">
              <img
                src="https://images.pexels.com/photos/36520323/pexels-photo-36520323.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Himalayan Valley Silence"
                className="h-full w-full object-cover img-zoom"
              />
            </div>
            <div className="aspect-square overflow-hidden border border-antique-gold/10">
              <img
                src="https://images.pexels.com/photos/29764242/pexels-photo-29764242.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Sacred Shrine Reflections"
                className="h-full w-full object-cover img-zoom"
              />
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 border border-antique-gold/30 px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-antique-gold hover:border-antique-gold hover:text-ivory transition-all"
            >
              <span>Explore Gallery</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* 5. TESTIMONIALS & CONNECT CTA */}
        <section className="relative py-28 bg-gradient-to-b from-near-black via-charcoal to-near-black border-t border-antique-gold/20 text-center px-6">
          <div className="mx-auto max-w-4xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-antique-gold">
              Soul Reflections
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-ivory">
              "An unforgettable journey inward"
            </h2>
            <p className="mt-6 text-base md:text-lg font-serif italic text-stone/70 max-w-2xl mx-auto">
              "Walking through the high Nepalese valleys with JustPrem awakened a quiet clarity I hadn't felt in years. The music, the silence, and the family we created will stay with me forever."
            </p>
            <p className="mt-4 text-xs uppercase tracking-wide text-antique-gold">
              — Elena Rostova &middot; Switzerland
            </p>

            <div className="mt-16 pt-12 border-t border-antique-gold/10">
              <h3 className="font-serif text-2xl font-light text-ivory">Ready to begin your journey?</h3>
              <p className="mt-2 text-xs md:text-sm text-stone/50 font-light">
                Connect with our team to inquire about upcoming pilgrimages, retreats, and custom gatherings.
              </p>
              <div className="mt-8">
                <button
                  onClick={openEnquiry}
                  className="group inline-flex items-center gap-3 bg-antique-gold border border-antique-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-near-black hover:bg-transparent hover:text-ivory transition-all shadow-xl"
                >
                  <span>Enquire Now</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onEnquire={openEnquiry} />
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
    </div>
  );
}
