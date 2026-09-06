/**
 * Google AdSense configuration.
 *
 * Separate from lib/ads.ts on purpose: that file is the direct-sold
 * sponsorship system (Redis-backed slots an advertiser pays for by the
 * month). This is programmatic AdSense inventory, which shares nothing with
 * it but the word "ad".
 *
 * The publisher id is not a secret — it ships in the page source of every
 * site running AdSense — so it is hardcoded as the default rather than being
 * a deploy-blocking env var. NEXT_PUBLIC_ADSENSE_CLIENT still wins when set,
 * which is what lets a preview deployment run without ads.
 *
 * The regex gate matters: a blank or malformed client makes the loader
 * request 404 and leaves any <ins> unit on the page as an empty bordered box.
 * Nothing renders unless the id is well-formed.
 */

export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-7308941037330924";

/** True when the publisher id is present and well-formed. */
export const ADS_ENABLED = /^ca-pub-\d{10,}$/.test(ADSENSE_CLIENT);
