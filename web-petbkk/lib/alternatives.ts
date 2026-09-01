import type { PetFood, FoodGrade } from './types'
import { getFoodGrade } from './grading'
import { loadFoods, foodSlug } from './petfood'

/**
 * "This bag scores C — what should I buy instead?"
 *
 * That is the question a grade actually raises, and until now the site ended
 * the conversation right where it was asked. The old `getSimilarFoods()` sorted
 * the whole catalogue by `green_count` and took the top three, so every adult
 * cat food page recommended the same three products regardless of what the
 * visitor was looking at, at any price. It was a related-items rail, not an
 * answer.
 *
 * An answer has to hold two things fixed — the animal and the food's physical
 * form — and improve on a third. Suggesting dry kibble to someone reading about
 * a wet pouch is not an upgrade, it is a different purchase.
 *
 * Price matters as much as the grade here. The site now has a real retail price
 * on 697 products and a per-kilo figure on 436, which is what makes this
 * possible at all: before the Thonglor import both were zero across the whole
 * catalogue, and the /compare page still carries a comment saying so.
 */

const GRADE_RANK: Record<FoodGrade, number> = { A: 5, B: 4, C: 3, D: 2, F: 1 }

/** How far from the current price a suggestion may sit and still be an "instead". */
const PRICE_BAND = 0.45

/**
 * Beyond this multiple of the current price it is not an alternative.
 *
 * Wet food priced per kilo spans an enormous range — a 70 g premium sachet
 * works out near ฿2,200/kg against ฿250/kg for a value can — so without a
 * ceiling the list filled up with items labelled "แพงกว่า ฿1,975/กก." sitting
 * under a heading promising a similar price.
 */
const MAX_PRICE_RATIO = 2.5

/**
 * Therapeutic diets, which must not be swapped on a website's say-so.
 *
 * A renal or gastrointestinal formula is on the bowl because a vet put it
 * there, and its grade is low for a reason — restricted protein and phosphorus
 * are the treatment. Recommending an A-grade air-dried tripe as an "upgrade"
 * from a kidney diet is actively harmful advice, so these are excluded in both
 * directions: they receive no suggestions and are never offered as one.
 */
const VET_DIET = new RegExp(
  [
    'veterinary', 'prescription diet', 'vet diet', 'clinical',
    'renal', 'urinary', 'gastrointestinal', 'gastro intestinal',
    'hypoallergenic', 'anallergenic', 'hepatic', 'cardiac', 'diabetic',
    'obesity management', 'mobility', 'convalescence', 'recovery',
    // Named therapeutic formulas that do not carry the word "veterinary" in
    // their title — Royal Canin and Hill's both sell these as vet-only lines.
    'fibre response', 'fiber response', 'satiety', 'sensitivity control',
    'glycobalance', 'neurocare', 'atopic', 'dermacomfort', 'skin support',
    'critical care', 'renal support', 'digestive care', 'dental care',
    'อาหารประกอบการรักษา', 'ประกอบการรักษาโรค', 'สูตรรักษา',
    '\\b[ikcwzjlmr]/d\\b',
  ].join('|'),
  'i',
)

export function isPrescriptionDiet(food: PetFood): boolean {
  return VET_DIET.test(`${food.name_en} ${food.name_th} ${food.brand}`)
}

export interface Alternative {
  food: PetFood
  slug: string
  grade: FoodGrade
  /** Short Thai phrases explaining why this one is here. */
  reasons: string[]
}

function pricePerKg(f: PetFood): number {
  return f.price_per_kg > 0 ? f.price_per_kg : 0
}

/**
 * Better-graded foods of the same type, preferring ones near the same price.
 *
 * Foods with no grade are never suggested: recommending an unrated product as
 * an upgrade would be asserting something the data does not support.
 */
export function getBetterAlternatives(food: PetFood, count = 3): Alternative[] {
  const currentGrade = getFoodGrade(food)
  const currentRank = currentGrade ? GRADE_RANK[currentGrade] : 0
  // Nothing to upgrade to from an A. The page shows a different message.
  if (currentRank >= GRADE_RANK.A) return []
  // A therapeutic diet is a treatment, not a purchase to be improved on.
  if (isPrescriptionDiet(food)) return []

  const basePrice = pricePerKg(food)

  const candidates = loadFoods()
    .filter(f => f.id !== food.id)
    .filter(f => f.animal === food.animal)
    .filter(f => f.sub_category === food.sub_category)
    .filter(f => !isPrescriptionDiet(f))
    .map(f => ({ f, grade: getFoodGrade(f) }))
    .filter((c): c is { f: PetFood; grade: FoodGrade } => c.grade !== null)
    .filter(c => GRADE_RANK[c.grade] > currentRank)

  const scored = candidates
    .map(({ f, grade }) => {
      const p = pricePerKg(f)
      // Distance in price, as a fraction of the current price. Unknown prices
      // sort after every known one rather than pretending to be a match.
      const priceGap = basePrice > 0 && p > 0 ? Math.abs(p - basePrice) / basePrice : Infinity
      const inBand = priceGap <= PRICE_BAND
      return { f, grade, p, priceGap, inBand }
    })
    // Drop the wildly-priced rather than let them backfill the list under a
    // heading that promises a comparable price.
    .filter(c => !(basePrice > 0 && c.p > 0 &&
      (c.p > basePrice * MAX_PRICE_RATIO || c.p < basePrice / MAX_PRICE_RATIO)))

  scored.sort((a, b) => {
    // In-band first, then by grade, then by closeness of price.
    if (a.inBand !== b.inBand) return a.inBand ? -1 : 1
    const byGrade = GRADE_RANK[b.grade] - GRADE_RANK[a.grade]
    if (byGrade !== 0) return byGrade
    if (a.priceGap !== b.priceGap) return a.priceGap - b.priceGap
    return b.f.green_count - a.f.green_count
  })

  // At most two per brand, so a brand with a deep line does not fill the list
  // and make the section read like an ad for it.
  const perBrand = new Map<string, number>()
  const out: Alternative[] = []
  for (const s of scored) {
    const n = perBrand.get(s.f.brand) ?? 0
    if (n >= 2) continue
    perBrand.set(s.f.brand, n + 1)

    const reasons: string[] = [`เกรด ${s.grade}`]
    if (basePrice > 0 && s.p > 0) {
      const diff = Math.round(s.p - basePrice)
      if (diff < 0) reasons.push(`ถูกกว่า ฿${Math.abs(diff)}/กก.`)
      else if (diff === 0) reasons.push('ราคาต่อกิโลเท่ากัน')
      else reasons.push(`แพงกว่า ฿${diff}/กก.`)
    } else if (s.p > 0) {
      reasons.push(`฿${Math.round(s.p)}/กก.`)
    }
    if (s.f.green_count > food.green_count) {
      reasons.push(`ส่วนผสมคุณภาพดี ${s.f.green_count} รายการ`)
    }

    out.push({ food: s.f, slug: foodSlug(s.f), grade: s.grade, reasons })
    if (out.length >= count) break
  }
  return out
}

/**
 * Genuinely comparable foods, for the "similar" rail.
 *
 * Same animal, same form, same life stage, and — where both prices are known —
 * the nearest ones by price. This replaces a global top-3 that was identical on
 * every page in a group.
 */
export function getComparableFoods(food: PetFood, count = 3): PetFood[] {
  const basePrice = pricePerKg(food)
  return loadFoods()
    .filter(f => f.id !== food.id)
    .filter(f => f.animal === food.animal)
    .filter(f => f.sub_category === food.sub_category)
    .filter(f => f.life_stage === food.life_stage)
    .map(f => {
      const p = pricePerKg(f)
      const gap = basePrice > 0 && p > 0 ? Math.abs(p - basePrice) / basePrice : Infinity
      return { f, gap, graded: getFoodGrade(f) !== null }
    })
    .sort((a, b) => {
      // Prefer something we can actually say a grade about.
      if (a.graded !== b.graded) return a.graded ? -1 : 1
      if (a.gap !== b.gap) return a.gap - b.gap
      return b.f.green_count - a.f.green_count
    })
    .slice(0, count)
    .map(x => x.f)
}
