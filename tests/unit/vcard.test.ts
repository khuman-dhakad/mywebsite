import { describe, it, expect } from "vitest";
import { generateVCard } from "@/lib/vcard";
import { HotelProfile } from "@/types/database";

describe("vCard Generation Utility", () => {
  const mockProfile: HotelProfile = {
    site_id: "demo-hotel-jaipur",
    name: "Shanti Nivas Heritage Lodge",
    phone: "+91 98290 12345",
    whatsapp_number: "+919829012345",
    email: "stay@shantinivasheritage.com",
    address: "42, Heritage Havelis Lane, Near Hawa Mahal",
    city: "Jaipur",
    state: "Rajasthan",
    postal_code: "302002",
    check_in_time: "12:00 PM",
    check_out_time: "11:00 AM",
    updated_at: new Date().toISOString(),
  };

  it("should generate valid vCard 3.0 formatting with hotel information", () => {
    const vcard = generateVCard(mockProfile);

    expect(vcard).toContain("BEGIN:VCARD");
    expect(vcard).toContain("VERSION:3.0");
    expect(vcard).toContain("FN:Shanti Nivas Heritage Lodge");
    expect(vcard).toContain("ORG:Shanti Nivas Heritage Lodge");
    expect(vcard).toContain("TEL;TYPE=WORK,VOICE:+919829012345");
    expect(vcard).toContain("TEL;TYPE=CELL,VOICE:+919829012345");
    expect(vcard).toContain("EMAIL;TYPE=INTERNET:stay@shantinivasheritage.com");
    expect(vcard).toContain("ADR;TYPE=WORK:;;42, Heritage Havelis Lane, Near Hawa Mahal;Jaipur;Rajasthan;302002;India");
    expect(vcard).toContain("END:VCARD");
  });

  it("should handle profile without email gracefully", () => {
    const withoutEmail = { ...mockProfile, email: null };
    const vcard = generateVCard(withoutEmail);

    expect(vcard).toContain("BEGIN:VCARD");
    expect(vcard).not.toContain("EMAIL;TYPE=INTERNET");
    expect(vcard).toContain("END:VCARD");
  });
});
