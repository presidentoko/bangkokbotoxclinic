import type { Restaurant } from "./types";
import type { NicheSlug } from "./niches";

export type OccasionSlug =
  | "date-night"
  | "group-dinner"
  | "solo"
  | "budget"
  | "views"
  | "late-night"
  | "family"
  | "digital-nomad"
  | "first-time"
  | "halal"
  | "vegetarian"
  | "healthy";

export type Occasion = {
  slug: OccasionSlug;
  emoji: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  filterFn: (r: Restaurant) => boolean;
  sortBonus?: (r: Restaurant) => number;
  relatedNiches?: NicheSlug[];
  tip?: string;
};

const topicHits = (r: Restaurant, topic: string) =>
  r.mentioned_topics.find((x) => x.topic === topic)?.count ?? 0;

export const OCCASIONS: Occasion[] = [
  {
    slug: "date-night",
    emoji: "💑",
    title: "Date Night in Bangkok",
    subtitle: "Romantic restaurants with atmosphere, views & top reviews",
    metaTitle: "Best Date Night Restaurants Bangkok 2026 — Romantic Picks",
    metaDescription: "Best romantic restaurants in Bangkok for a date night in 2026. Ranked by real Google reviews — rooftop views, intimate atmosphere, fine dining.",
    filterFn: (r) => topicHits(r, "good_view") >= 1 || topicHits(r, "instagram_worthy") >= 1 || r.cuisines.includes("fine_dining") || topicHits(r, "good_atmosphere") >= 2,
    sortBonus: (r) => topicHits(r, "good_view") * 5 + topicHits(r, "good_atmosphere") * 3,
    relatedNiches: ["spa", "yoga-pilates"],
    tip: "Book in advance for rooftop restaurants on weekends. Most have dress codes.",
  },
  {
    slug: "group-dinner",
    emoji: "🎉",
    title: "Group Dinner in Bangkok",
    subtitle: "Perfect for 6+ people — big tables, sharable menus",
    metaTitle: "Best Group Dinner Restaurants Bangkok 2026 — Large Party Picks",
    metaDescription: "Best restaurants in Bangkok for large group dinners in 2026. 6+ people, sharable dishes, real Google review rankings. Thai, Korean BBQ, seafood & more.",
    filterFn: (r) => r.total_reviews >= 100 && r.trust_score >= 55,
    sortBonus: (r) => (r.cuisines.includes("korean") ? 15 : 0) + (r.cuisines.includes("thai") ? 10 : 0) + topicHits(r, "good_atmosphere") * 2,
    tip: "Korean BBQ and Thai seafood are the best formats for groups — everyone shares.",
  },
  {
    slug: "solo",
    emoji: "🧍",
    title: "Solo Dining in Bangkok",
    subtitle: "Counter seats, casual spots, solo-friendly atmosphere",
    metaTitle: "Best Solo Dining Restaurants Bangkok 2026 — Eat Alone Without Awkwardness",
    metaDescription: "Best restaurants in Bangkok for solo diners in 2026. Counter seats, casual vibe, no judgement. Ranked by real Google reviews.",
    filterFn: (r) => r.cuisines.some((c) => ["ramen", "noodles", "japanese", "street_food", "cafe"].includes(c)) || topicHits(r, "quick_service") >= 1,
    sortBonus: (r) => (r.cuisines.includes("ramen") ? 20 : 0) + (r.cuisines.includes("noodles") ? 15 : 0),
    relatedNiches: ["coworking"],
    tip: "Noodle shops and Japanese counters are the most solo-friendly. Get there before peak hours.",
  },
  {
    slug: "budget",
    emoji: "💸",
    title: "Budget Eats in Bangkok",
    subtitle: "Best food for under ฿200 per person — no tourist markup",
    metaTitle: "Best Budget Restaurants Bangkok 2026 — Cheap Eats Under ฿200",
    metaDescription: "Best budget-friendly restaurants in Bangkok 2026. Under ฿200 per person. Ranked by real Google reviews — real value, no tourist traps.",
    filterFn: (r) => topicHits(r, "affordable") >= 1 || r.cuisines.some((c) => ["street_food", "thai", "noodles"].includes(c)),
    sortBonus: (r) => topicHits(r, "affordable") * 10,
    tip: "Local markets and foodcourts have the best value. Avoid touristy streets like Khao San.",
  },
  {
    slug: "views",
    emoji: "🌆",
    title: "Bangkok Rooftop & View Restaurants",
    subtitle: "Skyline views, rooftop bars, river-view dining",
    metaTitle: "Best View Restaurants Bangkok 2026 — Rooftop & Skyline Dining",
    metaDescription: "Bangkok restaurants with the best views in 2026. Rooftop dining, skyline views, river-view restaurants — ranked by real Google reviews.",
    filterFn: (r) => topicHits(r, "good_view") >= 1,
    sortBonus: (r) => topicHits(r, "good_view") * 12,
    tip: "Sunset is the golden hour (5:30–7:30pm). Book a window seat at least 1 week ahead.",
  },
  {
    slug: "late-night",
    emoji: "🌙",
    title: "Late Night Food in Bangkok",
    subtitle: "Open after midnight — Bangkok never sleeps",
    metaTitle: "Best Late Night Restaurants Bangkok 2026 — Open After Midnight",
    metaDescription: "Best late-night restaurants in Bangkok 2026. Open after midnight — street food, noodles, after-bar eats ranked by real Google reviews.",
    filterFn: (r) => r.cuisines.some((c) => ["bar_pub", "street_food", "thai", "noodles"].includes(c)) && r.trust_score >= 50,
    sortBonus: (r) => topicHits(r, "late_night") * 15 + (r.cuisines.includes("bar_pub") ? 10 : 0),
    tip: "Silom and Sukhumvit are the main late-night zones. Street stalls often run until 3–4am.",
  },
  {
    slug: "family",
    emoji: "👨‍👩‍👧‍👦",
    title: "Family-Friendly Bangkok Restaurants",
    subtitle: "Kids welcome — good options for all ages",
    metaTitle: "Best Family Restaurants Bangkok 2026 — Kid-Friendly Picks",
    metaDescription: "Best family-friendly restaurants in Bangkok 2026. Kid-friendly atmosphere, good options for all ages, ranked by real Google reviews.",
    filterFn: (r) => topicHits(r, "kid_friendly") >= 1 || r.total_reviews >= 200,
    sortBonus: (r) => topicHits(r, "kid_friendly") * 12,
    tip: "Shopping mall food courts are the most kid-friendly. Also great for beating the heat.",
  },
  {
    slug: "digital-nomad",
    emoji: "💻",
    title: "Digital Nomad Bangkok",
    subtitle: "Work-friendly cafés, coworking spaces, fast WiFi",
    metaTitle: "Best Digital Nomad Spots Bangkok 2026 — Cafés & Coworking",
    metaDescription: "Best cafés and coworking spaces in Bangkok for digital nomads in 2026. Fast WiFi, good coffee, relaxed vibe — ranked by real Google reviews.",
    filterFn: (r) => r.cuisines.some((c) => ["cafe", "western"].includes(c)) && r.trust_score >= 55,
    sortBonus: (r) => (r.cuisines.includes("cafe") ? 20 : 0),
    relatedNiches: ["coworking"],
    tip: "Ari and Thonglor have the best café scenes. Many cafés don't allow laptops during lunch rush.",
  },
  {
    slug: "first-time",
    emoji: "🗺️",
    title: "First-Time Bangkok Guide",
    subtitle: "Must-try restaurants for Bangkok first-timers",
    metaTitle: "Best Restaurants Bangkok for First-Timers 2026 — Essential Picks",
    metaDescription: "Essential Bangkok restaurants for first-time visitors in 2026. Start with these — trusted by thousands of Google reviewers, no tourist traps.",
    filterFn: (r) => r.trust_score >= 70 && r.total_reviews >= 500,
    sortBonus: (r) => r.trust_score,
    relatedNiches: ["cooking", "muay-thai", "spa"],
    tip: "Start with a Thai cooking class to understand the flavors before you eat your way through Bangkok.",
  },
  {
    slug: "halal",
    emoji: "🕌",
    title: "Halal Restaurants in Bangkok",
    subtitle: "Halal-certified dining — verified from real reviews",
    metaTitle: "Best Halal Restaurants Bangkok 2026 — Muslim-Friendly Dining",
    metaDescription: "Best halal restaurants in Bangkok 2026. Halal-certified dining, verified from real Google reviews. Thai, Middle Eastern, Malaysian & more.",
    filterFn: (r) => topicHits(r, "halal_certified") >= 1 || r.cuisines.some((c) => ["halal", "middle_eastern"].includes(c)),
    sortBonus: (r) => topicHits(r, "halal_certified") * 15,
    relatedNiches: ["wellness"],
    tip: "The Arab Street area (Silom Soi 12–18) and Charoen Krung have the best halal options.",
  },
  {
    slug: "vegetarian",
    emoji: "🥗",
    title: "Vegetarian Restaurants in Bangkok",
    subtitle: "Veg-friendly menus verified by real reviewers",
    metaTitle: "Best Vegetarian Restaurants Bangkok 2026 — Vegan & Veg-Friendly",
    metaDescription: "Best vegetarian and vegan restaurants in Bangkok 2026. Verified from real Google reviews — Thai, international, dedicated veg restaurants.",
    filterFn: (r) => topicHits(r, "vegetarian_friendly") >= 1 || r.cuisines.some((c) => ["vegetarian", "vegan", "healthy"].includes(c)),
    sortBonus: (r) => topicHits(r, "vegetarian_friendly") * 12,
    relatedNiches: ["wellness", "yoga-pilates"],
    tip: "Bangkok has an incredible veg scene — especially around yoga studios and wellness centers.",
  },
  {
    slug: "healthy",
    emoji: "🥑",
    title: "Healthy Food in Bangkok",
    subtitle: "Clean eats, salads, smoothie bowls, fresh options",
    metaTitle: "Best Healthy Restaurants Bangkok 2026 — Clean Eats Ranked",
    metaDescription: "Best healthy restaurants in Bangkok 2026. Clean eats, salads, smoothie bowls — ranked by real Google reviews. No junk, just good food.",
    filterFn: (r) => topicHits(r, "vegetarian_friendly") >= 1 || r.cuisines.some((c) => ["healthy", "vegan", "vegetarian", "cafe"].includes(c)) || topicHits(r, "fresh_ingredients") >= 1,
    sortBonus: (r) => topicHits(r, "vegetarian_friendly") * 8 + (r.cuisines.includes("healthy") ? 15 : 0),
    relatedNiches: ["yoga-pilates", "wellness"],
    tip: "Thonglor and Ari have the most health-focused food scenes. Many yoga studios have good cafés nearby.",
  },
];

export function findOccasion(slug: string): Occasion | null {
  return OCCASIONS.find((o) => o.slug === slug) ?? null;
}

export const OCCASION_NAV = [
  { slug: "date-night", emoji: "💑", label: "Date Night" },
  { slug: "group-dinner", emoji: "🎉", label: "Group Dinner" },
  { slug: "budget", emoji: "💸", label: "Budget Eats" },
  { slug: "views", emoji: "🌆", label: "Best Views" },
  { slug: "first-time", emoji: "🗺️", label: "First Time" },
  { slug: "late-night", emoji: "🌙", label: "Late Night" },
  { slug: "halal", emoji: "🕌", label: "Halal" },
  { slug: "vegetarian", emoji: "🥗", label: "Vegetarian" },
  { slug: "digital-nomad", emoji: "💻", label: "Digital Nomad" },
  { slug: "family", emoji: "👨‍👩‍👧‍👦", label: "Family" },
  { slug: "solo", emoji: "🧍", label: "Solo Dining" },
  { slug: "healthy", emoji: "🥑", label: "Healthy" },
] as const;
