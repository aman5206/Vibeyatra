import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DestinationDetailPopover } from './components/DestinationDetailPopover';
import { JaamGateCinematicIntro } from './components/JaamGateCinematicIntro';
import { DESTINATIONS } from './data/travelData';
import type { NavTabId } from './types/travel';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('home');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [isJaamGateIntroActive, setIsJaamGateIntroActive] = useState<boolean>(false);

  const selectedDestination = DESTINATIONS.find((d) => d.id === selectedDestinationId) || null;

  const handleSelectDestination = (id: string | null) => {
    if (id === 'jaam-gate') {
      // Cinematic intro plays first when Jaam Gate is reached
      setIsJaamGateIntroActive(true);
      setSelectedDestinationId(null);
    } else {
      setIsJaamGateIntroActive(false);
      setSelectedDestinationId(id);
    }
  };

  const handleIntroComplete = () => {
    setIsJaamGateIntroActive(false);
    setSelectedDestinationId('jaam-gate');
  };

  const handleReplayIntro = () => {
    setSelectedDestinationId(null);
    setIsJaamGateIntroActive(true);
  };

  const scrollToDestinations = () => {
    setActiveTab('destinations');
    const target = document.querySelector('#destinations');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070c09] text-[#f1f5f3] selection:bg-amber-400 selection:text-black overflow-x-hidden w-full">
      {/* Top Glassmorphism Navigation */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Landing Page & Placeholder Sections */}
      <main className="w-full overflow-x-hidden">
        {/* Hero Section matching reference screenshot */}
        <Hero
          selectedDestinationId={selectedDestinationId}
          onSelectDestination={handleSelectDestination}
          onExploreRouteClick={scrollToDestinations}
        />

        {/* 
          Navigation Tabs Placeholder Sections (Strict Scope)
          Empty placeholder sections with section titles only
        */}
        <section id="our-trip" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">Our Trip</h2>
        </section>

        <section id="destinations" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">Destinations</h2>
        </section>

        <section id="itinerary" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">Itinerary</h2>
        </section>

        <section id="about-us" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">About Us</h2>
        </section>

        <section id="contact" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">Contact Us</h2>
        </section>
      </main>

      {/* Minimal Clean Footer */}
      <footer className="py-8 px-4 border-t border-white/10 text-center text-xs text-neutral-500 font-mono">
        © {new Date().getFullYear()} Vibeyatra • Indore • Jaam Gate • Maheshwar • Sahastradhara
      </footer>

      {/* Jaam Gate Full-Screen Cinematic Intro */}
      <AnimatePresence>
        {isJaamGateIntroActive && (
          <JaamGateCinematicIntro
            onComplete={handleIntroComplete}
            onSkip={handleIntroComplete}
          />
        )}
      </AnimatePresence>

      {/* Destination Anchored Detail Popover */}
      <DestinationDetailPopover
        destination={selectedDestination}
        onClose={() => setSelectedDestinationId(null)}
        onReplayIntro={handleReplayIntro}
      />
    </div>
  );
}

export default App;
