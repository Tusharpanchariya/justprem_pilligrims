import { images } from '@/data/images';

const experiences = [
  {
    title: 'Sacred Encounters',
    desc: 'Meet Nepal through its living spiritual traditions.',
    img: images.sacredEncounters,
  },
  {
    title: 'Himalayan Silence',
    desc: 'Moments of stillness surrounded by enormous landscapes.',
    img: images.himalayanSilence,
  },
  {
    title: 'Ancient Wisdom',
    desc: 'Teachings, stories and practices carried through generations.',
    img: images.ancientWisdom,
  },
  {
    title: 'Mountain Walks',
    desc: 'Move slowly through dramatic Himalayan terrain.',
    img: images.mountainWalks,
  },
  {
    title: 'Meditation & Yoga',
    desc: 'Return to the breath beneath open Himalayan skies.',
    img: images.meditationYoga,
  },
  {
    title: 'Devotional Music',
    desc: 'Mantra, kirtan and sacred sound.',
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
        <div className="mb-20 md:mb-32">
          <p className="reveal mb-6 text-[11px] uppercase tracking-ultra text-antique-gold">
            The Nepal Experience
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl font-light leading-tight text-ivory md:text-6xl lg:text-7xl">
            A Pilgrimage Beyond
            <br />
            the Ordinary
          </h2>
        </div>

        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
          {experiences.map((exp, i) => (
            <article
              key={exp.title}
              className={`group reveal ${i % 3 === 1 ? 'lg:mt-16' : i % 3 === 2 ? 'lg:mt-32' : ''}`}
            >
              <div className="relative mb-6 aspect-[4/5] overflow-hidden">
                <img
                  src={exp.img}
                  alt={exp.title}
                  className="img-zoom h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-near-black/80 via-near-black/10 to-transparent transition-opacity duration-700 group-hover:from-near-black/60" />
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
