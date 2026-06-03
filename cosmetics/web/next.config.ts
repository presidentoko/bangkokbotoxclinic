import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s2.konvy.com" },
      { protocol: "https", hostname: "s1.konvy.com" },
    ],
  },
};

export default nextConfig;
