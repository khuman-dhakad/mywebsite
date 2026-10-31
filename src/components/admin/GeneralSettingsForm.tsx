"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Save, Loader2 } from "lucide-react";
import { updateHotelProfile } from "@/app/admin/actions";
import { HotelProfile } from "@/types/database";

interface GeneralSettingsFormProps {
  profile: HotelProfile;
}

export function GeneralSettingsForm({ profile }: GeneralSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateHotelProfile(null, formData);

    setLoading(false);
    if (result.success) {
      setToast({ type: "success", text: result.message || "Changes saved successfully!" });
      setTimeout(() => setToast(null), 5000);
    } else {
      setToast({ type: "error", text: result.error || "Failed to save changes." });
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white border-emerald-500"
              : "bg-red-600 text-white border-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="font-semibold text-sm">{toast.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-stone-900 rounded-2xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm">
        {/* Section 1: Property Identity */}
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-stone-100 mb-1">
            Hotel Identity & Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mb-6">
            Basic details shown prominently in the hero section and navigation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                Hotel Name <span className="font-normal text-slate-400">(होटल का नाम)</span> *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={profile.name}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="tagline" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                Tagline <span className="font-normal text-slate-400">(टैगलाइन)</span>
              </label>
              <input
                id="tagline"
                name="tagline"
                type="text"
                defaultValue={profile.tagline || ""}
                placeholder="e.g. Authentic Rajasthani Hospitality"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="hero_subtitle" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                Hero Subtitle (Short Intro)
              </label>
              <input
                id="hero_subtitle"
                name="hero_subtitle"
                type="text"
                defaultValue={profile.hero_subtitle || ""}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="about_text" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                About Story <span className="font-normal text-slate-400">(होटल के बारे में जानकारी)</span> *
              </label>
              <textarea
                id="about_text"
                name="about_text"
                rows={5}
                required
                defaultValue={profile.about_text || ""}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-stone-100 mb-1">
            Contact & WhatsApp Booking
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mb-6">
            Direct numbers used for the mobile sticky bar, floating button, and call actions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                Phone Number <span className="font-normal text-slate-400">(कॉलिंग नंबर)</span> *
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                defaultValue={profile.phone}
                placeholder="+91 98290 12345"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 font-mono focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="whatsapp_number" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                WhatsApp Number <span className="font-normal text-slate-400">(व्हाट्सएप नंबर)</span> *
              </label>
              <input
                id="whatsapp_number"
                name="whatsapp_number"
                type="text"
                required
                defaultValue={profile.whatsapp_number}
                placeholder="+919829012345"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 font-mono focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={profile.email || ""}
                placeholder="stay@hotel.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="reception_hours" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                Front Desk Hours
              </label>
              <input
                id="reception_hours"
                name="reception_hours"
                type="text"
                defaultValue={profile.reception_hours || "24 Hours Front Desk"}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="whatsapp_prefill" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                WhatsApp Default Prefilled Message
              </label>
              <input
                id="whatsapp_prefill"
                name="whatsapp_prefill"
                type="text"
                defaultValue={profile.whatsapp_prefill || ""}
                placeholder="Hello, I found your hotel online and have a query about rooms."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Location & Map Embed */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-stone-100 mb-1">
            Location & Google Map
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mb-6">
            Help guests find your lodge easily with address details and embedded map.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                Full Street Address <span className="font-normal text-slate-400">(पूरा पता)</span> *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                defaultValue={profile.address}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                City <span className="font-normal text-slate-400">(शहर)</span> *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                defaultValue={profile.city}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                State <span className="font-normal text-slate-400">(राज्य)</span> *
              </label>
              <input
                id="state"
                name="state"
                type="text"
                required
                defaultValue={profile.state}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="google_map_embed_url" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                Google Maps Embed URL (Must start with https://www.google.com/maps/embed)
              </label>
              <input
                id="google_map_embed_url"
                name="google_map_embed_url"
                type="url"
                defaultValue={profile.google_map_embed_url || ""}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Note: In Google Maps, click Share &rarr; Embed a map &rarr; Copy HTML &rarr; paste the src attribute here.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: SEO Metadata */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-stone-100 mb-1">
            Search Engine Optimization (SEO)
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mb-6">
            Configure how your lodge appears on Google search results and WhatsApp link previews.
          </p>

          <div className="space-y-5">
            <div>
              <label htmlFor="seo_title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                Google Search Title (Max 70 chars)
              </label>
              <input
                id="seo_title"
                name="seo_title"
                type="text"
                maxLength={70}
                defaultValue={profile.seo_title || ""}
                placeholder="Shanti Nivas Heritage Lodge | Best Budget Hotel in Jaipur"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="seo_description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2">
                Google Meta Description (Max 160 chars)
              </label>
              <textarea
                id="seo_description"
                name="seo_description"
                rows={2}
                maxLength={160}
                defaultValue={profile.seo_description || ""}
                placeholder="Comfortable AC rooms in Jaipur from ₹999/night. Free Wi-Fi, 24-hr hot water, pure veg dining. Book directly on WhatsApp."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-heritage-600"
              />
            </div>
          </div>
        </div>

        {/* Save Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-heritage-700 hover:bg-heritage-800 text-white font-semibold text-sm shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-heritage-600 disabled:opacity-50 min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes (बदलाव सेव करें)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
