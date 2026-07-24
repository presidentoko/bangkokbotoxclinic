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
};

export type CityData = {
  city: string;
  generatedAt: string;
  places: Place[];
  themeAggregate: ThemeCount[];
  moodAggregate: ThemeCount[];
};
