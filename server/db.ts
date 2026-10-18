import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import type { 
  User, Enquiry, Customer, Project, ServiceItem, PricingPlan, 
  Product, Offer, SiteContent, PriceHistoryRecord, ScheduledUpdate, 
  ActivityLog, MediaItem, Testimonial 
} from '../src/types/index.ts';

export interface DatabaseSchema {
  users: Array<User & { password_hash: string; salt: string }>;
  enquiries: Enquiry[];
  customers: Customer[];
  projects: Project[];
  services: ServiceItem[];
  pricing_plans: PricingPlan[];
  products: Product[];
  offers: Offer[];
  site_content: SiteContent;
  price_history: PriceHistoryRecord[];
  scheduled_updates: ScheduledUpdate[];
  activity_logs: ActivityLog[];
  media_items: MediaItem[];
  testimonials: Testimonial[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function generateToken(userId: string, role: string): string {
  const payload = JSON.stringify({ userId, role, ts: Date.now() });
  const hmac = crypto.createHmac('sha256', process.env.APP_SECRET || 'mindmesh-secure-seed-key-2026');
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return null;
    const payload = Buffer.from(payloadB64, 'base64').toString('utf-8');
    const hmac = crypto.createHmac('sha256', process.env.APP_SECRET || 'mindmesh-secure-seed-key-2026');
    hmac.update(payload);
    const expected = hmac.digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return JSON.parse(payload);
    }
    return null;
  } catch {
    return null;
  }
}

function getInitialDatabase(): DatabaseSchema {
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const editorSalt = crypto.randomBytes(16).toString('hex');

  const now = new Date().toISOString();
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  return {
    users: [
      {
        id: 'usr_admin_01',
        email: 'admin@mindmesh.in',
        name: 'MINDMESH Founder',
        role: 'OWNER',
        created_at: now,
        salt: adminSalt,
        password_hash: hashPassword('MindMesh@2026!', adminSalt),
      },
      {
        id: 'usr_editor_01',
        email: 'editor@mindmesh.in',
        name: 'Content Operations',
        role: 'EDITOR',
        created_at: now,
        salt: editorSalt,
        password_hash: hashPassword('Editor@2026!', editorSalt),
      }
    ],
    enquiries: [
      {
        id: 'enq_101',
        ref_code: 'MM-2026-1049',
        name: 'Rajesh Sharma',
        business_name: 'Sharma Sweets & Dry Fruits',
        email: 'contact@sharmasweets.local',
        phone: '+91 98450 12345',
        business_category: 'Retail & Food',
        requested_service: 'Digital Catalogs & WhatsApp Enquiry',
        problem_description: 'We get 40+ phone calls during festive seasons asking for sweet box prices. We need a digital menu link with WhatsApp order button and QR stand.',
        budget_range: '₹1,000 – ₹2,500',
        desired_completion_date: '2026-11-01',
        preferred_contact_method: 'whatsapp',
        consent_given: true,
        status: 'proposal_sent',
        internal_notes: 'Sent starter draft catalog with 15 mithai items. Follow up scheduled via WhatsApp tomorrow morning.',
        created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        updated_at: now,
      },
      {
        id: 'enq_102',
        ref_code: 'MM-2026-1082',
        name: 'Priya Nair',
        business_name: 'Aura Unisex Salon',
        email: 'priya@aurasalon.local',
        phone: '+91 98110 56789',
        business_category: 'Salons & Wellness',
        requested_service: 'Website Creation & QR Menu',
        problem_description: 'Need a modern pricing rate card for hair, skin, and bridal treatments so customers can view before coming in.',
        budget_range: '₹2,000 – ₹5,000',
        desired_completion_date: '2026-10-28',
        preferred_contact_method: 'phone',
        consent_given: true,
        status: 'new',
        internal_notes: 'New enquiry received from website contact form.',
        created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        updated_at: now,
      }
    ],
    customers: [
      {
        id: 'cust_01',
        name: 'Kavita Menon',
        business_name: 'The Rowen Apparel',
        email: 'kavita@therowen.example',
        phone: '+91 98200 44321',
        category: 'Clothing Store',
        address: '12th Main Road, Indiranagar, Bengaluru',
        created_at: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'cust_02',
        name: 'Arun Patel',
        business_name: 'Artisan Hearth Bistro',
        email: 'arun@artisanhearth.example',
        phone: '+91 98900 11223',
        category: 'Cafe & Restaurant',
        address: 'Koramangala 4th Block, Bengaluru',
        created_at: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
      }
    ],
    projects: [
      {
        id: 'proj_01',
        customer_id: 'cust_01',
        customer_name: 'Kavita Menon',
        business_name: 'The Rowen Apparel & Boutique',
        business_category: 'Clothing Store',
        title: 'Boutique Showcase Website & WhatsApp Catalog',
        scope_of_work: 'One-page aesthetic storefront, 20-product lookbook, instant WhatsApp product enquiry button, Instagram sync link, and Google Business profile QR sticker design.',
        agreed_price: 1999,
        status: 'completed',
        start_date: '2026-08-10',
        target_completion_date: '2026-08-15',
        milestones: [
          { id: 'm1', title: 'Content & Lookbook Photos Collected', completed: true },
          { id: 'm2', title: 'Catalog UI & WhatsApp Integration Built', completed: true },
          { id: 'm3', title: 'QR Code Tested & Storefront Handover', completed: true }
        ],
        internal_notes: 'Owner is very happy with the responsive layout. Retained on monthly Care plan for seasonal catalogue updates.',
        customer_visible_updates: [
          'Website live and verified on all mobile screens',
          'QR code poster delivered for shop cash counter',
          'Automated WhatsApp enquiry template active'
        ],
        deliverable_links: [
          'https://therowen-demo.mindmesh.in',
          'https://mindmesh.in/qr/the-rowen'
        ],
        cover_image: '/src/assets/images/project_retail_boutique_1792331164565.jpg',
        is_portfolio_published: true,
        portfolio_description: 'Modern minimalist storefront for a premium city apparel boutique. Customers scan counter QR cards to view newly arrived autumn collections and order directly via WhatsApp.',
        services_delivered: ['Website Creation', 'WhatsApp Integration', 'QR Code Stands'],
        created_at: new Date(Date.now() - 50 * 24 * 3600 * 1000).toISOString(),
        updated_at: now,
      },
      {
        id: 'proj_02',
        customer_id: 'cust_02',
        customer_name: 'Arun Patel',
        business_name: 'Artisan Hearth Bakery & Bistro',
        business_category: 'Cafe & Restaurant',
        title: 'Contactless Digital Menu & Daily Specials',
        scope_of_work: 'Fast mobile-friendly menu with live price updates for daily baked goods, dietary tags (vegan, eggless), and table QR stickers.',
        agreed_price: 1499,
        status: 'completed',
        start_date: '2026-09-01',
        target_completion_date: '2026-09-05',
        milestones: [
          { id: 'm4', title: 'Menu Categorization & Dietary Tags', completed: true },
          { id: 'm5', title: 'Live Update Portal for Daily Specials', completed: true },
          { id: 'm6', title: 'Table QR Display Standees Handover', completed: true }
        ],
        internal_notes: 'Bistro updates croissant and sourdough prices every Friday using our live updates panel.',
        customer_visible_updates: [
          'Digital menu active with instant loading',
          'Owner trained on updating daily specials in under 2 minutes'
        ],
        deliverable_links: [
          'https://artisanhearth-demo.mindmesh.in'
        ],
        cover_image: '/src/assets/images/project_cafe_bistro_1792331166245.jpg',
        is_portfolio_published: true,
        portfolio_description: 'Interactive contactless dining menu for an artisan sourdough bakery. Enables the owner to change daily bakery prices and specials without reprinting paper cards.',
        services_delivered: ['Digital Menus', 'Daily Price Management', 'QR Codes'],
        created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        updated_at: now,
      },
      {
        id: 'proj_03',
        customer_name: 'Dr. Shruti Sen',
        business_name: 'The Wellness Collective & Studio',
        business_category: 'Salons & Wellness',
        title: 'Spa & Salon Service Menu with Slot Enquiries',
        scope_of_work: 'Clean aesthetic aesthetic service card listing treatments, session durations, package deals, and direct consultation booking via WhatsApp.',
        agreed_price: 1999,
        status: 'completed',
        start_date: '2026-09-20',
        target_completion_date: '2026-09-27',
        milestones: [
          { id: 'm7', title: 'Treatment Tariff Structuring', completed: true },
          { id: 'm8', title: 'Service Gallery & Therapist Bio Integration', completed: true },
          { id: 'm9', title: 'WhatsApp Appointment Router Setup', completed: true }
        ],
        internal_notes: 'Helped salon reduce reception phone congestion by 40%.',
        customer_visible_updates: [
          'Complete treatment portfolio live with pricing clarity',
          'Direct consultation WhatsApp gateway deployed'
        ],
        deliverable_links: [
          'https://wellnesscollective-demo.mindmesh.in'
        ],
        cover_image: '/src/assets/images/project_salon_wellness_1792331165440.jpg',
        is_portfolio_published: true,
        portfolio_description: 'Tranquil digital service catalog and enquiry portal for an urban wellness center, allowing prospective clients to explore therapies and book consults instantly.',
        services_delivered: ['Website Creation', 'WhatsApp Integration', 'Service Rate Cards'],
        created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
        updated_at: now,
      }
    ],
    services: [
      {
        id: 'srv_01',
        title: 'Business Website Creation',
        slug: 'business-website-creation',
        short_description: 'Modern, ultra-fast responsive website built to convert local neighborhood visitors into paying customers.',
        detailed_description: 'We design and launch clean, professional websites tailored for retail shops, clinics, service providers, and salons. Optimized for smartphones, Google search visibility, and instant loading.',
        icon_name: 'Globe',
        starting_price: 999,
        price_label: 'From ₹999 one-time',
        inclusions: [
          'Mobile-first responsive design',
          'About us & core services showcase',
          'Interactive Google Maps embed',
          'Direct WhatsApp chat button',
          'One post-launch refinement round'
        ],
        exclusions: [
          'Domain registration fee (customer provides or ₹800 extra)',
          'Custom e-commerce payment gateway integration'
        ],
        is_published: true,
        order_index: 1,
      },
      {
        id: 'srv_02',
        title: 'Digital Catalogs & Menus',
        slug: 'digital-catalogs-menus',
        short_description: 'Showcase your products, apparel, or restaurant menu online with high-res photos and clear pricing.',
        detailed_description: 'Replace cumbersome PDF files and reprinted paper cards with an interactive digital catalog that loads instantly on any phone without requiring app downloads.',
        icon_name: 'BookOpen',
        starting_price: 799,
        price_label: 'From ₹799 one-time',
        inclusions: [
          'Categorized product or food menu listing',
          'High-resolution image gallery',
          'Price in INR with discount strikethroughs',
          'Click to enquiry on WhatsApp with pre-filled item name'
        ],
        exclusions: [
          'Professional on-site product photography'
        ],
        is_published: true,
        order_index: 2,
      },
      {
        id: 'srv_03',
        title: 'Dynamic QR Code Generation',
        slug: 'qr-code-generation',
        short_description: 'Print-ready QR standee graphics linking directly to your catalog, menu, Google reviews, or WhatsApp.',
        detailed_description: 'High-resolution vector QR graphics formatted for desk stands, billing counters, entrance doors, and packaging with your custom logo and call to action.',
        icon_name: 'QrCode',
        starting_price: 299,
        price_label: 'From ₹299 one-time',
        inclusions: [
          'Custom branded QR code with business logo',
          'Print-ready high-DPI PDF and PNG artwork',
          'Google Review direct trigger configuration',
          'Standee layout template'
        ],
        exclusions: [
          'Physical acrylic stand fabrication and shipping'
        ],
        is_published: true,
        order_index: 3,
      },
      {
        id: 'srv_04',
        title: 'WhatsApp Enquiry & Order System',
        slug: 'whatsapp-enquiry-system',
        short_description: 'Enable customers to send structured inquiries, item lists, and service bookings straight to your WhatsApp.',
        detailed_description: 'When customers tap "Order" or "Enquire", an automated message is created with the product name, requested date, and customer details, so you never lose a sale.',
        icon_name: 'MessageSquare',
        starting_price: 499,
        price_label: 'From ₹499 one-time',
        inclusions: [
          'Pre-filled message template routing',
          'Multi-staff number forwarding option',
          'Automated welcome greeting script guidance',
          'Enquiry tracking spreadsheet setup'
        ],
        exclusions: [
          'WhatsApp Business Cloud API official subscription fees'
        ],
        is_published: true,
        order_index: 4,
      },
      {
        id: 'srv_05',
        title: 'Daily Product & Price Updates',
        slug: 'daily-product-price-updates',
        short_description: 'Keep your inventory, daily bakery specials, or bullion/commodity prices 100% accurate in real time.',
        detailed_description: 'Our proprietary live update system allows business owners to change item rates, add seasonal items, or mark items out-of-stock from their phone in seconds.',
        icon_name: 'TrendingUp',
        starting_price: 299,
        price_label: 'From ₹299 / month',
        inclusions: [
          'Dedicated price management portal',
          'Instant live update without re-deployment',
          'Price audit history and timestamp log',
          'Scheduled price activation for future dates'
        ],
        exclusions: [
          'Manual data entry exceeding 50 items/month'
        ],
        is_published: true,
        order_index: 5,
      },
      {
        id: 'srv_06',
        title: 'Website Care & Maintenance',
        slug: 'website-maintenance',
        short_description: 'Ongoing technical upkeep, monthly link checks, security oversight, and rapid emergency support.',
        detailed_description: 'Never worry about broken links, expired certificates, or outdated business hours. We handle all ongoing web hygiene so you can focus on running your business.',
        icon_name: 'ShieldCheck',
        starting_price: 499,
        price_label: 'From ₹499 / month',
        inclusions: [
          'Up to 3 content updates per month',
          'Monthly uptime & link health checks',
          'Priority support response within 6 hours',
          'Quarterly speed optimization check'
        ],
        exclusions: [
          'Complete brand redesigns or architecture overhauls'
        ],
        is_published: true,
        order_index: 6,
      },
      {
        id: 'srv_07',
        title: 'Digital Promotions & Banners',
        slug: 'digital-promotions',
        short_description: 'Eye-catching seasonal festival banners, discount popups, and festive announcements.',
        detailed_description: 'Launch Diwali, Eid, Christmas, or New Year discount campaigns with custom digital banners, countdown timers, and promo codes on your storefront.',
        icon_name: 'Sparkles',
        starting_price: 399,
        price_label: 'From ₹399 one-time',
        inclusions: [
          'Storefront announcement ribbon design',
          'Start date and auto-expiry scheduling',
          'WhatsApp promotional broadcast copy template'
        ],
        exclusions: [
          'Paid Meta / Google Ads ad spend'
        ],
        is_published: true,
        order_index: 7,
      },
      {
        id: 'srv_08',
        title: 'Custom Digital Solutions',
        slug: 'custom-digital-solutions',
        short_description: 'Tailored digital workflows, consultation booking calendars, or multi-location store locators.',
        detailed_description: 'Have a specific business bottleneck? We build custom web apps, quotation generators, patient intake forms, or bespoke customer portals.',
        icon_name: 'Cpu',
        starting_price: 1999,
        price_label: 'Custom quote (from ₹1,999)',
        inclusions: [
          'Comprehensive requirement discovery call',
          'Custom technical architecture design',
          'Dedicated staging environment review',
          'Staff training session'
        ],
        exclusions: [
          'Third-party cloud infrastructure hosting over free-tier limits'
        ],
        is_published: true,
        order_index: 8,
      }
    ],
    pricing_plans: [
      {
        id: 'plan_starter',
        name: 'STARTER',
        slug: 'starter-plan',
        badge: 'Beginner Friendly',
        price_inr: 999,
        billing_interval: 'one_time',
        subtitle: 'Ideal for local retail shops, stalls, and solo practitioners establishing their first web footprint.',
        inclusions: [
          'One-page mobile-responsive website or catalog',
          'Business location, phone, and operating hours',
          'WhatsApp enquiry link with pre-filled message',
          'Print-ready QR code file for shop counter',
          'One round of revisions before launch',
          'Free hosting setup on reliable global CDN'
        ],
        exclusions: [
          'Custom domain purchase (use free subdomain or add ₹800)',
          'Ongoing monthly maintenance after launch handover'
        ],
        is_popular: false,
        is_published: true,
        order_index: 1,
      },
      {
        id: 'plan_growth',
        name: 'GROWTH',
        slug: 'growth-plan',
        badge: 'Most Popular',
        price_inr: 1999,
        billing_interval: 'one_time',
        subtitle: 'Designed for expanding clothing stores, salons, bakeries, and busy service clinics.',
        inclusions: [
          'Everything in Starter package',
          'Expanded digital catalog (up to 25 items with photos)',
          'Basic customer enquiry tracking system',
          'Google Maps & Google Business profile verification guide',
          'Owner handover guide & video walkthrough',
          'One agreed post-launch content update within 30 days',
          'Social media links & Instagram feed link'
        ],
        exclusions: [
          'Custom domain name renewal fees',
          'Full e-commerce payment gateway integration'
        ],
        is_popular: true,
        is_published: true,
        order_index: 2,
      },
      {
        id: 'plan_care',
        name: 'CARE',
        slug: 'care-plan',
        badge: 'Monthly Peace of Mind',
        price_inr: 299,
        billing_interval: 'monthly',
        subtitle: 'Never worry about stale information, price changes, or broken web links.',
        inclusions: [
          'Up to two small content or price updates per month',
          'Live access to daily price update portal',
          'Routine monthly link, speed, and uptime checks',
          'Priority WhatsApp customer support within 12 hours',
          'Festival and promotional banner updates',
          'No long-term contract; cancel anytime'
        ],
        exclusions: [
          'Major layout redesigns or extra new page additions'
        ],
        is_popular: false,
        is_published: true,
        order_index: 3,
      }
    ],
    products: [
      {
        id: 'prod_01',
        name: 'Handcrafted Brass Filter Coffee Dabara Set',
        slug: 'brass-filter-coffee-dabara',
        description: 'Traditional heavy-gauge pure brass tumbler and dabara set for authentic South Indian filter coffee experience. Food-grade tin lining inside.',
        price_inr: 649,
        original_price_inr: 799,
        category: 'Kitchenware',
        image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_featured: true,
        is_published: true,
        created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
        updated_at: now,
        last_editor: 'admin@mindmesh.in',
      },
      {
        id: 'prod_02',
        name: 'Pure Cotton Handloom Saree (Indigo Block Print)',
        slug: 'cotton-handloom-saree-indigo',
        description: 'Lightweight breathable 100% natural cotton saree with authentic Dabu hand-block indigo geometric motifs. Includes unstitched blouse piece.',
        price_inr: 1899,
        original_price_inr: 2200,
        category: 'Apparel',
        image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_featured: true,
        is_published: true,
        created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
        updated_at: now,
        last_editor: 'admin@mindmesh.in',
      },
      {
        id: 'prod_03',
        name: 'Artisan Sourdough Boule (Country White)',
        slug: 'artisan-sourdough-boule',
        description: 'Naturally fermented 36-hour slow cold fermentation loaf with a crisp blistered crust and open chewy crumb. Baked fresh daily at 7 AM.',
        price_inr: 240,
        original_price_inr: 280,
        category: 'Bakery',
        image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_featured: true,
        is_published: true,
        created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        updated_at: now,
        last_editor: 'editor@mindmesh.in',
      },
      {
        id: 'prod_04',
        name: 'Cold-Pressed Raw Almond Oil (200ml)',
        slug: 'cold-pressed-almond-oil-200ml',
        description: 'Single-origin sweet almonds extracted using wooden ghani mechanism without heat or preservatives. Excellent for skin, hair, and baby massage.',
        price_inr: 490,
        original_price_inr: 550,
        category: 'Wellness',
        image_url: 'https://images.unsplash.com/photo-1608248597359-26d111cbb0b3?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_featured: false,
        is_published: true,
        created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
        updated_at: now,
        last_editor: 'admin@mindmesh.in',
      },
      {
        id: 'prod_05',
        name: 'Handcrafted Ceramic Planter with Saucer',
        slug: 'ceramic-planter-matte-sage',
        description: 'Stoneware pottery planter with drainage hole and detachable saucer in matte sage glaze. Perfect for desk succulents and indoor fiddle leaf figs.',
        price_inr: 520,
        original_price_inr: 590,
        category: 'Home Decor',
        image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        is_featured: false,
        is_published: true,
        created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        updated_at: now,
        last_editor: 'editor@mindmesh.in',
      }
    ],
    offers: [
      {
        id: 'off_01',
        title: 'Local Business Festive Kickstart',
        description: 'Get ₹300 OFF the Growth Plan when you launch your catalog before Diwali. Includes 1 free custom QR standee print layout.',
        discount_badge: 'FLAT ₹300 OFF',
        start_date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        expiry_date: nextMonth,
        is_published: true,
        is_archived: false,
        created_at: now,
      }
    ],
    site_content: {
      hero_headline: 'Your business deserves a smarter online presence.',
      hero_supporting_text: 'MINDMESH helps local businesses launch professional websites, showcase products, receive enquiries, and keep their online information up to date.',
      primary_cta_label: 'Get Started',
      primary_cta_link: '#contact',
      secondary_cta_label: 'Explore Services',
      secondary_cta_link: '#services',
      announcement_banner_active: true,
      announcement_banner_text: 'Introductory Offer: Mobile Website + Digital Catalog + WhatsApp integration starting at just ₹999.',
      announcement_banner_link: '#pricing',
      business_email: 'hello@mindmesh.in',
      business_phone: '+91 98765 43210',
      whatsapp_number: '+919876543210',
      business_hours: 'Monday – Saturday: 9:00 AM – 7:30 PM IST',
      location_address: 'Indiranagar, Bengaluru, Karnataka, India',
      footer_tagline: 'From local problems to digital solutions.',
      updated_at: now,
      last_editor: 'admin@mindmesh.in',
    },
    price_history: [
      {
        id: 'ph_01',
        product_id: 'prod_03',
        product_name: 'Artisan Sourdough Boule (Country White)',
        old_price: 220,
        new_price: 240,
        reason: 'Flour supplier price revision and organic wheat flour batch',
        effective_date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        updated_by: 'editor@mindmesh.in',
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      }
    ],
    scheduled_updates: [],
    activity_logs: [
      {
        id: 'act_01',
        user_name: 'System Bootstrap',
        user_email: 'system@mindmesh.in',
        action_type: 'publish',
        entity_type: 'system',
        entity_id: 'sys_01',
        summary: 'MINDMESH platform database initialized with starter configuration and services',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      },
      {
        id: 'act_02',
        user_name: 'MINDMESH Founder',
        user_email: 'admin@mindmesh.in',
        action_type: 'price_change',
        entity_type: 'product',
        entity_id: 'prod_03',
        summary: 'Updated price of Artisan Sourdough Boule from ₹220 to ₹240',
        timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      }
    ],
    media_items: [
      {
        id: 'med_01',
        title: 'Boutique Storefront Photography',
        url: '/src/assets/images/project_retail_boutique_1792331164565.jpg',
        file_size_kb: 420,
        mime_type: 'image/jpeg',
        uploaded_at: now,
      },
      {
        id: 'med_02',
        title: 'Salon & Wellness Interior',
        url: '/src/assets/images/project_salon_wellness_1792331165440.jpg',
        file_size_kb: 395,
        mime_type: 'image/jpeg',
        uploaded_at: now,
      },
      {
        id: 'med_03',
        title: 'Artisan Bistro Counter',
        url: '/src/assets/images/project_cafe_bistro_1792331166245.jpg',
        file_size_kb: 410,
        mime_type: 'image/jpeg',
        uploaded_at: now,
      }
    ],
    testimonials: [
      {
        id: 'testi_01',
        client_name: 'Kavita Menon',
        business_name: 'The Rowen Apparel & Boutique',
        business_category: 'Clothing Store',
        location: 'Indiranagar, Bengaluru',
        rating: 5.0,
        feedback_text: 'MINDMESH built our entire digital lookbook and cash counter QR stand for just ₹1,999. Walk-in customers scanning the QR card immediately browse our new silk collections on their smartphones and tap to chat. It completely eliminated missed phone calls.',
        concrete_outcome: '40+ qualified WhatsApp inquiries in our first fortnight',
        avatar_url: '',
        is_published: true,
        created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'testi_02',
        client_name: 'Arun Patel',
        business_name: 'Artisan Hearth Bakery & Bistro',
        business_category: 'Bakery & Cafe',
        location: 'Koramangala, Bengaluru',
        rating: 5.0,
        feedback_text: 'Our bakery specials and sourdough batches change every weekend. The Daily Price update portal is a lifesaver—I change today\'s rates from my mobile in under a minute and the table QR codes reflect it instantly with zero reprint cost.',
        concrete_outcome: 'Saved ₹3,000+ monthly on reprinting paper menus',
        avatar_url: '',
        is_published: true,
        created_at: new Date(Date.now() - 22 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'testi_03',
        client_name: 'Dr. Shruti Sen',
        business_name: 'The Wellness Collective & Studio',
        business_category: 'Salons & Wellness',
        location: 'Jayanagar, Bengaluru',
        rating: 4.9,
        feedback_text: 'Clients used to call repeatedly just to ask for treatment prices and massage packages. Having a clear, modern rate card online linked directly to our appointment desk has transformed our front desk workflow.',
        concrete_outcome: 'Cut front-desk phone congestion by over 45%',
        avatar_url: '',
        is_published: true,
        created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'testi_04',
        client_name: 'Rajesh Sharma',
        business_name: 'Sharma Sweets & Dry Fruits',
        business_category: 'Retail & Food',
        location: 'Malleswaram, Bengaluru',
        rating: 5.0,
        feedback_text: 'During festive rushes, our shop is packed and phone lines are constantly busy. MINDMESH set up our digital sweet box catalog with direct WhatsApp ordering in 3 days. Best ₹999 we ever invested in our shop.',
        concrete_outcome: 'Tripled pre-orders for festive gift hampers',
        avatar_url: '',
        is_published: true,
        created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
      }
    ]
  };
}

let dbCache: DatabaseSchema | null = null;
let isSaving = false;
let pendingSave = false;

export async function getDatabase(): Promise<DatabaseSchema> {
  if (dbCache) return dbCache;

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DB_FILE, 'utf-8');
    dbCache = JSON.parse(content);
    // Ensure backwards compatibility if reading existing db file
    if (!dbCache!.testimonials) {
      dbCache!.testimonials = getInitialDatabase().testimonials;
      await saveDatabase();
    }
    return dbCache!;
  } catch {
    // initialize new
    const initial = getInitialDatabase();
    dbCache = initial;
    await saveDatabase();
    return dbCache;
  }
}

export async function saveDatabase(): Promise<void> {
  if (!dbCache) return;

  if (isSaving) {
    pendingSave = true;
    return;
  }

  isSaving = true;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    await fs.writeFile(tempFile, JSON.stringify(dbCache, null, 2), 'utf-8');
    await fs.rename(tempFile, DB_FILE);
  } finally {
    isSaving = false;
    if (pendingSave) {
      pendingSave = false;
      await saveDatabase();
    }
  }
}

export async function logActivity(
  user_name: string,
  user_email: string,
  action_type: ActivityLog['action_type'],
  entity_type: string,
  entity_id: string,
  summary: string,
  old_value?: unknown,
  new_value?: unknown
): Promise<void> {
  const db = await getDatabase();
  const log: ActivityLog = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    user_name,
    user_email,
    action_type,
    entity_type,
    entity_id,
    summary,
    old_value,
    new_value,
    timestamp: new Date().toISOString(),
  };
  db.activity_logs.unshift(log);
  // Keep last 500 logs to maintain fast performance
  if (db.activity_logs.length > 500) {
    db.activity_logs = db.activity_logs.slice(0, 500);
  }
  await saveDatabase();
}
