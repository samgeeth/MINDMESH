import React from 'react';
import { Tag, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import type { Offer } from '../types/index.ts';

interface ActiveOffersSectionProps {
  offers: Offer[];
  onClaimOffer: (offerTitle: string) => void;
}

export const ActiveOffersSection: React.FC<ActiveOffersSectionProps> = ({ offers, onClaimOffer }) => {
  if (offers.length === 0) return null;

  return (
    <section className="py-14 bg-gradient-to-b from-blue-950/30 to-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limited Time Announcements</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Active Offers & Seasonal Promotions
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-md hidden sm:inline">
            Auto-verified active dates
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => {
            const expiryFormatted = new Date(offer.expiry_date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div 
                key={offer.id}
                className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-slate-900/60 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
                      Promotional Special
                    </span>
                    {offer.discount_badge && (
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded">
                        {offer.discount_badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {offer.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {offer.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Valid until {expiryFormatted}</span>
                  </div>

                  <button
                    onClick={() => onClaimOffer(offer.title)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Claim Offer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
