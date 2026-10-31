import { HotelProfile, FAQ } from "@/types/database";

interface StructuredDataProps {
  profile: HotelProfile;
  faqs: FAQ[];
  siteUrl: string;
}

/**
 * Safely serializes JSON-LD avoiding script injection and adhering strictly
 * to the requirement: "Never use dangerouslySetInnerHTML"
 */
function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

export function StructuredData({ profile, faqs, siteUrl }: StructuredDataProps) {
  // Hotel / LodgingBusiness JSON-LD Schema
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${siteUrl}/#hotel`,
    name: profile.name,
    description: profile.seo_description || profile.about_text?.substring(0, 200),
    url: siteUrl,
    telephone: profile.phone,
    image: [profile.hero_image_url].filter(Boolean),
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Net Banking",
    checkinTime: profile.check_in_time || "12:00:00",
    checkoutTime: profile.check_out_time || "11:00:00",
    address: {
      "@type": "PostalAddress",
      streetAddress: profile.address,
      addressLocality: profile.city,
      addressRegion: profile.state,
      postalCode: profile.postal_code || "302002",
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [profile.social_facebook, profile.social_instagram].filter(Boolean),
  };

  // FAQPage JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json">
        {safeJsonLd(hotelSchema)}
      </script>
      {faqs.length > 0 && (
        <script type="application/ld+json">
          {safeJsonLd(faqSchema)}
        </script>
      )}
    </>
  );
}
