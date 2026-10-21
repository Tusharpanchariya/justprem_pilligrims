'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Instagram } from 'lucide-react';
import { EDITORIAL_EASING } from '@/lib/motion';

interface GalleryMoment {
  id: string;
  image: string;
  title: string;
  location: string;
  tag: string;
  aspect: string;
}

const MOMENTS: GalleryMoment[] = [
  {
    id: 'kirtan',
    image: '/phots_for_gallery/DSC04045.JPG',
    title: 'Devotional Kirtan & Chanting',
    location: 'Nepal Sacred Valley',
    tag: 'Sacred Sound',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'poon-hill',
    image: '/places_images/Poon-Hill-5058.jpg',
    title: 'Himalayan Mountain Silence',
    location: 'Annapurna Range',
    tag: 'Pilgrimage',
    aspect: 'aspect-[16/10]',
  },
  {
    id: 'meditation',
    image: '/phots_for_gallery/DSC04529.JPG',
    title: 'Group Meditation & Circle',
    location: 'Muktinath Valley',
    tag: 'Inner Stillness',
    aspect: 'aspect-square',
  },
  {
    id: 'people',
    image: '/phots_for_gallery/DSC04907.JPG',
    title: 'Cultural Village Walk',
    location: 'Himalayan Village',
    tag: 'Community',
    aspect: 'aspect-square',
  },
  {
    id: 'stupa',
    image: '/phots_for_gallery/Kathmandu 2.png',
    title: 'Boudhanath Stupa Serenity',
    location: 'Kathmandu, Nepal',
    tag: 'Sacred Places',
    aspect: 'aspect-[4/5]',
  },
];

export default function GalleryShowcaseSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="gallery"
      className="relative w-full bg-[#F5F1E8] text-[#2B3124] overflow-hidden py-24 sm:py-32 lg:py-36 border-b border-[#E8DFD0]"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 sm:pb-16 border-b border-[#E8DFD0]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EDITORIAL_EASING }}
              className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-[#70765A] font-medium block mb-3"
            >
              06 — ATMOSPHERE
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: EDITORIAL_EASING, delay: 0.08 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#2B3124] leading-[1.1] tracking-[-0.015em]"
            >
              Moments from the Path
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: EDITORIAL_EASING, delay: 0.15 }}
            className="flex flex-col items-start md:items-end gap-3"
          >
            <p className="font-sans text-xs sm:text-sm text-[#5C6352] max-w-sm font-light leading-relaxed md:text-right">
              A curated visual journal of sacred shrines, dawn meditation, and intimate heart circles.
            </p>
            <a
              href="https://www.instagram.com/justprem_community/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium text-[#70765A] hover:text-[#2B3124] transition-colors"
            >
              <Instagram size={13} strokeWidth={1.5} />
              <span>@justprem_community</span>
            </a>
          </motion.div>
        </div>

        {/* EDITORIAL MOSAIC GRID */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Card 1: Large Featured Portrait (Col 1-4) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EDITORIAL_EASING }}
            className="md:col-span-4 flex flex-col"
          >
            <div className="group relative w-full h-full min-h-[420px] overflow-hidden rounded-sm bg-[#E8DFD0] border border-[#E8DFD0]">
              <Image
                src={MOMENTS[0].image}
                alt={MOMENTS[0].title}
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#282E21]/75 via-[#282E21]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute bottom-6 left-6 right-6 text-[#F5F1E8]">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#DDE0D3] block font-medium mb-1">
                  {MOMENTS[0].tag}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#F5F1E8] leading-tight">
                  {MOMENTS[0].title}
                </h3>
                <p className="text-xs text-[#E8DFD0]/80 mt-1 font-sans">
                  {MOMENTS[0].location}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Center Column: Top Wide + Bottom Two Squares (Col 5-8) */}
          <div className="md:col-span-5 flex flex-col gap-6 lg:gap-8">
            
            {/* Top Wide */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EDITORIAL_EASING, delay: 0.1 }}
              className="group relative w-full aspect-[16/10] overflow-hidden rounded-sm bg-[#E8DFD0] border border-[#E8DFD0]"
            >
              <Image
                src={MOMENTS[1].image}
                alt={MOMENTS[1].title}
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#282E21]/70 via-transparent to-transparent opacity-75 group-hover:opacity-85 transition-opacity duration-500" />
              
              <div className="absolute bottom-5 left-5 right-5 text-[#F5F1E8]">
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#DDE0D3] block font-medium">
                  {MOMENTS[1].tag}
                </span>
                <h3 className="font-serif text-xl font-light text-[#F5F1E8] leading-tight mt-0.5">
                  {MOMENTS[1].title}
                </h3>
                <p className="text-[11px] text-[#E8DFD0]/80 font-sans">
                  {MOMENTS[1].location}
                </p>
              </div>
            </motion.div>

            {/* Bottom Row of 2 Squares */}
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              {/* Square 1 */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EDITORIAL_EASING, delay: 0.15 }}
                className="group relative w-full aspect-square overflow-hidden rounded-sm bg-[#E8DFD0] border border-[#E8DFD0]"
              >
                <Image
                  src={MOMENTS[2].image}
                  alt={MOMENTS[2].title}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#282E21]/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 text-[#F5F1E8]">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#DDE0D3] block">
                    {MOMENTS[2].tag}
                  </span>
                  <p className="font-serif text-sm font-light text-[#F5F1E8] leading-snug mt-0.5">
                    {MOMENTS[2].title}
                  </p>
                </div>
              </motion.div>

              {/* Square 2 */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EDITORIAL_EASING, delay: 0.2 }}
                className="group relative w-full aspect-square overflow-hidden rounded-sm bg-[#E8DFD0] border border-[#E8DFD0]"
              >
                <Image
                  src={MOMENTS[3].image}
                  alt={MOMENTS[3].title}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#282E21]/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 text-[#F5F1E8]">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#DDE0D3] block">
                    {MOMENTS[3].tag}
                  </span>
                  <p className="font-serif text-sm font-light text-[#F5F1E8] leading-snug mt-0.5">
                    {MOMENTS[3].title}
                  </p>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Right Column: Tall Stupa Sanctuary Card (Col 9-12) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EDITORIAL_EASING, delay: 0.25 }}
            className="md:col-span-3 flex flex-col"
          >
            <div className="group relative w-full h-full min-h-[420px] overflow-hidden rounded-sm bg-[#E8DFD0] border border-[#E8DFD0]">
              <Image
                src={MOMENTS[4].image}
                alt={MOMENTS[4].title}
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#282E21]/75 via-[#282E21]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute bottom-6 left-6 right-6 text-[#F5F1E8]">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#DDE0D3] block font-medium mb-1">
                  {MOMENTS[4].tag}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#F5F1E8] leading-tight">
                  {MOMENTS[4].title}
                </h3>
                <p className="text-xs text-[#E8DFD0]/80 mt-1 font-sans">
                  {MOMENTS[4].location}
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* BOTTOM ACTION */}
        <div className="mt-14 text-center">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 border border-[#38392E]/40 bg-transparent px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium text-[#2B3124] hover:bg-[#38392E] hover:text-[#F5F1E8] hover:border-[#38392E] transition-all duration-500 rounded-sm"
          >
            <span>Explore Full Gallery Archive</span>
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
