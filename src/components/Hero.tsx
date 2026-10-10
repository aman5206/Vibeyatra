import React from 'react';
import {
  CalendarIcon,
  RouteIcon,
  GraduationCapIcon,
  PlayIcon,
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

export const Hero: React.FC<HeroProps> = ({
  selectedDestinationId,
  onSelectDestination,
  onExploreRouteClick
}) => {
  const jaamGate = DESTINATIONS.find((d) => d.id === 'jaam-gate');
  const maheshwar = DESTINATIONS.find((d) => d.id === 'maheshwar');
  const sahastradhara = DESTINATIONS.find((d) => d.id === 'sahastradhara');

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between pt-24 pb-5 select-none"
    >
      {/* 
        SINGLE SCENIC BACKGROUND LAYER
        Photorealistic sunset road-trip landscape through lush green hills, winding road, and river valley.
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/assets/scenic_hero.jpg"
          alt="Scenic road journey through lush hills at golden hour sunset"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.08]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85';
          }}
        />

        {/* Cinematic Vignettes and Sunset Warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070c09] via-transparent to-black/60" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/60" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-between">
        
        {/* Upper Main Row: Left Hero Info + Central Markers + Right Glass Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          
          {/* Left Column: Title & Trip Metrics */}
          <div className="lg:col-span-5 flex flex-col gap-4 max-w-xl">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-amber-300 uppercase">
                A Road Trip For College Explorers
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.06] drop-shadow-md">
                Indore to <br />
                <span className="text-[#F5B027] font-serif italic drop-shadow-[0_4px_24px_rgba(245,176,39,0.35)]">
                  Maheshwar
                </span>
              </h1>
              <p className="mt-2.5 text-sm sm:text-lg text-neutral-200 font-medium tracking-wide">
                One Road <span className="text-amber-400 mx-1 sm:mx-1.5">•</span> Three Destinations <span className="text-amber-400 mx-1 sm:mx-1.5">•</span> Endless Stories
              </p>
            </div>

            {/* Metric Badges Card Row */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-1 max-w-md">
              <div className="glass-panel rounded-xl p-2 sm:p-2.5 flex flex-col items-center sm:items-start text-center sm:text-left border border-white/10 hover:border-amber-400/30 transition-colors">
                <div className="text-amber-400 mb-1">
                  <CalendarIcon size={16} />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-white leading-tight">2 Days</span>
                <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase tracking-wider">Trip Duration</span>
              </div>

              <div className="glass-panel rounded-xl p-2 sm:p-2.5 flex flex-col items-center sm:items-start text-center sm:text-left border border-white/10 hover:border-amber-400/30 transition-colors">
                <div className="text-amber-400 mb-1">
                  <RouteIcon size={16} />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-white leading-tight truncate w-full">Route Confirmed</span>
                <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase tracking-wider">Scenic Circuit</span>
              </div>

              <div className="glass-panel rounded-xl p-2 sm:p-2.5 flex flex-col items-center sm:items-start text-center sm:text-left border border-white/10 hover:border-amber-400/30 transition-colors">
                <div className="text-amber-400 mb-1">
                  <GraduationCapIcon size={16} />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-white leading-tight">College Squad</span>
                <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase tracking-wider">Explorers</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={onExploreRouteClick}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#F5B027] text-black font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(245,176,39,0.35)] cursor-pointer"
              >
                <span>Explore the Route</span>
                <ArrowRightIcon size={16} />
              </button>

              <button
                onClick={() => onSelectDestination('maheshwar')}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#101b15]/80 hover:bg-[#182a21] border border-white/15 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 sm:gap-2.5 transition-all backdrop-blur-md cursor-pointer hover:border-amber-400/40"
              >
                <div className="w-5 h-5 rounded-full bg-[#F5B027] text-black flex items-center justify-center">
                  <PlayIcon size={10} className="ml-0.5" />
                </div>
                <span>Watch Our Journey</span>
              </button>
            </div>

            {/* Mobile Destination Markers Quick Strip */}
            <div className="flex lg:hidden items-center gap-2.5 overflow-x-auto py-2 no-scrollbar">
              {DESTINATIONS.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => onSelectDestination(dest.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c1611]/90 backdrop-blur-md border border-amber-400/40 text-left shrink-0 active:scale-95 transition-all shadow-md"
                >
                  <img src={dest.thumbnail} alt={dest.name} className="w-7 h-7 rounded-full object-cover border border-amber-400" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-tight">{dest.name}</span>
                    <span className="text-[9px] font-mono text-amber-400">{dest.distanceFromIndore}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center Column: Open Winding Road & Floating Destination Markers */}
          <div className="lg:col-span-3 hidden lg:flex flex-col justify-center items-center relative min-h-[360px] pointer-events-none">
            
            {/* Glowing Golden Road Line tracing along road */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 200 400" fill="none">
                <path
                  d="M 60,380 Q 120,290 85,220 T 140,110 T 110,30"
                  stroke="#F5B027"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_#facc15]"
                />
              </svg>
            </div>

            {/* Circular Marker: Sahastradhara (Highest point along road near river) */}
            {sahastradhara && (
              <div
                className="absolute top-[18%] right-2 pointer-events-auto cursor-pointer group"
                onClick={() => onSelectDestination('sahastradhara')}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#0c1611]/85 backdrop-blur-md border border-amber-400/50 group-hover:border-amber-300 shadow-xl group-hover:scale-105 transition-all">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                    <img src={sahastradhara.thumbnail} alt={sahastradhara.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300">{sahastradhara.name}</span>
                    <span className="text-[10px] font-mono text-amber-400">{sahastradhara.distanceFromIndore} • {sahastradhara.day}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Circular Marker: Maheshwar (Middle point along road) */}
            {maheshwar && (
              <div
                className="absolute top-[48%] right-6 pointer-events-auto cursor-pointer group"
                onClick={() => onSelectDestination('maheshwar')}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#0c1611]/85 backdrop-blur-md border border-amber-400/50 group-hover:border-amber-300 shadow-xl group-hover:scale-105 transition-all">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                    <img src={maheshwar.thumbnail} alt={maheshwar.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300">{maheshwar.name}</span>
                    <span className="text-[10px] font-mono text-amber-400">{maheshwar.distanceFromIndore} • {maheshwar.day}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Circular Marker: Jaam Gate (Lower point along road) */}
            {jaamGate && (
              <div
                className="absolute top-[75%] right-1 pointer-events-auto cursor-pointer group"
                onClick={() => onSelectDestination('jaam-gate')}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#0c1611]/85 backdrop-blur-md border border-amber-400/50 group-hover:border-amber-300 shadow-xl group-hover:scale-105 transition-all">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                    <img src={jaamGate.thumbnail} alt={jaamGate.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300">{jaamGate.name}</span>
                    <span className="text-[10px] font-mono text-amber-400">{jaamGate.distanceFromIndore} • {jaamGate.day}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Stacked Trip Info Glass Cards */}
          <div className="lg:col-span-4 flex flex-col gap-3 max-w-sm lg:ml-auto w-full">
            
            {/* Card 1: Trip Progress */}
            <div className="glass-panel rounded-2xl p-3.5 border border-amber-500/20 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5 flex items-center justify-between">
                <span>Trip Progress</span>
              </h3>
              
              {/* Stepper with golden connected line */}
              <div className="relative flex items-center justify-between px-1">
                <div className="absolute left-2.5 right-2.5 top-2 h-0.5 bg-neutral-700 -z-0" />
                <div className="absolute left-2.5 w-3/4 top-2 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 -z-0 shadow-[0_0_8px_#facc15]" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[8px] font-bold text-black shadow">
                    1
                  </div>
                  <span className="text-[9px] text-white font-medium mt-1">Indore</span>
                </div>

                <div
                  className="relative z-10 flex flex-col items-center cursor-pointer group"
                  onClick={() => onSelectDestination('jaam-gate')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold shadow ${
                    selectedDestinationId === 'jaam-gate' ? 'bg-amber-300 scale-125 text-black' : 'bg-amber-400 text-black'
                  }`}>
                    2
                  </div>
                  <span className="text-[9px] text-white group-hover:text-amber-300 font-medium mt-1">Jaam Gate</span>
                </div>

                <div
                  className="relative z-10 flex flex-col items-center cursor-pointer group"
                  onClick={() => onSelectDestination('maheshwar')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold shadow ${
                    selectedDestinationId === 'maheshwar' ? 'bg-amber-300 scale-125 text-black' : 'bg-amber-400 text-black'
                  }`}>
                    3
                  </div>
                  <span className="text-[9px] text-white group-hover:text-amber-300 font-medium mt-1">Maheshwar</span>
                </div>

                <div
                  className="relative z-10 flex flex-col items-center cursor-pointer group"
                  onClick={() => onSelectDestination('sahastradhara')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 border-neutral-600 flex items-center justify-center text-[8px] font-bold ${
                    selectedDestinationId === 'sahastradhara' ? 'bg-amber-400 border-white text-black scale-125' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    4
                  </div>
                  <span className="text-[9px] text-neutral-300 group-hover:text-amber-300 font-medium mt-1">Sahastradhara</span>
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

        {/* Lower Section: Route Map (Left) + Bottom Bar */}
        <div className="pt-2">

          {/* Lower Bottom Elements Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-white/10">
            
            {/* Lower Left: Route Map Panel */}
            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <RouteMapPanel
                selectedDestinationId={selectedDestinationId}
                onSelectDestination={onSelectDestination}
              />
            </div>

            {/* Bottom Center: Scroll To Explore Pill */}
            <div className="flex flex-col items-center gap-1 mx-auto my-1 md:my-0">
              <div className="w-4 h-7 rounded-full border border-amber-400/60 flex items-start justify-center p-0.5">
                <span className="w-1 h-1.5 bg-amber-400 rounded-full animate-bounce" />
              </div>
              <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-300">
                SCROLL TO EXPLORE
              </span>
            </div>

            {/* Bottom Right: Location Badge & Instagram Tag */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4 text-xs text-neutral-300 w-full md:w-auto">
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
  );
};
