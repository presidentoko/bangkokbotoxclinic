import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    // Konvy CDN sources
    remotePatterns: [
      { protocol: "https", hostname: "s2.konvy.com" },
      { protocol: "https", hostname: "s1.konvy.com" },
    ],
    // Free plan: cap device sizes to avoid excessive optimization variants.
    // We only need small thumbnails (card strips) + one medium (product hero).
    deviceSizes: [640, 1080],
    imageSizes: [72, 120, 200],
    // Keep originals cached for 7 days to reduce re-optimization calls.
    minimumCacheTTL: 604800,
  },
};

export default nextConfig;
