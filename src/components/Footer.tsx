import React from 'react';
import { LogoIcon, InstagramIcon, MapPinIcon } from './Icons';

export const Footer: React.FC = () => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#050907] border-t border-white/10 text-neutral-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-amber-400">
                <LogoIcon size={34} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-serif text-white tracking-tight">
                  Vibeyatra
                </span>
                <span className="text-[9px] uppercase tracking-widest text-amber-400/90 font-medium">
                  Indore • Jaam Gate • Maheshwar • Sahastradhara
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Two days. Beautiful roads. Unforgettable memories. 
              A modern road-trip journey connecting college explorers with the scenic valleys, 
              ghats, and rapids of Madhya Pradesh.
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <MapPinIcon size={15} className="text-amber-400" />
              <span>Madhya Pradesh, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleScrollTo(e, 'home')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#our-trip"
                  onClick={(e) => handleScrollTo(e, 'our-trip')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Our Trip Concept
                </a>
              </li>
              <li>
                <a
                  href="#destinations"
                  onClick={(e) => handleScrollTo(e, 'destinations')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Destinations (Jaam Gate, Maheshwar, Sahastradhara)
                </a>
              </li>
              <li>
                <a
                  href="#itinerary"
                  onClick={(e) => handleScrollTo(e, 'itinerary')}
                  className="hover:text-amber-300 transition-colors"
                >
                  2-Day Itinerary
                </a>
              </li>
              <li>
                <a
                  href="#about-us"
                  onClick={(e) => handleScrollTo(e, 'about-us')}
                  className="hover:text-amber-300 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleScrollTo(e, 'contact')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Contact & Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Community */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Community
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Connect with fellow college travelers and follow road trip updates on Instagram.
            </p>

            <div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-black border border-white/10 text-white text-xs font-semibold transition-all"
                title="Vibeyatra on Instagram"
              >
                <InstagramIcon size={16} />
                <span>Instagram @vibeyatra</span>
              </a>
            </div>

            <div className="text-[11px] text-neutral-500 font-mono">
              <span>Trip Route: Indore (0 km) → Jaam Gate (50 km) → Maheshwar (100 km) → Sahastradhara (110 km)</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <p>© {new Date().getFullYear()} Vibeyatra. All rights reserved.</p>
          <p className="font-mono text-[11px]">“Good roads lead to great stories.”</p>
        </div>

      </div>
    </footer>
  );
};
