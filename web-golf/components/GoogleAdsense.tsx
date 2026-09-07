import Script from "next/script";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/ads";

/**
 * The AdSense loader.
 *
 * `afterInteractive`, not `beforeInteractive`: this is third-party script and
 * blocking first paint on it would trade Core Web Vitals for nothing. The
 * site's entire plan depends on these pages ranking, so the ad waits.
 *
 * Renders nothing until a publisher ID exists. During the AdSense site review
 * this tag is the one thing that must be present — the reviewer's crawler
 * looks for the loader to confirm the site is actually wired up.
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
