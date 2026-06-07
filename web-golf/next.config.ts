import type { NextConfig } from "next";

const config: NextConfig = {
  trailingSlash: false,
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
