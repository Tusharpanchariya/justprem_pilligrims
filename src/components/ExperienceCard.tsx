'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, MapPin, Users, Clock, Sparkles } from 'lucide-react';
import { Experience } from '@/data/experiences';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const isPilgrimage = experience.type === 'pilgrimage';
  const linkHref = isPilgrimage
    ? `/pilgrimages/${experience.slug}`
    : `/retreats/${experience.slug}`;

  return (
    <div className="group relative overflow-hidden bg-charcoal/60 border border-antique-gold/15 transition-all duration-700 hover:border-antique-gold/50 hover:shadow-2xl">
      {/* Hero Image with Overlay */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={experience.heroImage}
          alt={experience.title}
          className="h-full w-full object-cover img-zoom"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-near-black/40 to-transparent opacity-90" />

        {/* Status Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase font-medium tracking-[0.18em] backdrop-blur-md border ${experience.status === 'upcoming'
                ? 'bg-antique-gold/20 text-antique-gold border-antique-gold/40'
                : 'bg-stone/10 text-stone/70 border-stone/20'
              }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${experience.status === 'upcoming' ? 'bg-antique-gold animate-pulse' : 'bg-stone/40'}`} />
            {experience.status === 'upcoming' ? 'Upcoming Journey' : 'Past Archive'}
          </span>
        </div>

        {/* Category Label */}
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ivory/80 bg-near-black/60 px-3 py-1 backdrop-blur-sm border border-white/10">
            {isPilgrimage ? 'Pilgrimage' : 'Retreat'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center gap-4 text-xs font-light text-antique-gold/80 mb-3">
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-antique-gold" />
              {experience.location}
            </span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-antique-gold" />
              {experience.duration}
            </span>
          </div>

          <h3 className="font-serif text-2xl md:text-3xl font-light text-ivory leading-tight group-hover:text-antique-gold transition-colors duration-500">
            {experience.title}
          </h3>

          <p className="mt-3 text-xs md:text-sm font-light leading-relaxed text-stone/60 line-clamp-3">
            {experience.shortDescription}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-8 pt-6 border-t border-antique-gold/10 flex items-center justify-between">
          <div className="text-xs text-stone/50 font-light flex items-center gap-1.5">
            <Calendar size={13} className="text-antique-gold/70" />
            <span>{experience.dates}</span>
          </div>

          <Link
            href={linkHref}
            className="inline-flex items-center gap-2 text-xs uppercase font-medium tracking-wide-sm text-antique-gold group-hover:text-ivory transition-colors"
          >
            <span>{isPilgrimage ? 'Explore Journey' : 'Explore Retreat'}</span>
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
