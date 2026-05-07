// Golf course master_db.json schema.

export type RatingTrendBucket = { count: number; avg: number | null };

export type RatingTrend = {
  recent: RatingTrendBucket;
  midterm: RatingTrendBucket;
  old: RatingTrendBucket;
  trend: "improving" | "declining" | "stable" | "insufficient_data";
};

export type SampleReview = { text: string; rating: number; author: string };

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
