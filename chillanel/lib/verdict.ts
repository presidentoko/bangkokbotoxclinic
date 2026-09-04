// Chillanel Check — 구글 별점이 말해주지 않는 것들을 리뷰 원문에서 캔다.
// 2026-09-04: 이 사이트의 존재 이유는 "검증"인데 place 페이지가 구글 리뷰의
// 재배열에 그치고 있었다. 여기 있는 건 전부 이미 수집된 데이터(리뷰 원문
// 최대 20건 + 도시 전체 데이터셋)에서 빌드타임에 계산된다 — 새 스크래핑 없음.
import type { Place, Review } from "./types";
import { priceMedian } from "./summary";

// ---------- 경고 신호 마이닝 ----------
// 리뷰는 사실상 전부 영어로 수집돼 있다(EN 로케일 스크랩, 태국어 리뷰 0.2%).
// 패턴은 일부러 구체적인 구문으로 좁게 잡는다: "tip" 단독은 "great, left a big
// tip"까지 잡으므로 금지. 좁게 잡아 놓치는 쪽이 오탐으로 신뢰를 잃는 쪽보다 낫다.
export type FlagKey = "overcharge" | "tipPressure" | "upsell" | "hygiene" | "rude";

const FLAG_PATTERNS: Record<FlagKey, RegExp[]> = {
  overcharge: [
    /overcharg\w*/i, /over-?priced/i, /rip-?\s?off/i, /ripped\s+(me|us)\s+off/i,
    /\bscam\w*/i, /tourist\s+price/i, /double\s+the\s+price/i, /hidden\s+(charge|fee|cost)/i,
    /charged\s+(me|us)\s+(more|extra|double)/i, /price\s+(was\s+)?different\s+from/i,
    /โกง/, /แพงเกินไป/, /คิดเงินเกิน/,
  ],
  tipPressure: [
    /forc\w+\s+(a\s+|me\s+to\s+|us\s+to\s+)?tip/i, /demand\w*\s+(a\s+)?tip/i,
    /ask\w*\s+for\s+(a\s+|more\s+)?tip/i, /pressur\w+\s+\w*\s?tip/i,
    /mandatory\s+tip/i, /tip\s+(was|is)\s+(required|expected|demanded)/i,
    /insist\w*\s+on\s+(a\s+)?tip/i, /beg\w*\s+for\s+(a\s+)?tip/i, /บังคับทิป/,
  ],
  upsell: [
    /upsell\w*/i, /hard\s+sell/i, /\bpushy\b/i, /pressur\w+\s+(me|us)\s+to\s+buy/i,
    /kept\s+trying\s+to\s+sell/i, /forc\w+\s+(me|us)\s+to\s+buy/i, /aggressive\w*\s+sell/i,
    /ยัดเยียดขาย/,
  ],
  hygiene: [
    /\bdirty\b/i, /not\s+clean\b/i, /unhygienic/i, /unsanitary/i, /\bfilthy\b/i,
    /cockroach/i, /bed\s?bug/i, /smell\w*\s+(bad|terrible|awful|musty)/i, /\bmoldy?\b/i,
    /สกปรก/, /ไม่สะอาด/,
  ],
  rude: [
    /\brude\w*/i, /unfriendly/i, /disrespect\w*/i, /yell\w*\s+at/i, /bad\s+attitude/i,
    /treated\s+(me|us)\s+(badly|poorly)/i, /หยาบคาย/,
  ],
};

// "no scam", "never asked for tip", "not dirty" 류의 부정 맥락은 신호가 아니다.
const NEGATION = /(?:\bno\b|\bnot\b|\bnever\b|\bwithout\b|didn'?t|don'?t|wasn'?t|weren'?t|isn'?t|aren'?t|zero|far from)[\s\w]{0,20}$/i;

export type Flag = {
  key: FlagKey;
  count: number;            // 신호가 잡힌 리뷰 수 (매치 수 아님)
  quote: string;            // 가장 낮은 평점 리뷰에서 뽑은 증거 스니펫
  quoteRating: number | null;
};

export function scanRedFlags(reviews: Review[]): Flag[] {
  const out: Flag[] = [];
  for (const key of Object.keys(FLAG_PATTERNS) as FlagKey[]) {
    const hits: { r: Review; idx: number; len: number }[] = [];
    for (const r of reviews) {
      const text = r.text;
      if (!text) continue;
      // 5★ 리뷰의 "다른 데는 바가지인데 여긴..." 대조 표현이 오탐의 주범이다
      // (실측: 약 50개 오탐 제거). 불만 신호는 ★4 이하 리뷰에서만 인정한다.
      if (r.rating == null || r.rating > 4) continue;
      for (const pat of FLAG_PATTERNS[key]) {
        const m = pat.exec(text);
        if (!m) continue;
        if (NEGATION.test(text.slice(Math.max(0, m.index - 40), m.index))) continue;
        hits.push({ r, idx: m.index, len: m[0].length });
        break; // 리뷰당 1회만 집계
      }
    }
    if (hits.length === 0) continue;
    hits.sort((a, b) => (a.r.rating ?? 9) - (b.r.rating ?? 9));
    const best = hits[0];
    const start = Math.max(0, best.idx - 60);
    const end = Math.min(best.r.text.length, best.idx + best.len + 60);
    let quote = best.r.text.slice(start, end).trim();
    if (start > 0) quote = "…" + quote;
    if (end < best.r.text.length) quote = quote + "…";
    out.push({ key, count: hits.length, quote, quoteRating: best.r.rating ?? null });
  }
  // 심한 것(많이 언급된 것)부터
  return out.sort((a, b) => b.count - a.count);
}

// ---------- 최근 추세 ----------
// relativeDate 는 구글 영어 포맷으로 통일돼 있다: "a month ago", "2 weeks ago",
// "3 years ago" 등. 개월 수로 환산해 최근 12개월 리뷰의 평균 평점을 낸다.
export function relativeToMonths(rel: string): number | null {
  const m = /^(a|an|\d+)\s+(hour|day|week|month|year)s?\s+ago/i.exec(rel.trim());
  if (!m) return null;
  const n = m[1] === "a" || m[1] === "an" ? 1 : parseInt(m[1], 10);
  switch (m[2].toLowerCase()) {
    case "hour": case "day": return 0;
    case "week": return Math.round((n * 7) / 30);
    case "month": return n;
    case "year": return n * 12;
    default: return null;
  }
}

export type Trend = {
  recentAvg: number;   // 최근 12개월 평균 평점
  recentCount: number;
  direction: "up" | "down" | "steady"; // 전체 평점 대비 ±0.3
};

export function recentTrend(reviews: Review[], overallRating: number | null): Trend | null {
  if (overallRating == null) return null;
  const recent = reviews.filter((r) => {
    if (r.rating == null) return false;
    const mo = relativeToMonths(r.relativeDate || "");
    return mo != null && mo <= 12;
  });
  if (recent.length < 5) return null;
  const avg = recent.reduce((s, r) => s + (r.rating as number), 0) / recent.length;
  const delta = avg - overallRating;
  return {
    recentAvg: Math.round(avg * 10) / 10,
    recentCount: recent.length,
    direction: delta >= 0.3 ? "up" : delta <= -0.3 ? "down" : "steady",
  };
}

// ---------- 지역 내 위치 ----------
// 같은 구(district) 안에서 이 곳보다 평점이 낮은 곳의 비율. 리뷰 30개 미만인
// 곳은 표본이 얇어 제외. 비교군이 8곳 미만이면 표시하지 않는다(의미 없음).
export type DistrictStanding = { betterThanPct: number; total: number };

export function districtStanding(place: Place, cityPlaces: Place[]): DistrictStanding | null {
  if (!place.district || place.rating == null) return null;
  const peers = cityPlaces.filter(
    (p) => p.district === place.district && p.rating != null && (p.reviewCount ?? 0) >= 30,
  );
  if (peers.length < 8 || (place.reviewCount ?? 0) < 30) return null;
  const below = peers.filter((p) => (p.rating as number) < (place.rating as number)).length;
  return { betterThanPct: Math.round((below / peers.length) * 100), total: peers.length };
}

// ---------- 지역 시세 대비 가격 ----------
export type PriceContext = { verdict: "below" | "typical" | "above"; districtMedian: number };

export function priceVsDistrict(place: Place, cityPlaces: Place[]): PriceContext | null {
  const mine = priceMedian(place.priceMentions);
  if (mine == null || !place.district) return null;
  const meds = cityPlaces
    .filter((p) => p.district === place.district && p.id !== place.id)
    .map((p) => priceMedian(p.priceMentions))
    .filter((v): v is number => v != null)
    .sort((a, b) => a - b);
  if (meds.length < 8) return null;
  const dm = meds[Math.floor(meds.length / 2)];
  const verdict = mine < dm * 0.85 ? "below" : mine > dm * 1.15 ? "above" : "typical";
  return { verdict, districtMedian: dm };
}
