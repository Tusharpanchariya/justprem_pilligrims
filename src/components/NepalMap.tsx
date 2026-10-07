import mapBg from '../../assets/nepal_3d_map.jpg';

export default function NepalMap() {
  return (
    <section
      id="map"
      className="relative overflow-hidden bg-[#0A0A0B] px-6 py-32 md:px-12 md:py-48"
    >
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A9895E]/5 blur-[120px]" />

      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 text-center md:mb-24">
          <p className="reveal mb-6 text-[11px] uppercase tracking-ultra text-[#A9895E]">
            The Sacred Trail
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl font-light text-[#F1EEE7] md:text-6xl">
            A Pilgrimage Map
          </h2>
        </div>

        {/* Map container */}
        <div className="reveal reveal-delay-3 relative w-full max-w-5xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="relative w-full aspect-[4/3] md:aspect-[16/9]">
            {/* 3D Map Background */}
            <img
              src={mapBg.src}
              alt="3D Relief Map of Nepal"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 0 20px rgba(169, 137, 94, 0.1)) contrast(1.1) brightness(0.9)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
