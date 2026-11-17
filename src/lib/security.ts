/**
 * Security utilities: input sanitization, anti-bot honeypot detection,
 * date validation, and reservation calculation helpers.
 */

/**
 * Strips HTML tags, script entities, dangerous control characters and trims text.
 * Prevents stored and reflected XSS in inquiry and guest inputs.
 */
export function sanitizePlainText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[<>"'&]/g, (char) => {
      switch (char) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#x27;";
        case "&":
          return "&amp;";
        default:
          return char;
      }
    })
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "") // strip control characters
    .trim();
}

/**
 * Validates check-in and check-out dates for hospitality reservations.
 * Enforces:
 * - ISO YYYY-MM-DD format
 * - Check-in cannot be in the past (before today at 00:00:00 local time)
 * - Check-out must be after check-in
 * - Max stay length capped at 30 nights to prevent abuse
 */
export function validateBookingDates(
  checkInStr: string,
  checkOutStr: string,
  referenceDate = new Date()
): { valid: boolean; nights: number; error?: string } {
  if (!checkInStr || !checkOutStr) {
    return { valid: false, nights: 0, error: "Please select both check-in and check-out dates." };
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(checkInStr) || !isoDateRegex.test(checkOutStr)) {
    return { valid: false, nights: 0, error: "Invalid date format. Expected YYYY-MM-DD." };
  }

  const checkIn = new Date(`${checkInStr}T00:00:00`);
  const checkOut = new Date(`${checkOutStr}T00:00:00`);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return { valid: false, nights: 0, error: "Invalid calendar dates selected." };
  }

  // Today normalized to midnight
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  if (checkIn < today) {
    return { valid: false, nights: 0, error: "Check-in date cannot be in the past." };
  }

  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return { valid: false, nights: 0, error: "Check-out date must be after check-in date." };
  }

  if (diffDays > 30) {
    return { valid: false, nights: 0, error: "Online inquiry is limited to 30 nights. For long-term stays, please call directly." };
  }

  return { valid: true, nights: diffDays };
}

/**
 * Transparent Indian hotel tariff calculator.
 * In India, hotel rooms under Rs 7,500/night typically attract 12% GST or are tax-exempt for budget stays.
 */
export function calculateTariff(pricePerNight: number, nights: number) {
  const safePrice = Math.max(0, Math.floor(pricePerNight));
  const safeNights = Math.max(1, Math.floor(nights));
  const roomTotal = safePrice * safeNights;
  
  // Approximate standard GST for display
  const gstRate = safePrice > 1000 ? 0.12 : 0;
  const estimatedTaxes = Math.round(roomTotal * gstRate);
  const grandTotal = roomTotal + estimatedTaxes;

  return {
    pricePerNight: safePrice,
    nights: safeNights,
    roomTotal,
    estimatedTaxes,
    grandTotal,
    gstRate,
  };
}

/**
 * Honeypot check for bots submitting hidden form fields.
 */
export function isHoneypotTriggered(honeypotValue: unknown): boolean {
  return typeof honeypotValue === "string" && honeypotValue.trim().length > 0;
}

/**
 * Generate a friendly booking inquiry reference code (e.g. "SN-7842").
 */
export function generateInquiryToken(prefix = "SN"): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${rand}`;
}
