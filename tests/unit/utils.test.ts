import { describe, it, expect } from "vitest";
import {
  buildWhatsAppUrl,
  buildTelUrl,
  formatRupees,
  normalizePhoneNumber,
  sanitizeMapEmbedUrl,
  validateImageMagicBytes,
  SHIMMER_BLUR_DATA_URL,
} from "@/lib/utils";

describe("Utility Functions & URL Builders", () => {
  describe("normalizePhoneNumber", () => {
    it("should prepend 91 to 10-digit Indian numbers", () => {
      expect(normalizePhoneNumber("9829012345")).toBe("919829012345");
      expect(normalizePhoneNumber("+91 98290-12345")).toBe("919829012345");
    });

    it("should preserve existing 12-digit numbers starting with 91", () => {
      expect(normalizePhoneNumber("+919829012345")).toBe("919829012345");
      expect(normalizePhoneNumber("919829012345")).toBe("919829012345");
    });
  });

  describe("buildWhatsAppUrl", () => {
    it("should safely construct WhatsApp URL with encoded message", () => {
      const url = buildWhatsAppUrl("+91 98290 12345", "Hello, I want to book a room!");
      expect(url).toBe("https://wa.me/919829012345?text=Hello%2C%20I%20want%20to%20book%20a%20room!");
    });

    it("should properly encode special characters and Hindi greetings", () => {
      const url = buildWhatsAppUrl("9829012345", "नमस्ते! क्या कमरे उपलब्ध हैं?");
      expect(url).toContain("https://wa.me/919829012345?text=");
      expect(url).toContain(encodeURIComponent("नमस्ते! क्या कमरे उपलब्ध हैं?"));
    });
  });

  describe("buildTelUrl", () => {
    it("should extract digits and plus sign for tel: protocol", () => {
      expect(buildTelUrl("+91 98290 12345")).toBe("tel:+919829012345");
      expect(buildTelUrl("0141-2601234")).toBe("tel:01412601234");
    });
  });

  describe("formatRupees", () => {
    it("should format numbers with Rupee symbol and Indian comma notation", () => {
      const formatted999 = formatRupees(999);
      expect(formatted999).toMatch(/₹\s?999/);

      const formatted1499 = formatRupees(1499);
      expect(formatted1499).toMatch(/₹\s?1,499/);

      const formatted100k = formatRupees(100000);
      expect(formatted100k).toMatch(/₹\s?1,00,000/);
    });

    it("should return ₹0 for invalid inputs", () => {
      expect(formatRupees("invalid")).toBe("₹0");
    });
  });

  describe("sanitizeMapEmbedUrl", () => {
    it("should allow valid Google Maps embed URLs", () => {
      const valid = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234!2d75.82!3d26.92";
      expect(sanitizeMapEmbedUrl(valid)).toBe(valid);
    });

    it("should allow google.com/maps/embed", () => {
      const valid = "https://google.com/maps/embed?pb=123";
      expect(sanitizeMapEmbedUrl(valid)).toBe(valid);
    });

    it("should reject non-embed URLs", () => {
      expect(sanitizeMapEmbedUrl("https://www.google.com/maps/place/Jaipur")).toBeNull();
      expect(sanitizeMapEmbedUrl("https://maps.apple.com/?q=Jaipur")).toBeNull();
    });

    it("should reject javascript: or data: URIs and malicious domains", () => {
      expect(sanitizeMapEmbedUrl("javascript:alert(1)")).toBeNull();
      expect(sanitizeMapEmbedUrl("https://evil-site.com/google.com/maps/embed")).toBeNull();
      expect(sanitizeMapEmbedUrl("")).toBeNull();
      expect(sanitizeMapEmbedUrl(null)).toBeNull();
    });
  });

  describe("validateImageMagicBytes", () => {
    it("should validate JPEG magic bytes (FF D8 FF)", () => {
      const buffer = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]).buffer;
      expect(validateImageMagicBytes(buffer)).toEqual({ valid: true, format: "jpeg" });
    });

    it("should validate PNG magic bytes (89 50 4E 47 0D 0A 1A 0A)", () => {
      const buffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]).buffer;
      expect(validateImageMagicBytes(buffer)).toEqual({ valid: true, format: "png" });
    });

    it("should validate WebP magic bytes (RIFF....WEBP)", () => {
      const buffer = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, // RIFF
        0x20, 0x00, 0x00, 0x00,
        0x57, 0x45, 0x42, 0x50, // WEBP
      ]).buffer;
      expect(validateImageMagicBytes(buffer)).toEqual({ valid: true, format: "webp" });
    });

    it("should reject executable or script files", () => {
      const exeBuffer = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]).buffer;
      expect(validateImageMagicBytes(exeBuffer)).toEqual({ valid: false });

      const textBuffer = new TextEncoder().encode("<script>alert(1)</script>").buffer;
      expect(validateImageMagicBytes(textBuffer)).toEqual({ valid: false });
    });
  });

  describe("SHIMMER_BLUR_DATA_URL", () => {
    it("should expose a valid base64 inline SVG data URL for Next image blur placeholders", () => {
      expect(SHIMMER_BLUR_DATA_URL.startsWith("data:image/svg+xml;base64,")).toBe(true);
    });
  });
});
