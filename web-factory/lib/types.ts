// Thai Supply Hub master_db.json schema. Single Supplier type.

export type RatingTrendBucket = { count: number; avg: number | null };

export type RatingTrend = {
  recent: RatingTrendBucket;
  midterm: RatingTrendBucket;
  old: RatingTrendBucket;
  trend: "improving" | "declining" | "stable" | "insufficient_data";
};

export type SampleReview = { text: string; rating: number; author: string };

export type Supplier = {
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
  categories: string[];
  raw_categories: string[];
  image_url?: string;
  price_level: string;
  price_symbol: string;
  scraped_review_count: number;
  local_guide_count: number;
  avg_author_review_count: number;
  language_breakdown: { th: number; en: number; ko: number; ja: number; other: number };
  cuisine_mentions: Record<string, number>;
  mentioned_topics: { topic: string; count: number }[];
  rating_trend: RatingTrend;
  sample_reviews_th: SampleReview[];
  sample_reviews_en: SampleReview[];
  sample_reviews_ko: SampleReview[];
  business_status: string;
  maps_url: string;
  // Optional enrichment from supplier-website scraping (future).
  hero_image?: string | null;
};

export type MasterDb = {
  generated_at: string;
  total_suppliers: number;
  city_counts: Record<string, number>;
  with_district: number;
  with_categories: number;
  with_website: number;
  with_phone: number;
  with_reviews_scraped: number;
  language_total: { th: number; en: number; ko: number; ja: number; other: number };
  district_counts: Record<string, number>;
  category_counts: Record<string, number>;
  primary_type_counts?: Record<string, number>;
  suppliers: Supplier[];
};

export const CATEGORY_LABELS: Record<string, string> = {
  manufacturer:      "Manufacturer",
  auto_parts:        "Auto Parts Manufacturer",
  factory:           "Factory",
  warehouse:         "Warehouse",
  industrial_estate: "Industrial Estate",
  logistics:         "Logistics",
  food_mfg:          "Food Manufacturer",
  electronics:       "Electronics Manufacturer",
  chemical:          "Chemical Manufacturer",
  plastic:           "Plastic Fabrication",
  steel:             "Steel & Metal",
  machining:         "Machining / Mechanical",
  equipment:         "Industrial Equipment",
  corporate_office:  "Corporate Office",
  packaging:         "Packaging",
  rubber:            "Rubber",
  textile:           "Textile",
  machinery:         "Machinery",
  exporter:          "Exporter",
};

export const CATEGORY_ICONS: Record<string, string> = {
  manufacturer:      "🏭",
  auto_parts:        "🚗",
  factory:           "🏗️",
  warehouse:         "📦",
  industrial_estate: "🏘️",
  logistics:         "🚚",
  food_mfg:          "🥫",
  electronics:       "🔌",
  chemical:          "⚗️",
  plastic:           "♻️",
  steel:             "🔩",
  machining:         "⚙️",
  equipment:         "🛠️",
  corporate_office:  "🏢",
  packaging:         "📦",
  rubber:            "🟫",
  textile:           "🧵",
  machinery:         "🏗️",
  exporter:          "🌏",
};


// Topic labels — supply 토픽 (review text 분석에서 추출).
// Python 스크립트의 _TOPIC_PATTERNS keys 와 1:1 매칭.
export const TOPIC_LABELS: Record<string, string> = {
  high_quality:      "High quality",
  poor_quality:      "Quality issues",
  on_time:           "On-time delivery",
  delayed:           "Delivery delays",
  english_support:   "English-speaking",
  chinese_support:   "Chinese-speaking",
  korean_support:    "Korean-speaking",
  japanese_support:  "Japanese-speaking",
  responsive:        "Responsive comms",
  unresponsive:      "Slow response",
  competitive_price: "Competitive price",
  expensive:         "Expensive",
  low_moq:           "Low MOQ friendly",
  oem_odm:           "OEM / ODM capable",
  export_ready:      "Export-ready",
  iso_certified:     "ISO certified",
  food_safety:       "Food-safety certified",
  factory_tour:      "Factory tour available",
  experienced:       "Long-established",
  modern_machinery:  "Modern machinery",
  friendly_staff:    "Friendly staff",
  good_packaging:    "Good packaging",
  bulk_orders:       "Bulk-order friendly",
  samples_available: "Samples available",
  warehouse_large:   "Large warehouse",
  good_location:     "Convenient location",
  clean_facility:    "Clean facility",
  outdated:          "Outdated equipment",
};
