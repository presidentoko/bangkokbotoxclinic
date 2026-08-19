import type { Course } from "./types";
import { CATEGORY_LABELS } from "./types";

// 코스 페이지가 색인되지 않던 이유를 정면으로 친다.
//
// 2026-08-19 측정: 코스 페이지 본문이 중앙값 350 단어인데 그중 207 단어가 전 페이지
// 공통 템플릿이었다. 고유 단어는 중앙값 143 개, 최소 56 개. GSC 의 "Crawled - currently
// not indexed" 450 건은 순위를 기다리는 상태가 아니라 색인될 만큼의 고유 텍스트가 없는
// 상태였다.
//
// 여기서 만드는 문장은 전부 그 코스 자신의 숫자에서 나온다 — 리뷰 언어 분포, 별점 분포,
// 리뷰어가 실제로 반복해서 꺼낸 주제, 같은 도시 코스 대비 위치, 시간대별 혼잡도.
// 없는 사실을 지어내거나 형용사로 부풀리지 않는다. 데이터가 없으면 그 문장은 생략한다.
// (골퍼가 읽어서 쓸모없는 문장이면 구글에도 쓸모없다.)

const LANG_NAME: Record<string, string> = {
  th: "Thai", en: "English", ko: "Korean", ja: "Japanese",
};

const TOPIC_PHRASE: Record<string, string> = {
  challenging: "how demanding the layout is",
  easy_course: "how forgiving it plays",
  well_maintained: "course condition",
  poor_condition: "patchy turf",
  scenic: "the views",
  championship: "its championship setup",
  expensive: "green fees being steep",
  affordable: "value for the green fee",
  weekend_busy: "weekend crowds",
  weekday_quiet: "how quiet weekdays are",
  fast_pace: "a brisk pace of play",
  slow_pace: "slow rounds",
  good_caddy: "caddy quality",
  english_caddy: "English-speaking caddies",
  korean_caddy: "Korean-speaking caddies",
  japanese_caddy: "Japanese-speaking caddies",
  good_clubhouse: "the clubhouse",
  basic_clubhouse: "a dated clubhouse",
  good_food: "the food",
  fun_layout: "the layout",
  long_course: "its length",
  short_course: "how short it plays",
  good_practice: "the practice facilities",
  members_only: "member-only access",
  near_airport: "how close it is to the airport",
  long_drive: "the drive out there",
};

const DAY_FULL: Record<string, string> = {
  Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday",
  Fr: "Friday", Sa: "Saturday", Su: "Sunday",
};

function hourLabel(h: number): string {
  if (h === 0) return "midnight";
  if (h === 12) return "noon";
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

function listify(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * 코스 고유 데이터만으로 문단을 만든다. 근거가 없으면 빈 배열을 돌려주고,
 * 호출부는 아무것도 렌더하지 않는다 — 내용 없는 문장으로 자리를 채우지 않는다.
 */
export function buildCourseSummary(r: Course, cohort: Course[]): string[] {
  const out: string[] = [];
  const where = r.district || r.city_label;

  // 1) 같은 도시 코스 대비 위치. 순위는 사실이고 코스마다 다르다.
  if (r.total_reviews > 0 && cohort.length >= 5) {
    const better = cohort.filter((c) => c.trust_score > r.trust_score).length;
    const rank = better + 1;
    const kind = r.categories[0] ? (CATEGORY_LABELS[r.categories[0]] ?? "course").toLowerCase() : "course";
    out.push(
      `${r.name} holds a Trust Score of ${r.trust_score.toFixed(0)} out of 100, ranking ${rank} of ${cohort.length} ${kind}s we track in ${r.city_label}. ` +
      `The score is built from ${r.total_reviews.toLocaleString()} Google reviews averaging ${r.rating.toFixed(1)} stars — not from any paid placement.`,
    );
  }

  // 2) 별점 분포. "4.7점"보다 "5점이 몇 %인지"가 훨씬 많은 걸 말해준다.
  const dist = r.reviews_distribution;
  if (dist) {
    const five = dist.fiveStar ?? 0;
    const low = (dist.oneStar ?? 0) + (dist.twoStar ?? 0);
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    if (total >= 20) {
      const fivePct = Math.round((five / total) * 100);
      const lowPct = Math.round((low / total) * 100);
      out.push(
        `${fivePct}% of those reviewers left five stars, while ${lowPct}% left one or two — ` +
        (lowPct <= 5
          ? "an unusually clean spread for a course this busy."
          : lowPct >= 15
            ? "a wider split than most courses in the region, so read the low reviews before booking."
            : "a fairly typical spread."),
      );
    }
  }

  // 3) 리뷰 언어 구성. 어느 나라 골퍼가 실제로 가는지를 보여주는 유일한 지표다.
  const lb = r.language_breakdown;
  if (lb) {
    const entries = (["th", "en", "ko", "ja"] as const)
      .map((k) => [k, lb[k] ?? 0] as const)
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1]);
    const sum = entries.reduce((a, [, n]) => a + n, 0);
    if (sum >= 5 && entries.length > 0) {
      const parts = entries.slice(0, 3).map(([k, n]) => `${LANG_NAME[k]} ${Math.round((n / sum) * 100)}%`);
      const ko = lb.ko ?? 0;
      out.push(
        `Among the reviews we read in full, the language mix runs ${listify(parts)}. ` +
        (ko > 0
          ? `Korean-language reviews are present, which usually means the clubhouse has dealt with Korean groups before.`
          : `We found no Korean-language reviews, so Korean-speaking support here is unconfirmed.`),
      );
    }
  }

  // 4) 리뷰어가 반복해서 꺼낸 주제. 코스마다 완전히 다르게 나온다.
  const topics = (r.mentioned_topics ?? []).filter((t) => TOPIC_PHRASE[t.topic]).slice(0, 3);
  if (topics.length > 0) {
    out.push(
      `Across those reviews the subject that comes up most often is ${listify(topics.map((t) => TOPIC_PHRASE[t.topic]))}.`,
    );
  }

  // 5) 혼잡 패턴. 티타임을 언제 잡을지에 직접 쓰이는 정보.
  const pt = r.popular_times;
  if (pt) {
    const slots: { day: string; hour: number; pct: number }[] = [];
    for (const [day, arr] of Object.entries(pt)) {
      for (const s of arr ?? []) {
        if (s.hour >= 5 && s.hour <= 19 && s.occupancyPercent > 0) {
          slots.push({ day, hour: s.hour, pct: s.occupancyPercent });
        }
      }
    }
    if (slots.length >= 10) {
      const busiest = slots.reduce((a, b) => (b.pct > a.pct ? b : a));
      const quietest = slots.reduce((a, b) => (b.pct < a.pct ? b : a));
      out.push(
        `Google's crowd data puts the busiest stretch at ${DAY_FULL[busiest.day] ?? busiest.day} around ${hourLabel(busiest.hour)}, ` +
        `and the quietest at ${DAY_FULL[quietest.day] ?? quietest.day} around ${hourLabel(quietest.hour)} — worth knowing if pace of play matters to you.`,
      );
    }
  }

  // 6) 위치 + 연락. 짧지만 코스마다 다르고 검색 의도에 직접 답한다.
  const bits: string[] = [];
  if (where) bits.push(`It sits in ${where}`);
  if (r.website) bits.push("has its own booking site");
  if (r.phone) bits.push(`and takes calls on ${r.phone}`);
  if (bits.length >= 2) out.push(`${bits.join(", ").replace(", and", " and")}.`);

  return out;
}
