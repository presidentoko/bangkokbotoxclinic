import type { PetFood, FoodGrade } from './types'
import { loadFoods } from './petfood'
import { getFoodGrade } from './grading'
import { toSlug } from './slugify'
import { foodKind } from './foodKind'

/**
 * One page per brand, measured across every product of that brand we hold.
 *
 * Product pages have been out of the index since 2026-09-23 (lib/indexing.ts):
 * one product is a name, a panel and a grade, and 1,686 of them looked like
 * the scaled pages the site was demoted for. A brand page is the opposite — it
 * says something no single product page and no shop listing says: how a
 * brand's whole range grades, how much protein its cat and dog lines carry on a
 * dry-matter basis, and which flagged ingredients keep coming back. People
 * search the brand ("royal canin"), not the SKU.
 *
 * THE GATE. A brand gets a page only when at least MIN_MEASURED of its products
 * carry a grade or a guaranteed analysis. Hill's has 466 products and one
 * grade; a page for it would be a list of names, so there is none.
 */
const MIN_MEASURED = 20

/**
 * Kibble by its label, not by `sub_category`: the PCG scrape files Me-O
 * pouches (moisture 85–87%) as dry_food, which put a "dry" Me-O median at 62%
 * protein. Dry pet food is ≤ 14% moisture by definition; anything wetter, or
 * with no moisture stated, stays out of the dry-matter comparison. Treats and
 * non-food are out too — a jerky strip is not a diet.
 */
function isKibble(f: PetFood): boolean {
  return f.moisture_pct > 0 && f.moisture_pct <= 14 && foodKind(f) === 'meal'
}

export interface NutritionSummary {
  n: number
  proteinMedian: number
  proteinMin: number
  proteinMax: number
  fatMedian: number
}

export interface BrandStats {
  brand: string
  slug: string
  foods: PetFood[]
  cat: number
  dog: number
  graded: number
  grades: Record<FoodGrade, number>
  /** Dry food only: wet food on a dry-matter basis is not comparable to a label. */
  dryCat: NutritionSummary | null
  dryDog: NutritionSummary | null
  /** Red/black ingredients and how many of the brand's ingredient panels contain each. */
  flagged: Array<{ name: string; grade: 'red' | 'black'; products: number }>
  panels: number
  topProtein: PetFood[]
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

function nutrition(foods: PetFood[]): NutritionSummary | null {
  const xs = foods.filter(f => isKibble(f) && f.protein_dm > 0 && f.fat_dm > 0)
  if (xs.length < 3) return null
  const p = xs.map(f => f.protein_dm)
  return {
    n: xs.length,
    proteinMedian: median(p),
    proteinMin: Math.min(...p),
    proteinMax: Math.max(...p),
    fatMedian: median(xs.map(f => f.fat_dm)),
  }
}

let cache: BrandStats[] | null = null

export function allBrandStats(): BrandStats[] {
  if (cache) return cache
  const byBrand = new Map<string, PetFood[]>()
  for (const f of loadFoods()) {
    if (!f.brand) continue
    const list = byBrand.get(f.brand) ?? []
    list.push(f)
    byBrand.set(f.brand, list)
  }

  const out: BrandStats[] = []
  for (const [brand, foods] of byBrand) {
    const measured = foods.filter(f => getFoodGrade(f) || f.protein_pct > 0)
    if (measured.length < MIN_MEASURED) continue
    const slug = toSlug(brand)
    if (!slug) continue

    const grades: Record<FoodGrade, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 }
    for (const f of foods) {
      const g = getFoodGrade(f)
      if (g) grades[g]++
    }

    const flaggedCount = new Map<string, { grade: 'red' | 'black'; products: number }>()
    let panels = 0
    for (const f of foods) {
      if (!getFoodGrade(f)) continue
      panels++
      const seen = new Set<string>()
      for (const ing of f.ingredients ?? []) {
        if (ing.grade !== 'red' && ing.grade !== 'black') continue
        if (seen.has(ing.name)) continue
        seen.add(ing.name)
        const cur = flaggedCount.get(ing.name) ?? { grade: ing.grade, products: 0 }
        cur.products++
        flaggedCount.set(ing.name, cur)
      }
    }

    const dryCat = nutrition(foods.filter(f => f.animal === 'cat'))
    const dryDog = nutrition(foods.filter(f => f.animal === 'dog'))
    const graded = Object.values(grades).reduce((a, b) => a + b, 0)
    // Measured products are not enough on their own: the page needs a section
    // with something in it, or it is a list of names.
    if (graded < 10 && (dryCat?.n ?? 0) + (dryDog?.n ?? 0) < 5) continue

    out.push({
      brand,
      slug,
      foods,
      cat: foods.filter(f => f.animal === 'cat').length,
      dog: foods.filter(f => f.animal === 'dog').length,
      graded,
      grades,
      dryCat,
      dryDog,
      flagged: [...flaggedCount.entries()]
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.products - a.products)
        .slice(0, 8),
      panels,
      topProtein: foods
        .filter(f => isKibble(f) && f.protein_dm > 0)
        .sort((a, b) => b.protein_dm - a.protein_dm)
        .slice(0, 6),
    })
  }
  out.sort((a, b) => b.foods.length - a.foods.length)
  cache = out
  return out
}

export function getBrandStats(slug: string): BrandStats | null {
  return allBrandStats().find(b => b.slug === slug) ?? null
}
