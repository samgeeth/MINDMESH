import React from 'react';
import { Shield } from 'lucide-react';
import type { SiteContent } from '../types/index.ts';

interface FooterProps {
  content: SiteContent | null;
  onNavigateSection: (id: string) => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'refund') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  content, 
  onNavigateSection, 
  onOpenLegal,
  onOpenAdmin 
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900 text-left">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center p-1.5 shadow-sm">
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
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                MIND<span className="text-blue-400">MESH</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              {content?.footer_tagline || "From local problems to digital solutions."} We help neighborhood retail stores, salons, tutors, and cafes build an online presence that delivers real inquiries.
            </p>

            <div className="pt-2 text-slate-400 space-y-1">
              <div>Email: <span className="text-slate-300">{content?.business_email || "hello@mindmesh.in"}</span></div>
              <div>Phone: <span className="text-slate-300">{content?.business_phone || "+91 98765 43210"}</span></div>
              <div>Hours: <span className="text-slate-300">{content?.business_hours || "Mon – Sat: 9:00 AM – 7:30 PM"}</span></div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-white block">
              Navigation
            </span>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateSection('services')} className="hover:text-white transition-colors cursor-pointer">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('pricing')} className="hover:text-white transition-colors cursor-pointer">
                  Pricing Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('catalog')} className="hover:text-white transition-colors cursor-pointer">
                  Live Store Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('portfolio')} className="hover:text-white transition-colors cursor-pointer">
                  Sample Showcase
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('daily-updates')} className="hover:text-white transition-colors cursor-pointer">
                  Daily Price Updates
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('testimonials')} className="hover:text-white transition-colors cursor-pointer">
                  Client Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-white block">
              Startup Info
            </span>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateSection('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Founders & Mission
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Enquiry Form
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-white block">
              Policy Drafts
            </span>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy (Draft)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service (Draft)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('refund')} className="hover:text-white transition-colors cursor-pointer">
                  Refund & Cancellation (Draft)
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} MINDMESH. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Built for Indian Local Commerce</span>
            <span aria-hidden="true">·</span>
            <span>Transparent Startup Pricing</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
