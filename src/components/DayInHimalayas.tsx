import { images } from '@/data/images';

const dayParts = [
  {
    time: 'Dawn',
    desc: 'MEDITATION · PRANAYAMA · HIMALAYAN SUNRISE',
    img: images.dawn,
  },
  {
    time: 'Morning',
    desc: 'YOGA · BREAKFAST · MORNING RITUALS',
    img: images.morning,
  },
  {
    time: 'Day',
    desc: 'MOUNTAIN EXPLORATION · SACRED SITES · LOCAL EXPERIENCES',
    img: images.day,
  },
  {
    time: 'Evening',
    desc: 'REFLECTION · KIRTAN · SHARED GATHERING',
    img: images.evening,
  },
  {
    time: 'Night',
    desc: 'REST · SILENCE · UNDER THE HIMALAYAN SKY',
    img: images.night,
  },
];

export default function DayInHimalayas() {
  return (
    <section className="relative bg-charcoal px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 md:mb-24 text-center">
          <p className="reveal mb-6 text-[11px] uppercase tracking-ultra text-antique-gold">
            The Rhythm
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl font-light leading-tight text-ivory sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto">
           Recharge in the Himalayas
          </h2>
          <p className="reveal reveal-delay-2 mt-6 max-w-3xl mx-auto text-sm font-light leading-relaxed text-stone/70 md:text-base lg:text-[17px]">
            Over 12 days you will experience a different rhythm of daily life. Every day will bring something new, but mostly our days will follow a shared routine: morning meditation and yoga, exploring Nepal&apos;s diverse landscapes and mountains, philosophy sessions in the evenings, singing kirtan after dinners and reflecting on the day, and finally taking time to rest and recharge.
          </p>
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
                      <picture className="block h-full w-full">
                        <source srcSet={part.img.replace(/\.(jpe?g|png|avif)$/i, '.webp')} type="image/webp" />
                        <img
                          src={part.img}
                          alt={part.time}
                          className="img-zoom h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent pointer-events-none" />
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
                    <picture className="block h-full w-full">
                      <source srcSet={part.img.replace(/\.(jpe?g|png|avif)$/i, '.webp')} type="image/webp" />
                      <img
                        src={part.img}
                        alt={part.time}
                        className="img-zoom h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent pointer-events-none" />
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
