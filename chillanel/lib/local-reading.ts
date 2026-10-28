// "Around here" — 이 가게를 도시 전체 데이터셋 안에 놓았을 때만 나오는 문장들 (2026-10-28).
//
// 구글 지도에 이미 있는 별점·주소·리뷰 몇 줄로는 얇은 페이지가 된다. 여기 있는
// 사실은 우리가 9천 곳을 한꺼번에 가지고 있어야만 계산할 수 있다: 반경 1km 안
// 경쟁 업소 중 몇 등인지, 도시 전체에서 평점·리뷰 수가 어디쯤인지, 1~2점 비율이
// 도시 중앙값의 몇 배인지. 전부 이미 수집된 데이터로 빌드타임에 계산한다.
//
// 사실마다 "눈에 띄는 정도"(notability)를 매겨 상위 3개만 쓰고, 그 순서로 늘어놓는다.
// 그래서 같은 템플릿에 숫자만 끼운 문단이 아니라 장소마다 문장 구성 자체가 달라진다.
import type { Lang } from "./site.ts";
import type { Place } from "./types.ts";
import { isRelevantCategory } from "./categories.ts";
import { distanceKm } from "./geo.ts";

const NEARBY_KM = 1;
const MIN_PEER_REVIEWS = 30;
const MIN_PEERS = 3;
const MAX_FACTS = 3;
// 중앙값이 0%인 도시에서도 "1~2점 비율이 도시 평소의 몇 배"를 말할 수 있게 하는 바닥값.
const LOW_SHARE_FLOOR = 0.02;

export type Rival = { id: string; name: string; rating: number; km: number };
export type LocalReading = { sentences: string[]; rival: Rival | null };

type Fact = { notability: number; text: Record<Lang, string>; near?: boolean };

type CityStats = {
  ratings: number[];       // 정렬된 평점 (리뷰 MIN_PEER_REVIEWS 이상인 곳)
  counts: number[];        // 정렬된 리뷰 수 (같은 모집단)
  lowShareMedian: number;  // 1~2점 비율 중앙값
  peers: Place[];          // 위치·평점·리뷰 수가 있는 비교 대상
};

const statsCache = new WeakMap<Place[], CityStats>();

function median(sorted: number[]): number {
  return sorted.length === 0 ? 0 : sorted[Math.floor(sorted.length / 2)];
}

function distTotal(p: Place): number {
  const d = p.ratingDistribution;
  return d[1] + d[2] + d[3] + d[4] + d[5];
}

function lowShare(p: Place): number {
  const t = distTotal(p);
  return t === 0 ? 0 : (p.ratingDistribution[1] + p.ratingDistribution[2]) / t;
}

function cityStats(cityPlaces: Place[]): CityStats {
  const hit = statsCache.get(cityPlaces);
  if (hit) return hit;
  const peers = cityPlaces.filter(
    (p) => p.lat != null && p.lng != null && p.rating != null && (p.reviewCount ?? 0) >= MIN_PEER_REVIEWS && isRelevantCategory(p.primaryType),
  );
  const ratings = peers.map((p) => p.rating as number).sort((a, b) => a - b);
  const counts = peers.map((p) => p.reviewCount).sort((a, b) => a - b);
  const lows = peers.filter((p) => distTotal(p) >= MIN_PEER_REVIEWS).map(lowShare).sort((a, b) => a - b);
  const stats = { ratings, counts, lowShareMedian: Math.max(median(lows), LOW_SHARE_FLOOR), peers };
  statsCache.set(cityPlaces, stats);
  return stats;
}

/** sorted 안에서 v 보다 작은 값의 비율(0~1). */
function below(sorted: number[], v: number): number {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < v) lo = mid + 1;
    else hi = mid;
  }
  return sorted.length === 0 ? 0 : lo / sorted.length;
}

function better(a: Place, b: Place): boolean {
  const ra = a.rating as number;
  const rb = b.rating as number;
  return ra > rb || (ra === rb && a.reviewCount > b.reviewCount);
}

export function localReading(place: Place, cityPlaces: Place[], cityName: string, lang: Lang): LocalReading | null {
  if (place.lat == null || place.lng == null || place.rating == null) return null;
  const stats = cityStats(cityPlaces);
  if (stats.peers.length < 20) return null;
  const facts: Fact[] = [];
  const origin = { lat: place.lat, lng: place.lng };

  // ---- 반경 1km 경쟁 구도 ----
  const near = stats.peers
    .filter((p) => p.id !== place.id)
    .map((p) => ({ p, km: distanceKm(origin, { lat: p.lat as number, lng: p.lng as number }) }))
    .filter((x) => x.km <= NEARBY_KM);
  let rival: Rival | null = null;
  if (near.length >= MIN_PEERS && (place.reviewCount ?? 0) >= MIN_PEER_REVIEWS) {
    const rank = 1 + near.filter((x) => better(x.p, place)).length;
    const total = near.length + 1;
    // 1등·꼴찌에 가까울수록 눈에 띈다. 한가운데는 말할 거리가 적다.
    const edge = Math.abs((rank - 1) / (total - 1) - 0.5) * 2;
    const text: Record<Lang, string> =
      rank === 1
        ? {
            en: `Within ${NEARBY_KM} km there are ${near.length} other places with ${MIN_PEER_REVIEWS}+ reviews, and this is the highest rated of them.`,
            ko: `반경 ${NEARBY_KM}km 안에 리뷰 ${MIN_PEER_REVIEWS}건 이상인 다른 업소가 ${near.length}곳 있는데, 그중 평점이 가장 높습니다.`,
            th: `ในรัศมี ${NEARBY_KM} กม. มีร้านอื่นที่มีรีวิว ${MIN_PEER_REVIEWS}+ รายการ ${near.length} ร้าน และร้านนี้คะแนนสูงที่สุดในกลุ่ม`,
          }
        : {
            en: `Within ${NEARBY_KM} km, ${near.length} other places have ${MIN_PEER_REVIEWS}+ reviews; this one ranks #${rank} of ${total} by rating.`,
            ko: `반경 ${NEARBY_KM}km 안에 리뷰 ${MIN_PEER_REVIEWS}건 이상인 업소가 ${total}곳 있고, 이곳은 평점 기준 ${total}곳 중 ${rank}위입니다.`,
            th: `ในรัศมี ${NEARBY_KM} กม. มี ${total} ร้านที่มีรีวิว ${MIN_PEER_REVIEWS}+ รายการ ร้านนี้อยู่อันดับ ${rank} จาก ${total} ตามคะแนน`,
          };
    facts.push({ notability: 0.45 + edge * 0.5, text, near: true });
    if (rank > 1) {
      const best = near.filter((x) => better(x.p, place)).sort((a, b) => a.km - b.km)[0];
      if (best) rival = { id: best.p.id, name: best.p.name, rating: best.p.rating as number, km: Math.round(best.km * 10) / 10 };
    }
  }

  // ---- 도시 전체에서의 위치 ----
  const ratingPct = below(stats.ratings, place.rating); // 이 평점보다 낮은 곳의 비율
  if ((place.reviewCount ?? 0) >= MIN_PEER_REVIEWS && (ratingPct >= 0.9 || ratingPct <= 0.15)) {
    const top = Math.max(1, Math.round((1 - ratingPct) * 100));
    const low = Math.max(1, Math.round(ratingPct * 100));
    const high = ratingPct >= 0.9;
    facts.push({
      notability: 0.4 + Math.abs(ratingPct - 0.5),
      text: high
        ? {
            en: `A rating of ${place.rating.toFixed(1)} puts it in the top ${top}% of the ${stats.ratings.length.toLocaleString("en")} places in ${cityName} with ${MIN_PEER_REVIEWS}+ reviews.`,
            ko: `평점 ${place.rating.toFixed(1)}은 ${cityName}에서 리뷰 ${MIN_PEER_REVIEWS}건 이상인 ${stats.ratings.length.toLocaleString("ko")}곳 중 상위 ${top}%입니다.`,
            th: `คะแนน ${place.rating.toFixed(1)} อยู่ใน ${top}% แรกของ ${stats.ratings.length.toLocaleString("th")} ร้านในเมือง${cityName}ที่มีรีวิว ${MIN_PEER_REVIEWS}+ รายการ`,
          }
        : {
            en: `A rating of ${place.rating.toFixed(1)} is in the bottom ${low}% of the ${stats.ratings.length.toLocaleString("en")} places in ${cityName} with ${MIN_PEER_REVIEWS}+ reviews.`,
            ko: `평점 ${place.rating.toFixed(1)}은 ${cityName}에서 리뷰 ${MIN_PEER_REVIEWS}건 이상인 ${stats.ratings.length.toLocaleString("ko")}곳 중 하위 ${low}%입니다.`,
            th: `คะแนน ${place.rating.toFixed(1)} อยู่ใน ${low}% ล่างของ ${stats.ratings.length.toLocaleString("th")} ร้านในเมือง${cityName}ที่มีรีวิว ${MIN_PEER_REVIEWS}+ รายการ`,
          },
    });
  }

  const countPct = below(stats.counts, place.reviewCount);
  if (countPct >= 0.95) {
    const top = Math.max(1, Math.round((1 - countPct) * 100));
    facts.push({
      notability: 0.35 + (countPct - 0.5) * 0.6,
      text: {
        en: `With ${place.reviewCount.toLocaleString("en")} Google reviews it is among the most-reviewed ${top}% of places in ${cityName}.`,
        ko: `구글 리뷰 ${place.reviewCount.toLocaleString("ko")}건으로 ${cityName}에서 리뷰가 가장 많은 상위 ${top}%에 듭니다.`,
        th: `มีรีวิวบน Google ${place.reviewCount.toLocaleString("th")} รายการ อยู่ใน ${top}% แรกของร้านที่มีรีวิวมากที่สุดในเมือง${cityName}`,
      },
    });
  }

  // ---- 별점 분포의 모양 (읽은 리뷰 기준) ----
  const total = distTotal(place);
  if (total >= MIN_PEER_REVIEWS) {
    const low = lowShare(place);
    const five = place.ratingDistribution[5] / total;
    const ratio = low / stats.lowShareMedian;
    const lowPct = Math.round(low * 100);
    const medPct = Math.round(stats.lowShareMedian * 100);
    if (low >= 0.12 && ratio >= 2) {
      facts.push({
        notability: 0.3 + Math.min(ratio, 6) / 10,
        text: {
          en: `Opinions split: ${lowPct}% of the ${total} reviews we read gave 1–2 stars, against a ${cityName} median of ${medPct}%.`,
          ko: `평가가 갈립니다. 읽은 리뷰 ${total}건 중 ${lowPct}%가 1~2점으로, ${cityName} 중앙값 ${medPct}%의 ${ratio.toFixed(1)}배입니다.`,
          th: `ความเห็นแตกต่างกัน: ${lowPct}% ของรีวิวที่เราอ่าน ${total} รายการให้ 1–2 ดาว สูงกว่าค่ากลางของ${cityName}ที่ ${medPct}%`,
        },
      });
    } else if (five >= 0.9 && ratio <= 0.5) {
      facts.push({
        notability: 0.3 + (five - 0.8),
        text: {
          en: `Consistently good: ${Math.round(five * 100)}% of the ${total} reviews we read gave 5 stars and ${lowPct < 1 ? "none" : `only ${lowPct}%`} gave 1–2 (${cityName} median ${medPct}%).`,
          ko: `꾸준히 좋습니다. 읽은 리뷰 ${total}건 중 ${Math.round(five * 100)}%가 5점이고 1~2점은 ${lowPct < 1 ? "없습니다" : `${lowPct}%뿐입니다`}(${cityName} 중앙값 ${medPct}%).`,
          th: `ดีสม่ำเสมอ: ${Math.round(five * 100)}% ของรีวิวที่เราอ่าน ${total} รายการให้ 5 ดาว และ${lowPct < 1 ? "ไม่มีเลย" : `มีเพียง ${lowPct}%`}ที่ให้ 1–2 ดาว (ค่ากลางของ${cityName} ${medPct}%)`,
        },
      });
    }
  }

  if (facts.length === 0) return null;
  facts.sort((a, b) => b.notability - a.notability);
  const picked = facts.slice(0, MAX_FACTS);
  // 경쟁 업소 링크는 "반경 1km 순위" 문장이 실제로 뽑혔을 때만 붙인다.
  return { sentences: picked.map((f) => f.text[lang]), rival: picked.some((f) => f.near) ? rival : null };
}
