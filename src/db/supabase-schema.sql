-- ====================================================================
-- MINDMESH — Supabase PostgreSQL Database Schema & Migration Script
-- Designed for ₹0-2000 INR budget startup on Supabase Free Tier
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles & Role-Based Access Control (RBAC)
CREATE TYPE user_role AS ENUM ('OWNER', 'ADMIN', 'EDITOR');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'EDITOR'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Customer Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ref_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  business_category TEXT NOT NULL,
  requested_service TEXT NOT NULL,
  problem_description TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  desired_completion_date DATE,
  preferred_contact_method TEXT DEFAULT 'whatsapp' NOT NULL,
  consent_given BOOLEAN DEFAULT true NOT NULL,
  status TEXT DEFAULT 'new' NOT NULL,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Customers & Client Accounts
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  category TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Projects & Deliverables
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_category TEXT NOT NULL,
  title TEXT NOT NULL,
  scope_of_work TEXT NOT NULL,
  agreed_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status TEXT DEFAULT 'discussion' NOT NULL,
  start_date DATE DEFAULT CURRENT_DATE NOT NULL,
  target_completion_date DATE,
  milestones JSONB DEFAULT '[]'::jsonb NOT NULL,
  internal_notes TEXT DEFAULT '',
  customer_visible_updates JSONB DEFAULT '[]'::jsonb NOT NULL,
  deliverable_links JSONB DEFAULT '[]'::jsonb NOT NULL,
  cover_image TEXT,
  is_portfolio_published BOOLEAN DEFAULT false NOT NULL,
  portfolio_description TEXT,
  services_delivered JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Services Offered
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  detailed_description TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Globe' NOT NULL,
  starting_price NUMERIC(10, 2) NOT NULL DEFAULT 999.00,
  price_label TEXT DEFAULT 'Starting from ₹999' NOT NULL,
  inclusions JSONB DEFAULT '[]'::jsonb NOT NULL,
  exclusions JSONB DEFAULT '[]'::jsonb NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL,
  order_index INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Pricing Packages
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  badge TEXT,
  price_inr NUMERIC(10, 2) NOT NULL,
  billing_interval TEXT DEFAULT 'one_time' NOT NULL,
  subtitle TEXT NOT NULL,
  inclusions JSONB DEFAULT '[]'::jsonb NOT NULL,
  exclusions JSONB DEFAULT '[]'::jsonb NOT NULL,
  is_popular BOOLEAN DEFAULT false NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL,
  order_index INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Products & Digital Storefront Catalog
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price_inr NUMERIC(10, 2) NOT NULL,
  original_price_inr NUMERIC(10, 2),
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL,
  last_editor TEXT DEFAULT 'Admin' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Daily Price Changes Audit Log
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  old_price NUMERIC(10, 2) NOT NULL,
  new_price NUMERIC(10, 2) NOT NULL,
  reason TEXT,
  effective_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. Offers & Seasonal Announcements
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount_badge TEXT,
  image_url TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  expiry_date TIMESTAMPTZ NOT NULL,
  is_published BOOLEAN DEFAULT false NOT NULL,
  is_archived BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. Scheduled Updates Queue
CREATE TABLE IF NOT EXISTS public.scheduled_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  executed_at TIMESTAMPTZ,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. General Activity Audit Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  summary TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. Site Content Single-Record Table
CREATE TABLE IF NOT EXISTS public.site_content (
  id INT PRIMARY KEY DEFAULT 1,
  hero_headline TEXT NOT NULL,
  hero_supporting_text TEXT NOT NULL,
  primary_cta_label TEXT NOT NULL,
  primary_cta_link TEXT NOT NULL,
  secondary_cta_label TEXT NOT NULL,
  secondary_cta_link TEXT NOT NULL,
  announcement_banner_active BOOLEAN DEFAULT false NOT NULL,
  announcement_banner_text TEXT DEFAULT '' NOT NULL,
  announcement_banner_link TEXT,
  business_email TEXT NOT NULL,
  business_phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  business_hours TEXT NOT NULL,
  location_address TEXT NOT NULL,
  footer_tagline TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_editor TEXT NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- 14. Client Testimonials & Merchant Feedback
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_category TEXT NOT NULL,
  location TEXT,
  rating NUMERIC(2, 1) DEFAULT 5.0 NOT NULL,
  feedback_text TEXT NOT NULL,
  concrete_outcome TEXT NOT NULL,
  avatar_url TEXT,
  is_published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view published services" ON public.services FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published pricing" ON public.pricing_plans FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published products" ON public.products FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view active offers" ON public.offers FOR SELECT USING (is_published = true AND is_archived = false AND NOW() BETWEEN start_date AND expiry_date);
CREATE POLICY "Public can view published portfolio" ON public.projects FOR SELECT USING (is_portfolio_published = true);
CREATE POLICY "Public can read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Public can view published testimonials" ON public.testimonials FOR SELECT USING (is_published = true);

-- Public Create Enquiries (Never Read)
CREATE POLICY "Public can submit enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Admin & Owner Full Access (Authenticated Staff)
CREATE POLICY "Staff have full access to enquiries" ON public.enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff have full access to customers" ON public.customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff have full access to projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff have full access to services" ON public.services FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff have full access to pricing" ON public.pricing_plans FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff have full access to products" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff have full access to price history" ON public.price_history FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff have full access to offers" ON public.offers FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff have full access to scheduled updates" ON public.scheduled_updates FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff have full access to activity logs" ON public.activity_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff have full access to site content" ON public.site_content FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff have full access to testimonials" ON public.testimonials FOR ALL TO authenticated USING (true);
