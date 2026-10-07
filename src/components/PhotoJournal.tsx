// Masonry grid: each item gets a span class for varied sizes
const gallery = [
  { img: '/phots_for_gallery/DSC03924.JPG', span: 'md:col-span-2', aspect: 'aspect-[16/10]' },
  { img: '/phots_for_gallery/DSC04045.JPG', span: '', aspect: 'aspect-[3/4]' },
  { img: '/phots_for_gallery/DSC04254.JPG', span: 'md:col-span-2 md:row-span-2', aspect: 'aspect-[4/3]' },
  { img: '/phots_for_gallery/DSC04529.JPG', span: '', aspect: 'aspect-[4/3]' },
  { img: '/phots_for_gallery/DSC04798.JPG', span: 'md:col-span-2', aspect: 'aspect-[16/9]' },
  { img: '/phots_for_gallery/DSC04907.JPG', span: 'md:col-span-2', aspect: 'aspect-[16/10]' },
  { img: '/phots_for_gallery/DSC04914.JPG', span: '', aspect: 'aspect-[3/4]' },
  { img: '/phots_for_gallery/DSC04916.JPG', span: 'md:col-span-2', aspect: 'aspect-[16/9]' },
  { img: '/phots_for_gallery/KAthmandu 3.png', span: '', aspect: 'aspect-[4/3]' },
  { img: '/phots_for_gallery/Kathmandu 2.png', span: 'md:col-span-2', aspect: 'aspect-[16/10]' },
  { img: '/phots_for_gallery/Nepal 4.avif', span: '', aspect: 'aspect-[3/4]' },
  { img: '/phots_for_gallery/Nepal 5.avif', span: 'md:col-span-2', aspect: 'aspect-[16/9]' },
  { img: '/phots_for_gallery/Nepal 6.png', span: '', aspect: 'aspect-[4/3]' },
  { img: '/phots_for_gallery/Nepal 7.png', span: 'md:col-span-2', aspect: 'aspect-[16/10]' },
  { img: '/phots_for_gallery/Nepalese woman.png', span: '', aspect: 'aspect-[3/4]' },
  { img: '/phots_for_gallery/Pokhara 2.png', span: 'md:col-span-2', aspect: 'aspect-[16/9]' },
  { img: '/phots_for_gallery/Poon hill.jpg', span: '', aspect: 'aspect-[4/3]' },
  { img: '/phots_for_gallery/Temples.png', span: 'md:col-span-2', aspect: 'aspect-[16/10]' },
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
