import type { NextConfig } from "next";

// Cloudflare Pages — 순수 정적 export.
const config: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
};

export default config;
