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
  async redirects() {
    return [
      {
        // The project's own Vercel alias serves the entire site, bypassing
        // Cloudflare completely: measured 2026-09-01, https://web-thaigle.vercel.app/
        // returned the full 1,043,789-byte homepage straight from the origin
        // with no cf-cache-status at all, and its robots.txt (the app's own,
        // not Cloudflare's) says `Allow: /`. Every crawler that has this
        // hostname bills an ISR read and its full weight in Fast Origin
        // Transfer, with none of the edge caching the real domain gets. The
        // canonical tag already pointed at www.thaigle.com, which fixes the
        // duplicate-content half of the problem and none of the billing half —
        // the crawler has downloaded the page by the time it reads a canonical.
        //
        // The host is matched exactly. Preview deployments are served from
        // web-thaigle-<hash>-<team>.vercel.app and are untouched.
        source: "/:path*",
        has: [{ type: "host", value: "web-thaigle.vercel.app" }],
        destination: "https://www.thaigle.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // 2026-09-01: the meters on the team that holds web-golf and
        // web-thaigle read ISR Reads 3.1M against a 1M limit and Fast Origin
        // Transfer 24.3 GB against 10 GB. The Cloudflare Cache Rule is working
        // — every path checked returns MISS then HIT, and the Age header on a
        // hit stays under the hour the origin asks for — the TTL was simply an
        // order of magnitude too short. The two sites prerender ~16,800 pages
        // between them, and 3.1M / 16,800 is ~6 origin fetches per URL per
        // day, comfortably inside what a one-hour edge TTL permits (24 per POP)
        // under continuous crawling. An hour buys nothing here: the pages
        // themselves declare `revalidate` of a day (thaigle) or a week (golf),
        // so Vercel already serves them that stale. Matching the edge to that
        // ceiling cuts the origin fetches from up to 24 a day per POP to 1.
        //
        // The cost: after a deploy the edge can keep serving the previous
        // build for up to a day. Purge the Cloudflare cache when you ship.
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" },
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
