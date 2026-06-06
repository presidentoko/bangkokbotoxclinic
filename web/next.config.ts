import type { NextConfig } from "next";

const config: NextConfig = {
  // master_db.json 큰 사이즈 대비 Edge 런타임 안 씀
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24h — clinic photos don't change often
    remotePatterns: [
      // Google Maps place photos (Street View / Places API)
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  compress: true,
};

export default config;
