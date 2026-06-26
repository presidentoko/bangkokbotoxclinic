import db from '@/data/items_db.json'

export type Condition = 'excellent' | 'very_good' | 'good'
export type Category = 'handbags' | 'watches' | 'clothing'

export interface PriceRange {
  min: number
  max: number
}

export interface PriceSample {
  price: number
  condition: Condition
  platform: 'carousell_th' | 'c2c_th'
  date: string
}

export interface Item {
  id: string
  brand: string
  model: string
  category: Category
  slug: string
  retail_price_thb: number
  price_ranges: Partial<Record<Condition, PriceRange>>
  price_samples: PriceSample[]
  affiliate_links: { carousell: string }
  last_updated: string
}

export interface BrandSummary {
  brand: string
  slug: string
  count: number
  category: Category
}

const items = (db as { items: Item[] }).items

export function getAllItems(): Item[] { return items }

export function getItemsByCategory(category: Category): Item[] {
  return items.filter(i => i.category === category)
}

export function getItemsByBrand(brandSlug: string): Item[] {
  return items.filter(i => toBrandSlug(i.brand) === brandSlug)
}

export function getItemBySlug(brandSlug: string, modelSlug: string): Item | undefined {
  return items.find(i => i.slug === `${brandSlug}/${modelSlug}`)
}

export function getAllBrands(): BrandSummary[] {
  const map = new Map<string, BrandSummary>()
  for (const item of items) {
    const slug = toBrandSlug(item.brand)
    const existing = map.get(slug)
    if (existing) {
      existing.count++
    } else {
      map.set(slug, { brand: item.brand, slug, count: 1, category: item.category })
    }
  }
  return Array.from(map.values())
}

export function toBrandSlug(brand: string): string {
  return brand
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export function formatPriceTHB(price: number): string {
  return '฿' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(price)
}

export function getPriceVsRetail(range: PriceRange, retail: number): string {
  if (retail === 0) return 'N/A'
  const midpoint = (range.min + range.max) / 2
  const pct = Math.round(((midpoint - retail) / retail) * 100)
  return pct > 0 ? `+${pct}%` : `${pct}%`
}
