'use client';

import Link from 'next/link';
import { Instagram, Youtube, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onEnquire: () => void;
}

export default function Footer({ onEnquire }: FooterProps) {
  return (
    <footer className="relative bg-[#23251D] text-[#F5F1E8] px-6 pt-24 pb-12 md:px-12 border-t border-[#34372B]">
      <div className="mx-auto max-w-[1400px]">
        {/* Top section */}
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-serif text-3xl font-light tracking-wide text-[#F5F1E8] flex items-center gap-2 group"
            >
              <span className="text-[#A4AB92] font-serif italic text-xl transition-transform group-hover:scale-110">
                ✦
              </span>
              <span>JustPrem</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-[#C0B9AA]">
              Journeys that take you closer to what matters. Sacred pilgrimages, devotional music, silence retreats, and authentic human experiences across the globe.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-[0.25em] text-[#9EA68B] font-semibold">
              Explore &amp; Navigate
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/retreats-and-pilgrimages"
                  className="text-sm font-light text-[#C0B9AA] transition-colors hover:text-[#F5F1E8]"
                >
                  Retreats &amp; Pilgrimages
                </Link>
              </li>
              <li>
                <Link
                  href="/pilgrimages"
                  className="text-sm font-light text-[#C0B9AA] transition-colors hover:text-[#F5F1E8]"
                >
                  Nepal Pilgrimages
                </Link>
              </li>
              <li>
                <Link
                  href="/retreats"
                  className="text-sm font-light text-[#C0B9AA] transition-colors hover:text-[#F5F1E8]"
                >
                  Retreats Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/our-story"
                  className="text-sm font-light text-[#C0B9AA] transition-colors hover:text-[#F5F1E8]"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-sm font-light text-[#C0B9AA] transition-colors hover:text-[#F5F1E8]"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="text-sm font-light text-[#C0B9AA] transition-colors hover:text-[#F5F1E8]"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/connect"
                  className="text-sm font-light text-[#C0B9AA] transition-colors hover:text-[#F5F1E8]"
                >
                  Connect
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-[0.25em] text-[#9EA68B] font-semibold">
              Sacred Connect
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:connect@justprem.com"
                  className="flex items-center gap-3 text-sm font-light text-[#C0B9AA] transition-colors hover:text-[#F5F1E8]"
                >
                  <Mail size={14} strokeWidth={1.4} className="text-[#9EA68B]" />
                  connect@justprem.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+77016282888"
                  className="flex items-center gap-3 text-sm font-light text-[#C0B9AA] transition-colors hover:text-[#F5F1E8]"
                >
                  <Phone size={14} strokeWidth={1.4} className="text-[#9EA68B]" />
                  +77016282888
                </a>
              </li>
            </ul>

            <div className="mt-8 flex gap-4">
              <a
                href="https://www.instagram.com/justprem_community/"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-[#3E4233] text-[#C0B9AA] transition-all hover:border-[#9EA68B] hover:text-[#F5F1E8] rounded-sm"
                aria-label="Instagram"
              >
                <Instagram size={16} strokeWidth={1.4} />
              </a>
              <a
                href="https://www.youtube.com/@justpremfoundation"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-[#3E4233] text-[#C0B9AA] transition-all hover:border-[#9EA68B] hover:text-[#F5F1E8] rounded-sm"
                aria-label="YouTube"
              >
                <Youtube size={16} strokeWidth={1.4} />
              </a>
            </div>

            <div className="mt-8">
              <button
                onClick={onEnquire}
                className="w-full py-3 border border-[#484D3B] text-xs uppercase tracking-[0.2em] font-medium text-[#F5F1E8] hover:bg-[#F5F1E8] hover:text-[#23251D] hover:border-[#F5F1E8] transition-all duration-300 rounded-sm"
              >
                Enquire for Journeys
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 h-[1px] w-full bg-[#34372B]" />

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#868C76]">
            &copy; {new Date().getFullYear()} JustPrem &middot; Global Spiritual Community
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#868C76]">
            Journeys that take you closer to what matters
          </p>
        </div>
      </div>
    </footer>
  );
}
