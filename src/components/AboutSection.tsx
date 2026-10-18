import React from 'react';
import { Target, Compass, Sparkles, Handshake } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
              <span>Our Founding Story & Mission</span>
              <span aria-hidden="true">·</span>
              <span>Built by Two Friends</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              From local street-corner problems to dependable digital solutions.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              MINDMESH was born from a simple observation in our neighborhood: incredible local clothing stores, bakeries, salons, and tutoring centers with delicious products and master craftsmanship were completely invisible online because traditional web agencies charged exorbitant fees.
            </p>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              We started MINDMESH with a modest budget of ₹0–₹2,000 INR and a clear pledge: provide practical, lightning-fast digital storefronts, counter QR stands, and WhatsApp order setups that help local merchants generate real inquiries on day one.
            </p>

            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/40 text-xs sm:text-sm text-slate-300">
              <span className="font-semibold text-blue-400 block mb-1">Our Long-Term Vision:</span>
              What begins today as high-touch website and catalog assistance for local merchants will gradually evolve into an accessible, AI-powered digital operations platform that automates seasonal updates, customer enquiries, and billing for neighborhood businesses.
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white">Practicality First</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We reject unnecessary technical complexity. We build fast, mobile-friendly interfaces that everyday shopkeepers can operate in 30 seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400">
                <Handshake className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white">Honest Scope</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We never invent false metrics or hide extra costs. Inclusions and exclusions are spelled out in plain language before any work begins.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white">Direct WhatsApp Focus</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In India, business happens on WhatsApp. We design customer funnels that route orders directly to the owner's chat with zero middleman fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white">Daily Live Agility</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Businesses change every day. Our unique CMS gives owners the power to modify daily specials, seasonal rates, or stock status in seconds.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
