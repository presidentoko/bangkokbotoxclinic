export type TherapistMention = {
  name: string;
  count: number;
  quotes: string[];
};

export type Review = {
  id: string;
  rating: number | null;
  text: string;
  authorName: string;
  relativeDate: string;
};

export type ThemeCount = { label: string; count: number };

export type RatingDistribution = { 5: number; 4: number; 3: number; 2: number; 1: number };

export type Place = {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  website: string;
  rating: number | null;
  reviewCount: number;
  primaryType: string;
  mapsUrl: string;
  reviews: Review[];
  therapistMentions: TherapistMention[];
  serviceThemes: ThemeCount[];
  moodKeywords: ThemeCount[];
  ratingDistribution: RatingDistribution;
  priceMentions: number[];
  district: string | null;
  /** Mined from every scraped review (scripts/extract-insights.mjs). Optional: absent in older data files. */
  insights?: PlaceInsights;
};

export type AspectKey = "cleanliness" | "value" | "staff" | "skill" | "pressure" | "english";

export type PlaceInsights = {
  analysed: number;
  withText: number;
  aspects: Record<AspectKey, { pos: number; neg: number }>;
  tipPressure: number;
  trend: { recentAvg: number; recentN: number; beforeAvg: number; beforeN: number } | null;
  reviewers: { localGuidePct: number; medianAuthorReviews: number | null } | null;
  languages: Partial<Record<"ko" | "ja" | "zh" | "th" | "ru", number>>;
  spent: number[];
};

export type CityData = {
  city: string;
  generatedAt: string;
  places: Place[];
  themeAggregate: ThemeCount[];
  moodAggregate: ThemeCount[];
};
