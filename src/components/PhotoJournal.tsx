import { images } from '@/data/images';

// Masonry grid: each item gets a span class for varied sizes
const gallery = [
  { img: images.pj11, span: 'md:col-span-2', aspect: 'aspect-[16/10]' },
  { img: images.pj10, span: '', aspect: 'aspect-[3/4]' },
  { img: images.pj2, span: 'md:col-span-2 md:row-span-2', aspect: 'aspect-[16/10]' },
  { img: images.pj3, span: '', aspect: 'aspect-[4/3]' },
  { img: images.pj4, span: 'md:col-span-2', aspect: 'aspect-[16/9]' },
  { img: images.pj6, span: 'md:col-span-2', aspect: 'aspect-[16/10]' },
  { img: images.pj12, span: '', aspect: 'aspect-[4/3]' },
];

export default function PhotoJournal() {
  return (
    <section className="relative bg-near-black px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-20 text-center md:mb-32">
          <p className="reveal mb-6 text-[11px] uppercase tracking-ultra text-antique-gold">
            The Journal
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl font-light text-ivory md:text-6xl lg:text-7xl">
            From the Himalayan Journal
          </h2>
        </div>

        {/* Masonry grid */}
        <div className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-6">
          {gallery.map((item, i) => (
            <div
              key={i}
              className={`reveal group relative overflow-hidden ${item.span} ${item.aspect}`}
            >
              <img
                src={item.img}
                alt={`Himalayan journal frame ${i + 1}`}
                className="img-zoom h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-near-black/0 transition-colors duration-700 group-hover:bg-near-black/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
