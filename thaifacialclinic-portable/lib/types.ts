export type Lang = "en" | "ko" | "th" | "zh" | "ar";

export interface ClinicReview {
  source: string;
  reviewer: string;
  rating: number | null;
  date: string;
  text: string;
}

export interface ClinicVideo {
  video_id: string;
  title: string;
  channel: string;
}

export interface Clinic {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  rating: number | null;
  review_count: number | null;
  phone: string;
  website: string;
  category: string;
  google_maps_url: string;
  bookimed_slug: string;
  bookimed_url: string;
  bookimed_price_from: string;
  reviews_scraped_count: number;
  avg_scraped_rating: number | null;
  top_review_text: string;
  top_review_source: string;
  reviews_sample: ClinicReview[];
  photos_count: number;
  top_photo_url: string;
  photos_sample: string[];
  videos_count: number;
  top_video_id: string;
  top_video_title: string;
  videos_sample: ClinicVideo[];
  website_email: string;
  website_facebook: string;
  website_instagram: string;
  website_line_id: string;
  procedures: string[];
  languages: { ko: boolean; en: boolean; zh: boolean; ar: boolean };
  is_hair_relevant: boolean;
  source_badges: {
    google_reviews: number;
    photos: number;
    videos: number;
    bookimed: number;
    website: number;
  };
  trust_score: number;
  is_suspected_viral: boolean;
  is_partner: boolean;
}

export interface ClinicsBundle {
  generated_at: string;
  total: number;
  avg_trust: number;
  clinics: Clinic[];
}
