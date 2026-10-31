import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

interface FloatingWhatsAppProps {
  whatsappNumber: string;
  hotelName: string;
  prefillMessage?: string | null;
}

export function FloatingWhatsApp({ whatsappNumber, hotelName, prefillMessage }: FloatingWhatsAppProps) {
  const message =
    prefillMessage ||
    `Hello! I found ${hotelName} online and have a query about rooms and pricing.`;

  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, message);

  return (
    <aside aria-label="WhatsApp quick chat" className="hidden md:block fixed md:bottom-6 right-5 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${hotelName} on WhatsApp`}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400 min-h-[48px] min-w-[48px]"
      >
        <MessageCircle className="w-6 h-6 fill-current animate-pulse group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline font-semibold text-sm tracking-wide">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
}
