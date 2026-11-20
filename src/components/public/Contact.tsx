"use client";

import { useState } from "react";
import { Phone, MessageCircle, Mail, MapPin, Clock, Copy, Check, ShieldCheck, Sparkles, Contact2, Navigation } from "lucide-react";
import { HotelProfile } from "@/types/database";
import { buildWhatsAppUrl, buildTelUrl } from "@/lib/utils";
import { downloadVCard } from "@/lib/vcard";

interface ContactProps {
  profile: HotelProfile;
}

export function Contact({ profile }: ContactProps) {
  const [copied, setCopied] = useState(false);

  const whatsappUrl = buildWhatsAppUrl(
    profile.whatsapp_number,
    profile.whatsapp_prefill || `Hello, I would like to make an inquiry at ${profile.name}.`
  );
  const telUrl = buildTelUrl(profile.phone);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(profile.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

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

          {/* Live Reception Indicator */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Front Desk Active &bull; Typical WhatsApp response in under 5 minutes</span>
          </div>
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

        {/* Fair Transit Guide */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-heritage-100 dark:bg-heritage-950 text-heritage-700 dark:text-heritage-400 flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-stone-100">
                  Fair Arrival Fare Guide (Avoid Tourist Touts)
                </h3>
                <p className="text-xs text-slate-500 dark:text-stone-400">
                  Typical government pre-paid / meter rates to reach {profile.name}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
              Verified Rates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-xs">
              <div className="font-bold text-slate-800 dark:text-stone-200">Jaipur Junction (4.8 km)</div>
              <div className="text-slate-500 dark:text-stone-400 mt-0.5">Pre-paid Auto: ~₹100–₹130 (15 min)</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-medium mt-1">E-Rickshaw: ~₹80</div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-xs">
              <div className="font-bold text-slate-800 dark:text-stone-200">Jaipur Airport (12 km)</div>
              <div className="text-slate-500 dark:text-stone-400 mt-0.5">Pre-paid Cab / Uber: ~₹380–₹450</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-medium mt-1">Direct via JLN Marg (25 min)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-xs">
              <div className="font-bold text-slate-800 dark:text-stone-200">Sindhi Camp Bus Stand (3.5 km)</div>
              <div className="text-slate-500 dark:text-stone-400 mt-0.5">Auto-rickshaw: ~₹80–₹110</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-medium mt-1">Direct via Ajmer Gate (12 min)</div>
            </div>
          </div>
        </div>

        {/* Copy Address Bar */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-heritage-100 dark:bg-heritage-950 text-heritage-700 dark:text-heritage-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400">
                Postal Address for Taxi / Auto-Rickshaw
              </div>
              <div className="text-sm font-medium text-slate-800 dark:text-stone-200 leading-snug">
                {profile.address}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => downloadVCard(profile)}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-heritage-700 hover:bg-heritage-800 text-white text-xs font-semibold transition-colors shadow-sm min-h-[40px]"
            >
              <Contact2 className="w-4 h-4 text-amber-200" />
              <span>Save Hotel to Phone (vCard)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyAddress}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-semibold text-slate-800 dark:text-stone-200 transition-colors min-h-[40px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Full Address</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
