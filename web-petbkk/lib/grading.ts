import type { PetFood } from './types'
export type { FoodGrade } from './types'

export function getFoodGrade(food: PetFood): import('./types').FoodGrade | null {
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
  if (yellow_count > green_count) return 'C'
  return 'B'
}
