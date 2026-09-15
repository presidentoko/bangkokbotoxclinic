import type { PetFood } from './types'
import { foodKind } from './foodKind'

/**
 * AAFCO protein and fat minimums, checked honestly.
 *
 * The scrapers stored a single `aafco_meets` boolean, and the product page
 * rendered `false` as "❌ ไม่ผ่านเกณฑ์". But 1,291 of the 1,686 records carry no
 * nutrition figures at all — the retailer imports hard-code `False` — so the
 * site was publishing a failed-AAFCO verdict against real brands on the strength
 * of a missing number. The scraper check also applied the dog thresholds to cats
 * (18% protein instead of 26%), so cat foods could "pass" a bar far below the
 * one that actually applies to them.
 *
 * This works from the dry-matter figures directly and says only what they
 * support. It is also narrower than the badge implied: AAFCO adequacy is a
 * formulation or feeding-trial statement on the label, and two macronutrient
 * minimums are a necessary condition, not that statement. The labels below say
 * "reaches the minimum", not "AAFCO certified".
 *
 * Minimums on a dry-matter basis (AAFCO Dog and Cat Food Nutrient Profiles):
 *   dog  adult 18.0 / 5.5   growth 22.5 / 8.5
 *   cat  adult 26.0 / 9.0   growth 30.0 / 9.0
 */

export type AafcoStatus =
  /** Both dry-matter figures are known and at or above the minimum. */
  | 'meets'
  /** Both figures are known and at least one is below the minimum. */
  | 'below'
  /** The label figures needed for the check are missing. */
  | 'unknown'
  /** A treat or non-food item — complete-diet minimums do not apply. */
  | 'not_applicable'

const MIN = {
  dog: { adult: { protein: 18.0, fat: 5.5 }, growth: { protein: 22.5, fat: 8.5 } },
  cat: { adult: { protein: 26.0, fat: 9.0 }, growth: { protein: 30.0, fat: 9.0 } },
} as const

type AafcoInput = Pick<PetFood, 'animal' | 'life_stage' | 'protein_dm' | 'fat_dm' | 'name_en'> & { name_th?: string }

export function aafcoStatus(food: AafcoInput): AafcoStatus {
  if (foodKind(food) !== 'meal') return 'not_applicable'
  if (!(food.protein_dm > 0) || !(food.fat_dm > 0)) return 'unknown'
  const species = food.animal === 'cat' ? MIN.cat : MIN.dog
  const min = food.life_stage === 'puppy' ? species.growth : species.adult
  return food.protein_dm >= min.protein && food.fat_dm >= min.fat ? 'meets' : 'below'
}

export const AAFCO_LABEL: Record<AafcoStatus, string> = {
  meets: '✅ โปรตีนและไขมันถึงขั้นต่ำ AAFCO',
  below: '⚠️ โปรตีนหรือไขมันต่ำกว่าขั้นต่ำ AAFCO',
  unknown: 'ฉลากไม่ระบุโปรตีน/ไขมัน — ตรวจเกณฑ์ AAFCO ไม่ได้',
  not_applicable: 'ขนม/ของทานเล่น — ไม่ใช้เกณฑ์อาหารหลัก AAFCO',
}
