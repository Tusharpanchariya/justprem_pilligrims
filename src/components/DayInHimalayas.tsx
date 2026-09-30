import { images } from '@/data/images';

const dayParts = [
  {
    time: 'Dawn',
    desc: 'Meditation &middot; silence &middot; Himalayan sunrise',
    img: images.dawn,
  },
  {
    time: 'Morning',
    desc: 'Yoga &middot; breakfast &middot; journey',
    img: images.morning,
  },
  {
    time: 'Day',
    desc: 'Mountain exploration &middot; sacred sites &middot; local experiences',
    img: images.day,
  },
  {
    time: 'Evening',
    desc: 'Reflection &middot; music &middot; gathering',
    img: images.evening,
  },
  {
    time: 'Night',
    desc: 'Silence beneath the Himalayan sky',
    img: images.night,
  },
];

export default function DayInHimalayas() {
  return (
    <section className="relative bg-charcoal px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-20 text-center md:mb-32">
          <p className="reveal mb-6 text-[11px] uppercase tracking-ultra text-antique-gold">
            The Rhythm
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl font-light text-ivory md:text-6xl lg:text-7xl">
            A Day in the Himalayas
          </h2>
        </div>

        {/* Desktop horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute left-0 right-0 top-0 h-[1px] bg-antique-gold/15" />
            <div className="flex gap-4 lg:gap-8">
              {dayParts.map((part, i) => (
                <div
                  key={part.time}
                  className={`reveal flex-1 ${i > 0 ? `reveal-delay-${Math.min(i, 5)}` : ''}`}
                >
                  <div className="relative mb-0 h-[1px] bg-transparent">
                    <span className="absolute -top-[5px] left-0 h-2.5 w-2.5 rounded-full bg-antique-gold ring-4 ring-charcoal" />
                  </div>
                  <div className="group mt-8">
                    <div className="relative mb-6 aspect-[3/4] overflow-hidden">
                      <img
                        src={part.img}
                        alt={part.time}
                        className="img-zoom h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                    </div>
                    <h3 className="mb-2 font-serif text-2xl font-light text-ivory lg:text-3xl">
                      {part.time}
                    </h3>
                    <p
                      className="text-[11px] uppercase leading-relaxed tracking-wide-sm text-stone/55"
                      dangerouslySetInnerHTML={{ __html: part.desc }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden">
          <div className="relative space-y-12">
            <div className="absolute left-[30px] top-0 bottom-0 w-[1px] bg-antique-gold/15" />
            {dayParts.map((part, i) => (
              <div
                key={part.time}
                className={`reveal flex gap-6 ${i > 0 ? `reveal-delay-${Math.min(i, 5)}` : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-antique-gold/30 bg-charcoal">
                    <span className="h-2 w-2 rounded-full bg-antique-gold" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="group relative mb-4 h-[180px] overflow-hidden">
                    <img
                      src={part.img}
                      alt={part.time}
                      className="img-zoom h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                  </div>
                  <h3 className="mb-2 font-serif text-2xl font-light text-ivory">
                    {part.time}
                  </h3>
                  <p
                    className="text-[11px] uppercase leading-relaxed tracking-wide-sm text-stone/55"
                    dangerouslySetInnerHTML={{ __html: part.desc }}
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
