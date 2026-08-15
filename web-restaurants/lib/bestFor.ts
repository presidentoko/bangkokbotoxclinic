// "Best for X" — restaurant edition. Long-tail SEO + 차별화 정렬.
//
// Bangkok (878 restaurants) and Pattaya (1,135 restaurants) each get their own
// slug per criterion — Pattaya actually has MORE restaurants than Bangkok, but
// used to be entirely unrepresented here (every filterFn matched both cities
// while every title/description claimed "Bangkok"). cityFilter() below scopes
// each criterion's matches to the city its copy actually names.

import type { Restaurant } from "./types";

export type Criterion = {
  slug: string;
  city: "bangkok" | "pattaya";
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  scoreFn: (r: Restaurant) => number;
  filterFn?: (r: Restaurant) => boolean;
};

type CityCopy = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
};

type CriterionTemplate = {
  key: string;
  scoreFn: (r: Restaurant) => number;
  filterFn?: (r: Restaurant) => boolean;
  bangkok: CityCopy;
  pattaya: CityCopy;
};

const topicHits = (r: Restaurant, topic: string) => {
  const t = r.mentioned_topics.find((x) => x.topic === topic);
  return t ? t.count : 0;
};

const cityFilter = (
  city: "bangkok" | "pattaya",
  filterFn?: (r: Restaurant) => boolean
) => (r: Restaurant) => r.city === city && (!filterFn || filterFn(r));

const TEMPLATES: CriterionTemplate[] = [
  {
    key: "halal",
    scoreFn: (r) => topicHits(r, "halal_certified") * 12 + r.trust_score,
    filterFn: (r) => topicHits(r, "halal_certified") >= 1 || r.cuisines.includes("halal"),
    bangkok: {
      title: "Best Halal Restaurants in Bangkok",
      metaTitle: "Best Halal Restaurants in Bangkok (2026) — Verified Reviews",
      metaDescription:
        "Bangkok halal-certified restaurants ranked by reviewer mentions of halal credentials. Verified from real Google review analysis.",
      intro:
        "Bangkok restaurants where reviewers explicitly mention halal certification or muslim-friendly options. Sorted by mention count weighted by Trust Score.",
    },
    pattaya: {
      title: "Best Halal Restaurants in Pattaya",
      metaTitle: "Best Halal Restaurants in Pattaya (2026) — Verified Reviews",
      metaDescription:
        "Pattaya halal-certified restaurants ranked by reviewer mentions of halal credentials. Verified from real Google review analysis.",
      intro:
        "Pattaya restaurants where reviewers explicitly mention halal certification or muslim-friendly options. Sorted by mention count weighted by Trust Score.",
    },
  },
  {
    key: "vegetarian-friendly",
    scoreFn: (r) => topicHits(r, "vegetarian_friendly") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "vegetarian_friendly") >= 1 || r.cuisines.includes("vegetarian"),
    bangkok: {
      title: "Best Vegetarian-Friendly Restaurants in Bangkok",
      metaTitle: "Best Vegetarian Restaurants in Bangkok — Verified Reviews",
      metaDescription:
        "Bangkok restaurants with vegetarian and vegan options most often praised in reviews.",
      intro:
        "Bangkok restaurants where reviewers explicitly mention vegetarian or vegan friendly menus. Includes dedicated vegetarian places + omnivore restaurants with strong veg options.",
    },
    pattaya: {
      title: "Best Vegetarian-Friendly Restaurants in Pattaya",
      metaTitle: "Best Vegetarian Restaurants in Pattaya — Verified Reviews",
      metaDescription:
        "Pattaya restaurants with vegetarian and vegan options most often praised in reviews.",
      intro:
        "Pattaya restaurants where reviewers explicitly mention vegetarian or vegan friendly menus. Includes dedicated vegetarian places + omnivore restaurants with strong veg options.",
    },
  },
  {
    key: "affordable",
    scoreFn: (r) => topicHits(r, "affordable") * 8 + r.trust_score,
    filterFn: (r) => topicHits(r, "affordable") >= 1,
    bangkok: {
      title: "Most Affordable Bangkok Restaurants",
      metaTitle: "Affordable Bangkok Restaurants — Verified Reviews",
      metaDescription:
        "Bangkok restaurants most often described as affordable, reasonably priced, or good value in real Google reviews.",
      intro:
        "Bangkok restaurants where reviewers most often use words like affordable, cheap, reasonable price, or good value.",
    },
    pattaya: {
      title: "Most Affordable Pattaya Restaurants",
      metaTitle: "Affordable Pattaya Restaurants — Verified Reviews",
      metaDescription:
        "Pattaya restaurants most often described as affordable, reasonably priced, or good value in real Google reviews.",
      intro:
        "Pattaya restaurants where reviewers most often use words like affordable, cheap, reasonable price, or good value.",
    },
  },
  {
    key: "fine-dining",
    scoreFn: (r) => (r.cuisines.includes("fine_dining") ? 200 : 0) + topicHits(r, "michelin") * 30 + r.trust_score,
    filterFn: (r) => r.cuisines.includes("fine_dining") || topicHits(r, "michelin") >= 1,
    bangkok: {
      title: "Bangkok's Top Fine Dining Restaurants",
      metaTitle: "Bangkok Fine Dining — Top Restaurants (2026)",
      metaDescription:
        "Bangkok fine dining restaurants and tasting menu venues, ranked by Trust Score.",
      intro:
        "Bangkok fine dining and tasting menu restaurants — premium dining experiences ranked by Trust Score and reviewer mentions of refined cuisine.",
    },
    pattaya: {
      title: "Pattaya's Top Fine Dining Restaurants",
      metaTitle: "Pattaya Fine Dining — Top Restaurants (2026)",
      metaDescription:
        "Pattaya fine dining restaurants and tasting menu venues, ranked by Trust Score.",
      intro:
        "Pattaya fine dining and tasting menu restaurants — premium dining experiences ranked by Trust Score and reviewer mentions of refined cuisine.",
    },
  },
  {
    key: "instagrammable",
    scoreFn: (r) =>
      topicHits(r, "instagram_worthy") * 8 +
      topicHits(r, "good_view") * 6 +
      topicHits(r, "good_atmosphere") * 4 +
      r.trust_score,
    filterFn: (r) =>
      topicHits(r, "instagram_worthy") >= 1 ||
      topicHits(r, "good_view") >= 1 ||
      r.cuisines.includes("fine_dining"),
    bangkok: {
      title: "Most Instagrammable Bangkok Restaurants",
      metaTitle: "Instagrammable Bangkok Restaurants — Best for Photos",
      metaDescription:
        "Bangkok restaurants most often described as photo-worthy, Instagrammable, or with great views.",
      intro:
        "Bangkok restaurants reviewers love to photograph — Instagrammable interiors, plating, rooftop views.",
    },
    pattaya: {
      title: "Most Instagrammable Pattaya Restaurants",
      metaTitle: "Instagrammable Pattaya Restaurants — Best for Photos",
      metaDescription:
        "Pattaya restaurants most often described as photo-worthy, Instagrammable, or with great views.",
      intro:
        "Pattaya restaurants reviewers love to photograph — Instagrammable interiors, plating, beachfront and rooftop views.",
    },
  },
  {
    key: "korean-friendly",
    scoreFn: (r) => topicHits(r, "korean_friendly") * 12 + r.language_breakdown.other * 0.5 + r.trust_score,
    filterFn: (r) => topicHits(r, "korean_friendly") >= 1 || r.cuisines.includes("korean"),
    bangkok: {
      title: "Bangkok Restaurants with Korean Menus",
      metaTitle: "Korean-Friendly Bangkok Restaurants",
      metaDescription:
        "Bangkok restaurants where reviewers mention Korean menus, Korean staff, or Korean tourist popularity.",
      intro:
        "Bangkok restaurants frequently mentioned by Korean reviewers or with Korean-language menus. Popular with Korean tourists.",
    },
    pattaya: {
      title: "Pattaya Restaurants with Korean Menus",
      metaTitle: "Korean-Friendly Pattaya Restaurants",
      metaDescription:
        "Pattaya restaurants where reviewers mention Korean menus, Korean staff, or Korean tourist popularity.",
      intro:
        "Pattaya restaurants frequently mentioned by Korean reviewers or with Korean-language menus. Popular with Korean tourists.",
    },
  },
  {
    key: "kid-friendly",
    scoreFn: (r) => topicHits(r, "kid_friendly") * 8 + r.trust_score,
    filterFn: (r) => topicHits(r, "kid_friendly") >= 1,
    bangkok: {
      title: "Family & Kid Friendly Bangkok Restaurants",
      metaTitle: "Family Friendly Bangkok Restaurants",
      metaDescription:
        "Bangkok restaurants with family-friendly atmosphere and good options for kids.",
      intro:
        "Bangkok restaurants where reviewers explicitly mention family-friendly atmosphere, kids menu, or being good with children.",
    },
    pattaya: {
      title: "Family & Kid Friendly Pattaya Restaurants",
      metaTitle: "Family Friendly Pattaya Restaurants",
      metaDescription:
        "Pattaya restaurants with family-friendly atmosphere and good options for kids.",
      intro:
        "Pattaya restaurants where reviewers explicitly mention family-friendly atmosphere, kids menu, or being good with children.",
    },
  },
  {
    key: "great-view",
    scoreFn: (r) => topicHits(r, "good_view") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "good_view") >= 1,
    bangkok: {
      title: "Bangkok Restaurants with the Best Views",
      metaTitle: "Bangkok Rooftop & View Restaurants",
      metaDescription:
        "Bangkok restaurants with great views — rooftop dining, skyline, river view.",
      intro:
        "Bangkok restaurants with skyline, rooftop, or river views — top-mentioned in reviews.",
    },
    pattaya: {
      title: "Pattaya Restaurants with the Best Views",
      metaTitle: "Pattaya Rooftop & Sea View Restaurants",
      metaDescription:
        "Pattaya restaurants with great views — rooftop dining, skyline, sea view.",
      intro:
        "Pattaya restaurants with skyline, rooftop, or sea views — top-mentioned in reviews.",
    },
  },
  {
    key: "highly-recommended",
    scoreFn: (r) => topicHits(r, "tasty") * 5 + topicHits(r, "authentic") * 5 + r.trust_score,
    filterFn: (r) => topicHits(r, "tasty") >= 1 || topicHits(r, "authentic") >= 1,
    bangkok: {
      title: "Most Highly Recommended Bangkok Restaurants",
      metaTitle: "Highly Recommended Bangkok Restaurants",
      metaDescription:
        "Bangkok restaurants most explicitly praised as delicious, authentic, or recommend-worthy.",
      intro:
        "Bangkok restaurants where reviewers consistently say authentic, delicious, or recommend coming back.",
    },
    pattaya: {
      title: "Most Highly Recommended Pattaya Restaurants",
      metaTitle: "Highly Recommended Pattaya Restaurants",
      metaDescription:
        "Pattaya restaurants most explicitly praised as delicious, authentic, or recommend-worthy.",
      intro:
        "Pattaya restaurants where reviewers consistently say authentic, delicious, or recommend coming back.",
    },
  },
  {
    key: "date-night",
    scoreFn: (r) =>
      topicHits(r, "romantic") * 12 +
      topicHits(r, "good_atmosphere") * 6 +
      topicHits(r, "good_view") * 5 +
      r.trust_score,
    filterFn: (r) =>
      topicHits(r, "romantic") >= 1 ||
      topicHits(r, "good_atmosphere") >= 2 ||
      r.cuisines.includes("fine_dining"),
    bangkok: {
      title: "Best Bangkok Restaurants for a Date Night",
      metaTitle: "Best Date Night Restaurants in Bangkok (2026)",
      metaDescription:
        "Romantic Bangkok restaurants for couples — candlelit dinners, great ambience, and verified quality from real Google reviews.",
      intro:
        "Bangkok restaurants reviewers describe as romantic, great for couples, or perfect for a special occasion. Ranked by ambience mentions and Trust Score.",
    },
    pattaya: {
      title: "Best Pattaya Restaurants for a Date Night",
      metaTitle: "Best Date Night Restaurants in Pattaya (2026)",
      metaDescription:
        "Romantic Pattaya restaurants for couples — candlelit dinners, great ambience, and verified quality from real Google reviews.",
      intro:
        "Pattaya restaurants reviewers describe as romantic, great for couples, or perfect for a special occasion. Ranked by ambience mentions and Trust Score.",
    },
  },
  {
    key: "quick-lunch",
    scoreFn: (r) => topicHits(r, "fast_service") * 10 + topicHits(r, "affordable") * 4 + r.trust_score,
    filterFn: (r) => topicHits(r, "fast_service") >= 1,
    bangkok: {
      title: "Best Quick Lunch Spots in Bangkok",
      metaTitle: "Best Quick Lunch Restaurants in Bangkok (2026)",
      metaDescription:
        "Bangkok restaurants for a fast, quality lunch — quick service praised in reviews. Great for workers and tourists.",
      intro:
        "Bangkok restaurants reviewers praise for fast service and quick lunch — ideal for business lunches and midday breaks.",
    },
    pattaya: {
      title: "Best Quick Lunch Spots in Pattaya",
      metaTitle: "Best Quick Lunch Restaurants in Pattaya (2026)",
      metaDescription:
        "Pattaya restaurants for a fast, quality lunch — quick service praised in reviews. Great for tourists and locals.",
      intro:
        "Pattaya restaurants reviewers praise for fast service and quick lunch — ideal for a break from the beach.",
    },
  },
  {
    key: "hidden-gems",
    scoreFn: (r) => r.trust_score * 2 - r.total_reviews / 100,
    filterFn: (r) => r.trust_score >= 70 && r.total_reviews < 500 && r.total_reviews >= 30,
    bangkok: {
      title: "Bangkok Hidden Gem Restaurants",
      metaTitle: "Bangkok Hidden Gem Restaurants — High Trust, Lower Profile",
      metaDescription:
        "Bangkok restaurants with high Trust Scores but fewer reviews — the real hidden gems not yet overrun by influencers.",
      intro:
        "High Trust Score restaurants with fewer than 500 reviews — the authentic spots influencers haven't discovered yet. Ranked by Trust Score.",
    },
    pattaya: {
      title: "Pattaya Hidden Gem Restaurants",
      metaTitle: "Pattaya Hidden Gem Restaurants — High Trust, Lower Profile",
      metaDescription:
        "Pattaya restaurants with high Trust Scores but fewer reviews — the real hidden gems not yet overrun by influencers.",
      intro:
        "High Trust Score restaurants with fewer than 500 reviews — the authentic spots influencers haven't discovered yet. Ranked by Trust Score.",
    },
  },
  {
    key: "authentic-thai",
    scoreFn: (r) => topicHits(r, "authentic") * 10 + (r.cuisines.includes("thai") ? 50 : 0) + r.trust_score,
    filterFn: (r) => r.cuisines.includes("thai") && topicHits(r, "authentic") >= 1,
    bangkok: {
      title: "Most Authentic Thai Restaurants in Bangkok",
      metaTitle: "Most Authentic Thai Restaurants in Bangkok (2026)",
      metaDescription:
        "Bangkok Thai restaurants rated highest for authenticity in real Google reviews — not tourist traps.",
      intro:
        "Bangkok Thai restaurants where reviewers specifically praise authenticity and traditional recipes. Not the tourist-trap versions.",
    },
    pattaya: {
      title: "Most Authentic Thai Restaurants in Pattaya",
      metaTitle: "Most Authentic Thai Restaurants in Pattaya (2026)",
      metaDescription:
        "Pattaya Thai restaurants rated highest for authenticity in real Google reviews — not tourist traps.",
      intro:
        "Pattaya Thai restaurants where reviewers specifically praise authenticity and traditional recipes. Not the tourist-trap versions.",
    },
  },
  {
    key: "best-coffee",
    scoreFn: (r) =>
      (r.cuisines.includes("cafe") ? 100 : 0) +
      topicHits(r, "good_coffee") * 10 +
      topicHits(r, "good_atmosphere") * 5 +
      r.trust_score,
    filterFn: (r) => r.cuisines.includes("cafe") || topicHits(r, "good_coffee") >= 2,
    bangkok: {
      title: "Best Coffee Shops and Cafés in Bangkok",
      metaTitle: "Best Cafés and Coffee Shops in Bangkok (2026)",
      metaDescription:
        "Bangkok cafés ranked by Trust Score — specialty coffee, matcha, and great ambience verified from real Google reviews.",
      intro:
        "Bangkok's top cafés and coffee shops ranked by Trust Score. Where reviewers consistently praise the coffee, ambience, and value.",
    },
    pattaya: {
      title: "Best Coffee Shops and Cafés in Pattaya",
      metaTitle: "Best Cafés and Coffee Shops in Pattaya (2026)",
      metaDescription:
        "Pattaya cafés ranked by Trust Score — specialty coffee, matcha, and great ambience verified from real Google reviews.",
      intro:
        "Pattaya's top cafés and coffee shops ranked by Trust Score. Where reviewers consistently praise the coffee, ambience, and value.",
    },
  },
  {
    key: "street-food",
    scoreFn: (r) =>
      (r.cuisines.includes("street_food") ? 100 : 0) +
      topicHits(r, "local_favorite") * 8 +
      topicHits(r, "affordable") * 5 +
      r.trust_score,
    filterFn: (r) =>
      r.cuisines.includes("street_food") || (topicHits(r, "local_favorite") >= 2 && r.trust_score >= 60),
    bangkok: {
      title: "Best Street Food in Bangkok",
      metaTitle: "Best Street Food Restaurants in Bangkok (2026)",
      metaDescription:
        "Bangkok street food ranked by real Google reviews — the best local spots from Yaowarat to Ari.",
      intro:
        "Bangkok street food and casual local eateries with the highest Trust Scores — where the real Bangkok eats.",
    },
    pattaya: {
      title: "Best Street Food in Pattaya",
      metaTitle: "Best Street Food Restaurants in Pattaya (2026)",
      metaDescription:
        "Pattaya street food ranked by real Google reviews — the best local spots from Central Pattaya to Naklua.",
      intro:
        "Pattaya street food and casual local eateries with the highest Trust Scores — where the real Pattaya eats, beyond the tourist strip.",
    },
  },
  {
    key: "rooftop",
    scoreFn: (r) => topicHits(r, "rooftop") * 20 + topicHits(r, "good_view") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "rooftop") >= 1 || topicHits(r, "good_view") >= 3,
    bangkok: {
      title: "Best Rooftop Restaurants and Bars in Bangkok",
      metaTitle: "Best Rooftop Restaurants in Bangkok (2026) — Skyline Views",
      metaDescription:
        "Bangkok rooftop restaurants with skyline views — verified quality and views from real Google reviews.",
      intro:
        "Bangkok rooftop restaurants and sky bars with the best views — verified from reviewers who specifically mention rooftop, skyline, or city views.",
    },
    pattaya: {
      title: "Best Rooftop Restaurants and Bars in Pattaya",
      metaTitle: "Best Rooftop Restaurants in Pattaya (2026) — Skyline & Sea Views",
      metaDescription:
        "Pattaya rooftop restaurants with skyline and sea views — verified quality and views from real Google reviews.",
      intro:
        "Pattaya rooftop restaurants and sky bars with the best views — verified from reviewers who specifically mention rooftop, skyline, or sea views.",
    },
  },
  {
    key: "michelin",
    scoreFn: (r) => topicHits(r, "michelin") * 30 + r.trust_score * 2,
    filterFn: (r) => topicHits(r, "michelin") >= 1,
    bangkok: {
      title: "Michelin-Starred & Recommended Bangkok Restaurants",
      metaTitle: "Michelin Restaurants in Bangkok (2026) — Starred & Bib Gourmand",
      metaDescription:
        "Bangkok Michelin-starred and Michelin Bib Gourmand restaurants ranked by Trust Score from real Google reviews — independent verification.",
      intro:
        "Bangkok restaurants with Michelin recognition — starred or Bib Gourmand — verified independently from real Google review data. Cross-check the prestige with actual diner experience.",
    },
    pattaya: {
      title: "Michelin-Recommended Pattaya Restaurants",
      metaTitle: "Michelin Restaurants in Pattaya (2026) — Recommended & Bib Gourmand",
      metaDescription:
        "Pattaya restaurants with Michelin recognition ranked by Trust Score from real Google reviews — independent verification.",
      intro:
        "Pattaya restaurants with Michelin recognition — verified independently from real Google review data. Cross-check the prestige with actual diner experience.",
    },
  },
  {
    key: "views",
    scoreFn: (r) =>
      topicHits(r, "good_view") * 12 + topicHits(r, "rooftop") * 15 + topicHits(r, "river_view") * 10 + r.trust_score,
    filterFn: (r) => topicHits(r, "good_view") >= 1 || topicHits(r, "rooftop") >= 1,
    bangkok: {
      title: "Bangkok Restaurants with the Best Views (River, Skyline, Rooftop)",
      metaTitle: "Best View Restaurants in Bangkok 2026 — River, Skyline & Rooftop",
      metaDescription:
        "Bangkok restaurants with the most impressive views — Chao Phraya river, city skyline, and rooftop — ranked by reviewer mentions.",
      intro:
        "Bangkok restaurants where 'view' is a consistent reviewer theme — river views, city skylines, or rooftop panoramas. Ranked by view-related review mentions weighted by Trust Score.",
    },
    pattaya: {
      title: "Pattaya Restaurants with the Best Views (Sea, Skyline, Rooftop)",
      metaTitle: "Best View Restaurants in Pattaya 2026 — Sea, Skyline & Rooftop",
      metaDescription:
        "Pattaya restaurants with the most impressive views — Gulf of Thailand, city skyline, and rooftop — ranked by reviewer mentions.",
      intro:
        "Pattaya restaurants where 'view' is a consistent reviewer theme — sea views, city skylines, or rooftop panoramas. Ranked by view-related review mentions weighted by Trust Score.",
    },
  },
];

export const BEST_FOR: Criterion[] = [
  ...TEMPLATES.map((t) => ({
    slug: t.key,
    city: "bangkok" as const,
    ...t.bangkok,
    scoreFn: t.scoreFn,
    filterFn: cityFilter("bangkok", t.filterFn),
  })),
  ...TEMPLATES.map((t) => ({
    slug: `${t.key}-pattaya`,
    city: "pattaya" as const,
    ...t.pattaya,
    scoreFn: t.scoreFn,
    filterFn: cityFilter("pattaya", t.filterFn),
  })),
];

export function findBestFor(slug: string): Criterion | null {
  return BEST_FOR.find((c) => c.slug === slug) ?? null;
}
