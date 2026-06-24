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
    metaTitle: "Best Vegetarian Restaurants in Bangkok — Verified Reviews",
    metaDescription:
      "Bangkok restaurants with vegetarian and vegan options most often praised in reviews.",
    intro:
      "Bangkok restaurants where reviewers explicitly mention vegetarian or vegan friendly menus. Includes dedicated vegetarian places + omnivore restaurants with strong veg options.",
    scoreFn: (r) => topicHits(r, "vegetarian_friendly") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "vegetarian_friendly") >= 1 || r.cuisines.includes("vegetarian"),
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
    scoreFn: (r) => (r.cuisines.includes("fine_dining") ? 200 : 0) + topicHits(r, "michelin") * 30 + r.trust_score,
    filterFn: (r) => r.cuisines.includes("fine_dining") || topicHits(r, "michelin") >= 1,
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
      r.cuisines.includes("fine_dining"),
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
    filterFn: (r) => topicHits(r, "korean_friendly") >= 1 || r.cuisines.includes("korean"),
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
  {
    slug: "date-night",
    title: "Best Bangkok Restaurants for a Date Night",
    metaTitle: "Best Date Night Restaurants in Bangkok (2026)",
    metaDescription:
      "Romantic Bangkok restaurants for couples — candlelit dinners, great ambience, and verified quality from real Google reviews.",
    intro:
      "Bangkok restaurants reviewers describe as romantic, great for couples, or perfect for a special occasion. Ranked by ambience mentions and Trust Score.",
    scoreFn: (r) =>
      topicHits(r, "romantic") * 12 +
      topicHits(r, "good_atmosphere") * 6 +
      topicHits(r, "good_view") * 5 +
      r.trust_score,
    filterFn: (r) =>
      topicHits(r, "romantic") >= 1 ||
      topicHits(r, "good_atmosphere") >= 2 ||
      r.cuisines.includes("fine_dining"),
  },
  {
    slug: "outdoor-seating",
    title: "Bangkok Restaurants with Outdoor Seating",
    metaTitle: "Best Bangkok Restaurants with Outdoor Seating (2026)",
    metaDescription:
      "Bangkok restaurants with verified outdoor seating, garden areas, or alfresco dining. Ranked by reviewer mentions.",
    intro:
      "Bangkok restaurants with outdoor seating — garden terraces, rooftop decks, or alfresco areas. Reviewers mention outdoor experience most.",
    scoreFn: (r) =>
      topicHits(r, "outdoor_seating") * 12 +
      topicHits(r, "good_view") * 4 +
      r.trust_score,
    filterFn: (r) => topicHits(r, "outdoor_seating") >= 1,
  },
  {
    slug: "quick-lunch",
    title: "Best Quick Lunch Spots in Bangkok",
    metaTitle: "Best Quick Lunch Restaurants in Bangkok (2026)",
    metaDescription:
      "Bangkok restaurants for a fast, quality lunch — quick service praised in reviews. Great for workers and tourists.",
    intro:
      "Bangkok restaurants reviewers praise for fast service and quick lunch — ideal for business lunches and midday breaks.",
    scoreFn: (r) =>
      topicHits(r, "fast_service") * 10 +
      topicHits(r, "affordable") * 4 +
      r.trust_score,
    filterFn: (r) => topicHits(r, "fast_service") >= 1,
  },
  {
    slug: "late-night",
    title: "Best Late Night Restaurants in Bangkok",
    metaTitle: "Best Late Night Food in Bangkok (2026) — Open Late",
    metaDescription:
      "Bangkok restaurants open late, verified from real reviews. From street-food-style to upscale late-night dining.",
    intro:
      "Bangkok restaurants open after 10pm — verified by reviewer mentions of late hours, night crowd, or after-midnight dining.",
    scoreFn: (r) =>
      topicHits(r, "open_late") * 15 +
      r.trust_score,
    filterFn: (r) => topicHits(r, "open_late") >= 1,
  },
  {
    slug: "hidden-gems",
    title: "Bangkok Hidden Gem Restaurants",
    metaTitle: "Bangkok Hidden Gem Restaurants — High Trust, Lower Profile",
    metaDescription:
      "Bangkok restaurants with high Trust Scores but fewer reviews — the real hidden gems not yet overrun by influencers.",
    intro:
      "High Trust Score restaurants with fewer than 500 reviews — the authentic spots influencers haven't discovered yet. Ranked by Trust Score.",
    scoreFn: (r) => r.trust_score * 2 - (r.total_reviews / 100),
    filterFn: (r) => r.trust_score >= 70 && r.total_reviews < 500 && r.total_reviews >= 30,
  },
  {
    slug: "authentic-thai",
    title: "Most Authentic Thai Restaurants in Bangkok",
    metaTitle: "Most Authentic Thai Restaurants in Bangkok (2026)",
    metaDescription:
      "Bangkok Thai restaurants rated highest for authenticity in real Google reviews — not tourist traps.",
    intro:
      "Bangkok Thai restaurants where reviewers specifically praise authenticity and traditional recipes. Not the tourist-trap versions.",
    scoreFn: (r) =>
      topicHits(r, "authentic") * 10 +
      (r.cuisines.includes("thai") ? 50 : 0) +
      r.trust_score,
    filterFn: (r) => r.cuisines.includes("thai") && topicHits(r, "authentic") >= 1,
  },
  {
    slug: "best-coffee",
    title: "Best Coffee Shops and Cafés in Bangkok",
    metaTitle: "Best Cafés and Coffee Shops in Bangkok (2026)",
    metaDescription:
      "Bangkok cafés ranked by Trust Score — specialty coffee, matcha, and great ambience verified from real Google reviews.",
    intro:
      "Bangkok's top cafés and coffee shops ranked by Trust Score. Where reviewers consistently praise the coffee, ambience, and value.",
    scoreFn: (r) =>
      (r.cuisines.includes("cafe") ? 100 : 0) +
      topicHits(r, "good_coffee") * 10 +
      topicHits(r, "good_atmosphere") * 5 +
      r.trust_score,
    filterFn: (r) => r.cuisines.includes("cafe") || topicHits(r, "good_coffee") >= 2,
  },
  {
    slug: "street-food",
    title: "Best Street Food in Bangkok",
    metaTitle: "Best Street Food Restaurants in Bangkok (2026)",
    metaDescription:
      "Bangkok street food ranked by real Google reviews — the best local spots from Yaowarat to Ari.",
    intro:
      "Bangkok street food and casual local eateries with the highest Trust Scores — where the real Bangkok eats.",
    scoreFn: (r) =>
      (r.cuisines.includes("street_food") ? 100 : 0) +
      topicHits(r, "local_favorite") * 8 +
      topicHits(r, "affordable") * 5 +
      r.trust_score,
    filterFn: (r) =>
      r.cuisines.includes("street_food") ||
      (topicHits(r, "local_favorite") >= 2 && r.trust_score >= 60),
  },
  {
    slug: "rooftop",
    title: "Best Rooftop Restaurants and Bars in Bangkok",
    metaTitle: "Best Rooftop Restaurants in Bangkok (2026) — Skyline Views",
    metaDescription:
      "Bangkok rooftop restaurants with skyline views — verified quality and views from real Google reviews.",
    intro:
      "Bangkok rooftop restaurants and sky bars with the best views — verified from reviewers who specifically mention rooftop, skyline, or city views.",
    scoreFn: (r) =>
      topicHits(r, "rooftop") * 20 +
      topicHits(r, "good_view") * 10 +
      r.trust_score,
    filterFn: (r) => topicHits(r, "rooftop") >= 1 || topicHits(r, "good_view") >= 3,
  },
  {
    slug: "michelin",
    title: "Michelin-Starred & Recommended Bangkok Restaurants",
    metaTitle: "Michelin Restaurants in Bangkok (2026) — Starred & Bib Gourmand",
    metaDescription:
      "Bangkok Michelin-starred and Michelin Bib Gourmand restaurants ranked by Trust Score from real Google reviews — independent verification.",
    intro:
      "Bangkok restaurants with Michelin recognition — starred or Bib Gourmand — verified independently from real Google review data. Cross-check the prestige with actual diner experience.",
    scoreFn: (r) =>
      topicHits(r, "michelin") * 30 +
      r.trust_score * 2,
    filterFn: (r) => topicHits(r, "michelin") >= 1,
  },
  {
    slug: "pet-friendly",
    title: "Pet-Friendly Restaurants in Bangkok",
    metaTitle: "Pet-Friendly Bangkok Restaurants (2026) — Dogs Welcome",
    metaDescription:
      "Bangkok restaurants where dogs and pets are welcome — verified from real Google reviews. Perfect for expats and pet owners.",
    intro:
      "Bangkok restaurants and cafés where reviewers mention bringing dogs or pets. Outdoor seating and pet water bowls are common features.",
    scoreFn: (r) =>
      topicHits(r, "pet_friendly") * 15 +
      topicHits(r, "outdoor_seating") * 5 +
      r.trust_score,
    filterFn: (r) => topicHits(r, "pet_friendly") >= 1,
  },
  {
    slug: "views",
    title: "Bangkok Restaurants with the Best Views (River, Skyline, Rooftop)",
    metaTitle: "Best View Restaurants in Bangkok 2026 — River, Skyline & Rooftop",
    metaDescription:
      "Bangkok restaurants with the most impressive views — Chao Phraya river, city skyline, and rooftop — ranked by reviewer mentions.",
    intro:
      "Bangkok restaurants where 'view' is a consistent reviewer theme — river views, city skylines, or rooftop panoramas. Ranked by view-related review mentions weighted by Trust Score.",
    scoreFn: (r) =>
      topicHits(r, "good_view") * 12 +
      topicHits(r, "rooftop") * 15 +
      topicHits(r, "river_view") * 10 +
      r.trust_score,
    filterFn: (r) =>
      topicHits(r, "good_view") >= 1 ||
      topicHits(r, "rooftop") >= 1,
  },
];

export function findBestFor(slug: string): Criterion | null {
  return BEST_FOR.find((c) => c.slug === slug) ?? null;
}
