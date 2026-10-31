import { Phone, MessageCircle, Mail, MapPin, Clock, CalendarCheck } from "lucide-react";
import { HotelProfile } from "@/types/database";
import { buildWhatsAppUrl, buildTelUrl } from "@/lib/utils";

interface ContactProps {
  profile: HotelProfile;
}

export function Contact({ profile }: ContactProps) {
  const whatsappUrl = buildWhatsAppUrl(
    profile.whatsapp_number,
    profile.whatsapp_prefill || `Hello, I would like to make an inquiry at ${profile.name}.`
  );
  const telUrl = buildTelUrl(profile.phone);

  return (
    <section id="contact" className="scroll-mt-[68px] md:scroll-mt-0 py-12 sm:py-20 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-heritage-700 dark:text-heritage-400">
            Get in Touch
          </span>
          <h2 className="font-serif text-[26px] sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-stone-100 tracking-tight mt-2 mb-3">
            Contact Information & Inquiries
          </h2>
          <div className="w-16 h-1 bg-heritage-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-600 dark:text-stone-300 text-base">
            Reach out directly for instant booking confirmations, special group discounts, or route queries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Phone Call Card */}
          <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-heritage-100 dark:bg-heritage-950 text-heritage-700 dark:text-heritage-400 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-stone-100 mb-1">
                Direct Phone Call
              </h3>
              <p className="text-xs text-slate-500 dark:text-stone-400 mb-4">
                Available 24 hours for immediate assistance
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-stone-100 font-mono">
                {profile.phone}
              </p>
            </div>
            <a
              href={telUrl}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-slate-300 dark:border-stone-700 hover:border-slate-400 text-slate-800 dark:text-stone-200 font-semibold text-sm transition-colors min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-heritage-700" />
              <span>Call Now</span>
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-stone-100 mb-1">
                WhatsApp Chat & Booking
              </h3>
              <p className="text-xs text-slate-500 dark:text-stone-400 mb-4">
                Fastest way to get room photos and booking confirmation
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-stone-100 font-mono">
                {profile.whatsapp_number}
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open WhatsApp</span>
            </a>
          </div>

          {/* Reception Hours & Schedule */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-stone-100 mb-1">
                Desk Hours & Timings
              </h3>
              <p className="text-xs text-slate-500 dark:text-stone-400 mb-4">
                Front desk check-in schedule
              </p>
              <div className="space-y-2 text-sm text-slate-700 dark:text-stone-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-stone-400">Front Desk:</span>
                  <span className="font-semibold">{profile.reception_hours || "24 Hours"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-stone-400">Standard Check-In:</span>
                  <span className="font-semibold">{profile.check_in_time || "12:00 PM"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-stone-400">Standard Check-Out:</span>
                  <span className="font-semibold">{profile.check_out_time || "11:00 AM"}</span>
                </div>
              </div>
            </div>

            {profile.email && (
              <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center gap-2 text-xs text-slate-600 dark:text-stone-400">
                <Mail className="w-4 h-4 text-heritage-600 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
