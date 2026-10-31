import { Phone, MessageCircle, Navigation } from "lucide-react";
import { buildWhatsAppUrl, buildTelUrl } from "@/lib/utils";

interface MobileBottomBarProps {
  phone: string;
  whatsappNumber: string;
  hotelName: string;
  address: string;
  directionsUrl?: string | null;
  prefillMessage?: string | null;
}

export function MobileBottomBar({
  phone,
  whatsappNumber,
  hotelName,
  address,
  directionsUrl,
  prefillMessage,
}: MobileBottomBarProps) {
  const telUrl = buildTelUrl(phone);
  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    prefillMessage || `Hello, I found ${hotelName} online and want to check room availability.`
  );
  const mapUrl =
    directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${hotelName} ${address}`)}`;

  return (
    <nav
      data-mobile-bottom-bar
      aria-label="Quick Mobile Actions"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-slate-200 dark:border-stone-800 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] px-3 pt-2"
      style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom, 8px))" }}
    >
      <div className="grid grid-cols-3 gap-2 w-full">
        {/* Call Button */}
        <a
          href={telUrl}
          className="flex flex-col items-center justify-center h-[56px] min-h-[56px] px-1 rounded-xl bg-slate-100 dark:bg-stone-800 text-slate-800 dark:text-stone-200 hover:bg-slate-200 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-heritage-600"
          aria-label={`Call hotel at ${phone}`}
        >
          <Phone className="w-5 h-5 text-heritage-700 dark:text-heritage-400" />
          <span className="text-xs font-bold mt-1">Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center h-[56px] min-h-[56px] px-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label="Message on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="text-xs font-bold mt-1">WhatsApp</span>
        </a>

        {/* Directions Button */}
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center h-[56px] min-h-[56px] px-1 rounded-xl bg-slate-100 dark:bg-stone-800 text-slate-800 dark:text-stone-200 hover:bg-slate-200 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-heritage-600"
          aria-label="Get Google Maps directions"
        >
          <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold mt-1">Directions</span>
        </a>
      </div>
    </nav>
  );
}
