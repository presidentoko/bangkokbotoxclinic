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
};

export type CityData = {
  city: string;
  generatedAt: string;
  places: Place[];
};
