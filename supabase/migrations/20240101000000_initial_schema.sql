-- ==============================================================================
-- Multi-Tenant Indian Hospitality Platform Migration
-- Architecture: Row Level Security (RLS) multi-tenancy isolated by site_id
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Sites Table
CREATE TABLE IF NOT EXISTS public.sites (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Site Admins Table (Maps auth.users to tenant sites)
CREATE TABLE IF NOT EXISTS public.site_admins (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    site_id TEXT NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin' NOT NULL CHECK (role IN ('owner', 'admin', 'manager')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_id, site_id)
);

-- Helper function: Check if current authenticated user is an authorized admin for given site_id
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

-- 3. Hotel Profiles Table
CREATE TABLE IF NOT EXISTS public.hotel_profiles (
    site_id TEXT PRIMARY KEY REFERENCES public.sites(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tagline TEXT,
    about_heading TEXT,
    about_text TEXT,
    hero_image_url TEXT,
    hero_subtitle TEXT,
    phone TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT,
    google_map_embed_url TEXT,
    google_map_directions_url TEXT,
    check_in_time TEXT DEFAULT '12:00 PM',
    check_out_time TEXT DEFAULT '11:00 AM',
    reception_hours TEXT DEFAULT '24 Hours Front Desk',
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[] DEFAULT '{}',
    whatsapp_prefill TEXT,
    social_facebook TEXT,
    social_instagram TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id TEXT NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price_per_night NUMERIC(10,2) NOT NULL CHECK (price_per_night >= 0),
    image_url TEXT,
    capacity TEXT DEFAULT '2 Guests',
    bed_type TEXT DEFAULT '1 Queen Bed',
    amenities TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Photos Table
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id TEXT NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    caption TEXT,
    category TEXT DEFAULT 'General',
    is_hero BOOLEAN DEFAULT FALSE NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Amenities Table
CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id TEXT NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. FAQs Table (for Local SEO FAQPage schema)
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id TEXT NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 1. Sites Policies
CREATE POLICY "Public can view registered sites"
    ON public.sites FOR SELECT
    USING (true);

CREATE POLICY "Site admins can update their site record"
    ON public.sites FOR UPDATE
    USING (public.is_site_admin(id))
    WITH CHECK (public.is_site_admin(id));

-- 2. Site Admins Policies
CREATE POLICY "Admins can view their own site associations"
    ON public.site_admins FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Site owners can manage site admin mapping"
    ON public.site_admins FOR ALL
    USING (public.is_site_admin(site_id));

-- 3. Hotel Profiles Policies
CREATE POLICY "Public can view hotel profile"
    ON public.hotel_profiles FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert hotel profile"
    ON public.hotel_profiles FOR INSERT
    WITH CHECK (public.is_site_admin(site_id));

CREATE POLICY "Admins can update hotel profile"
    ON public.hotel_profiles FOR UPDATE
    USING (public.is_site_admin(site_id))
    WITH CHECK (public.is_site_admin(site_id));

CREATE POLICY "Admins can delete hotel profile"
    ON public.hotel_profiles FOR DELETE
    USING (public.is_site_admin(site_id));

-- 4. Rooms Policies
CREATE POLICY "Public can view published rooms"
    ON public.rooms FOR SELECT
    USING (is_published = true OR public.is_site_admin(site_id));

CREATE POLICY "Admins can insert rooms"
    ON public.rooms FOR INSERT
    WITH CHECK (public.is_site_admin(site_id));

CREATE POLICY "Admins can update rooms"
    ON public.rooms FOR UPDATE
    USING (public.is_site_admin(site_id))
    WITH CHECK (public.is_site_admin(site_id));

CREATE POLICY "Admins can delete rooms"
    ON public.rooms FOR DELETE
    USING (public.is_site_admin(site_id));

-- 5. Photos Policies
CREATE POLICY "Public can view photos"
    ON public.photos FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert photos"
    ON public.photos FOR INSERT
    WITH CHECK (public.is_site_admin(site_id));

CREATE POLICY "Admins can update photos"
    ON public.photos FOR UPDATE
    USING (public.is_site_admin(site_id))
    WITH CHECK (public.is_site_admin(site_id));

CREATE POLICY "Admins can delete photos"
    ON public.photos FOR DELETE
    USING (public.is_site_admin(site_id));

-- 6. Amenities Policies
CREATE POLICY "Public can view published amenities"
    ON public.amenities FOR SELECT
    USING (is_published = true OR public.is_site_admin(site_id));

CREATE POLICY "Admins can insert amenities"
    ON public.amenities FOR INSERT
    WITH CHECK (public.is_site_admin(site_id));

CREATE POLICY "Admins can update amenities"
    ON public.amenities FOR UPDATE
    USING (public.is_site_admin(site_id))
    WITH CHECK (public.is_site_admin(site_id));

CREATE POLICY "Admins can delete amenities"
    ON public.amenities FOR DELETE
    USING (public.is_site_admin(site_id));

-- 7. FAQs Policies
CREATE POLICY "Public can view published faqs"
    ON public.faqs FOR SELECT
    USING (is_published = true OR public.is_site_admin(site_id));

CREATE POLICY "Admins can insert faqs"
    ON public.faqs FOR INSERT
    WITH CHECK (public.is_site_admin(site_id));

CREATE POLICY "Admins can update faqs"
    ON public.faqs FOR UPDATE
    USING (public.is_site_admin(site_id))
    WITH CHECK (public.is_site_admin(site_id));

CREATE POLICY "Admins can delete faqs"
    ON public.faqs FOR DELETE
    USING (public.is_site_admin(site_id));

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION & RLS POLICIES
-- ==============================================================================

-- Create bucket for hotel media assets if not already existing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'hotel-assets',
    'hotel-assets',
    true,
    5242880, -- 5 MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS: Public read access for images
CREATE POLICY "Public View Hotel Assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'hotel-assets');

-- Storage RLS: Admin can upload only into their own site folder {site_id}/*
CREATE POLICY "Site Admin Upload Assets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'hotel-assets' AND
        (storage.foldername(name))[1] IN (
            SELECT site_id FROM public.site_admins WHERE user_id = auth.uid()
        )
    );

-- Storage RLS: Admin can update only objects in their own site folder
CREATE POLICY "Site Admin Update Assets"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'hotel-assets' AND
        (storage.foldername(name))[1] IN (
            SELECT site_id FROM public.site_admins WHERE user_id = auth.uid()
        )
    );

-- Storage RLS: Admin can delete only objects in their own site folder
CREATE POLICY "Site Admin Delete Assets"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'hotel-assets' AND
        (storage.foldername(name))[1] IN (
            SELECT site_id FROM public.site_admins WHERE user_id = auth.uid()
        )
    );
