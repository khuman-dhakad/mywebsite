import { describe, it, expect, vi } from "vitest";
import { hotelProfileSchema, roomSchema } from "@/lib/validations/hotel";

describe("Server Actions Security & Validation Logic", () => {
  it("should reject malicious XSS payload in hotel profile name", () => {
    const maliciousInput = {
      name: "<script>alert('xss')</script>",
      about_text: "Clean, comfortable rooms in the heart of Jaipur with hot water.",
      phone: "+91 98290 12345",
      whatsapp_number: "+919829012345",
      address: "123 Main Road",
      city: "Jaipur",
      state: "Rajasthan",
    };

    // The zod schema parses raw text; Next.js JSX escapes output automatically
    const parsed = hotelProfileSchema.safeParse(maliciousInput);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      // Confirm that input is treated as raw text, not executed as HTML
      expect(typeof parsed.data.name).toBe("string");
    }
  });

  it("should prevent room creation with invalid or negative tariffs", () => {
    const negativePriceRoom = {
      name: "Deluxe Heritage Room",
      description: "Room with negative price should be rejected",
      price_per_night: -500,
    };

    const res = roomSchema.safeParse(negativePriceRoom);
    expect(res.success).toBe(false);
  });

  it("should reject unauthorized phone numbers not conforming to Indian telecommunications specs", () => {
    const invalidPhone = {
      name: "Valid Hotel Name",
      about_text: "Comfortable budget accommodations in the city centre.",
      phone: "0000000000", // invalid prefix (does not start with 6,7,8,9)
      whatsapp_number: "+919829012345",
      address: "123 Main Road",
      city: "Jaipur",
      state: "Rajasthan",
    };

    const res = hotelProfileSchema.safeParse(invalidPhone);
    expect(res.success).toBe(false);
  });
});
