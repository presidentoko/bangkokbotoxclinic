import { NextResponse, type NextRequest } from "next/server";

/**
 * Catch the doctor URL shape this site stopped generating on 2026-07-31.
 *
 * `/doctor/[slug]` pre-renders a fixed list of params and sets
 * dynamicParams=false, so Next answers an unknown slug with a 404 before the
 * page's own code runs. That is deliberate — it is what stops a crawler
 * inventing slugs and burning the ISR write quota — but it also means the one
 * place that could look a stale URL up never gets the request.
 *
 * Shape alone separates the two: a current doctor slug ends in `-at-` plus the
 * last twelve hex characters of the clinic's Google place id, while the old one
 * ends in the clinic's *name*. Everything of the old shape is handed to
 * /legacy-doctor, which has the data to decide; everything else falls through
 * untouched, so the site's 1,700 live doctor URLs stay fully static.
 *
 * The file is `middleware.ts`, which Next 16 marks deprecated in favour of
 * `proxy.ts`, on purpose: a proxy always runs on the Node runtime, and
 * OpenNext's Cloudflare adapter refuses to build one ("Node.js middleware is
 * not currently supported"). Edge middleware is what the dental deploy can run,
 * and this needs nothing from Node — two string tests and a rewrite.
 *
 * This runs instead of per-clinic redirect rules. Naming the clinic literally
 * in a rewrite — the only way a pattern can tell the doctor's name from the
 * clinic's, since both contain hyphens — would take 1,868 rules, in a route
 * table that has already hit Vercel's 2,048 cap once.
 */

const CURRENT_SHAPE = /-at-[0-9a-f]{12}$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rest = pathname.slice("/doctor/".length).replace(/\/+$/, "");

  if (!rest || rest.includes("/") || !rest.includes("-at-") || CURRENT_SHAPE.test(rest)) {
    return NextResponse.next();
  }

  // The slug stays a path segment: a rewrite's query string does not reach the
  // handler, and `rest` is already percent-encoded as the browser sent it, so
  // Thai clinic names survive untouched.
  const url = request.nextUrl.clone();
  url.pathname = `/legacy-doctor/${rest}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Nothing outside /doctor/* is touched — this must not become a per-request
  // cost on the clinic pages, which are where the traffic is.
  matcher: ["/doctor/:path*"],
};
