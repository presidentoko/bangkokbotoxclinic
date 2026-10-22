import hospitalRedirects from '@/data/hospital-redirects.json'

/**
 * /sitemap-legacy.xml — the 187 clinic URLs that moved, listed so Google
 * revisits them and sees the redirect.
 *
 * On 2026-08-21 187 clinics moved from a raw Google place id
 * (/hospital/0x30e297ed7c2f462f0x863277a626b28bc6) to a readable slug
 * (/hospital/krinweth-sattawaphaet). The redirects are correct — a single 308
 * to a 200 page with a self-referential canonical, no noindex, no internal link
 * left pointing at the old address (all checked 2026-10-23). Google has not
 * caught up anyway. Two months later the 2026-10-22 Performance export still
 * recorded 62% of all clinic impressions — 7,159 of 11,528 — against the OLD
 * URLs.
 *
 * That matters more than the address in the snippet. Google's index entry for
 * an old URL holds whatever it last fetched there, which predates the
 * 2026-10-16 review work, so those 7,159 impressions are being ranked on pages
 * that no longer exist: no reviews, no owner reports, 744-1,198 characters of
 * their own. The improvements reach those searches only once Google recrawls
 * the old URL, follows the 308 and folds it into the new one. A demoted site is
 * crawled sparingly, which is the likeliest reason it has not.
 *
 * Google's own guide to moving URLs says to "submit the two sitemaps you saved
 * earlier from the mapping", old and new, and that the warnings Search Console
 * raises for the one containing old URLs can be ignored; it also says a move
 * is complete only once Googlebot has visited every old and new URL at least
 * once. This is that old-URL sitemap. It is a separate file so /sitemap.xml
 * keeps listing only canonical pages.
 *
 * Expect "Page with redirect" in Search Console to rise as these are
 * recrawled. That is the move completing, not a fault.
 *
 * REMOVE THIS once the Performance export stops attributing impressions to
 * /hospital/0x… URLs. The redirects themselves stay — Google asks for at least
 * a year, and indefinitely is better for anybody holding an old link.
 */
export const dynamic = 'force-static'

const BASE = 'https://www.thailandpethub.com'

// When the list was published. A fixed date, not the build time: lastmod that
// changes on every deploy without the page changing teaches Google to ignore it.
const LISTED = '2026-10-23'

export function GET() {
  const legacy = Object.keys(hospitalRedirects as Record<string, string>)
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    legacy
      .map(slug => `  <url><loc>${BASE}/hospital/${encodeURIComponent(slug)}</loc><lastmod>${LISTED}</lastmod></url>`)
      .join('\n') +
    '\n</urlset>\n'
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
  })
}
