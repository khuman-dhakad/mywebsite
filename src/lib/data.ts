import { siteConfig } from "@/config/site.config";
import { createClient } from "@/lib/supabase/server";
import { HotelProfile, Room, Photo, Amenity, FAQ } from "@/types/database";

// Fallback seed rooms for zero-downtime & offline rendering
export const fallbackRooms: Room[] = [
  {
    id: "f-room-1",
    site_id: siteConfig.siteId,
    name: "Deluxe Heritage AC Room",
    description:
      "Spacious room adorned with traditional Rajasthani wall frescoes, split air conditioning, modern ensuite bathroom with geyser, and LED television.",
    price_per_night: 1499,
    image_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    capacity: "2 Adults",
    bed_type: "1 King Size Double Bed",
    amenities: ["Air Conditioning", "Free High-Speed Wi-Fi", "Geyser Hot Water", "Flat Screen TV", "Daily Housekeeping", "Electric Kettle"],
    is_available: true,
    is_published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "f-room-2",
    site_id: siteConfig.siteId,
    name: "Standard Non-AC Room",
    description:
      "Pocket-friendly, squeaky clean room with high-ceiling fan, writing table, private western toilet with 24-hour running hot water, and quiet courtyard view.",
    price_per_night: 899,
    image_url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
    capacity: "2 Adults",
    bed_type: "1 Queen Double Bed",
    amenities: ["Ceiling Fan", "Free High-Speed Wi-Fi", "Geyser Hot Water", "Daily Housekeeping", "Courtyard View"],
    is_available: true,
    is_published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "f-room-3",
    site_id: siteConfig.siteId,
    name: "Royal Family Jharokha Suite",
    description:
      "Large interconnected family room featuring a traditional carved wooden jharokha balcony overlooking the Pink City bazaars, seating area, and mini-fridge.",
    price_per_night: 2299,
    image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    capacity: "4 Adults (Family)",
    bed_type: "2 Queen Beds",
    amenities: ["Air Conditioning", "Free High-Speed Wi-Fi", "Geyser Hot Water", "Private Balcony", "Mini Refrigerator", "Tea/Coffee Maker"],
    is_available: true,
    is_published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Fallback seed photos
export const fallbackPhotos: Photo[] = [
  {
    id: "f-photo-1",
    site_id: siteConfig.siteId,
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    alt_text: "Rooftop terrace and traditional arches of Shanti Nivas Heritage Lodge",
    caption: "Rooftop seating area with spectacular views of sunrise over Pink City",
    category: "Exterior",
    is_hero: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "f-photo-2",
    site_id: siteConfig.siteId,
    url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    alt_text: "Deluxe Heritage Room with traditional wall art and king bed",
    caption: "Clean, spacious heritage room with comfortable bedding",
    category: "Rooms",
    is_hero: false,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "f-photo-3",
    site_id: siteConfig.siteId,
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    alt_text: "Family suite interior with warm lighting and wooden furnishings",
    caption: "Family suite designed for group comfort and privacy",
    category: "Rooms",
    is_hero: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "f-photo-4",
    site_id: siteConfig.siteId,
    url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
    alt_text: "Traditional Rajasthani inner courtyard and seating",
    caption: "Inner open-air courtyard garden for peaceful evening tea",
    category: "Courtyard",
    is_hero: false,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "f-photo-5",
    site_id: siteConfig.siteId,
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    alt_text: "Reception lobby with cultural artifacts and 24-hr front desk",
    caption: "Welcoming front desk with express check-in assistance",
    category: "Lobby",
    is_hero: false,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "f-photo-6",
    site_id: siteConfig.siteId,
    url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    alt_text: "Rooftop dining space serving pure vegetarian Rajasthani thali",
    caption: "Authentic rooftop pure veg dining overlooking Nahargarh Fort",
    category: "Dining",
    is_hero: false,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
];

// Fallback seed amenities
export const fallbackAmenities: Amenity[] = [
  { id: "f-a1", site_id: siteConfig.siteId, name: "High-Speed Wi-Fi", icon: "wifi", description: "Reliable fibre broadband throughout the lodge and rooms", is_published: true, sort_order: 1, created_at: new Date().toISOString() },
  { id: "f-a2", site_id: siteConfig.siteId, name: "24/7 Hot Water", icon: "shower-head", description: "Individual instantaneous & solar geysers in every bathroom", is_published: true, sort_order: 2, created_at: new Date().toISOString() },
  { id: "f-a3", site_id: siteConfig.siteId, name: "Silent Air Conditioning", icon: "snowflake", description: "Modern split AC units with backup invertor power", is_published: true, sort_order: 3, created_at: new Date().toISOString() },
  { id: "f-a4", site_id: siteConfig.siteId, name: "Rooftop Terrace", icon: "coffee", description: "Panoramic view of Hawa Mahal and Old City skyline", is_published: true, sort_order: 4, created_at: new Date().toISOString() },
  { id: "f-a5", site_id: siteConfig.siteId, name: "Pure Veg Kitchen", icon: "utensils", description: "Fresh, homemade breakfast, tea and pure vegetarian thalis", is_published: true, sort_order: 5, created_at: new Date().toISOString() },
  { id: "f-a6", site_id: siteConfig.siteId, name: "Luggage Storage", icon: "shield-check", description: "Secure cloakroom before check-in and after checkout", is_published: true, sort_order: 6, created_at: new Date().toISOString() },
  { id: "f-a7", site_id: siteConfig.siteId, name: "24-Hour Reception", icon: "clock", description: "Helpful family-operated desk to assist arrivals at any hour", is_published: true, sort_order: 7, created_at: new Date().toISOString() },
  { id: "f-a8", site_id: siteConfig.siteId, name: "Local Travel Desk", icon: "map-pin", description: "Direct auto-rickshaw & cab bookings at transparent government rates", is_published: true, sort_order: 8, created_at: new Date().toISOString() },
];

// Fallback seed FAQs
export const fallbackFaqs: FAQ[] = [
  {
    id: "f-faq-1",
    site_id: siteConfig.siteId,
    question: "How far is the lodge from Hawa Mahal?",
    answer: "We are located just 400 metres away from Hawa Mahal, approximately a 4 to 5 minute relaxed walk through the famous Badi Chaupar bazaar.",
    is_published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "f-faq-2",
    site_id: siteConfig.siteId,
    question: "How can I book a room without a credit card?",
    answer: "You can book directly via WhatsApp or phone call. We confirm bookings with zero commission and accept UPI (Google Pay, PhonePe, Paytm), cash, or net banking upon check-in.",
    is_published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "f-faq-3",
    site_id: siteConfig.siteId,
    question: "What are the standard check-in and check-out timings?",
    answer: "Standard check-in is from 12:00 PM onwards and check-out is by 11:00 AM. Early check-in or late checkout is gladly accommodated subject to room availability.",
    is_published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "f-faq-4",
    site_id: siteConfig.siteId,
    question: "Is vehicle parking available at the property?",
    answer: "We provide safe 2-wheeler parking inside our gated courtyard and have reserved 4-wheeler parking space located 80 metres from the entrance.",
    is_published: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "f-faq-5",
    site_id: siteConfig.siteId,
    question: "Are families and solo travelers welcome?",
    answer: "Yes! All bona fide guests presenting valid government photo ID (Aadhaar Card, Passport, Voter ID or Driving Licence) are warmly welcome. We pride ourselves on a safe, respectful environment.",
    is_published: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
];

export async function getHotelProfile(siteId: string = siteConfig.siteId): Promise<HotelProfile> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")) {
      return buildFallbackProfile(siteId);
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hotel_profiles")
      .select("*")
      .eq("site_id", siteId)
      .single();

    if (error || !data) {
      return buildFallbackProfile(siteId);
    }

    return data as HotelProfile;
  } catch {
    return buildFallbackProfile(siteId);
  }
}

export async function getRooms(siteId: string = siteConfig.siteId): Promise<Room[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")) {
      return fallbackRooms;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("site_id", siteId)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackRooms;
    }

    return data as Room[];
  } catch {
    return fallbackRooms;
  }
}

export async function getPhotos(siteId: string = siteConfig.siteId): Promise<Photo[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")) {
      return fallbackPhotos;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("site_id", siteId)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackPhotos;
    }

    return data as Photo[];
  } catch {
    return fallbackPhotos;
  }
}

export async function getAmenities(siteId: string = siteConfig.siteId): Promise<Amenity[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")) {
      return fallbackAmenities;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("amenities")
      .select("*")
      .eq("site_id", siteId)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackAmenities;
    }

    return data as Amenity[];
  } catch {
    return fallbackAmenities;
  }
}

export async function getFaqs(siteId: string = siteConfig.siteId): Promise<FAQ[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")) {
      return fallbackFaqs;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("site_id", siteId)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackFaqs;
    }

    return data as FAQ[];
  } catch {
    return fallbackFaqs;
  }
}

function buildFallbackProfile(siteId: string): HotelProfile {
  return {
    site_id: siteId,
    name: siteConfig.branding.hotelName,
    tagline: siteConfig.branding.tagline,
    about_heading: siteConfig.defaultCopy.aboutHeading,
    about_text: siteConfig.defaultCopy.aboutStory,
    hero_image_url: siteConfig.defaultHeroImage,
    hero_subtitle: siteConfig.defaultCopy.heroSubtitle,
    phone: siteConfig.contact.phone,
    whatsapp_number: siteConfig.contact.whatsapp,
    email: siteConfig.contact.email,
    address: siteConfig.contact.address,
    city: siteConfig.branding.city,
    state: siteConfig.branding.state,
    postal_code: siteConfig.branding.postalCode,
    google_map_embed_url: siteConfig.contact.googleMapsEmbedUrl,
    google_map_directions_url: siteConfig.contact.googleMapsDirectionsUrl,
    check_in_time: siteConfig.contact.checkInTime,
    check_out_time: siteConfig.contact.checkOutTime,
    reception_hours: siteConfig.contact.receptionHours,
    seo_title: siteConfig.seo.defaultTitle,
    seo_description: siteConfig.seo.defaultDescription,
    seo_keywords: siteConfig.seo.keywords,
    whatsapp_prefill: siteConfig.defaultCopy.whatsappPrefill,
    social_facebook: null,
    social_instagram: null,
    updated_at: new Date().toISOString(),
  };
}
