import React from 'react';
import { Check, X, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import type { PricingPlan } from '../types/index.ts';

interface PricingSectionProps {
  plans: PricingPlan[];
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ plans, onSelectPlan }) => {
  return (
    <section id="pricing" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-14 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
            <span>Introductory Pricing Packages</span>
            <span aria-hidden="true">·</span>
            <span>Zero Unnecessary Costs</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2" style={{ textWrap: 'balance' }}>
            Built for startup budgets. Honest pricing you can afford on day one.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Choose a package below to launch your digital presence. All rates reflect introductory test pricing designed specifically for small Indian businesses.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isMonthly = plan.billing_interval === 'monthly';

            return (
              <div 
                key={plan.id}
                className={`rounded-2xl border p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                  plan.is_popular
                    ? 'border-blue-500 bg-slate-900/90 shadow-xl shadow-blue-500/10'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                {/* Popular Pill */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-mono text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 min-h-[36px] mb-6 leading-relaxed">
                    {plan.subtitle}
                  </p>

                  <div className="mb-6 pb-6 border-b border-slate-800/80">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">
                        ₹{plan.price_inr.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {isMonthly ? '/ month' : 'one-time'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {isMonthly ? 'Cancel anytime with zero penalty' : 'Introductory launch rate'}
                    </span>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-4 mb-6">
                    <span className="text-xs font-semibold text-slate-300 block">
                      Included in this plan:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {plan.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Exclusions */}
                    {plan.exclusions && plan.exclusions.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-semibold text-slate-400 block mb-2">
                          Not included:
                        </span>
                        <ul className="space-y-2 text-xs text-slate-400">
                          {plan.exclusions.map((exc, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <X className="w-4 h-4 text-rose-400/70 shrink-0 mt-0.5" />
                              <span>{exc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/80">
                  <button
                    onClick={() => onSelectPlan(`${plan.name} (₹${plan.price_inr})`)}
                    className={`w-full py-3 px-4 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      plan.is_popular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>Choose {plan.name} Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear Scope Disclaimer as mandated by brief */}
        <div className="mt-12 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-left text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Honest Scope & Third-Party Services Policy</span>
          </div>
          <p className="leading-relaxed">
            All prices listed above are proposed introductory test prices. In the spirit of complete transparency: custom `.com`/`.in` domain registration fees (typically ₹700–₹1,000/year if desired), paid third-party software subscriptions (like official Meta WhatsApp Business API bulk tools or Google Ads spend), professional on-site studio photography, and complete architectural redesigns are separate unless explicitly stated in your agreed written proposal.
          </p>
        </div>

      </div>
    </section>
  );
};
