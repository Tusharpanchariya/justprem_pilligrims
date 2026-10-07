'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';

export default function RetreatsAndPilgrimagesPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

  return (
    <div className="relative min-h-screen bg-near-black text-ivory">
      <Navbar onEnquire={openEnquiry} />

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/32436570/pexels-photo-32436570.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Retreats & Pilgrimages Hero"
              className="h-full w-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/70 to-near-black/40" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-ivory tracking-tight leading-tight">
              Retreats & Pilgrimages
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg font-light leading-relaxed text-ivory/80">
              Where devotion meets journey. Explore sacred sound, transformation, and spiritual travel
            </p>
          </div>
        </section>

        {/* 2. NEPAL PILGRIMAGE SPLIT SECTION */}
        <section className="relative bg-near-black border-y border-antique-gold/15">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">
            {/* Left Column: Dark Mountain Overlay Content */}
            <div className="relative flex flex-col justify-between p-8 md:p-14 lg:p-16 bg-near-black overflow-hidden border-b lg:border-b-0 lg:border-r border-antique-gold/15">
              {/* Background mountain image with dark overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.pexels.com/photos/38902559/pexels-photo-38902559.jpeg?auto=compress&cs=tinysrgb&w=1920"
                  alt="Mountain Background"
                  className="h-full w-full object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-near-black via-near-black/90 to-near-black/80" />
              </div>

              <div className="relative z-10">
                <span className="inline-block text-[10px] uppercase tracking-[0.25em] text-antique-gold mb-4 font-medium">
                  Featured Pilgrimage
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-ivory leading-tight">
                  Nepal Retreat-Heart of the Himalayas
                </h2>

                {/* Metadata Row */}
                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-stone/70 border-y border-antique-gold/15 py-4">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wide text-antique-gold/70">Duration</span>
                    <span className="font-serif text-sm text-ivory">12 Days</span>
                  </div>
                  <div className="h-6 w-[1px] bg-antique-gold/20" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-wide text-antique-gold/70">Location</span>
                    <span className="font-serif text-sm text-ivory">Kathmandu & Mustang, Nepal</span>
                  </div>
                  <div className="h-6 w-[1px] bg-antique-gold/20" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-wide text-antique-gold/70">Group Size</span>
                    <span className="font-serif text-sm text-ivory">15–18 People</span>
                  </div>
                </div>

                <p className="mt-6 text-xs md:text-sm font-light leading-relaxed text-stone/70">
                  A sacred journey through the ancient temples, high-altitude mountain sanctuaries, living traditions, and devotional music circles of Nepal.
                </p>

                {/* Highlights list */}
                <div className="mt-8">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-antique-gold mb-3 font-medium">
                    Highlights:
                  </h4>
                  <ul className="space-y-2 text-xs md:text-sm font-light text-ivory/80">
                    <li className="flex items-center gap-2">
                      <span className="text-antique-gold">✦</span> Sacred temple visits & Pashupatinath fires
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-antique-gold">✦</span> Daily morning meditation & pranayama
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-antique-gold">✦</span> Cultural Himalayan valley walks
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-antique-gold">✦</span> Devotional music & satsangs
                    </li>
                  </ul>
                </div>
              </div>

              {/* Learn More Button -> Opens the full original Nepal Pilgrimage UI */}
              <div className="relative z-10 mt-10">
                <Link
                  href="/pilgrimages/nepal"
                  className="inline-flex items-center justify-center border border-antique-gold/60 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-antique-gold hover:text-near-black transition-all duration-500 shadow-xl"
                >
                  <span>Learn More</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Group / Pilgrim Experience Photo */}
            <div className="relative min-h-[400px] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/14461598/pexels-photo-14461598.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Pilgrims Group Gathering in Nepal"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-near-black/60 via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </section>

        {/* 4. JOIN US BANNER */}
        <section className="relative py-32 overflow-hidden text-center border-t border-antique-gold/20">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/38902559/pexels-photo-38902559.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Himalayan Forest Background"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-near-black/85" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl px-6">
            <h2 className="font-serif text-4xl sm:text-6xl font-light text-ivory tracking-wide">
              Join us
            </h2>
            <p className="mt-4 text-sm font-light text-stone/60">
              Reserve your place on our upcoming sacred Himalayan experiences.
            </p>

            <div className="mt-10">
              <button
                onClick={openEnquiry}
                className="border border-antique-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivory bg-antique-gold/10 hover:bg-antique-gold hover:text-near-black transition-all shadow-xl"
              >
                Enquire Now
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer onEnquire={openEnquiry} />
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
    </div>
  );
}
