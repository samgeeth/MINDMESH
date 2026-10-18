import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, Eye, X } from 'lucide-react';
import type { Project } from '../types/index.ts';

interface SampleShowcaseProps {
  projects: Project[];
}

export const SampleShowcase: React.FC<SampleShowcaseProps> = ({ projects }) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <section id="portfolio" className="py-20 bg-slate-950/80 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-14 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
            <span>Portfolio Showcase</span>
            <span aria-hidden="true">·</span>
            <span>Clearly Labeled Sample Implementations</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2" style={{ textWrap: 'balance' }}>
            Tailored digital storefronts for everyday local businesses.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Explore sample projects illustrating how clothing boutiques, artisan bakeries, and wellness salons use MINDMESH for mobile ordering, live price updates, and counter QR stands.
          </p>
        </div>

        {/* Clear Notice as required by brand principles */}
        <div className="mb-8 p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-400">Sample Showcase Note:</span>
            <span>These project demonstrations reflect realistic client deliverables and layouts crafted by MINDMESH.</span>
          </div>
          <span className="font-mono text-slate-400 hidden sm:inline">Transparent Startup Disclosure</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <div 
              key={proj.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  {proj.cover_image ? (
                    <img
                      src={proj.cover_image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600 text-xs">
                      No Preview
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Category unboxed tag */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[11px] font-medium text-slate-300">
                    {proj.business_category}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="text-xs font-mono text-blue-400 mb-1">
                    {proj.business_name}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 leading-snug">
                    {proj.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                    {proj.portfolio_description || proj.scope_of_work}
                  </p>

                  {/* Services Delivered */}
                  {proj.services_delivered && proj.services_delivered.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                      {proj.services_delivered.map((s, i) => (
                        <span key={i} className="after:content-['·'] last:after:content-none after:ml-1.5">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setActiveProject(proj)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Case Details</span>
                </button>

                {proj.deliverable_links && proj.deliverable_links[0] && (
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <span>Active Demo</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Project Details Modal */}
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-xs font-mono text-blue-400 mb-1 uppercase tracking-wider">
                {activeProject.business_category} · {activeProject.business_name}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {activeProject.title}
              </h3>

              {activeProject.cover_image && (
                <div className="rounded-xl overflow-hidden aspect-video mb-6 bg-slate-950">
                  <img
                    src={activeProject.cover_image}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div>
                  <h4 className="text-white font-semibold mb-1">Scope of Delivery:</h4>
                  <p className="leading-relaxed text-slate-300">{activeProject.scope_of_work}</p>
                </div>

                {activeProject.customer_visible_updates && activeProject.customer_visible_updates.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Live Milestones & Handover:</h4>
                    <ul className="space-y-1.5">
                      {activeProject.customer_visible_updates.map((update, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{update}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Delivered in 4 business days</span>
                  <span className="font-mono text-emerald-400">Package: ₹{activeProject.agreed_price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
