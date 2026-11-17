import { describe, it, expect } from "vitest";
import {
  sanitizePlainText,
  validateBookingDates,
  calculateTariff,
  isHoneypotTriggered,
  generateInquiryToken,
} from "@/lib/security";

describe("Security & Booking Utilities", () => {
  describe("sanitizePlainText", () => {
    it("should strip HTML tags and script injection payloads", () => {
      const malicious = "<script>alert('xss')</script>Hello <b>World</b>";
      const sanitized = sanitizePlainText(malicious);
      expect(sanitized).not.toContain("<script>");
      expect(sanitized).not.toContain("<b>");
      expect(sanitized).toContain("Hello");
      expect(sanitized).toContain("World");
    });

    it("should escape special characters", () => {
      expect(sanitizePlainText('Room & "Suite"')).toBe("Room &amp; &quot;Suite&quot;");
      expect(sanitizePlainText("O'Reilly")).toBe("O&#x27;Reilly");
    });

    it("should handle non-string and empty inputs gracefully", () => {
      expect(sanitizePlainText(null)).toBe("");
      expect(sanitizePlainText(undefined)).toBe("");
      expect(sanitizePlainText(123)).toBe("");
      expect(sanitizePlainText("   ")).toBe("");
    });
  });

  describe("validateBookingDates", () => {
    const fixedToday = new Date("2026-11-17T00:00:00");

    it("should accept valid future dates and calculate correct night count", () => {
      const res = validateBookingDates("2026-11-20", "2026-11-23", fixedToday);
      expect(res.valid).toBe(true);
      expect(res.nights).toBe(3);
    });

    it("should reject dates in the past", () => {
      const res = validateBookingDates("2026-11-10", "2026-11-12", fixedToday);
      expect(res.valid).toBe(false);
      expect(res.error).toContain("cannot be in the past");
    });

    it("should reject checkout dates before or equal to checkin", () => {
      const resEqual = validateBookingDates("2026-11-20", "2026-11-20", fixedToday);
      expect(resEqual.valid).toBe(false);
      expect(resEqual.error).toContain("must be after check-in");

      const resBefore = validateBookingDates("2026-11-20", "2026-11-18", fixedToday);
      expect(resBefore.valid).toBe(false);
      expect(resBefore.error).toContain("must be after check-in");
    });

    it("should reject invalid date strings", () => {
      const res = validateBookingDates("invalid-date", "2026-11-20", fixedToday);
      expect(res.valid).toBe(false);
    });

    it("should cap reservations at 30 nights to prevent abuse", () => {
      const res = validateBookingDates("2026-11-20", "2026-12-25", fixedToday);
      expect(res.valid).toBe(false);
      expect(res.error).toContain("limited to 30 nights");
    });
  });

  describe("calculateTariff", () => {
    it("should calculate base room tariff for multiple nights", () => {
      const tariff = calculateTariff(1500, 3);
      expect(tariff.pricePerNight).toBe(1500);
      expect(tariff.nights).toBe(3);
      expect(tariff.roomTotal).toBe(4500);
      // Room > 1000 has 12% GST
      expect(tariff.estimatedTaxes).toBe(540);
      expect(tariff.grandTotal).toBe(5040);
    });

    it("should not add GST for budget tariffs under 1000", () => {
      const tariff = calculateTariff(800, 2);
      expect(tariff.roomTotal).toBe(1600);
      expect(tariff.estimatedTaxes).toBe(0);
      expect(tariff.grandTotal).toBe(1600);
    });

    it("should handle 1 night minimum cleanly", () => {
      const tariff = calculateTariff(2000, 0);
      expect(tariff.nights).toBe(1);
      expect(tariff.roomTotal).toBe(2000);
    });
  });

  describe("isHoneypotTriggered", () => {
    it("should return false for empty or whitespace honeypot", () => {
      expect(isHoneypotTriggered("")).toBe(false);
      expect(isHoneypotTriggered("   ")).toBe(false);
      expect(isHoneypotTriggered(undefined)).toBe(false);
    });

    it("should return true when bot fills hidden honeypot", () => {
      expect(isHoneypotTriggered("http://spam-bot.com")).toBe(true);
    });
  });

  describe("generateInquiryToken", () => {
    it("should generate formatted inquiry tokens", () => {
      const token = generateInquiryToken("SN");
      expect(token).toMatch(/^SN-\d{4}$/);
    });
  });
});
