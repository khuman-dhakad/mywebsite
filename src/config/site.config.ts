export interface SiteConfig {
  siteId: string;
  siteUrl: string;
  branding: {
    hotelName: string;
    tagline: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    starRating?: number;
  };
  contact: {
    phone: string;
    phoneE164: string;
    whatsapp: string;
    whatsappE164: string;
    email: string;
    address: string;
    googleMapsEmbedUrl: string;
    googleMapsDirectionsUrl: string;
    checkInTime: string;
    checkOutTime: string;
    receptionHours: string;
  };
  features: {
    enableWhatsAppBooking: boolean;
    enableCallButton: boolean;
    enableGallery: boolean;
    enableRooms: boolean;
    enableAmenities: boolean;
    enableLocation: boolean;
    enableFaq: boolean;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
    priceRange: string;
    currency: string;
    ratingValue: number;
    reviewCount: number;
  };
  defaultHeroImage: string;
  defaultCopy: {
    heroSubtitle: string;
    aboutHeading: string;
    aboutStory: string;
    whatsappPrefill: string;
  };
}

export const siteConfig: SiteConfig = {
  siteId: process.env.SITE_ID || "demo-hotel-jaipur",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://shantinivasheritage.com",
  branding: {
    hotelName: "Shanti Nivas Heritage Lodge",
    tagline: "Authentic Rajasthani Hospitality & Peaceful Heritage Stay",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    postalCode: "302002",
    starRating: 3,
  },
  contact: {
    phone: "+91 98290 12345",
    phoneE164: "+919829012345",
    whatsapp: "+91 98290 12345",
    whatsappE164: "+919829012345",
    email: "info@shantinivasheritage.com",
    address: "42, Heritage Havelis Lane, Near Hawa Mahal, Badi Chaupar, Jaipur, Rajasthan 302002",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.34!2d75.8267!3d26.9239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db14b1bd3065b%3A0x6b2e1e075841029c!2sHawa%20Mahal!5e0!3m2!1sen!2sin!4v1700000000000",
    googleMapsDirectionsUrl: "https://maps.google.com/?q=Hawa+Mahal+Jaipur",
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    receptionHours: "24 Hours Front Desk",
  },
  features: {
    enableWhatsAppBooking: true,
    enableCallButton: true,
    enableGallery: true,
    enableRooms: true,
    enableAmenities: true,
    enableLocation: true,
    enableFaq: true,
  },
  seo: {
    defaultTitle: "Shanti Nivas Heritage Lodge | Best Budget Hotel in Jaipur near Hawa Mahal",
    defaultDescription: "Comfortable AC rooms in Jaipur from ₹999/night. Free high-speed Wi-Fi, 24-hr hot water, pure veg kitchen & rooftop view of Pink City. Instant booking on WhatsApp.",
    keywords: [
      "hotel in jaipur",
      "budget hotel jaipur",
      "lodge near hawa mahal",
      "heritage stay jaipur",
      "rooms in jaipur under 1000",
      "family lodge jaipur",
      "shanti nivas lodge",
    ],
    priceRange: "₹999 - ₹2,499",
    currency: "INR",
    ratingValue: 4.8,
    reviewCount: 184,
  },
  defaultHeroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80",
  defaultCopy: {
    heroSubtitle: "Stay steps away from Hawa Mahal in clean, air-conditioned comfort. Traditional warmth, safe family environment, and authentic home-style Indian cuisine.",
    aboutHeading: "A Peaceful Heritage Haven in the Pink City",
    aboutStory: "Founded with a mission to offer genuine Indian hospitality at budget-conscious rates, Shanti Nivas Heritage Lodge welcomes pilgrims, backpackers, and families alike. Our property combines traditional Rajasthani architectural jharokhas with modern amenities including high-speed Wi-Fi, clean private bathrooms with 24-hour geyser hot water, and silent air conditioning. Located within 5 minutes walking distance of Hawa Mahal and City Palace, you spend less time in traffic and more time enjoying Jaipur.",
    whatsappPrefill: "Namaste! I found Shanti Nivas Heritage Lodge online and would like to inquire about room availability and pricing.",
  },
};
