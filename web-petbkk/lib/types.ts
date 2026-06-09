export type Grade = 'green' | 'yellow' | 'red' | 'black'
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
  updated_at: string
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
