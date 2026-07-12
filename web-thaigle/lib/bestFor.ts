// "Best for X" — restaurant edition. Long-tail SEO + 차별화 정렬.

import type { Restaurant } from "./types";

export type Criterion = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  scoreFn: (r: Restaurant) => number;
  filterFn?: (r: Restaurant) => boolean;
};

const topicHits = (r: Restaurant, topic: string) => {
  const t = r.mentioned_topics.find((x) => x.topic === topic);
  return t ? t.count : 0;
};

export const BEST_FOR: Criterion[] = [
  {
    slug: "halal",
    title: "Best Halal Restaurants in Bangkok",
    metaTitle: "Best Halal Restaurants in Bangkok (2026) — Verified Reviews",
    metaDescription:
      "Bangkok halal-certified restaurants ranked by reviewer mentions of halal credentials. Verified from real Google review analysis.",
    intro:
      "Bangkok restaurants where reviewers explicitly mention halal certification or muslim-friendly options. Sorted by mention count weighted by Trust Score.",
    scoreFn: (r) => topicHits(r, "halal_certified") * 12 + r.trust_score,
    filterFn: (r) => topicHits(r, "halal_certified") >= 1 || r.cuisines.includes("halal"),
  },
  {
    slug: "vegetarian-friendly",
    title: "Best Vegetarian-Friendly Restaurants in Bangkok",
    metaTitle: "Best Vegetarian Restaurants in Bangkok 2026 — Verified Reviews",
    metaDescription:
      "Bangkok restaurants with vegetarian and vegan options most praised in 2026 real Google reviews. No influencer picks.",
    intro:
      "Bangkok restaurants where reviewers explicitly mention vegetarian or vegan friendly menus. Includes dedicated vegetarian places + omnivore restaurants with strong veg options.",
    scoreFn: (r) => topicHits(r, "vegetarian_friendly") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "vegetarian_friendly") >= 1 || r.cuisines.includes("vegetarian"),
  },
  {
    slug: "affordable",
    title: "Most Affordable Bangkok Restaurants",
    metaTitle: "Best Affordable Restaurants in Bangkok 2026 — Cheap Eats Ranked",
    metaDescription:
      "Bangkok restaurants most often described as affordable, reasonably priced, or good value in real Google reviews 2026. Budget-friendly picks, no influencer bias.",
    intro:
      "Bangkok restaurants where reviewers most often use words like affordable, cheap, reasonable price, or good value.",
    scoreFn: (r) => topicHits(r, "affordable") * 8 + r.trust_score,
    filterFn: (r) => topicHits(r, "affordable") >= 1,
  },
  {
    slug: "fine-dining",
    title: "Bangkok's Top Fine Dining Restaurants",
    metaTitle: "Bangkok Fine Dining — Top Restaurants (2026)",
    metaDescription:
      "Bangkok fine dining restaurants and tasting menu venues, ranked by Trust Score.",
    intro:
      "Bangkok fine dining and tasting menu restaurants — premium dining experiences ranked by Trust Score and reviewer mentions of refined cuisine.",
    scoreFn: (r) => (r.cuisines.includes("fine_dining") ? 200 : 0) + topicHits(r, "michelin") * 30 + r.trust_score,
    filterFn: (r) => r.cuisines.includes("fine_dining") || topicHits(r, "michelin") >= 1,
  },
  {
    slug: "instagrammable",
    title: "Most Instagrammable Bangkok Restaurants",
    metaTitle: "Most Instagrammable Bangkok Restaurants 2026 — Best for Photos",
    metaDescription:
      "Bangkok restaurants most often described as photo-worthy, Instagrammable, or with great views in 2026 Google reviews. Ranked by photo mention count + Trust Score.",
    intro:
      "Bangkok restaurants reviewers love to photograph — Instagrammable interiors, plating, rooftop views.",
    scoreFn: (r) =>
      topicHits(r, "instagram_worthy") * 8 +
      topicHits(r, "good_view") * 6 +
      topicHits(r, "good_atmosphere") * 4 +
      r.trust_score,
    filterFn: (r) =>
      topicHits(r, "instagram_worthy") >= 1 ||
      topicHits(r, "good_view") >= 1 ||
      r.cuisines.includes("fine_dining"),
  },
  {
    slug: "korean-friendly",
    title: "Bangkok Restaurants with Korean Menus",
    metaTitle: "Best Korean-Friendly Bangkok Restaurants 2026 — With Korean Menus",
    metaDescription:
      "Bangkok restaurants with Korean menus, Korean-speaking staff, or popular with Korean tourists. Ranked by real Google reviews in 2026.",
    intro:
      "Bangkok restaurants frequently mentioned by Korean reviewers or with Korean-language menus. Popular with Korean tourists.",
    scoreFn: (r) => topicHits(r, "korean_friendly") * 12 + r.language_breakdown.other * 0.5 + r.trust_score,
    filterFn: (r) => topicHits(r, "korean_friendly") >= 1 || r.cuisines.includes("korean"),
  },
  {
    slug: "kid-friendly",
    title: "Family & Kid Friendly Bangkok Restaurants",
    metaTitle: "Best Family & Kid-Friendly Bangkok Restaurants 2026 — Verified",
    metaDescription:
      "Bangkok restaurants with family-friendly atmosphere and good options for kids. Ranked by real Google reviews in 2026 — no influencer picks.",
    intro:
      "Bangkok restaurants where reviewers explicitly mention family-friendly atmosphere, kids menu, or being good with children.",
    scoreFn: (r) => topicHits(r, "kid_friendly") * 8 + r.trust_score,
    filterFn: (r) => topicHits(r, "kid_friendly") >= 1,
  },
  {
    slug: "great-view",
    title: "Bangkok Restaurants with the Best Views",
    metaTitle: "Best Bangkok Rooftop & View Restaurants 2026 — Ranked by Reviews",
    metaDescription:
      "Bangkok rooftop restaurants with great views — skyline, river view. Ranked by real Google reviews in 2026. Sky Bar, Vertigo & verified hidden gems.",
    intro:
      "Bangkok restaurants with skyline, rooftop, or river views — top-mentioned in reviews.",
    scoreFn: (r) => topicHits(r, "good_view") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "good_view") >= 1,
  },
  {
    slug: "highly-recommended",
    title: "Most Highly Recommended Bangkok Restaurants",
    metaTitle: "Most Highly Recommended Bangkok Restaurants 2026 — Top Picks",
    metaDescription:
      "Bangkok restaurants most explicitly praised as delicious, authentic, or recommend-worthy in 2026 real Google reviews. No influencer bias — data-driven rankings.",
    intro:
      "Bangkok restaurants where reviewers consistently say authentic, delicious, or recommend coming back.",
    scoreFn: (r) =>
      topicHits(r, "tasty") * 5 + topicHits(r, "authentic") * 5 + r.trust_score,
    filterFn: (r) => topicHits(r, "tasty") >= 1 || topicHits(r, "authentic") >= 1,
  },
  {
    slug: "michelin-mentioned",
    title: "Bangkok Restaurants Reviewers Compare to Michelin",
    metaTitle: "Michelin-Mentioned Bangkok Restaurants 2026 — Ranked by Reviews",
    metaDescription:
      "194 Bangkok restaurants where Google reviewers explicitly bring up Michelin — starred, Bib Gourmand, or guide-mentioned. Ranked by real review data, not paid placements.",
    intro:
      "Bangkok restaurants reviewers describe in the same breath as Michelin — starred venues, Bib Gourmand picks, and spots reviewers say deserve a star. Sorted by mention count weighted by Trust Score.",
    scoreFn: (r) => topicHits(r, "michelin") * 15 + r.trust_score,
    filterFn: (r) => topicHits(r, "michelin") >= 1,
  },
  {
    slug: "live-music",
    title: "Bangkok Restaurants with Live Music",
    metaTitle: "Best Bangkok Restaurants with Live Music 2026 — Ranked by Reviews",
    metaDescription:
      "Bangkok restaurants and bars where reviewers mention a live band, singer, or jazz night. Ranked by real Google reviews in 2026 — no paid placements.",
    intro:
      "Bangkok restaurants and bars reviewers call out for live bands, singers, or jazz nights — good for a dinner that turns into a night out.",
    scoreFn: (r) => topicHits(r, "live_music") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "live_music") >= 1,
  },
];

export function findBestFor(slug: string): Criterion | null {
  return BEST_FOR.find((c) => c.slug === slug) ?? null;
}
