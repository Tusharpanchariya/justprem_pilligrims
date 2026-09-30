import { useEffect, useRef, useState } from 'react';

const pilgrimagePoints = [
  { x: 50, y: 75, label: 'Kathmandu', num: '01' },
  { x: 35, y: 55, label: 'Pokhara', num: '02' },
  { x: 60, y: 38, label: 'Poon Hill', num: '03' },
  { x: 45, y: 22, label: 'Jomsom', num: '04' },
  { x: 70, y: 15, label: 'Muktinath', num: '05' },
];

export default function NepalMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh - rect.top) / (rect.height + vh);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const routeLength = 100;
  const dashOffset = routeLength * (1 - progress);

  return (
    <section
      id="map"
      ref={ref}
      className="relative overflow-hidden bg-blue-black px-6 py-32 md:px-12 md:py-48"
    >
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-antique-gold/5 blur-[120px]" />

      <div className="mx-auto max-w-[1200px]">
        <div className="mb-16 text-center md:mb-24">
          <p className="reveal mb-6 text-[11px] uppercase tracking-ultra text-antique-gold">
            The Sacred Trail
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-4xl font-light text-ivory md:text-6xl">
            A Pilgrimage Map
          </h2>
          <p className="reveal reveal-delay-2 mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-stone/60">
            An ancient trail through the heart of Nepal — not a route to be
            driven, but a path to be walked.
          </p>
        </div>

        {/* Map container */}
        <div className="reveal reveal-delay-3 relative aspect-[4/5] w-full max-w-2xl mx-auto sm:aspect-square md:aspect-[3/2]">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            {/* Topographic contour lines */}
            {[...Array(8)].map((_, i) => (
              <path
                key={i}
                d={`M ${5 + i * 3} ${90 - i * 3} Q 30 ${70 - i * 4} 50 ${60 - i * 5} T 95 ${40 - i * 6}`}
                fill="none"
                stroke="#A9895E"
                strokeWidth="0.15"
                opacity={0.08 + i * 0.01}
              />
            ))}
            {[...Array(6)].map((_, i) => (
              <path
                key={`r-${i}`}
                d={`M ${10 + i * 4} ${20 + i * 2} Q 40 ${30 + i * 3} 60 ${25 + i * 2} T 90 ${15 + i}`}
                fill="none"
                stroke="#A9895E"
                strokeWidth="0.12"
                opacity={0.06}
              />
            ))}

            {/* Route path — curved sacred trail */}
            <path
              d="M 50 75 Q 30 65 35 55 Q 40 45 60 38 Q 50 30 45 22 Q 55 18 70 15"
              fill="none"
              stroke="#A9895E"
              strokeWidth="0.5"
              strokeDasharray="100"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              opacity={0.8}
            />

            {/* Pilgrimage points */}
            {pilgrimagePoints.map((pt) => (
              <g key={pt.num}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="0.8"
                  fill="#A9895E"
                  opacity={0.9}
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="2"
                  fill="none"
                  stroke="#A9895E"
                  strokeWidth="0.2"
                  opacity={0.3}
                />
              </g>
            ))}
          </svg>

          {/* HTML labels for crispness */}
          {pilgrimagePoints.map((pt) => (
            <div
              key={pt.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            >
              <div className="mt-3 whitespace-nowrap text-center">
                <span className="block text-[9px] uppercase tracking-wide-sm text-antique-gold/80">
                  {pt.num}
                </span>
                <span className="block text-[10px] font-light tracking-wide-sm text-ivory md:text-xs">
                  {pt.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="reveal reveal-delay-4 mt-16 text-center text-[12px] md:text-[14px] font-medium leading-[2] tracking-wider text-antique-gold/90 max-w-4xl mx-auto">
          Kathmandu &rarr; Pokhara &rarr; Ghandruk &rarr; Tadapani &rarr; Ghorepani &rarr; Poon Hill &rarr; Tatopani &rarr; Marpha &rarr; Jomsom &rarr; Kagbeni &rarr; Muktinath &rarr; Pokhara
        </p>
      </div>
    </section>
  );
}
