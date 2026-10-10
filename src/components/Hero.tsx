import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CalendarIcon,
  RouteIcon,
  GraduationCapIcon,
  ArrowRightIcon,
  MapPinIcon,
  InstagramIcon,
  MountainIcon,
  CameraIcon,
  LeafIcon,
  UsersIcon,
  QuoteIcon
} from './Icons';
import { RouteMapPanel } from './RouteMapPanel';
import { DESTINATIONS } from '../data/travelData';

interface HeroProps {
  selectedDestinationId: string | null;
  onSelectDestination: (id: string | null) => void;
  onExploreRouteClick: () => void;
}

// Progress positions along the golden route SVG curve (0.0 to 1.0)
const DEST_PROGRESS_MAP: Record<string, number> = {
  'indore': 0.0,
  'jaam-gate': 0.28,
  'maheshwar': 0.65,
  'sahastradhara': 0.95
};

// Travel-inspired quotes for the mobile carousel
const MOBILE_QUOTES = [
  '“Good roads lead to great stories.”',
  '“Collect moments, not miles.”',
  '“The best memories begin with a journey.”'
];

export const Hero: React.FC<HeroProps> = ({
  selectedDestinationId,
  onSelectDestination,
  onExploreRouteClick
}) => {
  const jaamGate = DESTINATIONS.find((d) => d.id === 'jaam-gate');
  const maheshwar = DESTINATIONS.find((d) => d.id === 'maheshwar');
  const sahastradhara = DESTINATIONS.find((d) => d.id === 'sahastradhara');

  // SVG route path ref for mathematical curve tracking
  const pathRef = useRef<SVGPathElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const currentProgressRef = useRef<number>(0.0);
  const isMovingRef = useRef<boolean>(false);

  // Mobile quotes carousel state
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const touchStartXRef = useRef<number | null>(null);

  // Auto-rotate mobile quotes carousel gently
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % MOBILE_QUOTES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleQuoteTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleQuoteTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        // Swiped left -> next quote
        setCurrentQuoteIndex((prev) => (prev + 1) % MOBILE_QUOTES.length);
      } else {
        // Swiped right -> prev quote
        setCurrentQuoteIndex((prev) => (prev - 1 + MOBILE_QUOTES.length) % MOBILE_QUOTES.length);
      }
    }
    touchStartXRef.current = null;
  };

  // Dynamic trip progress stepper line width for both mobile and desktop
  const getProgressWidth = () => {
    if (selectedDestinationId === 'jaam-gate') return 'w-1/3';
    if (selectedDestinationId === 'maheshwar') return 'w-2/3';
    if (selectedDestinationId === 'sahastradhara') return 'w-full';
    return 'w-0'; // Default: start at Indore (0 km)
  };

  // Animated bus position and state
  const [busState, setBusState] = useState<{
    x: number;
    y: number;
    angle: number;
    scale: number;
    progress: number;
    isMoving: boolean;
    activeTarget: string | null;
  }>({
    x: 60,
    y: 380,
    angle: 0,
    scale: 1.0,
    progress: 0.0,
    isMoving: false,
    activeTarget: null
  });

  const [totalPathLength, setTotalPathLength] = useState<number>(420);

  // Update bus position along the SVG path using exact curve geometry
  const updateBusAtProgress = useCallback((prog: number, moving: boolean, targetId: string | null) => {
    if (!pathRef.current) return;
    const totalLen = pathRef.current.getTotalLength();
    if (totalLen > 0 && totalLen !== totalPathLength) {
      setTotalPathLength(totalLen);
    }
    const d = Math.max(0, Math.min(totalLen, prog * totalLen));
    const pt = pathRef.current.getPointAtLength(d);

    // Tangent calculation along road direction
    const pAhead = pathRef.current.getPointAtLength(Math.min(totalLen, d + 3));
    const pBehind = pathRef.current.getPointAtLength(Math.max(0, d - 3));
    const dx = pAhead.x - pBehind.x;
    const dy = pAhead.y - pBehind.y;

    // Road goes bottom -> top (negative dy). 
    // Math.atan2(dy, dx) returns angle; adding 90 degrees points the bus forward along the road
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    // Perspective scaling: 1.0 at road base (foreground) down to 0.46 in deep valley
    const scale = 1.0 - (prog * 0.52);

    currentProgressRef.current = prog;
    setBusState({
      x: pt.x,
      y: pt.y,
      angle,
      scale,
      progress: prog,
      isMoving: moving,
      activeTarget: targetId
    });
  }, [totalPathLength]);

  // Initialize bus on mount once SVG path is rendered
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setTotalPathLength(len);
      updateBusAtProgress(0, false, null);
    }
  }, [updateBusAtProgress]);

  // Main interactive journey trigger: animates bus along route curve to destination
  const handleDestinationTrigger = useCallback((destId: string) => {
    if (destId === 'indore') {
      const targetProg = 0.0;
      const startProg = currentProgressRef.current;
      const deltaProg = targetProg - startProg;

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      const duration = 750;
      const startTime = performance.now();
      isMovingRef.current = true;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const t = Math.min(1, elapsed / duration);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const currentP = startProg + deltaProg * ease;

        if (t < 1) {
          updateBusAtProgress(currentP, true, null);
          rafIdRef.current = requestAnimationFrame(animate);
        } else {
          updateBusAtProgress(0, false, null);
          isMovingRef.current = false;
          rafIdRef.current = null;
          onSelectDestination(null);
        }
      };

      rafIdRef.current = requestAnimationFrame(animate);
      return;
    }

    const targetProg = DEST_PROGRESS_MAP[destId];
    if (targetProg === undefined) {
      onSelectDestination(destId);
      return;
    }

    // Cancel any in-flight animation frame immediately to avoid glitches
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // Respect reduced-motion accessibility preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      updateBusAtProgress(targetProg, false, destId);
      onSelectDestination(destId);
      return;
    }

    const startProg = currentProgressRef.current;
    const deltaProg = targetProg - startProg;

    // Smooth duration tailored to distance along the circuit
    const duration = Math.max(900, Math.min(1800, Math.abs(deltaProg) * 2100));
    const startTime = performance.now();
    isMovingRef.current = true;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);

      // Smooth easeInOutCubic curve for cinematic coach motion
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const currentP = startProg + deltaProg * ease;

      if (t < 1) {
        updateBusAtProgress(currentP, true, destId);
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        // Arrived safely at destination!
        updateBusAtProgress(targetProg, false, destId);
        isMovingRef.current = false;
        rafIdRef.current = null;

        // Open destination popover modal with verified gallery & captions
        setTimeout(() => {
          onSelectDestination(destId);
        }, 160);
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);
  }, [onSelectDestination, updateBusAtProgress]);

  // When modal closes, smoothly glide bus back to starting point
  useEffect(() => {
    if (selectedDestinationId === null && currentProgressRef.current > 0 && !isMovingRef.current) {
      const startP = currentProgressRef.current;
      const startTime = performance.now();
      const duration = 1000;

      const returnAnim = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const p = startP * (1 - ease);

        if (t < 1) {
          updateBusAtProgress(p, true, null);
          rafIdRef.current = requestAnimationFrame(returnAnim);
        } else {
          updateBusAtProgress(0, false, null);
          rafIdRef.current = null;
        }
      };

      rafIdRef.current = requestAnimationFrame(returnAnim);
    }
  }, [selectedDestinationId, updateBusAtProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* 
        HERO SECTION
        Desktop: matches reference screenshot 12-column grid.
        Mobile: cinematic full-viewport experience where the bus occupies 35-45% width,
        unobstructed by information cards.
      */}
      <section
        id="home"
        className="relative min-h-[100dvh] lg:min-h-screen w-full overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 pb-4 sm:pb-5 select-none"
      >
        {/* 
          SINGLE SCENIC BACKGROUND LAYER
          Preserves the sunset road-trip landscape across lush green hills, winding road, and river valley.
          Mobile framing (object-[52%_82%]) highlights the road & prominent bus at 35–45% viewport width.
        */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/assets/scenic_hero.jpg"
            alt="Scenic road journey through lush hills at golden hour sunset"
            className="w-full h-full object-cover object-[52%_82%] lg:object-center filter brightness-[0.88] contrast-[1.08] transition-all duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85';
            }}
          />

          {/* Cinematic Vignettes and Sunset Warmth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070c09] via-transparent to-black/60" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/60" />
        </div>

        {/* Main Hero Container */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-between">
          
          {/* Main Grid: Left Hero Info + Central Scenic Road Markers + Desktop Right Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start pt-1 sm:pt-2">
            
            {/* Left Column: Title & Trip Metrics */}
            <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4 max-w-xl relative z-30">
              {/* Tagline Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-amber-300 uppercase">
                  A Road Trip For College Explorers
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.06] drop-shadow-md">
                  Indore to <br />
                  <span className="text-[#F5B027] font-serif italic drop-shadow-[0_4px_24px_rgba(245,176,39,0.35)]">
                    Maheshwar
                  </span>
                </h1>
                <p className="mt-2 text-xs sm:text-base lg:text-lg text-neutral-200 font-medium tracking-wide">
                  One Road <span className="text-amber-400 mx-1">•</span> Three Destinations <span className="text-amber-400 mx-1">•</span> Endless Stories
                </p>
              </div>

              {/* Metric Badges Card Row - Compact & perfectly proportioned for mobile & desktop */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-0.5 sm:py-1 max-w-md w-full">
                <div className="glass-panel rounded-xl p-1.5 sm:p-2.5 flex flex-col items-center sm:items-start text-center sm:text-left border border-white/10 hover:border-amber-400/30 transition-colors">
                  <div className="text-amber-400 mb-0.5 sm:mb-1">
                    <CalendarIcon size={14} className="sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-white leading-tight">2 Days</span>
                  <span className="text-[7.5px] sm:text-[9px] text-neutral-400 uppercase tracking-wider">Duration</span>
                </div>

                <div className="glass-panel rounded-xl p-1.5 sm:p-2.5 flex flex-col items-center sm:items-start text-center sm:text-left border border-white/10 hover:border-amber-400/30 transition-colors">
                  <div className="text-amber-400 mb-0.5 sm:mb-1">
                    <RouteIcon size={14} className="sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-white leading-tight truncate w-full">Route Confirmed</span>
                  <span className="text-[7.5px] sm:text-[9px] text-neutral-400 uppercase tracking-wider">Circuit</span>
                </div>

                <div className="glass-panel rounded-xl p-1.5 sm:p-2.5 flex flex-col items-center sm:items-start text-center sm:text-left border border-white/10 hover:border-amber-400/30 transition-colors">
                  <div className="text-amber-400 mb-0.5 sm:mb-1">
                    <GraduationCapIcon size={14} className="sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-white leading-tight">College Squad</span>
                  <span className="text-[7.5px] sm:text-[9px] text-neutral-400 uppercase tracking-wider">Explorers</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="flex items-center pt-0.5 sm:pt-1">
                <button
                  onClick={onExploreRouteClick}
                  className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#F5B027] text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(245,176,39,0.35)] cursor-pointer active:scale-95"
                >
                  <span>Explore the Route</span>
                  <ArrowRightIcon size={15} />
                </button>
              </div>

            </div>

            {/* 
              Center Column: Open Winding Road, Golden SVG Route, Floating Markers & Animated Bus
              Visible on both Mobile and Desktop with full responsive alignment.
            */}
            <div className="w-full lg:col-span-3 flex flex-col justify-center items-center relative z-20 min-h-[300px] sm:min-h-[360px] lg:min-h-[380px] my-auto pointer-events-none select-none">
              
              {/* Glowing Golden Route SVG Canvas */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <svg className="w-full h-full max-w-[340px] sm:max-w-[400px]" viewBox="0 0 200 400" fill="none">
                  <defs>
                    <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Route Ambient Glow */}
                  <path
                    d="M 60,380 Q 120,290 85,220 T 140,110 T 110,30"
                    stroke="#F5B027"
                    strokeWidth="5.5"
                    strokeOpacity="0.45"
                    strokeLinecap="round"
                    filter="url(#routeGlow)"
                  />

                  {/* Core Golden Path traced by math ref */}
                  <path
                    ref={pathRef}
                    id="goldenRoutePath"
                    d="M 60,380 Q 120,290 85,220 T 140,110 T 110,30"
                    stroke="#F5B027"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_10px_#facc15]"
                  />

                  {/* Animated Golden Trail following behind the dot */}
                  {busState.progress > 0.02 && (
                    <path
                      d="M 60,380 Q 120,290 85,220 T 140,110 T 110,30"
                      stroke="#fef08a"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${busState.progress * totalPathLength} ${totalPathLength}`}
                      className="filter drop-shadow-[0_0_12px_#fbbf24]"
                    />
                  )}

                  {/* 
                    ELEGANT GLOWING GOLDEN ROUTE TRACKER DOT
                    Small circular dot (approx 8-12px) with subtle golden aura
                    Smoothly tracks along the route path to the selected destination
                  */}
                  <g
                    transform={`translate(${busState.x}, ${busState.y})`}
                    className="pointer-events-none select-none transition-transform duration-75 ease-linear"
                  >
                    {/* Outer soft ambient gold aura */}
                    <circle
                      r="10"
                      fill="#F5B027"
                      opacity="0.3"
                      className="filter blur-[2px]"
                    />

                    {/* Dynamic pulse ring when in motion */}
                    {busState.isMoving && (
                      <circle
                        r="14"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="1.2"
                        opacity="0.8"
                        className="animate-ping"
                      />
                    )}

                    {/* Golden halo glow */}
                    <circle
                      r="6.5"
                      fill="#fbbf24"
                      opacity="0.6"
                      filter="drop-shadow(0 0 6px #facc15)"
                    />

                    {/* Main Golden Circle Dot */}
                    <circle
                      r="4.5"
                      fill="#F5B027"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                      filter="drop-shadow(0 0 8px #F5B027)"
                    />

                    {/* Luminous Core Point */}
                    <circle
                      r="2"
                      fill="#ffffff"
                      opacity="0.9"
                    />
                  </g>
                </svg>
              </div>

              {/* Destination Marker: Sahastradhara (Highest point along road near river) */}
              {sahastradhara && (
                <div
                  className={`absolute top-[6%] right-2 sm:right-4 lg:top-[16%] lg:right-3 pointer-events-auto cursor-pointer group transition-all duration-300 ${
                    busState.activeTarget === 'sahastradhara' || selectedDestinationId === 'sahastradhara'
                      ? 'scale-105 z-30'
                      : 'z-20'
                  }`}
                  onClick={() => handleDestinationTrigger('sahastradhara')}
                  title="Sahastradhara — 110 km · Day 2"
                  aria-label="Sahastradhara — 110 km · Day 2"
                >
                  <div className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1 lg:px-3 lg:py-1.5 rounded-2xl bg-[#0c1611]/92 backdrop-blur-md border shadow-xl transition-all ${
                    busState.activeTarget === 'sahastradhara' || selectedDestinationId === 'sahastradhara'
                      ? 'border-amber-300 shadow-[0_0_20px_#fbbf24] ring-2 ring-amber-400/50'
                      : 'border-amber-400/50 group-hover:border-amber-300 group-hover:scale-105'
                  }`}>
                    <div className="relative w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                      <img src={sahastradhara.thumbnail} alt={sahastradhara.name} className="w-full h-full object-cover" />
                      {busState.activeTarget === 'sahastradhara' && busState.isMoving && (
                        <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" />
                      )}
                    </div>
                    {/* Complete Destination Label: visible on both mobile and desktop */}
                    <div className="flex flex-col text-left pr-1 min-w-0">
                      <span className="text-[10px] sm:text-xs font-bold text-white group-hover:text-amber-300 leading-tight truncate">
                        {sahastradhara.name}
                      </span>
                      <span className="text-[8px] sm:text-[9.5px] font-mono text-amber-400 leading-tight whitespace-nowrap">
                        110 km · Day 2
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Destination Marker: Maheshwar (Middle point along road) */}
              {maheshwar && (
                <div
                  className={`absolute top-[38%] right-2 sm:right-4 lg:top-[46%] lg:right-6 pointer-events-auto cursor-pointer group transition-all duration-300 ${
                    busState.activeTarget === 'maheshwar' || selectedDestinationId === 'maheshwar'
                      ? 'scale-105 z-30'
                      : 'z-20'
                  }`}
                  onClick={() => handleDestinationTrigger('maheshwar')}
                  title="Maheshwar — 100 km · Day 1"
                  aria-label="Maheshwar — 100 km · Day 1"
                >
                  <div className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1 lg:px-3 lg:py-1.5 rounded-2xl bg-[#0c1611]/92 backdrop-blur-md border shadow-xl transition-all ${
                    busState.activeTarget === 'maheshwar' || selectedDestinationId === 'maheshwar'
                      ? 'border-amber-300 shadow-[0_0_20px_#fbbf24] ring-2 ring-amber-400/50'
                      : 'border-amber-400/50 group-hover:border-amber-300 group-hover:scale-105'
                  }`}>
                    <div className="relative w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                      <img src={maheshwar.thumbnail} alt={maheshwar.name} className="w-full h-full object-cover" />
                      {busState.activeTarget === 'maheshwar' && busState.isMoving && (
                        <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" />
                      )}
                    </div>
                    {/* Complete Destination Label: visible on both mobile and desktop */}
                    <div className="flex flex-col text-left pr-1 min-w-0">
                      <span className="text-[10px] sm:text-xs font-bold text-white group-hover:text-amber-300 leading-tight truncate">
                        {maheshwar.name}
                      </span>
                      <span className="text-[8px] sm:text-[9.5px] font-mono text-amber-400 leading-tight whitespace-nowrap">
                        100 km · Day 1
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Destination Marker: Jaam Gate (Lower point along road) */}
              {jaamGate && (
                <div
                  className={`absolute top-[68%] left-2 sm:left-4 lg:left-auto lg:top-[72%] lg:right-1 pointer-events-auto cursor-pointer group transition-all duration-300 ${
                    busState.activeTarget === 'jaam-gate' || selectedDestinationId === 'jaam-gate'
                      ? 'scale-105 z-30'
                      : 'z-20'
                  }`}
                  onClick={() => handleDestinationTrigger('jaam-gate')}
                  title="Jaam Gate — 50 km · Day 1"
                  aria-label="Jaam Gate — 50 km · Day 1"
                >
                  <div className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1 lg:px-3 lg:py-1.5 rounded-2xl bg-[#0c1611]/92 backdrop-blur-md border shadow-xl transition-all ${
                    busState.activeTarget === 'jaam-gate' || selectedDestinationId === 'jaam-gate'
                      ? 'border-amber-300 shadow-[0_0_20px_#fbbf24] ring-2 ring-amber-400/50'
                      : 'border-amber-400/50 group-hover:border-amber-300 group-hover:scale-105'
                  }`}>
                    <div className="relative w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                      <img src={jaamGate.thumbnail} alt={jaamGate.name} className="w-full h-full object-cover" />
                      {busState.activeTarget === 'jaam-gate' && busState.isMoving && (
                        <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" />
                      )}
                    </div>
                    {/* Complete Destination Label: visible on both mobile and desktop */}
                    <div className="flex flex-col text-left pr-1 min-w-0">
                      <span className="text-[10px] sm:text-xs font-bold text-white group-hover:text-amber-300 leading-tight truncate">
                        {jaamGate.name}
                      </span>
                      <span className="text-[8px] sm:text-[9.5px] font-mono text-amber-400 leading-tight whitespace-nowrap">
                        50 km · Day 1
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Desktop Right Column: Stacked Trip Info Glass Cards (matches desktop reference) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-3 max-w-sm lg:ml-auto w-full">
              
              {/* Card 1: Trip Progress */}
              <div className="glass-panel rounded-2xl p-3.5 border border-amber-500/20 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5 flex items-center justify-between">
                  <span>Trip Progress</span>
                  <span className="text-[10px] font-mono text-amber-300/85 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    Start: Indore (0 km)
                  </span>
                </h3>
                
                {/* Stepper with golden connected line */}
                <div className="relative flex items-center justify-between px-1">
                  <div className="absolute left-2.5 right-2.5 top-2 h-0.5 bg-neutral-700 -z-0" />
                  {getProgressWidth() !== 'w-0' && (
                    <div className={`absolute left-2.5 ${getProgressWidth()} top-2 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 -z-0 shadow-[0_0_8px_#facc15] transition-all duration-500`} />
                  )}

                  {/* Stop 1: Indore (Start 0 km) */}
                  <div
                    className="relative z-10 flex flex-col items-center cursor-pointer group"
                    onClick={() => {
                      if (selectedDestinationId !== null) {
                        handleDestinationTrigger('indore');
                      }
                    }}
                  >
                    <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[8px] font-bold text-black shadow-[0_0_8px_#facc15]">
                      1
                    </div>
                    <span className="text-[9px] text-amber-300 font-bold mt-1">Indore</span>
                    <span className="text-[7.5px] font-mono text-neutral-400">0 km</span>
                  </div>

                  {/* Stop 2: Jaam Gate */}
                  <div
                    className="relative z-10 flex flex-col items-center cursor-pointer group"
                    onClick={() => handleDestinationTrigger('jaam-gate')}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-all ${
                      selectedDestinationId === 'jaam-gate'
                        ? 'bg-amber-300 border-white text-black scale-125 shadow-[0_0_8px_#facc15]'
                        : 'bg-neutral-800 border-neutral-600 text-neutral-400 group-hover:border-amber-400 group-hover:text-white'
                    }`}>
                      2
                    </div>
                    <span className={`text-[9px] font-medium mt-1 transition-colors ${
                      selectedDestinationId === 'jaam-gate' ? 'text-amber-300 font-bold' : 'text-neutral-400 group-hover:text-amber-300'
                    }`}>
                      Jaam Gate
                    </span>
                    <span className="text-[7.5px] font-mono text-neutral-500">50 km</span>
                  </div>

                  {/* Stop 3: Maheshwar */}
                  <div
                    className="relative z-10 flex flex-col items-center cursor-pointer group"
                    onClick={() => handleDestinationTrigger('maheshwar')}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-all ${
                      selectedDestinationId === 'maheshwar'
                        ? 'bg-amber-300 border-white text-black scale-125 shadow-[0_0_8px_#facc15]'
                        : 'bg-neutral-800 border-neutral-600 text-neutral-400 group-hover:border-amber-400 group-hover:text-white'
                    }`}>
                      3
                    </div>
                    <span className={`text-[9px] font-medium mt-1 transition-colors ${
                      selectedDestinationId === 'maheshwar' ? 'text-amber-300 font-bold' : 'text-neutral-400 group-hover:text-amber-300'
                    }`}>
                      Maheshwar
                    </span>
                    <span className="text-[7.5px] font-mono text-neutral-500">100 km</span>
                  </div>

                  {/* Stop 4: Sahastradhara */}
                  <div
                    className="relative z-10 flex flex-col items-center cursor-pointer group"
                    onClick={() => handleDestinationTrigger('sahastradhara')}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-all ${
                      selectedDestinationId === 'sahastradhara'
                        ? 'bg-amber-300 border-white text-black scale-125 shadow-[0_0_8px_#facc15]'
                        : 'bg-neutral-800 border-neutral-600 text-neutral-400 group-hover:border-amber-400 group-hover:text-white'
                    }`}>
                      4
                    </div>
                    <span className={`text-[9px] font-medium mt-1 transition-colors ${
                      selectedDestinationId === 'sahastradhara' ? 'text-amber-300 font-bold' : 'text-neutral-400 group-hover:text-amber-300'
                    }`}>
                      Sahastradhara
                    </span>
                    <span className="text-[7.5px] font-mono text-neutral-500">110 km</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Trip Highlights */}
              <div className="glass-panel rounded-2xl p-3.5 border border-amber-500/20 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5">
                  Trip Highlights
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-amber-400 shrink-0">
                      <MountainIcon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white leading-tight">Scenic Destinations</span>
                      <span className="text-[8px] text-neutral-400">High ghats & river</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-amber-400 shrink-0">
                      <CameraIcon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white leading-tight">Photo-worthy Locations</span>
                      <span className="text-[8px] text-neutral-400">Golden hour spots</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-amber-400 shrink-0">
                      <LeafIcon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white leading-tight">Nature & Peace</span>
                      <span className="text-[8px] text-neutral-400">Fresh breeze</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-amber-400 shrink-0">
                      <UsersIcon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white leading-tight">Perfect for College Trips</span>
                      <span className="text-[8px] text-neutral-400">Squad memories</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Quote Card */}
              <div className="glass-panel rounded-2xl p-3.5 border border-amber-500/20 shadow-xl relative overflow-hidden">
                <div className="text-amber-400/20 absolute right-2.5 top-0.5 pointer-events-none">
                  <QuoteIcon size={46} />
                </div>
                <p className="text-sm sm:text-base font-serif italic text-amber-200/95 leading-relaxed relative z-10">
                  “Good roads lead to great stories.”
                </p>
              </div>

            </div>
          </div>

          {/* Lower Bottom Elements Row: Desktop Route Map & Prompts */}
          <div className="pt-2">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 pt-2 border-t border-white/10">
              
              {/* Desktop Lower Left: Route Map Panel (Visible md and above) */}
              <div className="hidden md:flex justify-start">
                <RouteMapPanel
                  selectedDestinationId={selectedDestinationId}
                  onSelectDestination={handleDestinationTrigger}
                />
              </div>

              {/* Bottom Center: Scroll To Explore Prompt */}
              <div
                onClick={() => {
                  const target = document.getElementById('mobile-trip-overview') || document.getElementById('our-trip');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex flex-col items-center gap-1 mx-auto my-1 cursor-pointer group"
              >
                <div className="w-4 h-7 rounded-full border border-amber-400/60 flex items-start justify-center p-0.5 group-hover:border-amber-300">
                  <span className="w-1 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                </div>
                <span className="text-[8.5px] sm:text-[9px] font-bold tracking-widest uppercase text-neutral-300 group-hover:text-amber-300 transition-colors">
                  SCROLL TO EXPLORE
                </span>
              </div>

              {/* Desktop Bottom Right: Location Badge & Instagram Tag */}
              <div className="hidden md:flex flex-wrap items-center justify-end gap-3 sm:gap-4 text-xs text-neutral-300">
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <InstagramIcon size={15} />
                  <div className="w-12 sm:w-16 h-0.5 bg-amber-400/80 rounded-full" />
                </div>

                <div className="flex items-center gap-1 text-amber-300 font-medium text-[11px] uppercase tracking-wider">
                  <MapPinIcon size={14} />
                  <span>Madhya Pradesh, India</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 
        MOBILE JOURNEY DETAILS & OVERVIEW (lg:hidden)
        Organized directly below the cinematic hero on mobile so the bus is NEVER covered.
        Desktop is 100% untouched because this section is lg:hidden.
      */}
      <section
        id="mobile-trip-overview"
        className="lg:hidden w-full px-4 sm:px-6 py-8 sm:py-10 bg-[#070c09] border-t border-white/10 space-y-4"
      >
        <div className="max-w-md mx-auto space-y-4">
          
          {/* Mobile Card 1: Trip Progress */}
          <div className="glass-panel rounded-2xl p-4 border border-amber-500/20 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center justify-between">
              <span>Trip Progress</span>
              <span className="text-[10px] font-mono text-amber-300/85 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                Start: Indore (0 km)
              </span>
            </h3>
            
            <div className="relative flex items-center justify-between px-1">
              <div className="absolute left-3 right-3 top-2.5 h-0.5 bg-neutral-800 -z-0" />
              {getProgressWidth() !== 'w-0' && (
                <div className={`absolute left-3 ${getProgressWidth()} top-2.5 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 -z-0 shadow-[0_0_8px_#facc15] transition-all duration-500`} />
              )}

              {/* Stop 1: Indore (Current Starting Point) */}
              <div
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => {
                  if (selectedDestinationId !== null) {
                    handleDestinationTrigger('indore');
                  }
                }}
              >
                <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[8.5px] font-bold text-black shadow-[0_0_10px_#facc15] ring-2 ring-amber-400/40">
                  1
                </div>
                <span className="text-[9px] text-amber-300 font-bold mt-1">Indore</span>
                <span className="text-[7.5px] font-mono text-neutral-400">Start (0 km)</span>
              </div>

              {/* Stop 2: Jaam Gate */}
              <div
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => handleDestinationTrigger('jaam-gate')}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-all ${
                  selectedDestinationId === 'jaam-gate'
                    ? 'bg-amber-300 border-white text-black scale-125 shadow-[0_0_10px_#facc15]'
                    : 'bg-neutral-800 border-neutral-600 text-neutral-400 group-hover:border-amber-400 group-hover:text-white'
                }`}>
                  2
                </div>
                <span className={`text-[9px] font-medium mt-1 transition-colors ${
                  selectedDestinationId === 'jaam-gate' ? 'text-amber-300 font-bold' : 'text-neutral-400 group-hover:text-amber-300'
                }`}>
                  Jaam Gate
                </span>
                <span className="text-[7.5px] font-mono text-neutral-500">50 km</span>
              </div>

              {/* Stop 3: Maheshwar */}
              <div
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => handleDestinationTrigger('maheshwar')}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-all ${
                  selectedDestinationId === 'maheshwar'
                    ? 'bg-amber-300 border-white text-black scale-125 shadow-[0_0_10px_#facc15]'
                    : 'bg-neutral-800 border-neutral-600 text-neutral-400 group-hover:border-amber-400 group-hover:text-white'
                }`}>
                  3
                </div>
                <span className={`text-[9px] font-medium mt-1 transition-colors ${
                  selectedDestinationId === 'maheshwar' ? 'text-amber-300 font-bold' : 'text-neutral-400 group-hover:text-amber-300'
                }`}>
                  Maheshwar
                </span>
                <span className="text-[7.5px] font-mono text-neutral-500">100 km</span>
              </div>

              {/* Stop 4: Sahastradhara */}
              <div
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => handleDestinationTrigger('sahastradhara')}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-all ${
                  selectedDestinationId === 'sahastradhara'
                    ? 'bg-amber-300 border-white text-black scale-125 shadow-[0_0_10px_#facc15]'
                    : 'bg-neutral-800 border-neutral-600 text-neutral-400 group-hover:border-amber-400 group-hover:text-white'
                }`}>
                  4
                </div>
                <span className={`text-[9px] font-medium mt-1 transition-colors ${
                  selectedDestinationId === 'sahastradhara' ? 'text-amber-300 font-bold' : 'text-neutral-400 group-hover:text-amber-300'
                }`}>
                  Sahastradhara
                </span>
                <span className="text-[7.5px] font-mono text-neutral-500">110 km</span>
              </div>
            </div>
          </div>

          {/* Mobile Card 2: Trip Highlights */}
          <div className="glass-panel rounded-2xl p-4 border border-amber-500/20 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
              Trip Highlights
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-amber-400 shrink-0">
                  <MountainIcon size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white leading-tight">Scenic Spots</span>
                  <span className="text-[8px] text-neutral-400">High ghats & river</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-amber-400 shrink-0">
                  <CameraIcon size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white leading-tight">Photo Points</span>
                  <span className="text-[8px] text-neutral-400">Golden hour spots</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-amber-400 shrink-0">
                  <LeafIcon size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white leading-tight">Nature & Calm</span>
                  <span className="text-[8px] text-neutral-400">Fresh breeze</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-amber-400 shrink-0">
                  <UsersIcon size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white leading-tight">College Trips</span>
                  <span className="text-[8px] text-neutral-400">Squad memories</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Card 3: Inspiring Quotes Carousel */}
          <div
            className="glass-panel rounded-2xl p-4 border border-amber-500/20 shadow-xl relative overflow-hidden select-none"
            onTouchStart={handleQuoteTouchStart}
            onTouchEnd={handleQuoteTouchEnd}
            aria-roledescription="carousel"
            aria-label="Inspiring travel quotes"
          >
            <div className="text-amber-400/20 absolute right-2.5 top-0.5 pointer-events-none">
              <QuoteIcon size={44} />
            </div>

            <div className="relative z-10 flex flex-col min-h-[64px] justify-between">
              {/* Quote item with smooth slide / fade transition */}
              <div className="relative overflow-hidden min-h-[44px] flex items-center">
                <p
                  key={currentQuoteIndex}
                  className="text-sm font-serif italic text-amber-200/95 leading-relaxed transition-all duration-300 ease-out"
                >
                  {MOBILE_QUOTES[currentQuoteIndex]}
                </p>
              </div>

              {/* Carousel Indicators and Navigation */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/5 mt-1.5">
                <div className="flex items-center gap-1.5">
                  {MOBILE_QUOTES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentQuoteIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentQuoteIndex === idx
                          ? 'w-5 bg-amber-400 shadow-[0_0_6px_#fbbf24]'
                          : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to quote ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[8.5px] font-mono text-neutral-400 tracking-wider uppercase">
                    {currentQuoteIndex + 1} / {MOBILE_QUOTES.length} • Swipe
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentQuoteIndex((prev) => (prev - 1 + MOBILE_QUOTES.length) % MOBILE_QUOTES.length)}
                      className="w-5 h-5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center justify-center transition-colors text-xs leading-none"
                      aria-label="Previous quote"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentQuoteIndex((prev) => (prev + 1) % MOBILE_QUOTES.length)}
                      className="w-5 h-5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center justify-center transition-colors text-xs leading-none"
                      aria-label="Next quote"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Card 4: Interactive Route Map Panel */}
          <div className="flex flex-col items-center pt-2">
            <div className="w-full flex justify-center">
              <RouteMapPanel
                selectedDestinationId={selectedDestinationId}
                onSelectDestination={handleDestinationTrigger}
              />
            </div>

            <div className="flex items-center justify-between w-full max-w-[290px] pt-4 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <InstagramIcon size={15} />
                <span>@vibeyatra</span>
              </div>
              <div className="flex items-center gap-1 text-amber-300 font-medium text-[11px] uppercase tracking-wider">
                <MapPinIcon size={14} />
                <span>Madhya Pradesh</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};
