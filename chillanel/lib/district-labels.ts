import type { Lang } from "./site";
import type { Place } from "./types";

// Translates the fixed district names scripts/extract-district.mjs can
// produce (verbatim strings, not derived) into th/ko — real, standard
// transliterations of well-known neighborhoods across Bangkok, Pattaya, and
// Phuket, not invented names.
const LABELS: Record<string, Record<Lang, string>> = {
  // Bangkok
  Sukhumvit: { en: "Sukhumvit", th: "สุขุมวิท", ko: "수쿰빗" },
  "Silom & Sathorn": { en: "Silom & Sathorn", th: "สีลม-สาทร", ko: "실롬 & 사톤" },
  "Siam & Pathumwan": { en: "Siam & Pathumwan", th: "สยาม-ปทุมวัน", ko: "싸얌 & 빠툼완" },
  "Thonglor & Ekkamai": { en: "Thonglor & Ekkamai", th: "ทองหล่อ-เอกมัย", ko: "통로 & 에까마이" },
  "Khao San & Old Town": { en: "Khao San & Old Town", th: "ข้าวสาร-เมืองเก่า", ko: "카오산 & 올드타운" },
  Chinatown: { en: "Chinatown", th: "เยาวราช (ไชนาทาวน์)", ko: "차이나타운(야오와랏)" },
  Chatuchak: { en: "Chatuchak", th: "จตุจักร", ko: "짜뚜짝" },
  Ari: { en: "Ari", th: "อารีย์", ko: "아리" },
  // Pattaya
  "Central Pattaya": { en: "Central Pattaya", th: "พัทยากลาง", ko: "파타야 중심가" },
  "Walking Street & South Pattaya": {
    en: "Walking Street & South Pattaya",
    th: "พัทยาใต้-วอล์กกิ้งสตรีท",
    ko: "워킹스트리트 & 파타야 남부",
  },
  Jomtien: { en: "Jomtien", th: "จอมเทียน", ko: "좀티엔" },
  "North Pattaya & Naklua": { en: "North Pattaya & Naklua", th: "พัทยาเหนือ-นาเกลือ", ko: "파타야 북부 & 나끌르아" },
  "Pratumnak Hill": { en: "Pratumnak Hill", th: "พระตำหนัก", ko: "프라탐낙 힐" },
  // Phuket
  Patong: { en: "Patong", th: "ป่าตอง", ko: "빠똥" },
  Karon: { en: "Karon", th: "กะรน", ko: "까론" },
  Kata: { en: "Kata", th: "กะตะ", ko: "까따" },
  "Phuket Town": { en: "Phuket Town", th: "เมืองภูเก็ต (ตัวเมือง)", ko: "푸켓타운" },
  Rawai: { en: "Rawai", th: "ราไวย์", ko: "라와이" },
  Kamala: { en: "Kamala", th: "กมลา", ko: "까말라" },
  "Bang Tao": { en: "Bang Tao", th: "บางเทา", ko: "방따오" },
  Chalong: { en: "Chalong", th: "ฉลอง", ko: "찰롱" },
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
