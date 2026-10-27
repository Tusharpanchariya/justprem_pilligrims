export default function Intro() {
  return (
    <section
      id="intro"
      className="relative bg-near-black px-6 py-20 md:px-12 md:py-28 lg:py-36 overflow-hidden"
    >
      {/* Atmospheric warm golden glow centered behind map */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[850px] rounded-full bg-[#A9895E]/12 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Section Title */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="reveal font-serif text-3xl font-light leading-[1.18] text-ivory sm:text-4xl md:text-5xl lg:text-6xl">
            Some journeys take you to places.
            <br />
            <span className="text-stone/70 italic">
              Others take you inward.
            </span>
          </h2>
        </div>

        {/* Main Text Above Map */}
        <div className="mx-auto max-w-3xl text-center mb-8 md:mb-12 px-4">
          <p className="reveal reveal-delay-1 font-serif text-[16px] sm:text-[18px] md:text-[20px] font-normal italic leading-[1.8] text-[#D8D2C4]/90">
            Join Swami Aniruddha, a travelling monk with over 20 years on the yogic path, for a 12-day Himalayan retreat in Nepal, where trekking, yoga, kirtan and meditation become a doorway to the journey within.
          </p>
        </div>

        {/* 3D Relief Route Map Centered */}
        <div className="reveal reveal-delay-2 relative w-full flex items-center justify-center my-4 md:my-6">
          <img
            src="/nepal_map_new.png"
            alt="Our Himalayan Route Map of Nepal"
            className="w-full max-w-[650px] md:max-w-[760px] lg:max-w-[850px] h-auto object-contain transform-gpu transition-transform duration-700 ease-out hover:scale-[1.02]"
            style={{
              filter:
                'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 45px rgba(169, 137, 94, 0.22)) contrast(1.05) brightness(1.02)',
            }}
          />
        </div>

        {/* Route Caption Below Map */}
        <p className="reveal reveal-delay-3 font-serif text-lg sm:text-xl md:text-2xl font-light italic text-[#E9E5DC] tracking-wide mt-6 md:mt-8 text-center">
          Our Himalayan Route
        </p>
      </div>
    </section>
  );
}
