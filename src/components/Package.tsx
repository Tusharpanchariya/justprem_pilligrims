const inclusions = [
  'Accommodation',
  'Daily meals',
  'Transportation',
  'Guided pilgrimage',
  'Yoga & meditation',
  'Sacred site visits',
  'Local experiences',
  'Emergency support',
  'Workshop materials',
];

interface PackageProps {
  onEnquire: () => void;
}

export default function Package({ onEnquire }: PackageProps) {
  return (
    <section
      id="package"
      className="relative bg-near-black px-6 py-32 md:px-12 md:py-48 grain overflow-hidden"
    >
      <div className="mx-auto max-w-[1050px] text-center relative z-10">

        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="reveal mb-6 font-sans text-[10px] md:text-[11px] font-medium uppercase tracking-[0.28em] text-[#E6DCC8]/75">
            The Retreat
          </p>
          <h2 className="reveal reveal-delay-1 font-serif text-5xl font-medium tracking-[-0.025em] text-[#F1EEE7] md:text-6xl lg:text-7xl">
            <span className="font-sans font-light tracking-normal">11</span> Nights <span className="font-light text-[#E6DCC8]/50">/</span> <span className="font-sans font-light tracking-normal">12</span> Days
          </h2>
        </div>

        {/* Subtle Divider */}
        <div className="reveal reveal-delay-2 mx-auto mb-16 h-[1px] w-16 bg-[#E6DCC8]/30 md:mb-20" />

        {/* Early Bird Pricing Area */}
        <div className="reveal reveal-delay-3 flex flex-col items-center mb-24 md:mb-32">

          <div className="inline-flex items-center justify-center border border-[#E6DCC8]/20 px-6 py-2 mb-8">
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#E6DCC8]/90">
              Early Bird
            </span>
          </div>

          <h3 className="mb-8 font-serif text-2xl font-light text-[#F1EEE7] md:text-3xl">
            Reserve Your Journey
          </h3>

          <div className="mb-6 flex flex-col items-center">
            <span className="font-serif text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[#F1EEE7] mb-4">
              &euro;1,900
            </span>
            <span className="font-sans text-[11px] md:text-[12px] uppercase tracking-[0.15em] text-[#E6DCC8]/80 mb-2">
              Early Bird Rate
            </span>
            <span className="font-sans text-[12px] md:text-[13px] font-light text-[#EBE7DE]/60">
              Available until 8 November 2026
            </span>
          </div>

          <div className="mb-10">
            <span className="font-sans text-[13px] md:text-[14px] font-light text-[#EBE7DE]/50 line-through decoration-[#E6DCC8]/30">
              Standard Rate &euro;2,350
            </span>
          </div>

          <p className="max-w-md font-sans text-[13px] md:text-[14px] font-light leading-relaxed text-[#EBE7DE]/70 mb-10">
            Secure the Early Bird rate before 8 November and save &euro;450 on your pilgrimage.
          </p>

          <button
            onClick={onEnquire}
            className="group inline-flex h-[56px] items-center justify-center gap-3 border border-[#E6DCC8]/30 bg-transparent px-10 transition-all duration-700 hover:border-[#E6DCC8]/70 hover:bg-[#E6DCC8]/10"
          >
            <span className="font-sans text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-[#F1EEE7] transition-colors duration-700 group-hover:text-white">
              Enquire for the Retreat
            </span>
            <span className="font-sans text-[#E6DCC8]/70 transition-transform duration-700 group-hover:translate-x-1 group-hover:text-white">
              &rarr;
            </span>
          </button>

        </div>

      </div>
    </section>
  );
}
