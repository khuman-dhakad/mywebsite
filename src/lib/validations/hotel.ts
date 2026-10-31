import { z } from "zod";

// Phone validation: supports E.164, Indian 10-digit mobile formats (+91 98290 12345, +91-98290-12345, 9829012345)
const phoneRegex = /^(\+91[\-\s]?)?[6-9](\d[\-\s]?){9}$/;

// Embed URL validation: MUST start with https://www.google.com/maps/embed
const mapEmbedRegex = /^https:\/\/(www\.)?google\.com\/maps\/embed(\?.*)?$/;

export const hotelProfileSchema = z.object({
  name: z.string().min(2, "Hotel name must be at least 2 characters").max(100),
  tagline: z.string().max(160, "Tagline cannot exceed 160 characters").optional().nullable(),
  about_heading: z.string().max(160).optional().nullable(),
  about_text: z.string().min(20, "About story must be at least 20 characters").max(3000),
  hero_image_url: z.string().url("Must be a valid image URL").optional().nullable(),
  hero_subtitle: z.string().max(350).optional().nullable(),
  phone: z.string().regex(phoneRegex, "Please enter a valid Indian phone number (e.g. +91 98290 12345)"),
  whatsapp_number: z.string().regex(phoneRegex, "Please enter a valid WhatsApp number (e.g. +91 98290 12345)"),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters").max(300),
  city: z.string().min(2, "City is required").max(60),
  state: z.string().min(2, "State is required").max(60),
  postal_code: z.string().regex(/^\d{6}$/, "Must be a 6-digit Indian PIN code").optional().nullable().or(z.literal("")),
  google_map_embed_url: z
    .string()
    .refine((val) => !val || mapEmbedRegex.test(val), {
      message: "Map embed URL must strictly start with https://www.google.com/maps/embed",
    })
    .optional()
    .nullable()
    .or(z.literal("")),
  google_map_directions_url: z.string().url("Invalid directions URL").optional().nullable().or(z.literal("")),
  check_in_time: z.string().max(50).default("12:00 PM"),
  check_out_time: z.string().max(50).default("11:00 AM"),
  reception_hours: z.string().max(50).default("24 Hours Front Desk"),
  seo_title: z.string().max(70, "SEO title ideally under 70 characters").optional().nullable(),
  seo_description: z.string().max(160, "SEO description ideally under 160 characters").optional().nullable(),
  whatsapp_prefill: z.string().max(250).optional().nullable(),
  social_facebook: z.string().url("Invalid Facebook URL").optional().nullable().or(z.literal("")),
  social_instagram: z.string().url("Invalid Instagram URL").optional().nullable().or(z.literal("")),
});

export const roomSchema = z.object({
  name: z.string().min(2, "Room name must be at least 2 characters").max(80),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  price_per_night: z.coerce.number().min(100, "Price must be at least ₹100").max(100000, "Price cannot exceed ₹1,00,000"),
  image_url: z.string().url("Must be a valid image URL").optional().nullable().or(z.literal("")),
  capacity: z.string().min(1).max(50).default("2 Adults"),
  bed_type: z.string().min(1).max(50).default("1 Queen Bed"),
  amenities: z.array(z.string()).default([]),
  is_available: z.boolean().default(true),
  is_published: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
});

export const photoSchema = z.object({
  url: z.string().url("Must be a valid image URL"),
  alt_text: z.string().min(3, "Descriptive alt text is required for SEO and accessibility").max(200),
  caption: z.string().max(200).optional().nullable(),
  category: z.string().min(1).max(50).default("General"),
  is_hero: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  totpCode: z.string().length(6, "2FA TOTP code must be 6 digits").optional().or(z.literal("")),
});

export type HotelProfileInput = z.infer<typeof hotelProfileSchema>;
export type RoomInput = z.infer<typeof roomSchema>;
export type PhotoInput = z.infer<typeof photoSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
