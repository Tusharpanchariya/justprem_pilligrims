'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ChevronRight, Globe, Sparkles } from 'lucide-react';
import { useLanguage, LANGUAGES, Language } from '@/context/LanguageContext';

interface NavbarProps {
  onEnquire: () => void;
}

export default function Navbar({ onEnquire }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [expDropdownOpen, setExpDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const langRef = useRef<HTMLLIElement>(null);
  const expRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (expRef.current && !expRef.current.contains(e.target as Node)) {
        setExpDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setMenuOpen(false);
    setExpDropdownOpen(false);
    setLangMenuOpen(false);
  }, [pathname]);

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const isHome = pathname === '/';
  const isIvorySurface = isHome && scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isIvorySurface
            ? 'bg-[#F5F1E8]/95 backdrop-blur-md border-b border-[#E8DFD0]/80 py-3.5 shadow-sm text-[#2D3528]'
            : scrolled
            ? 'bg-near-black/90 backdrop-blur-md border-b border-antique-gold/15 py-4 shadow-2xl text-ivory'
            : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent pt-6 pb-6 text-ivory'
        }`}
      >
        <nav className="mx-auto flex w-full items-center justify-between px-6 md:px-12 max-w-[1400px]">
          {/* Logo */}
          <Link
            href="/"
            className={`group flex items-center gap-2 font-serif text-xl md:text-2xl font-light tracking-wide transition-colors ${
              isIvorySurface ? 'text-[#2D3528] hover:text-[#70765A]' : 'text-ivory hover:text-antique-gold'
            }`}
          >
            <span
              className={`inline-block font-serif italic text-lg transition-transform group-hover:scale-110 ${
                isIvorySurface ? 'text-[#70765A]' : 'text-antique-gold'
              }`}
            >
              ✦
            </span>
            <span>JustPrem</span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden items-center gap-7 lg:flex">
            {/* Retreats & Pilgrimages Link */}
            <li className="relative" ref={expRef}>
              <Link
                href="/retreats-and-pilgrimages"
                onMouseEnter={() => setExpDropdownOpen(true)}
                className={`flex items-center gap-1.5 text-[11px] uppercase font-medium tracking-[0.18em] transition-colors duration-300 py-1 ${
                  pathname.includes('/pilgrimages') || pathname.includes('/retreats')
                    ? isIvorySurface
                      ? 'text-[#70765A] font-semibold'
                      : 'text-antique-gold font-semibold'
                    : isIvorySurface
                    ? 'text-[#2D3528]/80 hover:text-[#2D3528]'
                    : 'text-ivory/80 hover:text-ivory'
                }`}
              >
                <span>Retreats & Pilgrimages</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${
                    expDropdownOpen
                      ? isIvorySurface
                        ? 'rotate-180 text-[#70765A]'
                        : 'rotate-180 text-antique-gold'
                      : isIvorySurface
                      ? 'text-[#2D3528]/40'
                      : 'text-stone/50'
                  }`}
                />
              </Link>

              {/* Sub-menu */}
              {expDropdownOpen && (
                <div
                  className={`absolute top-full left-0 mt-3 w-64 rounded-sm border p-3 backdrop-blur-xl shadow-2xl animate-fade-up ${
                    isIvorySurface
                      ? 'bg-[#F5F1E8] border-[#E8DFD0] text-[#2D3528]'
                      : 'bg-near-black/95 border-antique-gold/20 text-ivory'
                  }`}
                >
                  <div
                    className={`px-3 py-1.5 text-[9px] uppercase tracking-ultra font-semibold border-b mb-2 ${
                      isIvorySurface
                        ? 'text-[#70765A] border-[#E8DFD0]'
                        : 'text-antique-gold/60 border-antique-gold/10'
                    }`}
                  >
                    Sacred Experiences
                  </div>
                  <Link
                    href="/retreats-and-pilgrimages"
                    className={`block px-3 py-2 text-xs rounded transition-colors ${
                      isIvorySurface
                        ? 'text-[#2D3528] hover:text-[#70765A] hover:bg-[#E8DFD0]/40'
                        : 'text-ivory hover:text-antique-gold hover:bg-antique-gold/10'
                    }`}
                  >
                    Overview & All Journeys
                  </Link>
                  <Link
                    href="/pilgrimages"
                    className={`block px-3 py-2 text-xs rounded transition-colors ${
                      isIvorySurface
                        ? 'text-[#2D3528] hover:text-[#70765A] hover:bg-[#E8DFD0]/40'
                        : 'text-ivory hover:text-antique-gold hover:bg-antique-gold/10'
                    }`}
                  >
                    Nepal Pilgrimages
                  </Link>
                  <Link
                    href="/retreats"
                    className={`block px-3 py-2 text-xs rounded transition-colors ${
                      isIvorySurface
                        ? 'text-[#2D3528] hover:text-[#70765A] hover:bg-[#E8DFD0]/40'
                        : 'text-ivory hover:text-antique-gold hover:bg-antique-gold/10'
                    }`}
                  >
                    Retreats Archive
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link
                href="/our-story"
                className={`text-[11px] uppercase font-medium tracking-[0.18em] transition-colors duration-300 ${
                  pathname === '/our-story'
                    ? isIvorySurface
                      ? 'text-[#70765A] font-semibold'
                      : 'text-antique-gold font-semibold'
                    : isIvorySurface
                    ? 'text-[#2D3528]/80 hover:text-[#2D3528]'
                    : 'text-ivory/80 hover:text-ivory'
                }`}
              >
                Our Story
              </Link>
            </li>

            <li>
              <Link
                href="/gallery"
                className={`text-[11px] uppercase font-medium tracking-[0.18em] transition-colors duration-300 ${
                  pathname === '/gallery'
                    ? isIvorySurface
                      ? 'text-[#70765A] font-semibold'
                      : 'text-antique-gold font-semibold'
                    : isIvorySurface
                    ? 'text-[#2D3528]/80 hover:text-[#2D3528]'
                    : 'text-ivory/80 hover:text-ivory'
                }`}
              >
                Gallery
              </Link>
            </li>

            <li>
              <Link
                href="/testimonials"
                className={`text-[11px] uppercase font-medium tracking-[0.18em] transition-colors duration-300 ${
                  pathname === '/testimonials'
                    ? isIvorySurface
                      ? 'text-[#70765A] font-semibold'
                      : 'text-antique-gold font-semibold'
                    : isIvorySurface
                    ? 'text-[#2D3528]/80 hover:text-[#2D3528]'
                    : 'text-ivory/80 hover:text-ivory'
                }`}
              >
                Testimonials
              </Link>
            </li>

            <li>
              <Link
                href="/connect"
                className={`text-[11px] uppercase font-medium tracking-[0.18em] transition-colors duration-300 ${
                  pathname === '/connect'
                    ? isIvorySurface
                      ? 'text-[#70765A] font-semibold'
                      : 'text-antique-gold font-semibold'
                    : isIvorySurface
                    ? 'text-[#2D3528]/80 hover:text-[#2D3528]'
                    : 'text-ivory/80 hover:text-ivory'
                }`}
              >
                Connect
              </Link>
            </li>

            {/* Language Selector Dropdown */}
            <li
              className={`relative border-l pl-6 ${
                isIvorySurface ? 'border-[#E8DFD0]' : 'border-antique-gold/20'
              }`}
              ref={langRef}
            >
              <button
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 text-[11px] uppercase font-medium tracking-[0.16em] transition-colors ${
                  isIvorySurface ? 'text-[#2D3528]/75 hover:text-[#2D3528]' : 'text-ivory/70 hover:text-ivory'
                }`}
              >
                <Globe
                  size={13}
                  className={isIvorySurface ? 'text-[#70765A]' : 'text-antique-gold/80'}
                />
                <span>{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown
                  size={11}
                  className={isIvorySurface ? 'text-[#2D3528]/40' : 'text-stone/40'}
                />
              </button>

              {langMenuOpen && (
                <div
                  className={`absolute top-full right-0 mt-3 w-44 rounded-sm border p-2 backdrop-blur-xl shadow-2xl animate-fade-up ${
                    isIvorySurface
                      ? 'bg-[#F5F1E8] border-[#E8DFD0] text-[#2D3528]'
                      : 'bg-near-black/95 border-antique-gold/20 text-ivory'
                  }`}
                >
                  <div
                    className={`px-3 py-1 text-[9px] uppercase tracking-wide font-semibold border-b mb-1 ${
                      isIvorySurface
                        ? 'text-[#70765A] border-[#E8DFD0]'
                        : 'text-antique-gold/60 border-antique-gold/10'
                    }`}
                  >
                    Select Language
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as Language);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors flex items-center justify-between ${
                        language === lang.code
                          ? isIvorySurface
                            ? 'bg-[#E8DFD0]/60 text-[#2D3528] font-medium'
                            : 'bg-antique-gold/20 text-antique-gold font-medium'
                          : isIvorySurface
                          ? 'text-[#2D3528]/70 hover:text-[#2D3528] hover:bg-[#E8DFD0]/30'
                          : 'text-stone/70 hover:text-ivory hover:bg-white/5'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] opacity-50">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* Enquire CTA Button */}
            <li>
              <button
                onClick={onEnquire}
                className={`group relative inline-flex items-center gap-2 px-4 py-2 text-[11px] uppercase font-medium tracking-[0.16em] transition-all duration-500 rounded-sm ${
                  isIvorySurface
                    ? 'border border-[#38392E]/40 text-[#2D3528] hover:border-[#38392E] hover:bg-[#38392E] hover:text-[#F5F1E8]'
                    : 'border border-antique-gold/40 text-ivory hover:border-antique-gold hover:bg-antique-gold/10'
                }`}
              >
                <span>Enquire</span>
                <Sparkles
                  size={12}
                  className={`transition-transform group-hover:rotate-12 ${
                    isIvorySurface ? 'text-[#70765A]' : 'text-antique-gold'
                  }`}
                />
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`p-2 lg:hidden ${isIvorySurface ? 'text-[#2D3528]' : 'text-ivory'}`}
            aria-label="Open navigation menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[60] bg-near-black transition-opacity duration-500 lg:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'
          }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-antique-gold/10">
          <Link href="/" className="font-serif text-2xl font-light text-ivory" onClick={() => setMenuOpen(false)}>
            JustPrem
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-ivory p-2 hover:text-antique-gold transition-colors"
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="h-[calc(100vh-80px)] overflow-y-auto px-6 pt-6 pb-12 flex flex-col justify-between">
          <ul className="flex flex-col gap-1">
            <li className="border-b border-antique-gold/10">
              <Link
                href="/retreats-and-pilgrimages"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-4 font-serif text-2xl font-light text-ivory hover:text-antique-gold"
              >
                <span>Retreats & Pilgrimages</span>
                <ChevronRight size={18} className="text-antique-gold/60" />
              </Link>
              <div className="pl-4 pb-3 flex flex-col gap-2">
                <Link
                  href="/pilgrimages"
                  onClick={() => setMenuOpen(false)}
                  className="text-xs uppercase tracking-wide text-stone/70 hover:text-antique-gold"
                >
                  └ Nepal Pilgrimages
                </Link>
                <Link
                  href="/retreats"
                  onClick={() => setMenuOpen(false)}
                  className="text-xs uppercase tracking-wide text-stone/70 hover:text-antique-gold"
                >
                  └ Retreats Archive
                </Link>
              </div>
            </li>

            <li className="border-b border-antique-gold/10">
              <Link
                href="/our-story"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-4 font-serif text-2xl font-light text-ivory hover:text-antique-gold"
              >
                <span>Our Story</span>
                <ChevronRight size={18} className="text-antique-gold/60" />
              </Link>
            </li>

            <li className="border-b border-antique-gold/10">
              <Link
                href="/gallery"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-4 font-serif text-2xl font-light text-ivory hover:text-antique-gold"
              >
                <span>Gallery</span>
                <ChevronRight size={18} className="text-antique-gold/60" />
              </Link>
            </li>

            <li className="border-b border-antique-gold/10">
              <Link
                href="/testimonials"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-4 font-serif text-2xl font-light text-ivory hover:text-antique-gold"
              >
                <span>Testimonials</span>
                <ChevronRight size={18} className="text-antique-gold/60" />
              </Link>
            </li>

            <li className="border-b border-antique-gold/10">
              <Link
                href="/connect"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-4 font-serif text-2xl font-light text-ivory hover:text-antique-gold"
              >
                <span>Connect</span>
                <ChevronRight size={18} className="text-antique-gold/60" />
              </Link>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-antique-gold/10 flex flex-col gap-4">
            <button
              onClick={() => {
                setMenuOpen(false);
                onEnquire();
              }}
              className="w-full py-3 border border-antique-gold text-center font-serif text-lg text-ivory bg-antique-gold/10"
            >
              Enquire for Journeys
            </button>

            <div className="flex items-center justify-between pt-2 text-xs text-stone/60">
              <span>Language:</span>
              <div className="flex gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code as Language)}
                    className={`px-2 py-1 text-[10px] uppercase border ${language === l.code ? 'border-antique-gold text-antique-gold' : 'border-stone/20 text-stone/40'
                      }`}
                  >
                    {l.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
