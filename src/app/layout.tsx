import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site.config";
import { getHotelProfile } from "@/lib/data";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#b45309",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getHotelProfile();
  const title = profile.seo_title || `${profile.name} | Budget Hotel in ${profile.city}`;
  const description =
    profile.seo_description ||
    `Book rooms directly at ${profile.name}, ${profile.city}. Clean AC rooms with hot water, free Wi-Fi, and 24-hr front desk. Zero booking fees.`;
  const heroImage = profile.hero_image_url || siteConfig.defaultHeroImage;
  const canonicalUrl = siteConfig.siteUrl;

  return {
    metadataBase: new URL(canonicalUrl),
    title: {
      default: title,
      template: `%s | ${profile.name}`,
    },
    description,
    keywords: profile.seo_keywords || siteConfig.seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      siteName: profile.name,
      title,
      description,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: `${profile.name} in ${profile.city}, India`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-amber-200 selection:text-amber-900 dark:selection:bg-amber-900 dark:selection:text-amber-100">
        {children}
      </body>
    </html>
  );
}
