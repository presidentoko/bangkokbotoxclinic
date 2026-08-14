import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,
  // Each static-generation worker parses the full data/*.json (44MB+ and
  // growing with Bangkok collection) independently. Unbounded worker count
  // (Vercel's memoryBasedWorkersCount doesn't drop below 4) has already
  // crashed one build via OOM at 15,549 pages; capping concurrency trades a
  // slower local build (~12s -> ~25s) for headroom as the page count grows.
  experimental: {
    cpus: 4,
    staticGenerationMaxConcurrency: 4,
  },
  // places-index.json / search-index.json used to ship `max-age=0,
  // must-revalidate` (Next's static-file default), forcing a full
  // conditional request -- and after a 304, a fresh TLS+edge round trip --
  // on every single homepage/search/favorites/compare visit even though the
  // content only changes once per deploy. A short max-age lets the browser
  // skip the network entirely for repeat views within the window instead of
  // re-validating every time; still short enough that a stale build doesn't
  // linger long client-side.
  async headers() {
    return [
      {
        source: "/:file(places-index|search-index)\\.json",
        headers: [{ key: "Cache-Control", value: "public, max-age=300, must-revalidate" }],
      },
    ];
  },
};

export default config;
