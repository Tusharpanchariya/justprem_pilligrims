'use client';

import { useState, useRef, useEffect, MouseEvent } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type TestimonialItem = {
  id: string;
  type: 'youtube' | 'local';
  src: string;
  title?: string;
  rotateLeft?: boolean;
};

const testimonials: TestimonialItem[] = [
  {
    id: 'yt-main',
    type: 'youtube',
    src: 'DCnkvgjX-1A',
    title: 'Walking in the footsteps of Saints',
  },
  {
    id: 'yt-1',
    type: 'youtube',
    src: 'QmgiEFCbq5k',
    title: 'Transformative Himalayan Journey',
  },
  {
    id: 'yt-2',
    type: 'youtube',
    src: 'qiH56T4lIE4',
    title: 'Spiritual Connection & Peace',
  },
  {
    id: 'yt-3',
    type: 'youtube',
    src: 'WZVMLgWmhio',
    title: 'A Sacred Life Pilgrimage',
  },
  {
    id: 'ig-1',
    type: 'local',
    src: '/video_ig/video1.mp4',
    title: 'Trekking Through Ancient Sacred Trails',
  },
  {
    id: 'ig-2',
    type: 'local',
    src: '/video_ig/video2.mp4',
    title: 'Majestic Rivers & Mountain Vistas',
  },
  {
    id: 'ig-3',
    type: 'local',
    src: '/video_ig/video3.mp4',
    title: 'Sadhana & Devotional Gathering',
  },
  {
    id: 'ig-4',
    type: 'local',
    src: '/video_ig/video4.mp4',
    title: 'Heartwarming Real Stories of Participants',
    rotateLeft: true,
  },
  {
    id: 'ig-5',
    type: 'local',
    src: '/video_ig/video5.mp4',
    title: 'Full Immersion into Music & Meditation',
  },
];

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/** Full-Screen Modal Player for Local & YouTube videos */
function FullscreenVideoModal({
  item,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
}: {
  item: TestimonialItem;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  // Lock body scroll and handle keyboard shortcuts
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === ' ' && item.type === 'local') {
        e.preventDefault();
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      }
    };

    const handleFullscreenChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onClose, onPrev, onNext, item.type]);

  const handlePlayToggle = (e?: MouseEvent) => {
    e?.stopPropagation();
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
    videoRef.current.play().catch(() => {
      // Autoplay might be muted by browser policy
      if (videoRef.current) {
        videoRef.current.muted = true;
        setIsMuted(true);
        videoRef.current.play().catch(() => {});
      }
    });
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

  const handleToggleNativeFullscreen = (e: MouseEvent) => {
    e.stopPropagation();
    if (!modalContainerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      if (modalContainerRef.current.requestFullscreen) {
        modalContainerRef.current.requestFullscreen();
      } else if ((modalContainerRef.current as any)?.webkitRequestFullscreen) {
        (modalContainerRef.current as any).webkitRequestFullscreen();
      }
    }
  };

  return (
    <div
      ref={modalContainerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8 animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Bar with Review Counter & Close Button */}
      <div
        className="absolute top-4 left-4 right-4 md:top-6 md:left-8 md:right-8 flex items-center justify-between z-50 text-ivory pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="font-serif tracking-wider text-sm md:text-base text-ivory/90">
            {item.title || 'Guest Review'}
          </span>
          <span className="text-xs text-antique-gold/90 font-mono px-2 py-0.5 rounded-full border border-antique-gold/30 bg-antique-gold/10">
            {currentIndex + 1} / {totalCount}
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory/10 hover:bg-antique-gold/20 text-ivory hover:text-antique-gold border border-ivory/20 hover:border-antique-gold/40 transition-all duration-300"
          aria-label="Close fullscreen video"
        >
          <X size={22} />
        </button>
      </div>

      {/* Previous Video Arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-near-black/70 hover:bg-antique-gold/30 text-ivory hover:text-antique-gold border border-ivory/20 hover:border-antique-gold/50 backdrop-blur-md transition-all duration-300 shadow-xl"
        aria-label="Previous review"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next Video Arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-near-black/70 hover:bg-antique-gold/30 text-ivory hover:text-antique-gold border border-ivory/20 hover:border-antique-gold/50 backdrop-blur-md transition-all duration-300 shadow-xl"
        aria-label="Next review"
      >
        <ChevronRight size={24} />
      </button>

      {/* Main Video Box (Centered 16:9 Max-Width) */}
      <div
        className="relative w-full max-w-5xl aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-near-black border border-ivory/15 shadow-2xl group/player select-none"
        onClick={(e) => {
          e.stopPropagation();
          if (item.type === 'local') handlePlayToggle();
        }}
      >
        {item.type === 'local' ? (
          <>
            {/* Video Canvas Container (handles left-rotated video4 properly) */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src={item.src}
                playsInline
                autoPlay
                className={`object-cover transition-transform duration-500 pointer-events-none ${
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

            {/* Play / Pause Centered Flash Icon when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none transition-opacity duration-300">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-antique-gold/50 bg-near-black/80 text-antique-gold backdrop-blur-md shadow-2xl">
                  <Play size={28} className="ml-1" fill="currentColor" />
                </div>
              </div>
            )}

            {/* Luxury Video Controls Bar at Bottom */}
            <div
              className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2.5 z-20 opacity-90 group-hover/player:opacity-100 transition-opacity duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress Bar */}
              <div
                ref={progressTrackRef}
                className="group/track relative h-1.5 hover:h-2.5 w-full bg-ivory/20 rounded-full cursor-pointer transition-all duration-200"
                onClick={handleSeek}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 bg-antique-gold rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-ivory text-xs pt-1">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handlePlayToggle}
                    className="hover:text-antique-gold transition-colors p-1"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="hover:text-antique-gold transition-colors p-1"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>

                  <span className="text-xs text-ivory/80 font-mono tracking-wider">
                    {currentTimeStr} / {durationStr}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleNativeFullscreen}
                  className="hover:text-antique-gold transition-colors p-1"
                  aria-label={isNativeFullscreen ? 'Exit fullscreen' : 'Enter native fullscreen'}
                >
                  {isNativeFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${item.src}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3`}
            title={item.title || 'Guest Review'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute left-0 top-0 h-full w-full"
          />
        )}
      </div>
    </div>
  );
}

/** Grid Card Facade (Preview) */
function GridCard({
  item,
  index,
  onOpen,
}: {
  item: TestimonialItem;
  index: number;
  onOpen: (index: number) => void;
}) {
  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-lg border border-ivory/10 shadow-lg cursor-pointer group bg-near-black transition-all duration-500 hover:border-antique-gold/40 hover:shadow-2xl"
      onClick={() => onOpen(index)}
    >
      {item.type === 'local' ? (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <video
            src={`${item.src}#t=0.5`}
            playsInline
            preload="metadata"
            muted
            className={`object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none ${
              item.rotateLeft
                ? 'w-[56.25%] h-[177.78%] -rotate-90'
                : 'h-full w-full'
            }`}
          />
        </div>
      ) : (
        <img
          src={`https://img.youtube.com/vi/${item.src}/maxresdefault.jpg`}
          alt={item.title || 'Video Thumbnail'}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `https://img.youtube.com/vi/${item.src}/hqdefault.jpg`;
          }}
        />
      )}

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-near-black/25 transition-opacity duration-700 group-hover:bg-near-black/10" />

      {/* Centered Circular Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          className="flex h-14 w-14 items-center justify-center rounded-full border border-ivory/30 bg-near-black/50 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-antique-gold group-hover:bg-near-black/75 shadow-lg"
          aria-label="Open fullscreen video"
        >
          <Play
            size={18}
            strokeWidth={1.5}
            className="ml-0.5 text-ivory group-hover:text-antique-gold transition-colors duration-300"
            fill="currentColor"
          />
        </button>
      </div>

      {/* Subtle Bottom Title Caption */}
      {item.title && (
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-near-black/90 via-near-black/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-xs font-serif text-ivory/90 truncate tracking-wide">
            {item.title}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Testimonials() {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);

  const handleOpenVideo = (index: number) => {
    setActiveVideoIndex(index);
  };

  const handleCloseVideo = () => {
    setActiveVideoIndex(null);
  };

  const handlePrevVideo = () => {
    if (activeVideoIndex === null) return;
    setActiveVideoIndex((activeVideoIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextVideo = () => {
    if (activeVideoIndex === null) return;
    setActiveVideoIndex((activeVideoIndex + 1) % testimonials.length);
  };

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
          <p className="mt-4 text-xs md:text-sm uppercase tracking-widest text-antique-gold/80 font-mono">
            Click any review to watch in full screen
          </p>
        </div>

        {/* 3x3 Grid with all 9 Reviews */}
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {testimonials.map((item, i) => (
            <article
              key={item.id}
              className={`reveal ${i > 0 ? `reveal-delay-${Math.min(i, 5)}` : ''}`}
            >
              <GridCard item={item} index={i} onOpen={handleOpenVideo} />
            </article>
          ))}
        </div>
      </div>

      {/* Full-Screen Cinema Modal */}
      {activeVideoIndex !== null && (
        <FullscreenVideoModal
          item={testimonials[activeVideoIndex]}
          currentIndex={activeVideoIndex}
          totalCount={testimonials.length}
          onClose={handleCloseVideo}
          onPrev={handlePrevVideo}
          onNext={handleNextVideo}
        />
      )}
    </section>
  );
}
