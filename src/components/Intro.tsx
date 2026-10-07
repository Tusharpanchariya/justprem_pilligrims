export default function Intro() {
  return (
    <section
      id="intro"
      className="relative bg-near-black px-6 py-24 md:px-12 md:py-36 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">
        <p className="reveal mb-8 text-[11px] uppercase tracking-ultra text-antique-gold md:mb-12">
          Description
        </p>

        <h2 className="reveal reveal-delay-1 font-serif text-3xl font-light leading-[1.2] text-ivory sm:text-4xl md:text-5xl lg:text-6xl mb-16 md:mb-20">
          Some journeys take you to places.
          <br />
          <span className="text-stone/70 italic">
            Others take you inward..
          </span>
        </h2>

        {/* Two column grid layout for text and images */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column - Text Content */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <p className="reveal reveal-delay-2 text-base font-light leading-[1.8] text-stone/80 md:text-lg">
              Our 12-days retreat is an immersive journey through the diverse landscapes, cultures, and spiritual traditions of Nepal, culminating at the sacred temple of Muktinath, a place traditionally associated with liberation.
            </p>

            <p className="reveal reveal-delay-3 text-base font-light leading-[1.8] text-stone/80 md:text-lg">
              We begin in Kathmandu, exploring its vibrant culture, ancient temples, and spiritual heritage, before travelling to Pokhara, where Phewa Lake and views of the Annapurna range offer a gentle transition into the stillness of the Himalayas.
            </p>

            <p className="reveal reveal-delay-4 text-base font-light leading-[1.8] text-stone/80 md:text-lg">
              From there, we continue our trekking through villages, valleys, forests, and high-altitude landscapes, meeting local communities and experiencing Nepal beyond the trail. Our days are enriched with yoga, meditation, kirtan, and satsang with Swami Aniruddha, a travelling monk who has followed the yogic path for over 20 years, creating space to embrace the journey around us while reconnecting more deeply within.
            </p>

            <p className="reveal reveal-delay-4 text-base font-light leading-[1.8] text-stone/80 md:text-lg">
              Our journey culminates at Muktinath Temple, at around 3,800 metres. Revered by both Hindus and Buddhists, Muktinath means “Lord of Liberation.” Reaching this sacred place becomes a symbolic moment to turn inward and explore what liberation means for each of us.
            </p>

          </div>

          {/* Right Column - 3 Pictures Stacked Vertically */}
          <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8 pt-2">
            {/* Image 1: Kathmandu */}
            <div className="reveal reveal-delay-2 group relative overflow-hidden rounded-sm border border-antique-gold/20 shadow-2xl">
              <div className="aspect-[16/10] overflow-hidden bg-charcoal">
                <img
                  src="/places_images/kathmandu2.jpg"
                  alt="Boudhanath Stupa in Kathmandu"
                  className="h-full w-full object-cover img-zoom transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-near-black/80 via-near-black/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-serif text-sm font-light text-ivory tracking-wide">
                  Kathmandu & Sacred Stupas
                </span>
              </div>
            </div>

            {/* Image 2: Pokhara */}
            <div className="reveal reveal-delay-3 group relative overflow-hidden rounded-sm border border-antique-gold/20 shadow-2xl">
              <div className="aspect-[16/10] overflow-hidden bg-charcoal">
                <img
                  src="/places_images/pokhara2.jpg"
                  alt="Phewa Lake and Annapurna Views in Pokhara"
                  className="h-full w-full object-cover img-zoom transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-near-black/80 via-near-black/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-serif text-sm font-light text-ivory tracking-wide">
                  Pokhara & Phewa Lake
                </span>
              </div>
            </div>

            {/* Image 3: Muktinath */}
            <div className="reveal reveal-delay-4 group relative overflow-hidden rounded-sm border border-antique-gold/20 shadow-2xl">
              <div className="aspect-[16/10] overflow-hidden bg-charcoal">
                <img
                  src="/places_images/muktinath.jpg"
                  alt="Muktinath Sacred Temple"
                  className="h-full w-full object-cover img-zoom transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-near-black/80 via-near-black/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-serif text-sm font-light text-ivory tracking-wide">
                  Muktinath Temple — Lord of Liberation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
