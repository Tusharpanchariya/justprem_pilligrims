import { Play } from 'lucide-react';
import { images } from '@/data/images';

const testimonials = [
  {
    name: '[GUEST NAME]',
    country: '[Country]',
    quote: '[One-line testimonial — to be supplied by client]',
    img: images.testimonial1,
  },
  {
    name: '[GUEST NAME]',
    country: '[Country]',
    quote: '[One-line testimonial — to be supplied by client]',
    img: images.testimonial2,
  },
  {
    name: '[GUEST NAME]',
    country: '[Country]',
    quote: '[One-line testimonial — to be supplied by client]',
    img: images.testimonial3,
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative bg-charcoal px-6 py-32 md:px-12 md:py-48"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-20 md:mb-32">
          <p className="reveal mb-6 text-[11px] uppercase tracking-ultra text-antique-gold">
            Voices
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl font-light text-ivory md:text-6xl lg:text-7xl">
            Stories from the Path
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {testimonials.map((t, i) => (
            <article
              key={i}
              className={`group reveal ${i > 0 ? `reveal-delay-${Math.min(i, 5)}` : ''}`}
            >
              <div className="relative aspect-video overflow-hidden md:aspect-[3/4]">
                <img
                  src={t.img}
                  alt={t.name}
                  className="img-zoom h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-near-black/85 via-near-black/20 to-near-black/40 transition-opacity duration-700 group-hover:from-near-black/70" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-ivory/30 backdrop-blur-sm transition-all duration-700 hover:scale-110 hover:border-antique-gold"
                    aria-label={`Play testimonial from ${t.name}`}
                  >
                    <Play
                      size={18}
                      strokeWidth={1}
                      className="ml-0.5 text-ivory"
                      fill="currentColor"
                    />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="font-serif text-xl font-light text-ivory">
                    {t.name}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wide-sm text-antique-gold/80">
                    {t.country}
                  </p>
                </div>
              </div>
              <p className="mt-5 font-serif text-lg font-light italic leading-relaxed text-stone/70">
                {t.quote}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
