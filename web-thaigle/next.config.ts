import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    // Static generation concurrency, pinned rather than inferred.
    //
    // This used to be `memoryBasedWorkersCount: true`, on the theory that
    // sizing the pool off free memory would stop thousands of Satori OG
    // renders from overcommitting RAM. It can't: that option enforces a floor
    // of 4 workers no matter how little memory it finds, so on Vercel's build
    // container it always ran 4. At 14,095 pages the V8 heap in one of those
    // workers hit its ceiling and aborted (SIGABRT) — the build passed locally
    // on 16 GB and failed on the builder.
    //
    // Two workers × 4 concurrent pages instead of 4 × 8 quarters peak heap.
    // It costs build minutes, which are not the scarce resource here.
    //
    // `cpus` must be paired with dropping memoryBasedWorkersCount: when that
    // flag is on it wins over any cpus value equal to the machine default.
    cpus: 2,
    staticGenerationMaxConcurrency: 4,
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
