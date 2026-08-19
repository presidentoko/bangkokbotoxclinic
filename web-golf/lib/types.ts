// Golf course master_db.json schema.

export type RatingTrendBucket = { count: number; avg: number | null };

export type RatingTrend = {
  recent: RatingTrendBucket;
  midterm: RatingTrendBucket;
  old: RatingTrendBucket;
  trend: "improving" | "declining" | "stable" | "insufficient_data";
};

export type SampleReview = { text: string; rating: number; author: string };

export type ScrapedReview = {
  reviewer?: string;
  rating?: number | null;
  date?: string;
  text?: string;
};

export type VideoRef = {
  video_id: string;
  title?: string;
  channel?: string;
  duration?: string;
  view_count?: string;
  published?: string;
  url?: string;
};

export type KoreanBlogRef = {
  url: string;
  title?: string;
  snippet?: string | null;
  date?: string | null;
  blogger?: string;
  body_excerpt?: string | null;
};

export type Course = {
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
  // Website 추출 (Phase 2 — 일부 코스만 채워짐)
  holes?: number | null;
  par?: number | null;
  designer?: string;
  year_opened?: number | null;
  fee_mentions?: string[];
  booking_links?: { href: string; label: string }[];
  // Photo scraped from course's own website (data/course_photos.json — merged in data.ts)
  hero_image?: string | null;
  /** Apify export 에 계속 들어 있었지만 ingest 가 버리던 필드들 (2026-08-19 부터 사용). */
  opening_hours?: { day: string; hours: string }[];
  /** 요일 약어("Su","Mo"…) → 시간대별 혼잡도. 티타임 잡을 때 쓰는 정보. */
  popular_times?: Record<string, { hour: number; occupancyPercent: number }[]>;
  reviews_distribution?: Record<string, number>;

  // ── CSV enrichment (merge_master_csv.py) ─────────────────
  golf_score?: number;
  korean_score?: number;
  is_golf_filtered?: boolean;
  is_korean_friendly?: boolean;
  is_english_friendly?: boolean;
  data_sources?: string[];
  top_photo_url?: string;
  photos?: string[];
  videos?: VideoRef[];
  korean_blogs?: KoreanBlogRef[];
  scraped_reviews?: ScrapedReview[];
  top_review_text?: string;
  green_fee_mentions?: string;
  website_title?: string;
  website_meta_description?: string;
  website_email?: string;
  website_facebook?: string;
  website_instagram?: string;
  website_line_id?: string;
  website_phone_secondary?: string;

  // ── Drainage & condition scores (drainage_nlp.py) ─────────
  drainage_score?: number;          // 0–100, 높을수록 배수 양호
  drainage_keywords?: string[];     // 발견된 키워드 목록
  drainage_mentions?: number;       // 부정 키워드 발견 횟수
};

// Backward compat — restaurant code paths import "Restaurant"
export type Restaurant = Course;

export type MasterDb = {
  generated_at: string;
  total_courses: number;
  total_restaurants: number;  // alias for total_courses (data.ts 가 채움)
  cuisine_counts: Record<string, number>;  // alias for category_counts
  city_counts: Record<string, number>;
  with_district: number;
  with_categories: number;
  with_reviews_scraped: number;
  language_total: { th: number; en: number; ko: number; ja: number; other: number };
  district_counts: Record<string, number>;
  category_counts: Record<string, number>;
  courses: Course[];
  restaurants: Course[];  // alias so existing pages work
};

export const CATEGORY_LABELS: Record<string, string> = {
  course: "Golf Course",
  country_club: "Country Club",
  driving_range: "Driving Range",
  indoor: "Indoor Golf",
  instructor: "Golf Instructor",
  shop: "Pro Shop",
  resort: "Golf Resort",
  club: "Golf Club",
  mini_golf: "Mini Golf",
  private_club: "Private Club",
};

export const CATEGORY_ICONS: Record<string, string> = {
  course: "⛳",
  country_club: "🏌️",
  driving_range: "🎯",
  indoor: "🏠",
  instructor: "👨‍🏫",
  shop: "🛒",
  resort: "🏨",
  club: "⛳",
  mini_golf: "🎈",
  private_club: "🔒",
};

export const CUISINE_LABELS = CATEGORY_LABELS;
export const CUISINE_ICONS = CATEGORY_ICONS;

export const TOPIC_LABELS: Record<string, string> = {
  challenging: "Challenging",
  easy_course: "Beginner-friendly",
  well_maintained: "Well-maintained",
  poor_condition: "Condition issues",
  scenic: "Scenic views",
  championship: "Championship-grade",
  expensive: "Expensive",
  affordable: "Affordable",
  weekend_busy: "Busy weekends",
  weekday_quiet: "Quiet weekdays",
  fast_pace: "Good pace of play",
  slow_pace: "Slow pace",
  good_caddy: "Excellent caddies",
  english_caddy: "English-speaking caddy",
  korean_caddy: "Korean-speaking caddy",
  japanese_caddy: "Japanese-speaking caddy",
  good_clubhouse: "Premium clubhouse",
  basic_clubhouse: "Basic clubhouse",
  good_food: "Good clubhouse food",
  fun_layout: "Fun layout",
  long_course: "Long course",
  short_course: "Short / Executive",
  good_practice: "Practice facilities",
  tournament_ready: "Tournament-ready",
  old_course: "Traditional / Classic",
  modern_course: "Modern design",
  international: "International-friendly",
  members_only: "Members only",
  wedding_venue: "Events / Weddings",
  near_airport: "Near airport",
  long_drive: "Far from city",
};

export type PriceSlot = {
  greenfee: number;
  caddy: number;
  cart: number;
};

export type PriceEntry = {
  course_id: string;
  scraped_at: string;
  source_agency: string;
  source_url: string;
  weekday: {
    morning?: PriceSlot;
    twilight?: PriceSlot;
  };
  weekend: {
    morning?: PriceSlot;
    twilight?: PriceSlot;
  };
  notes?: string;
};

export type TeeSlot = {
  course_id: string;
  course_name: string;
  date: string;          // "YYYY-MM-DD"
  time: string;          // "HH:MM"
  agency: string;
  booking_url: string;
  total_baht: number;
  available: boolean;
};

export type TeeTimesJson = {
  updated_at: string;
  slots: TeeSlot[];
};
