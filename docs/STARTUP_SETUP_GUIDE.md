# MINDMESH — Founder's Startup & Operations Manual

Welcome to **MINDMESH** (*From local problems to digital solutions*). This manual is written for you and your co-founder to launch, run, and scale this business on a **₹0–₹2,000 INR budget**.

---

## 1. Budget Breakdown (₹0–₹2,000 INR)

| Item | Cost (INR) | Provider | Strategy |
| :--- | :--- | :--- | :--- |
| **Full-Stack Hosting & Frontend** | **₹0** | Vercel / Cloud Run / Netlify | Free tier covers 100k+ visits/month |
| **Backend & Database** | **₹0** | Integrated Server / Supabase Free Tier | 500MB free PostgreSQL + 50,000 monthly active users |
| **Starter Domain (Optional)** | **₹700 – ₹900** | Namecheap / Cloudflare / GoDaddy | Buy `mindmesh.in` or use free subdomains initially |
| **Print QR Sample Acrylic Stands** | **₹400 – ₹600** | Local Print Shop (e.g. Indiranagar market) | 2–3 sample table standees for client demonstrations |
| **Total Starting Capital** | **₹1,100 – ₹1,500 INR** | — | **Leaves ₹500–₹900 buffer in your bank!** |

---

## 2. Initial Administrator Accounts

Your MINDMESH application includes real role-based security:

### Primary Founder / Owner Account:
- **Email:** `admin@mindmesh.in`
- **Password:** `MindMesh@2026!`
- **Role:** `OWNER` (Full access: pricing, services, team management, activity audit logs, database export).

### Operations / Content Editor Account:
- **Email:** `editor@mindmesh.in`
- **Password:** `Editor@2026!`
- **Role:** `EDITOR` (Daily product price updates, catalog additions, enquiry status management).

> **Security Tip:** Immediately after testing, log into `/admin` -> `Settings & Database` -> `Change Your Password` to set your own private master password.

---

## 3. How to Execute Daily Live Price Updates

The **Daily Live Update System** is your biggest competitive differentiator when talking to local shopkeepers:

1. Log into `/admin`.
2. Click **"Daily Price Updates"** in the sidebar.
3. Select the client's product from the dropdown (e.g. *Artisan Sourdough Boule* or *Indigo Block Saree*).
4. Enter the **New Price (₹)**.
5. Enter the **Reason for change** (e.g. *Weekend Festive Promo* or *Supplier Cost Shift*).
6. Choose:
   - **Publish Now:** Updates the live customer storefront immediately without re-deploying code!
   - **Schedule for Later:** Pick a future date/time (e.g. tomorrow at 8:00 AM). The server scheduler daemon will apply it automatically.
7. The previous and new prices are permanently recorded in the **Price Modification History & Audit Trail**.

---

## 4. How to Get Your First 5 Paying Local Clients

Walk into commercial high-streets in your city (retail clothes, sweet shops, salons, bakeries):

1. **Step 1 — The Walk-In Demo:**
   - Open MINDMESH on your mobile phone: Show the **Sample Showcase** and the **Live Digital Catalog**.
   - Show how tapping **"Order on WhatsApp"** creates an instant pre-filled order message with zero commission cuts.
2. **Step 2 — The Math Pitch:**
   - *"Bhaiya, Zomato/Swiggy takes 25% commission on every order. Web designers ask for ₹25,000 upfront. We will set up your mobile website, QR menu for your cash counter, and WhatsApp order button for just ₹999 introductory price."*
3. **Step 3 — Same-Day Execution:**
   - Take 10 photos of their best-selling items on your phone.
   - Enter their business details into the **Enquiry Form** (generates tracking code `MM-2026-XXXX`).
   - Create their products in `/admin` -> `Products & Catalog`.
   - Hand over their counter QR graphic within 48 hours.
4. **Step 4 — Recurring Monthly Revenue:**
   - Offer the **CARE Plan at ₹299/month**. At 15 local shops, you earn **₹4,485 INR every month** in recurring maintenance revenue!

---

## 5. Supabase Production Migration (Optional)

MINDMESH includes an integrated persistent database out of the box in `data/database.json`. If you decide to deploy to an external Supabase PostgreSQL database:

1. Create a free account at [supabase.com](https://supabase.com).
2. Open your Supabase SQL Editor.
3. Copy and run the entire SQL script from `src/db/supabase-schema.sql`.
4. All 12 tables (enquiries, products, services, offers, pricing, activity logs) and Row Level Security (RLS) policies will be created in 1 click!

---

## 6. Local Development & Scripts

```bash
# Start full-stack development server on port 3000
npm run dev

# Lint and verify TypeScript types
npm run lint

# Production build
npm run build
```
