// 클리닉이 자기 웹사이트에 공개한 모발이식 가격 (2026-10-30 수집).
//
// 사이트의 시술 페이지는 "FUE from ฿65,000 · DHI from ฿85,000" 같은 출처 없는 가격을
// 하드코딩하고 있었다. 태국 클리닉 웹사이트 86곳을 받아 가격을 공개한 곳만 골라
// data/hair_published_prices.json 에 손으로 옮겼다 — 항목마다 원문 페이지 URL 이 있다.
// "업계 평균은 ~" 같은 일반론 문장은 그 클리닉의 가격이 아니므로 넣지 않았다.
import raw from "@/data/hair_published_prices.json";
import type { Lang } from "@/lib/types";

export type HairPriceKind = "per_graft" | "unlimited" | "tiers" | "range" | "from";

export type HairPrice = {
  clinic: string;
  slug: string;
  technique: string;
  kind: HairPriceKind;
  per_graft?: number;
  min?: number;
  max?: number;
  note_en: string;
  note_th: string;
  url: string;
};

type Payload = { collected: string; checked_sites: number; note: string; entries: HairPrice[] };
const data = raw as unknown as Payload;

export const hairPricesCollected = data.collected;
export const hairPricesCheckedSites = data.checked_sites;
export const hairPrices: HairPrice[] = data.entries;

export const baht = (n: number) => `฿${n.toLocaleString("en")}`;

/** 모발이식(눈썹 제외) 가격을 공개한 클리닉 수. */
export function transplantClinicCount(): number {
  return new Set(hairPrices.filter((p) => p.technique !== "Eyebrow").map((p) => p.clinic)).size;
}

/** 기법별 그래프트당 가격 범위. */
export function perGraftRange(technique: string): { lo: number; hi: number; n: number } | null {
  const xs = hairPrices.filter((p) => p.technique === technique && p.kind === "per_graft" && p.per_graft != null).map((p) => p.per_graft!);
  if (xs.length === 0) return null;
  return { lo: Math.min(...xs), hi: Math.max(...xs), n: xs.length };
}

/** 기법별 공개 가격 중 가장 낮은 패키지·범위 하한 (그래프트당 가격 제외). */
export function lowestPackage(technique: string): number | null {
  const xs = hairPrices.filter((p) => p.technique === technique && p.kind !== "per_graft" && p.min != null).map((p) => p.min!);
  return xs.length ? Math.min(...xs) : null;
}

/**
 * 시술 목록·시술 페이지에 붙는 짧은 가격 문구. 데이터가 없는 시술은 null — 지어내지 않는다.
 * 키는 lib/procedures.ts PROC_MAP 의 키.
 */
export function hairPriceHint(key: string, lang: Lang): string | null {
  const th = lang === "th";
  const perGraft = (t: string) => {
    const r = perGraftRange(t);
    if (!r) return null;
    const v = r.lo === r.hi ? baht(r.lo) : `${baht(r.lo)}–${baht(r.hi)}`;
    return th ? `${v} ต่อกราฟต์ (ราคาที่คลินิกประกาศ)` : `${v} per graft (published)`;
  };
  const band = (t: string) => {
    const xs = hairPrices.filter((p) => p.technique === t && p.min != null);
    if (xs.length === 0) return null;
    const lo = Math.min(...xs.map((p) => p.min!));
    const hi = Math.max(...xs.map((p) => p.max ?? p.min!));
    return `${baht(lo)}–${baht(hi)}${th ? " (ราคาที่คลินิกประกาศ)" : " (published)"}`;
  };
  switch (key) {
    case "fue": return perGraft("FUE");
    case "fut": return perGraft("FUT");
    case "dhi": return band("DHI");
    case "eyebrow": return band("Eyebrow");
    default: return null;
  }
}

/** 그래프트 수 × 공개 그래프트당 가격 — 우리가 한 산수다. 최소 금액·프로모션은 반영하지 않는다. */
export function estimateFor(grafts: number, technique: string): { lo: number; hi: number } | null {
  const r = perGraftRange(technique);
  return r ? { lo: r.lo * grafts, hi: r.hi * grafts } : null;
}
