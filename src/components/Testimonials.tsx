'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

const testimonials = [
  {
    videoId: 'QmgiEFCbq5k',
  },
  {
    videoId: 'qiH56T4lIE4',
  },
  {
    videoId: 'WZVMLgWmhio',
  },
];

function VideoFacade({ videoId }: { videoId: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-lg border border-ivory/10 shadow-lg cursor-pointer group"
      onClick={() => setIsPlaying(true)}
    >
      {!isPlaying ? (
        <>
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Video Thumbnail"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-near-black/20 transition-opacity duration-700 group-hover:bg-near-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="flex h-14 w-14 items-center justify-center rounded-full border border-ivory/30 bg-near-black/40 backdrop-blur-sm transition-all duration-700 group-hover:scale-110 group-hover:border-antique-gold group-hover:bg-near-black/60"
              aria-label="Play video"
            >
              <Play
                size={18}
                strokeWidth={1}
                className="ml-0.5 text-ivory"
                fill="currentColor"
              />
            </button>
          </div>
        </>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
          title="Guest Review"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute left-0 top-0 h-full w-full"
        ></iframe>
      )}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative bg-charcoal px-6 py-32 md:px-12 md:py-48"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-20 text-center md:mb-32">
          <h2 className="reveal font-serif text-4xl font-light text-ivory md:text-5xl lg:text-6xl">
            Reviews from our guests
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {testimonials.map((t, i) => (
            <article
              key={i}
              className={`reveal ${i > 0 ? `reveal-delay-${Math.min(i, 5)}` : ''}`}
            >
              <VideoFacade videoId={t.videoId} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
