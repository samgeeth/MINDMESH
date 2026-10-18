import React, { useState } from 'react';
import { 
  Globe, BookOpen, QrCode, MessageSquare, TrendingUp, 
  ShieldCheck, Sparkles, Cpu, ArrowRight, Check, X, ChevronDown, ChevronUp 
} from 'lucide-react';
import type { ServiceItem } from '../types/index.ts';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (serviceTitle: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Globe,
  BookOpen,
  QrCode,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Cpu,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onSelectService }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section id="services" className="py-20 bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-14 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
            <span>Tailored For Local Shops & Services</span>
            <span aria-hidden="true">·</span>
            <span>Database-Backed Offerings</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2" style={{ textWrap: 'balance' }}>
            Practical digital services with upfront, transparent pricing.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Every service is built to be approachable, affordable, and quick to launch. No hidden lock-ins or bloated contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon_name] || Globe;
            const isExpanded = expandedId === service.id;

            return (
              <div 
                key={service.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all hover:bg-slate-900/70"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-blue-400">
                      0{index + 1}.
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {service.short_description}
                  </p>

                  <div className="py-2 border-y border-slate-800/80 mb-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Starting Price:</span>
                    <span className="font-mono text-sm font-semibold text-emerald-400">
                      ₹{service.starting_price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Collapsible Details */}
                  {isExpanded && (
                    <div className="space-y-3 pt-2 pb-4 text-xs">
                      <p className="text-slate-300 leading-relaxed">
                        {service.detailed_description}
                      </p>

                      {service.inclusions && service.inclusions.length > 0 && (
                        <div>
                          <span className="text-slate-400 font-medium block mb-1">What is included:</span>
                          <ul className="space-y-1">
                            {service.inclusions.map((inc, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-slate-300">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {service.exclusions && service.exclusions.length > 0 && (
                        <div>
                          <span className="text-slate-500 font-medium block mb-1">What is not included:</span>
                          <ul className="space-y-1">
                            {service.exclusions.map((exc, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-slate-400">
                                <X className="w-3.5 h-3.5 text-rose-400/80 shrink-0 mt-0.5" />
                                <span>{exc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleExpand(service.id)}
                    className="text-xs font-medium text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Less details' : 'View scope'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onSelectService(service.title)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>Enquire</span>
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
