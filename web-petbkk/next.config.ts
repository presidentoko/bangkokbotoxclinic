import type { NextConfig } from 'next'
import hospitalRedirects from './data/hospital-redirects.json'

const config: NextConfig = {
  /**
   * Next serves prerendered pages with `Cache-Control: public, max-age=0,
   * must-revalidate`, which reads to every shared cache as "do not store".
   * Cloudflare sits in front of this site and duly reports
   * `cf-cache-status: DYNAMIC` on every HTML response, so all 1,590 pages are
   * proxied straight through to Vercel — each crawler hit billing an ISR read
   * and its full weight in Fast Origin Transfer. Both quotas are at their cap.
   *
   * Nothing here is per-user or time-sensitive: the datasets only change when a
   * deploy replaces them, so a shared cache can hold a page for an hour and
   * serve it stale for a week while refetching. `max-age=0` is kept so browsers
   * still revalidate and a visitor never sees a stale page from their own disk.
   *
   * Note this only makes the responses *eligible*. Cloudflare does not cache
   * HTML by default whatever the origin says — that needs a Cache Rule set to
   * "Eligible for cache" for this host, which is a dashboard change.
   *
   * 2026-09-01: the Cache Rule is evidently in place — www now returns
   * `cf-cache-status: MISS`/`HIT` rather than the `DYNAMIC` described above —
   * but both quotas went over anyway (ISR reads 1.1M/1M, origin transfer
   * 9.8/10 GB). Measuring three consecutive requests to the same URL gave
   * MISS, MISS, HIT and then MISS again, so a large share of hits still reach
   * the origin, and each one bills an ISR read whatever `x-vercel-cache` says.
   *
   * `s-maxage` was the controllable half of that: at 3600 every page expired
   * hourly, so a crawler working through 5,459 URLs re-fetched the whole site
   * from origin every hour. Nothing here is time-sensitive — every route is
   * statically generated, `dynamicParams` is false, and no route sets
   * `revalidate`, so the content genuinely cannot change until a deploy
   * replaces it. A day is therefore just as correct as an hour and asks the
   * origin for 24x less.
   *
   * The cost of that is staleness after a deploy: with no cache purge, a new
   * build can take up to `s-maxage` to appear (`stale-while-revalidate` then
   * serves the old copy while fetching the new one in the background, so
   * visitors never wait — they may just see yesterday's page once). Purging
   * the Cloudflare cache after deploying removes the lag entirely, and is
   * worth wiring up: Caching → Configuration → Purge Everything.
   *
   * Not touched here: the `Vary: rsc, next-router-state-tree, ...` that Next
   * sets on every response. It fragments the Cloudflare cache into a separate
   * entry per header combination, which is the likeliest cause of the erratic
   * MISS/HIT above — but those headers are how Next tells an RSC payload apart
   * from an HTML document, and overriding `Vary` risks serving one as the
   * other. That belongs in a Cloudflare Cache Rule, not in app code.
   */
  async headers() {
    const cacheable = 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800'
    return [
      {
        // Everything except the API surface and Next's own fingerprinted
        // assets, which already carry immutable caching of their own.
        source: '/:path((?!api/).*)',
        headers: [{ key: 'Cache-Control', value: cacheable }],
      },
      {
        source: '/:path*.(png|jpg|jpeg|svg|webp|ico|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },

  async redirects() {
    // 187 clinic URLs moved from a raw Google place id
    // (/hospital/0x30e2994f708a55310x7ded115b277a88b3) to a transliteration of
    // the Thai name (/hospital/rong-phayaban-sat-siriwech-hawlamphong). The old
    // URLs are indexed, so each one gets a 308 rather than being left to 404.
    // Regenerate with: npx tsx scripts/build-hospital-redirects.ts
    const slugMoves = Object.entries(hospitalRedirects as Record<string, string>).map(
      ([from, to]) => ({
        source: `/hospital/${from}`,
        destination: `/hospital/${to}`,
        permanent: true,
      }),
    )

    return [
      // The project's own `petbkk.vercel.app` alias serves the entire site
      // straight from Vercel — `server: Vercel`, no `cf-*` headers at all —
      // so every request that reaches it skips Cloudflare completely and bills
      // an ISR read plus its full weight in origin transfer. Crawlers find the
      // alias whether or not anything links to it, and a canonical tag cannot
      // stop a request that has already been served.
      //
      // Matching the exact host leaves per-deployment preview URLs
      // (petbkk-<hash>-<team>.vercel.app) alone, so previews still work.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'petbkk.vercel.app' }],
        destination: 'https://www.thailandpethub.com/:path*',
        permanent: true,
      },
      ...slugMoves,
      // /hospital/surgery listed all 503 hospitals, because `has_surgery` is
      // hardcoded true in petvet/transform.py — byte-for-byte the same list as
      // /hospital, which is why Search Console reports 16 pages under
      // "Duplicate, Google chose different canonical than user". noindex left
      // the duplicate in place; a 308 folds its link equity into /hospital and
      // retires the fabricated "has an operating room" claim with it.
      { source: '/hospital/surgery', destination: '/hospital', permanent: true },

      // Dropped by the Places API backfill: one reports CLOSED_PERMANENTLY and
      // six no longer exist in Google at all. Their pages were indexed, so they
      // are folded into the hub rather than left to 404.
      { source: '/hospital/799-animal-hospital', destination: '/hospital', permanent: true },
      { source: '/hospital/sukhumvit-62-pet-hospital', destination: '/hospital', permanent: true },
      { source: '/hospital/animal-clinic', destination: '/hospital', permanent: true },
      { source: '/hospital/the-vorarat-polyclinic', destination: '/hospital', permanent: true },
      { source: '/hospital/phra-khanong-veterinary', destination: '/hospital', permanent: true },
      { source: '/hospital/%E0%B8%84%E0%B8%A5%E0%B8%99%E0%B8%81%E0%B8%AA%E0%B8%95%E0%B8%A7%E0%B9%80%E0%B8%A5%E0%B8%A2%E0%B8%87-458', destination: '/hospital', permanent: true },
      { source: '/hospital/%E0%B8%84%E0%B8%A5%E0%B8%99%E0%B8%81%E0%B8%A3%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A7%E0%B9%80%E0%B8%AB%E0%B8%A1%E0%B8%A2%E0%B8%A7%E0%B8%AA%E0%B9%82%E0%B8%A1%E0%B8%AA%E0%B8%A3-meow-samosorn-vet-clinic', destination: '/hospital', permanent: true },

      // Same drop, from the Chiang Mai/Pattaya/Phuket backfill: delisted or
      // closed permanently per Google. (A second "animal-clinic" was also
      // dropped here, but that exact slug is already redirected above.)
      { source: '/hospital/patong-veterinarian-clinic', destination: '/hospital', permanent: true },
      { source: '/hospital/hug-me-animal-hospital-phuket-%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%AA%E0%B8%95%E0%B8%A7%E0%B8%AE%E0%B8%81%E0%B8%A1', destination: '/hospital', permanent: true },
      { source: '/hospital/%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%AA%E0%B8%95%E0%B8%A7%E0%B8%94%E0%B8%9A%E0%B8%81-dibuk-pet-hospital', destination: '/hospital', permanent: true },
      { source: '/hospital/animal-hospital-3', destination: '/hospital', permanent: true },
    ]
  },
}

export default config
