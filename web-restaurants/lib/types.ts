// Restaurant master_db.json schema.

export type RatingTrendBucket = {
  count: number;
  avg: number | null;
};

export type RatingTrend = {
  recent: RatingTrendBucket;
  midterm: RatingTrendBucket;
  old: RatingTrendBucket;
  trend: "improving" | "declining" | "stable" | "insufficient_data";
};

export type SampleReview = {
  text: string;
  rating: number;
  author: string;
};

export type Restaurant = {
  id: string;
  place_id: string;
  name: string;
  primary_type: string;
  address: string;
  city: string;
  city_label: string;
  district: string;
  phone: string;
  website: string;
  menu_url: string;
  lat: number | null;
  lng: number | null;
  rating: number;
  total_reviews: number;
  trust_score: number;
  cuisines: string[];
  price_level: string;
  price_symbol: string;
  scraped_review_count: number;
  local_guide_count: number;
  avg_author_review_count: number;
  language_breakdown: { th: number; en: number; other: number };
  cuisine_mentions: Record<string, number>;
  mentioned_topics: { topic: string; count: number }[];
  rating_trend: RatingTrend;
  sample_reviews_th: SampleReview[];
  sample_reviews_en: SampleReview[];
  business_status: string;
  maps_url: string;
};

export type MasterDb = {
  generated_at: string;
  total_restaurants: number;
  city_counts: Record<string, number>;
  with_district: number;
  with_cuisines: number;
  with_reviews_scraped: number;
  language_total: { th: number; en: number; other: number };
  district_counts: Record<string, number>;   // key: "city/District"
  cuisine_counts: Record<string, number>;
  restaurants: Restaurant[];
};

export const CUISINE_LABELS: Record<string, string> = {
  thai: "Thai",
  street_food: "Street Food",
  japanese: "Japanese",
  korean: "Korean",
  chinese: "Chinese",
  italian: "Italian",
  indian: "Indian",
  vietnamese: "Vietnamese",
  seafood: "Seafood",
  buffet: "Buffet",
  cafe: "Café",
  bakery: "Bakery",
  bar_pub: "Bar / Pub",
  fine_dining: "Fine Dining",
  vegetarian: "Vegetarian",
  halal: "Halal",
  dessert: "Dessert",
  western: "Western",
  fusion: "Fusion",
  breakfast: "Breakfast / Brunch",
};

export const CUISINE_ICONS: Record<string, string> = {
  thai: "🌶️",
  street_food: "🍜",
  japanese: "🍱",
  korean: "🍲",
  chinese: "🥟",
  italian: "🍝",
  indian: "🍛",
  vietnamese: "🍲",
  seafood: "🦐",
  buffet: "🍽️",
  cafe: "☕",
  bakery: "🥐",
  bar_pub: "🍺",
  fine_dining: "🍷",
  vegetarian: "🥗",
  halal: "🥩",
  dessert: "🍰",
  western: "🍔",
  fusion: "🍴",
  breakfast: "🥞",
};

export const TOPIC_LABELS: Record<string, string> = {
  fresh: "Fresh ingredients",
  tasty: "Delicious / Tasty",
  spicy: "Spicy",
  authentic: "Authentic",
  fast_service: "Fast service",
  long_wait: "Long wait",
  expensive: "Expensive",
  affordable: "Affordable",
  good_portion: "Generous portions",
  small_portion: "Small portions",
  english_menu: "English menu",
  halal_certified: "Halal",
  vegetarian_friendly: "Vegetarian friendly",
  kid_friendly: "Family friendly",
  good_atmosphere: "Nice atmosphere",
  instagram_worthy: "Instagrammable",
  good_view: "Great view",
  live_music: "Live music",
  korean_friendly: "Korean menu / staff",
  japanese_friendly: "Japanese menu",
  michelin: "Michelin mention",
  dirty: "Cleanliness issues",
  long_lines: "Long queues",
  tourist_trap: "Tourist trap risk",
};
