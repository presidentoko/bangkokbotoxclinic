import { NextResponse, type NextRequest } from "next/server";
import { SLUG_REDIRECTS } from "@/lib/slug-redirects";

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
 * The matcher only fires on hospital URLs containing a "%", which no current
 * slug does — normal traffic and the ~1,500 prerendered hospital pages never
 * invoke this, so it costs nothing against the Edge quota that this site has
 * already blown once.
 */
export const config = {
  matcher: "/:locale/hospital/:slug*",
};

export function middleware(request: NextRequest) {
  // `nextUrl.pathname` is the raw, still-encoded path here.
  const path = request.nextUrl.pathname;
  if (!path.includes("%")) return NextResponse.next();

  const [, locale, , ...rest] = path.split("/");
  const raw = rest.join("/");
  if (!raw) return NextResponse.next();

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
