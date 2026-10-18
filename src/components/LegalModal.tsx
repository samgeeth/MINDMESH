import React from 'react';
import { X, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'refund' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content = {
    privacy: {
      title: "Privacy Policy (Draft Notice)",
      text: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            At MINDMESH, we respect your privacy and are committed to protecting the personal and business information you share with us.
          </p>
          <h4 className="font-semibold text-white">1. Information We Collect</h4>
          <p>
            When you submit an enquiry on our website, we collect your name, business name, phone number, email address, business category, problem description, and estimated budget. This information is collected solely to understand your business needs and prepare your website proposal.
          </p>
          <h4 className="font-semibold text-white">2. How We Use Your Data</h4>
          <p>
            Your information is used strictly to communicate with you via WhatsApp, telephone, or email regarding your project. We do not sell, rent, or trade your contact details to third-party telemarketers or external advertisers.
          </p>
          <h4 className="font-semibold text-white">3. Data Retention & Security</h4>
          <p>
            Customer records are stored securely in encrypted databases. You may request deletion or correction of your business records at any time by contacting hello@mindmesh.in.
          </p>
        </div>
      )
    },
    terms: {
      title: "Terms of Service (Draft Agreement)",
      text: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            These terms govern the delivery of digital website creation, digital catalogs, and ongoing update services provided by MINDMESH to local businesses.
          </p>
          <h4 className="font-semibold text-white">1. Scope of Work & Deliverables</h4>
          <p>
            MINDMESH agrees to deliver the specific items agreed upon in your chosen package (Starter, Growth, or Custom). Custom domain registrations, payment gateway transaction charges, and paid advertising spend are separate unless explicitly stated in writing.
          </p>
          <h4 className="font-semibold text-white">2. Revisions & Approvals</h4>
          <p>
            Starter packages include one round of revisions prior to public handover. Once the site is verified by the client and counter QR assets are handed over, the initial delivery phase is complete.
          </p>
          <h4 className="font-semibold text-white">3. Content Ownership</h4>
          <p>
            The business owner retains full ownership of their brand name, trademarks, product photos, and pricing. MINDMESH provides the technical software and setup.
          </p>
        </div>
      )
    },
    refund: {
      title: "Refund & Cancellation Policy (Draft)",
      text: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            We strive to provide total satisfaction and clarity to every local business we partner with.
          </p>
          <h4 className="font-semibold text-white">1. Project Cancellation Prior to Work Commencing</h4>
          <p>
            If you cancel an order before we have begun drafting your storefront or custom graphics (within 24 hours of enquiry confirmation), a 100% full refund is issued immediately.
          </p>
          <h4 className="font-semibold text-white">2. Work in Progress</h4>
          <p>
            If work has already commenced and a draft storefront has been built for your review, refunds will be prorated according to completed milestones.
          </p>
          <h4 className="font-semibold text-white">3. Monthly Care Plan Cancellation</h4>
          <p>
            The ₹299/month CARE plan can be cancelled at any time by sending a message on WhatsApp. There are no lock-in periods, annual contracts, or cancellation fees.
          </p>
        </div>
      )
    }
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto text-left shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          aria-label="Close legal modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Draft Disclaimer Notice as required by prompt */}
        <div className="mb-6 p-3 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <span className="font-semibold block">Legal Draft Notice for Business Owner:</span>
            <span>
              This is a preliminary draft provided for startup operational planning. The owner must review and customize this legal text to match local jurisdiction regulations prior to commercial launch.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-bold text-white">
            {content.title}
          </h3>
        </div>

        {content.text}

        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
