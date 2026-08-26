import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

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
  async headers() {
    return [
      {
        // Cloudflare fronts Vercel on this domain and every HTML response
        // comes back `cf-cache-status: DYNAMIC`, so the edge passes it
        // straight through: each crawler hit reaches Vercel and bills an ISR
        // read, even while `x-vercel-cache` reports HIT. With ~15,800
        // prerendered pages that is the single largest line on the bill.
        //
        // Next's default `public, max-age=0, must-revalidate` reads to a
        // shared cache as "do not store". `max-age=0` stays so browsers keep
        // revalidating; `s-maxage` is what lets the edge hold a copy, and an
        // hour is well inside the 24h `revalidate` the pages already use.
        //
        // This is only half the fix — responses stay DYNAMIC until a
        // Cloudflare Cache Rule marks HTML eligible for cache.
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=604800" },
        ],
      },
      {
        // Must come after the blanket rule — later rules win on a duplicate
        // key. Caching these would be a correctness bug, not just a stale
        // page: /api/resolve-link rate-limits per IP and would start sharing
        // one caller's allowance and results with everyone, /api/admin-auth
        // is authentication, and /api/cron/indexnow must actually run.
        source: "/api/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
      {
        // The venue badge is a static SVG keyed entirely by its path, and it
        // is embedded on other people's sites — exactly what a shared cache
        // is for.
        source: "/api/badge/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/admin/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default config;
