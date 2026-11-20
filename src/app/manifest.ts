import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.branding.hotelName,
    short_name: siteConfig.branding.hotelName.split(" ")[0] || "Hotel",
    description: siteConfig.seo.defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#b45309",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
