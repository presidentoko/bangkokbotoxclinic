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
    filterFn: (r) => topicHits(r, "halal_certified") >= 1 || r.categories.includes("halal"),
  },
  {
    slug: "vegetarian-friendly",
    title: "Best Vegetarian-Friendly Restaurants in Bangkok",
    metaTitle: "Best Vegetarian Restaurants in Bangkok — Verified Reviews",
    metaDescription:
      "Bangkok restaurants with vegetarian and vegan options most often praised in reviews.",
    intro:
      "Bangkok restaurants where reviewers explicitly mention vegetarian or vegan friendly menus. Includes dedicated vegetarian places + omnivore restaurants with strong veg options.",
    scoreFn: (r) => topicHits(r, "vegetarian_friendly") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "vegetarian_friendly") >= 1 || r.categories.includes("vegetarian"),
  },
  {
    slug: "affordable",
    title: "Most Affordable Bangkok Restaurants",
    metaTitle: "Affordable Bangkok Restaurants — Verified Reviews",
    metaDescription:
      "Bangkok restaurants most often described as affordable, reasonably priced, or good value in real Google reviews.",
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
    scoreFn: (r) => (r.categories.includes("fine_dining") ? 200 : 0) + topicHits(r, "michelin") * 30 + r.trust_score,
    filterFn: (r) => r.categories.includes("fine_dining") || topicHits(r, "michelin") >= 1,
  },
  {
    slug: "instagrammable",
    title: "Most Instagrammable Bangkok Restaurants",
    metaTitle: "Instagrammable Bangkok Restaurants — Best for Photos",
    metaDescription:
      "Bangkok restaurants most often described as photo-worthy, Instagrammable, or with great views.",
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
      r.categories.includes("fine_dining"),
  },
  {
    slug: "korean-friendly",
    title: "Bangkok Restaurants with Korean Menus",
    metaTitle: "Korean-Friendly Bangkok Restaurants",
    metaDescription:
      "Bangkok restaurants where reviewers mention Korean menus, Korean staff, or Korean tourist popularity.",
    intro:
      "Bangkok restaurants frequently mentioned by Korean reviewers or with Korean-language menus. Popular with Korean tourists.",
    scoreFn: (r) => topicHits(r, "korean_friendly") * 12 + r.language_breakdown.other * 0.5 + r.trust_score,
    filterFn: (r) => topicHits(r, "korean_friendly") >= 1 || r.categories.includes("korean"),
  },
  {
    slug: "kid-friendly",
    title: "Family & Kid Friendly Bangkok Restaurants",
    metaTitle: "Family Friendly Bangkok Restaurants",
    metaDescription:
      "Bangkok restaurants with family-friendly atmosphere and good options for kids.",
    intro:
      "Bangkok restaurants where reviewers explicitly mention family-friendly atmosphere, kids menu, or being good with children.",
    scoreFn: (r) => topicHits(r, "kid_friendly") * 8 + r.trust_score,
    filterFn: (r) => topicHits(r, "kid_friendly") >= 1,
  },
  {
    slug: "great-view",
    title: "Bangkok Restaurants with the Best Views",
    metaTitle: "Bangkok Rooftop & View Restaurants",
    metaDescription:
      "Bangkok restaurants with great views — rooftop dining, skyline, river view.",
    intro:
      "Bangkok restaurants with skyline, rooftop, or river views — top-mentioned in reviews.",
    scoreFn: (r) => topicHits(r, "good_view") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "good_view") >= 1,
  },
  {
    slug: "highly-recommended",
    title: "Most Highly Recommended Bangkok Restaurants",
    metaTitle: "Highly Recommended Bangkok Restaurants",
    metaDescription:
      "Bangkok restaurants most explicitly praised as delicious, authentic, or recommend-worthy.",
    intro:
      "Bangkok restaurants where reviewers consistently say authentic, delicious, or recommend coming back.",
    scoreFn: (r) =>
      topicHits(r, "tasty") * 5 + topicHits(r, "authentic") * 5 + r.trust_score,
    filterFn: (r) => topicHits(r, "tasty") >= 1 || topicHits(r, "authentic") >= 1,
  },
];

export function findBestFor(slug: string): Criterion | null {
  return BEST_FOR.find((c) => c.slug === slug) ?? null;
}
