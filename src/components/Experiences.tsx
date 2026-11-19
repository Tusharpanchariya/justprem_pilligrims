import { images } from '@/data/images';

const experiences = [
  {
    title: 'Meet the Soul of Nepal',
    desc: 'Connect with the Land and its people.',
    img: images.sacredEncounters,
  },
  {
    title: 'Into the Heart of the Himalayas ',
    desc: 'Embrace the adventure and new discovery',
    img: images.himalayanSilence,
  },
  {
    title: 'Where Ancient Wisdom Lives ',
    desc: "Explore culture and spirituality.",
    img: images.ancientWisdom,
  },
  {
    title: 'The Heart Opens Through Sound ',
    desc: 'bhakti and devotion',
    img: images.mountainWalks,
  },
  {
    title: 'Daily Sadhana',
    desc: 'Begin each day with meditation, yoga, and shared stillness.',
    img: images.meditationYoga,
  },
  {
    title: 'Satsang & Yogic Wisdom',
    desc: 'Explore yoga philosophy and the deeper questions of life.',
    img: images.devotionalMusic,
  },
];

export default function Experiences() {
  return (
    <section
      id="experiences"
      className="relative bg-near-black px-6 py-32 md:px-12 md:py-48"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 md:mb-24">
          <p className="reveal mb-6 text-[11px] uppercase tracking-ultra text-antique-gold">
            The Nepal Experience
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl font-light leading-tight text-ivory md:text-6xl lg:text-7xl">
            Step Into a World Unlike Any Other

          </h2>
          <p className="reveal reveal-delay-2 mt-6 max-w-3xl text-sm font-light leading-relaxed text-stone/70 md:text-base lg:text-lg">
            Discover Nepal, where ancient temples, Buddhist stupas and sacred traditions are woven into everyday life. From the vibrant streets of Kathmandu and the royal squares of Bhaktapur to remote Himalayan villages, every place reveals a unique side of this extraordinary Land.
            Hear the temple bells, witness sacred rituals and feel the peaceful rhythm of life in the mountains. Let Nepal become more than a journey through a beautiful country - let it be a journey within oneself. Slow down, reconnect with yourself and discover the living spirit of the Himalayas.

          </p>
        </div>


        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
          {experiences.map((exp, i) => (
            <article
              key={exp.title}
              className={`group reveal ${i < 3 ? 'reveal-delay-' + (i + 1) : ''}`}
            >
              <div className="relative mb-6 aspect-[4/5] overflow-hidden">
                <picture className="block h-full w-full">
                  <source srcSet={exp.img.replace(/\\.(jpe?g|png|avif)$/i, '.webp')} type="image/webp" />
                  <img
                    src={exp.img}
                    alt={exp.title}
                    className="img-zoom h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-near-black/80 via-near-black/10 to-transparent transition-opacity duration-700 group-hover:from-near-black/60 pointer-events-none" />
                {/* Gold line */}
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-antique-gold transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </div>
              <h3 className="mb-3 font-serif text-2xl font-light text-ivory transition-transform duration-700 group-hover:translate-x-1 md:text-3xl">
                {exp.title}
              </h3>
              <p className="max-w-xs text-sm font-light leading-relaxed text-stone/60">
                {exp.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
