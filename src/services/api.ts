import type { 
  SiteContent, ServiceItem, PricingPlan, Product, Offer, 
  Project, Enquiry, Customer, PriceHistoryRecord, ScheduledUpdate, 
  ActivityLog, MediaItem, User, Testimonial 
} from '../types/index.ts';

const TOKEN_KEY = 'mindmesh_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Public Endpoints
  getSiteContent: () => request<SiteContent>('/api/public/site-content'),
  getServices: () => request<ServiceItem[]>('/api/public/services'),
  getPricing: () => request<PricingPlan[]>('/api/public/pricing'),
  getProducts: () => request<Product[]>('/api/public/products'),
  getOffers: () => request<Offer[]>('/api/public/offers'),
  getPortfolio: () => request<Project[]>('/api/public/portfolio'),
  getTestimonials: () => request<Testimonial[]>('/api/public/testimonials'),
  submitEnquiry: (data: Partial<Enquiry>) => 
    request<{ success: boolean; ref_code: string; message: string; enquiry_id: string }>(
      '/api/public/enquiries', 
      { method: 'POST', body: JSON.stringify(data) }
    ),

  // Auth Endpoints
  login: (email: string, password: string) => 
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => request<{ user: User }>('/api/auth/me'),
  updatePassword: (current_password: string, new_password: string) =>
    request<{ success: boolean; message: string }>('/api/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({ current_password, new_password }),
    }),
  getUsers: () => request<User[]>('/api/auth/users'),
  createUser: (userData: { name: string; email: string; password: string; role: string }) =>
    request<{ success: boolean; user: User }>('/api/auth/create-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Admin Metrics
  getMetrics: () => request<{
    enquiriesToday: number;
    unansweredEnquiries: number;
    activeProjects: number;
    completedProjects: number;
    totalCustomers: number;
    publishedProducts: number;
    activeOffers: number;
    scheduledUpdates: number;
    totalEnquiries: number;
    totalServices: number;
  }>('/api/admin/metrics'),

  // Enquiries
  getAdminEnquiries: () => request<Enquiry[]>('/api/admin/enquiries'),
  updateEnquiry: (id: string, updates: Partial<Enquiry>) =>
    request<Enquiry>(`/api/admin/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteEnquiry: (id: string) =>
    request<{ success: boolean }>(`/api/admin/enquiries/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: () => request<Customer[]>('/api/admin/customers'),
  createCustomer: (data: Partial<Customer>) =>
    request<Customer>('/api/admin/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Projects
  getProjects: () => request<Project[]>('/api/admin/projects'),
  createProject: (data: Partial<Project>) =>
    request<Project>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, updates: Partial<Project>) =>
    request<Project>(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteProject: (id: string) =>
    request<{ success: boolean }>(`/api/admin/projects/${id}`, { method: 'DELETE' }),

  // Services
  getAdminServices: () => request<ServiceItem[]>('/api/admin/services'),
  createService: (data: Partial<ServiceItem>) =>
    request<ServiceItem>('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateService: (id: string, updates: Partial<ServiceItem>) =>
    request<ServiceItem>(`/api/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteService: (id: string) =>
    request<{ success: boolean }>(`/api/admin/services/${id}`, { method: 'DELETE' }),

  // Pricing Plans
  getAdminPricing: () => request<PricingPlan[]>('/api/admin/pricing'),
  createPricingPlan: (data: Partial<PricingPlan>) =>
    request<PricingPlan>('/api/admin/pricing', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePricingPlan: (id: string, updates: Partial<PricingPlan>) =>
    request<PricingPlan>(`/api/admin/pricing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Products & Daily Price
  getAdminProducts: () => request<Product[]>('/api/admin/products'),
  createProduct: (data: Partial<Product>) =>
    request<Product>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, updates: Partial<Product>) =>
    request<Product>(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  submitPriceUpdate: (productId: string, payload: {
    new_price: number;
    reason?: string;
    effective_date?: string;
    schedule_for?: string;
  }) =>
    request<{ success: boolean; scheduled?: boolean; product?: Product; history?: PriceHistoryRecord; job?: ScheduledUpdate }>(
      `/api/admin/products/${productId}/price-update`,
      { method: 'POST', body: JSON.stringify(payload) }
    ),
  getPriceHistory: () => request<PriceHistoryRecord[]>('/api/admin/price-history'),

  // Offers
  getAdminOffers: () => request<Offer[]>('/api/admin/offers'),
  createOffer: (data: Partial<Offer>) =>
    request<Offer>('/api/admin/offers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateOffer: (id: string, updates: Partial<Offer>) =>
    request<Offer>(`/api/admin/offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteOffer: (id: string) =>
    request<{ success: boolean }>(`/api/admin/offers/${id}`, { method: 'DELETE' }),

  // Site Content
  getAdminSiteContent: () => request<SiteContent>('/api/admin/site-content'),
  updateSiteContent: (content: Partial<SiteContent>) =>
    request<SiteContent>('/api/admin/site-content', {
      method: 'PUT',
      body: JSON.stringify(content),
    }),

  // Scheduled Updates
  getScheduledUpdates: () => request<ScheduledUpdate[]>('/api/admin/scheduled-updates'),
  cancelScheduledUpdate: (id: string) =>
    request<{ success: boolean }>(`/api/admin/scheduled-updates/${id}/cancel`, {
      method: 'DELETE',
    }),
  executeScheduledUpdateNow: (id: string) =>
    request<{ success: boolean }>(`/api/admin/scheduled-updates/${id}/execute-now`, {
      method: 'POST',
    }),

  // Activity Logs & Media
  getActivityLogs: () => request<ActivityLog[]>('/api/admin/activity-logs'),
  getMedia: () => request<MediaItem[]>('/api/admin/media'),
  createMedia: (data: Partial<MediaItem>) =>
    request<MediaItem>('/api/admin/media', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteMedia: (id: string) =>
    request<{ success: boolean }>(`/api/admin/media/${id}`, { method: 'DELETE' }),

  // Testimonials Admin
  getAdminTestimonials: () => request<Testimonial[]>('/api/admin/testimonials'),
  createTestimonial: (data: Partial<Testimonial>) =>
    request<Testimonial>('/api/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTestimonial: (id: string, updates: Partial<Testimonial>) =>
    request<Testimonial>(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteTestimonial: (id: string) =>
    request<{ success: boolean }>(`/api/admin/testimonials/${id}`, { method: 'DELETE' }),

  // AI draft assistant
  generateDraft: (payload: { type: string; business_name: string; category: string; details: string }) =>
    request<{ draft: string; ai_generated: boolean; note?: string }>('/api/admin/ai/draft', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
