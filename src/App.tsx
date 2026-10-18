/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api, getStoredToken, clearStoredToken } from './services/api.ts';
import type { 
  SiteContent, ServiceItem, PricingPlan, Product, Offer, Project, User, Testimonial 
} from './types/index.ts';

import { Navbar } from './components/Navbar.tsx';
import { AnnouncementBanner } from './components/AnnouncementBanner.tsx';
import { Hero } from './components/Hero.tsx';
import { ProblemsSolved } from './components/ProblemsSolved.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { SampleShowcase } from './components/SampleShowcase.tsx';
import { DailyUpdateFeature } from './components/DailyUpdateFeature.tsx';
import { CatalogSection } from './components/CatalogSection.tsx';
import { ActiveOffersSection } from './components/ActiveOffersSection.tsx';
import { PricingSection } from './components/PricingSection.tsx';
import { BenefitsSection } from './components/BenefitsSection.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { EnquiryForm } from './components/EnquiryForm.tsx';
import { Footer } from './components/Footer.tsx';
import { LegalModal } from './components/LegalModal.tsx';
import { AdminLoginModal } from './components/admin/AdminLoginModal.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';

export default function App() {
  // Public Data State
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [portfolio, setPortfolio] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // App View & Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedEnquiryService, setSelectedEnquiryService] = useState<string>('Business Website Creation');
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'refund' | null>(null);

  // Check stored auth session
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      api.getMe()
        .then(res => setCurrentUser(res.user))
        .catch(() => clearStoredToken());
    }
  }, []);

  // Fetch Public Data
  const fetchPublicData = async () => {
    try {
      const [sc, srv, prc, prod, off, port, tst] = await Promise.all([
        api.getSiteContent().catch(() => null),
        api.getServices().catch(() => []),
        api.getPricing().catch(() => []),
        api.getProducts().catch(() => []),
        api.getOffers().catch(() => []),
        api.getPortfolio().catch(() => []),
        api.getTestimonials().catch(() => []),
      ]);

      setSiteContent(sc);
      setServices(srv);
      setPricingPlans(prc);
      setProducts(prod);
      setOffers(off);
      setPortfolio(port);
      setTestimonials(tst);
    } catch (err) {
      console.error('Error fetching public content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  const handleNavigateSection = (id: string) => {
    if (viewMode === 'admin') {
      setViewMode('public');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForEnquiry = (serviceTitle: string) => {
    setSelectedEnquiryService(serviceTitle);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlanForEnquiry = (planName: string) => {
    setSelectedEnquiryService(`Pricing Plan: ${planName}`);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClaimOffer = (offerTitle: string) => {
    setSelectedEnquiryService(`Special Offer: ${offerTitle}`);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminClick = () => {
    if (currentUser) {
      setViewMode(prev => prev === 'admin' ? 'public' : 'admin');
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    setCurrentUser(null);
    setViewMode('public');
  };

  // If in admin mode and user is authenticated, render the Admin Workspace
  if (viewMode === 'admin' && currentUser) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
        onReturnToSite={() => setViewMode('public')}
        onRefreshPublicData={fetchPublicData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Announcement Banner */}
      <AnnouncementBanner
        content={siteContent}
        onActionClick={() => handleNavigateSection('pricing')}
      />

      {/* Main Navigation Bar */}
      <Navbar
        content={siteContent}
        onOpenAdmin={handleAdminClick}
        isAdminLoggedIn={Boolean(currentUser)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Body */}
      <main className="flex-1">
        {/* 1. Hero */}
        <Hero
          content={siteContent}
          onGetStarted={() => handleNavigateSection('contact')}
          onExploreServices={() => handleNavigateSection('services')}
        />

        {/* 2. Business Problems Solved */}
        <ProblemsSolved />

        {/* 3. Dynamic Database Services */}
        <ServicesSection
          services={services}
          onSelectService={handleSelectServiceForEnquiry}
        />

        {/* 4. How It Works */}
        <HowItWorks />

        {/* 5. Sample Project Showcase */}
        <SampleShowcase
          projects={portfolio}
        />

        {/* 6. Daily Update Management Feature Highlight */}
        <DailyUpdateFeature
          onExploreLiveCatalog={() => handleNavigateSection('catalog')}
        />

        {/* 7. Live Database Catalog with WhatsApp Ordering */}
        <CatalogSection
          products={products}
          content={siteContent}
          onOpenAdmin={handleAdminClick}
        />

        {/* 8. Active Offers & Announcements */}
        <ActiveOffersSection
          offers={offers}
          onClaimOffer={handleClaimOffer}
        />

        {/* 9. Configurable Pricing Packages */}
        <PricingSection
          plans={pricingPlans}
          onSelectPlan={handleSelectPlanForEnquiry}
        />

        {/* 10. Commercial Benefits & ROI */}
        <BenefitsSection />

        {/* 11. Client Testimonials & Merchant Feedback */}
        <TestimonialsSection
          testimonials={testimonials}
          onOpenEnquiry={() => handleNavigateSection('contact')}
        />

        {/* 12. About Us & Founding Mission */}
        <AboutSection />

        {/* 13. Frequently Asked Questions */}
        <FaqSection />

        {/* 13. Customer Enquiry System with Database Submission */}
        <EnquiryForm
          initialService={selectedEnquiryService}
          content={siteContent}
          onOpenPrivacyPolicy={() => setLegalModalType('privacy')}
        />
      </main>

      {/* Footer */}
      <Footer
        content={siteContent}
        onNavigateSection={handleNavigateSection}
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenAdmin={handleAdminClick}
      />

      {/* Modals */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setViewMode('admin');
        }}
      />

    </div>
  );
}
