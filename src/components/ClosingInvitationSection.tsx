'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { EDITORIAL_EASING } from '@/lib/motion';

interface ClosingInvitationProps {
  onEnquire: () => void;
}

export default function ClosingInvitationSection({ onEnquire }: ClosingInvitationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="invitation"
      className="relative w-full bg-[#E5E8DF] text-[#2B3124] overflow-hidden py-28 sm:py-36 lg:py-44 border-b border-[#D5D9CD]"
    >
      {/* Subtle organic radial tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#F5F1E8]/60 via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-6 md:px-12 text-center">
        
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: EDITORIAL_EASING }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#70765A]/30 bg-[#F5F1E8]/50 backdrop-blur-sm text-[10px] md:text-[11px] uppercase tracking-[0.26em] text-[#555C45] mb-6"
        >
          <Sparkles size={11} className="text-[#70765A]" />
          <span>BEGIN THE JOURNEY</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: EDITORIAL_EASING, delay: 0.08 }}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-[#2B3124] leading-[1.08] tracking-[-0.015em]"
        >
          Come as you are.<br className="hidden sm:block" /> Walk with us.
        </motion.h2>

        {/* Supporting copy */}
        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: EDITORIAL_EASING, delay: 0.16 }}
          className="mt-6 sm:mt-8 font-serif italic text-lg sm:text-2xl text-[#4A5040] leading-relaxed max-w-2xl mx-auto"
        >
          Whether you are called to mountain silence, sacred pilgrimage, devotional music, or intimate community retreat &mdash; our circle is open to you.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: EDITORIAL_EASING, delay: 0.24 }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <button
            onClick={onEnquire}
            className="group inline-flex items-center justify-center gap-3 bg-[#38392E] text-[#F5F1E8] border border-[#38392E] px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium transition-all duration-500 hover:bg-[#2B3124] hover:shadow-lg rounded-sm w-full sm:w-auto"
          >
            <span>Enquire About a Journey</span>
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
          </button>

          <a
            href="#journeys"
            className="group inline-flex items-center justify-center gap-2 border border-[#38392E]/30 bg-transparent px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium text-[#2B3124] hover:border-[#38392E] hover:bg-[#F5F1E8]/70 transition-all duration-500 rounded-sm w-full sm:w-auto"
          >
            <span>View All Journeys</span>
            <span className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
          </a>
        </motion.div>

        {/* Reassurance note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: EDITORIAL_EASING, delay: 0.35 }}
          className="mt-10 text-[11px] sm:text-xs text-[#70765A] font-light tracking-wide"
        >
          Personalized itineraries &middot; Intimate group sizes &middot; Authentic spiritual tradition
        </motion.p>

      </div>
    </section>
  );
}
