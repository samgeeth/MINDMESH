import React, { useState } from 'react';
import { ArrowRight, QrCode, Smartphone, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react';
import type { SiteContent } from '../types/index.ts';

interface HeroProps {
  content: SiteContent | null;
  onGetStarted: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ content, onGetStarted, onExploreServices }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Proposition and Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Unboxed Kicker (No pill box) */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
              <span>Digital Presence for Local Businesses</span>
              <span aria-hidden="true">·</span>
              <span>Starting at ₹999</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
              {content?.hero_headline || "Your business deserves a smarter online presence."}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {content?.hero_supporting_text || "MINDMESH helps local businesses launch professional websites, showcase products, receive enquiries, and keep their online information up to date."}
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>{content?.primary_cta_label || "Get Started"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                {content?.secondary_cta_label || "Explore Services"}
              </button>
            </div>

            {/* Trust Points with Clean Typography */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3-Day Fast Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp Order Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Counter QR Code Stand</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Visual Preview Carrier */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-2 shadow-2xl backdrop-blur-sm overflow-hidden group">
              {imageError ? (
                /* Zero-broken-image fallback container */
                <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center border border-slate-800">
                  <Smartphone className="w-12 h-12 text-blue-400 mb-3" />
                  <span className="text-white font-semibold text-lg">MINDMESH Storefront & Dashboard</span>
                  <p className="text-slate-400 text-xs mt-1">Mobile Catalog, QR stand & WhatsApp integration</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950">
                  <img
                    src="/src/assets/images/hero_dashboard_showcase_1792331163505.jpg"
                    alt="MINDMESH local business digital storefront preview showing mobile catalog, QR order stand, and WhatsApp integration"
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                  {/* Subtle contrast scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Clean unboxed overlay caption */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200 backdrop-blur-md bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="font-medium">Active Storefront Demonstration</span>
                    <span className="font-mono text-blue-400">Live Updates Enabled</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Full-width metadata banner below hero split */}
        <div className="mt-14 py-4 px-6 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">For Local Businesses:</span>
            <span>Retail Shops</span>
            <span aria-hidden="true">·</span>
            <span>Clothing Stores</span>
            <span aria-hidden="true">·</span>
            <span>Salons & Spas</span>
            <span aria-hidden="true">·</span>
            <span>Tutors & Academies</span>
            <span aria-hidden="true">·</span>
            <span>Bakeries & Cafes</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-slate-300">
            <span>Introductory Plans from ₹999</span>
            <span aria-hidden="true">/</span>
            <span>Zero Lock-in</span>
          </div>
        </div>
      </div>
    </section>
  );
};
