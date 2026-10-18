import React from 'react';
import { AlertCircle, ArrowUpRight, TrendingUp, PhoneCall, RefreshCw, Smartphone } from 'lucide-react';

export const ProblemsSolved: React.FC = () => {
  const problems = [
    {
      title: "Expensive Web Agencies & Hefty Upfronts",
      traditional: "Traditional digital agencies charge ₹20,000 to ₹50,000 for standard websites, far beyond a local shop's starting budget.",
      solution: "MINDMESH delivers clean, professional mobile websites starting at an introductory price of ₹999 with zero technical overhead.",
      icon: TrendingUp,
    },
    {
      title: "Costly Paper Menus & Stale Rate Cards",
      traditional: "Every time a supplier changes raw material prices, business owners must reprint hundreds of paper menus and flyers at high cost.",
      solution: "Our Daily Live Update system lets you change item prices or daily specials from your phone in 30 seconds, with zero reprint expense.",
      icon: RefreshCw,
    },
    {
      title: "Repetitive Phone Calls & Missed Sales",
      traditional: "Shopkeepers waste hours answering basic questions ('What sizes are in stock?', 'How much is this cake?') or lose customers when busy.",
      solution: "Your digital catalog showcases high-res photos and prices. Buyers click one button to send pre-filled item enquiries directly to your WhatsApp.",
      icon: PhoneCall,
    },
    {
      title: "Paper Business Cards Getting Lost",
      traditional: "Customers misplace paper cards and forget your store contact details or exact shop timing when they want to re-order.",
      solution: "Branded QR code standees on your billing counter let walk-in customers save your store link, catalog, and WhatsApp directly on their smartphones.",
      icon: Smartphone,
    }
  ];

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
            <span>Why Local Businesses Need MINDMESH</span>
            <span aria-hidden="true">·</span>
            <span>Real Local Problems Solved</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2" style={{ textWrap: 'balance' }}>
            From everyday neighborhood headaches to clear digital solutions.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Running a shop or salon is hard enough without wrestling with complex software or overpaying web designers. We build practical tools designed for your daily routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-7 hover:border-slate-700/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="font-mono text-xs text-blue-400 font-medium">0{idx + 1}. Challenge</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3">
                    {item.title}
                  </h3>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-400">
                      <span className="text-rose-400 font-semibold block mb-1">Old Way:</span>
                      {item.traditional}
                    </div>

                    <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/40 text-slate-300">
                      <span className="text-emerald-400 font-semibold block mb-1">The MINDMESH Way:</span>
                      {item.solution}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
