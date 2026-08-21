import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/ads";

export const dynamic = "force-static";

/**
 * ads.txt — the authorised-sellers file. Without it, a large share of
 * programmatic demand refuses to bid on the inventory at all, so this is
 * worth having live before the first impression rather than after.
 *
 * Served from a route rather than public/ so the publisher ID comes from the
 * environment. The ID does not exist until Google issues it, and a static
 * file would mean committing a placeholder that is wrong until someone
 * remembers to replace it. f08c47fec0942fa0 is Google's fixed certification
 * authority ID, identical for every AdSense publisher.
 *
 * Before the ID exists this serves a comment rather than a 404: crawlers
 * treat a 404 ads.txt as "no declared sellers", which is the correct state
 * for a site with no ads, and a comment says so explicitly.
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
