import type { NextConfig } from "next";

const config: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      // Non-www → www (permanent 301 — consolidates all authority to www)
      {
        source: "/:path*",
        has: [{ type: "host", value: "thailandgolfguide.com" }],
        destination: "https://www.thailandgolfguide.com/:path*",
        permanent: true,
      },
      // City alias — Pattaya is within Chon Buri province; merge page authority
      {
        source: "/city/pattaya",
        destination: "/city/chon_buri",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "*.ggpht.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "*.naver.com" },
      { protocol: "https", hostname: "*.nstatic.net" },
    ],
  },
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
};

export default config;
