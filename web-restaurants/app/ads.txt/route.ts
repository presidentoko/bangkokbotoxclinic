// Prerendered at build time, so this is a static asset: no function
// invocation and no ISR read.
export const dynamic = "force-static";

/**
 * ads.txt — the authorised-sellers file.
 *
 * snsstopper.com answered 404 here (checked 2026-10-20), while five other
 * sites that share this publisher (thaiautohub, thaigle, golf, bangkokfillers,
 * petbkk) serve it. AdSense reports a missing ads.txt
 * against the site and a large share of programmatic demand will not bid
 * without one.
 *
 * Driven by the same NEXT_PUBLIC_ADSENSE_CLIENT the layout uses for the loader
 * and the google-adsense-account meta tag, so the three cannot disagree.
 * `f08c47fec0942fa0` is Google's fixed certification authority ID, identical
 * for every AdSense publisher.
 *
 * With no ID configured it serves a comment, not a 404: a missing file reads to
 * a crawler as "unknown", an explicit comment as "no declared sellers".
 */
export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const body = client
    ? `google.com, ${client.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`
    : "# No authorised sellers yet.\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
