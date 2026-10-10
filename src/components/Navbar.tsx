import React, { useState } from 'react';
import { LogoIcon, MenuIcon, XIcon, ArrowRightIcon } from './Icons';
import type { NavTabId } from '../types/travel';

interface NavbarProps {
  activeTab: NavTabId;
  onTabChange: (tabId: NavTabId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: Array<{ id: NavTabId; label: string; href: string }> = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'our-trip', label: 'Our Trip', href: '#our-trip' },
    { id: 'destinations', label: 'Destinations', href: '#destinations' },
    { id: 'itinerary', label: 'Itinerary', href: '#itinerary' },
    { id: 'about-us', label: 'About Us', href: '#about-us' },
    { id: 'contact', label: 'Contact Us', href: '#contact' }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { id: NavTabId; href: string }) => {
    e.preventDefault();
    onTabChange(link.id);
    setMobileMenuOpen(false);
    const target = document.querySelector(link.href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-8 bg-gradient-to-b from-black/85 via-black/40 to-transparent backdrop-blur-[6px] border-b border-white/5 transition-all">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* Left: Vibeyatra Logo & Subtitle */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, { id: 'home', href: '#home' })}
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="Vibeyatra Home"
        >
          <div className="text-amber-400 group-hover:scale-105 transition-transform">
            <LogoIcon size={36} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
              Vibeyatra
            </span>
            <span className="text-[9px] uppercase tracking-widest text-amber-400/90 font-medium -mt-1 hidden sm:block">
              Indore • Jaam Gate • Maheshwar • Sahastradhara
            </span>
          </div>
        </a>

        {/* Center: Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => handleLinkClick(e, tab)}
                className={`relative text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'text-amber-300 font-semibold'
                    : 'text-neutral-200 hover:text-white'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#facc15]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Plan This Trip Button */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => {
              const target = document.querySelector('#contact');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-amber-300 border border-amber-400/60 rounded-full hover:bg-amber-400 hover:text-black transition-all duration-300 cursor-pointer shadow-sm hover:shadow-amber-500/20"
          >
            <span>Plan This Trip</span>
            <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-200 hover:text-amber-300 focus:outline-none cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-4 rounded-2xl bg-[#0c1611]/95 backdrop-blur-2xl border border-amber-500/20 shadow-2xl animate-fadeIn">
          <nav className="flex flex-col gap-2">
            {navLinks.map((tab) => (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => handleLinkClick(e, tab)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-300 bg-amber-500/10 font-bold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {tab.label}
              </a>
            ))}

            {/* Plan This Trip in mobile drawer */}
            <div className="pt-2 mt-1 border-t border-white/10 sm:hidden">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  const target = document.querySelector('#contact');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-amber-300 border border-amber-400/60 rounded-full hover:bg-amber-400 hover:text-black transition-all cursor-pointer shadow-sm"
              >
                <span>Plan This Trip</span>
                <ArrowRightIcon size={14} />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
