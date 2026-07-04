// 사이트 config — 도메인 결정 후 NEXT_PUBLIC_BRAND + NEXT_PUBLIC_SITE_URL 만 swap 하면 됨.

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
  const brand = process.env.NEXT_PUBLIC_BRAND || "SNS Stopper";
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://www.snsstopper.com";
  return {
    brand,
    domain,
    title: `${brand} — Real Reviews, Not SNS Hype`,
    description:
      "Stop searching restaurants on Instagram. Real Bangkok and Pattaya restaurants ranked by Trust Score from verified Google reviews — no influencer fluff.",
    hero: "Stop searching on SNS. Find restaurants by real reviews.",
    heroSub:
      "Bangkok and Pattaya restaurants ranked from verified Google reviews. No paid influencers. No filters.",
    themeAccent: "#ea580c",
  };
}
