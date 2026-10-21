'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Quote, ArrowRight, Star } from 'lucide-react';
import { EDITORIAL_EASING } from '@/lib/motion';

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
    id: 'elena',
    name: 'Elena Rostova',
    location: 'Zurich, Switzerland',
    role: 'Artist & Yoga Practitioner',
    journeyAttended: 'A Journey Through Sacred Nepal',
    quote:
      'This Retreat was not a vacation; it was a homecoming. Walking through Nepal with JustPrem created space for my soul to breathe in ways I never thought possible. The music circles at dusk will stay with me for life.',
    image: 'https://images.pexels.com/photos/19375318/pexels-photo-19375318.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'marcus',
    name: 'Marcus Vance',
    location: 'Melbourne, Australia',
    role: 'Architect',
    journeyAttended: 'Himalayan Bhakti Retreat',
    quote:
      'The harmony of sacred devotional music, Himalayan silence, and thoughtful guidance made this the single most profound experience of my life. I came carrying heavy stress and returned with a clear heart.',
    image: 'https://images.pexels.com/photos/37371223/pexels-photo-37371223.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    location: 'Vancouver, Canada',
    role: 'Therapist',
    journeyAttended: 'Silence & Sacred Sound Retreat',
    quote:
      '3 days of noble silence along the Ganga in Rishikesh reset my entire nervous system. Listening to classical sitar ragas as dusk settled over the river felt like a divine gift.',
    image: 'https://images.pexels.com/photos/20808434/pexels-photo-20808434.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'julian-maya',
    name: 'Julian & Maya',
    location: 'London, UK',
    role: 'Documentary Filmmakers',
    journeyAttended: 'Upper Mustang Retreat',
    quote:
      'Upper Mustang with JustPrem felt like stepping into an ancient biblical landscape. Prem and the local guides held the container with so much reverence and authenticity.',
    image: 'https://images.pexels.com/photos/29764242/pexels-photo-29764242.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function TestimonialsEditorialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const current = TESTIMONIALS[activeIndex];

  return (
    <section
      id="testimonials"
      className="relative w-full bg-[#EFEAE1] text-[#2B3124] overflow-hidden py-24 sm:py-32 lg:py-36 border-b border-[#E0D7C8]"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 sm:pb-16 border-b border-[#DFD5C5]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EDITORIAL_EASING }}
              className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-[#70765A] font-medium block mb-3"
            >
              05 — REFLECTIONS
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: EDITORIAL_EASING, delay: 0.08 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#2B3124] leading-[1.1] tracking-[-0.015em]"
            >
              Words from the Path
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: EDITORIAL_EASING, delay: 0.15 }}
            className="font-sans text-xs sm:text-sm text-[#5C6352] max-w-md font-light leading-relaxed"
          >
            Reflections from seekers, artists, and travelers who have walked with JustPrem across sacred valleys and silent dawns.
          </motion.p>
        </div>

        {/* MAIN EDITORIAL SPOTLIGHT */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Portrait & Journey Badge */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-sm bg-[#DFD5C5] border border-[#D5CDC0] shadow-[0_15px_35px_-10px_rgba(43,49,36,0.12)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.75, ease: EDITORIAL_EASING }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#282E21]/60 via-transparent to-transparent opacity-60" />
                  
                  {/* Overlay Journey Tag */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#E8DFD0]/90 block">
                      Journey Attended
                    </span>
                    <p className="font-serif text-lg text-[#F5F1E8] font-light mt-0.5">
                      {current.journeyAttended}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Large Pull-Quote & Pilgrim Selector */}
          <div className="lg:col-span-7 flex flex-col justify-between min-h-[380px]">
            <div>
              <Quote size={40} className="text-[#AC765E]/40 mb-6" strokeWidth={1} />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
                  transition={{ duration: 0.6, ease: EDITORIAL_EASING }}
                >
                  <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#2B3124] leading-[1.3] tracking-[-0.01em]">
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>

                  <div className="mt-8 pt-6 border-t border-[#DFD5C5] flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-xl sm:text-2xl font-light text-[#2B3124]">
                        {current.name}
                      </h4>
                      <p className="text-xs text-[#70765A] mt-1 font-sans">
                        {current.role} &middot; <span className="text-[#38392E] font-medium">{current.location}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[#AC765E]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pilgrim Nav Switcher */}
            <div className="mt-12 pt-8 border-t border-[#DFD5C5]">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#70765A] font-medium block mb-4">
                Select Pilgrim Reflection
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TESTIMONIALS.map((t, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveIndex(idx)}
                      className={`text-left p-3 rounded-sm transition-all duration-300 border ${
                        isActive
                          ? 'bg-[#F5F1E8] border-[#38392E] shadow-sm'
                          : 'bg-transparent border-[#DFD5C5] hover:border-[#70765A] hover:bg-[#F5F1E8]/50'
                      }`}
                    >
                      <p
                        className={`text-xs font-serif font-light transition-colors ${
                          isActive ? 'text-[#2B3124] font-medium' : 'text-[#5C6352]'
                        }`}
                      >
                        {t.name}
                      </p>
                      <p className="text-[10px] text-[#70765A] font-sans truncate mt-0.5">
                        {t.location.split(',')[1]?.trim() || t.location}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Action Link to Full Testimonials Page */}
              <div className="mt-8 flex items-center justify-between">
                <Link
                  href="/testimonials"
                  className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#38392E] hover:text-[#70765A] transition-colors"
                >
                  <span>Explore All Pilgrim Reflections</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
