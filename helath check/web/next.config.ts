import type { NextConfig } from "next";
import data from "./data/checkup_db.json";
import { CATEGORIES } from "./lib/i18n";

/**
 * Category names with no priced package behind them.
 *
 * The importers write everything as "comprehensive" or "age" and
 * fix_all_data.py redistributes those into the real categories, so eight of
 * the sixteen names in CATEGORIES end up holding zero rows. Google has the
 * URLs indexed from when they did hold rows, and an empty comparison table
 * served as a 200 is a soft 404.
 *
 * The redirect has to live here rather than in the page. `compare/loading.tsx`
 * puts a Suspense boundary above that route, so the shell is flushed with a
 * 200 before the component runs — neither `redirect()` in the body nor one in
 * `generateMetadata` (which streams alongside the body) can change the status
 * after that. next.config redirects are applied before routing, which is the
 * only place left that still owns the response line.
 */
const EMPTY_CATEGORIES = CATEGORIES.filter((cat) => {
  return !data.packages.some(
    (p) => p.category === cat && p.price != null && parseFloat(p.price) > 0,
  );
});

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  trailingSlash: false,
  turbopack: { root: __dirname },
  staticPageGenerationTimeout: 120,
  async redirects() {
    return [
      // 308, not 307. The site has no locale detection and never will resolve
      // "/" to anything but "/en", so a temporary redirect understates it:
      // Google keeps re-checking the origin and passes no signal through to
      // the target. `permanent: false` here was the site's single
      // highest-authority URL leaking its authority on every crawl.
      { source: "/", destination: "/en", permanent: true },
      // Legacy compare URLs used ?category= query params, which forced the
      // page into per-request SSR. Categories are now path segments
      // (/compare/[category], SSG). The alternation is the exact CATEGORIES
      // list — junk values fall through to the bare static page, which
      // ignores the query.
      {
        source: "/:locale/compare",
        has: [{
          type: "query",
          key: "category",
          value: "(?<category>comprehensive|executive|standard|cancer|cardiac|heart|women|men|senior|basic|diabetes|eye|liver|kidney|brain|dental)",
        }],
        destination: "/:locale/compare/:category",
        permanent: true,
      },
      // Categories that no longer hold anything — see EMPTY_CATEGORIES above.
      ...EMPTY_CATEGORIES.flatMap((cat) => [
        { source: `/:locale/compare/${cat}`, destination: "/:locale/compare", permanent: true },
        { source: `/:locale/checkup/${cat}`, destination: "/:locale/compare", permanent: true },
      ]),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          // Cloudflare fronts Vercel here and every HTML response comes back
          // `cf-cache-status: DYNAMIC` — the edge passes it through, so every
          // crawler hit reaches Vercel and bills an ISR read against the Hobby
          // quota shared with secondluxuryitems and chicpreowned, even though
          // `x-vercel-cache` says HIT. This site has ~2,600 prerendered pages,
          // far more than the other two, so it dominates that bill.
          //
          // Next's default `public, max-age=0, must-revalidate` reads to a
          // shared cache as "do not store". `max-age=0` stays so browsers keep
          // revalidating — package prices are refreshed daily.
          //
          // Only half the fix lives here: responses stay DYNAMIC until a
          // Cloudflare Cache Rule marks HTML eligible for cache.
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
