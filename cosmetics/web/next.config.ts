import type { NextConfig } from "next";

// Cloudflare sits in front of Vercel for this domain. Prerendered pages leave
// Vercel with `Cache-Control: public, max-age=0, must-revalidate` — a header
// Vercel manages for ISR routes and that the app cannot override — which tells
// Cloudflare to revalidate against the origin on essentially every request.
// The pages are byte-identical between deploys, so that revalidation traffic is
// pure waste: it is what put Fast Origin Transfer at 8.39/10GB.
//
// `CDN-Cache-Control` is the header for *downstream* CDNs (Vercel forwards it
// rather than consuming it, unlike Vercel-CDN-Cache-Control), so it gives
// Cloudflare a real TTL while leaving the browser header and Vercel's own ISR
// behaviour untouched.
//
// This was one hour until 2026-09-06, when the usage page read ISR Reads
// 868K/1M. An hour is the wrong unit for this site: every route under [locale]
// is `revalidate = false`, so a page is byte-identical until the next deploy,
// and auto_deploy.py is throttled to one deploy per 72 hours. Revalidating
// hourly asked the origin to re-prove that ~72 times per URL per PoP between
// deploys. A day cuts that by 24x and is still well inside the deploy interval.
//
// Deliberately not longer: Cloudflare's purge tokens for this zone both return
// 401 (2026-09-03), so a wrong value at the edge cannot be cleared by hand and
// has to age out. s-maxage + stale-while-revalidate bounds that at two days.
const CDN_CACHE = "public, s-maxage=86400, stale-while-revalidate=86400";

// Crawl-control files are a handful of URLs, so caching them longer saves
// nothing measurable, while a stale sitemap or robots.txt delays every
// correction made through them. They keep the old one-hour TTL.
const CDN_CACHE_CRAWL = "public, s-maxage=3600, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    // Konvy CDN sources
    remotePatterns: [
      { protocol: "https", hostname: "s2.konvy.com" },
      { protocol: "https", hostname: "s1.konvy.com" },
      { protocol: "https", hostname: "cdn.thebeautrium.com" },
    ],
    // Every next/image in this app points at a Konvy URL — there is not one
    // local image in public/ — and Konvy already serves them as 280x280 WebP
    // at 2-5KB. Vercel's optimizer was re-fetching and re-encoding those into
    // 1.7-4.3KB WebP: a rounding error in bytes, for which the site was paying
    // its entire Image Optimization quota (4K/5K transformations) and routing
    // every thumbnail through Vercel's origin. Serving the Konvy URLs directly
    // costs nothing measurable in page weight and takes both the transformation
    // quota and that share of Fast Origin Transfer to zero. Verified 2026-08-19
    // that Konvy serves these to a third-party referer (no hotlink protection).
    //
    // deviceSizes/imageSizes are inert while unoptimized, kept so that flipping
    // this back is a one-line change if Konvy ever starts blocking hotlinks.
    unoptimized: true,
    deviceSizes: [640],
    imageSizes: [72, 200],
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      { source: "/", headers: [{ key: "CDN-Cache-Control", value: CDN_CACHE }] },
      {
        source: "/:locale(th|en)/:path*",
        headers: [{ key: "CDN-Cache-Control", value: CDN_CACHE }],
      },
      { source: "/sitemap.xml", headers: [{ key: "CDN-Cache-Control", value: CDN_CACHE_CRAWL }] },
      { source: "/llms.txt", headers: [{ key: "CDN-Cache-Control", value: CDN_CACHE_CRAWL }] },
      { source: "/robots.txt", headers: [{ key: "CDN-Cache-Control", value: CDN_CACHE_CRAWL }] },
    ];
  },
  async redirects() {
    return [
      // ja locale was removed (commit 67c78f7) but old hreflang alternates
      // are still crawled by Google — send them to the th equivalent
      // instead of leaving a permanent 404.
      { source: "/ja", destination: "/th", permanent: true },
      { source: "/ja/:path*", destination: "/th/:path*", permanent: true },
      // ko/ar content is thin (falls back to English) and already noindexed —
      // redirect at the routing layer so bots/crawlers never reach the app's
      // rendering pipeline for them (cuts ISR reads/writes, Fast Origin
      // Transfer, and image transformations roughly in half). Temporary
      // (not permanent) in case full translations get built out later.
      { source: "/ko", destination: "/en", permanent: false },
      { source: "/ko/:path*", destination: "/en/:path*", permanent: false },
      { source: "/ar", destination: "/en", permanent: false },
      { source: "/ar/:path*", destination: "/en/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
