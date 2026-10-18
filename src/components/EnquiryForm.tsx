import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw, MessageSquare, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.ts';
import type { SiteContent } from '../types/index.ts';

interface EnquiryFormProps {
  initialService?: string;
  content: SiteContent | null;
  onOpenPrivacyPolicy: () => void;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({ 
  initialService, 
  content,
  onOpenPrivacyPolicy 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    business_category: 'Retail & Clothing',
    requested_service: initialService || 'Business Website Creation',
    problem_description: '',
    budget_range: '₹999 – ₹1,999 (Starter / Growth)',
    desired_completion_date: '',
    preferred_contact_method: 'whatsapp' as 'phone' | 'whatsapp' | 'email',
    consent_given: false,
  });

  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({ ...prev, requested_service: initialService }));
    }
  }, [initialService]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    ref_code: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!formData.name.trim()) {
      setValidationError('Please enter your full name');
      return;
    }
    if (!formData.business_name.trim()) {
      setValidationError('Please enter your business or shop name');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      setValidationError('Please provide at least a phone number or an email address so we can reach you');
      return;
    }
    if (!formData.problem_description.trim() || formData.problem_description.trim().length < 10) {
      setValidationError('Please describe what your business needs in at least 10 characters');
      return;
    }
    if (!formData.consent_given) {
      setValidationError('Please check the privacy consent box to proceed');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitEnquiry(formData);
      setSubmissionSuccess({
        ref_code: res.ref_code,
        message: res.message,
      });
      // Reset form
      setFormData({
        name: '',
        business_name: '',
        email: '',
        phone: '',
        business_category: 'Retail & Clothing',
        requested_service: 'Business Website Creation',
        problem_description: '',
        budget_range: '₹999 – ₹1,999 (Starter / Growth)',
        desired_completion_date: '',
        preferred_contact_method: 'whatsapp',
        consent_given: false,
      });
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          
          {/* Left Column: Context & Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase">
              <span>Start Your Journey</span>
              <span aria-hidden="true">·</span>
              <span>Fast Response Guaranteed</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Let’s get your local business online this week.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Fill in your business details below. We review your request, prepare a tailored draft preview, and message you on your preferred channel within 24 hours.
            </p>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Direct WhatsApp & Call</span>
                  <a 
                    href={`https://wa.me/${(content?.whatsapp_number || '+919876543210').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-mono text-xs block mt-0.5"
                  >
                    {content?.business_phone || "+91 98765 43210"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-800/80">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Working Hours & Location</span>
                  <span className="text-slate-400 text-xs block mt-0.5">
                    {content?.business_hours || "Monday – Saturday: 9:00 AM – 7:30 PM IST"}
                  </span>
                  <span className="text-slate-400 text-xs block mt-0.5">
                    {content?.location_address || "Indiranagar, Bengaluru, Karnataka, India"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/80 text-xs text-slate-400">
              <span className="text-slate-300 font-semibold block mb-1">Zero Spam Promise:</span>
              Your details are kept strictly private in our encrypted backend and used exclusively to respond to your specific inquiry.
            </div>
          </div>

          {/* Right Column: Functional Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
              
              {submissionSuccess ? (
                <div className="text-center py-10 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    Enquiry Received Successfully!
                  </h3>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto">
                    <span className="text-xs text-slate-400 block mb-1">Your Tracking Reference Code:</span>
                    <span className="text-lg font-mono font-bold text-blue-400 tracking-wider">
                      {submissionSuccess.ref_code}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    {submissionSuccess.message} Our team has recorded your requirements in our database and will connect via WhatsApp or phone.
                  </p>

                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${(content?.whatsapp_number || '+919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi MINDMESH, I just submitted an enquiry with reference code ${submissionSuccess.ref_code}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat Immediately on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => setSubmissionSuccess(null)}
                      className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {validationError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* Name & Business Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Your Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Shop / Business Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.business_name}
                        onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                        placeholder="e.g. Kumar Handlooms"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Email (One is required) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Phone / WhatsApp Number <span className="text-slate-400">(Required if no email)</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Email Address <span className="text-slate-400">(Required if no phone)</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="business@example.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Category & Requested Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Business Category <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={formData.business_category}
                        onChange={(e) => setFormData({ ...formData, business_category: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                      >
                        <option value="Retail & Clothing">Retail Shop / Clothing Store</option>
                        <option value="Salons & Spas">Salon / Spa / Wellness</option>
                        <option value="Restaurants & Bakeries">Restaurant / Cafe / Bakery</option>
                        <option value="Tutors & Education">Tutor / Academy / Coaching</option>
                        <option value="Healthcare & Clinic">Doctor / Dental Clinic / Health</option>
                        <option value="Small Service Business">Service Professional / Repair / Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Requested Service <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.requested_service}
                        onChange={(e) => setFormData({ ...formData, requested_service: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      What problem are you trying to solve? <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.problem_description}
                      onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                      placeholder="e.g. Customers keep calling us to ask our saree prices. We want a clean online lookbook with WhatsApp ordering and a counter QR stand."
                      className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Budget & Target Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Estimated Budget
                      </label>
                      <select
                        value={formData.budget_range}
                        onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                      >
                        <option value="₹999 (Starter Plan)">₹999 (Starter Plan)</option>
                        <option value="₹1,999 (Growth Plan)">₹1,999 (Growth Plan)</option>
                        <option value="₹299/mo (Care Plan)">₹299/month (Care Maintenance Plan)</option>
                        <option value="₹2,000 – ₹5,000 (Custom Solution)">₹2,000 – ₹5,000 (Custom Solution)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Desired Launch Date <span className="text-slate-400">(Optional)</span>
                      </label>
                      <input
                        type="date"
                        value={formData.desired_completion_date}
                        onChange={(e) => setFormData({ ...formData, desired_completion_date: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      How should we get back to you?
                    </label>
                    <div className="flex items-center gap-4 text-xs text-slate-300">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="contact_pref"
                          checked={formData.preferred_contact_method === 'whatsapp'}
                          onChange={() => setFormData({ ...formData, preferred_contact_method: 'whatsapp' })}
                          className="accent-blue-600 cursor-pointer"
                        />
                        <span>WhatsApp (Recommended)</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="contact_pref"
                          checked={formData.preferred_contact_method === 'phone'}
                          onChange={() => setFormData({ ...formData, preferred_contact_method: 'phone' })}
                          className="accent-blue-600 cursor-pointer"
                        />
                        <span>Phone Call</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="contact_pref"
                          checked={formData.preferred_contact_method === 'email'}
                          onChange={() => setFormData({ ...formData, preferred_contact_method: 'email' })}
                          className="accent-blue-600 cursor-pointer"
                        />
                        <span>Email</span>
                      </label>
                    </div>
                  </div>

                  {/* Privacy Consent */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400">
                      <input
                        type="checkbox"
                        checked={formData.consent_given}
                        onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
                        className="mt-0.5 accent-blue-600 rounded cursor-pointer"
                        required
                      />
                      <span>
                        I consent to MINDMESH processing my contact details to prepare and provide my website proposal. View our{' '}
                        <button
                          type="button"
                          onClick={onOpenPrivacyPolicy}
                          className="text-blue-400 underline hover:text-blue-300 cursor-pointer"
                        >
                          Privacy Notice
                        </button>.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving to database...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Request & Generate Reference Code</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
