// 어필리에이트 링크 빌더. 환경변수로 ID 주입 — 코드 노출 안 됨.

const KLOOK_ID = process.env.NEXT_PUBLIC_KLOOK_AID || "";
const KLOOK_BASE = "https://www.klook.com/en-US/search/result/";

export function klookSearchLink(query: string): string {
  const url = new URL(KLOOK_BASE);
  url.searchParams.set("keyword", query);
  if (KLOOK_ID) {
    url.searchParams.set("aid", KLOOK_ID);
    url.searchParams.set("aff_adid", "bangkokclinics");
  }
  return url.toString();
}

export function trackingParams(source: string, medium = "internal"): string {
  return `utm_source=${source}&utm_medium=${medium}&utm_campaign=bangkokclinics`;
}
