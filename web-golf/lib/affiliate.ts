// Golf 어필리에이트 — Golfsavers + Sawasdee Bangkok Golf + Klook 어필리에이트.
// ENV로 affiliate ID 주입 가능. 미설정 시 일반 검색 링크.

const GOLFSAVERS_ID = process.env.NEXT_PUBLIC_GOLFSAVERS_AID || "";
const SAWASDEE_ID = process.env.NEXT_PUBLIC_SAWASDEE_AID || "";
const KLOOK_ID = process.env.NEXT_PUBLIC_KLOOK_AID || "";

export function golfsaversSearch(query: string): string {
  // Golfsavers: thaigolfreservations / golfsavers.com - Thailand 골프 부킹 platform
  const url = new URL("https://www.golfsavers.com/search/");
  url.searchParams.set("q", query);
  if (GOLFSAVERS_ID) url.searchParams.set("ref", GOLFSAVERS_ID);
  return url.toString();
}

export function sawasdeeSearch(query: string): string {
  // Sawasdee Bangkok Golf — 한국 인기 골프 패키지
  const url = new URL("https://www.sawasdeebangkokgolf.com/search/");
  url.searchParams.set("query", query);
  if (SAWASDEE_ID) url.searchParams.set("aff", SAWASDEE_ID);
  return url.toString();
}

export function klookSearchLink(query: string): string {
  const url = new URL("https://www.klook.com/en-US/search/result/");
  url.searchParams.set("keyword", `${query} golf`);
  if (KLOOK_ID) {
    url.searchParams.set("aid", KLOOK_ID);
    url.searchParams.set("aff_adid", "bangkokgolf");
  }
  return url.toString();
}

export function trackingParams(source: string, medium = "internal"): string {
  return `utm_source=${source}&utm_medium=${medium}&utm_campaign=bangkokgolf`;
}
