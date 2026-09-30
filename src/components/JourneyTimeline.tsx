import { images } from '@/data/images';

const destinations = [
  {
    num: '01',
    name: 'Kathmandu',
    desc: 'Ancient temples &middot; sacred beginnings &middot; living culture',
    img: images.kathmandu,
  },
  {
    num: '02',
    name: 'Into the Himalayas',
    desc: 'Mountain roads &middot; valleys &middot; silence',
    img: images.intoHimalayas,
  },
  {
    num: '03',
    name: 'Sacred Valleys',
    desc: 'Ancient traditions &middot; monasteries &middot; contemplation',
    img: images.sacredValleys,
  },
  {
    num: '04',
    name: 'High Himalayan Landscapes',
    desc: 'Snow peaks &middot; remote paths &middot; vastness',
    img: images.highLandscapes,
  },
  {
    num: '05',
    name: 'Return',
    desc: 'Reflection &middot; integration &middot; renewed perspective',
    img: images.returnJourney,
  },
];

export default function JourneyTimeline() {
  return (
    <section id="journey" className="relative bg-charcoal px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-20 text-center md:mb-32">
          <p className="reveal mb-6 text-[11px] uppercase tracking-ultra text-antique-gold">
            The Passage
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl font-light text-ivory md:text-6xl lg:text-7xl">
            Places We Are Visiting
          </h2>
        </div>

        {/* Desktop horizontal timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-[200px] h-[1px] bg-antique-gold/20" />
            <div
              className="absolute left-0 top-[200px] h-[1px] bg-antique-gold/60"
              style={{ width: '100%' }}
            />
            <div className="flex gap-6">
              {destinations.map((d, i) => (
                <div
                  key={d.num}
                  className={`reveal flex-1 ${i > 0 ? 'reveal-delay-' + i : ''}`}
                >
                  {/* Image */}
                  <div className="group relative mb-8 h-[180px] overflow-hidden">
                    <img
                      src={d.img}
                      alt={d.name}
                      className="img-zoom h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                    <span className="absolute left-3 top-3 font-serif text-2xl font-light text-ivory/90">
                      {d.num}
                    </span>
                  </div>

                  {/* Marker dot */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="h-2 w-2 rounded-full bg-antique-gold ring-4 ring-charcoal" />
                  </div>

                  {/* Text */}
                  <h3 className="mb-3 text-center font-serif text-xl font-light tracking-wide-sm text-ivory">
                    {d.name}
                  </h3>
                  <p
                    className="text-center text-[11px] uppercase leading-relaxed tracking-wide-sm text-stone/60"
                    dangerouslySetInnerHTML={{ __html: d.desc }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="lg:hidden">
          <div className="relative space-y-12">
            <div className="absolute left-[30px] top-0 bottom-0 w-[1px] bg-antique-gold/20" />
            {destinations.map((d, i) => (
              <div
                key={d.num}
                className={`reveal ${i > 0 ? 'reveal-delay-' + Math.min(i, 5) : ''} flex gap-6`}
              >
                <div className="relative flex-shrink-0">
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-antique-gold/30 bg-charcoal">
                    <span className="font-serif text-lg font-light text-antique-gold">
                      {d.num}
                    </span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="group relative mb-4 h-[200px] overflow-hidden">
                    <img
                      src={d.img}
                      alt={d.name}
                      className="img-zoom h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                  </div>
                  <h3 className="mb-2 font-serif text-2xl font-light text-ivory">
                    {d.name}
                  </h3>
                  <p
                    className="text-[11px] uppercase leading-relaxed tracking-wide-sm text-stone/60"
                    dangerouslySetInnerHTML={{ __html: d.desc }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
