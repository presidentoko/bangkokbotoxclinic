import type { PetFood, PetFoodLight, FoodFilters, FoodGrade } from './types'
import rawData from '../data/petfood.json'
import lightData from '../data/petfood-index.json'
import { toSlug } from './slugify'

export function loadFoods(): PetFood[] {
  return rawData as PetFood[]
}

// Card-level dataset (~1/3 the size of petfood.json). Prefer this in any client
// component that only renders cards — importing loadFoods() there ships every
// ingredient list to the browser.
export function loadFoodsLight(): PetFoodLight[] {
  return lightData as PetFoodLight[]
}

// For server components that already hold full PetFood objects and need to hand
// them to a card component typed against PetFoodLight.
export function toLightFood(f: PetFood): PetFoodLight {
  const { ingredients, source_url, ...rest } = f
  void source_url
  return { ...rest, slug: foodSlug(f), has_ingredients: ingredients.length > 0 }
}

function baseFoodSlug(food: PetFood): string {
  const s = toSlug(food.id)
  if (s.length > 3) return s
  return toSlug(`${food.brand}-${food.name_en}`)
}

// Some products' id/brand/name_en collapse to the same ASCII slug once Thai-only
// text is stripped (e.g. many "Purina"/"Pedigree"/"Whiskas" items whose names are
// Thai-only). Without disambiguation, foodSlug() would collide and getFoodBySlug()
// would always resolve to the first match, permanently shadowing the rest — which
// manifests as multiple distinct products silently sharing one canonical URL.
// Suffix later collisions with -2, -3, ... deterministically (by array order) so
// every product gets its own stable, unique URL.
let slugMap: WeakMap<PetFood, string> | null = null

function getSlugMap(): WeakMap<PetFood, string> {
  if (slugMap) return slugMap
  const map = new WeakMap<PetFood, string>()
  // A per-base counter isn't enough: it assumes "base-2" is free just because
  // this is the second product whose base collapsed to "base" — it doesn't
  // check whether some unrelated product's own id already equals that exact
  // string. The hospital directory hit exactly this after city expansion (see
  // lib/hospitals.ts's getSlugMap), so it's fixed here too before a future
  // catalogue addition triggers the same silent double-booking. Tracking
  // every slug already handed out and skipping past one that's taken —
  // whatever the reason — makes collisions structurally impossible.
  const taken = new Set<string>()
  for (const food of loadFoods()) {
    const base = baseFoodSlug(food)
    let slug = base
    let n = 2
    while (taken.has(slug)) {
      slug = `${base}-${n}`
      n += 1
    }
    taken.add(slug)
    map.set(food, slug)
  }
  slugMap = map
  return map
}

export function foodSlug(food: PetFood): string {
  return getSlugMap().get(food) ?? baseFoodSlug(food)
}

export function getFoodBySlug(slug: string): PetFood | null {
  return loadFoods().find(f => foodSlug(f) === slug) ?? null
}

export function filterFoods(filters: FoodFilters = {}): PetFood[] {
  let foods = loadFoods()

  if (filters.animal) {
    foods = foods.filter(f => f.animal === filters.animal)
  }
  if (filters.life_stage) {
    foods = foods.filter(f => f.life_stage === filters.life_stage)
  }
  if (filters.query) {
    const q = filters.query.toLowerCase()
    foods = foods.filter(f =>
      f.name_en.toLowerCase().includes(q) ||
      (f.name_th ?? f.name_en).toLowerCase().includes(q) ||
      f.brand.toLowerCase().includes(q)
    )
  }

  if (filters.sort === 'price') {
    return [...foods].sort((a, b) => (a.price_per_kg ?? 0) - (b.price_per_kg ?? 0))
  }
  return [...foods].sort(
    (a, b) =>
      b.green_count - a.green_count ||
      (a.red_count + a.black_count) - (b.red_count + b.black_count)
  )
}

export function filterFoodsLight(filters: FoodFilters = {}): PetFoodLight[] {
  let foods = loadFoodsLight()

  if (filters.animal) {
    foods = foods.filter(f => f.animal === filters.animal)
  }
  if (filters.life_stage) {
    foods = foods.filter(f => f.life_stage === filters.life_stage)
  }
  if (filters.query) {
    const q = filters.query.toLowerCase()
    foods = foods.filter(f =>
      f.name_en.toLowerCase().includes(q) ||
      (f.name_th ?? f.name_en).toLowerCase().includes(q) ||
      f.brand.toLowerCase().includes(q)
    )
  }

  if (filters.sort === 'price') {
    return [...foods].sort((a, b) => (a.price_per_kg ?? 0) - (b.price_per_kg ?? 0))
  }
  return [...foods].sort(
    (a, b) =>
      b.green_count - a.green_count ||
      (a.red_count + a.black_count) - (b.red_count + b.black_count)
  )
}

export { getFoodGrade } from './grading'

/**
 * @deprecated Use `getComparableFoods` from `lib/alternatives`.
 *
 * This sorts the whole animal/life-stage group by `green_count` and takes the
 * top three, which means every page in a group recommends the identical three
 * products at any price and in any form. It is kept only so nothing that still
 * imports it breaks; the food detail page no longer uses it.
 */
export function getSimilarFoods(food: PetFood, count = 3): PetFood[] {
  return loadFoods()
    .filter(f => f.id !== food.id && f.animal === food.animal && f.life_stage === food.life_stage)
    .sort((a, b) =>
      b.green_count - a.green_count ||
      (a.red_count + a.black_count) - (b.red_count + b.black_count)
    )
    .slice(0, count)
}
