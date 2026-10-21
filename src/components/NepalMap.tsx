'use client';

export default function NepalMap() {
  return (
    <section
      id="map"
      className="relative overflow-hidden bg-[#0A0A0B] px-4 sm:px-8 md:px-12 py-24 md:py-36"
    >
      {/* Atmospheric warm golden glow behind Nepal */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[950px] w-[950px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A9895E]/15 blur-[150px]" />

      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 text-center md:mb-14">
          <p className="reveal mb-3 text-[11px] uppercase tracking-ultra text-[#A9895E]">
            The Sacred Trail
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-3xl sm:text-4xl md:text-6xl font-light text-[#F1EEE7]">
            A Pilgrimage Map
          </h2>
        </div>

        {/* Map container - Large transparent 3D relief map with authentic contour depth */}
        <div className="reveal reveal-delay-2 relative w-full mx-auto flex items-center justify-center">
          <div className="relative w-full max-w-[1400px] aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
            <img
              src="/nepal_3d_map.png"
              alt="3D Relief Map of Nepal"
              className="w-full h-full object-contain scale-[1.3] sm:scale-[1.38] md:scale-[1.45] lg:scale-[1.5] transform-gpu transition-transform duration-700 ease-out hover:scale-[1.53]"
              style={{
                filter:
                  'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 50px rgba(169, 137, 94, 0.22)) contrast(1.05) brightness(1.02)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
