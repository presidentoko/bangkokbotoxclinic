// 동네·도시 단위 집계 (2026-10-28) — 목록 페이지가 "장소 카드 나열"에서 벗어나게 하는 숫자들.
//
// 구글 지도 검색으로는 얻을 수 없는 값만 쓴다: 리뷰 본문을 항목별로 센 만족도(insights.aspects),
// 팁 강요 신고율, 리뷰가 쓰인 언어 분포(외국인 비중), 리뷰에서 언급된 가격의 중앙값.
// 해당 지역을 비교 집단(도시 전체, 도시 페이지는 전체 도시)과 나란히 놓고, 가장 크게 벌어진
// 항목 하나를 문장으로 뽑는다. 새 수집 없음 — 빌드타임에 이미 있는 데이터로 계산한다.
import type { Lang } from "./site.ts";
import type { AspectKey, Place } from "./types.ts";
import { NOT_INDEXED_TYPES } from "./index-types.ts";

const MIN_REVIEWS = 30;       // 비교에 넣는 장소의 최소 구글 리뷰 수
const MIN_ANALYSED = 20;      // 항목 집계에 넣는 최소 분석 리뷰 수
const MIN_ASPECT_MENTIONS = 30;
const MIN_PRICE_PLACES = 5;
const MIN_TIP_PLACES = 8;
const FOREIGN_LANGS = ["ko", "ja", "zh", "ru"] as const;

export type AreaMetricKey = "rating" | "price" | "cleanliness" | "value" | "staff" | "tip" | "foreign";
export type AreaMetric = { key: AreaMetricKey; area: number; base: number };
export type AreaProfile = { places: number; metrics: AreaMetric[]; headline: string | null };

type Summary = Partial<Record<AreaMetricKey, number>>;

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function placeMedianPrice(p: Place): number | null {
  return median(p.priceMentions ?? []);
}

function summarise(places: Place[]): Summary & { n: number } {
  // 네일·의료·성인 등 주제 밖 업종은 비교 집단에서 뺀다 (색인 제외 업종과 같은 목록).
  const pool = places.filter((p) => p.rating != null && (p.reviewCount ?? 0) >= MIN_REVIEWS && !NOT_INDEXED_TYPES.has(p.primaryType ?? ""));
  const out: Summary & { n: number } = { n: pool.length };
  const rating = median(pool.map((p) => p.rating as number));
  if (rating != null) out.rating = rating;

  const prices = pool.map(placeMedianPrice).filter((v): v is number => v != null);
  if (prices.length >= MIN_PRICE_PLACES) out.price = median(prices) as number;

  const analysed = pool.filter((p) => (p.insights?.analysed ?? 0) >= MIN_ANALYSED);
  for (const key of ["cleanliness", "value", "staff"] as AspectKey[]) {
    let pos = 0;
    let neg = 0;
    for (const p of analysed) {
      const a = p.insights?.aspects?.[key];
      if (a) { pos += a.pos; neg += a.neg; }
    }
    if (pos + neg >= MIN_ASPECT_MENTIONS) out[key as "cleanliness" | "value" | "staff"] = (100 * pos) / (pos + neg);
  }

  const tipPool = analysed.filter((p) => (p.insights?.withText ?? 0) >= 30);
  if (tipPool.length >= MIN_TIP_PLACES) {
    out.tip = (100 * tipPool.filter((p) => (p.insights?.tipPressure ?? 0) >= 2).length) / tipPool.length;
  }

  let reviews = 0;
  let foreign = 0;
  for (const p of analysed) {
    reviews += p.insights?.analysed ?? 0;
    for (const l of FOREIGN_LANGS) foreign += p.insights?.languages?.[l] ?? 0;
  }
  if (reviews >= 200) out.foreign = (100 * foreign) / reviews;
  return out;
}

const NAMES: Record<Lang, Record<AreaMetricKey, string>> = {
  en: { rating: "Median rating", price: "Median price mentioned (THB)", cleanliness: "Cleanliness satisfaction", value: "Value-for-money satisfaction", staff: "Staff satisfaction", tip: "Places with tip-pressure reports", foreign: "Reviews in Korean, Japanese, Chinese or Russian" },
  th: { rating: "คะแนนมัธยฐาน", price: "ราคาที่รีวิวกล่าวถึง (บาท, มัธยฐาน)", cleanliness: "ความพอใจด้านความสะอาด", value: "ความพอใจด้านความคุ้มค่า", staff: "ความพอใจต่อพนักงาน", tip: "ร้านที่มีรายงานถูกเร่งให้ทิป", foreign: "รีวิวภาษาเกาหลี ญี่ปุ่น จีน หรือรัสเซีย" },
  ko: { rating: "평점 중앙값", price: "리뷰에 언급된 가격 중앙값(바트)", cleanliness: "청결 만족도", value: "가성비 만족도", staff: "직원 만족도", tip: "팁 강요 신고가 있는 업소", foreign: "한국어·일본어·중국어·러시아어 리뷰" },
};

export function areaMetricName(key: AreaMetricKey, lang: Lang): string {
  return NAMES[lang][key];
}

export function formatAreaMetric(key: AreaMetricKey, v: number): string {
  if (key === "rating") return v.toFixed(1);
  if (key === "price") return Math.round(v).toLocaleString("en");
  return `${Math.round(v)}%`;
}

// 가장 크게 벌어진 항목. 만족도·팁·외국인 비중은 %p, 평점은 0.1점=1p, 가격은 비율을 %p 로 환산해
// 서로 비교한다.
function gapScore(key: AreaMetricKey, area: number, base: number): number {
  if (key === "rating") return Math.abs(area - base) * 10;
  if (key === "price") return base === 0 ? 0 : (Math.abs(area - base) / base) * 100;
  return Math.abs(area - base);
}

function headlineFor(m: AreaMetric, areaName: string, baseName: string, lang: Lang): string {
  const d = m.area - m.base;
  const up = d > 0;
  const a = formatAreaMetric(m.key, m.area);
  const b = formatAreaMetric(m.key, m.base);
  const gap =
    m.key === "rating" ? Math.abs(d).toFixed(1)
    : m.key === "price" ? `${Math.round((Math.abs(d) / m.base) * 100)}%`
    : `${Math.round(Math.abs(d))}`;
  if (m.key === "price") {
    return lang === "ko" ? `${areaName}에서 리뷰에 언급된 가격은 ${baseName} 중앙값보다 ${gap} ${up ? "높습니다" : "낮습니다"}(${a}바트 대 ${b}바트).`
      : lang === "th" ? `ราคาที่รีวิวในแถว${areaName}กล่าวถึง${up ? "สูง" : "ต่ำ"}กว่าค่ากลางของ${baseName} ${gap} (${a} เทียบกับ ${b} บาท)`
      : `Prices mentioned in reviews here run ${gap} ${up ? "above" : "below"} the ${baseName} median (${a} vs ${b} THB).`;
  }
  if (m.key === "tip") {
    return lang === "ko" ? `${areaName} 업소의 ${a}가 팁 강요 신고를 받았습니다. ${baseName} 전체는 ${b}입니다.`
      : lang === "th" ? `ร้านในแถว${areaName} ${a} มีรายงานถูกเร่งให้ทิป เทียบกับ ${b} ของ${baseName}โดยรวม`
      : `${a} of places in ${areaName} have reviewers reporting tip pressure, against ${b} across ${baseName}.`;
  }
  if (m.key === "foreign") {
    return lang === "ko" ? `${areaName} 리뷰의 ${a}가 한국어·일본어·중국어·러시아어로 쓰였습니다. ${baseName} 전체는 ${b}입니다.`
      : lang === "th" ? `รีวิวในแถว${areaName} ${a} เขียนเป็นภาษาเกาหลี ญี่ปุ่น จีน หรือรัสเซีย เทียบกับ ${b} ของ${baseName}โดยรวม`
      : `${a} of reviews in ${areaName} are written in Korean, Japanese, Chinese or Russian, against ${b} across ${baseName}.`;
  }
  const name = NAMES[lang][m.key];
  const unit = m.key === "rating" ? "" : lang === "en" ? " points" : lang === "ko" ? "%p" : " จุด";
  return lang === "ko" ? `${areaName}의 "${name}"은(는) ${baseName} 전체보다 ${gap}${unit} ${up ? "높습니다" : "낮습니다"}(${a} 대 ${b}).`
    : lang === "th" ? `"${name}" ในแถว${areaName}${up ? "สูง" : "ต่ำ"}กว่า${baseName}โดยรวม ${gap}${unit} (${a} เทียบกับ ${b})`
    : `${name} in ${areaName} is ${gap}${unit} ${up ? "higher" : "lower"} than across ${baseName} (${a} vs ${b}).`;
}

export function areaProfile(area: Place[], baseline: Place[], areaName: string, baseName: string, lang: Lang): AreaProfile | null {
  const a = summarise(area);
  if (a.n < 5) return null;
  const b = summarise(baseline);
  const keys: AreaMetricKey[] = ["rating", "price", "cleanliness", "value", "staff", "tip", "foreign"];
  const metrics: AreaMetric[] = [];
  for (const key of keys) {
    const av = a[key];
    const bv = b[key];
    if (av != null && bv != null) metrics.push({ key, area: av, base: bv });
  }
  if (metrics.length < 3) return null;
  // 헤드라인 후보: 표본이 충분히 크고 의미 있게(만족도류 5p 이상, 평점 0.2 이상, 가격 15% 이상) 벌어진 것.
  const threshold = (k: AreaMetricKey) => (k === "rating" ? 2 : k === "price" ? 15 : 5);
  const best = metrics
    .map((m) => ({ m, g: gapScore(m.key, m.area, m.base) }))
    .filter((x) => x.g >= threshold(x.m.key))
    .sort((x, y) => y.g - x.g)[0];
  return { places: a.n, metrics, headline: best ? headlineFor(best.m, areaName, baseName, lang) : null };
}
