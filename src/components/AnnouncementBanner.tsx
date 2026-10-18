import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import type { SiteContent } from '../types/index.ts';

interface AnnouncementBannerProps {
  content: SiteContent | null;
  onActionClick: () => void;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ content, onActionClick }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !content || !content.announcement_banner_active || !content.announcement_banner_text) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 border-b border-blue-500/20 py-2 px-4 text-xs sm:text-sm text-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="truncate">{content.announcement_banner_text}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onActionClick}
            className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>Learn more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-200 p-0.5"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
