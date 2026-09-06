/**
 * The AdSense publisher id, in one place.
 *
 * This is a literal rather than an environment variable on purpose. A
 * `ca-pub-…` id is public by construction — it ships in the page source, in the
 * loader URL and in `/ads.txt`, and anyone can read it off the site — so there
 * is nothing here to protect. Holding it in an env var only bought a dashboard
 * step that has to be repeated per environment, and a failure mode where a
 * deploy goes out with every ad slot silently dark because the step was missed.
 *
 * `NEXT_PUBLIC_ADSENSE_ID` still wins when it is set, so a preview deployment
 * can be pointed at a different account without touching code.
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-7308941037330924'
