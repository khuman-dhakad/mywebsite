import Link from "next/link";
import { Lock, Phone, MessageCircle, MapPin, Heart } from "lucide-react";
import { HotelProfile } from "@/types/database";
import { buildWhatsAppUrl, buildTelUrl } from "@/lib/utils";

interface FooterProps {
  profile: HotelProfile;
}

export function Footer({ profile }: FooterProps) {
  const whatsappUrl = buildWhatsAppUrl(profile.whatsapp_number, `Hello ${profile.name}`);
  const telUrl = buildTelUrl(profile.phone);

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 md:pt-16 pb-[calc(84px+env(safe-area-inset-bottom,0px))] md:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
              {profile.name}
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              {profile.tagline || "Authentic hospitality and peaceful heritage stay in India."}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.city}, {profile.state}, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  About the Lodge
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  Rooms & Tariffs
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  Photo Tour
                </a>
              </li>
              <li>
                <a href="#amenities" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  Amenities & Facilities
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  Map & Directions
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors focus:outline-none focus:underline">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Direct Contact
            </h4>
            <div className="space-y-3 text-sm text-stone-300">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{profile.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={telUrl} className="hover:text-white font-mono">
                  {profile.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white font-mono">
                  {profile.whatsapp_number}
                </a>
              </p>
            </div>
          </div>

          {/* Owner Login & Security Notice */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Hotel Management
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Are you the hotel manager or owner? Log in to update room rates, add photos, or edit guest details.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Owner Admin Login</span>
            </Link>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span>Crafted for Indian Hospitality with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
