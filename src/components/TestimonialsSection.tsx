import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import type { Testimonial } from '../types/index.ts';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onOpenEnquiry?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  testimonials,
  onOpenEnquiry 
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const categories = ['all', ...Array.from(new Set(testimonials.map(t => t.business_category)))];

  const filtered = testimonials.filter(t => 
    filterCategory === 'all' || t.business_category.toLowerCase() === filterCategory.toLowerCase()
  );

  return (
    <section id="testimonials" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
            <span>Verified Merchant Feedback</span>
            <span aria-hidden="true">·</span>
            <span>Local Business Stories</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2" style={{ textWrap: 'balance' }}>
            What neighborhood shop owners say about working with MINDMESH.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Real feedback from local boutique owners, bakeries, salons, and food merchants who launched their digital storefronts and WhatsApp order channels with us.
          </p>
        </div>

        {/* Filter Bar (Segmented Controls) */}
        {categories.length > 2 && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto max-w-full mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Reviews' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700/80 transition-all hover:bg-slate-900/60 text-left relative"
            >
              <div>
                {/* Header: Rating & Business Category */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  {/* Clean Tabular Rating */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < Math.floor(item.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} 
                        />
                      ))}
                    </div>
                    <span className="font-mono text-xs font-bold text-white tabular-nums">
                      {item.rating.toFixed(1)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">/ 5.0</span>
                  </div>

                  {/* Unboxed Metadata (Zero-Pill Rule) */}
                  <div className="text-xs text-slate-400 font-mono">
                    <span>{item.business_category}</span>
                    {item.location && (
                      <>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span>{item.location}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Review Body */}
                <p className="text-sm text-slate-200 leading-relaxed mb-5 italic">
                  "{item.feedback_text}"
                </p>

                {/* Concrete Quantified Outcome */}
                {item.concrete_outcome && (
                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs text-slate-300 flex items-center gap-2 mb-5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong className="text-white font-medium">Measurable Impact:</strong>{' '}
                      {item.concrete_outcome}
                    </span>
                  </div>
                )}
              </div>

              {/* Author & Business Signature */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {item.client_name}
                  </h4>
                  <span className="text-xs text-blue-400 font-medium block">
                    {item.business_name}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-500">
                  Verified Pilot Partner
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Action Callout */}
        {onOpenEnquiry && (
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 via-blue-950/40 to-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div>
              <h3 className="text-base font-bold text-white">
                Ready to turn walk-in traffic into digital orders?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Get your digital storefront, WhatsApp catalog, and counter QR stand starting at just ₹999.
              </p>
            </div>

            <button
              onClick={onOpenEnquiry}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-blue-600/20"
            >
              <span>Submit Your Business Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
