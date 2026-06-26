import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
    ];
  },
};

export default nextConfig;
