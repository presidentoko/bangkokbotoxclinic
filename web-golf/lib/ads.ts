/**
 * AdSense configuration, in one place.
 *
 * The publisher ID is not a secret — it ships in the page source of every
 * page that carries an ad — but it still comes from the environment rather
 * than the source tree, so a preview deployment or a fork does not serve ads
 * under this account. AdSense judges invalid traffic against the account, not
 * the domain, so a stray non-production build billing impressions to it is a
 * real risk rather than a tidiness argument.
 *
 * Set in Vercel (production only):
 *   NEXT_PUBLIC_ADSENSE_CLIENT = ca-pub-XXXXXXXXXXXXXXXX
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

/**
 * True only for a well-formed publisher ID.
 *
 * Deliberately a shape check and not a truthiness check: a half-pasted value
 * would pass `if (client)` and emit an `<ins>` carrying a broken
 * `data-ad-client`, which AdSense records as a policy problem on the account
 * rather than as a no-op on the page. Anything that is not a real ID renders
 * nothing at all — no empty frame, no bordered placeholder.
 */
export const ADS_ENABLED = /^ca-pub-\d{10,}$/.test(ADSENSE_CLIENT);
