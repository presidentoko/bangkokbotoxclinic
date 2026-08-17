import { NextResponse, type NextRequest } from "next/server";
import routeIndex from "@/data/route-index.json";

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
    if (THIN_BRAND_SLUGS.has(brand) || THIN_BRAND_SLUGS.has(rawBrand)) {
      return permanentRedirect(request, `/${locale}/brand/${rawBrand}`);
    }
    return NextResponse.next();
  }

  const match = /^\/(th|en)\/product\/([^/]+)$/.exec(pathname);
  if (!match) return NextResponse.next();

  const [, locale, rawSlug] = match;

  // Every /en product page carried `noindex` because none of them has an
  // English body: llm_summary.en is empty for all 1,003 products, so the page
  // reused the Thai description verbatim. That made 1,003 pages (plus 1,003
  // generated OG images) permanently ineligible to rank while still consuming
  // crawl budget. Consolidating them onto the Thai URL removes ~2,000 pages
  // from the crawl surface and loses no search value, since none of them could
  // ever appear in results.
  //
  // To reinstate the English product pages, delete this block and restore the
  // "en" entry in localeAlternates for the product route — the pages become
  // worth having again once the pipeline produces real English summaries.
  if (locale === "en") {
    return permanentRedirect(request, `/th/product/${rawSlug}`);
  }

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
