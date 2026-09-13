// 사이트 config — 도메인 결정 후 NEXT_PUBLIC_BRAND + NEXT_PUBLIC_SITE_URL 만 swap 하면 됨.

/**
 * ko/th 상세 페이지를 만들어 줄 식당의 기준.
 *
 * 식당이 8,625곳이 되면서 상세 페이지가 로케일 3벌로 25,875장이 됐고 Vercel
 * 빌드가 ENOSPC 로 죽었다(functions.tmp 아래 .segment.rsc.func 를 만들다가).
 * 설정은 3,184곳 시절 기준이었다.
 *
 * 영어 상세는 8,625곳 전부 유지한다 — 그게 색인의 본체다. 번역 로케일은
 * 상위 식당만 만든다. 목록·도시·요리 페이지는 로케일별로 그대로 있고,
 * 거기서 식당으로 가는 링크는 원래부터 영어 상세를 가리키므로 내부 링크가
 * 깨지지 않는다.
 *
 * 이 값을 쓰는 곳: app/ko/restaurant/[id], app/th/restaurant/[id],
 * app/sitemap.xml. 사이트맵이 만들지 않은 URL 을 제출하면 404 를 구글에
 * 제출하는 꼴이므로 셋이 같은 기준을 봐야 한다.
 */
export const LOCALE_DETAIL_MIN_TRUST = 85;

export function hasLocaleDetail(r: { trust_score?: number | null }): boolean {
  return (r.trust_score ?? 0) >= LOCALE_DETAIL_MIN_TRUST;
}

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
    title: `${brand} — Bangkok Restaurant Reviews, Not SNS Hype`,
    description:
      "Stop searching restaurants on Instagram. Real Bangkok and Pattaya restaurants ranked by Trust Score from verified Google reviews — no influencer fluff.",
    hero: "Stop searching on SNS. Find restaurants by real reviews.",
    heroSub:
      "Bangkok and Pattaya restaurants ranked from verified Google reviews. No paid influencers. No filters.",
    themeAccent: "#ea580c",
  };
}
