import type { NextConfig } from "next";

const config: NextConfig = {
  // master_db.json 큰 사이즈 대비 Edge 런타임 안 씀
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 604800, // 7일 — clinic photos rarely change, reduces re-optimization count
    deviceSizes: [640, 750, 1080, 1920], // trim default 8 sizes → 4 (mobile-first site)
    imageSizes: [64, 128, 256],
    remotePatterns: [
      // Google Maps place photos (Street View / Places API)
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default config;
