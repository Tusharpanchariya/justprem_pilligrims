'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

import { ArrowUpRight } from 'lucide-react';

interface ManyPathsSectionProps {
  onEnquire?: () => void;
}

interface PathItem {
  number: string;
  verb: string;
  tag: string;
  title: string;
  description: string;
  actionText: string;
  href: string;
  image: string;
  imageAlt: string;
}

export default function ManyPathsSection({ onEnquire }: ManyPathsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Luxury editorial easing curve
  const easing = [0.16, 1, 0.3, 1] as const;

  // The four distinct ways people connect with the JustPrem global community
  const paths: PathItem[] = [
    {
      number: '01',
      verb: 'WALK',
      tag: 'Sacred Journeys',
      title: 'Retreats & Pilgrimages',
      description: 'Journey beyond the familiar, together.',
      actionText: 'Explore Pilgrimages',
      href: '/retreats-and-pilgrimages',
      image: 'https://images.pexels.com/photos/14461598/pexels-photo-14461598.jpeg?auto=compress&cs=tinysrgb&w=1200',
      imageAlt: 'Seekers walking along high mountain trails on a JustPrem pilgrimage',
    },
    {
      number: '02',
      verb: 'SIT',
      tag: 'Inner Stillness',
      title: 'Meditation & Yogic Practices',
      description: 'Make space for stillness and presence.',
      actionText: 'Explore Practices',
      href: '/retreats',
      image: 'https://images.pexels.com/photos/13849093/pexels-photo-13849093.jpeg?auto=compress&cs=tinysrgb&w=1200',
      imageAlt: 'Group seated in silent morning meditation and contemplation overlooking the mountains',
    },
    {
      number: '03',
      verb: 'SING',
      tag: 'Devotional Sound',
      title: 'Devotional Music & Events',
      description: 'Come together through music, mantra and kirtan.',
      actionText: 'Explore Devotional Music',
      href: '/retreats/himalayan-bhakti-retreat',
      image: 'https://images.pexels.com/photos/32436570/pexels-photo-32436570.jpeg?auto=compress&cs=tinysrgb&w=1200',
      imageAlt: 'Devotional kirtan gathering with harmonium, song and fire ceremony',
    },
    {
      number: '04',
      verb: 'CONNECT',
      tag: 'Global Kinship',
      title: 'Community & Gatherings',
      description: 'Meet kindred spirits and share meaningful experiences.',
      actionText: 'Join the Community',
      href: '/connect',
      image: '/about_page/PPF02632.webp',
      imageAlt: 'JustPrem community circle gathering in Rishikesh and across the globe',
    },
  ];

  return (
    <section
      id="many-paths"
      className="relative w-full bg-[#F2F4EE] text-[#2B3124] overflow-hidden py-24 sm:py-32 lg:py-40 border-b border-[#E1E5D8]"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
        
        {/* SECTION HEADER: Editorial Title & Poetic Intro */}
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easing }}
          >
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-[#4F5942] font-medium block">
              03 — FIND YOUR WAY
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: easing, delay: 0.1 }}
            className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-light text-[#2B3124] leading-[1.08] tracking-[-0.015em]"
          >
            Many Paths. One Community.
          </motion.h2>

          {/* Intro Description */}
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: easing, delay: 0.2 }}
            className="mt-5 font-serif italic text-lg sm:text-xl md:text-2xl font-light text-[#4A5040] leading-relaxed max-w-2xl"
          >
            There is no single way to arrive. Find the experiences, practices and people that speak to you.
          </motion.p>
        </div>

        {/* Refined horizontal divider revealed across */}
        <motion.div
          initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.15, ease: easing, delay: 0.25 }}
          style={{ originX: 0 }}
          className="mt-10 sm:mt-14 w-full h-[1px] bg-[#E1E5D8]"
        />

        {/* THE FOUR EXPERIENCES: Asymmetrical 2-Column Desktop Grid / Stacked Mobile */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 xl:gap-x-24 gap-y-20 sm:gap-y-24 lg:gap-y-32">
          {paths.map((item, index) => {
            // Apply slight vertical rhythm offset on the right column for an editorial spread feeling
            const isRightColumn = index % 2 === 1;

            return (
              <motion.article
                key={item.number}
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
                  href={item.href}
                  className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4F5942]"
                  aria-label={`${item.number} — ${item.verb}: ${item.title}`}
                >
                  {/* Portrait photograph with clipping-mask entrance and restrained scale on hover */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E2E6DA] border border-[#E1E5D8] shadow-[0_16px_40px_-15px_rgba(41,43,34,0.06)]">
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
                        src={item.image}
                        alt={item.imageAlt}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                        loading="lazy"
                      />

                      {/* Warm sage editorial film layer and delicate vignette */}
                      <div className="absolute inset-0 bg-[#F2F4EE]/5 mix-blend-multiply pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2B3124]/30 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-40 pointer-events-none" />

                      {/* Experience Verb Tag (e.g. 01 — WALK) */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase font-medium tracking-[0.24em] bg-[#F2F4EE]/95 text-[#2B3124] backdrop-blur-md border border-[#E1E5D8] shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#4F5942]" />
                          {item.number} — {item.verb}
                        </span>
                      </div>

                      {/* Arrow affordance in top right */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#F2F4EE]/90 text-[#2B3124] backdrop-blur-md border border-[#E1E5D8] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ArrowUpRight size={13} className="text-[#2B3124]" />
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Editorial Typography & Information (Fully readable without hover) */}
                  <div className="mt-8 flex flex-col">
                    {/* Minimal category metadata */}
                    <div className="flex items-center gap-2 text-xs text-[#6B735F] font-light">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#4F5942] font-medium">
                        {item.tag}
                      </span>
                    </div>

                    {/* Experience Title */}
                    <h3 className="mt-2.5 font-serif text-2xl sm:text-3xl lg:text-[2.2rem] font-light text-[#2B3124] leading-tight group-hover:text-[#4F5942] transition-colors duration-400">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 font-sans text-xs sm:text-sm font-light text-[#505747] leading-relaxed">
                      {item.description}
                    </p>

                    {/* Link Action */}
                    <div className="mt-6 pt-5 border-t border-[#E1E5D8]/80 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs uppercase font-medium tracking-[0.2em] text-[#2B3124] group-hover:text-[#4F5942] transition-colors duration-300">
                        <span>{item.actionText}</span>
                        <span className="transition-transform duration-300 ease-out group-hover:translate-x-1.5 inline-block text-sm">
                          &rarr;
                        </span>
                      </span>

                      <span className="font-serif italic text-xs tracking-wider text-[#7A826E]">
                        Path {item.number}
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
