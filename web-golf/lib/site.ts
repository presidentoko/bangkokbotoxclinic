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
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";
  return {
    brand,
    domain,
    title: `Best Golf Courses in Thailand 2026 — 600+ Ranked & Verified`,
    description:
      "Thailand's trusted golf directory. 600+ courses ranked by real Google reviews — Bangkok, Pattaya, Hua Hin, Phuket, Chiang Mai. Compare caddy quality, green fees & conditions before you book.",
    hero: "Thailand Golf Guide — verified by real golfers",
    heroSub:
      "600+ courses nationwide. Real Google reviews analyzed. Compare conditions, caddies, and value before you book.",
    themeAccent: "#15803d",
  };
}
