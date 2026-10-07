'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import { Sparkles, Heart, Music, Mountain, Compass, ShieldCheck } from 'lucide-react';

export default function OurStoryPage() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

  return (
    <div className="relative min-h-screen bg-near-black text-ivory">
      <Navbar onEnquire={openEnquiry} />

      <main className="pt-24">
        {/* 1. Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/29335518/pexels-photo-29335518.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="JustPrem Himalayan Landscape"
              className="h-full w-full object-cover scale-105 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/60 to-near-black/30" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <div className="inline-flex items-center gap-2 border border-antique-gold/30 bg-antique-gold/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-antique-gold mb-6 backdrop-blur-md">
              <Sparkles size={12} />
              <span>The Philosophy of JustPrem</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-ivory leading-tight">
              Our Story
            </h1>

            <p className="mt-6 font-serif text-xl md:text-2xl font-light italic text-antique-gold/90">
              "Love is the beginning, the path, and the destination."
            </p>
          </div>
        </section>

        {/* 2. What JustPrem Is & Why It Exists */}
        <section className="mx-auto max-w-4xl px-6 py-24">
          <div className="space-y-8 text-base md:text-lg font-light leading-relaxed text-stone/80">
            <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-antique-gold first-letter:float-left first-letter:mr-3 font-serif text-xl md:text-2xl text-ivory">
              JustPrem was founded on a simple realization: in a fast-paced modern world, human beings crave depth, spiritual connection, and authentic presence more than ever.
            </p>
            <p>
              The word <em>"Prem"</em> translates from ancient Sanskrit to pure, unconditional divine love. JustPrem is not a commercial travel agency; it is a spiritual, musical, and cultural sanctuary dedicated to leading small groups of earnest seekers into the sacred sanctuaries of the Himalayas.
            </p>
            <p>
              Whether sitting quietly by the glacial streams of Harsil, walking through the ancient stone streets of Mustang, or singing kirtan under starlit Nepalese skies, our journeys are structured as digital detoxes and heart communion.
            </p>
          </div>
        </section>

        {/* 3. The 4 Pillars */}
        <section className="bg-charcoal/40 py-24 border-y border-antique-gold/10">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <span className="text-[11px] uppercase tracking-[0.25em] text-antique-gold">
                Foundational Principles
              </span>
              <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-ivory">
                The Way of the Journey
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-antique-gold/15 bg-near-black/70 p-8">
                <div className="flex h-12 w-12 items-center justify-center bg-antique-gold/10 text-antique-gold mb-6">
                  <Mountain size={24} />
                </div>
                <h3 className="font-serif text-2xl font-light text-ivory">The Himalayan Connection</h3>
                <p className="mt-4 text-xs md:text-sm font-light leading-relaxed text-stone/60">
                  The Himalayas have been the abode of sages, yogis, and mystics for millennia. We honor this sacred geography by visiting living monastic communities, ancient temples, and silent alpine valleys.
                </p>
              </div>

              <div className="border border-antique-gold/15 bg-near-black/70 p-8">
                <div className="flex h-12 w-12 items-center justify-center bg-antique-gold/10 text-antique-gold mb-6">
                  <Music size={24} />
                </div>
                <h3 className="font-serif text-2xl font-light text-ivory">Music as Devotion (Bhakti)</h3>
                <p className="mt-4 text-xs md:text-sm font-light leading-relaxed text-stone/60">
                  Music is a bridge directly to the heart. Through acoustic kirtan, classical sitar ragas, and sound circles, we use sound vibration to quiet the mental chatter and awaken pure presence.
                </p>
              </div>

              <div className="border border-antique-gold/15 bg-near-black/70 p-8">
                <div className="flex h-12 w-12 items-center justify-center bg-antique-gold/10 text-antique-gold mb-6">
                  <Heart size={24} />
                </div>
                <h3 className="font-serif text-2xl font-light text-ivory">Authentic Human Connection</h3>
                <p className="mt-4 text-xs md:text-sm font-light leading-relaxed text-stone/60">
                  We limit group sizes strictly to 12–20 participants. This ensures every traveler feels seen, supported, and welcomed into a genuine soul family rather than a large tour group.
                </p>
              </div>

              <div className="border border-antique-gold/15 bg-near-black/70 p-8">
                <div className="flex h-12 w-12 items-center justify-center bg-antique-gold/10 text-antique-gold mb-6">
                  <Compass size={24} />
                </div>
                <h3 className="font-serif text-2xl font-light text-ivory">Respect & Conscious Travel</h3>
                <p className="mt-4 text-xs md:text-sm font-light leading-relaxed text-stone/60">
                  We treads softly. We support local Himalayan families, stay in eco-crafted lodges, and preserve local monastic customs with deep reverence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. The People Behind JustPrem */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-antique-gold">
              Guardians of the Circle
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-ivory">
              The People Behind JustPrem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="border border-antique-gold/15 bg-charcoal/40 p-8 flex flex-col md:flex-row gap-6 items-center">
              <img
                src="https://images.pexels.com/photos/29764242/pexels-photo-29764242.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Prem Prakash"
                className="h-36 w-36 object-cover border border-antique-gold/30 shrink-0"
              />
              <div>
                <h3 className="font-serif text-2xl font-light text-ivory">Prem Prakash</h3>
                <p className="text-xs uppercase tracking-wide text-antique-gold mt-1">Founder & Sacred Musician</p>
                <p className="mt-3 text-xs md:text-sm font-light leading-relaxed text-stone/60">
                  Prem has spent over 15 years traveling, meditating, and recording devotional music across the Himalayas. His vision is to share the quiet beauty of mountain spirituality with earnest travelers.
                </p>
              </div>
            </div>

            <div className="border border-antique-gold/15 bg-charcoal/40 p-8 flex flex-col md:flex-row gap-6 items-center">
              <img
                src="https://images.pexels.com/photos/36529362/pexels-photo-36529362.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Sunita Gurung"
                className="h-36 w-36 object-cover border border-antique-gold/30 shrink-0"
              />
              <div>
                <h3 className="font-serif text-2xl font-light text-ivory">Sunita Gurung</h3>
                <p className="text-xs uppercase tracking-wide text-antique-gold mt-1">Himalayan Experience Director</p>
                <p className="mt-3 text-xs md:text-sm font-light leading-relaxed text-stone/60">
                  Born in the shadow of the Annapurnas, Sunita weaves local Nepalese hospitality, monastic relationships, and seamless mountain logistics for every Retreat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CTA */}
        <section className="py-24 bg-gradient-to-b from-near-black via-charcoal to-near-black border-t border-antique-gold/20 text-center px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-3xl md:text-5xl font-light text-ivory">
              Walk the Path with Us
            </h2>
            <p className="mt-4 text-sm font-light text-stone/60">
              We invite you to join our next pilgrimage or retreat experience in the Himalayas.
            </p>
            <div className="mt-8">
              <button
                onClick={openEnquiry}
                className="bg-antique-gold text-near-black px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-transparent hover:text-ivory border border-antique-gold transition-all shadow-xl"
              >
                Connect & Enquire
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
