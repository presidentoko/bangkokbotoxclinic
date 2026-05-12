// master_db.json 스키마

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

export type ExternalPlatform = "tripadvisor" | "whatclinic" | "trustpilot" | "facebook" | "bookimed";

export type ExternalReview = {
  url: string;
  rating: number | null;
  count: number;
  last_checked: string;       // ISO timestamp
};

export type ServicePrice = {
  service: string;            // "botox" | "filler" | ...
  unit_label: string;         // "per area", "per unit", "per session"
  price_min_thb: number;
  price_max_thb: number;
  source_url: string;
  last_checked: string;
};

export type DoctorStat = {
  name: string;
  slug: string;               // URL-safe slug (lowercase, dash-separated)
  composite_slug?: string;    // `${slug}-at-${clinic_slug}` — globally unique URL slug
  mentions: number;           // 리뷰 mention 횟수
  rating_avg: number;
  language_count: { th: number; en: number; ko: number; ja: number; other: number };
  primary_lang: string;       // 가장 많은 mention 언어
  samples: { text: string; rating: number; lang: string }[];
};

export type Clinic = {
  id: string;
  place_id: string;
  name: string;
  name_lang: "th" | "en" | "other";
  primary_type: string;
  address: string;
  city_label: string;       // "Bangkok" | "Pattaya" | "Phuket" | ...
  city_slug: string;        // "bangkok" | "pattaya" | "phuket" | ...
  district: string;
  phone: string;
  website: string;
  lat: number | null;
  lng: number | null;
  rating: number;
  total_reviews: number;
  trust_score: number;
  categories: string[];
  scraped_review_count: number;
  local_guide_count: number;
  avg_author_review_count: number;
  language_breakdown: { th: number; en: number; ko: number; ja: number; other: number };
  service_mentions: Record<string, number>;
  mentioned_topics: { topic: string; count: number }[];
  rating_trend: RatingTrend;
  sample_reviews_th: SampleReview[];
  sample_reviews_en: SampleReview[];
  sample_reviews_ko: SampleReview[];
  sample_reviews_negative?: SampleReview[];  // rating ≤ 3, B2B dashboard reply 초안용
  external_reviews?: Partial<Record<ExternalPlatform, ExternalReview>>;
  pricing?: ServicePrice[];
  doctor_stats?: DoctorStat[];
  business_status: string;
  maps_url: string;
};

export type MasterDb = {
  generated_at: string;
  total_clinics: number;
  with_district: number;
  with_categories: number;
  with_reviews_scraped: number;
  language_total: { th: number; en: number; ko: number; ja: number; other: number };
  city_counts: Record<string, number>;        // "Bangkok": 2054 (도시 단위)
  district_counts: Record<string, number>;
  category_counts: Record<string, number>;
  clinics: Clinic[];
};

export const CATEGORY_LABELS: Record<string, string> = {
  botox: "Botox",
  filler: "Filler",
  hifu: "HIFU",
  facial: "Facial",
  laser: "Laser",
  dental: "Dental",
  hair_transplant: "Hair Transplant",
  eye: "Eye / LASIK",
};

export const TOPIC_LABELS: Record<string, string> = {
  genuine_brand: "Genuine brand",
  english_speaking: "English-speaking staff",
  clean_facility: "Clean facility",
  long_wait: "Long wait time",
  expensive: "Expensive",
  affordable: "Affordable",
  professional: "Professional",
  friendly_staff: "Friendly staff",
  results_satisfied: "Satisfied results",
  no_pain: "No pain",
  recommend: "Recommended",
  korean_doctor: "Korean-trained doctor",
  promotion: "Promotion / discount",
  premium: "Premium",
};
