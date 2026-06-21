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
    title: `${brand} — Thailand's Real Review Directory`,
    description:
      "Find the best restaurants, spas, and experiences in Thailand. Real Google reviews, Trust Scores, no influencer rankings.",
    hero: "Thailand's real review directory.",
    heroSub:
      "3,200+ Bangkok & Pattaya restaurants ranked by Trust Score from verified Google reviews. No influencers. No paid rankings.",
    themeAccent: "#f97316",
  };
}
