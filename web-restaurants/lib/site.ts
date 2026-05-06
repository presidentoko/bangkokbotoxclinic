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
  const brand = process.env.NEXT_PUBLIC_BRAND || "Bangkok Eats";
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://bkkrestaurants.example";
  return {
    brand,
    domain,
    title: `${brand} — Verified Restaurant Reviews & Trust Scores`,
    description:
      "Bangkok and Pattaya restaurants ranked by Trust Score from real Google review analysis. Updated continuously.",
    hero: `${brand} — Verified by Real Reviews`,
    heroSub:
      "Top restaurants ranked by Trust Score from real Google reviews. Thai, Japanese, Italian, Korean, halal and more — find your spot.",
    themeAccent: "#dc2626", // 음식 정체성 — 빨강
  };
}
