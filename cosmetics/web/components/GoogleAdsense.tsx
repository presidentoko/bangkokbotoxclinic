import Script from "next/script";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/adsense";

/**
 * The AdSense loader.
 *
 * `afterInteractive`, not `beforeInteractive`: the ad script is third-party
 * and blocking first paint on it would trade Core Web Vitals for nothing.
 * This site's entire plan depends on the pages ranking, so the ad script
 * never gets to sit in front of the content.
 *
 * With only this loader present, Auto ads (enabled per-site in the AdSense
 * dashboard) place the units. Manual <ins class="adsbygoogle"> placements can
 * be added later without touching this component.
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
