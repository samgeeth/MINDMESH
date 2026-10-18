import React from 'react';
import { DollarSign, HeartHandshake, Zap, Shield, Smartphone, Users } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: "Keep 100% of Your Margins",
      desc: "Food delivery apps and third-party marketplace portals take 20% to 35% commission on every order. With MINDMESH, orders come directly to your WhatsApp for 0% commission.",
      icon: DollarSign,
    },
    {
      title: "Direct Customer Relationship",
      desc: "You own your customer contact list. Repeat customers message you directly, allowing you to build personal loyalty and broadcast festive specials.",
      icon: HeartHandshake,
    },
    {
      title: "Zero App Download Friction",
      desc: "Customers don't need to install another 100MB mobile app. Your catalog opens instantly in their mobile browser from a simple QR scan.",
      icon: Smartphone,
    },
    {
      title: "Same-Day Price Flexibility",
      desc: "Never lose money when raw material prices rise. Update your pricing across all customer screens in 30 seconds without paying a developer.",
      icon: Zap,
    },
    {
      title: "Built For Neighborhood Commerce",
      desc: "Designed specifically for retail stores, salons, bakeries, and tutors in local Indian commercial areas like Indiranagar, Karol Bagh, or T Nagar.",
      icon: Users,
    },
    {
      title: "Startup-Friendly & Accessible",
      desc: "Built with a ₹0–₹2,000 INR budget mindset. We keep our tech stack lean, honest, and maintainable without forcing expensive monthly SaaS fees.",
      icon: Shield,
    }
  ];

  return (
    <section className="py-20 bg-slate-950/80 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-14 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
            <span>The Local Advantage</span>
            <span aria-hidden="true">·</span>
            <span>Why Shop Owners Choose Us</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2" style={{ textWrap: 'balance' }}>
            Practical advantages built around your daily cashflow.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Digital tools should make your life easier and keep more profit in your register, not drain your monthly budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700/80 transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-semibold text-white mb-2">
                    {b.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
