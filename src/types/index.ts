export type UserRole = 'OWNER' | 'ADMIN' | 'EDITOR';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export type EnquiryStatus = 
  | 'new'
  | 'contacted'
  | 'proposal_sent'
  | 'in_progress'
  | 'converted'
  | 'closed';

export interface Enquiry {
  id: string;
  ref_code: string;
  name: string;
  business_name: string;
  email?: string;
  phone?: string;
  business_category: string;
  requested_service: string;
  problem_description: string;
  budget_range: string;
  desired_completion_date?: string;
  preferred_contact_method: 'phone' | 'whatsapp' | 'email';
  consent_given: boolean;
  status: EnquiryStatus;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  business_name: string;
  email?: string;
  phone?: string;
  category: string;
  address?: string;
  created_at: string;
}

export type ProjectStatus = 
  | 'new_enquiry'
  | 'discussion'
  | 'proposal_sent'
  | 'awaiting_approval'
  | 'in_progress'
  | 'awaiting_review'
  | 'completed'
  | 'cancelled';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  due_date?: string;
}

export interface Project {
  id: string;
  title: string;
  customer_id?: string;
  customer_name: string;
  business_name: string;
  business_category: string;
  scope_of_work: string;
  agreed_price: number;
  status: ProjectStatus;
  start_date: string;
  target_completion_date: string;
  milestones: Milestone[];
  internal_notes: string;
  customer_visible_updates: string[];
  deliverable_links: string[];
  cover_image?: string;
  is_portfolio_published: boolean;
  portfolio_description?: string;
  services_delivered?: string[];
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  detailed_description: string;
  icon_name: string;
  starting_price: number;
  price_label: string;
  inclusions: string[];
  exclusions: string[];
  is_published: boolean;
  order_index: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  price_inr: number;
  billing_interval: 'one_time' | 'monthly' | 'yearly';
  subtitle: string;
  inclusions: string[];
  exclusions: string[];
  is_popular: boolean;
  is_published: boolean;
  order_index: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_inr: number;
  original_price_inr?: number;
  category: string;
  image_url: string;
  is_available: boolean;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  last_editor: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount_badge?: string;
  image_url?: string;
  start_date: string;
  expiry_date: string;
  is_published: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface SiteContent {
  hero_headline: string;
  hero_supporting_text: string;
  primary_cta_label: string;
  primary_cta_link: string;
  secondary_cta_label: string;
  secondary_cta_link: string;
  announcement_banner_active: boolean;
  announcement_banner_text: string;
  announcement_banner_link?: string;
  business_email: string;
  business_phone: string;
  whatsapp_number: string;
  business_hours: string;
  location_address: string;
  footer_tagline: string;
  updated_at: string;
  last_editor: string;
}

export interface PriceHistoryRecord {
  id: string;
  product_id: string;
  product_name: string;
  old_price: number;
  new_price: number;
  reason?: string;
  effective_date: string;
  updated_by: string;
  created_at: string;
}

export interface ScheduledUpdate {
  id: string;
  entity_type: 'product' | 'price' | 'offer' | 'site_content' | 'service';
  entity_id: string;
  scheduled_time: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'executed' | 'cancelled' | 'failed';
  executed_at?: string;
  created_by: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_name: string;
  user_email: string;
  action_type: 'create' | 'update' | 'delete' | 'publish' | 'price_change' | 'schedule';
  entity_type: string;
  entity_id: string;
  summary: string;
  old_value?: unknown;
  new_value?: unknown;
  timestamp: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  file_size_kb: number;
  mime_type: string;
  uploaded_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  business_name: string;
  business_category: string;
  location?: string;
  rating: number;
  feedback_text: string;
  concrete_outcome: string;
  avatar_url?: string;
  is_published: boolean;
  created_at: string;
}

