import type { PetFood, FoodFilters } from './types'
import rawData from '../data/petfood.json'

export function loadFoods(): PetFood[] {
  return rawData as PetFood[]
}

export function getFoodBySlug(slug: string): PetFood | null {
  return loadFoods().find(f => f.id === slug) ?? null
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
