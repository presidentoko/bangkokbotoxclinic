import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const cfg = getSiteConfig();
  return {
    name: cfg.brand,
    short_name: cfg.brand.split(" ")[0] || "Restaurants",
    description: cfg.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: cfg.themeAccent,
    orientation: "portrait",
    categories: ["food", "lifestyle", "travel"],
    lang: "en",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
