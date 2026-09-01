// `neutral` covers vitamins, minerals and amino acids — recognised, but they
// say nothing about quality. `unknown` is a row the classifier could not
// identify; it is displayed but never scored, because the previous code's
// habit of defaulting these to `yellow` is what produced 690 grade-C products.
export type Grade = 'green' | 'yellow' | 'red' | 'black' | 'neutral' | 'unknown'
export type FoodGrade = 'A' | 'B' | 'C' | 'D' | 'F'
export type Animal = 'dog' | 'cat'
export type LifeStage = 'puppy' | 'adult' | 'senior'
/** `milk_replacer` is a single KMR product, but the union has to admit it or
 *  the dataset does not typecheck against this interface. */
export type FoodForm = 'dry_food' | 'wet_food' | 'milk_replacer'

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
  /** Physical form. Every scraper has written this since the beginning; it was
   *  simply missing from this interface, so nothing could filter on it. It
   *  matters for recommendations — offering dry kibble to someone reading about
   *  a wet pouch is a different purchase, not an upgrade. */
  sub_category: FoodForm
  /** Pack size. 1.0 on every scraped record — a default, not a measurement —
   *  so it is only shown where `weight_verified` says a real listing supplied
   *  it. See petfood/lazada_prices.py. */
  weight_kg: number
  weight_verified?: boolean
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
  weight_verified?: boolean
  /**
   * Absent when unknown. Thai retail prices now cover 697 of the products and
   * a per-kilo figure 436 of them, so these are frequently present — the note
   * that used to sit here saying no price source was connected is out of date.
   */
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
  /** Thai khet parsed out of the Places API address. Present on 342 of 496
   *  Bangkok records; irrelevant outside Bangkok, since other provinces use
   *  เขต's rural/urban counterpart อำเภอ, which nothing here parses for yet. */
  district?: string
  website?: string
  /** Grid-scan origin city. Bangkok records predate this field and carry
   *  `'bangkok'` explicitly rather than being left undefined, so a consumer
   *  can never mistake "not yet tagged" for "not Bangkok" — every record has
   *  an opinion. Anything that renders Bangkok-specific copy (the hub page,
   *  the 24h/emergency pages, the เขต district pages) must filter on this
   *  before using `loadHospitals()`; skipping that filter is what would
   *  publish "โรงพยาบาลสัตว์ในกรุงเทพ 985 แห่ง" once Chiang Mai, Pattaya and
   *  Phuket records exist in the same file.
   */
  city: 'bangkok' | 'chiangmai' | 'pattaya' | 'phuket'
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
