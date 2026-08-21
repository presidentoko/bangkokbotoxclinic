import Script from "next/script";

/**
 * Google Consent Mode v2 defaults.
 *
 * This has to execute before the AdSense or GA scripts do, which is why it is
 * `beforeInteractive` and why it is inline rather than a module import — a
 * consent signal that arrives after the tag has already fired is a consent
 * signal that did nothing.
 *
 * Defaults are denied in the EEA/UK/CH and granted elsewhere. Denying
 * everywhere would be simpler and would also switch off analytics for the
 * markets this site actually serves (Thailand, US, Korea, Japan), where no
 * prior-consent requirement applies. The `region` key is Google's own
 * mechanism for exactly this split, so the geo lookup happens inside Google's
 * tag rather than in a client-side IP guess here.
 *
 * `url_passthrough` and `ads_data_redaction` are what make a denied state
 * still measurable: with them, a non-consenting EEA visitor is counted in
 * aggregate with no identifiers stored.
 *
 * NOTE FOR THE ADSENSE ROLLOUT: AdSense requires a Google-certified CMP for
 * EEA/UK traffic, and this banner is not one. The certified path is Google's
 * own "Privacy & messaging" (Funding Choices), switched on in the AdSense
 * dashboard once the account is approved. When that is on, it publishes its
 * own consent updates; this file's defaults still apply and still run first,
 * so the two compose rather than conflict.
 */

const EEA = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
  "IS","LI","NO", // EEA non-EU
  "GB","CH",      // UK GDPR + Swiss FADP
];

const INLINE = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
  region: ${JSON.stringify(EEA)}
});
gtag('consent', 'default', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted'
});
gtag('set', 'url_passthrough', true);
gtag('set', 'ads_data_redaction', true);
`.trim();

export function ConsentMode() {
  return (
    <Script
      id="consent-mode-default"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: INLINE }}
    />
  );
}
