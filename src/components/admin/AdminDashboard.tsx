import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, MessageSquare, DollarSign, Package, Tag, 
  Globe, Briefcase, Users, Clock, History, Image as ImageIcon, 
  Sparkles, Settings, LogOut, Search, Plus, Trash2, Edit, Check, 
  X, AlertCircle, RefreshCw, Eye, Shield, CheckCircle2, ChevronRight,
  ExternalLink, Calendar, Key, AlertTriangle, ArrowRight, Star
} from 'lucide-react';
import { api, clearStoredToken } from '../../services/api.ts';
import type { 
  User, Enquiry, Customer, Project, ServiceItem, PricingPlan, 
  Product, Offer, SiteContent, PriceHistoryRecord, ScheduledUpdate, 
  ActivityLog, MediaItem, Testimonial 
} from '../../types/index.ts';

interface AdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
  onReturnToSite: () => void;
  onRefreshPublicData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onReturnToSite,
  onRefreshPublicData,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Data States
  const [metrics, setMetrics] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryRecord[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [scheduledUpdates, setScheduledUpdates] = useState<ScheduledUpdate[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const isOwner = currentUser.role === 'OWNER';

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        m, enq, prod, ph, off, sc, srv, prc, prj, cust, sch, act, med, tst
      ] = await Promise.all([
        api.getMetrics().catch(() => null),
        api.getAdminEnquiries().catch(() => []),
        api.getAdminProducts().catch(() => []),
        api.getPriceHistory().catch(() => []),
        api.getAdminOffers().catch(() => []),
        api.getAdminSiteContent().catch(() => null),
        api.getAdminServices().catch(() => []),
        api.getAdminPricing().catch(() => []),
        api.getProjects().catch(() => []),
        api.getCustomers().catch(() => []),
        api.getScheduledUpdates().catch(() => []),
        api.getActivityLogs().catch(() => []),
        api.getMedia().catch(() => []),
        api.getAdminTestimonials().catch(() => []),
      ]);

      setMetrics(m);
      setEnquiries(enq);
      setProducts(prod);
      setPriceHistory(ph);
      setOffers(off);
      setSiteContent(sc);
      setServices(srv);
      setPricingPlans(prc);
      setProjects(prj);
      setCustomers(cust);
      setScheduledUpdates(sch);
      setActivityLogs(act);
      setMediaItems(med);
      setTestimonials(tst);

      if (isOwner) {
        api.getUsers().then(setUsers).catch(() => []);
      }
    } catch (err) {
      showToast('Error loading administrative records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Dedicated Daily Price Form State
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [newPriceInput, setNewPriceInput] = useState<string>('');
  const [priceReason, setPriceReason] = useState<string>('');
  const [priceScheduleTime, setPriceScheduleTime] = useState<string>('');

  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
      setNewPriceInput(String(products[0].price_inr));
    }
  }, [products, selectedProductId]);

  const handleProductSelectChange = (id: string) => {
    setSelectedProductId(id);
    const prod = products.find(p => p.id === id);
    if (prod) {
      setNewPriceInput(String(prod.price_inr));
    }
  };

  const handleDailyPriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !newPriceInput || Number(newPriceInput) < 0) {
      showToast('Please enter a valid non-negative price', 'error');
      return;
    }

    try {
      const res = await api.submitPriceUpdate(selectedProductId, {
        new_price: Number(newPriceInput),
        reason: priceReason || 'Daily live rate update',
        schedule_for: priceScheduleTime || undefined,
      });

      if (res.scheduled) {
        showToast('Price change scheduled successfully!');
      } else {
        showToast('Live price published immediately to public storefront!');
      }

      setPriceReason('');
      setPriceScheduleTime('');
      await loadAllData();
      onRefreshPublicData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update price', 'error');
    }
  };

  // Dedicated Product CRUD Modal State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || editingProduct?.price_inr === undefined) {
      showToast('Name and valid price are required', 'error');
      return;
    }

    try {
      if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, editingProduct);
        showToast('Product updated successfully');
      } else {
        await api.createProduct(editingProduct);
        showToast('New product created successfully');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await loadAllData();
      onRefreshPublicData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error saving product', 'error');
    }
  };

  // Dedicated Offer CRUD State
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer?.title || !editingOffer?.description || !editingOffer?.start_date || !editingOffer?.expiry_date) {
      showToast('Please fill all required offer fields', 'error');
      return;
    }

    try {
      if (editingOffer.id) {
        await api.updateOffer(editingOffer.id, editingOffer);
        showToast('Offer updated successfully');
      } else {
        await api.createOffer(editingOffer);
        showToast('New offer published to public site');
      }
      setIsOfferModalOpen(false);
      setEditingOffer(null);
      await loadAllData();
      onRefreshPublicData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error saving offer', 'error');
    }
  };

  // AI Draft Generator State
  const [aiDraftType, setAiDraftType] = useState('proposal');
  const [aiBusinessName, setAiBusinessName] = useState('');
  const [aiCategory, setAiCategory] = useState('Retail');
  const [aiDetails, setAiDetails] = useState('');
  const [aiGeneratedText, setAiGeneratedText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateAiDraft = async () => {
    setAiLoading(true);
    try {
      const res = await api.generateDraft({
        type: aiDraftType,
        business_name: aiBusinessName,
        category: aiCategory,
        details: aiDetails,
      });
      setAiGeneratedText(res.draft);
      showToast(res.ai_generated ? 'AI draft generated with Gemini!' : 'Template draft generated!');
    } catch (err) {
      showToast('Error drafting content', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Password update state
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passUpdateMsg, setPassUpdateMsg] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updatePassword(currPass, newPass);
      setPassUpdateMsg('Password updated successfully');
      setCurrPass('');
      setNewPass('');
      showToast('Password updated');
    } catch (err) {
      setPassUpdateMsg(err instanceof Error ? err.message : 'Error updating password');
    }
  };

  // Navigation Items
  const navTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, badge: metrics?.unansweredEnquiries },
    { id: 'daily-price', label: 'Daily Price Updates', icon: DollarSign, highlight: true },
    { id: 'products', label: 'Products & Catalog', icon: Package },
    { id: 'offers', label: 'Offers & Banners', icon: Tag },
    { id: 'site-content', label: 'Website Content', icon: Globe },
    { id: 'services', label: 'Services Manager', icon: Briefcase },
    { id: 'pricing-plans', label: 'Pricing Packages', icon: DollarSign },
    { id: 'projects', label: 'Projects & Deliverables', icon: CheckCircle2 },
    { id: 'customers', label: 'Customers CRM', icon: Users },
    { id: 'scheduled', label: 'Scheduled Queue', icon: Clock, badge: metrics?.scheduledUpdates },
    { id: 'activity', label: 'Activity Audit Log', icon: History },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimonials & Reviews', icon: Star },
    { id: 'ai-assistant', label: 'AI Drafting Assistant', icon: Sparkles },
    { id: 'settings', label: 'Settings & Database', icon: Settings },
  ];

  // Testimonials Modal State
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.client_name || !editingTestimonial?.business_name || !editingTestimonial?.feedback_text) {
      showToast('Client name, business name, and feedback are required', 'error');
      return;
    }

    try {
      if (editingTestimonial.id) {
        await api.updateTestimonial(editingTestimonial.id, editingTestimonial);
        showToast('Testimonial updated');
      } else {
        await api.createTestimonial(editingTestimonial);
        showToast('New testimonial created');
      }
      setIsTestimonialModalOpen(false);
      setEditingTestimonial(null);
      await loadAllData();
      onRefreshPublicData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error saving testimonial', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl border text-xs font-medium flex items-center gap-2.5 animate-slide-up ${
          toastMessage.type === 'error'
            ? 'bg-rose-950/95 border-rose-800 text-rose-200'
            : 'bg-emerald-950/95 border-emerald-800 text-emerald-200'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center p-1.5 shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block">
                MINDMESH Admin
              </span>
              <span className="text-[10px] font-mono text-blue-400 block -mt-0.5">
                Role: {currentUser.role}
              </span>
            </div>
          </div>

          <button
            onClick={onReturnToSite}
            className="text-xs text-slate-400 hover:text-white p-1"
            title="View Public Site"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : tab.highlight
                    ? 'text-emerald-400 hover:bg-slate-800/80 bg-emerald-950/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </div>

                {tab.badge && tab.badge > 0 ? (
                  <span className="ml-2 px-1.5 py-0.2 bg-rose-500 text-white font-mono text-[10px] rounded-full">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <div className="px-2 py-1.5 rounded-lg bg-slate-950/50 text-[11px] text-slate-400">
            <span className="text-slate-200 font-medium block truncate">{currentUser.name}</span>
            <span className="truncate block font-mono text-[10px] text-slate-500">{currentUser.email}</span>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer border border-rose-900/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80 text-left">
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-0.5">
              Admin Portal / {navTabs.find(t => t.id === activeTab)?.label}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {navTabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh Records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={onReturnToSite}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Live Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 text-left">
            {/* Real Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
                <span className="text-xs text-slate-400 block mb-1">Enquiries Today</span>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  {metrics?.enquiriesToday ?? 0}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">Real database records</span>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
                <span className="text-xs text-slate-400 block mb-1">Unanswered Enquiries</span>
                <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  {metrics?.unansweredEnquiries ?? 0}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">Requires follow-up</span>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
                <span className="text-xs text-slate-400 block mb-1">Active Projects</span>
                <span className="text-2xl font-bold font-mono text-blue-400 tabular-nums">
                  {metrics?.activeProjects ?? 0}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">In progress & review</span>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
                <span className="text-xs text-slate-400 block mb-1">Published Catalog Items</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {metrics?.publishedProducts ?? 0}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">Live on storefront</span>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Need to change a product price or post a daily special?
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Use the dedicated Daily Price Updates screen to update rates in 30 seconds with automatic audit logging.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('daily-price')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                <span>Go to Daily Price Editor</span>
              </button>
            </div>

            {/* Recent Enquiries & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Enquiries */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Recent Customer Requests</h3>
                  <button onClick={() => setActiveTab('enquiries')} className="text-xs text-blue-400 hover:underline">
                    View All ({enquiries.length})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {enquiries.slice(0, 4).map((enq) => (
                    <div key={enq.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block">{enq.business_name}</span>
                        <span className="text-slate-400 text-[11px]">{enq.requested_service} · {enq.budget_range}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold ${
                        enq.status === 'new' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Audit Logs */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Audit Log Activity</h3>
                  <button onClick={() => setActiveTab('activity')} className="text-xs text-blue-400 hover:underline">
                    View Full Log
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activityLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
                        <span>{log.user_name}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-200 line-clamp-1">{log.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Total Submissions: {enquiries.length}
              </span>
            </div>

            <div className="space-y-4">
              {enquiries.length === 0 ? (
                <div className="p-12 text-center text-slate-500 rounded-2xl border border-slate-800">
                  No enquiries received yet.
                </div>
              ) : (
                enquiries.map((enq) => (
                  <div key={enq.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white">{enq.business_name}</span>
                          <span className="font-mono text-xs text-blue-400">({enq.ref_code})</span>
                        </div>
                        <span className="text-xs text-slate-400">Contact: {enq.name} · {enq.business_category}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={enq.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value as any;
                            await api.updateEnquiry(enq.id, { status: newStatus });
                            showToast(`Status updated to ${newStatus}`);
                            loadAllData();
                          }}
                          className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono cursor-pointer"
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="proposal_sent">PROPOSAL SENT</option>
                          <option value="in_progress">IN PROGRESS</option>
                          <option value="converted">CONVERTED</option>
                          <option value="closed">CLOSED</option>
                        </select>

                        {isOwner && (
                          <button
                            onClick={async () => {
                              if (confirm('Delete this enquiry record?')) {
                                await api.deleteEnquiry(enq.id);
                                showToast('Enquiry deleted');
                                loadAllData();
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg"
                            title="Delete enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block">Phone / WhatsApp:</span>
                        <span className="font-mono text-white">{enq.phone || 'None provided'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Email Address:</span>
                        <span className="font-mono text-white">{enq.email || 'None provided'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Budget / Timeline:</span>
                        <span className="text-emerald-400 font-mono font-semibold">{enq.budget_range}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <span className="text-slate-400 block mb-1">Problem & Requirements:</span>
                      <p className="text-slate-200 leading-relaxed">{enq.problem_description}</p>
                    </div>

                    {/* Internal Notes Editor */}
                    <div className="pt-2">
                      <label className="block text-xs font-medium text-slate-400 mb-1">Internal Staff Notes</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={enq.internal_notes || ''}
                          onBlur={async (e) => {
                            if (e.target.value !== enq.internal_notes) {
                              await api.updateEnquiry(enq.id, { internal_notes: e.target.value });
                              showToast('Internal note saved');
                            }
                          }}
                          placeholder="e.g. Called client; sent WhatsApp proposal draft"
                          className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DEDICATED DAILY PRICE UPDATES (Marquee Feature) */}
        {activeTab === 'daily-price' && (
          <div className="space-y-8 text-left">
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-300 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Daily Live Rate Management Engine</span>
                Changes made here update the live customer storefront immediately without re-compiling or re-deploying the application. Previous and new values are permanently audited.
              </div>
            </div>

            {/* Price Change Form */}
            <form onSubmit={handleDailyPriceSubmit} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
              <h3 className="text-base font-bold text-white">
                Submit Price Revision
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Select Product / Catalog Item <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductSelectChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Current: ₹{p.price_inr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Current Price on Live Site
                  </label>
                  <div className="px-3.5 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl font-mono text-slate-400 font-bold">
                    ₹{products.find(p => p.id === selectedProductId)?.price_inr || 0} INR
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    New Target Price (₹ INR) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={newPriceInput}
                    onChange={(e) => setNewPriceInput(e.target.value)}
                    placeholder="Enter new price in INR"
                    min="0"
                    step="1"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Reason for Price Change <span className="text-slate-500">(Saved to permanent audit log)</span>
                  </label>
                  <input
                    type="text"
                    value={priceReason}
                    onChange={(e) => setPriceReason(e.target.value)}
                    placeholder="e.g. Raw material cost revision, weekend promotion, supplier rate shift"
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Activation Schedule <span className="text-slate-500">(Leave empty for instant publication)</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={priceScheduleTime}
                    onChange={(e) => setPriceScheduleTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-mono">
                  Editor: {currentUser.name} ({currentUser.email})
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{priceScheduleTime ? 'Schedule Price Change' : 'Publish New Price Now'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Price Change Audit History Table */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-400" />
                  <span>Price Modification History & Audit Trail</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">{priceHistory.length} total entries</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3">Old Rate</th>
                      <th className="py-2.5 px-3">New Rate</th>
                      <th className="py-2.5 px-3">Reason</th>
                      <th className="py-2.5 px-3">Editor</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {priceHistory.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-900/50">
                        <td className="py-2.5 px-3 font-sans font-medium text-white">{rec.product_name}</td>
                        <td className="py-2.5 px-3 text-slate-400 line-through">₹{rec.old_price}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">₹{rec.new_price}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-300 max-w-xs truncate">{rec.reason || 'None specified'}</td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">{rec.updated_by}</td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">{new Date(rec.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS & CATALOG CMS */}
        {activeTab === 'products' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {products.length} Products in Catalog
              </span>
              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    description: '',
                    price_inr: 499,
                    category: 'General',
                    image_url: '/src/assets/images/hero_dashboard_showcase_1792331163505.jpg',
                    is_available: true,
                    is_featured: false,
                    is_published: true,
                  });
                  setIsProductModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                      <span>{p.category}</span>
                      <span className={p.is_available ? 'text-emerald-400' : 'text-rose-400'}>
                        {p.is_available ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5">{p.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{p.description}</p>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-bold font-mono text-emerald-400">₹{p.price_inr}</span>
                      {p.original_price_inr && (
                        <span className="text-xs font-mono text-slate-500 line-through">₹{p.original_price_inr}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setIsProductModalOpen(true);
                      }}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Item</span>
                    </button>

                    <button
                      onClick={async () => {
                        await api.updateProduct(p.id, { is_available: !p.is_available });
                        showToast(`Stock availability toggled`);
                        loadAllData();
                        onRefreshPublicData();
                      }}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Toggle Availability
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Edit / Create Modal */}
            {isProductModalOpen && editingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <form onSubmit={handleSaveProduct} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">
                      {editingProduct.id ? 'Edit Product Item' : 'Create New Product'}
                    </h3>
                    <button type="button" onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Product Title</label>
                    <input
                      type="text"
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Price (₹ INR)</label>
                      <input
                        type="number"
                        value={editingProduct.price_inr ?? 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price_inr: Number(e.target.value) })}
                        required
                        min="0"
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Original Price (Strikethrough)</label>
                      <input
                        type="number"
                        value={editingProduct.original_price_inr || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, original_price_inr: e.target.value ? Number(e.target.value) : undefined })}
                        min="0"
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProduct.category || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      placeholder="e.g. Apparel, Bakery, Wellness"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editingProduct.image_url || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_available !== false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_available: e.target.checked })}
                        className="accent-blue-600 cursor-pointer"
                      />
                      <span>In Stock</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.is_published !== false)}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_published: e.target.checked })}
                        className="accent-blue-600 cursor-pointer"
                      />
                      <span>Published to Site</span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: OFFERS & ANNOUNCEMENTS */}
        {activeTab === 'offers' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {offers.length} Promotional Announcements
              </span>
              <button
                onClick={() => {
                  const now = new Date();
                  const inTwoWeeks = new Date(Date.now() + 14 * 24 * 3600 * 1000);
                  setEditingOffer({
                    title: '',
                    description: '',
                    discount_badge: 'FLAT 20% OFF',
                    start_date: now.toISOString().slice(0, 16),
                    expiry_date: inTwoWeeks.toISOString().slice(0, 16),
                    is_published: true,
                  });
                  setIsOfferModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Offer</span>
              </button>
            </div>

            <div className="space-y-4">
              {offers.map((offer) => {
                const isExpired = new Date(offer.expiry_date) < new Date();

                return (
                  <div key={offer.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-bold text-white">{offer.title}</span>
                        {offer.discount_badge && (
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {offer.discount_badge}
                          </span>
                        )}
                        {isExpired && (
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-800 text-slate-400">
                            EXPIRED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 max-w-xl">{offer.description}</p>
                      <div className="text-[11px] font-mono text-slate-400 mt-2">
                        Valid: {new Date(offer.start_date).toLocaleDateString()} to {new Date(offer.expiry_date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          await api.updateOffer(offer.id, { is_published: !offer.is_published });
                          showToast('Publication state updated');
                          loadAllData();
                          onRefreshPublicData();
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                          offer.is_published ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {offer.is_published ? 'Published' : 'Draft'}
                      </button>

                      {isOwner && (
                        <button
                          onClick={async () => {
                            if (confirm('Delete this offer?')) {
                              await api.deleteOffer(offer.id);
                              showToast('Offer deleted');
                              loadAllData();
                              onRefreshPublicData();
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Offer Modal */}
            {isOfferModalOpen && editingOffer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <form onSubmit={handleSaveOffer} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">Create Offer Announcement</h3>
                    <button type="button" onClick={() => setIsOfferModalOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Offer Title</label>
                    <input
                      type="text"
                      value={editingOffer.title || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Discount Tag (e.g. 20% OFF)</label>
                    <input
                      type="text"
                      value={editingOffer.discount_badge || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, discount_badge: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Offer Details</label>
                    <textarea
                      rows={2}
                      value={editingOffer.description || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Start Date</label>
                      <input
                        type="datetime-local"
                        value={editingOffer.start_date || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, start_date: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Expiry Date</label>
                      <input
                        type="datetime-local"
                        value={editingOffer.expiry_date || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, expiry_date: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsOfferModalOpen(false)} className="px-4 py-2 text-xs text-slate-400">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg">
                      Save & Publish
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: WEBSITE CONTENT CMS */}
        {activeTab === 'site-content' && siteContent && (
          <div className="space-y-6 text-left">
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api.updateSiteContent(siteContent);
                showToast('Website content published live!');
                onRefreshPublicData();
              } catch (err) {
                showToast('Error saving content', 'error');
              }
            }} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Homepage & Business Information Editor</h3>
                  <span className="text-xs text-slate-400">Live modifications instantly appear on the public site</span>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
                >
                  Save & Publish Changes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hero Headline</label>
                  <input
                    type="text"
                    value={siteContent.hero_headline}
                    onChange={(e) => setSiteContent({ ...siteContent, hero_headline: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hero Supporting Text</label>
                  <input
                    type="text"
                    value={siteContent.hero_supporting_text}
                    onChange={(e) => setSiteContent({ ...siteContent, hero_supporting_text: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Business Email</label>
                  <input
                    type="email"
                    value={siteContent.business_email}
                    onChange={(e) => setSiteContent({ ...siteContent, business_email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Business Phone & WhatsApp</label>
                  <input
                    type="text"
                    value={siteContent.business_phone}
                    onChange={(e) => setSiteContent({ ...siteContent, business_phone: e.target.value, whatsapp_number: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Business Operating Hours</label>
                  <input
                    type="text"
                    value={siteContent.business_hours}
                    onChange={(e) => setSiteContent({ ...siteContent, business_hours: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location Address</label>
                  <input
                    type="text"
                    value={siteContent.location_address}
                    onChange={(e) => setSiteContent({ ...siteContent, location_address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Announcement Ribbon */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Announcement Ribbon Banner</span>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={siteContent.announcement_banner_active}
                      onChange={(e) => setSiteContent({ ...siteContent, announcement_banner_active: e.target.checked })}
                      className="accent-blue-600 cursor-pointer"
                    />
                    <span>Active on Public Site</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={siteContent.announcement_banner_text}
                  onChange={(e) => setSiteContent({ ...siteContent, announcement_banner_text: e.target.value })}
                  placeholder="Announcement text..."
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </form>
          </div>
        )}

        {/* TAB 7: SERVICES MANAGER */}
        {activeTab === 'services' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 font-mono">
              {services.length} Configured Services
            </span>

            <div className="space-y-4">
              {services.map((srv) => (
                <div key={srv.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{srv.title}</h3>
                    <p className="text-xs text-slate-300 mt-1">{srv.short_description}</p>
                    <span className="font-mono text-xs text-emerald-400 block mt-2">
                      Starting Price: ₹{srv.starting_price} ({srv.price_label})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        const newPriceStr = prompt(`Update starting price for ${srv.title}:`, String(srv.starting_price));
                        if (newPriceStr && !isNaN(Number(newPriceStr))) {
                          await api.updateService(srv.id, { 
                            starting_price: Number(newPriceStr),
                            price_label: `From ₹${newPriceStr}`
                          });
                          showToast('Service price updated');
                          loadAllData();
                          onRefreshPublicData();
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                    >
                      Change Starting Price
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: PRICING PACKAGES */}
        {activeTab === 'pricing-plans' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 font-mono">
              {pricingPlans.length} Configurable Packages
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((plan) => (
                <div key={plan.id} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      {plan.badge && (
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-mono font-bold text-emerald-400 mb-4">
                      ₹{plan.price_inr} <span className="text-xs text-slate-400 font-normal">({plan.billing_interval})</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">{plan.subtitle}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <button
                      onClick={async () => {
                        const newRate = prompt(`Enter new price for package "${plan.name}":`, String(plan.price_inr));
                        if (newRate && !isNaN(Number(newRate))) {
                          await api.updatePricingPlan(plan.id, { price_inr: Number(newRate) });
                          showToast(`Plan price updated to ₹${newRate}`);
                          loadAllData();
                          onRefreshPublicData();
                        }
                      }}
                      className="w-full py-2 text-xs font-semibold text-blue-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                    >
                      Edit Package Price
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: PROJECTS & DELIVERABLES */}
        {activeTab === 'projects' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {projects.length} Client Projects Tracked
              </span>
            </div>

            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{proj.title}</h3>
                      <span className="text-xs text-slate-400">Client: {proj.customer_name} ({proj.business_name})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={proj.status}
                        onChange={async (e) => {
                          await api.updateProject(proj.id, { status: e.target.value as any });
                          showToast('Project status updated');
                          loadAllData();
                        }}
                        className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono cursor-pointer"
                      >
                        <option value="new_enquiry">NEW ENQUIRY</option>
                        <option value="discussion">DISCUSSION</option>
                        <option value="proposal_sent">PROPOSAL SENT</option>
                        <option value="awaiting_approval">AWAITING APPROVAL</option>
                        <option value="in_progress">IN PROGRESS</option>
                        <option value="awaiting_review">AWAITING REVIEW</option>
                        <option value="completed">COMPLETED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>

                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={proj.is_portfolio_published}
                          onChange={async (e) => {
                            await api.updateProject(proj.id, { is_portfolio_published: e.target.checked });
                            showToast('Portfolio visibility updated');
                            loadAllData();
                            onRefreshPublicData();
                          }}
                          className="accent-blue-600"
                        />
                        <span>Public Portfolio</span>
                      </label>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300">
                    <span className="text-slate-400 block mb-0.5">Scope:</span>
                    <p>{proj.scope_of_work}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-800/60">
                    <span>Agreed Price: ₹{proj.agreed_price}</span>
                    <span>Target Date: {proj.target_completion_date || 'Ongoing'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: CUSTOMERS CRM */}
        {activeTab === 'customers' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 font-mono">
              {customers.length} Client Records
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map((cust) => (
                <div key={cust.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">{cust.business_name}</h3>
                    <span className="text-[11px] font-mono text-blue-400">{cust.category}</span>
                  </div>
                  <div className="text-xs text-slate-300">Contact: {cust.name}</div>
                  <div className="text-xs font-mono text-slate-400">Phone: {cust.phone || 'N/A'} · Email: {cust.email || 'N/A'}</div>
                  {cust.address && <div className="text-xs text-slate-500">{cust.address}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: SCHEDULED UPDATES QUEUE */}
        {activeTab === 'scheduled' && (
          <div className="space-y-6 text-left">
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-300">
              <span className="font-semibold text-white block mb-0.5">Automated Server Daemon Active</span>
              Our background scheduler daemon checks this queue every 10 seconds. When a scheduled time arrives, it publishes changes automatically without requiring an open browser window.
            </div>

            <div className="space-y-3">
              {scheduledUpdates.length === 0 ? (
                <div className="p-12 text-center text-slate-500 rounded-2xl border border-slate-800">
                  No scheduled jobs currently in queue.
                </div>
              ) : (
                scheduledUpdates.map((job) => (
                  <div key={job.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-blue-400 font-semibold uppercase">{job.entity_type} UPDATE</span>
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                          job.status === 'pending' ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <span className="text-slate-300">Scheduled for: {new Date(job.scheduled_time).toLocaleString()}</span>
                    </div>

                    {job.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            await api.executeScheduledUpdateNow(job.id);
                            showToast('Execution triggered');
                            loadAllData();
                            onRefreshPublicData();
                          }}
                          className="px-2.5 py-1 text-xs text-emerald-400 hover:bg-emerald-950 rounded cursor-pointer"
                        >
                          Execute Now
                        </button>
                        <button
                          onClick={async () => {
                            await api.cancelScheduledUpdate(job.id);
                            showToast('Job cancelled');
                            loadAllData();
                          }}
                          className="px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-950 rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 12: ACTIVITY AUDIT LOG */}
        {activeTab === 'activity' && (
          <div className="space-y-4 text-left">
            <span className="text-xs text-slate-400 font-mono">
              Audit Log: {activityLogs.length} Recorded Actions
            </span>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-semibold">{log.user_name}</span>
                        <span>({log.user_email})</span>
                      </div>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-200">{log.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 13: MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div className="space-y-6 text-left">
            <span className="text-xs text-slate-400 font-mono">
              {mediaItems.length} Visual Assets & References
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.map((med) => (
                <div key={med.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                  <div className="aspect-[4/3] bg-slate-950">
                    <img src={med.url} alt={med.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-xs font-semibold text-white truncate">{med.title}</h4>
                    <span className="text-[11px] font-mono text-slate-500 block">{med.file_size_kb} KB · {med.mime_type}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(med.url);
                        showToast('Asset URL copied to clipboard');
                      }}
                      className="mt-3 w-full py-1.5 text-xs text-blue-400 bg-blue-950/40 border border-blue-800/40 rounded-lg cursor-pointer hover:text-white"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 14: AI DRAFTING ASSISTANT */}
        {activeTab === 'ai-assistant' && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>AI Business Proposal & Copy Drafter</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Draft service proposals, catalog descriptions, or festive campaign copy. Human review is required before publishing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Content Type</label>
                  <select
                    value={aiDraftType}
                    onChange={(e) => setAiDraftType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white cursor-pointer"
                  >
                    <option value="proposal">Client Service Proposal</option>
                    <option value="product_desc">Product Catalog Description</option>
                    <option value="offer_copy">Festive Announcement Copy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={aiBusinessName}
                    onChange={(e) => setAiBusinessName(e.target.value)}
                    placeholder="e.g. Royal Sweets & Bakery"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Business Category</label>
                  <input
                    type="text"
                    value={aiCategory}
                    onChange={(e) => setAiCategory(e.target.value)}
                    placeholder="e.g. Bakery / Retail / Salon"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Specific Client Requirements</label>
                <textarea
                  rows={2}
                  value={aiDetails}
                  onChange={(e) => setAiDetails(e.target.value)}
                  placeholder="e.g. Wants 1-page mobile menu, QR code on 10 tables, and WhatsApp orders"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <button
                onClick={handleGenerateAiDraft}
                disabled={aiLoading}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate Draft Content</span>
              </button>

              {aiGeneratedText && (
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">Generated Draft Preview:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiGeneratedText);
                        showToast('Draft copied to clipboard');
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                    {aiGeneratedText}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: TESTIMONIALS & REVIEWS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-mono">
                  {testimonials.length} Client Testimonials
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage verified customer reviews, ratings, and business outcomes displayed on the public site.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTestimonial({
                    client_name: '',
                    business_name: '',
                    business_category: 'Retail & Clothing',
                    location: 'Indiranagar, Bengaluru',
                    rating: 5.0,
                    feedback_text: '',
                    concrete_outcome: 'Saved 2+ hours daily on phone inquiries',
                    is_published: true,
                  });
                  setIsTestimonialModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{t.business_name}</span>
                      <span className="text-xs text-slate-400">· {t.client_name}</span>
                      <span className="flex items-center gap-0.5 text-amber-400 font-mono text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{t.rating.toFixed(1)}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic max-w-2xl leading-relaxed">
                      "{t.feedback_text}"
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
                      <span>Category: {t.business_category}</span>
                      {t.location && <span>· Location: {t.location}</span>}
                      {t.concrete_outcome && (
                        <span className="text-emerald-400 font-sans">
                          · Outcome: {t.concrete_outcome}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={async () => {
                        await api.updateTestimonial(t.id, { is_published: !t.is_published });
                        showToast(`Review ${!t.is_published ? 'published' : 'hidden from public site'}`);
                        loadAllData();
                        onRefreshPublicData();
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        t.is_published ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {t.is_published ? 'Published' : 'Hidden'}
                    </button>

                    <button
                      onClick={() => {
                        setEditingTestimonial(t);
                        setIsTestimonialModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                      title="Edit Review"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {isOwner && (
                      <button
                        onClick={async () => {
                          if (confirm(`Delete testimonial for "${t.business_name}"?`)) {
                            await api.deleteTestimonial(t.id);
                            showToast('Testimonial deleted');
                            loadAllData();
                            onRefreshPublicData();
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial Edit/Create Modal */}
            {isTestimonialModalOpen && editingTestimonial && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                <form onSubmit={handleSaveTestimonial} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white">
                      {editingTestimonial.id ? 'Edit Client Feedback' : 'Add Client Testimonial'}
                    </h3>
                    <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Client Contact Name</label>
                      <input
                        type="text"
                        value={editingTestimonial.client_name || ''}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, client_name: e.target.value })}
                        placeholder="e.g. Kavita Menon"
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Business Name</label>
                      <input
                        type="text"
                        value={editingTestimonial.business_name || ''}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, business_name: e.target.value })}
                        placeholder="e.g. The Rowen Apparel"
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Business Category</label>
                      <input
                        type="text"
                        value={editingTestimonial.business_category || ''}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, business_category: e.target.value })}
                        placeholder="e.g. Clothing Store"
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                      <input
                        type="text"
                        value={editingTestimonial.location || ''}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                        placeholder="e.g. Indiranagar, Bengaluru"
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Rating (out of 5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={editingTestimonial.rating ?? 5.0}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                        required
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Concrete Measurable Outcome</label>
                    <input
                      type="text"
                      value={editingTestimonial.concrete_outcome || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, concrete_outcome: e.target.value })}
                      placeholder="e.g. 40+ WhatsApp orders during festive season"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Feedback Quote</label>
                    <textarea
                      rows={3}
                      value={editingTestimonial.feedback_text || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, feedback_text: e.target.value })}
                      placeholder="Describe the experience, speed, and business impact..."
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTestimonial.is_published !== false}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, is_published: e.target.checked })}
                        className="accent-blue-600 cursor-pointer"
                      />
                      <span>Publish on public website</span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="px-4 py-2 text-xs text-slate-400">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg">
                      Save Testimonial
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 15: SETTINGS & DATABASE CONFIGURATION */}
        {activeTab === 'settings' && (
          <div className="space-y-8 text-left">
            {/* Account Password Form */}
            <form onSubmit={handleUpdatePassword} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-400" />
                <span>Change Your Password</span>
              </h3>

              {passUpdateMsg && (
                <div className="p-3 rounded-lg bg-blue-950/60 border border-blue-800/40 text-xs text-blue-300">
                  {passUpdateMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currPass}
                    onChange={(e) => setCurrPass(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">New Password (min 8 chars)</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer"
              >
                Update Password
              </button>
            </form>

            {/* Team User Management (OWNER Only) */}
            {isOwner && (
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Team User Accounts</span>
                </h3>

                <div className="space-y-2">
                  {users.map((u) => (
                    <div key={u.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white">{u.name}</span>
                        <span className="text-slate-400 font-mono text-[11px] block">{u.email}</span>
                      </div>
                      <span className="font-mono text-blue-400 text-[11px] uppercase">{u.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Database Persistence & Supabase Setup Guide */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4 text-xs text-slate-300">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Integrated Database & Supabase Integration Status</span>
              </h3>
              <p className="leading-relaxed">
                MINDMESH is currently operating with a persistent, server-authoritative JSON database engine (<code className="text-blue-400 font-mono">data/database.json</code>) with atomic transactions, encrypted password hashing, and active background scheduler.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="text-emerald-400 font-semibold">✓ Ready for Production:</div>
                <div>• Supabase PostgreSQL schema script: <span className="text-white">src/db/supabase-schema.sql</span></div>
                <div>• Complete migration guide: <span className="text-white">docs/SUPABASE_SETUP.md</span></div>
                <div>• Zero-cost free tier compatible for ₹0–₹2,000 INR startup budget.</div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
