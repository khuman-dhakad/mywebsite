import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Lightweight neutral stone SVG shimmer placeholder for Next.js remote images
 */
export const SHIMMER_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iI2U3ZTVlNCIvPjwvc3ZnPg==";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a currency amount into Indian Rupee format (e.g. ₹1,499)
 */
export function formatRupees(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Normalizes an Indian or international phone number to E.164 digits format (e.g. 919829012345)
 */
export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // If 10 digits (standard Indian mobile without country code), prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  // If already starts with 91 and has 12 digits
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }
  return digits;
}

/**
 * Safely generates a WhatsApp click-to-chat URL with prefilled query text
 */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Generates tel: URL safely
 */
export function buildTelUrl(phoneNumber: string): string {
  const digits = phoneNumber.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

/**
 * Strictly sanitizes Google Maps embed URL
 * Only allows URLs starting with https://www.google.com/maps/embed or https://google.com/maps/embed
 */
export function sanitizeMapEmbedUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    const validHosts = ["www.google.com", "google.com", "maps.google.com"];
    if (parsed.protocol === "https:" && validHosts.includes(parsed.hostname) && parsed.pathname.startsWith("/maps/embed")) {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validates file magic bytes against JPEG, PNG, and WebP signatures
 */
export function validateImageMagicBytes(buffer: ArrayBuffer): { valid: boolean; format?: "jpeg" | "png" | "webp" } {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 12) {
    return { valid: false };
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { valid: true, format: "jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { valid: true, format: "png" };
  }

  // WebP: RIFF (bytes 0-3 = 52 49 46 46) ... WEBP (bytes 8-11 = 57 45 42 50)
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { valid: true, format: "webp" };
  }

  return { valid: false };
}

/**
 * Compresses an image client-side to maximum 1600px width/height and strips all EXIF/GPS metadata
 * by drawing onto an HTML5 canvas and exporting as WebP / JPEG.
 */
export async function compressAndStripExif(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<{ blob: Blob; width: number; height: number; fileName: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image file"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale while preserving aspect ratio if exceeding maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not initialize 2D canvas context"));
          return;
        }

        // Draw image (strips EXIF / GPS / device metadata completely)
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to modern WebP if supported, fallback to JPEG
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }
            const extension =
              blob.type === "image/webp"
                ? "webp"
                : blob.type === "image/jpeg"
                  ? "jpg"
                  : blob.type === "image/png"
                    ? "png"
                    : null;
            if (!extension) {
              reject(new Error("Unsupported compressed image format"));
              return;
            }

            const randSuffix = Math.random().toString(36).substring(2, 10);
            const fileName = `img_${Date.now()}_${randSuffix}.${extension}`;
            resolve({ blob, width, height, fileName, contentType: blob.type });
          },
          "image/webp",
          quality
        );
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
