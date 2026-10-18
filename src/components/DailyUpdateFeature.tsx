import React, { useState } from 'react';
import { RefreshCw, Clock, CheckCircle2, History, ArrowRight } from 'lucide-react';

export const DailyUpdateFeature: React.FC<{ onExploreLiveCatalog: () => void }> = ({ onExploreLiveCatalog }) => {
  // Interactive Simulator State for visitor demonstration
  const [simProduct, setSimProduct] = useState('Organic Cold-Pressed Honey (500g)');
  const [simCurrentPrice, setSimCurrentPrice] = useState(420);
  const [simNewPrice, setSimNewPrice] = useState('390');
  const [simReason, setSimReason] = useState('Diwali Festive Weekend Promo');
  const [simHistory, setSimHistory] = useState([
    { oldPrice: 450, newPrice: 420, date: '10 Oct 2026', reason: 'Supplier revised batch cost' },
    { oldPrice: 480, newPrice: 450, date: '01 Oct 2026', reason: 'Autumn harvest rate' }
  ]);
  const [simNotification, setSimNotification] = useState<string | null>(null);

  const handleSimulateUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(simNewPrice);
    if (!val || val <= 0) return;

    setSimHistory(prev => [
      { oldPrice: simCurrentPrice, newPrice: val, date: 'Just now (Today)', reason: simReason || 'Owner updated price' },
      ...prev
    ]);
    setSimCurrentPrice(val);
    setSimNotification(`Simulated Live Update: New price of ₹${val} published instantly to your public storefront!`);
    setTimeout(() => setSimNotification(null), 4000);
  };

  return (
    <section id="daily-updates" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-14 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
            <span>Marquee Feature</span>
            <span aria-hidden="true">·</span>
            <span>Zero Re-Deployment Necessary</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2" style={{ textWrap: 'balance' }}>
            Daily Live Update System: Update your website in seconds from your phone.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Local retail prices, vegetable market rates, bakery batches, and festive discounts change daily. Our custom CMS lets you update live customer-facing prices immediately without touching any code.
          </p>
        </div>

        {/* 2-Column Split: Explanation on Left, Interactive Simulator on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
              <h3 className="text-base font-semibold text-white">
                How It Works In Real Life
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <span className="font-mono text-xs font-bold">1</span>
                  </div>
                  <div>
                    <span className="text-white font-medium block">Open your private admin link</span>
                    <span className="text-slate-400">Works smoothly on any smartphone browser. No heavy app to install.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <span className="font-mono text-xs font-bold">2</span>
                  </div>
                  <div>
                    <span className="text-white font-medium block">Enter new rate & optional reason</span>
                    <span className="text-slate-400">Publish immediately or schedule for a future date (e.g., tomorrow morning at 8:00 AM).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <span className="font-mono text-xs font-bold">3</span>
                  </div>
                  <div>
                    <span className="text-white font-medium block">Storefront updates instantly</span>
                    <span className="text-slate-400">Customers scanning your counter QR code see the new price with zero delay.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={onExploreLiveCatalog}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-blue-400 hover:text-white bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/50 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Browse Our Real Live Digital Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Sandbox / Demo */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-white">Interactive Price Update Sandbox</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  Try it yourself below
                </span>
              </div>

              {simNotification && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{simNotification}</span>
                </div>
              )}

              {/* Simulated Form */}
              <form onSubmit={handleSimulateUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Product Item</label>
                    <input
                      type="text"
                      value={simProduct}
                      onChange={(e) => setSimProduct(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Current Price</label>
                      <div className="px-3 py-2 text-xs bg-slate-950/60 border border-slate-800/80 rounded-lg text-slate-300 font-mono font-semibold">
                        ₹{simCurrentPrice}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">New Price (₹)</label>
                      <input
                        type="number"
                        value={simNewPrice}
                        onChange={(e) => setSimNewPrice(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono font-semibold focus:outline-none focus:border-blue-500"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Reason for Update (Saved to Audit Log)</label>
                  <input
                    type="text"
                    value={simReason}
                    onChange={(e) => setSimReason(e.target.value)}
                    placeholder="e.g. Daily market wholesale rate shift"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Audit trail logs previous & new values automatically
                  </span>

                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Publish Price Change</span>
                  </button>
                </div>
              </form>

              {/* Price Audit Trail */}
              <div className="mt-6 pt-5 border-t border-slate-800 text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-3">
                  <History className="w-3.5 h-3.5 text-blue-400" />
                  <span>Recorded Price History & Audit Trail</span>
                </div>

                <div className="space-y-2">
                  {simHistory.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 line-through">₹{item.oldPrice}</span>
                        <span className="text-slate-600">→</span>
                        <span className="font-mono text-emerald-400 font-semibold">₹{item.newPrice}</span>
                        <span className="text-slate-400 hidden sm:inline">({item.reason})</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
