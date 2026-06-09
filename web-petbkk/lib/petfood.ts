import type { PetFood, FoodFilters, FoodGrade } from './types'
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

export function getFoodGrade(food: PetFood): FoodGrade | null {
  const { black_count, red_count, green_count, yellow_count } = food
  const total = green_count + yellow_count + red_count + black_count
  if (total === 0) return null
  if (black_count >= 2) return 'F'
  if (black_count === 1) return 'D'
  if (red_count > 3) return 'D'
  if (red_count > 1) return 'C'
  if (red_count === 1) return 'B'
  const greenRatio = green_count / total
  if (greenRatio >= 0.7) return 'A'
  return 'B'
}

export function getSimilarFoods(food: PetFood, count = 3): PetFood[] {
  return loadFoods()
    .filter(f => f.id !== food.id && f.animal === food.animal && f.life_stage === food.life_stage)
    .sort((a, b) => {
      const totalA = Math.max(1, a.green_count + a.yellow_count + a.red_count + a.black_count)
      const totalB = Math.max(1, b.green_count + b.yellow_count + b.red_count + b.black_count)
      return (b.green_count / totalB) - (a.green_count / totalA)
    })
    .slice(0, count)
}
