# Hospitality India: Multi-Tenant Hotel & Lodge Website Platform
### Production-Grade Template for Small Hotels, Havelis & Lodges in India (₹249/Month SaaS Plan)

A high-performance, mobile-first website template engineered to convert budget travelers and pilgrims directly via **WhatsApp** and **phone calls**, with zero commissions. Powered by **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL + Auth + Storage)** with strict multi-tenant Row Level Security (RLS).

---

## 🌟 Key Features

### Public Website
- **Mobile-First & Ultra-Responsive**: Pixel-perfect from 320px (budget Android phones) to 1920px (high-res desktops).
- **1-Tap WhatsApp Booking**: Floating action button on every page and per-room booking triggers with prefilled encoded messages (`wa.me`).
- **Sticky Mobile Bottom Bar**: Instant access to Call, WhatsApp, and Google Maps directions on mobile screens.
- **Hero Section**: Single `h1` optimized for Local SEO, tagline, trust badges, and preloaded LCP hero image.
- **Rooms & Live Tariffs**: Display rates in Indian Rupees (₹) with capacity, bed specs, amenities pills, and availability badges.
- **Accessible Photo Gallery**: Responsive grid with client-side modal lightbox (keyboard accessible: Escape, Left/Right arrows, focus trap).
- **Verified Google Maps Embed**: Sanitized lazy-loaded iframe starting strictly with `https://www.google.com/maps/embed`.
- **Local SEO & Structured Data**: Built-in JSON-LD for `Hotel` / `LodgingBusiness` and `FAQPage`, automated `sitemap.xml`, and `robots.txt`.
- **Dark Mode Support**: Respects system preference with manual toggle and zero flicker.

### Owner Admin Panel (`/admin`)
- **Non-Technical Dashboard**: Simple forms with optional Hindi helper labels (e.g., *होटल का नाम*, *व्हाट्सएप नंबर*).
- **Rooms Management**: Add, edit pricing, toggle availability (*Available* vs *Sold Out*), and delete rooms.
- **Client-Side Image Optimization**: Multi-file drag-and-drop uploader that automatically downscales images to max 1600px WebP (~300KB) and strips EXIF/GPS metadata via HTML5 canvas before uploading.
- **Hero Image Selector**: Set any photo as the homepage hero image with one click.
- **Live Preview**: "View Live Site" button opens the public site in a new tab.
- **Security**: Idle session timeout (15 mins with warning toast), rate-limited login, and strict Row Level Security.

---

## 🚀 "New Client in 15 Minutes" Onboarding Checklist

Follow this streamlined guide to onboard a new lodge under the ₹249/month plan in under 15 minutes:

### Step 1: Database Setup (1-time per Supabase Project)
1. In your Supabase SQL Editor, run `supabase/migrations/20240101000000_initial_schema.sql`.
2. This creates all tables (`sites`, `site_admins`, `hotel_profiles`, `rooms`, `photos`, `amenities`, `faqs`), RLS policies, and the `hotel-assets` storage bucket.

### Step 2: Register New Tenant & Admin
Run this query in Supabase SQL editor:
```sql
-- 1. Create Tenant Record
INSERT INTO public.sites (id, name, domain)
VALUES ('shanti-nivas-jaipur', 'Shanti Nivas Heritage Lodge', 'shantinivasheritage.com');

-- 2. Create Auth User for Hotel Owner (or invite via Supabase Auth dashboard)
-- Note down the returned auth.users.id (UUID)
-- Example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

-- 3. Map Owner Auth User to Tenant
INSERT INTO public.site_admins (user_id, site_id, role)
VALUES ('YOUR_USER_UUID', 'shanti-nivas-jaipur', 'owner');
```

### Step 3: Populate Initial Seed Data (Optional)
Run `supabase/seed.sql` to instantly seed the demo hotel profile, rooms, photos, amenities, and FAQs.

### Step 4: Deploy to Vercel
1. Push this repository to GitHub or click **Deploy with Vercel**.
2. Set the following environment variables in Vercel:
   - `SITE_ID`: `shanti-nivas-jaipur` (matches `sites.id`)
   - `NEXT_PUBLIC_SITE_URL`: `https://shantinivasheritage.com`
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOi...`
3. Click **Deploy**.

### Step 5: Connect Custom Domain
1. In Vercel Project Settings &rarr; **Domains**, add `shantinivasheritage.com` and `www.shantinivasheritage.com`.
2. Add the recommended A/CNAME records in the client's DNS registrar (GoDaddy, BigRock, Cloudflare).
3. Vercel provisions free SSL certificates automatically within 5 minutes.

---

## 🛠 Local Development & Testing

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Setup
```bash
# 1. Clone repository
git clone https://github.com/your-org/hotel-lodge-template.git
cd hotel-lodge-template

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start local development server
npm run dev
# Visit http://localhost:3000
```

### Running Automated Test Suite
```bash
# Run Vitest unit tests (validation, URL builders, magic bytes)
npm test

# Run Playwright end-to-end tests
npx playwright test
```

---

## 🔒 Security Summary
- **Multi-Tenant RLS**: Cross-tenant data leaks and IDOR attacks are blocked at the PostgreSQL engine level.
- **Strict CSP & Headers**: Content Security Policy, HSTS (`max-age=63072000`), X-Frame-Options (`SAMEORIGIN`), and X-Content-Type-Options (`nosniff`).
- **Privacy Protection**: EXIF/GPS coordinates stripped from photos on the client before upload.
- **Rate-Limited Login**: 5 attempts per 15 minutes before lockout to thwart brute-force password guessing.
- Full threat model details available in `SECURITY.md`.
