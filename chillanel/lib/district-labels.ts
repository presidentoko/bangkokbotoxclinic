import type { Lang } from "./site";
import type { Place } from "./types";

// Translates the 8 fixed Bangkok district names scripts/extract-district.mjs
// can produce (verbatim strings, not derived) into th/ko — real, standard
// transliterations of well-known Bangkok neighborhoods, not invented names.
const LABELS: Record<string, Record<Lang, string>> = {
  Sukhumvit: { en: "Sukhumvit", th: "สุขุมวิท", ko: "수쿰빗" },
  "Silom & Sathorn": { en: "Silom & Sathorn", th: "สีลม-สาทร", ko: "실롬 & 사톤" },
  "Siam & Pathumwan": { en: "Siam & Pathumwan", th: "สยาม-ปทุมวัน", ko: "싸얌 & 빠툼완" },
  "Thonglor & Ekkamai": { en: "Thonglor & Ekkamai", th: "ทองหล่อ-เอกมัย", ko: "통로 & 에까마이" },
  "Khao San & Old Town": { en: "Khao San & Old Town", th: "ข้าวสาร-เมืองเก่า", ko: "카오산 & 올드타운" },
  Chinatown: { en: "Chinatown", th: "เยาวราช (ไชนาทาวน์)", ko: "차이나타운(야오와랏)" },
  Chatuchak: { en: "Chatuchak", th: "จตุจักร", ko: "짜뚜짝" },
  Ari: { en: "Ari", th: "อารีย์", ko: "아리" },
};

export function districtLabel(rawDistrict: string, lang: Lang): string {
  return LABELS[rawDistrict]?.[lang] ?? rawDistrict;
}

export function slugifyDistrict(rawDistrict: string): string {
  return rawDistrict
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Distinct districts actually present across a set of places, deduplicated
// -- used to build one static /district/[district] route per district that
// has at least one real place (never generates an empty page) and one
// sitemap entry per district × language.
export function allDistricts(places: Place[]): string[] {
  const districts = new Set<string>();
  for (const place of places) {
    if (place.district) districts.add(place.district);
  }
  return [...districts];
}
