import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Next.js's app/manifest.ts file convention auto-serves this at
// /manifest.webmanifest and links it in <head> — no extra wiring needed.
// English-only name/description here since this route has no locale
// awareness (it isn't nested under [lang]).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Thailand massage & spa guide`,
    short_name: SITE.name,
    description:
      "A Thailand massage & spa guide built around who's actually giving the massage — real Google reviews, therapist mentions surfaced automatically.",
    start_url: "/en",
    display: "standalone",
    background_color: "#0b0f0e",
    theme_color: "#0f766e",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android's adaptive-icon mask crops to a safe-zone circle roughly
      // 80% of the canvas -- these icons already qualify without a
      // dedicated maskable asset: solid background edge-to-edge (no
      // transparency to get clipped oddly) with a small centered glyph
      // that sits well inside that circle. Without a "maskable" entry at
      // all, Android was falling back to letterboxing the "any" icon on
      // the home screen instead of filling the adaptive icon shape.
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
