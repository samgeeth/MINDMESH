import express, { type Request, type Response, type NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { 
  getDatabase, saveDatabase, hashPassword, generateToken, 
  verifyToken, logActivity 
} from './server/db.ts';
import { startSchedulerDaemon } from './server/scheduler.ts';
import type { 
  Enquiry, Customer, Project, ServiceItem, PricingPlan, 
  Product, Offer, SiteContent, PriceHistoryRecord, ScheduledUpdate, 
  UserRole, Testimonial 
} from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Auth Middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired session token' });
    return;
  }

  const db = await getDatabase();
  const user = db.users.find(u => u.id === payload.userId);
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  next();
}

function requireRole(roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Access denied: insufficient permissions' });
      return;
    }
    next();
  };
}

// ====================================================================
// PUBLIC API ROUTES
// ====================================================================

app.get('/api/public/site-content', async (_req, res) => {
  const db = await getDatabase();
  res.json(db.site_content);
});

app.get('/api/public/services', async (_req, res) => {
  const db = await getDatabase();
  const published = db.services
    .filter(s => s.is_published)
    .sort((a, b) => a.order_index - b.order_index);
  res.json(published);
});

app.get('/api/public/pricing', async (_req, res) => {
  const db = await getDatabase();
  const published = db.pricing_plans
    .filter(p => p.is_published)
    .sort((a, b) => a.order_index - b.order_index);
  res.json(published);
});

app.get('/api/public/products', async (_req, res) => {
  const db = await getDatabase();
  const published = db.products.filter(p => p.is_published);
  res.json(published);
});

app.get('/api/public/offers', async (_req, res) => {
  const db = await getDatabase();
  const now = new Date();
  const activeOffers = db.offers.filter(o => 
    o.is_published && 
    !o.is_archived && 
    new Date(o.start_date) <= now && 
    new Date(o.expiry_date) >= now
  );
  res.json(activeOffers);
});

app.get('/api/public/portfolio', async (_req, res) => {
  const db = await getDatabase();
  const published = db.projects
    .filter(p => p.is_portfolio_published)
    .map(p => ({
      id: p.id,
      title: p.title,
      business_name: p.business_name,
      business_category: p.business_category,
      scope_of_work: p.scope_of_work,
      portfolio_description: p.portfolio_description || p.scope_of_work,
      services_delivered: p.services_delivered || [],
      cover_image: p.cover_image,
      customer_visible_updates: p.customer_visible_updates,
      deliverable_links: p.deliverable_links,
      status: p.status,
    }));
  res.json(published);
});

app.get('/api/public/testimonials', async (_req, res) => {
  const db = await getDatabase();
  const published = (db.testimonials || []).filter(t => t.is_published);
  res.json(published);
});

app.post('/api/public/enquiries', async (req, res) => {
  try {
    const { 
      name, business_name, email, phone, business_category, 
      requested_service, problem_description, budget_range, 
      desired_completion_date, preferred_contact_method, consent_given 
    } = req.body;

    if (!name || !business_name || !business_category || !requested_service || !problem_description || !budget_range) {
      res.status(400).json({ error: 'Please provide all required fields' });
      return;
    }

    if (!email && !phone) {
      res.status(400).json({ error: 'Please provide either a phone number or email address' });
      return;
    }

    if (!consent_given) {
      res.status(400).json({ error: 'Please consent to the privacy policy to submit' });
      return;
    }

    const db = await getDatabase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ref_code = `MM-2026-${randomSuffix}`;

    const newEnquiry: Enquiry = {
      id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ref_code,
      name: String(name).trim(),
      business_name: String(business_name).trim(),
      email: email ? String(email).trim().toLowerCase() : undefined,
      phone: phone ? String(phone).trim() : undefined,
      business_category: String(business_category).trim(),
      requested_service: String(requested_service).trim(),
      problem_description: String(problem_description).trim(),
      budget_range: String(budget_range).trim(),
      desired_completion_date: desired_completion_date ? String(desired_completion_date) : undefined,
      preferred_contact_method: preferred_contact_method || 'whatsapp',
      consent_given: true,
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.enquiries.unshift(newEnquiry);
    await logActivity(
      'Public Customer',
      email || phone || 'anonymous',
      'create',
      'enquiry',
      newEnquiry.id,
      `New enquiry received from ${newEnquiry.business_name} (${ref_code})`
    );
    await saveDatabase();

    res.status(201).json({
      success: true,
      ref_code,
      message: 'Enquiry submitted successfully. Our team will get in touch shortly.',
      enquiry_id: newEnquiry.id,
    });
  } catch (err) {
    console.error('Error submitting enquiry:', err);
    res.status(500).json({ error: 'Internal server error processing enquiry' });
  }
});

// ====================================================================
// AUTHENTICATION ROUTES
// ====================================================================

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const db = await getDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase().trim());
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.password_hash) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = generateToken(user.id, user.role);
  await logActivity(
    user.name,
    user.email,
    'update',
    'auth',
    user.id,
    `User ${user.email} logged in to admin panel`
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at,
    }
  });
});

app.get('/api/auth/me', requireAuth, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/update-password', requireAuth, async (req: AuthRequest, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password || new_password.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long' });
    return;
  }

  const db = await getDatabase();
  const user = db.users.find(u => u.id === req.user!.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (hashPassword(current_password, user.salt) !== user.password_hash) {
    res.status(400).json({ error: 'Current password is incorrect' });
    return;
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  user.salt = newSalt;
  user.password_hash = hashPassword(new_password, newSalt);
  await saveDatabase();

  await logActivity(user.name, user.email, 'update', 'auth', user.id, 'User updated their password');
  res.json({ success: true, message: 'Password updated successfully' });
});

app.get('/api/auth/users', requireAuth, requireRole(['OWNER', 'ADMIN']), async (_req, res) => {
  const db = await getDatabase();
  const sanitized = db.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    created_at: u.created_at,
  }));
  res.json(sanitized);
});

app.post('/api/auth/create-user', requireAuth, requireRole(['OWNER']), async (req: AuthRequest, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const db = await getDatabase();
  if (db.users.some(u => u.email.toLowerCase() === String(email).toLowerCase().trim())) {
    res.status(400).json({ error: 'A user with this email already exists' });
    return;
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    role: role as UserRole,
    created_at: new Date().toISOString(),
    salt,
    password_hash: hashPassword(password, salt),
  };

  db.users.push(newUser);
  await saveDatabase();
  await logActivity(req.user!.name, req.user!.email, 'create', 'user', newUser.id, `Created new team user ${newUser.email} with role ${newUser.role}`);

  res.status(201).json({
    success: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, created_at: newUser.created_at }
  });
});

// ====================================================================
// ADMIN METRICS
// ====================================================================

app.get('/api/admin/metrics', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const enquiriesToday = db.enquiries.filter(e => new Date(e.created_at).getTime() >= startOfToday).length;
  const unansweredEnquiries = db.enquiries.filter(e => e.status === 'new').length;
  const activeProjects = db.projects.filter(p => !['completed', 'cancelled'].includes(p.status)).length;
  const completedProjects = db.projects.filter(p => p.status === 'completed').length;
  const totalCustomers = db.customers.length;
  const publishedProducts = db.products.filter(p => p.is_published).length;
  const activeOffers = db.offers.filter(o => o.is_published && !o.is_archived && new Date(o.start_date) <= now && new Date(o.expiry_date) >= now).length;
  const scheduledUpdates = db.scheduled_updates.filter(s => s.status === 'pending').length;

  res.json({
    enquiriesToday,
    unansweredEnquiries,
    activeProjects,
    completedProjects,
    totalCustomers,
    publishedProducts,
    activeOffers,
    scheduledUpdates,
    totalEnquiries: db.enquiries.length,
    totalServices: db.services.length,
  });
});

// ====================================================================
// ENQUIRIES CRUD
// ====================================================================

app.get('/api/admin/enquiries', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.enquiries);
});

app.put('/api/admin/enquiries/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, internal_notes } = req.body;
  const db = await getDatabase();
  const enquiry = db.enquiries.find(e => e.id === id);
  if (!enquiry) {
    res.status(404).json({ error: 'Enquiry not found' });
    return;
  }

  const oldStatus = enquiry.status;
  if (status) enquiry.status = status;
  if (internal_notes !== undefined) enquiry.internal_notes = internal_notes;
  enquiry.updated_at = new Date().toISOString();

  await logActivity(
    req.user!.name,
    req.user!.email,
    'update',
    'enquiry',
    enquiry.id,
    `Updated enquiry ${enquiry.ref_code} status: ${oldStatus} → ${enquiry.status}`
  );
  await saveDatabase();
  res.json(enquiry);
});

app.delete('/api/admin/enquiries/:id', requireAuth, requireRole(['OWNER', 'ADMIN']), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const index = db.enquiries.findIndex(e => e.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Enquiry not found' });
    return;
  }
  const removed = db.enquiries.splice(index, 1)[0];
  await logActivity(req.user!.name, req.user!.email, 'delete', 'enquiry', id, `Deleted enquiry ${removed.ref_code}`);
  await saveDatabase();
  res.json({ success: true });
});

// ====================================================================
// CUSTOMERS & PROJECTS CRUD
// ====================================================================

app.get('/api/admin/customers', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.customers);
});

app.post('/api/admin/customers', requireAuth, async (req: AuthRequest, res) => {
  const { name, business_name, email, phone, category, address } = req.body;
  if (!name || !business_name || !category) {
    res.status(400).json({ error: 'Name, business name and category are required' });
    return;
  }
  const db = await getDatabase();
  const newCust: Customer = {
    id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: String(name).trim(),
    business_name: String(business_name).trim(),
    email: email ? String(email).trim() : undefined,
    phone: phone ? String(phone).trim() : undefined,
    category: String(category).trim(),
    address: address ? String(address).trim() : undefined,
    created_at: new Date().toISOString(),
  };
  db.customers.push(newCust);
  await logActivity(req.user!.name, req.user!.email, 'create', 'customer', newCust.id, `Created customer record for ${newCust.business_name}`);
  await saveDatabase();
  res.status(201).json(newCust);
});

app.get('/api/admin/projects', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.projects);
});

app.post('/api/admin/projects', requireAuth, async (req: AuthRequest, res) => {
  const { 
    title, customer_name, business_name, business_category, 
    scope_of_work, agreed_price, status, start_date, target_completion_date, 
    milestones, internal_notes, customer_visible_updates, deliverable_links, 
    cover_image, is_portfolio_published, portfolio_description, services_delivered 
  } = req.body;

  if (!title || !customer_name || !business_name) {
    res.status(400).json({ error: 'Title, customer name and business name are required' });
    return;
  }

  const db = await getDatabase();
  const newProject: Project = {
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: String(title).trim(),
    customer_name: String(customer_name).trim(),
    business_name: String(business_name).trim(),
    business_category: String(business_category || 'General').trim(),
    scope_of_work: String(scope_of_work || '').trim(),
    agreed_price: Number(agreed_price) || 0,
    status: status || 'discussion',
    start_date: start_date || new Date().toISOString().split('T')[0],
    target_completion_date: target_completion_date || '',
    milestones: milestones || [],
    internal_notes: internal_notes || '',
    customer_visible_updates: customer_visible_updates || [],
    deliverable_links: deliverable_links || [],
    cover_image: cover_image || '',
    is_portfolio_published: Boolean(is_portfolio_published),
    portfolio_description: portfolio_description || '',
    services_delivered: services_delivered || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.projects.unshift(newProject);
  await logActivity(req.user!.name, req.user!.email, 'create', 'project', newProject.id, `Created project "${newProject.title}" for ${newProject.business_name}`);
  await saveDatabase();
  res.status(201).json(newProject);
});

app.put('/api/admin/projects/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const project = db.projects.find(p => p.id === id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  Object.assign(project, req.body, { updated_at: new Date().toISOString() });
  await logActivity(req.user!.name, req.user!.email, 'update', 'project', project.id, `Updated project "${project.title}" (Status: ${project.status})`);
  await saveDatabase();
  res.json(project);
});

app.delete('/api/admin/projects/:id', requireAuth, requireRole(['OWNER', 'ADMIN']), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const index = db.projects.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  const removed = db.projects.splice(index, 1)[0];
  await logActivity(req.user!.name, req.user!.email, 'delete', 'project', id, `Deleted project "${removed.title}"`);
  await saveDatabase();
  res.json({ success: true });
});

// ====================================================================
// SERVICES & PRICING CRUD
// ====================================================================

app.get('/api/admin/services', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.services);
});

app.post('/api/admin/services', requireAuth, async (req: AuthRequest, res) => {
  const { title, short_description, detailed_description, icon_name, starting_price, price_label, inclusions, exclusions, is_published } = req.body;
  if (!title || !short_description) {
    res.status(400).json({ error: 'Title and short description are required' });
    return;
  }

  const db = await getDatabase();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newService: ServiceItem = {
    id: `srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: String(title).trim(),
    slug,
    short_description: String(short_description).trim(),
    detailed_description: String(detailed_description || short_description).trim(),
    icon_name: icon_name || 'Globe',
    starting_price: Number(starting_price) || 999,
    price_label: price_label || `From ₹${starting_price || 999}`,
    inclusions: inclusions || [],
    exclusions: exclusions || [],
    is_published: is_published !== false,
    order_index: db.services.length + 1,
  };

  db.services.push(newService);
  await logActivity(req.user!.name, req.user!.email, 'create', 'service', newService.id, `Created service "${newService.title}"`);
  await saveDatabase();
  res.status(201).json(newService);
});

app.put('/api/admin/services/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const service = db.services.find(s => s.id === id);
  if (!service) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  Object.assign(service, req.body);
  await logActivity(req.user!.name, req.user!.email, 'update', 'service', service.id, `Updated service "${service.title}"`);
  await saveDatabase();
  res.json(service);
});

app.delete('/api/admin/services/:id', requireAuth, requireRole(['OWNER', 'ADMIN']), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const index = db.services.findIndex(s => s.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }
  const removed = db.services.splice(index, 1)[0];
  await logActivity(req.user!.name, req.user!.email, 'delete', 'service', id, `Deleted service "${removed.title}"`);
  await saveDatabase();
  res.json({ success: true });
});

// Pricing Plans
app.get('/api/admin/pricing', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.pricing_plans);
});

app.post('/api/admin/pricing', requireAuth, async (req: AuthRequest, res) => {
  const { name, badge, price_inr, billing_interval, subtitle, inclusions, exclusions, is_popular, is_published } = req.body;
  if (!name || price_inr === undefined) {
    res.status(400).json({ error: 'Name and price are required' });
    return;
  }

  const db = await getDatabase();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newPlan: PricingPlan = {
    id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: String(name).trim(),
    slug,
    badge: badge || undefined,
    price_inr: Number(price_inr),
    billing_interval: billing_interval || 'one_time',
    subtitle: subtitle || '',
    inclusions: inclusions || [],
    exclusions: exclusions || [],
    is_popular: Boolean(is_popular),
    is_published: is_published !== false,
    order_index: db.pricing_plans.length + 1,
  };

  db.pricing_plans.push(newPlan);
  await logActivity(req.user!.name, req.user!.email, 'create', 'pricing', newPlan.id, `Created pricing plan "${newPlan.name}" (₹${newPlan.price_inr})`);
  await saveDatabase();
  res.status(201).json(newPlan);
});

app.put('/api/admin/pricing/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const plan = db.pricing_plans.find(p => p.id === id);
  if (!plan) {
    res.status(404).json({ error: 'Pricing plan not found' });
    return;
  }

  const oldPrice = plan.price_inr;
  Object.assign(plan, req.body);
  await logActivity(
    req.user!.name,
    req.user!.email,
    'update',
    'pricing',
    plan.id,
    `Updated pricing package "${plan.name}" (Price: ₹${oldPrice} → ₹${plan.price_inr})`
  );
  await saveDatabase();
  res.json(plan);
});

// ====================================================================
// PRODUCTS & DAILY LIVE PRICE MANAGEMENT
// ====================================================================

app.get('/api/admin/products', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.products);
});

app.post('/api/admin/products', requireAuth, async (req: AuthRequest, res) => {
  const { name, description, price_inr, original_price_inr, category, image_url, is_available, is_featured, is_published } = req.body;
  if (!name || price_inr === undefined || price_inr < 0) {
    res.status(400).json({ error: 'Valid product name and non-negative price are required' });
    return;
  }

  const db = await getDatabase();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newProduct: Product = {
    id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: String(name).trim(),
    slug,
    description: String(description || '').trim(),
    price_inr: Number(price_inr),
    original_price_inr: original_price_inr ? Number(original_price_inr) : undefined,
    category: category || 'General',
    image_url: image_url || '/src/assets/images/hero_dashboard_showcase_1792331163505.jpg',
    is_available: is_available !== false,
    is_featured: Boolean(is_featured),
    is_published: is_published !== false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_editor: req.user!.email,
  };

  db.products.unshift(newProduct);
  await logActivity(req.user!.name, req.user!.email, 'create', 'product', newProduct.id, `Created product "${newProduct.name}" at ₹${newProduct.price_inr}`);
  await saveDatabase();
  res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const product = db.products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  if (req.body.price_inr !== undefined && req.body.price_inr < 0) {
    res.status(400).json({ error: 'Price must be non-negative' });
    return;
  }

  Object.assign(product, req.body, { 
    updated_at: new Date().toISOString(), 
    last_editor: req.user!.email 
  });

  await logActivity(req.user!.name, req.user!.email, 'update', 'product', product.id, `Updated product details for "${product.name}"`);
  await saveDatabase();
  res.json(product);
});

// Dedicated Daily Price Update Endpoint (Publish Now OR Schedule)
app.post('/api/admin/products/:id/price-update', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { new_price, reason, effective_date, schedule_for } = req.body;

  if (new_price === undefined || Number(new_price) < 0) {
    res.status(400).json({ error: 'A valid non-negative price is required' });
    return;
  }

  const db = await getDatabase();
  const product = db.products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const oldPrice = product.price_inr;
  const targetPrice = Number(new_price);
  const now = new Date();

  // If scheduling for future
  if (schedule_for && new Date(schedule_for) > now) {
    const scheduledJob: ScheduledUpdate = {
      id: `sch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      entity_type: 'price',
      entity_id: product.id,
      scheduled_time: new Date(schedule_for).toISOString(),
      payload: {
        new_price: targetPrice,
        reason: reason || 'Scheduled price revision',
      },
      status: 'pending',
      created_by: req.user!.email,
      created_at: now.toISOString(),
    };

    db.scheduled_updates.push(scheduledJob);
    await logActivity(
      req.user!.name,
      req.user!.email,
      'schedule',
      'product',
      product.id,
      `Scheduled price update for "${product.name}": ₹${oldPrice} → ₹${targetPrice} at ${new Date(schedule_for).toLocaleString()}`
    );
    await saveDatabase();
    res.json({ success: true, scheduled: true, job: scheduledJob });
    return;
  }

  // Immediate publication
  product.price_inr = targetPrice;
  product.updated_at = now.toISOString();
  product.last_editor = req.user!.email;

  const historyRecord: PriceHistoryRecord = {
    id: `ph_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    product_id: product.id,
    product_name: product.name,
    old_price: oldPrice,
    new_price: targetPrice,
    reason: reason || 'Live daily price update',
    effective_date: effective_date ? new Date(effective_date).toISOString() : now.toISOString(),
    updated_by: req.user!.email,
    created_at: now.toISOString(),
  };

  db.price_history.unshift(historyRecord);
  await logActivity(
    req.user!.name,
    req.user!.email,
    'price_change',
    'product',
    product.id,
    `Live price update for "${product.name}": ₹${oldPrice} → ₹${targetPrice}`,
    { price_inr: oldPrice },
    { price_inr: targetPrice, reason }
  );

  await saveDatabase();
  res.json({ success: true, product, history: historyRecord });
});

app.get('/api/admin/price-history', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.price_history);
});

// ====================================================================
// OFFERS & ANNOUNCEMENTS
// ====================================================================

app.get('/api/admin/offers', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.offers);
});

app.post('/api/admin/offers', requireAuth, async (req: AuthRequest, res) => {
  const { title, description, discount_badge, image_url, start_date, expiry_date, is_published } = req.body;
  if (!title || !description || !start_date || !expiry_date) {
    res.status(400).json({ error: 'Title, description, start date and expiry date are required' });
    return;
  }

  const db = await getDatabase();
  const newOffer: Offer = {
    id: `off_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: String(title).trim(),
    description: String(description).trim(),
    discount_badge: discount_badge || undefined,
    image_url: image_url || undefined,
    start_date: new Date(start_date).toISOString(),
    expiry_date: new Date(expiry_date).toISOString(),
    is_published: Boolean(is_published),
    is_archived: false,
    created_at: new Date().toISOString(),
  };

  db.offers.unshift(newOffer);
  await logActivity(req.user!.name, req.user!.email, 'create', 'offer', newOffer.id, `Created offer "${newOffer.title}" (Published: ${newOffer.is_published})`);
  await saveDatabase();
  res.status(201).json(newOffer);
});

app.put('/api/admin/offers/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const offer = db.offers.find(o => o.id === id);
  if (!offer) {
    res.status(404).json({ error: 'Offer not found' });
    return;
  }

  Object.assign(offer, req.body);
  await logActivity(req.user!.name, req.user!.email, 'update', 'offer', offer.id, `Updated offer "${offer.title}"`);
  await saveDatabase();
  res.json(offer);
});

app.delete('/api/admin/offers/:id', requireAuth, requireRole(['OWNER', 'ADMIN']), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const index = db.offers.findIndex(o => o.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Offer not found' });
    return;
  }
  const removed = db.offers.splice(index, 1)[0];
  await logActivity(req.user!.name, req.user!.email, 'delete', 'offer', id, `Deleted offer "${removed.title}"`);
  await saveDatabase();
  res.json({ success: true });
});

// ====================================================================
// HOMEPAGE & SITE CONTENT CMS
// ====================================================================

app.get('/api/admin/site-content', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.site_content);
});

app.put('/api/admin/site-content', requireAuth, async (req: AuthRequest, res) => {
  const db = await getDatabase();
  const oldContent = { ...db.site_content };
  Object.assign(db.site_content, req.body, {
    updated_at: new Date().toISOString(),
    last_editor: req.user!.email,
  });

  await logActivity(
    req.user!.name,
    req.user!.email,
    'update',
    'site_content',
    '1',
    'Updated live homepage content & business information',
    oldContent,
    db.site_content
  );
  await saveDatabase();
  res.json(db.site_content);
});

// ====================================================================
// SCHEDULED UPDATES QUEUE
// ====================================================================

app.get('/api/admin/scheduled-updates', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.scheduled_updates);
});

app.delete('/api/admin/scheduled-updates/:id/cancel', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const job = db.scheduled_updates.find(s => s.id === id);
  if (!job) {
    res.status(404).json({ error: 'Scheduled job not found' });
    return;
  }
  job.status = 'cancelled';
  await logActivity(req.user!.name, req.user!.email, 'update', 'scheduled_update', id, `Cancelled scheduled job ${id}`);
  await saveDatabase();
  res.json({ success: true, job });
});

app.post('/api/admin/scheduled-updates/:id/execute-now', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const job = db.scheduled_updates.find(s => s.id === id);
  if (!job) {
    res.status(404).json({ error: 'Scheduled job not found' });
    return;
  }
  // Force time to now so scheduler or immediate execution picks it up
  job.scheduled_time = new Date(Date.now() - 1000).toISOString();
  await saveDatabase();
  res.json({ success: true, message: 'Job queued for immediate execution' });
});

// ====================================================================
// ACTIVITY AUDIT LOGS & MEDIA LIBRARY
// ====================================================================

app.get('/api/admin/activity-logs', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.activity_logs);
});

app.get('/api/admin/media', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.media_items);
});

app.post('/api/admin/media', requireAuth, async (req: AuthRequest, res) => {
  const { title, url, file_size_kb, mime_type } = req.body;
  if (!title || !url) {
    res.status(400).json({ error: 'Title and URL are required' });
    return;
  }
  const db = await getDatabase();
  const newItem = {
    id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: String(title).trim(),
    url: String(url).trim(),
    file_size_kb: Number(file_size_kb) || 120,
    mime_type: mime_type || 'image/jpeg',
    uploaded_at: new Date().toISOString(),
  };
  db.media_items.unshift(newItem);
  await logActivity(req.user!.name, req.user!.email, 'create', 'media', newItem.id, `Uploaded media reference "${newItem.title}"`);
  await saveDatabase();
  res.status(201).json(newItem);
});

app.delete('/api/admin/media/:id', requireAuth, requireRole(['OWNER', 'ADMIN']), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  const index = db.media_items.findIndex(m => m.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Media not found' });
    return;
  }
  const removed = db.media_items.splice(index, 1)[0];
  await logActivity(req.user!.name, req.user!.email, 'delete', 'media', id, `Removed media reference "${removed.title}"`);
  await saveDatabase();
  res.json({ success: true });
});

// ====================================================================
// TESTIMONIALS & REVIEWS CRUD
// ====================================================================

app.get('/api/admin/testimonials', requireAuth, async (_req, res) => {
  const db = await getDatabase();
  res.json(db.testimonials || []);
});

app.post('/api/admin/testimonials', requireAuth, async (req: AuthRequest, res) => {
  const { client_name, business_name, business_category, location, rating, feedback_text, concrete_outcome, avatar_url, is_published } = req.body;
  if (!client_name || !business_name || !feedback_text) {
    res.status(400).json({ error: 'Client name, business name and feedback text are required' });
    return;
  }

  const db = await getDatabase();
  if (!db.testimonials) db.testimonials = [];

  const newTestimonial: Testimonial = {
    id: `testi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    client_name: String(client_name).trim(),
    business_name: String(business_name).trim(),
    business_category: String(business_category || 'Retail').trim(),
    location: location ? String(location).trim() : undefined,
    rating: Number(rating) || 5.0,
    feedback_text: String(feedback_text).trim(),
    concrete_outcome: String(concrete_outcome || 'Verified Merchant Feedback').trim(),
    avatar_url: avatar_url || '',
    is_published: is_published !== false,
    created_at: new Date().toISOString(),
  };

  db.testimonials.unshift(newTestimonial);
  await logActivity(req.user!.name, req.user!.email, 'create', 'testimonial', newTestimonial.id, `Created testimonial for "${newTestimonial.business_name}" (${newTestimonial.client_name})`);
  await saveDatabase();
  res.status(201).json(newTestimonial);
});

app.put('/api/admin/testimonials/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  if (!db.testimonials) db.testimonials = [];
  const testimonial = db.testimonials.find(t => t.id === id);
  if (!testimonial) {
    res.status(404).json({ error: 'Testimonial not found' });
    return;
  }

  Object.assign(testimonial, req.body);
  await logActivity(req.user!.name, req.user!.email, 'update', 'testimonial', id, `Updated testimonial for "${testimonial.business_name}"`);
  await saveDatabase();
  res.json(testimonial);
});

app.delete('/api/admin/testimonials/:id', requireAuth, requireRole(['OWNER', 'ADMIN']), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const db = await getDatabase();
  if (!db.testimonials) db.testimonials = [];
  const index = db.testimonials.findIndex(t => t.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Testimonial not found' });
    return;
  }
  const removed = db.testimonials.splice(index, 1)[0];
  await logActivity(req.user!.name, req.user!.email, 'delete', 'testimonial', id, `Deleted testimonial for "${removed.business_name}"`);
  await saveDatabase();
  res.json({ success: true });
});

// Optional AI proposal/description draft helper
app.post('/api/admin/ai/draft', requireAuth, async (req, res) => {
  const { type, business_name, category, details } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Graceful fallback templates when API key is not configured
    let template = '';
    if (type === 'proposal') {
      template = `Digital Solution Proposal for ${business_name || 'Your Business'}\n\n1. Executive Summary\nLaunch a mobile-first digital storefront with WhatsApp ordering and branded counter QR code standees.\n\n2. Scope of Delivery\n- Fast responsive 1-page website with Google Maps integration\n- Categorized digital item catalog\n- WhatsApp direct order template\n- Print-ready QR code standee layout\n\n3. Deliverable Timeline\nHandover within 3-5 business days from content receipt.\n\n4. Investment\nStarter package: ₹999 introductory price. (Host & ongoing updates included in Care plan).`;
    } else if (type === 'product_desc') {
      template = `Crafted with premium natural ingredients, this artisanal ${category || 'product'} combines authentic tradition with modern aesthetic quality. Perfect for daily use or thoughtful gifting.`;
    } else {
      template = `Special Festival Offer: Get up to 25% OFF our digital presence packages this month. Launch your store catalog online and connect with local neighborhood buyers directly via WhatsApp.`;
    }
    res.json({ draft: template, ai_generated: false, note: 'Generated using pre-configured local business templates. (Connect GEMINI_API_KEY to enable live AI drafting).' });
    return;
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a professional business advisor for MINDMESH, an agency that helps local small businesses in India (shops, salons, bakeries, tutors) go digital.
Draft a professional, concise, practical ${type} for a client named "${business_name || 'Local Business'}" in the "${category || 'Retail'}" sector.
Details: ${details || 'Launch website and digital catalog with WhatsApp ordering'}.
Keep tone approachable, trustworthy, and realistic for a small business owner. Do not use hyperbolic buzzwords.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    res.json({ draft: response.text, ai_generated: true });
  } catch (err) {
    console.error('AI draft error:', err);
    res.status(500).json({ error: 'Failed to generate AI draft' });
  }
});

// ====================================================================
// VITE DEV MIDDLEWARE / STATIC ASSETS
// ====================================================================

async function startServer() {
  // Start background scheduler
  startSchedulerDaemon(10000);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MINDMESH Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[MINDMESH Server] Fatal startup error:', err);
  process.exit(1);
});
