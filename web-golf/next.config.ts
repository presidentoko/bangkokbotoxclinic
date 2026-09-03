import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const config: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      // /tee-times published 4,320 "available" slots that were generated,
      // not scraped — five fixed morning times per course per day with
      // available:true hardcoded. The route is gone; the price comparison is
      // the page people wanted from it.
      { source: "/tee-times", destination: "/price-compare", permanent: true },
      // Non-www → www (permanent 301 — consolidates all authority to www)
      {
        source: "/:path*",
        has: [{ type: "host", value: "thailandgolfguide.com" }],
        destination: "https://www.thailandgolfguide.com/:path*",
        permanent: true,
      },
      {
        // The project's own Vercel alias serves the whole site with Cloudflare
        // nowhere in the path: measured 2026-09-01, https://web-golf-xi.vercel.app/
        // returned the full 650,079-byte homepage straight from the origin,
        // with no cf-cache-status and no noindex. Every crawler holding this
        // hostname bills an ISR read and the page's full weight in Fast Origin
        // Transfer, with none of the edge caching the real domain gets. The
        // deployment URLs (web-golf-<hash>-<team>.vercel.app) are behind
        // Vercel's SSO and are not affected; this is the one open alias.
        source: "/:path*",
        has: [{ type: "host", value: "web-golf-xi.vercel.app" }],
        destination: "https://www.thailandgolfguide.com/:path*",
        permanent: true,
      },
      // 여기 있던 /city/pattaya -> /city/chon_buri 리다이렉트는 제거했다.
      // 붙일 당시엔 맞는 판단이었다 — 파타야 페이지에 코스가 18개뿐이었고 촌부리와
      // 목록이 거의 겹쳐서 중복 콘텐츠였다. lib/cityAliases 의 배타 배정이 들어간 뒤로는
      // 파타야 32개 / 촌부리 61개로 서로 겹치지 않는 목록이 됐다. 중복이 아니라 정상 분할인데
      // 리다이렉트가 남아 "pattaya golf"(촌부리보다 검색량이 훨씬 큰 쿼리)를 도(道) 페이지로
      // 흘려보내고 있었다.
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "*.ggpht.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "*.naver.com" },
      { protocol: "https", hostname: "*.nstatic.net" },
    ],
  },
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
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
        // Course photos, and the only heavy static payload on the site: 140
        // JPEGs, 12 MB, the largest 294 KB. They were picking up the blanket
        // rule above, which meant an edge TTL of one hour on files that are
        // named by Google place id and effectively never change — Cloudflare
        // was re-pulling the whole 12 MB from the origin every hour it saw
        // traffic. `immutable` would be the textbook answer, but the photo
        // scraper does occasionally overwrite a file under the same name, so
        // a month at the edge with a week of stale-while-revalidate keeps a
        // replacement from being pinned forever while still cutting the
        // origin pulls by ~720x.
        source: "/course-photos/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=604800" },
        ],
      },
      {
        // After the blanket rule so it wins on the duplicate key. /api/contact
        // is a form submission — a shared cache would serve one sender's
        // response to the next and the message would never be delivered.
        source: "/api/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default config;
