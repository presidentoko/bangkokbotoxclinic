import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    // Konvy CDN sources
    remotePatterns: [
      { protocol: "https", hostname: "s2.konvy.com" },
      { protocol: "https", hostname: "s1.konvy.com" },
      { protocol: "https", hostname: "cdn.thebeautrium.com" },
    ],
    // Free plan: cap device sizes to avoid excessive optimization variants.
    // No next/image usage in this app renders wider than ~200px (all are
    // card thumbnails) — 1,002 products x 5 prior widths (640/1080/72/120/200)
    // hit exactly the 5K/month transformation cap. Down to 2 widths keeps
    // headroom (1,002 x 2 ≈ 2K) without visibly degrading any thumbnail.
    deviceSizes: [640],
    imageSizes: [72, 200],
    // Keep originals cached 30 days — reduces Vercel image optimization quota consumption.
    minimumCacheTTL: 2592000,
  },
  async redirects() {
    return [
      // ja locale was removed (commit 67c78f7) but old hreflang alternates
      // are still crawled by Google — send them to the th equivalent
      // instead of leaving a permanent 404.
      { source: "/ja", destination: "/th", permanent: true },
      { source: "/ja/:path*", destination: "/th/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
