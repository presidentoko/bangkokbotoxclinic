import type { NextConfig } from "next";
import legacy from "./data/legacy_redirects.json";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Cloudflare sits in front of Vercel here, and every HTML response
        // comes back `cf-cache-status: DYNAMIC` — the edge passes it straight
        // through, so every bot hit reaches Vercel and bills against the
        // (shared, already-overrun) Hobby quota even when `x-vercel-cache` is
        // HIT. Next's default `public, max-age=0, must-revalidate` reads to a
        // shared cache as "do not store", so give it an s-maxage to store.
        //
        // `max-age=0` stays: browsers should still revalidate their own copy,
        // since prices change daily. This alone will NOT flip DYNAMIC — a
        // Cloudflare Cache Rule marking HTML eligible for cache is still
        // required; this is the half that lives in the repo.
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },

  // This domain used to publish the same model pages as chicpreowned.com.
  // Each of those URLs now points at the page that answers its question —
  // the value page there, or a tool here. Generated and destination-checked
  // by scraper/build_redirects.py; regenerate rather than edit.
  async redirects() {
    return [
      ...(legacy as { source: string; destination: string; permanent: boolean }[]),
    ]
  },
};

export default nextConfig;
