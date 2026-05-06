export type SiteConfig = {
  brand: string;
  domain: string;
  title: string;
  description: string;
  hero: string;
  heroSub: string;
  themeAccent: string;
};

export function getSiteConfig(): SiteConfig {
  const brand = process.env.NEXT_PUBLIC_BRAND || "Thailand Golf Guide";
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://thailandgolfguide.com";
  return {
    brand,
    domain,
    title: `${brand} — Verified Course Reviews & Trust Scores`,
    description:
      "479 golf courses across Bangkok, Chonburi, Pattaya, Hua Hin, Phuket, Chiang Mai ranked by Trust Score from real Google reviews. Caddy quality, course conditions, English/Korean support — verified.",
    hero: "Thailand Golf Guide — verified by real golfers",
    heroSub:
      "479 courses nationwide. Real Google reviews analyzed. Compare conditions, caddies, and value before you book.",
    themeAccent: "#15803d",
  };
}
