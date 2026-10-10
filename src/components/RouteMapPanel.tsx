import { useState } from 'react';
import { PlusIcon, MinusIcon, LocateIcon } from './Icons';

interface RouteMapPanelProps {
  selectedDestinationId: string | null;
  onSelectDestination: (id: string) => void;
}

export const RouteMapPanel: React.FC<RouteMapPanelProps> = ({
  selectedDestinationId,
  onSelectDestination
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const stops = [
    {
      id: 'sahastradhara',
      name: 'Sahastradhara',
      distanceLabel: '(6 km)',
      x: 42,
      y: 18
    },
    {
      id: 'maheshwar',
      name: 'Maheshwar',
      distanceLabel: '(100 km)',
      x: 38,
      y: 45
    },
    {
      id: 'jaam-gate',
      name: 'Jaam Gate',
      distanceLabel: '(50 km)',
      x: 34,
      y: 70
    },
    {
      id: 'indore',
      name: 'Indore',
      distanceLabel: 'Start',
      x: 28,
      y: 88
    }
  ];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 1.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.85));
  const handleReset = () => setZoomLevel(1);

  return (
    <div className="relative w-full max-w-[260px] sm:max-w-[290px] rounded-2xl overflow-hidden bg-[#0c1611]/90 backdrop-blur-xl border border-amber-500/25 p-3.5 shadow-2xl shadow-black/80">
      
      {/* Map Graphic Canvas */}
      <div className="relative h-56 w-full rounded-xl overflow-hidden bg-[#070e0a] border border-white/5 select-none">
        
        {/* Subtle satellite/grid lines */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.2) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '24px 24px, 20px 20px, 20px 20px'
          }}
        />

        {/* Scalable Container */}
        <div
          className="absolute inset-0 transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Glowing Golden Route Curve */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="miniRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Path Glow */}
            <path
              d="M 28,88 Q 26,78 34,70 Q 42,56 38,45 Q 34,30 42,18"
              fill="none"
              stroke="#eab308"
              strokeWidth="3.5"
              strokeOpacity="0.45"
              strokeLinecap="round"
              filter="url(#miniRouteGlow)"
            />
            {/* Core Golden Line */}
            <path
              d="M 28,88 Q 26,78 34,70 Q 42,56 38,45 Q 34,30 42,18"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Stops along the route */}
          {stops.map((stop) => {
            const isSelected = selectedDestinationId === stop.id;
            const isIndore = stop.id === 'indore';

            return (
              <div
                key={stop.id}
                className="absolute transform -translate-y-1/2 flex items-center gap-2 cursor-pointer z-10 group"
                style={{
                  top: `${stop.y}%`,
                  left: `${stop.x}%`
                }}
                onClick={() => {
                  if (!isIndore) {
                    onSelectDestination(stop.id);
                  }
                }}
              >
                {/* Marker Dot */}
                <div
                  className={`relative flex items-center justify-center transition-all ${
                    isIndore
                      ? 'w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-md'
                      : isSelected
                      ? 'w-4 h-4 rounded-full bg-amber-300 border-2 border-white shadow-[0_0_12px_#fbbf24] scale-125'
                      : 'w-3 h-3 rounded-full bg-[#13241b] border-2 border-amber-400 group-hover:border-white'
                  }`}
                >
                  {isIndore && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />}
                </div>

                {/* Stop Label Text */}
                <div className="flex flex-col select-none whitespace-nowrap">
                  <span
                    className={`text-[10px] font-semibold leading-tight transition-colors ${
                      isSelected
                        ? 'text-amber-300 font-bold'
                        : 'text-neutral-200 group-hover:text-amber-300'
                    }`}
                  >
                    {stop.name}
                  </span>
                  <span className="text-[8px] text-amber-400/90 font-mono">
                    {stop.distanceLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Controls: Compass, Zoom In, Zoom Out, Locate */}
        <div className="absolute right-2 top-2 flex items-center justify-center w-5 h-5 rounded-full bg-black/60 border border-white/10 text-amber-400 text-[9px] font-bold">
          N
        </div>

        <div className="absolute right-2 bottom-2 flex flex-col gap-1 bg-[#101b15]/90 border border-white/10 rounded-lg p-1 backdrop-blur-md shadow-md z-20">
          <button
            onClick={handleZoomIn}
            className="w-5 h-5 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:bg-white/10 rounded transition-colors"
            title="Zoom In"
            aria-label="Zoom in map"
          >
            <PlusIcon size={12} />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-5 h-5 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:bg-white/10 rounded transition-colors"
            title="Zoom Out"
            aria-label="Zoom out map"
          >
            <MinusIcon size={12} />
          </button>
          <button
            onClick={handleReset}
            className="w-5 h-5 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:bg-white/10 rounded transition-colors"
            title="Reset Map"
            aria-label="Reset map"
          >
            <LocateIcon size={12} />
          </button>
        </div>

      </div>
    </div>
  );
};
