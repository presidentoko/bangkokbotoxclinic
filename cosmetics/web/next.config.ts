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
    // We only need small thumbnails (card strips) + one medium (product hero).
    deviceSizes: [640, 1080],
    imageSizes: [72, 120, 200],
    // Keep originals cached 30 days — reduces Vercel image optimization quota consumption.
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;
