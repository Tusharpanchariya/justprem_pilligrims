'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Quote,
  Compass,
  Landmark,
  Mountain,
  Music,
  Sun,
  VolumeX,
  Heart,
  Footprints,
  Waves,
} from 'lucide-react';
import { Experience } from '@/data/experiences';

interface ExperienceDetailViewProps {
  experience: Experience;
  onEnquire: () => void;
}

const ICON_MAP: Record<string, any> = {
  Landmark,
  Mountain,
  Sparkles,
  Music,
  Sun,
  Compass,
  VolumeX,
  Heart,
  Footprints,
  Waves,
};

export default function ExperienceDetailView({
  experience,
  onEnquire,
}: ExperienceDetailViewProps) {
  const [activeDay, setActiveDay] = useState<number | null>(0);

  const isPilgrimage = experience.type === 'pilgrimage';

  return (
    <div className="bg-near-black text-ivory">
      {/* 1. Cinematic Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <img
            src={experience.heroImage}
            alt={experience.title}
            className="h-full w-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/60 to-near-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-near-black/50 to-near-black" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-antique-gold/30 bg-antique-gold/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-antique-gold mb-6 backdrop-blur-md">
            <Sparkles size={12} />
            {isPilgrimage ? 'Sacred Himalayan Pilgrimage' : 'Transcendent Himalayan Retreat'}
          </span>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-ivory leading-[1.15]">
            {experience.title}
          </h1>

          <p className="mt-4 font-serif text-xl md:text-2xl font-light italic text-antique-gold/90">
            {experience.subtitle}
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-sm md:text-base font-light leading-relaxed text-stone/80">
            {experience.shortDescription}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onEnquire}
              className="group inline-flex items-center gap-3 bg-antique-gold border border-antique-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-near-black transition-all hover:bg-transparent hover:text-ivory shadow-xl"
            >
              <span>{experience.status === 'upcoming' ? 'Enquire & Reserve Spot' : 'Enquire for Future Editions'}</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#itinerary"
              className="inline-flex items-center gap-2 border border-antique-gold/30 px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] text-stone/80 hover:border-antique-gold hover:text-ivory transition-all"
            >
              View Itinerary
            </a>
          </div>
        </div>
      </section>

      {/* 2. Key Facts / Meta Bar */}
      <section className="relative z-20 -mt-8 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-sm border border-antique-gold/20 bg-charcoal/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-antique-gold/10 text-antique-gold">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-stone/50">Duration</p>
              <p className="font-serif text-lg text-ivory">{experience.duration}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-antique-gold/10 text-antique-gold">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-stone/50">Location</p>
              <p className="font-serif text-lg text-ivory truncate max-w-[150px]">{experience.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-antique-gold/10 text-antique-gold">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-stone/50">Group Size</p>
              <p className="font-serif text-lg text-ivory">{experience.groupSize}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-antique-gold/10 text-antique-gold">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-stone/50">Dates / Status</p>
              <p className="font-serif text-lg text-ivory truncate max-w-[150px]">{experience.dates}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About the Journey */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-antique-gold/70">
          The Experience Philosophy
        </p>
        <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-ivory">
          About the Journey
        </h2>
        <div className="mt-8 space-y-6 text-base md:text-lg font-light leading-relaxed text-stone/70">
          {experience.fullDescription.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>

      {/* 4. Highlights Grid */}
      <section className="bg-charcoal/40 py-24 border-y border-antique-gold/10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.25em] text-antique-gold/70">
              Essence of the Experience
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-ivory">
              Journey Highlights
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {experience.highlights.map((h, i) => {
              const IconComp = (h.icon && ICON_MAP[h.icon]) || Sparkles;
              return (
                <div
                  key={i}
                  className="group relative border border-antique-gold/15 bg-near-black/70 p-8 transition-all hover:border-antique-gold/40 hover:bg-near-black"
                >
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-antique-gold/10 text-antique-gold group-hover:scale-110 transition-transform">
                    <IconComp size={22} />
                  </div>
                  <h3 className="font-serif text-xl font-light text-ivory group-hover:text-antique-gold transition-colors">
                    {h.title}
                  </h3>
                  <p className="mt-3 text-xs md:text-sm font-light leading-relaxed text-stone/60">
                    {h.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Day-by-Day Timeline / Itinerary */}
      <section id="itinerary" className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-antique-gold/70">
            Day-by-Day Flow
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-ivory">
            The Journey Itinerary
          </h2>
        </div>

        <div className="mt-16 space-y-4">
          {experience.itinerary.map((item, idx) => {
            const isOpen = activeDay === idx;
            return (
              <div
                key={idx}
                className="border border-antique-gold/15 bg-charcoal/50 transition-colors overflow-hidden"
              >
                <button
                  onClick={() => setActiveDay(isOpen ? null : idx)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left hover:bg-antique-gold/5 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-serif text-lg text-antique-gold/80 font-medium">
                      {item.day}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl md:text-2xl font-light text-ivory">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone/50 mt-1 flex items-center gap-1">
                        <MapPin size={12} className="text-antique-gold/60" />
                        {item.location}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    size={20}
                    className={`text-antique-gold/70 transition-transform duration-300 ${isOpen ? 'rotate-180 text-antique-gold' : ''
                      }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-8 md:px-8 pt-2 border-t border-antique-gold/10 bg-near-black/40 animate-fade-up">
                    <p className="text-sm font-light leading-relaxed text-stone/70">
                      {item.description}
                    </p>

                    {item.highlights && item.highlights.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {item.highlights.map((hl, hIdx) => (
                          <span
                            key={hIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] bg-antique-gold/10 text-antique-gold/90 border border-antique-gold/20"
                          >
                            <CheckCircle2 size={12} />
                            {hl}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Teachers & Guidance */}
      {experience.guidance && experience.guidance.length > 0 && (
        <section className="bg-charcoal/40 py-24 border-t border-antique-gold/10">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.25em] text-antique-gold/70">
                Wisdom Keepers
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-ivory">
                Guidance & Facilitators
              </h2>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2">
              {experience.guidance.map((g, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-6 items-center border border-antique-gold/15 bg-near-black/70 p-6"
                >
                  <img
                    src={g.image}
                    alt={g.name}
                    className="h-32 w-32 object-cover border border-antique-gold/30 shrink-0"
                  />
                  <div>
                    <h3 className="font-serif text-2xl font-light text-ivory">{g.name}</h3>
                    <p className="text-xs uppercase tracking-wide text-antique-gold mt-1">{g.role}</p>
                    <p className="mt-3 text-xs md:text-sm font-light leading-relaxed text-stone/60">{g.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Gallery Section ("What the Journey Holds") */}
      {experience.gallery && experience.gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.25em] text-antique-gold/70">
              Visual Impressions
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-ivory">
              What the Journey Holds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experience.gallery.map((img, i) => (
              <div key={i} className="group relative aspect-[4/3] overflow-hidden border border-antique-gold/15">
                <img
                  src={img.url}
                  alt={img.caption}
                  className="h-full w-full object-cover img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-near-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                  <p className="text-xs font-serif italic text-ivory">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Included / Package Overview */}
      {experience.whatsIncluded && experience.whatsIncluded.length > 0 && (
        <section className="bg-charcoal/40 py-20 border-y border-antique-gold/10">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-center font-serif text-3xl font-light text-ivory">
              What Is Included
            </h2>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              {experience.whatsIncluded.map((inc, i) => (
                <div key={i} className="flex items-start gap-3 p-4 border border-antique-gold/10 bg-near-black/50">
                  <CheckCircle2 size={16} className="text-antique-gold shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm font-light text-stone/70">{inc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Testimonials */}
      {experience.testimonials && experience.testimonials.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <Quote size={36} className="mx-auto text-antique-gold/40 mb-6" />
          <h2 className="font-serif text-3xl font-light text-ivory mb-12">
            Pilgrim Reflections
          </h2>

          <div className="space-y-12">
            {experience.testimonials.map((t, idx) => (
              <blockquote key={idx} className="border-l-2 border-antique-gold/40 pl-6 text-left">
                <p className="font-serif text-xl md:text-2xl font-light italic leading-relaxed text-ivory/90">
                  "{t.quote}"
                </p>
                <footer className="mt-4 text-xs font-light text-antique-gold">
                  — {t.name}, <span className="text-stone/50">{t.location}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* 10. Book / Enquire Final CTA */}
      <section className="relative py-24 bg-gradient-to-b from-near-black via-charcoal to-near-black border-t border-antique-gold/20 text-center px-6">
        <div className="mx-auto max-w-3xl">
          <span className="text-[11px] uppercase tracking-[0.25em] text-antique-gold">
            Begin Your Journey
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-6xl font-light text-ivory">
            Step Into the Himalayas
          </h2>
          <p className="mt-6 text-sm md:text-base font-light text-stone/60">
            Spaces for our experiences are deliberately kept intimate to preserve authentic human connection and spiritual presence.
          </p>

          <div className="mt-10">
            <button
              onClick={onEnquire}
              className="group inline-flex items-center gap-3 bg-antique-gold border border-antique-gold px-10 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-near-black transition-all hover:bg-transparent hover:text-ivory shadow-2xl"
            >
              <span>Enquire & Reserve Spot</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
