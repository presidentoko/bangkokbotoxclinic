import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/ads";

// Prerendered at build time, so this is a static asset: no function
// invocation and no ISR read, like the rest of the site's text routes.
export const dynamic = "force-static";

/**
 * ads.txt — the authorised-sellers file.
 *
 * Without it a large share of programmatic demand refuses to bid on the
 * inventory at all, so it wants to be live before the first impression rather
 * than after. `f08c47fec0942fa0` is Google's fixed certification authority ID,
 * identical for every AdSense publisher.
 *
 * Served from a route rather than public/ so the publisher ID comes from the
 * environment — a static file would mean committing an ID that is wrong for
 * every other deployment of this codebase.
 *
 * With no ID configured this serves a comment rather than a 404. A 404 ads.txt
 * reads to a crawler as "no declared sellers", which is the correct state for a
 * site running no ads; the comment says so explicitly instead of by omission.
 */
export function GET() {
  const body = ADS_ENABLED
    ? `google.com, ${ADSENSE_CLIENT.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`
    : "# No authorised sellers yet.\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
