import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XIcon, SparklesIcon } from './Icons';

interface JaamGateCinematicIntroProps {
  onComplete: () => void;
  onSkip: () => void;
}

type IntroPhase = 'approach' | 'zoom' | 'passThrough' | 'reveal';

export const JaamGateCinematicIntro: React.FC<JaamGateCinematicIntroProps> = ({
  onComplete,
  onSkip
}) => {
  const [phase, setPhase] = useState<IntroPhase>('approach');
  const [progress, setProgress] = useState<number>(0);
  const hasFinishedRef = useRef<boolean>(false);
  const isMobileRef = useRef<boolean>(false);

  // Safe single-trigger completion / skip handler
  const handleFinish = useCallback((isSkip = false) => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    if (isSkip) {
      onSkip();
    } else {
      onComplete();
    }
  }, [onComplete, onSkip]);

  useEffect(() => {
    // Respect reduced-motion accessibility preference
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      handleFinish(true);
      return;
    }

    isMobileRef.current = typeof window !== 'undefined' && window.innerWidth < 640;
    const isMobile = isMobileRef.current;

    // Timeline duration (shorter on mobile for snappy experience)
    const approachDuration = isMobile ? 1200 : 1500;
    const zoomDuration = isMobile ? 1300 : 1700;
    const passThroughDuration = isMobile ? 900 : 1200;
    const totalDuration = approachDuration + zoomDuration + passThroughDuration + 200;

    // Phase 1 -> Phase 2 (Zoom towards arch center)
    const t1 = setTimeout(() => {
      setPhase('zoom');
    }, approachDuration);

    // Phase 2 -> Phase 3 (Pass through the arch tunnel into valley)
    const t2 = setTimeout(() => {
      setPhase('passThrough');
    }, approachDuration + zoomDuration);

    // Phase 3 -> Phase 4 (Valley vista settled)
    const t3 = setTimeout(() => {
      setPhase('reveal');
    }, approachDuration + zoomDuration + passThroughDuration);

    // Completion -> automatically hand-off to detail modal
    const t4 = setTimeout(() => {
      handleFinish(false);
    }, totalDuration);

    // Smooth progress bar animation
    const startTime = performance.now();
    let animId: number;
    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(pct);
      if (pct < 100 && !hasFinishedRef.current) {
        animId = requestAnimationFrame(updateProgress);
      }
    };
    animId = requestAnimationFrame(updateProgress);

    // Keyboard navigation: Escape or Space to skip immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFinish(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleFinish]);

  // Optical center of Jaam Gate archway in jaam_gate_approach.jpg (1024x576)
  // X: ~46.5%, Y: ~69.0%
  const archCenterOrigin = '46.5% 69.0%';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="fixed inset-0 z-50 bg-black overflow-hidden select-none flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Jaam Gate Cinematic Experience"
    >
      {/* 
        LAYER 1: The Beyond Valley Vista (public/assets/jaam-gate/jam_gate_indore.jpg)
        Positioned behind the archway; revealed fully as the camera breaks through the portal.
      */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        initial={{ scale: 1.25, opacity: 0 }}
        animate={{
          scale: phase === 'passThrough' || phase === 'reveal' ? 1.02 : 1.15,
          opacity: phase === 'passThrough' ? 0.95 : phase === 'reveal' ? 1 : 0.15,
          filter: phase === 'reveal' ? 'brightness(1) contrast(1.05)' : 'brightness(0.9) contrast(1)'
        }}
        transition={{
          duration: phase === 'passThrough' ? 1.2 : 1.5,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <img
          src="/assets/jaam-gate/jam_gate_indore.jpg"
          alt="Panoramic misty road and rolling hills of Nimar Valley from Jaam Gate"
          className="w-full h-full object-cover object-[50%_45%]"
        />

        {/* Cinematic Vignette on the Valley View */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/10 to-black/60 pointer-events-none" />
      </motion.div>

      {/* 
        LAYER 2: Foreground Gate Approach Plate (public/assets/jaam-gate/jaam_gate_approach.jpg)
        Smooth camera dolly pushing straight toward the arch opening with transformOrigin on the arch.
        Scale is capped at 2.65 to guarantee zero visible pixelation or artifacting.
      */}
      <motion.div
        className="absolute inset-0 w-full h-full origin-[46.5%_69.0%]"
        style={{ transformOrigin: archCenterOrigin }}
        initial={{ scale: 1.0, opacity: 1 }}
        animate={{
          scale:
            phase === 'approach'
              ? 1.05
              : phase === 'zoom'
              ? 2.65
              : 4.8, // Smooth pass-through expansion
          opacity: phase === 'passThrough' || phase === 'reveal' ? 0 : 1
        }}
        transition={{
          scale: {
            duration: phase === 'approach' ? 1.5 : phase === 'zoom' ? 1.7 : 1.1,
            ease: phase === 'zoom' ? [0.25, 0.1, 0.25, 1] : [0.4, 0, 0.2, 1]
          },
          opacity: {
            duration: phase === 'passThrough' ? 0.85 : 0.4,
            ease: 'easeInOut'
          }
        }}
      >
        <img
          src="/assets/jaam-gate/jaam_gate_approach.jpg"
          alt="Historic Jaam Gate front approach along the mountain highway"
          className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.04]"
        />

        {/* Ambient shadow gradient blending the gate facade into the atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
      </motion.div>

      {/* 
        LAYER 3: Tunnel Threshold & Golden Sunburst Breakthrough
        Simulates the luminous flash of emerging from the dark stone archway vault into the sunlight.
      */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-radial from-amber-300/80 via-amber-500/25 to-transparent mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === 'passThrough' ? [0, 0.85, 0.15] : 0
        }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      />

      {/* Dark arch aperture vignette to simulate the stone vault framing the screen */}
      <motion.div
        className="absolute inset-0 pointer-events-none border-[18px] sm:border-[28px] border-black/40 rounded-[28px] sm:rounded-[40px] shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]"
        animate={{
          opacity: phase === 'zoom' ? 0.7 : phase === 'passThrough' ? 0.2 : 0
        }}
        transition={{ duration: 0.8 }}
      />

      {/* 
        LAYER 4: Cinematic Letterbox Bars
      */}
      <div className="absolute top-0 left-0 right-0 h-6 sm:h-12 bg-black/90 backdrop-blur-sm z-30 pointer-events-none border-b border-white/5" />
      <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-12 bg-black/90 backdrop-blur-sm z-30 pointer-events-none border-t border-white/5" />

      {/* 
        LAYER 5: Cinematic Subtitles & Overlays
      */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-12">
        {/* Top Header Row with Location and Skip Button */}
        <div className="flex items-center justify-between w-full">
          {/* Location Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/30 shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
              Day 1 • 50 km from Indore
            </span>
          </motion.div>

          {/* Accessible Skip Intro Button (pointer-events-auto) */}
          <div className="pointer-events-auto">
            <button
              onClick={() => handleFinish(true)}
              className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/75 hover:bg-amber-400 hover:text-black backdrop-blur-md border border-amber-400/40 text-neutral-200 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xl active:scale-95"
              aria-label="Skip cinematic intro and open gallery"
            >
              <span>Skip Intro</span>
              <XIcon size={14} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Center / Lower Cinematic Text */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto px-4">
          <AnimatePresence mode="wait">
            {phase === 'approach' && (
              <motion.div
                key="approach-text"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15, transition: { duration: 0.4 } }}
                className="space-y-1.5"
              >
                <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs tracking-widest font-mono uppercase">
                  <SparklesIcon size={13} />
                  <span>Historic Mountain Pass</span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-lg">
                  Jaam Darwaza
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 font-medium max-w-md drop-shadow">
                  Approaching the royal stone gateway connecting Malwa to Nimar
                </p>
              </motion.div>
            )}

            {(phase === 'passThrough' || phase === 'reveal') && (
              <motion.div
                key="reveal-text"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-1.5"
              >
                <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs tracking-widest font-mono uppercase bg-black/50 px-3 py-1 rounded-full border border-amber-400/30">
                  <span>Welcome to the Hills</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight drop-shadow-xl">
                  Through the Gateway
                </h2>
                <p className="text-xs sm:text-sm text-neutral-200 font-medium drop-shadow">
                  Where winding roads meet endless misty valleys
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Status & Keyboard Hint */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-neutral-400 font-mono">
          <span className="hidden sm:inline">Press Esc or Space to skip</span>
          <span className="text-amber-400/80 uppercase tracking-wider ml-auto">
            {phase === 'approach' && 'Approaching Gateway...'}
            {phase === 'zoom' && 'Crossing Arch Portal...'}
            {(phase === 'passThrough' || phase === 'reveal') && 'Arriving at Jaam Gate...'}
          </span>
        </div>
      </div>

      {/* Bottom Glowing Golden Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-40">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-400 shadow-[0_0_12px_#fbbf24] transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};
