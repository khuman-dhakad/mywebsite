import Image from "next/image";
import { MessageCircle, Phone, Sparkles, MapPin, CheckCircle2 } from "lucide-react";
import { buildWhatsAppUrl, buildTelUrl } from "@/lib/utils";
import { HotelProfile } from "@/types/database";

interface HeroProps {
  profile: HotelProfile;
}

export function Hero({ profile }: HeroProps) {
  const whatsappUrl = buildWhatsAppUrl(
    profile.whatsapp_number,
    profile.whatsapp_prefill || `Hello, I want to book a room at ${profile.name}.`
  );
  const telUrl = buildTelUrl(profile.phone);
  const heroImage =
    profile.hero_image_url ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80";

  return (
    <section className="relative overflow-hidden bg-stone-50 dark:bg-stone-950 pt-12 pb-12 md:pt-8 md:pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top Local Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-heritage-100 dark:bg-heritage-950/80 border border-heritage-200 dark:border-heritage-800 text-heritage-800 dark:text-heritage-300 text-xs sm:text-sm font-semibold mb-4 w-fit">
              <MapPin className="w-4 h-4 text-heritage-600" />
              <span>
                {profile.city}, {profile.state} &bull; Best Direct Rate Guaranteed
              </span>
            </div>

            {/* Exactly One H1 for SEO (34px on mobile, 36px-60px on desktop) */}
            <h1 className="font-serif text-[34px] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-stone-50 tracking-tight leading-[1.2] md:leading-[1.15] mb-4">
              {profile.name}
            </h1>

            {/* Tagline */}
            {profile.tagline && (
              <p className="text-base sm:text-lg md:text-xl font-medium text-heritage-700 dark:text-heritage-400 mb-3">
                {profile.tagline}
              </p>
            )}

            {/* Subtitle / Description (16px base with 1.6 line-height on mobile) */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-stone-300 leading-relaxed mb-8 max-w-2xl">
              {profile.hero_subtitle ||
                "Experience clean, comfortable, and budget-friendly stay with 24/7 hot water, high-speed Wi-Fi, and traditional hospitality steps from city attractions."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 min-h-[48px]"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Book on WhatsApp</span>
              </a>

              <a
                href={telUrl}
                className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-slate-300 dark:border-stone-700 hover:border-slate-400 text-slate-900 dark:text-stone-100 font-semibold text-base bg-white dark:bg-stone-900 hover:bg-slate-50 dark:hover:bg-stone-800 transition-all focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[48px]"
              >
                <Phone className="w-5 h-5 text-heritage-700 dark:text-heritage-400" />
                <span>Call Now: {profile.phone}</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-stone-800">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-stone-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>0% Commission</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-stone-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pay via UPI / Cash</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-stone-300 col-span-2 sm:col-span-1">
                <Sparkles className="w-4 h-4 text-heritage-600 shrink-0" />
                <span>Verified Family Lodge</span>
              </div>
            </div>
          </div>

          {/* Hero Image Container with LCP Priority */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800">
              <Image
                src={heroImage}
                alt={`${profile.name} exterior and accommodation in ${profile.city}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800 dark:text-stone-200">
                ⭐ 4.8 Direct Host Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
