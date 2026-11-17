import { GuestReview, LocalAttraction } from "@/types/database";

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
    enableReviews: boolean;
    enableAttractions: boolean;
  };
  ratingsSummary: {
    overall: number;
    total: number;
    cleanliness: number;
    location: number;
    hospitality: number;
    value: number;
  };
  reviews: GuestReview[];
  attractions: LocalAttraction[];
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
    enableReviews: true,
    enableAttractions: true,
  },
  ratingsSummary: {
    overall: 4.8,
    total: 184,
    cleanliness: 4.9,
    location: 5.0,
    hospitality: 4.9,
    value: 4.8,
  },
  reviews: [
    {
      id: "rev-1",
      author: "Rajesh & Sunita Sharma",
      location: "New Delhi",
      rating: 5,
      date: "October 2024",
      category: "Family",
      title: "Peaceful family stay within walking distance of Hawa Mahal",
      comment: "We traveled with my elderly parents and two kids. The ground floor deluxe room was spotless, hot water was available all 24 hours, and the owner personally guided us to avoid tourist traps. Incredible hospitality!",
      verified: true,
    },
    {
      id: "rev-2",
      author: "Aakash Mehta",
      location: "Mumbai",
      rating: 5,
      date: "September 2024",
      category: "Couple",
      title: "Best budget heritage experience in Pink City",
      comment: "Super quiet nights despite being in the center of the old city. The rooftop terrace offers breathtaking morning views with traditional chai. Booking directly on WhatsApp was fast and saved us OTA markups.",
      verified: true,
    },
    {
      id: "rev-3",
      author: "Elena Rostova",
      location: "Berlin, Germany",
      rating: 5,
      date: "November 2024",
      category: "Solo",
      title: "Safe, welcoming, and authentic Rajasthani warmth",
      comment: "As a solo female traveler, safety was my number one priority. The 24-hr front desk is courteous and protective. Clean linen, strong Wi-Fi for my remote work, and delicious homemade poha for breakfast.",
      verified: true,
    },
    {
      id: "rev-4",
      author: "Vikram Singhania",
      location: "Ahmedabad",
      rating: 5,
      date: "August 2024",
      category: "Business",
      title: "Great value and impeccable cleanliness",
      comment: "Visited Jaipur for gemstone business near Johari Bazaar. Walked everywhere in 5 minutes. AC was whisper quiet and the room was meticulously sanitized daily.",
      verified: true,
    },
  ],
  attractions: [
    {
      id: "attr-1",
      name: "Hawa Mahal (Palace of Winds)",
      distance: "350 meters",
      walkTime: "4 min walk",
      description: "Iconic five-story pink sandstone palace with 953 intricately carved jharokhas.",
      category: "Monument",
      directionsQuery: "Hawa+Mahal+Jaipur",
    },
    {
      id: "attr-2",
      name: "City Palace & Jantar Mantar",
      distance: "800 meters",
      walkTime: "9 min walk",
      description: "Royal residence of the Jaipur Maharajas and UNESCO World Heritage astronomical observatory.",
      category: "Monument",
      directionsQuery: "City+Palace+Jaipur",
    },
    {
      id: "attr-3",
      name: "Johari Bazaar (Jewellery & Textiles)",
      distance: "500 meters",
      walkTime: "6 min walk",
      description: "Vibrant shopping arcade famous for traditional Kundan jewelry, Bandhani sarees, and Jaipuri quilts.",
      category: "Shopping",
      directionsQuery: "Johari+Bazaar+Jaipur",
    },
    {
      id: "attr-4",
      name: "Albert Hall State Central Museum",
      distance: "2.1 km",
      driveTime: "7 min drive",
      description: "Oldest museum in Rajasthan showcasing rare Indo-Saracenic architecture, armory, and miniature paintings.",
      category: "Culture",
      directionsQuery: "Albert+Hall+Museum+Jaipur",
    },
    {
      id: "attr-5",
      name: "Laxmi Misthan Bhandar (LMB)",
      distance: "650 meters",
      walkTime: "7 min walk",
      description: "Legendary 290-year-old culinary institution renowned for authentic Ghewar, Pyaaz Kachori, and Rajasthani Thali.",
      category: "Dining",
      directionsQuery: "LMB+Jaipur",
    },
    {
      id: "attr-6",
      name: "Amer Fort (Amber Palace)",
      distance: "9.2 km",
      driveTime: "20 min drive",
      description: "Majestic hilltop fortress overlooking Maota Lake with grand Sheesh Mahal (Mirror Palace).",
      category: "Monument",
      directionsQuery: "Amer+Fort+Jaipur",
    },
  ],
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
