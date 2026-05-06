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
  const brand = process.env.NEXT_PUBLIC_BRAND || "Bangkok Golf";
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://bangkokgolf.example";
  return {
    brand,
    domain,
    title: `${brand} — Verified Golf Course Reviews & Trust Scores`,
    description:
      "Bangkok, Chonburi, Pattaya, Pathum Thani golf courses ranked by Trust Score from real Google reviews. Caddy quality, course conditions, English/Korean support — verified.",
    hero: "Find your next round in Thailand — verified by real golfers",
    heroSub:
      "130+ courses across Bangkok, Chonburi, Pattaya. Real Google reviews analyzed. Compare conditions, caddies, and value before you book.",
    themeAccent: "#15803d",
  };
}
