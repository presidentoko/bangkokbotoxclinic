// `neutral` covers vitamins, minerals and amino acids — recognised, but they
// say nothing about quality. `unknown` is a row the classifier could not
// identify; it is displayed but never scored, because the previous code's
// habit of defaulting these to `yellow` is what produced 690 grade-C products.
export type Grade = 'green' | 'yellow' | 'red' | 'black' | 'neutral' | 'unknown'
export type FoodGrade = 'A' | 'B' | 'C' | 'D' | 'F'
export type Animal = 'dog' | 'cat'
export type LifeStage = 'puppy' | 'adult' | 'senior'

export interface Ingredient {
  name: string
  grade: Grade
  position: number
}

export interface PetFood {
  id: string
  brand: string
  name_en: string
  name_th: string
  animal: Animal
  life_stage: LifeStage
  weight_kg: number
  price_thb: number
  price_per_kg: number
  buy_url: string
  source_url: string
  protein_pct: number
  fat_pct: number
  fiber_pct: number
  moisture_pct: number
  protein_dm: number
  fat_dm: number
  aafco_meets: boolean
  ingredients: Ingredient[]
  green_count: number
  yellow_count: number
  red_count: number
  black_count: number
  /** Recognised additives — vitamins, minerals, amino acids. Carry no quality
   *  signal, so they are counted apart from the four verdicts above rather than
   *  dragging a complete food's score down for being complete. */
  neutral_count: number
  /** Rows the classifier could not identify. Never treated as a verdict. */
  unknown_count: number
  /** Rows on the panel, including neutral and unknown. Lets the grader refuse
   *  to publish a score it only understands a fraction of. */
  ing_total: number
  updated_at: string
}

// Card-level view of PetFood, generated at build time by scripts/build-food-index.js.
// Drops `ingredients` (the bulk of the payload) and `source_url`, and precomputes the
// URL slug so list/grid client components never need to import the full dataset.
export interface PetFoodLight {
  id: string
  brand: string
  name_en: string
  /** Only present when it differs from name_en, which it never does today. */
  name_th?: string
  animal: Animal
  life_stage: LifeStage
  weight_kg: number
  /** Absent when unknown. No price source is connected yet, so always absent. */
  price_thb?: number
  price_per_kg?: number
  protein_pct: number
  fat_pct: number
  fiber_pct: number
  moisture_pct: number
  protein_dm: number
  fat_dm: number
  aafco_meets: boolean
  green_count: number
  yellow_count: number
  red_count: number
  black_count: number
  neutral_count: number
  ing_total: number
  slug: string
  has_ingredients: boolean
}

export interface Hospital {
  id: string
  name_th: string
  name_en: string
  address: string
  lat: number
  lng: number
  phone: string
  is_24h: boolean
  has_emergency: boolean
  has_surgery: boolean
  price_consult: number | null
  price_emergency_surcharge: number | null
  price_neuter_male: number | null
  price_neuter_female: number | null
  price_vaccine: number | null
  google_rating: number | null
  google_review_count: number | null
  google_place_id: string
  updated_at: string
  /** Thai khet parsed out of the Places API address. Present on 342 of 496. */
  district?: string
  website?: string
}

/**
 * Card-level view of Hospital, generated at build time by
 * scripts/build-hospital-index.ts. Drops the five price fields (null on every
 * record), the two constant service booleans, the place id and the scrape
 * timestamp, and precomputes the slug so client components never have to import
 * the full dataset just to build a URL.
 */
export interface HospitalLight {
  id: string
  slug: string
  name_th: string
  name_en: string
  address: string
  lat: number
  lng: number
  phone: string
  is_24h: boolean
  google_rating: number | null
  google_review_count: number | null
  district?: string
}

export interface FoodFilters {
  animal?: Animal
  life_stage?: LifeStage
  sort?: 'score' | 'price'
  query?: string
}

export interface HospitalFilters {
  is_24h?: boolean
  has_emergency?: boolean
  has_surgery?: boolean
}

export interface PetProfile {
  species: 'dog' | 'cat'
  lifeStage: 'puppy' | 'adult' | 'senior'
  name: string
}
