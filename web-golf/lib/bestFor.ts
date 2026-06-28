// "Best for X" — golf course edition. Long-tail SEO + 차별화 정렬.

import type { Course } from "./types";

export type Criterion = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  scoreFn: (r: Course) => number;
  filterFn?: (r: Course) => boolean;
};

const topicHits = (r: Course, topic: string) => {
  const t = r.mentioned_topics.find((x) => x.topic === topic);
  return t ? t.count : 0;
};

export const BEST_FOR: Criterion[] = [
  {
    slug: "korean-friendly",
    title: "Best Korean-Friendly Golf Courses in Thailand",
    metaTitle: "Korean-Friendly Golf Courses in Thailand — Verified Reviews",
    metaDescription:
      "Thailand golf courses with Korean-speaking caddies, Korean menus, or strong Korean tourist popularity. Verified from real Google reviews and Korean blog mentions.",
    intro:
      "Thailand golf courses where Korean reviewers dominate, where reviewers explicitly mention Korean-speaking caddies, or that are featured on Korean Naver blogs.",
    scoreFn: (r) =>
      // korean_score is the auto-computed composite (topic + keywords + ko vol + blogs)
      (r.korean_score ?? 0) * 2 +
      (r.is_korean_friendly ? 25 : 0) +
      (r.golf_score ?? 0) * 0.5 +
      r.trust_score * 0.5,
    filterFn: (r) => r.is_korean_friendly === true,
  },
  {
    slug: "english-caddy",
    title: "Best English-Speaking Caddy Golf Courses in Thailand",
    metaTitle: "English-Speaking Caddy Golf Courses in Thailand",
    metaDescription:
      "Thailand golf courses where reviewers praise English-speaking caddies and international-friendly service.",
    intro:
      "Thailand golf courses where reviewers explicitly mention English-speaking caddies or international tourist friendly service.",
    scoreFn: (r) =>
      topicHits(r, "english_caddy") * 10 +
      topicHits(r, "international") * 5 +
      r.trust_score,
    filterFn: (r) =>
      topicHits(r, "english_caddy") >= 1 || topicHits(r, "international") >= 1,
  },
  {
    slug: "well-maintained",
    title: "Best Maintained Golf Courses in Thailand",
    metaTitle: "Best Course Conditions in Thailand — Verified Reviews",
    metaDescription:
      "Thailand golf courses most consistently described as well-maintained with great fairway and green conditions.",
    intro:
      "Thailand golf courses where reviewers most often mention pristine fairway conditions, fast greens, and excellent maintenance.",
    scoreFn: (r) => topicHits(r, "well_maintained") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "well_maintained") >= 1,
  },
  {
    slug: "challenging",
    title: "Most Challenging Golf Courses in Thailand",
    metaTitle: "Challenging Golf Courses in Thailand — Tournament-Grade",
    metaDescription:
      "Thailand golf courses described by reviewers as challenging, championship-grade, or testing layouts for serious golfers.",
    intro:
      "Thailand golf courses with championship-grade or challenging layouts — for serious players who want a real test.",
    scoreFn: (r) =>
      topicHits(r, "challenging") * 8 +
      topicHits(r, "championship") * 10 +
      topicHits(r, "tournament_ready") * 8 +
      r.trust_score,
    filterFn: (r) =>
      topicHits(r, "challenging") >= 1 ||
      topicHits(r, "championship") >= 1 ||
      topicHits(r, "tournament_ready") >= 1,
  },
  {
    slug: "scenic",
    title: "Most Scenic Golf Courses in Thailand",
    metaTitle: "Scenic Golf Courses in Thailand — Mountain & Ocean Views",
    metaDescription:
      "Thailand golf courses with the most scenic views — mountain, lake, ocean. Verified from reviewer mentions.",
    intro:
      "Thailand golf courses where reviewers most often praise scenic views — mountains, lakes, ocean, jungle.",
    scoreFn: (r) => topicHits(r, "scenic") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "scenic") >= 1,
  },
  {
    slug: "affordable",
    title: "Most Affordable Golf Courses in Thailand",
    metaTitle: "Affordable Golf Courses in Thailand — Best Value Green Fees",
    metaDescription:
      "Thailand golf courses where reviewers mention affordable green fees and great value, ranked by Trust Score.",
    intro:
      "Thailand golf courses where reviewers explicitly call out affordable green fees, weekday rates, or great-value packages.",
    scoreFn: (r) => topicHits(r, "affordable") * 8 + r.trust_score,
    filterFn: (r) => topicHits(r, "affordable") >= 1,
  },
  {
    slug: "championship",
    title: "Championship Golf Courses in Thailand",
    metaTitle: "Championship Golf Courses in Thailand (2026)",
    metaDescription:
      "Thailand championship-grade and tournament-ready golf courses — the most demanding layouts ranked by Trust Score.",
    intro:
      "Thailand golf courses described as championship-grade or tournament-ready — the layouts where pros and serious amateurs play.",
    scoreFn: (r) =>
      (r.categories.includes("country_club") ? 50 : 0) +
      topicHits(r, "championship") * 15 +
      topicHits(r, "tournament_ready") * 12 +
      r.trust_score,
    filterFn: (r) =>
      topicHits(r, "championship") >= 1 ||
      topicHits(r, "tournament_ready") >= 1,
  },
  {
    slug: "beginner-friendly",
    title: "Beginner-Friendly Golf Courses in Thailand",
    metaTitle: "Beginner-Friendly Golf Courses in Thailand",
    metaDescription:
      "Thailand golf courses described as easy, forgiving, or great for beginners — verified from real Google reviews.",
    intro:
      "Thailand golf courses with easy, forgiving layouts — recommended by reviewers for beginners and casual players.",
    scoreFn: (r) =>
      topicHits(r, "easy_course") * 8 +
      topicHits(r, "fun_layout") * 5 +
      r.trust_score,
    filterFn: (r) =>
      topicHits(r, "easy_course") >= 1 || r.categories.includes("driving_range"),
  },
  {
    slug: "near-bangkok",
    title: "Best Golf Courses Near Bangkok",
    metaTitle: "Golf Courses Near Bangkok — Day Trip Friendly",
    metaDescription:
      "Top golf courses within easy reach of Bangkok and BKK/DMK airports. Day-trip friendly courses ranked by Trust Score.",
    intro:
      "Top golf courses in or near Bangkok — Pathum Thani, Samut Prakan, Nonthaburi, plus Chonburi/Pattaya day-trips.",
    scoreFn: (r) => {
      const cityScore =
        r.city === "bangkok" ? 30 :
        r.city === "samut_prakan" || r.city === "nonthaburi" || r.city === "pathum_thani" ? 20 :
        r.city === "chon_buri" ? 10 : 0;
      return cityScore + topicHits(r, "near_airport") * 5 + r.trust_score;
    },
    filterFn: (r) =>
      ["bangkok", "samut_prakan", "nonthaburi", "pathum_thani", "chon_buri"].includes(r.city),
  },
  {
    slug: "highly-recommended",
    title: "Best Golf Courses in Thailand 2026 — Ranked by Trust Score",
    metaTitle: "Best Golf Courses in Thailand 2026 — Top 50 Ranked",
    metaDescription:
      "The best golf courses in Thailand ranked by Trust Score from real Google reviews. Top picks for Bangkok, Pattaya, Hua Hin & Phuket — verified by golfers, not agencies. Updated 2026.",
    intro:
      "Thailand's top-ranked golf courses by Trust Score — the strongest combination of Google rating, review volume, Local Guide reviews, and reviewer authority. Updated continuously from real reviews.",
    scoreFn: (r) =>
      r.trust_score * 1.2 +
      topicHits(r, "well_maintained") * 3 +
      topicHits(r, "good_caddy") * 3,
    filterFn: (r) => r.trust_score >= 50,
  },
];

export function findBestFor(slug: string): Criterion | null {
  return BEST_FOR.find((c) => c.slug === slug) ?? null;
}
