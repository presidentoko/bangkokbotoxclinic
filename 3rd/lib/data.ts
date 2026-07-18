import db from '@/data/items_db.json'

export type Condition = 'excellent' | 'very_good' | 'good'
export type Category = 'handbags' | 'watches' | 'clothing' | 'shoes' | 'jewelry' | 'belts' | 'scarves' | 'small-leather-goods'

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
  affiliate_links?: { carousell?: string }
  last_updated: string
}

export interface BrandSummary {
  brand: string
  slug: string
  count: number
  categories: Category[]
}

// Slim shape for client-side search (header SiteSearch + /search page) so we
// don't serialize every item's full price_samples array (~30 samples each)
// into every page's HTML. Only the fields those UIs actually render.
export interface SearchIndexEntry {
  id: string
  brand: string
  model: string
  slug: string
  avg_price?: number
}

const items = (db as { items: Item[] }).items

export function getAllItems(): Item[] { return items }

export function getItemsByCategory(category: Category): Item[] {
  return items.filter(i => i.category === category)
}

// Some call sites use a shorthand brand slug that doesn't literally match any
// item's brand name once normalized (e.g. "van cleef" for "Van Cleef & Arpels",
// used by the /brands/van-cleef hub page and its compare/guide pages). Map
// those known shorthands to the slug toBrandSlug() actually produces.
const BRAND_SLUG_ALIASES: Record<string, string> = {
  'van-cleef': 'van-cleef-arpels',
}

export function getItemsByBrand(brandSlug: string): Item[] {
  // Accept either an already-normalized slug or a raw display name (e.g. call
  // sites historically passed strings like 'Van Cleef' or 'louis vuitton') by
  // normalizing the input through the same slug function used for items.
  const normalized = toBrandSlug(brandSlug)
  const resolved = BRAND_SLUG_ALIASES[normalized] ?? normalized
  return items.filter(i => toBrandSlug(i.brand) === resolved)
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
      if (!existing.categories.includes(item.category)) {
        existing.categories.push(item.category)
      }
    } else {
      map.set(slug, { brand: item.brand, slug, count: 1, categories: [item.category] })
    }
  }
  return Array.from(map.values())
}

export function toBrandSlug(brand: string): string {
  return brand
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    // Strip punctuation (e.g. "&", ".", apostrophes) BEFORE turning whitespace
    // into hyphens, so "Van Cleef & Arpels" -> "van-cleef-arpels" (single
    // hyphen) instead of "van-cleef--arpels" (the "&" leaving behind an extra
    // space that got hyphenated on its own).
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function formatPriceTHB(price: number): string {
  return '฿' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(price)
}

export function getAvgPrice(range: { min: number; max: number }): number {
  return Math.round((range.min + range.max) / 2)
}

export function getPriceVsRetail(range: PriceRange, retail: number): string {
  if (retail === 0) return 'N/A'
  const midpoint = (range.min + range.max) / 2
  const pct = Math.round(((midpoint - retail) / retail) * 100)
  return pct > 0 ? `+${pct}%` : `${pct}%`
}

export function getSearchIndex(): SearchIndexEntry[] {
  return items.map(i => ({
    id: i.id,
    brand: i.brand,
    model: i.model,
    slug: i.slug,
    avg_price: i.price_ranges?.very_good ? getAvgPrice(i.price_ranges.very_good) : undefined,
  }))
}

// Accent-insensitive search normalization, e.g. so searching "hermes" matches
// data stored as "Hermès". Apply to both the query and the searched fields.
export function normalizeForSearch(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

export function getItemsUnderBudget(maxThb: number): Item[] {
  return items.filter(i => {
    const vg = i.price_ranges?.very_good
    if (!vg) return false
    return getAvgPrice(vg) <= maxThb
  })
}
