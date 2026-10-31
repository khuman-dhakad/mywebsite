# Security Architecture & OWASP Threat Model
## Multi-Tenant Hospitality Platform (Rs 249/Month Plan)

### 1. Security Architecture Principles
The platform runs on a modern serverless JAMstack architecture leveraging Next.js 15 App Router deployed on Vercel and Supabase (PostgreSQL, GoTrue Auth, and Storage). Multi-tenancy is enforced at both the database layer via PostgreSQL Row Level Security (RLS) and the application layer via cryptographically verified session cookies.

---

### 2. Threat Model Matrix & OWASP Top 10 Mitigations

| Threat | Risk Level | Attack Vector | Mitigation Strategy Implemented |
| :--- | :---: | :--- | :--- |
| **XSS (Cross-Site Scripting)** | High | Injection of malicious scripts in hotel descriptions, room names, or image captions. | 1. Strict Content Security Policy (CSP) blocking unauthorized scripts.<br>2. React JSX auto-escaping; zero usage of `dangerouslySetInnerHTML`.<br>3. Strict regex validation for Google Map embed URLs (`https://www.google.com/maps/embed`).<br>4. URL sanitization on all external links with `rel="noopener noreferrer"`. |
| **CSRF (Cross-Site Request Forgery)** | Medium | Forging admin room price edits or photo deletions via phishing links. | 1. All Supabase auth cookies are configured with `SameSite=Lax`, `HttpOnly`, and `Secure` attributes via `@supabase/ssr`.<br>2. Next.js Server Actions validate the `Origin` header and CSRF token natively on every POST mutation. |
| **IDOR & Broken Access Control** | Critical | Admin of Hotel A modifies room prices or deletes photos belonging to Hotel B. | 1. Database tables enforce Row Level Security (RLS) policies checking `public.is_site_admin(site_id)`.<br>2. Middleware checks user mapping to current tenant `SITE_ID`.<br>3. All server action queries strictly filter by `eq("site_id", siteConfig.siteId)` and verify `auth.uid()`. |
| **File Upload Abuse** | High | Uploading executable scripts (.php, .exe, .svg with XSS payload) or massive files to cause Denial of Service. | 1. Client-side HTML5 canvas re-encoding: strips all EXIF/GPS metadata and converts files to sanitized WebP/JPEG.<br>2. Magic bytes verification inspecting binary headers (`FF D8 FF`, `89 50 4E 47`, `RIFF...WEBP`).<br>3. Hard cap of 5MB per image and 100 images per property.<br>4. Randomized unique filenames (`img_${Date.now()}_${random}.webp`).<br>5. Storage RLS restricting writes strictly to the authenticated admin's own `{site_id}/*` folder. |
| **Brute Force & Credential Stuffing** | Medium | Automated dictionary attacks against the `/admin/login` endpoint. | 1. In-memory and local client rate limiter enforcing a lockout after 5 consecutive failed attempts for 15 minutes.<br>2. Generic error messages ("Invalid email or password") to eliminate account enumeration.<br>3. Support for TOTP 2FA multi-factor authentication.<br>4. Zero public registration endpoints. |
| **Information Disclosure & Crawling** | Medium | Search engines indexing private admin screens or hotel financial metrics. | 1. `robots.txt` explicitly disallows `/admin`, `/login`, and `/api/`.<br>2. Next.js middleware and page metadata inject `X-Robots-Tag: noindex, nofollow, noarchive`.<br>3. Never expose the Supabase `service_role` secret to the client. |

---

### 3. Supabase Row Level Security (RLS) Verification

Every table in the database has RLS explicitly enabled:
```sql
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
```

#### Multi-Tenant Security Function
```sql
CREATE OR REPLACE FUNCTION public.is_site_admin(lookup_site_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.site_admins
    WHERE user_id = auth.uid()
      AND site_id = lookup_site_id
  );
$$;
```

Public visitors are strictly restricted to `SELECT` on published resources. Write access (`INSERT`, `UPDATE`, `DELETE`) is rejected at the database engine level if the caller's JWT UID is not mapped to the specific `site_id`.

---

### 4. Storage Bucket Security Rules

Storage objects are partitioned by tenant:
- Path format: `{site_id}/{fileName}`
- Public Read: Anyone can view images.
- Admin Write/Delete: Only authenticated admins whose `auth.uid()` maps to that `site_id` can write or delete inside `{site_id}/*`.
