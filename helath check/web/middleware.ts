import { NextResponse, type NextRequest } from "next/server";
import { SLUG_REDIRECTS } from "@/lib/slug-redirects";
import { RENAMED_HOSPITALS, MOVED_TO_GUIDE } from "@/lib/hospital-redirects";
import { LOCALES } from "@/lib/i18n";

/**
 * Rescues the hospital URLs that `hdmall_insert.py` created before the
 * 2026-08 re-slug.
 *
 * Those slugs were "hdm-" plus the first 45 characters of a percent-encoded
 * Thai filename, and 19 of them were cut off mid-escape
 * ("...-%E0%B8%94%E0%B8%B5-%E0%B8%AD%E0"). Next.js decodes a dynamic path
 * segment before it reaches the page, so a truncated escape raises URIError
 * and the route answers **500** — Search Console counted 40 of them, and a 5xx
 * is the one status Google keeps retrying indefinitely.
 *
 * It has to be middleware: the failure happens during routing, so no
 * `generateStaticParams` entry, `notFound()` or in-page lookup can ever run.
 *
 * It also rescues the slugs the 2026-08 catalogue rebuild deleted, for the
 * same reason: `dynamicParams = false` makes an unknown slug a router-level
 * 404, so nothing inside the route can answer. See lib/hospital-redirects.ts.
 *
 * Cost: the matcher is a path shape, not a content test, so this function does
 * run on every /:locale/hospital/* request — roughly 1,500 prerendered pages
 * plus crawls. A live slug costs two failed object lookups and the "%" test,
 * and the page itself is still served from the edge cache, so the only charge
 * is one Edge invocation. At this site's traffic that is a rounding error
 * against the 1M/month allowance, but it is not zero: narrow the matcher
 * before extending this to a busier path.
 */
export const config = {
  matcher: "/:locale/hospital/:slug*",
};

export function middleware(request: NextRequest) {
  // `nextUrl.pathname` is the raw, still-encoded path here.
  const path = request.nextUrl.pathname;

  const [, rawLocale, , ...rest] = path.split("/");
  const raw = rest.join("/");
  if (!raw) return NextResponse.next();

  // The matcher is a path shape, so it also matches the junk first segments
  // Google indexed back when [locale] accepted any string ("/&/hospital/...",
  // "/dental-clinic-marketing/hospital/..."). next.config rewrites those to
  // /en before middleware runs, but redirecting to a locale that does not
  // exist would just manufacture another 404, so pin anything unrecognised.
  const locale = (LOCALES as readonly string[]).includes(rawLocale) ? rawLocale : "en";

  // Slugs the 2026-08 catalogue rebuild removed. `dynamicParams = false` on the
  // hospital route means these are a hard 404 at the router, so the rescue has
  // to happen before routing — see lib/hospital-redirects.ts for why the two
  // maps are separate. Both lookups are plain object hits on an already-split
  // path, so this costs nothing for a slug that is still live.
  const renamed = RENAMED_HOSPITALS[raw];
  if (renamed) {
    return NextResponse.redirect(new URL(`/${locale}/hospital/${renamed}`, request.url), 308);
  }
  const movedTo = MOVED_TO_GUIDE[raw];
  if (movedTo) {
    return NextResponse.redirect(new URL(`/${locale}${movedTo}`, request.url), 308);
  }

  if (!path.includes("%")) return NextResponse.next();

  // Try the URL exactly as it arrived, then singly decoded (which is the form
  // the sitemap's double-encoded entries reduce to), then fully decoded.
  const candidates = [raw];
  for (let i = 0; i < 2; i++) {
    try {
      const next = decodeURIComponent(candidates[candidates.length - 1]);
      if (next === candidates[candidates.length - 1]) break;
      candidates.push(next);
    } catch {
      break; // truncated escape — fall through to the index redirect
    }
  }

  for (const c of candidates) {
    const moved = SLUG_REDIRECTS[c];
    if (moved) {
      return NextResponse.redirect(new URL(`/${locale}/hospital/${moved}`, request.url), 308);
    }
  }

  // A percent-encoded slug that maps to nothing cannot be served — decoding it
  // is what produces the 500. Send it to the hospital index rather than
  // leaving a 5xx in the crawl log.
  return NextResponse.redirect(new URL(`/${locale}/hospital`, request.url), 308);
}
