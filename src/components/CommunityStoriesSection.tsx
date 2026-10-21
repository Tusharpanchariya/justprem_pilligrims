'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Mountain, Music, Heart, Users } from 'lucide-react';
import { EDITORIAL_EASING } from '@/lib/motion';

export default function CommunityStoriesSection() {
  const shouldReduceMotion = useReducedMotion();

  const pillars = [
    {
      icon: Mountain,
      title: 'Sacred Valleys',
      subtitle: 'Untouched Sanctuaries',
      description: 'Walking ancient paths where high peaks meet deep stillness.',
    },
    {
      icon: Music,
      title: 'Devotional Music',
      subtitle: 'Kirtan, Raga & Sound',
      description: 'Acoustic evening gatherings, sacred mantra, and fire ceremonies.',
    },
    {
      icon: Heart,
      title: 'Inner Presence',
      subtitle: 'Noble Silence & Stillness',
      description: 'Meditation and contemplative walks that quiet mental noise.',
    },
    {
      icon: Users,
      title: 'Soul Connection',
      subtitle: 'A Global Family',
      description: 'Intimate circles where seekers from around the world meet as kin.',
    },
  ];

  return (
    <section
      id="community"
      className="relative w-full bg-[#F5F1E8] text-[#2B3124] overflow-hidden py-24 sm:py-32 lg:py-40 border-b border-[#E8DFD0]"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
        
        {/* TOP EDITORIAL STATEMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authentic Community Portrait */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: EDITORIAL_EASING }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#E8DFD0] border border-[#E8DFD0] shadow-[0_20px_50px_-15px_rgba(45,47,38,0.1)]">
              <Image
                src="/about_page/PPF02632.webp"
                alt="JustPrem community gathering in Rishikesh"
                fill
                className="object-cover object-center transition-transform duration-1000 ease-out hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-[#F5F1E8]/5 mix-blend-multiply pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B3124]/30 via-transparent to-transparent opacity-50 pointer-events-none" />
            </div>

            {/* Editorial Caption Tag */}
            <div className="mt-4 flex items-center justify-between text-xs text-[#70765A]">
              <span className="font-serif italic text-sm text-[#4A5040]">
                Rishikesh &middot; The Living Sangha
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#70765A]">
                Est. 2021
              </span>
            </div>
          </motion.div>

          {/* Right Column: Editorial Manifesto & Lead */}
          <div className="lg:col-span-7 flex flex-col justify-center lg:pl-6">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EDITORIAL_EASING }}
            >
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-[#70765A] font-medium block mb-4">
                04 — THE SANGHA
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EDITORIAL_EASING, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#2B3124] leading-[1.08] tracking-[-0.015em]"
            >
              People are the place.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: EDITORIAL_EASING, delay: 0.2 }}
              className="mt-6 font-serif italic text-xl sm:text-2xl text-[#4A5040] leading-relaxed max-w-xl"
            >
              &ldquo;We travel not to escape life, but so life does not escape us.&rdquo;
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: EDITORIAL_EASING, delay: 0.28 }}
              className="mt-6 font-sans text-sm sm:text-base font-light text-[#505747] leading-[1.75] max-w-xl"
            >
              In a world of constant noise and shallow movement, JustPrem creates space for sacred pause. Through Himalayan pilgrimages, silence retreats, acoustic devotional music, and genuine heart communion, we guide seekers back home to themselves.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: EDITORIAL_EASING, delay: 0.36 }}
              className="mt-10"
            >
              <Link
                href="/our-story"
                className="group inline-flex items-center gap-3 border border-[#38392E]/40 bg-transparent px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium text-[#2B3124] hover:bg-[#38392E] hover:text-[#F5F1E8] hover:border-[#38392E] transition-all duration-500 rounded-sm"
              >
                <span>Read Full Story</span>
                <span className="transition-transform duration-500 group-hover:translate-x-1.5">&rarr;</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* FOUR PILLARS GRID */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EDITORIAL_EASING, delay: 0.2 }}
          className="mt-20 sm:mt-28 pt-12 sm:pt-16 border-t border-[#E8DFD0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-full bg-[#E8DFD0]/60 flex items-center justify-center text-[#70765A]">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#70765A]">
                    Pillar 0{idx + 1}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-light text-[#2B3124]">
                  {item.title}
                </h3>
                <p className="font-serif italic text-xs text-[#70765A] mt-0.5">
                  {item.subtitle}
                </p>
                <p className="mt-3 font-sans text-xs sm:text-sm font-light text-[#505747] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
