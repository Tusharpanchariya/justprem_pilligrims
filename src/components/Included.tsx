const includedItems = [
  'Accommodation',
  'Daily meals',
  'Transportation',
  'Guided pilgrimage',
  'Yoga & meditation',
  'Sacred experiences',
  'Local experiences',
  'Emergency support',
  'Workshop materials',
];

export default function Included() {
  return (
    <section className="relative bg-charcoal px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <p className="reveal mb-6 text-[11px] uppercase tracking-ultra text-antique-gold">
              What is Included
            </p>
            <h2 className="reveal reveal-delay-1 font-serif text-4xl font-light leading-[1.15] text-ivory md:text-5xl lg:text-6xl">
              Everything you need.
              <br />
              <span className="text-stone/60 italic">
                Nothing unnecessary.
              </span>
            </h2>
            <p className="reveal reveal-delay-2 mt-8 max-w-md text-sm font-light leading-relaxed text-stone/55">
              Every element of the pilgrimage is considered, arranged and
              held — so you can walk freely, breathe deeply and remain present.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col justify-center">
            <ul className="space-y-0">
              {includedItems.map((item, i) => (
                <li
                  key={item}
                  className={`reveal reveal-delay-${Math.min(i + 1, 5)} group flex items-center justify-between border-b border-antique-gold/10 py-5 transition-colors hover:border-antique-gold/30`}
                >
                  <span className="font-serif text-xl font-light text-ivory transition-transform duration-500 group-hover:translate-x-2 md:text-2xl">
                    {item}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide-sm text-antique-gold/50">
                    Included
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
