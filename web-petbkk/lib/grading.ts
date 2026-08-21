export type { FoodGrade } from './types'

// Only the tallies are needed to grade a food, so accept the minimal shape
// rather than a full PetFood — this lets PetFoodLight (which has no
// `ingredients`) be graded by the same function.
export interface GradeCounts {
  green_count: number
  yellow_count: number
  red_count: number
  black_count: number
  neutral_count?: number
  ing_total?: number
}

/**
 * How much of a panel has to be understood before a grade is worth publishing.
 *
 * The previous version graded anything with a single tallied ingredient, and
 * the Python classifier it was fed by returned "yellow" for every string it did
 * not recognise. Marketing prose therefore arrived as verified-mediocre
 * ingredients, `yellow_count` beat `green_count` almost everywhere, and 690 of
 * 986 products were published as grade C on the strength of sentences like
 * "After years of research". Refusing to score a panel we cannot read is the
 * only honest option, and it is also the one that keeps the grade meaningful
 * for the products where the data is real.
 *
 * Kept in sync with petfood/rebuild_ingredients.py, which applies the same two
 * thresholds when it writes the dataset.
 */
const MIN_SCORED = 3
const MIN_COVERAGE = 0.5

export function getFoodGrade(food: GradeCounts): import('./types').FoodGrade | null {
  const { black_count, red_count, green_count, yellow_count } = food
  const scored = green_count + yellow_count + red_count + black_count
  if (scored < MIN_SCORED) return null

  // Neutral rows count as understood: a vitamin premix is recognised, it just
  // says nothing about quality. Only unrecognised rows count against coverage.
  const total = food.ing_total ?? scored
  const recognized = scored + (food.neutral_count ?? 0)
  if (total > 0 && recognized / total < MIN_COVERAGE) return null

  if (black_count >= 2) return 'F'
  if (black_count === 1) return 'D'
  if (red_count > 3) return 'D'
  if (red_count > 1) return 'C'
  if (red_count === 1) return 'B'

  const greenRatio = green_count / scored
  if (greenRatio >= 0.7) return 'A'
  if (greenRatio >= 0.4) return 'B'
  if (yellow_count > green_count) return 'C'
  return 'B'
}

/**
 * Whether a product has enough of a panel to be worth its own indexed page.
 *
 * A record with no ingredients, no nutrition and no price is a name and a
 * brand — thin by any measure, and 569 of the 986 products are in exactly that
 * state now that the fabricated ingredient rows are gone. They stay reachable
 * and internally linked; they just do not ask Google to index them.
 */
export function hasPublishableData(food: {
  ing_total?: number
  protein_pct?: number
  fat_pct?: number
  price_thb?: number
}): boolean {
  return Boolean(
    (food.ing_total ?? 0) >= MIN_SCORED ||
    (food.protein_pct ?? 0) > 0 ||
    (food.fat_pct ?? 0) > 0 ||
    (food.price_thb ?? 0) > 0
  )
}
