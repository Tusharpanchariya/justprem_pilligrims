'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { experiences } from '@/data/experiences';

interface SacredOfferingsSectionProps {
  onEnquire?: () => void;
}

export default function SacredOfferingsSection({ onEnquire }: SacredOfferingsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Luxury editorial easing curve
  const easing = [0.16, 1, 0.3, 1] as const;

  // Real upcoming journeys mapped from project data
  const upcomingJourneys = [
    {
      id: 'nepal-sacred-himalayas',
      plateNumber: '01',
      title: 'A Journey Through Sacred Nepal',
      subtitle: 'Heart of the Himalayas Pilgrimage',
      category: 'Pilgrimage',
      destination: 'Kathmandu, Pokhara & Sacred Himalayan Valleys',
      dates: 'April 24 – May 5, 2027',
      duration: '12 Days',
      season: 'Spring 2027',
      shortDescription:
        'An immersive pilgrimage through sacred temples, ancient stupas, high Himalayan valleys, and living spiritual traditions of Nepal.',
      href: '/pilgrimages/nepal',
      image: '/places_images/Poon-Hill-5058.jpg',
      imageAlt: 'Prayer flags flutter over high Annapurna ridges during the Sacred Nepal Pilgrimage',
    },
    {
      id: 'mustang-ancient-kingdom',
      plateNumber: '02',
      title: 'Upper Mustang — The Forgotten Kingdom',
      subtitle: 'Trans-Himalayan Sacred Odyssey',
      category: 'Pilgrimage',
      destination: 'Lo Manthang & Upper Mustang, Nepal',
      dates: 'May 10 – 23, 2027',
      duration: '14 Days',
      season: 'Spring 2027',
      shortDescription:
        'Journey into the untouched walled kingdom of Lo Manthang, 8th-century cliff monasteries, and Tibet-bordered high desert valleys.',
      href: '/pilgrimages/mustang-ancient-kingdom',
      image:
        'https://images.pexels.com/photos/32261503/pexels-photo-32261503.jpeg?auto=compress&cs=tinysrgb&w=1920',
      imageAlt: 'Ancient red rock canyons and monasteries of the walled kingdom of Lo Manthang',
    },
    {
      id: 'himalayan-bhakti-retreat',
      plateNumber: '03',
      title: 'Himalayan Bhakti Retreat',
      subtitle: 'A Journey of Devotion, Music & Quietude',
      category: 'Retreat',
      destination: 'Harsil Valley, Sacred Garhwal Himalayas',
      dates: 'April 18 – 24, 2027',
      duration: '7 Days',
      season: 'Spring 2027',
      shortDescription:
        'A 7-day immersion in pine-forested alpine valleys, morning silence, devotional kirtan, and pristine Himalayan rivers.',
      href: '/retreats/himalayan-bhakti-retreat',
      image:
        'https://images.pexels.com/photos/36520323/pexels-photo-36520323.jpeg?auto=compress&cs=tinysrgb&w=1920',
      imageAlt: 'Deodar pine forests and quiet riverbanks of Harsil Valley during the Bhakti Retreat',
    },
    {
      id: 'silence-and-sound-rishikesh',
      plateNumber: '04',
      title: 'Silence & Sacred Sound Retreat',
      subtitle: '3 Days of Mauna & Classical Raga Immersion',
      category: 'Retreat',
      destination: 'Upper Rishikesh Ganga Valley, Foothills of Himalayas',
      dates: 'November 08 – 12, 2026',
      duration: '5 Days',
      season: 'Autumn 2026',
      shortDescription:
        'Deepen inner quiet with 3 days of noble silence, sound baths, sitar ragas, and Ganga river meditations.',
      href: '/retreats/silence-and-sound-rishikesh',
      image:
        'https://images.pexels.com/photos/34792307/pexels-photo-34792307.jpeg?auto=compress&cs=tinysrgb&w=1920',
      imageAlt: 'Dawn mist rising over the sacred Ganga river in Upper Rishikesh',
    },
  ];

  return (
    <section
      id="journeys"
      className="relative w-full bg-[#FAF7F2] text-[#292B22] overflow-hidden py-24 sm:py-32 lg:py-40 border-b border-[#E8E0D2]"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
        {/* SECTION HEADER: Editorial Header & Right-Aligned Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: easing }}
            >
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-[#51583D] font-medium block">
                02 — THE JOURNEYS
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: easing, delay: 0.1 }}
              className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-light text-[#292B22] leading-[1.08] tracking-[-0.015em]"
            >
              Our Sacred Offerings
            </motion.h2>
          </div>

          {/* Right-aligned link */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: easing, delay: 0.2 }}
            className="md:pb-2"
          >
            <Link
              href="/retreats-and-pilgrimages"
              className="group inline-flex items-center gap-2.5 text-xs sm:text-sm uppercase tracking-[0.22em] font-medium text-[#292B22] hover:text-[#51583D] transition-colors duration-300 pb-1.5 border-b border-[#292B22]/25 hover:border-[#51583D]"
              aria-label="View all journeys"
            >
              <span>View all journeys</span>
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1.5 inline-block text-base leading-none">
                &rarr;
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Refined horizontal divider revealed across */}
        <motion.div
          initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.15, ease: easing, delay: 0.25 }}
          style={{ originX: 0 }}
          className="mt-8 sm:mt-12 w-full h-[1px] bg-[#E8E0D2]"
        />

        {/* EDITORIAL JOURNEYS COLLECTION: Asymmetrical 2-Column Desktop Grid / Single-Column Mobile */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 xl:gap-x-24 gap-y-20 sm:gap-y-24 lg:gap-y-32">
          {upcomingJourneys.map((journey, index) => {
            // Apply slight vertical rhythm offset on the right column for an editorial spread feeling
            const isRightColumn = index % 2 === 1;

            return (
              <motion.article
                key={journey.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{
                  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.9,
                      ease: easing,
                      delay: isRightColumn ? 0.15 : 0.05,
                    },
                  },
                }}
                className={`group flex flex-col justify-between ${
                  isRightColumn ? 'md:pt-16 lg:pt-24' : ''
                }`}
              >
                <Link
                  href={journey.href}
                  className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-[#51583D]"
                  aria-label={`${journey.title} — ${journey.category} in ${journey.destination}`}
                >
                  {/* Portrait photograph with clipping-mask entrance and restrained scale on hover */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E8E0D2] border border-[#E8E0D2] shadow-[0_16px_40px_-15px_rgba(41,43,34,0.08)]">
                    <motion.div
                      variants={{
                        hidden: {
                          clipPath: shouldReduceMotion
                            ? 'inset(0% 0% 0% 0%)'
                            : 'inset(100% 0% 0% 0%)',
                          y: shouldReduceMotion ? 0 : 20,
                        },
                        visible: {
                          clipPath: 'inset(0% 0% 0% 0%)',
                          y: 0,
                          transition: {
                            duration: 1.1,
                            ease: easing,
                            delay: isRightColumn ? 0.25 : 0.15,
                          },
                        },
                      }}
                      className="h-full w-full relative"
                    >
                      <img
                        src={journey.image}
                        alt={journey.imageAlt}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                        loading="lazy"
                      />

                      {/* Warm editorial film layer and delicate vignette */}
                      <div className="absolute inset-0 bg-[#FAF7F2]/5 mix-blend-multiply pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#292B22]/30 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-40 pointer-events-none" />

                      {/* Category Pill Tag */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase font-medium tracking-[0.22em] bg-[#FAF7F2]/95 text-[#292B22] backdrop-blur-md border border-[#E8E0D2] shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#51583D]" />
                          {journey.category}
                        </span>
                      </div>

                      {/* Editorial Plate Number */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="font-serif italic text-xs tracking-wider text-[#292B22]/80 bg-[#FAF7F2]/90 px-2.5 py-0.5 backdrop-blur-md border border-[#E8E0D2]">
                          Plate {journey.plateNumber}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Editorial Typography & Metadata */}
                  <div className="mt-8 flex flex-col">
                    {/* Metadata line: Destination, Duration, Dates */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#736F63] font-light">
                      <span className="flex items-center gap-1.5 text-[#51583D] font-medium tracking-wide">
                        <MapPin size={12} className="text-[#51583D] shrink-0" />
                        <span>{journey.destination}</span>
                      </span>
                      <span className="text-[#A58E70]">&middot;</span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-[#A58E70] shrink-0" />
                        <span>{journey.duration}</span>
                      </span>
                      <span className="text-[#A58E70]">&middot;</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#A58E70] shrink-0" />
                        <span>{journey.dates}</span>
                      </span>
                    </div>

                    {/* Journey Title */}
                    <h3 className="mt-3.5 font-serif text-2xl sm:text-3xl lg:text-[2.2rem] font-light text-[#292B22] leading-tight group-hover:text-[#51583D] transition-colors duration-400">
                      {journey.title}
                    </h3>

                    {/* Subtitle / Poetic Essence */}
                    <p className="mt-1 font-serif italic text-sm sm:text-base text-[#736F63]">
                      {journey.subtitle}
                    </p>

                    {/* Short Description */}
                    <p className="mt-3.5 font-sans text-xs sm:text-sm font-light text-[#555246] leading-relaxed line-clamp-3">
                      {journey.shortDescription}
                    </p>

                    {/* Footer Row: Explore Action + Season */}
                    <div className="mt-6 pt-5 border-t border-[#E8E0D2]/75 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs uppercase font-medium tracking-[0.2em] text-[#292B22] group-hover:text-[#51583D] transition-colors duration-300">
                        <span>Explore Journey</span>
                        <span className="transition-transform duration-300 ease-out group-hover:translate-x-1.5 inline-block text-sm">
                          &rarr;
                        </span>
                      </span>

                      <span className="text-[11px] uppercase tracking-[0.2em] text-[#736F63] font-light">
                        {journey.season}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
