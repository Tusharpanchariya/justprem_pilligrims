import { images } from '@/data/images';

export default function WhyNepal() {
  return (
    <section className="relative overflow-hidden bg-blue-black px-6 py-32 md:px-12 md:py-48 lg:py-64">
      {/* Subtle background image */}
      <div className="absolute inset-0">
        <img
          src={images.whyNepal}
          alt="Himalayan mountains in Nepal"
          className="h-full w-full object-cover opacity-15"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-black via-blue-black/80 to-blue-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="reveal mb-8 text-[11px] uppercase tracking-ultra text-antique-gold">
          The Question
        </p>

        <h2 className="reveal reveal-delay-1 mb-12 font-serif text-5xl font-light text-ivory md:text-7xl lg:text-8xl">
          Why Nepal?
        </h2>

        <div className="space-y-8 md:space-y-10">
          <p className="reveal reveal-delay-2 font-serif text-2xl font-light leading-relaxed text-stone/90 md:text-3xl lg:text-4xl">
            Nepal is more than a landscape.
          </p>
          <p className="reveal reveal-delay-3 max-w-2xl mx-auto text-base font-light leading-[1.9] text-stone/70 md:text-lg">
            It is a meeting place of mountains, monasteries, rivers, ancient
            traditions and living spirituality.
          </p>
          <p className="reveal reveal-delay-4 font-serif text-2xl font-light italic leading-relaxed text-ivory md:text-3xl lg:text-4xl">
            Here, the Himalayas do not simply surround you.
            <br />
            They change the scale of everything.
          </p>
        </div>

        {/* Three huge words */}
        <div className="mt-24 flex flex-col items-center gap-12 md:mt-32 md:flex-row md:justify-center md:gap-20 lg:gap-32">
          {['Mountain', 'Silence', 'Devotion'].map((word, i) => (
            <span
              key={word}
              className={`reveal reveal-delay-${i + 2} font-serif text-4xl font-extralight uppercase tracking-editorial text-ivory/90 md:text-6xl lg:text-7xl`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
