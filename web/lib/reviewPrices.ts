// 허브 제목·설명에 넣는 가격은 리뷰에서 실측한 중앙값만 쓴다 (2026-10-03).
//
// 전에는 페이지마다 하드코딩 표가 있었다 — "Implants from ฿35,000 · Veneers
// ฿12,000", "Botox from ฿80/unit" 등. 출처가 없었고, 임플란트·비니어는 우리
// 리뷰 가격대에 아예 없는 시술이다. price_bands 는 build_master_db.py 의
// build_price_bands 가 만든다: 시술어 근접 추출, n>=12, p75/p25<=6, 그리고
// **덴탈 클리닉만** 원천으로 쓴다. 그래서 덴탈 허브에서만 쓰고, 다른 시술은
// 가격을 말하지 않는다(보톡스 유닛가는 n=8·7배 차이로 기각했다).
type Band = { n: number; p25: number; median: number; p75: number };
export type PriceLang = "en" | "th" | "ko";

const LABEL: Record<string, Record<PriceLang, string>> = {
  clean: { en: "Cleaning", th: "ขูดหินปูน", ko: "스케일링" },
  filling: { en: "Filling", th: "อุดฟัน", ko: "충치 치료" },
  extract: { en: "Extraction", th: "ถอนฟัน", ko: "발치" },
  braces: { en: "Braces", th: "จัดฟัน", ko: "교정" },
  whiten: { en: "Whitening", th: "ฟอกสีฟัน", ko: "미백" },
};

/** 덴탈 허브용: 표본이 가장 많은 시술 2개의 중앙값. 없으면 null. */
export function reviewPriceHint(
  db: unknown,
  service: string,
  lang: PriceLang,
  city = "bangkok",
): string | null {
  if (service !== "dental") return null;
  const bands = (db as { price_bands?: Record<string, Record<string, Band>> }).price_bands?.[city];
  if (!bands) return null;
  const top = Object.entries(bands)
    .filter(([k]) => LABEL[k])
    .sort((a, b) => b[1].n - a[1].n)
    .slice(0, 2);
  if (top.length === 0) return null;
  return top.map(([k, b]) => `${LABEL[k][lang]} ฿${b.median.toLocaleString("en-US")}`).join(" · ");
}
