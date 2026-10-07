'use client';

import Link from 'next/link';
import { Instagram, Youtube, Mail, Phone, Sparkles } from 'lucide-react';

interface FooterProps {
  onEnquire: () => void;
}

export default function Footer({ onEnquire }: FooterProps) {
  return (
    <footer className="relative bg-near-black px-6 pt-24 pb-12 md:px-12 border-t border-antique-gold/15">
      <div className="mx-auto max-w-[1400px]">
        {/* Top section */}
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-3xl font-light tracking-wide text-ivory flex items-center gap-2">
              <span className="text-antique-gold font-serif italic text-xl">✦</span>
              <span>JustPrem</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-stone/55">
              Journeys that take you closer to what matters. Sacred pilgrimages, devotional music, silence retreats, and authentic human experiences across the Himalayas.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-wide-sm text-antique-gold/70 font-semibold">
              Explore & Navigate
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/retreats-and-pilgrimages"
                  className="text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  Retreats & Pilgrimages
                </Link>
              </li>
              <li>
                <Link
                  href="/pilgrimages"
                  className="text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  Nepal Pilgrimages
                </Link>
              </li>
              <li>
                <Link
                  href="/retreats"
                  className="text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  Retreats Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/our-story"
                  className="text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/connect"
                  className="text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  Connect
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-wide-sm text-antique-gold/70 font-semibold">
              Sacred Connect
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:connect@justprem.com"
                  className="flex items-center gap-3 text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  <Mail size={14} strokeWidth={1.2} className="text-antique-gold" />
                  connect@justprem.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+447000000000"
                  className="flex items-center gap-3 text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  <Phone size={14} strokeWidth={1.2} className="text-antique-gold" />
                  +77016282888
                </a>
              </li>
            </ul>

            <div className="mt-8 flex gap-4">
              <a
                href="https://www.instagram.com/justprem_community/"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-antique-gold/20 text-stone/60 transition-all hover:border-antique-gold/50 hover:text-ivory"
                aria-label="Instagram"
              >
                <Instagram size={16} strokeWidth={1.2} />
              </a>
              <a
                href="https://www.youtube.com/@justpremfoundation"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-antique-gold/20 text-stone/60 transition-all hover:border-antique-gold/50 hover:text-ivory"
                aria-label="YouTube"
              >
                <Youtube size={16} strokeWidth={1.2} />
              </a>
            </div>

            <div className="mt-8">
              <button
                onClick={onEnquire}
                className="w-full py-2.5 border border-antique-gold/40 text-xs uppercase tracking-wide text-antique-gold hover:bg-antique-gold hover:text-near-black transition-all"
              >
                Enquire for Journeys
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 h-[1px] w-full bg-antique-gold/10" />

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-[10px] uppercase tracking-wide-sm text-stone/35">
            &copy; {new Date().getFullYear()} JustPrem &middot; Heart of the Himalayas
          </p>
          <p className="text-[10px] uppercase tracking-wide-sm text-stone/35">
            Journeys that take you closer to what matters
          </p>
        </div>
      </div>
    </footer>
  );
}
