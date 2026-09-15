import { NextResponse, type NextRequest } from "next/server";
import routeIndex from "@/data/route-index.json";
import { slugify } from "@/lib/format";

/**
 * Recovers product URLs that Google still has indexed but master_db.json no
 * longer contains.
 *
 * Background: the catalog dropped from ~1,820 products to ~1,003 (commits
 * 8ed183f -> 3ef6a9b, June 2026). Every removed product's page had been
 * crawled, and because `dynamicParams = false` rejects unknown params at the
 * routing layer, all of them became hard 404s at once — Search Console reports
 * 1,382 "Not found (404)" URLs against a site that only publishes 1,269, while
 * 1,068 real URLs sit in "Discovered - currently not indexed" waiting for crawl
 * budget that the dead URLs are consuming.
 *
 * A 404 tells Google "this was never anything"; a 301 to the brand page tells it
 * where the topic went and passes the accumulated signal along. Products churn
 * in and out of the Konvy feed continuously, so this is deliberately generic
 * rather than a fixed redirect table — it handles future removals too.
 *
 * Cost note: this runs only on product-URL requests that miss the Cloudflare
 * edge cache, and it does a Set lookup against an 11KB index — it does not
 * import master_db.json (8.6MB) and does not render anything.
 */

const PRODUCT_IDS = new Set(routeIndex.productIds);
const BRAND_SLUGS = new Set(routeIndex.brandSlugs);
const THIN_BRAND_SLUGS = new Set(routeIndex.thinBrandSlugs ?? []);

// Mirrors productIdFromSlug() in lib/format.ts.
function idFromSlug(slug: string): string {
  return slug.split("-").pop() ?? "";
}

/** "cosrx-90182" -> "cosrx"; returns null when the remainder isn't a live brand. */
function brandSlugFromProductSlug(slug: string): string | null {
  const cut = slug.lastIndexOf("-");
  if (cut <= 0) return null;
  const candidate = slug.slice(0, cut);
  if (BRAND_SLUGS.has(candidate)) return candidate;
  // Thai brand slugs arrive percent-encoded (see brandFromSlug in lib/data.ts).
  try {
    const decoded = decodeURIComponent(candidate);
    if (BRAND_SLUGS.has(decoded)) return decoded;
  } catch {
    // Malformed %-sequence — treat as unknown.
  }
  return null;
}

// Query is dropped. (`_rsc` never reaches here — Next's middleware adapter strips
// it before building request.nextUrl — so RSC cache safety is handled by the
// CDN-Cache-Control rules in next.config.ts, not by preserving params here.)
function permanentRedirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url, 308);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Thin brands have fewer than three products, so their dupe page has nothing
  // to compare against. Those pages already carried noindex, meaning they were
  // costing a crawl each while being ineligible to rank — 318 across both
  // locales, on a site where Google is currently indexing 548 pages total.
  // Send them to the brand page, which shows the same products with real
  // content around them.
  const dupeMatch = /^\/(th|en)\/dupe\/([^/]+)$/.exec(pathname);
  if (dupeMatch) {
    const [, locale, rawBrand] = dupeMatch;
    let brand = rawBrand;
    try {
      brand = decodeURIComponent(rawBrand);
    } catch {
      // Malformed %-sequence — compare the raw value.
    }
    // Older builds linked dupe pages by the raw brand name (/th/dupe/CeraVe,
    // /en/dupe/Melano CC). 109 of those still sat in Search Console as 404s on
    // 2026-09-15 while /th/dupe/cerave served 200. Normalise to the slug first,
    // then apply the thin-brand rule to the slug.
    const slug = slugify(brand);
    if (THIN_BRAND_SLUGS.has(slug)) {
      return permanentRedirect(request, `/${locale}/brand/${encodeURIComponent(slug)}`);
    }
    if (slug !== brand && BRAND_SLUGS.has(slug)) {
      return permanentRedirect(request, `/${locale}/dupe/${encodeURIComponent(slug)}`);
    }
    return NextResponse.next();
  }

  const match = /^\/(th|en)\/product\/([^/]+)$/.exec(pathname);
  if (!match) return NextResponse.next();

  const [, locale, rawSlug] = match;

  // /en/product/* used to 308 onto the Thai URL here (96b9f4d, 2026-08-17), on
  // the belief that the English pages "could never rank". They were ranking:
  // the GSC export for 2026-06-15..09-12 has 79 of them drawing 253
  // impressions, several at position 7-10, and site-wide impressions fell from
  // 70-105/day to 17 the day after that redirect shipped. Product names are
  // Latin script, so English-language queries land on these pages. Do not
  // consolidate a page class again without first reading its impressions.

  // Live product — hand straight to the prerendered page.
  if (PRODUCT_IDS.has(idFromSlug(rawSlug))) return NextResponse.next();

  // Retired product. Send it to the brand it belonged to, which still lists the
  // brand's surviving products; fall back to the locale home when the brand is
  // gone too. 308 (not 307) so the redirect is cacheable and Google treats it as
  // permanent — these products are not coming back under the same id.
  const brand = brandSlugFromProductSlug(rawSlug);
  return permanentRedirect(request, brand ? `/${locale}/brand/${brand}` : `/${locale}`);
}

export const config = {
  // Only product and dupe detail URLs reach this. Everything else — static
  // assets, the sitemap, every other route — skips middleware entirely.
  matcher: ["/:locale(th|en)/product/:slug", "/:locale(th|en)/dupe/:brand"],
};
