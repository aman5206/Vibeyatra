import React, { useState, useEffect } from 'react';
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Maximize2Icon,
  MapPinIcon,
  SparklesIcon,
  CameraIcon
} from './Icons';
import type { Destination, GalleryImage } from '../types/travel';

interface DestinationDetailPopoverProps {
  destination: Destination | null;
  onClose: () => void;
}

export const DestinationDetailPopover: React.FC<DestinationDetailPopoverProps> = ({
  destination,
  onClose
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Reset image index when switching destination
  useEffect(() => {
    setActiveImageIndex(0);
    setIsFullscreen(false);
  }, [destination?.id]);

  // Keyboard navigation: Escape to close, Arrow keys to navigate gallery
  useEffect(() => {
    if (!destination) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        if (destination.gallery && destination.gallery.length > 0) {
          setActiveImageIndex((prev) => (prev + 1) % destination.gallery!.length);
        }
      } else if (e.key === 'ArrowLeft') {
        if (destination.gallery && destination.gallery.length > 0) {
          setActiveImageIndex((prev) => (prev - 1 + destination.gallery!.length) % destination.gallery!.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [destination, isFullscreen, onClose]);

  if (!destination) return null;

  const isJaamGate = destination.id === 'jaam-gate';
  const gallery: GalleryImage[] = destination.gallery || [
    {
      id: destination.id,
      url: destination.thumbnail,
      title: destination.name,
      type: 'photo'
    }
  ];

  const currentImage = gallery[activeImageIndex] || gallery[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  return (
    <>
      {/* 
        CRITICAL VIEWPORT CENTERING FIX:
        Centered fixed overlay with backdrop blur, guaranteed inside viewport margins,
        max-width: min(900px, calc(100vw - 16px)) on mobile and max-height: calc(100dvh - 16px).
      */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn select-none"
        role="dialog"
        aria-modal="true"
        aria-label={`Details for ${destination.name}`}
        onClick={onClose}
      >
        {/* Modal Window Container (stops propagation so internal clicks do not close) */}
        <div
          className="relative w-full max-w-[min(900px,calc(100vw-16px))] sm:max-w-[min(900px,calc(100vw-32px))] max-h-[calc(100dvh-16px)] sm:max-h-[calc(100dvh-32px)] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#0c1611]/98 border border-amber-500/35 shadow-2xl shadow-black text-neutral-200 transition-all flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Header with Title, Distance and Prominent Close Button */}
          <div className="sticky top-0 z-30 flex items-center justify-between px-3.5 sm:px-7 py-3 sm:py-4 bg-[#0a110d]/95 backdrop-blur-xl border-b border-white/10 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0 pr-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <MapPinIcon size={16} className="text-amber-400 shrink-0 sm:w-[18px] sm:h-[18px]" />
                <h2 className="text-lg sm:text-2xl font-serif font-bold text-white tracking-tight truncate">
                  {destination.name}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono shrink-0">
                <span className="text-amber-300 font-bold bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  {isJaamGate ? '50 km from Indore' : `${destination.distanceFromIndore} from Indore`}
                </span>
                <span className="text-neutral-400 font-medium">({destination.day})</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-amber-400 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shrink-0"
              aria-label="Close detail panel"
            >
              <XIcon size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-3.5 sm:p-7 space-y-4 sm:space-y-6 flex-1">
            
            {/* Tagline if available */}
            {destination.tagline && (
              <div className="-mt-1">
                <h3 className="text-sm sm:text-lg font-serif italic text-amber-300/90 font-medium">
                  “{destination.tagline}”
                </h3>
              </div>
            )}

            {/* Main Image Stage */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black/60 border border-white/15 aspect-[16/10] sm:aspect-[16/9] max-h-[380px] sm:max-h-[440px] group">
              <img
                src={currentImage.url}
                alt={currentImage.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Gradient Vignette for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

              {/* Type Badge: Actual Photograph vs AI-Generated Illustration */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 z-10">
                {currentImage.type === 'photo' ? (
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-950/85 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[10px] sm:text-[11px] font-semibold shadow-md">
                    <CameraIcon size={11} className="text-emerald-400 sm:w-3 sm:h-3" />
                    <span>Actual Photograph</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-amber-950/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] sm:text-[11px] font-semibold shadow-md">
                    <SparklesIcon size={11} className="text-amber-400 sm:w-3 sm:h-3" />
                    <span>AI-Generated Illustration</span>
                  </span>
                )}
              </div>

              {/* Explore Fullscreen Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(true);
                }}
                className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/75 hover:bg-amber-400 hover:text-black border border-white/20 text-xs font-semibold text-white transition-all shadow-md cursor-pointer z-10"
                aria-label="Explore Fullscreen"
              >
                <Maximize2Icon size={13} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Explore Fullscreen</span>
              </button>

              {/* Previous & Next Overlaid Arrows (Visible when gallery has multiple items) */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2.5 rounded-full bg-black/70 hover:bg-amber-400 hover:text-black text-white border border-white/20 transition-all shadow-lg cursor-pointer z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2.5 rounded-full bg-black/70 hover:bg-amber-400 hover:text-black text-white border border-white/20 transition-all shadow-lg cursor-pointer z-10"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </>
              )}

              {/* Caption & Image Counter at bottom of stage */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-4 sm:right-4 flex items-center justify-between text-[11px] sm:text-xs text-neutral-300 z-10">
                <span className="font-medium text-white truncate max-w-[70%] drop-shadow">
                  {currentImage.title}
                </span>
                <span className="font-mono text-amber-300 font-bold shrink-0 bg-black/60 px-2 py-0.5 rounded border border-white/10 text-[10px] sm:text-xs">
                  {activeImageIndex + 1} / {gallery.length}
                </span>
              </div>
            </div>

            {/* Dedicated Category Heading, Caption and Image Description Area */}
            {(currentImage.category || currentImage.caption || currentImage.description) && (
              <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0f1b14] to-[#0a120e] border border-amber-500/30 shadow-lg shadow-black/40 flex flex-col gap-2 sm:gap-2.5 transition-all">
                {currentImage.category && (
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 sm:gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{currentImage.category}</span>
                    </h4>
                    <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400">
                      Image {activeImageIndex + 1} of {gallery.length}
                    </span>
                  </div>
                )}
                {currentImage.caption && (
                  <p className="text-xs sm:text-base font-serif italic text-neutral-100 leading-relaxed pl-2.5 sm:pl-3.5 border-l-2 border-amber-400/50">
                    “{currentImage.caption}”
                  </p>
                )}
                {currentImage.description && (
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pl-2.5 sm:pl-3.5 border-l-2 border-transparent">
                    {currentImage.description}
                  </p>
                )}
              </div>
            )}

            {/* Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 pt-1 no-scrollbar touch-pan-x">
                {gallery.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 sm:w-24 h-11 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer group ${
                      idx === activeImageIndex
                        ? 'border-amber-400 scale-105 shadow-[0_0_12px_#fbbf24]'
                        : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
                    }`}
                    aria-label={`Select image ${idx + 1}: ${img.title}`}
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
                    <span
                      className={`absolute bottom-0 inset-x-0 text-[7px] sm:text-[8px] font-bold text-center py-0.2 truncate px-0.5 ${
                        img.type === 'photo' ? 'bg-emerald-950/90 text-emerald-300' : 'bg-amber-950/90 text-amber-300'
                      }`}
                    >
                      {img.type === 'photo' ? 'PHOTO' : 'AI'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Attribution, Credits, and License Information Card */}
            {currentImage.type === 'photo' ? (
              <div className="p-3 sm:p-3.5 rounded-xl bg-[#09120d] border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] sm:text-xs text-neutral-300">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-emerald-400 font-bold shrink-0">Photographer:</span>
                  {currentImage.authorUrl ? (
                    <a
                      href={currentImage.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:underline font-medium break-all"
                    >
                      {currentImage.author}
                    </a>
                  ) : (
                    <span className="text-white font-medium">{currentImage.author}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono">
                  {currentImage.license && (
                    <div className="flex items-center gap-1 text-neutral-400">
                      <span>License:</span>
                      {currentImage.licenseUrl ? (
                        <a
                          href={currentImage.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-300 hover:underline"
                        >
                          {currentImage.license}
                        </a>
                      ) : (
                        <span className="text-neutral-200">{currentImage.license}</span>
                      )}
                    </div>
                  )}

                  {currentImage.sourceUrl && (
                    <a
                      href={currentImage.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 underline font-sans"
                    >
                      Wikimedia Source ↗
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 sm:p-3.5 rounded-xl bg-[#141a10] border border-amber-500/25 text-[11px] sm:text-xs text-amber-200/90 flex items-center gap-2">
                <SparklesIcon size={16} className="text-amber-400 shrink-0" />
                <span className="leading-relaxed">
                  <strong>Illustrative Concept:</strong> AI-generated visual preview representing Jaam Gate's stone gateway and valley road architecture. Not a verified photograph.
                </span>
              </div>
            )}

            {/* Description Narrative */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0e1713] border border-white/5">
              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5 sm:mb-2 flex items-center gap-1.5 font-mono">
                <span>Destination Overview</span>
              </h4>
              <p className="text-xs sm:text-base text-neutral-200 leading-relaxed">
                {destination.shortDesc}
              </p>
            </div>

            {/* Highlights Section */}
            {destination.highlights && destination.highlights.length > 0 && (
              <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0e1713] border border-white/5">
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5 sm:mb-3 flex items-center gap-1.5">
                  <SparklesIcon size={14} className="text-amber-400 shrink-0" />
                  <span>Highlights</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                  {destination.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/5 text-center flex items-center justify-center text-[10px] sm:text-xs font-semibold text-neutral-200"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 
        FULLSCREEN IMMERSIVE PHOTO GALLERY VIEWER
        Keyboard navigation (ArrowLeft, ArrowRight, Escape) and thumbnail strip
      */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-2xl text-white animate-fadeIn select-none overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`${destination.name} Fullscreen Gallery`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-4 border-b border-white/10 bg-black/60 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
              <CameraIcon size={18} className="text-amber-400 shrink-0 sm:w-5 sm:h-5" />
              <span className="font-serif font-bold text-sm sm:text-lg text-amber-300 truncate">
                {destination.name} — {currentImage.title}
              </span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono shrink-0">
                {activeImageIndex + 1} / {gallery.length}
              </span>
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-amber-400 hover:text-black transition-colors focus:outline-none shrink-0"
              aria-label="Close fullscreen gallery"
            >
              <XIcon size={20} />
            </button>
          </div>

          {/* Main Fullscreen Stage */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-8 min-h-0">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 p-2 sm:p-4 rounded-full bg-black/70 hover:bg-amber-400 hover:text-black border border-white/15 text-white transition-all shadow-xl z-20"
              aria-label="Previous photograph"
            >
              <ChevronLeftIcon size={20} className="sm:w-[26px] sm:h-[26px]" />
            </button>

            {/* Fullscreen Photo */}
            <div className="relative max-w-6xl max-h-[75vh] w-full flex flex-col items-center justify-center">
              <img
                src={currentImage.url}
                alt={currentImage.title}
                className="max-h-[46vh] sm:max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              />
              <div className="mt-2.5 sm:mt-3 text-center max-w-2xl px-2 sm:px-4 flex flex-col items-center gap-1 sm:gap-1.5">
                {currentImage.category && (
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/25">
                    {currentImage.category}
                  </span>
                )}
                {currentImage.caption && (
                  <p className="text-xs sm:text-base font-serif italic text-amber-100/95 max-w-xl">
                    “{currentImage.caption}”
                  </p>
                )}
                {currentImage.description && (
                  <p className="text-[11px] sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
                    {currentImage.description}
                  </p>
                )}
                <p className="text-[10px] sm:text-sm text-neutral-400 font-medium">
                  {currentImage.title}
                </p>
                {currentImage.type === 'photo' && currentImage.author && (
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-mono">
                    Photo by {currentImage.author} • {currentImage.license}
                  </span>
                )}
                {currentImage.type === 'ai' && (
                  <span className="text-[10px] sm:text-xs text-amber-400 font-mono">
                    AI-Generated Illustrative Concept
                  </span>
                )}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 p-2 sm:p-4 rounded-full bg-black/70 hover:bg-amber-400 hover:text-black border border-white/15 text-white transition-all shadow-xl z-20"
              aria-label="Next photograph"
            >
              <ChevronRightIcon size={20} className="sm:w-[26px] sm:h-[26px]" />
            </button>
          </div>

          {/* Fullscreen Thumbnail Strip */}
          <div className="px-3 sm:px-6 py-2.5 sm:py-4 bg-black/70 border-t border-white/10 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar shrink-0 touch-pan-x">
            {gallery.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-14 sm:w-16 h-10 sm:h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  idx === activeImageIndex
                    ? 'border-amber-400 scale-105 shadow-[0_0_12px_#facc15]'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
                aria-label={`Thumbnail ${idx + 1}`}
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
