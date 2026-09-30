export default function Intro() {
  return (
    <section
      id="intro"
      className="relative bg-near-black px-6 py-32 md:px-12 md:py-48 lg:py-64"
    >
      <div className="mx-auto max-w-5xl">
        <p className="reveal mb-12 text-[11px] uppercase tracking-ultra text-antique-gold md:mb-16">
          The Call
        </p>

        <h2 className="reveal reveal-delay-1 font-serif text-3xl font-light leading-[1.2] text-ivory sm:text-4xl md:text-5xl lg:text-6xl">
          Some journeys take you somewhere.
          <br />
          <span className="text-stone/70 italic">
            Some journeys take you inward.
          </span>
        </h2>

        <div className="mt-16 max-w-2xl space-y-6 md:mt-24 md:space-y-8">
          <p className="reveal reveal-delay-2 text-base font-light leading-[1.8] text-stone/80 md:text-lg">
            Beyond the trails, beyond the altitude, beyond the destination lies
            another kind of journey.
          </p>
          <p className="reveal reveal-delay-3 text-base font-light leading-[1.8] text-stone/80 md:text-lg">
            Heart of the Himalayas is an 11-night, 12-day pilgrimage through
            Nepal — created for those who wish to experience the mountains not
            simply as scenery, but as sacred presence.
          </p>
          <p className="reveal reveal-delay-4 text-base font-light leading-[1.8] text-stone/80 md:text-lg">
            Walk through ancient landscapes, sit in stillness beneath Himalayan
            skies, encounter living traditions and share moments of devotion,
            music, meditation and silence.
          </p>
          <p className="reveal reveal-delay-5 font-serif text-2xl font-light italic leading-relaxed text-ivory md:text-3xl">
            This is Nepal experienced slowly.
          </p>
        </div>
      </div>
    </section>
  );
}
