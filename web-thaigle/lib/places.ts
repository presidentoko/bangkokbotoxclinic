// lib/places.ts
// Adapters for the aggregated Place DB (pipeline output from data.zip).
// Data model mirrors the place verification page spec.

import PLACES_RAW from "./places-data.json";
import { asciiSlug } from "./placeIndexing";

export type Category = "eat" | "train" | "treat" | "learn" | "relax";

export interface Place {
  slug: string;
  name: string;
  category: Category;
  subtype: string;
  area: string;
  lat: number;
  lng: number;
  priceTier: 1 | 2 | 3 | 4;
  localsScore: number;
  verifiedOpen: boolean;
  tags: string[];
  hero: { src: string; alt: string };
  photos?: string[];
  website?: string;
  phone?: string;
  googleMapsUrl?: string;
  klookUrl?: string;
  receipt: {
    feedSays: string;
    dataSays: string;
  };
  sources: {
    reviewCount: number;
    sourceCount: number;
    sourceNames: string[];
    updatedDaysAgo: number;
  };
  i18n: Record<"th" | "en" | "ko", {
    name: string;
    receipt: Place["receipt"];
  }>;
}

// Normalised at load so the slug is ASCII everywhere downstream — see
// asciiSlug() for why a Thai-script slug produces a page that 404s.
const ALL_PLACES: Place[] = (PLACES_RAW as Place[]).map((p) => ({
  ...p,
  slug: asciiSlug(p.slug),
}));

const PLACE_INDEX = new Map<string, Place>(
  ALL_PLACES.map((p) => [p.slug, p])
);

const LANGS = ["th", "en", "ko"] as const;
export type Lang = typeof LANGS[number];

export function getAllPlaceSlugs(): { lang: Lang; slug: string }[] {
  return ALL_PLACES.flatMap((p) =>
    LANGS.map((lang) => ({ lang, slug: p.slug }))
  );
}

export function getPlace(slug: string, lang: Lang): Place | null {
  const place = PLACE_INDEX.get(slug);
  if (!place) return null;
  // Merge i18n into top-level fields for convenience
  const i18nData = place.i18n[lang];
  return {
    ...place,
    name: i18nData?.name ?? place.name,
    receipt: i18nData?.receipt ?? place.receipt,
  };
}

export function getAllPlaces(lang: Lang = "en"): Place[] {
  return ALL_PLACES.map((p) => {
    const i18nData = p.i18n[lang];
    return { ...p, name: i18nData?.name ?? p.name, receipt: i18nData?.receipt ?? p.receipt };
  });
}

export function getPlacesByCategory(category: Category, lang: Lang = "en"): Place[] {
  return getAllPlaces(lang).filter((p) => p.category === category);
}

export const CATEGORY_SCHEMA: Record<Category, string> = {
  eat: "Restaurant",
  train: "ExerciseGym",
  treat: "MedicalBusiness",
  learn: "LocalBusiness",
  relax: "LocalBusiness",
};

export const PRICE_TIER_LABEL: Record<number, string> = {
  1: "฿",
  2: "฿฿",
  3: "฿฿฿",
  4: "฿฿฿฿",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  eat: "eat",
  train: "train",
  treat: "treat",
  learn: "learn",
  relax: "relax",
};
