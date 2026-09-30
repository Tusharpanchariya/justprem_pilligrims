import { Instagram, Youtube, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onEnquire: () => void;
}

export default function Footer({ onEnquire }: FooterProps) {
  return (
    <footer className="relative bg-near-black px-6 pt-24 pb-12 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        {/* Top section */}
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-3xl font-light tracking-wide-sm text-ivory">
              JustPrem
            </h3>
            <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-stone/55">
              A journey inward, through music, devotion, art and the sacred
              landscapes of the Himalayas.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-wide-sm text-antique-gold/70">
              Navigate
            </p>
            <ul className="space-y-3">
              {['Pilgrimages', 'Our Story', 'Gallery', 'Testimonials'].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
              <li>
                <button
                  onClick={onEnquire}
                  className="text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  Connect
                </button>
              </li>
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-wide-sm text-antique-gold/70">
              Connect
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:[email]"
                  className="flex items-center gap-3 text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  <Mail size={14} strokeWidth={1.2} />
                  [email]
                </a>
              </li>
              <li>
                <a
                  href="tel:[phone]"
                  className="flex items-center gap-3 text-sm font-light text-stone/60 transition-colors hover:text-ivory"
                >
                  <Phone size={14} strokeWidth={1.2} />
                  [phone]
                </a>
              </li>
            </ul>

            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center border border-antique-gold/20 text-stone/60 transition-all hover:border-antique-gold/50 hover:text-ivory"
                aria-label="Instagram"
              >
                <Instagram size={16} strokeWidth={1.2} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center border border-antique-gold/20 text-stone/60 transition-all hover:border-antique-gold/50 hover:text-ivory"
                aria-label="YouTube"
              >
                <Youtube size={16} strokeWidth={1.2} />
              </a>
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
            A Sacred Pilgrimage Through Nepal
          </p>
        </div>
      </div>
    </footer>
  );
}
