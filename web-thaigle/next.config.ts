import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    // Default worker count is based on CPU cores, which on a memory-
    // constrained/shared machine can overcommit RAM once thousands of
    // Satori OG-image renders run concurrently and get silently killed.
    // Size the pool off available memory instead.
    memoryBasedWorkersCount: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
    // Source images are already server-resized thumbnails (w203 etc.) so the
    // built-in optimizer buys nothing — and Vercel Hobby caps source images
    // at 1,000/month while this site references ~9,000 unique photo URLs.
    unoptimized: true,
  },
};

export default config;
