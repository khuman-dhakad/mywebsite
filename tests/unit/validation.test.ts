import { describe, it, expect } from "vitest";
import {
  hotelProfileSchema,
  roomSchema,
  photoSchema,
  loginSchema,
} from "@/lib/validations/hotel";

describe("Zod Validation Schemas", () => {
  describe("hotelProfileSchema", () => {
    it("should accept valid hotel profile data", () => {
      const validData = {
        name: "Shanti Nivas Heritage Lodge",
        tagline: "Authentic Rajasthani Hospitality",
        about_heading: "Welcome to Jaipur",
        about_text: "Clean, comfortable, and peaceful rooms in the heart of Pink City.",
        phone: "+91 98290 12345",
        whatsapp_number: "+919829012345",
        email: "stay@hotel.com",
        address: "42 Heritage Lane, Near Hawa Mahal",
        city: "Jaipur",
        state: "Rajasthan",
        postal_code: "302002",
        google_map_embed_url: "https://www.google.com/maps/embed?pb=1234",
      };

      const result = hotelProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject non-https or non-google embed map URLs", () => {
      const invalidData = {
        name: "Test Hotel",
        about_text: "This is a detailed description of the property for guests.",
        phone: "+91 98290 12345",
        whatsapp_number: "+919829012345",
        address: "123 Main Road",
        city: "Jaipur",
        state: "Rajasthan",
        google_map_embed_url: "http://malicious-site.com/embed",
      };

      const result = hotelProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid Indian phone numbers", () => {
      const invalidPhone = {
        name: "Test Hotel",
        about_text: "Valid description of the hotel property with more than 20 chars.",
        phone: "12345", // too short, invalid prefix
        whatsapp_number: "+919829012345",
        address: "123 Main Road",
        city: "Jaipur",
        state: "Rajasthan",
      };

      const result = hotelProfileSchema.safeParse(invalidPhone);
      expect(result.success).toBe(false);
    });
  });

  describe("roomSchema", () => {
    it("should accept valid room data", () => {
      const validRoom = {
        name: "Deluxe AC Room",
        description: "Spacious heritage room with air conditioning, geyser, and LED TV.",
        price_per_night: 1499,
        image_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        capacity: "2 Adults",
        bed_type: "1 King Bed",
        amenities: ["AC", "Wi-Fi", "Geyser"],
        is_available: true,
        is_published: true,
        sort_order: 1,
      };

      const result = roomSchema.safeParse(validRoom);
      expect(result.success).toBe(true);
    });

    it("should reject price below minimum or negative", () => {
      const invalidRoom = {
        name: "Budget Room",
        description: "Valid description of the room with sufficient characters.",
        price_per_night: 50, // minimum is ₹100
      };

      const result = roomSchema.safeParse(invalidRoom);
      expect(result.success).toBe(false);
    });
  });

  describe("photoSchema", () => {
    it("should require descriptive alt text for SEO and accessibility", () => {
      const missingAlt = {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        alt_text: "a", // too short (min 3 chars required)
      };

      const result = photoSchema.safeParse(missingAlt);
      expect(result.success).toBe(false);
    });

    it("should accept valid photo record", () => {
      const validPhoto = {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        alt_text: "Front view of heritage lodge in Jaipur with Rajasthani arches",
        caption: "Front facade",
        category: "Exterior",
        is_hero: true,
        sort_order: 1,
      };

      const result = photoSchema.safeParse(validPhoto);
      expect(result.success).toBe(true);
    });
  });

  describe("loginSchema", () => {
    it("should validate email format and minimum password length", () => {
      expect(loginSchema.safeParse({ email: "admin@hotel.com", password: "password123" }).success).toBe(true);
      expect(loginSchema.safeParse({ email: "invalid-email", password: "password123" }).success).toBe(false);
      expect(loginSchema.safeParse({ email: "admin@hotel.com", password: "123" }).success).toBe(false);
    });
  });
});
