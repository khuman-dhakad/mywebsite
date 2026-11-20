import { HotelProfile } from "@/types/database";

/**
 * Generates RFC-compliant vCard 3.0 text for the hotel property.
 */
export function generateVCard(profile: HotelProfile): string {
  const cleanPhone = profile.phone.replace(/[^\d+]/g, "");
  const cleanWhatsApp = profile.whatsapp_number.replace(/[^\d+]/g, "");

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.name}`,
    `ORG:${profile.name}`,
    `TEL;TYPE=WORK,VOICE:${cleanPhone}`,
    `TEL;TYPE=CELL,VOICE:${cleanWhatsApp}`,
    profile.email ? `EMAIL;TYPE=INTERNET:${profile.email}` : "",
    `ADR;TYPE=WORK:;;${profile.address};${profile.city};${profile.state};${profile.postal_code || ""};India`,
    `NOTE:24/7 Front Desk: ${profile.phone}. Check-in: ${profile.check_in_time || "12:00 PM"} | Check-out: ${profile.check_out_time || "11:00 AM"}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");
}

/**
 * Triggers a browser download of the vCard (.vcf) file.
 * Native iOS and Android devices open the Contacts app directly.
 */
export function downloadVCard(profile: HotelProfile): void {
  const vcardText = generateVCard(profile);
  const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileName = `${profile.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-contact.vcf`;

  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
