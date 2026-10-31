export interface Site {
  id: string;
  name: string;
  domain?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteAdmin {
  user_id: string;
  site_id: string;
  role: "owner" | "admin" | "manager";
  created_at: string;
}

export interface HotelProfile {
  site_id: string;
  name: string;
  tagline?: string | null;
  about_heading?: string | null;
  about_text?: string | null;
  hero_image_url?: string | null;
  hero_subtitle?: string | null;
  phone: string;
  whatsapp_number: string;
  email?: string | null;
  address: string;
  city: string;
  state: string;
  postal_code?: string | null;
  google_map_embed_url?: string | null;
  google_map_directions_url?: string | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  reception_hours?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  whatsapp_prefill?: string | null;
  social_facebook?: string | null;
  social_instagram?: string | null;
  updated_at: string;
}

export interface Room {
  id: string;
  site_id: string;
  name: string;
  description: string;
  price_per_night: number;
  image_url?: string | null;
  capacity: string;
  bed_type: string;
  amenities: string[];
  is_available: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  site_id: string;
  url: string;
  alt_text: string;
  caption?: string | null;
  category: string;
  is_hero: boolean;
  sort_order: number;
  created_at: string;
}

export interface Amenity {
  id: string;
  site_id: string;
  name: string;
  icon: string;
  description?: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface FAQ {
  id: string;
  site_id: string;
  question: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}
