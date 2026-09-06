import { ADSENSE_CLIENT, ADS_ENABLED } from "@/lib/adsense";

/**
 * /ads.txt — the IAB authorised-sellers file.
 *
 * Without it most demand-side platforms treat this domain's inventory as
 * unauthorised and bid low or not at all, so it belongs in place before the
 * first ad is served rather than after. ads.txt wants the publisher id
 * without the `ca-` prefix; f08c47fec0942fa0 is Google's fixed certification
 * authority id, the same value on every AdSense publisher's file.
 *
 * A 404 while the id is unset is deliberate — an ads.txt listing no sellers
 * is worse than no file at all, because crawlers cache the empty one.
 */

export const dynamic = "force-static";

export function GET() {
  if (!ADS_ENABLED) {
    return new Response("Not Found", { status: 404 });
  }

  const pub = ADSENSE_CLIENT.replace(/^ca-/, "");
  const lines = [
    "# BangkokFillers authorised digital sellers",
    `google.com, ${pub}, DIRECT, f08c47fec0942fa0`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
