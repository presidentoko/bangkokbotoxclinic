import type { NextConfig } from "next";

const config: NextConfig = {
  trailingSlash: false,
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
};

export default config;
