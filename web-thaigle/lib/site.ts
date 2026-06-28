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
  const brand = process.env.NEXT_PUBLIC_BRAND || "Thaigle";
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";
  return {
    brand,
    domain,
    title: `${brand} — Bangkok Restaurants & Activities Ranked by Real Reviews (2026)`,
    description:
      "Bangkok's most trusted directory: 3,200+ restaurants, Muay Thai gyms, spas & cooking classes ranked by real Google reviews. No influencer picks. No paid rankings. Updated daily.",
    hero: "Bangkok's real review directory.",
    heroSub:
      "3,200+ Bangkok & Pattaya restaurants ranked by Trust Score from verified Google reviews. No influencers. No paid rankings.",
    themeAccent: "#f97316",
  };
}
