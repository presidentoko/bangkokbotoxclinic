import type { PetFood, FoodFilters, FoodGrade } from './types'
import rawData from '../data/petfood.json'
import { toSlug } from './slugify'

export function loadFoods(): PetFood[] {
  return rawData as PetFood[]
}

export function foodSlug(food: PetFood): string {
  const s = toSlug(food.id)
  if (s.length > 3) return s
  return toSlug(`${food.brand}-${food.name_en}`)
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
      f.name_th.toLowerCase().includes(q) ||
      f.brand.toLowerCase().includes(q)
    )
  }

  if (filters.sort === 'price') {
    return [...foods].sort((a, b) => a.price_per_kg - b.price_per_kg)
  }
  return [...foods].sort(
    (a, b) =>
      b.green_count - a.green_count ||
      (a.red_count + a.black_count) - (b.red_count + b.black_count)
  )
}

export { getFoodGrade } from './grading'

export function getSimilarFoods(food: PetFood, count = 3): PetFood[] {
  return loadFoods()
    .filter(f => f.id !== food.id && f.animal === food.animal && f.life_stage === food.life_stage)
    .sort((a, b) =>
      b.green_count - a.green_count ||
      (a.red_count + a.black_count) - (b.red_count + b.black_count)
    )
    .slice(0, count)
}
