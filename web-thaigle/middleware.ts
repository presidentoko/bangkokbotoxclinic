import { NextResponse, type NextRequest } from "next/server";
import { slugifySegment } from "@/lib/slug";

/**
 * Sends the un-slugified restaurant URLs Google still holds to the real ones.
 *
 * `slug-map.json` stores a district the way the scrape found it ("Watthana",
 * "Bang Kapi"); `restaurantUrl()` slugifies it. An earlier build did not, so
 * Google indexed ~117 URLs of the shape
 * `/restaurants/bangkok/Watthana/<venue>` — all of which 404 today, while the
 * lowercase form serves a 200. The GSC export for 2026-06-20..08-22 has them
 * at 1,821 impressions and, because they are venue-name queries, at average
 * positions of 5-9. They were the site's best-ranking URLs and every one of
 * them was a dead end.
 *
 * Why this is middleware and not a `redirects()` entry: next.config route
 * matching is case-insensitive (`sensitive: false`), so a rule with source
 * `/restaurants/:city/Watthana/:slug` also matches the lowercase destination
 * and redirects it to itself, forever. Middleware can compare the two forms
 * and only act when they actually differ.
 *
 * The comparison is what makes this loop-free rather than the matcher:
 * `slugifySegment` is idempotent, so a path it does not change is passed
 * straight through even if the matcher over-matches.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const parts = pathname.split("/");

  // ["", "restaurants", city, district, ...]. Anything shorter has no
  // district segment to correct.
  if (parts[1] !== "restaurants" || parts.length < 4) return NextResponse.next();

  const [city, district] = [parts[2], parts[3]];
  let fixedCity: string;
  let fixedDistrict: string;
  try {
    fixedCity = slugifySegment(decodeURIComponent(city));
    fixedDistrict = slugifySegment(decodeURIComponent(district));
  } catch {
    // Malformed percent-encoding — nothing safe to redirect to.
    return NextResponse.next();
  }

  if (fixedCity === city && fixedDistrict === district) return NextResponse.next();

  // A segment that slugifies to nothing ("/restaurants/bangkok/%20/x") would
  // otherwise redirect to a path with an empty segment.
  if (!fixedCity || !fixedDistrict) return NextResponse.next();

  parts[2] = fixedCity;
  parts[3] = fixedDistrict;
  const url = req.nextUrl.clone();
  url.pathname = parts.join("/");
  // 308, not 307: these URLs have been indexed for months and the lowercase
  // form is the permanent home. A temporary redirect would keep Google
  // re-checking the dead URL and pass no ranking signal to the live one.
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Only paths carrying an uppercase letter or a percent-escape (a space
  // arrives as %20) can possibly need rewriting, and this section is the
  // site's largest — a blanket `/restaurants/:path*` would bill a middleware
  // invocation on every crawl of ~3,300 venue pages to do nothing. The
  // in-function comparison above is the correctness guarantee; this is only
  // the cost control, so an over-match here is harmless.
  matcher: ["/restaurants/:path(.*[A-Z].*)", "/restaurants/:path(.*%.*)"],
};
