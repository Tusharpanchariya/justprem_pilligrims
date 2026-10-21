'use client';

import { useState, useRef, useEffect, MouseEvent } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

type TestimonialItem = {
  id: string;
  type: 'youtube' | 'local';
  src: string;
  rotateLeft?: boolean;
};

const testimonials: TestimonialItem[] = [
  {
    id: 'yt-main',
    type: 'youtube',
    src: 'DCnkvgjX-1A',
  },
  {
    id: 'yt-1',
    type: 'youtube',
    src: 'QmgiEFCbq5k',
  },
  {
    id: 'yt-2',
    type: 'youtube',
    src: 'qiH56T4lIE4',
  },
  {
    id: 'yt-3',
    type: 'youtube',
    src: 'WZVMLgWmhio',
  },
  {
    id: 'ig-1',
    type: 'local',
    src: '/video_ig/video1.mp4',
  },
  {
    id: 'ig-2',
    type: 'local',
    src: '/video_ig/video2.mp4',
  },
  {
    id: 'ig-3',
    type: 'local',
    src: '/video_ig/video3.mp4',
  },
  {
    id: 'ig-4',
    type: 'local',
    src: '/video_ig/video4.mp4',
    rotateLeft: true,
  },
  {
    id: 'ig-5',
    type: 'local',
    src: '/video_ig/video5.mp4',
  },
];

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function LocalVideoPlayer({ item }: { item: TestimonialItem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    if (dur && dur > 0) {
      setProgress((cur / dur) * 100);
      setCurrentTimeStr(formatTime(cur));
      setDurationStr(formatTime(dur));
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDurationStr(formatTime(videoRef.current.duration));
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !progressTrackRef.current) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = pct * videoRef.current.duration;
    setProgress(pct * 100);
  };

  const handleToggleMute = (e: MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = (e: MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((videoRef.current as any)?.webkitEnterFullscreen) {
        (videoRef.current as any).webkitEnterFullscreen();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-lg border border-ivory/10 shadow-lg cursor-pointer group bg-near-black select-none"
      onClick={handlePlayToggle}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={`${item.src}#t=0.5`}
          playsInline
          preload="metadata"
          className={`object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none ${
            item.rotateLeft
              ? 'w-[56.25%] h-[177.78%] -rotate-90'
              : 'h-full w-full'
          }`}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            setProgress(0);
          }}
        />
      </div>

      {/* Paused State Overlay with Centered Play Button */}
      {!isPlaying && (
        <>
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
      )}

      {/* Playing State Custom Luxury Controls (Hover Overlay) */}
      {isPlaying && (
        <div
          className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-near-black/95 via-near-black/60 to-transparent flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div
            ref={progressTrackRef}
            className="group/track relative h-1.5 w-full bg-ivory/20 rounded-full cursor-pointer hover:h-2 transition-all"
            onClick={handleSeek}
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-antique-gold rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons & Time */}
          <div className="flex items-center justify-between text-ivory text-xs pt-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePlayToggle}
                className="hover:text-antique-gold transition-colors p-1"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className="hover:text-antique-gold transition-colors p-1"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              <span className="text-[11px] text-ivory/80 font-mono tracking-wider select-none">
                {currentTimeStr} / {durationStr}
              </span>
            </div>

            <button
              type="button"
              onClick={handleFullscreen}
              className="hover:text-antique-gold transition-colors p-1"
              aria-label="Fullscreen"
            >
              <Maximize size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function VideoFacade({ item }: { item: TestimonialItem }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (item.type === 'local') {
    return <LocalVideoPlayer item={item} />;
  }

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-lg border border-ivory/10 shadow-lg cursor-pointer group bg-near-black"
      onClick={() => setIsPlaying(true)}
    >
      {!isPlaying ? (
        <>
          <img
            src={`https://img.youtube.com/vi/${item.src}/maxresdefault.jpg`}
            alt="Video Thumbnail"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = `https://img.youtube.com/vi/${item.src}/hqdefault.jpg`;
            }}
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
          src={`https://www.youtube.com/embed/${item.src}?autoplay=1&modestbranding=1&rel=0`}
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
          {testimonials.map((item, i) => (
            <article
              key={item.id}
              className={`reveal ${i > 0 ? `reveal-delay-${Math.min(i, 5)}` : ''}`}
            >
              <VideoFacade item={item} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
