import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How fast will my local business website or catalog be live?",
      a: "Typically within 3 to 5 business days from the moment you send us your shop details, price list, and photos via WhatsApp or our request form."
    },
    {
      q: "Do I need to buy an expensive domain name to start?",
      a: "No! You can launch immediately using a fast, clean subdomain provided by us at ₹0 extra cost. If you would like a custom .in or .com domain (like yourshop.com), we can guide you to register one directly for approximately ₹700–₹900/year."
    },
    {
      q: "How do customer enquiries and orders reach me?",
      a: "When a customer visits your catalog and taps 'Order' or 'Enquire', WhatsApp automatically opens on their phone with a pre-written message containing the exact product name, current price, and inquiry details sent straight to your number."
    },
    {
      q: "How does the Daily Price Update system work?",
      a: "You get a secure, private link that works directly on your smartphone browser. You simply tap your product, type the new price or daily special, and tap 'Publish'. Your customer-facing website and QR menu update immediately without re-printing anything."
    },
    {
      q: "Can I cancel the monthly CARE plan anytime?",
      a: "Yes, completely. There are zero long-term commitments or exit penalties. If you prefer to handle updates on an as-needed basis, you can pause or cancel anytime."
    },
    {
      q: "I am not comfortable with technology. Can I still use this?",
      a: "Absolutely. MINDMESH was designed specifically for non-technical shop owners. We handle 100% of the initial design and technical configuration, and provide a 2-minute video guide on WhatsApp for daily edits."
    }
  ];

  const toggle = (idx: number) => {
    setOpenIdx(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="py-20 bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-left mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Clear, straightforward answers about our services, setup timelines, and maintenance.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors hover:border-slate-700"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-white">
                    {faq.q}
                  </span>
                  <div className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
