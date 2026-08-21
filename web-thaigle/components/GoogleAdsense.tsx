import Script from "next/script";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/ads";

/**
 * The AdSense loader.
 *
 * `afterInteractive`, not `beforeInteractive`: the ad script is third-party
 * and blocking first paint on it would trade the Core Web Vitals score for
 * nothing — the slots below already have their space reserved, so the ad has
 * somewhere to land whenever it arrives.
 *
 * Renders nothing until a publisher ID exists. During the AdSense review this
 * is the one thing that must be present, since the reviewer's crawler looks
 * for the script to confirm the site is wired up.
 */
export function GoogleAdsense() {
  if (!ADS_ENABLED) return null;

  return (
    <Script
      id="adsbygoogle-init"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
