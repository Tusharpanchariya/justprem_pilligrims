import { useEffect, useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

const navLinks = [
  { label: 'Pilgrimage', href: '#intro' },
  { label: 'The Journey', href: '#journey' },
  { label: 'Nepal', href: '#map' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Stories', href: '#testimonials' },
];

interface NavbarProps {
  onEnquire: () => void;
}

export default function Navbar({ onEnquire }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-near-black/85 backdrop-blur-md border-b border-antique-gold/10 py-4'
            : 'bg-transparent pt-[24px] pb-6'
        }`}
      >
        <nav className="mx-auto flex w-full items-center justify-between px-6 md:px-[40px]">
          <a
            href="#hero"
            className="font-sans text-[16px] md:text-[18px] font-medium text-ivory/90 transition-colors hover:text-ivory"
          >
            JustPrem
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[10px] md:text-[11px] uppercase font-medium tracking-[0.16em] text-ivory/70 transition-colors duration-500 hover:text-ivory"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={onEnquire}
                className="text-[10px] md:text-[11px] uppercase font-medium tracking-[0.16em] text-ivory/70 transition-colors duration-500 hover:text-ivory"
              >
                Connect
              </button>
            </li>
            <li>
              <button className="text-[10px] md:text-[11px] uppercase font-medium tracking-[0.16em] text-ivory/70 transition-colors duration-500 hover:text-ivory">
                English
              </button>
            </li>
          </ul>

          <button
            onClick={() => setMenuOpen(true)}
            className="text-ivory lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.2} />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-near-black transition-opacity duration-500 lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <span className="font-sans text-xl font-normal tracking-[-0.035em] text-ivory">
            JustPrem
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-ivory"
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={1.2} />
          </button>
        </div>
        <ul className="mt-12 flex flex-col gap-2 px-6">
            {navLinks.map((link, i) => (
              <li
                key={link.label}
                className="border-b border-antique-gold/10"
                style={{
                  transitionDelay: `${menuOpen ? i * 80 : 0}ms`,
                }}
              >
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-5 font-serif text-3xl font-light text-ivory transition-colors hover:text-antique-gold"
                >
                  {link.label}
                  <ChevronRight size={18} strokeWidth={1} className="text-stone/50" />
                </a>
              </li>
            ))}
            <li className="border-b border-antique-gold/10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEnquire();
                }}
                className="flex w-full items-center justify-between py-5 font-serif text-3xl font-light text-ivory transition-colors hover:text-antique-gold"
              >
                Connect
                <ChevronRight size={18} strokeWidth={1} className="text-stone/50" />
              </button>
            </li>
          </ul>
        <div className="mt-10 px-6">
          <button className="text-[11px] uppercase tracking-wide-sm text-stone/60">
            English
          </button>
        </div>
      </div>
    </>
  );
}
