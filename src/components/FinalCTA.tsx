import { images } from '@/data/images';

interface FinalCTAProps {
  onEnquire: () => void;
}

export default function FinalCTA({ onEnquire }: FinalCTAProps) {
  return (
    <section
      id="connect"
      className="relative h-[100svh] w-full overflow-hidden grain"
    >
      <img
        src={images.finalCta}
        alt="Himalayan mountain peak in clouds at sunrise"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-near-black/50 via-near-black/40 to-near-black/85" />
      <div className="absolute inset-0 bg-near-black/20" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="reveal mb-6 font-serif text-4xl font-light leading-tight text-ivory sm:text-5xl md:text-7xl lg:text-8xl">
          The Himalayas
          <br />
          are Calling
        </h2>
        <p className="reveal reveal-delay-1 mb-12 font-serif text-xl font-light italic text-stone/80 md:text-2xl lg:text-3xl">
          Will you answer?
        </p>

        <div className="reveal reveal-delay-2 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <button
            onClick={onEnquire}
            className="group relative overflow-hidden border border-antique-gold/60 px-10 py-4 text-[11px] uppercase tracking-editorial text-ivory transition-colors duration-700 hover:text-near-black"
          >
            <span className="relative z-10">Enquire for the Retreat</span>
            <span className="absolute inset-0 -translate-y-full bg-antique-gold transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
          </button>
          <a
            href="#journey"
            className="text-[11px] uppercase tracking-editorial text-stone/70 transition-colors duration-500 hover:text-ivory"
          >
            View the Journey
          </a>
        </div>
      </div>
    </section>
  );
}
