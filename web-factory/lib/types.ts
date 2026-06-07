// Thai Supply Hub master_db.json schema. Single Supplier type.

export type RatingTrendBucket = { count: number; avg: number | null };

export type RatingTrend = {
  recent: RatingTrendBucket;
  midterm: RatingTrendBucket;
  old: RatingTrendBucket;
  trend: "improving" | "declining" | "stable" | "insufficient_data";
};

export type SampleReview = { text: string; rating: number; author: string };

export type ExternalReview = {
  reviewer: string;
  rating: number;
  date: string;
  text: string;
};

export type DbdEnrichment = {
  reg_no: string;            // 13-digit Thai company registration number
  legal_name: string | null; // 정식 법인명 (Thai)
  capital_thb: number | null;
  registered_date: string | null; // ISO YYYY-MM-DD
  tsic_code: string | null;
  purpose: string | null;
  address: string | null;
  match_score: number;       // 0–100. 80+ 만 매칭됨.
};

export type YpEnrichment = {
  biz_id: string;
  sub_category: string | null;
  description: string | null;
  website: string | null;
};

export type Supplier = {
  id: string;
  place_id: string;
  name: string;
  primary_type: string;
  address: string;
  city: string;
  city_label: string;
  district: string;
  province_en?: string;
  phone: string;
  website: string;
  menu_url: string;
  lat: number | null;
  lng: number | null;
  rating: number;
  total_reviews: number;
  trust_score: number;
  b2b_score?: number;        // 신 schema — trust_score 와 동일하지만 명시적.
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

  // ── 신 schema (CSV enrichment) ─────────────────────
  photos?: string[];                  // Google Maps 사진 URL 배열
  external_reviews?: ExternalReview[]; // CSV reviews_json 파싱본
  verified?: boolean;                  // DBD 법인 검증 완료 + 매치 80+
  dbd?: DbdEnrichment | null;
  yp?: YpEnrichment | null;
  halal_certified?: boolean;
  estate_name?: string | null;
  estate_slug?: string | null;
  years_in_business?: number | null;
  is_consumer?: boolean;

  // ── Future enrichment fields (populated by BOI scraper / manual CSV) ──
  boi_promoted?: boolean | null;
  boi_activity?: string | null;      // e.g. "Electronic components manufacturing"
  employee_range?: string | null;    // e.g. "200–500", "500+"
  export_markets?: string[] | null;  // e.g. ["Japan", "Germany", "USA"]
  iso_scope?: string | null;         // e.g. "ISO 9001:2015"
  iatf_certified?: boolean | null;
  haccp_certified?: boolean | null;
  boi_candidate?: boolean;
  boi_candidate_reasons?: string[];
};

export type MasterDb = {
  generated_at: string;
  schema_version?: number;
  source?: string;
  total_suppliers: number;
  verified_count?: number;
  with_dbd?: number;
  with_photos?: number;
  with_estate?: number;
  halal_count?: number;
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
