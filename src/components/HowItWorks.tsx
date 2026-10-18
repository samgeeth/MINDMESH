import React from 'react';
import { Send, Palette, QrCode, RefreshCcw } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Send Your Content",
      desc: "Share your business name, address, product list, and a few smartphone photos directly via WhatsApp or our request form.",
      icon: Send,
    },
    {
      num: "02",
      title: "We Build & Connect",
      desc: "In 3-5 days, we build a fast responsive storefront, embed Google Maps, and configure direct WhatsApp order routing.",
      icon: Palette,
    },
    {
      num: "03",
      title: "Review & Counter QR",
      desc: "Preview your live link on your phone. We generate a custom print-ready QR code standee design for your shop counter.",
      icon: QrCode,
    },
    {
      num: "04",
      title: "Daily Live Updates",
      desc: "Change product rates, add morning specials, or post festival offers anytime without hiring an engineer or reprinting flyers.",
      icon: RefreshCcw,
    }
  ];

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-14 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
            <span>Simple 4-Step Process</span>
            <span aria-hidden="true">·</span>
            <span>No Technical Knowledge Required</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2" style={{ textWrap: 'balance' }}>
            How we get your local shop online in days, not months.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            We handle the domain setup, mobile design, and QR graphics so you can keep serving customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-bold text-blue-400/80">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/60 text-xs text-slate-400 font-mono">
                  Phase {step.num}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
