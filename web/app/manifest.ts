import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const cfg = getSiteConfig();
  return {
    name: cfg.brand,
    short_name: cfg.brand.split(" ")[0] || "Clinics",
    description: cfg.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: cfg.themeAccent,
    orientation: "portrait",
    categories: ["medical", "health", "lifestyle", "travel"],
    lang: "en",
    icons: [
      // Next.js auto-generates /icon from app/icon.tsx (32x32 PNG)
      // For PWA we point to the same icon — Next 14+ resolves it.
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/icon", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
