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

/**
 * First path segments Google indexed that were never locales.
 *
 * `app/[locale]` used to accept any string, so a spell of bad internal links
 * and a sister-site template left whole copies of the site parked under these
 * prefixes — "/&/guide/mri-scan-cost-bangkok",
 * "/dental-clinic-marketing/hospital/vejthani",
 * "/privacy-policy/compare?category=women". All hard 404s now, and together
 * they still hold 25 clicks and ~2,300 impressions in the 2026-08-25 Search
 * Console export, more than several real sections of the site.
 *
 * The path after the prefix is always a genuine route, so it 308s to the /en
 * copy. The value here is where the *bare* prefix goes, which is not always
 * /en: "faq" and "privacy-policy" are page names as well as junk prefixes, and
 * someone landing on /privacy-policy wants the privacy page.
 *
 * "&" is a literal path segment, not a query string. path-to-regexp treats it
 * as a literal, so it needs no escaping.
 */
const JUNK_LOCALE_PREFIXES: Record<string, string> = {
  "&": "/en",
  "dental-clinic-marketing": "/en",
  "hair-transplant-clinic-marketing": "/en",
  "services": "/en",
  "blog": "/en",
  "category": "/en",
  "faq": "/en/faq",
  "privacy-policy": "/en/privacy",
};

/**
 * Cities with a /city page but no hospital behind it.
 *
 * The route pre-renders all 22 CITY_SLUGS while the catalogue only covers
 * five, so seventeen of them answer 200 with "No packages found" — a soft 404
 * that the home page's city grid and the footer both link into. Every one of
 * them has a real guide page, so send the request there instead of to an empty
 * table. Derived from the data rather than listed, so restoring a city's
 * hospitals removes its redirect automatically.
 */
const CITY_TO_GUIDE: Record<string, string> = {
  "bangkok": "bangkok", "chiang-mai": "chiang-mai", "phuket": "phuket",
  "pattaya": "pattaya", "hua-hin": "hua-hin", "ko-samui": "koh-samui",
  "krabi": "krabi", "chiang-rai": "chiang-rai", "hat-yai": "hat-yai",
  "khon-kaen": "khon-kaen", "koh-chang": "koh-chang", "udon-thani": "udon-thani",
  "korat": "korat", "ayutthaya": "ayutthaya", "chon-buri": "chon-buri",
  "nakhon-si-thammarat": "nakhon-si-thammarat", "lampang": "lampang",
  "nakhon-pathom": "nakhon-pathom", "rayong": "rayong",
  "surat-thani": "surat-thani", "phitsanulok": "phitsanulok", "trang": "trang",
};

const CITIES_WITH_PACKAGES = new Set(
  data.packages
    .filter((p) => p.price != null && parseFloat(p.price) > 0)
    .map((p) => data.hospitals.find((h) => h.id === p.hospital_id)?.city)
    .filter((c): c is string => !!c)
    .map((c) => c.toLowerCase().replace(/\s+/g, "-")),
);

const EMPTY_CITIES = Object.keys(CITY_TO_GUIDE).filter(
  (slug) => !CITIES_WITH_PACKAGES.has(slug),
);

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
  compress: true,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
  async redirects() {
    return [
      // 308, not 307. The site has no locale detection and never will resolve
      // "/" to anything but "/en", so a temporary redirect understates it:
      // Google keeps re-checking the origin and passes no signal through to
      // the target. `permanent: false` here was the site's single
      // highest-authority URL leaking its authority on every crawl.
      {
        // The project's own Vercel alias serves the whole site with Cloudflare
        // nowhere in the path: measured 2026-09-01, /en on
        // web-xi-two-ayecjpc8xy.vercel.app came back as 139,938 bytes straight
        // from the origin, no cf-cache-status and no noindex. Every crawler
        // holding this hostname bills an ISR read and the page's full weight in
        // Fast Origin Transfer with none of the edge caching www gets. The
        // deployment URLs (web-<hash>-yunmin.vercel.app) sit behind Vercel SSO
        // and are unaffected; this alias was the one open door.
        //
        // First, so it wins before the locale rules below rewrite the path.
        source: "/:path*",
        has: [{ type: "host", value: "web-xi-two-ayecjpc8xy.vercel.app" }],
        destination: "https://www.bangkoktopclinic.com/:path*",
        permanent: true,
      },
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
      // Non-locale first segments — see JUNK_LOCALE_PREFIXES above. These run
      // before middleware, so the hospital rescue never sees a junk locale.
      // The bare-prefix rule has to come first: ":path*" matches zero segments
      // too, so "/faq" would otherwise be caught by the wildcard and land on
      // "/en" instead of the FAQ page.
      ...Object.entries(JUNK_LOCALE_PREFIXES).flatMap(([prefix, bare]) => [
        { source: `/${prefix}`, destination: bare, permanent: true },
        { source: `/${prefix}/:path*`, destination: "/en/:path*", permanent: true },
      ]),
      // Cities whose /city page has nothing to list — see EMPTY_CITIES above.
      ...EMPTY_CITIES.map((slug) => ({
        source: `/:locale/city/${slug}`,
        destination: `/:locale/guide/${CITY_TO_GUIDE[slug]}-health-checkup`,
        permanent: true,
      })),
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
          //
          // 2026-09-01: the Cache Rule is in place and every page type now
          // returns MISS then HIT, but the meters kept climbing, and the same
          // arithmetic that explained web-golf/web-thaigle explains this one —
          // an hour of edge TTL lets a crawler pull each URL up to 24 times a
          // day per POP, and this site publishes thousands. An hour was never
          // the right number here anyway: 18 of the 20 routes declare
          // `revalidate = false`, so nothing changes at all between deploys
          // and Vercel would happily serve these pages for a month. Raised to
          // a day, which is still far more conservative than the origin.
          //
          // The cost: after a deploy the edge may serve the previous build for
          // up to a day. Purge the Cloudflare cache when you ship.
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
      // Must come after /api/(.*) — later rules win on a duplicate key.
      //
      // /api/track is a GET that logs an affiliate click and 302s onward. The
      // blanket /api/ rule above hands it `public, s-maxage=3600`, so a shared
      // cache would serve the first click's redirect to everyone for an hour
      // and logClick would never run again. Nothing has caught it because
      // Cloudflare returns DYNAMIC for this zone today — the moment a Cache
      // Rule makes HTML eligible, outbound click tracking silently zeroes out.
      {
        source: "/api/track",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
