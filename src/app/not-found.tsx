import Link from "next/link";
import { Compass, Home, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { buildWhatsAppUrl, buildTelUrl } from "@/lib/utils";

export default function NotFound() {
  const whatsappUrl = buildWhatsAppUrl(
    siteConfig.contact.whatsapp,
    `Hello ${siteConfig.branding.hotelName}, I was looking for a page on your website that could not be found.`
  );
  const telUrl = buildTelUrl(siteConfig.contact.phone);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4 py-16">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 text-center shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-heritage-100 dark:bg-heritage-950 text-heritage-700 dark:text-heritage-400 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-7 h-7" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-heritage-700 dark:text-heritage-400">
          404 &bull; Page Not Found
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-stone-100 mt-1 mb-2">
          Lost in the Pink City?
        </h1>
        <p className="text-sm text-slate-600 dark:text-stone-300 leading-relaxed mb-6">
          The page or room you are looking for has been moved or does not exist. Explore our rooms or return to our homepage.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-heritage-700 hover:bg-heritage-800 text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/#rooms"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-200 text-sm font-medium transition-colors min-h-[44px]"
          >
            <span>View Available Rooms & Tariffs</span>
          </Link>
        </div>

        {/* Contact Links */}
        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-center gap-4 text-xs font-semibold">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>
          <span className="text-stone-300 dark:text-stone-700">&bull;</span>
          <a
            href={telUrl}
            className="inline-flex items-center gap-1.5 text-heritage-700 dark:text-heritage-400 hover:underline"
          >
            <Phone className="w-4 h-4" />
            <span>{siteConfig.contact.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
