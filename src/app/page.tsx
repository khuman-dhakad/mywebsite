import { Header } from "@/components/public/Header";
import { Hero } from "@/components/public/Hero";
import { About } from "@/components/public/About";
import { Rooms } from "@/components/public/Rooms";
import { Gallery } from "@/components/public/Gallery";
import { Amenities } from "@/components/public/Amenities";
import { Location } from "@/components/public/Location";
import { Contact } from "@/components/public/Contact";
import { Faq } from "@/components/public/Faq";
import { Footer } from "@/components/public/Footer";
import { FloatingWhatsApp } from "@/components/public/FloatingWhatsApp";
import { MobileBottomBar } from "@/components/public/MobileBottomBar";
import { StructuredData } from "@/components/public/StructuredData";
import {
  getHotelProfile,
  getRooms,
  getPhotos,
  getAmenities,
  getFaqs,
} from "@/lib/data";
import { siteConfig } from "@/config/site.config";

// ISR: revalidate periodically or on-demand when admin updates content
export const revalidate = 60;

export default async function HomePage() {
  const [profile, rooms, photos, amenities, faqs] = await Promise.all([
    getHotelProfile(),
    getRooms(),
    getPhotos(),
    getAmenities(),
    getFaqs(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Search Engine Structured Data (JSON-LD) */}
      <StructuredData
        profile={profile}
        faqs={faqs}
        siteUrl={siteConfig.siteUrl}
      />

      {/* Sticky Header with CTAs */}
      <Header profile={profile} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero profile={profile} />
        <About profile={profile} />
        <Rooms rooms={rooms} profile={profile} />
        <Gallery photos={photos} hotelName={profile.name} />
        <Amenities amenities={amenities} />
        <Location profile={profile} />
        <Contact profile={profile} />
        <Faq faqs={faqs} profile={profile} />
      </main>

      {/* Footer */}
      <Footer profile={profile} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp
        whatsappNumber={profile.whatsapp_number}
        hotelName={profile.name}
        prefillMessage={profile.whatsapp_prefill}
      />

      {/* Mobile Sticky Bottom Bar (Call, WhatsApp, Directions) */}
      <MobileBottomBar
        phone={profile.phone}
        whatsappNumber={profile.whatsapp_number}
        hotelName={profile.name}
        address={profile.address}
        directionsUrl={profile.google_map_directions_url}
        prefillMessage={profile.whatsapp_prefill}
      />
    </div>
  );
}
