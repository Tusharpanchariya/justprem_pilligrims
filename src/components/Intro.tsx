export default function Intro() {
  return (
    <section
      id="intro"
      className="relative bg-near-black px-6 py-20 md:px-12 md:py-28 lg:py-36 overflow-hidden"
    >
      {/* Atmospheric warm golden glow behind map */}
      <div className="pointer-events-none absolute right-[5%] top-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-[#A9895E]/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <h2 className="reveal font-serif text-3xl font-light leading-[1.18] text-ivory sm:text-4xl md:text-5xl lg:text-6xl mb-12 md:mb-16">
          Some journeys take you to places.
          <br />
          <span className="text-stone/70 italic">
            Others take you inward.
          </span>
        </h2>

        {/* Two column grid layout for text and 3D map */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
          {/* Left Column - Text Content */}
          <div className="lg:col-span-6 space-y-6 md:space-y-7 max-w-[540px]">
            <p className="reveal reveal-delay-1 font-serif text-[15px] sm:text-[16px] md:text-[17px] font-normal leading-[1.75] text-[#D8D2C4]/90">
              Experience a 12–day Himalayan journey through Nepal with Swami Aniruddha, a travelling monk with over 20 years on the yogic path.
            </p>

            <p className="reveal reveal-delay-2 font-serif text-[15px] sm:text-[16px] md:text-[17px] font-normal leading-[1.75] text-[#D8D2C4]/90">
              Starting with the ancient temples of Kathmandu, we will make our way through the mountain villages and valleys of Nepal, culminating our journey at Muktinath Temple, a sacred destination revered by Hindus as a shrine to Lord Vishnu and by Buddhists as a place of spiritual liberation.
            </p>

            <p className="reveal reveal-delay-3 font-serif text-[15px] sm:text-[16px] md:text-[17px] font-normal leading-[1.75] text-[#D8D2C4]/90">
              Along the way, we will practice yoga and meditation, sing kirtan (mantra chanting), hike through the Himalayas, and gather for evening satsangs (philosophical discussions) exploring not only the world around us, but also the space within.
            </p>
          </div>

          {/* Right Column - 3D Relief Map */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="reveal reveal-delay-2 relative w-full flex items-center justify-center">
              <img
                src="/nepal_route_map.png"
                alt="Our Himalayan Route Map of Nepal"
                className="w-full max-w-[500px] md:max-w-[540px] h-auto object-contain transform-gpu transition-transform duration-700 ease-out hover:scale-[1.03]"
                style={{
                  filter:
                    'drop-shadow(0 22px 45px rgba(0, 0, 0, 0.92)) drop-shadow(0 0 35px rgba(169, 137, 94, 0.18)) contrast(1.05) brightness(1.02)',
                }}
              />
            </div>
            <p className="reveal reveal-delay-3 font-serif text-lg md:text-xl font-light text-[#E9E5DC] tracking-wide mt-5 md:mt-7 text-center">
              Our Himalayan Route
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
