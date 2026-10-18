import React, { useState } from 'react';
import { Menu, X, Shield, ArrowRight } from 'lucide-react';
import type { SiteContent } from '../types/index.ts';

interface NavbarProps {
  content: SiteContent | null;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onNavigateSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  content, 
  onOpenAdmin, 
  isAdminLoggedIn,
  onNavigateSection 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark with clean node-mesh mark */}
          <button 
            onClick={() => handleLinkClick('hero')} 
            className="flex items-center gap-2.5 text-left focus:outline-none group whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center p-1.5 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white">
                <circle cx="5" cy="6" r="2.5" />
                <circle cx="19" cy="6" r="2.5" />
                <circle cx="5" cy="18" r="2.5" />
                <circle cx="19" cy="18" r="2.5" />
                <line x1="7.5" y1="6" x2="16.5" y2="6" />
                <line x1="7.5" y1="18" x2="16.5" y2="18" />
                <line x1="5" y1="8.5" x2="5" y2="15.5" />
                <line x1="19" y1="8.5" x2="19" y2="15.5" />
                <line x1="7" y1="8" x2="17" y2="16" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              MIND<span className="text-blue-400">MESH</span>
            </span>
          </button>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button 
              onClick={() => handleLinkClick('services')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Services
            </button>
            <button 
              onClick={() => handleLinkClick('pricing')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Pricing
            </button>
            <button 
              onClick={() => handleLinkClick('catalog')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Live Catalog
            </button>
            <button 
              onClick={() => handleLinkClick('portfolio')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Portfolio
            </button>
            <button 
              onClick={() => handleLinkClick('daily-updates')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Daily Updates
            </button>
            <button 
              onClick={() => handleLinkClick('testimonials')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reviews
            </button>
            <button 
              onClick={() => handleLinkClick('about')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={() => handleLinkClick('contact')} 
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: 1 primary action button + Admin link */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title={isAdminLoggedIn ? "Open Admin Dashboard" : "Admin Login"}
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAdminLoggedIn ? "Admin" : "Login"}</span>
            </button>

            <button
              onClick={() => handleLinkClick('contact')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/25 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{content?.primary_cta_label || "Get Started"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          <button 
            onClick={() => handleLinkClick('services')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-md"
          >
            Services
          </button>
          <button 
            onClick={() => handleLinkClick('pricing')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-md"
          >
            Pricing Plans (from ₹999)
          </button>
          <button 
            onClick={() => handleLinkClick('catalog')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-md"
          >
            Live Store Catalog
          </button>
          <button 
            onClick={() => handleLinkClick('portfolio')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-md"
          >
            Sample Portfolio
          </button>
          <button 
            onClick={() => handleLinkClick('daily-updates')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-md"
          >
            Daily Price Updates
          </button>
          <button 
            onClick={() => handleLinkClick('testimonials')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-md"
          >
            Client Reviews
          </button>
          <button 
            onClick={() => handleLinkClick('about')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-md"
          >
            About MINDMESH
          </button>
          <button 
            onClick={() => handleLinkClick('contact')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-md"
          >
            Contact & Enquiry
          </button>
        </div>
      )}
    </header>
  );
};
