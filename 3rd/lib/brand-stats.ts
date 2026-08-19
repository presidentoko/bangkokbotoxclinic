import { getItemsByBrand, headlinePrice, getAvgPrice, type Item, type PriceRange } from './data'

/**
 * What the tracked listings actually say about a brand.
 *
 * The brand pages rank for "patek philippe price thailand" and answer it with
 * a grid of model cards — the price is there, but nothing tells a buyer what
 * it means: whether the brand trades over or under retail here, what the cheapest
 * way in is, how much a discount is normal. Every figure below is computed
 * from the dataset, so the page cannot drift from the model pages and needs no
 * editorial upkeep.
 */
export interface BrandStats {
  brandName: string
  slug: string
  tracked: number
  sampleCount: number
  updated: string
  /** Models whose headline price sits above their retail price. */
  aboveRetail: { item: Item; range: PriceRange; premiumPct: number }[]
  /** Models trading below retail, most-discounted first. */
  belowRetail: { item: Item; range: PriceRange; discountPct: number }[]
  /** Median discount across the below-retail models, or null if none. */
  medianDiscountPct: number | null
  cheapest: { item: Item; price: number } | null
  dearest: { item: Item; price: number } | null
}

function median(values: number[]): number | null {
  if (!values.length) return null
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
}

export function getBrandStats(slug: string): BrandStats | null {
  const items = getItemsByBrand(slug)
  if (!items.length) return null

  const priced = items
    .map(item => ({ item, headline: headlinePrice(item.price_ranges) }))
    .filter((r): r is { item: Item; headline: { range: PriceRange; condition: never } } =>
      r.headline !== null
    )

  const above: BrandStats['aboveRetail'] = []
  const below: BrandStats['belowRetail'] = []
  for (const { item, headline } of priced) {
    const retail = item.retail_price_thb
    if (!retail || retail <= 0) continue
    const price = getAvgPrice(headline.range)
    const delta = Math.round(((price - retail) / retail) * 100)
    if (delta > 0) above.push({ item, range: headline.range, premiumPct: delta })
    else if (delta < 0) below.push({ item, range: headline.range, discountPct: -delta })
  }
  above.sort((a, b) => b.premiumPct - a.premiumPct)
  below.sort((a, b) => b.discountPct - a.discountPct)

  const byPrice = priced
    .map(({ item, headline }) => ({ item, price: getAvgPrice(headline.range) }))
    .sort((a, b) => a.price - b.price)

  return {
    brandName: items[0].brand,
    slug,
    tracked: priced.length,
    sampleCount: items.reduce((n, i) => n + (i.price_samples?.length ?? 0), 0),
    updated: items.map(i => i.last_updated).filter(Boolean).sort().pop() ?? '',
    aboveRetail: above,
    belowRetail: below,
    medianDiscountPct: median(below.map(b => b.discountPct)),
    cheapest: byPrice[0] ?? null,
    dearest: byPrice[byPrice.length - 1] ?? null,
  }
}
