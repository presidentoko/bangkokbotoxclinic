import { describe, it, expect } from 'vitest'
import {
  getAllItems,
  getItemsByCategory,
  getItemsByBrand,
  getItemBySlug,
  getAllBrands,
  toBrandSlug,
  formatPrice,
  getPriceVsRetail,
} from '../data'
import rawDb from '../../data/items_db.json'

// Independent read of the source data (not via lib/data.ts) so the expected
// counts below are computed from the data file itself, not from the code
// under test — and stay correct automatically as items_db.json changes.
const rawItems = (rawDb as { items: { id: string; brand: string }[] }).items

describe('toBrandSlug', () => {
  it('lowercases and hyphenates', () => {
    expect(toBrandSlug('Louis Vuitton')).toBe('louis-vuitton')
    expect(toBrandSlug('Audemars Piguet')).toBe('audemars-piguet')
    expect(toBrandSlug('Hermès')).toBe('hermes')
  })
  it('strips & and . without leaving a double hyphen', () => {
    expect(toBrandSlug('Van Cleef & Arpels')).toBe('van-cleef-arpels')
    expect(toBrandSlug('Tiffany & Co.')).toBe('tiffany-co')
  })
  it('produces a slug matching the prefix of every item slug for every brand', () => {
    const brandToSlugPrefix = new Map<string, string>()
    for (const item of rawItems as { brand: string; slug?: string }[]) {
      const prefix = (item.slug as string).split('/')[0]
      brandToSlugPrefix.set(item.brand, prefix)
    }
    for (const [brand, expectedPrefix] of brandToSlugPrefix) {
      expect(toBrandSlug(brand)).toBe(expectedPrefix)
    }
  })
})

describe('formatPrice', () => {
  it('formats with dollar sign and commas', () => {
    expect(formatPrice(10800)).toBe('$10,800')
    expect(formatPrice(500)).toBe('$500')
  })
})

describe('getPriceVsRetail', () => {
  it('shows savings when resale < retail', () => {
    const result = getPriceVsRetail({ min: 4000, max: 5800 }, 10800)
    expect(result).toMatch(/-\d+%/)
  })
  it('shows premium when resale > retail', () => {
    const result = getPriceVsRetail({ min: 18000, max: 35000 }, 12000)
    expect(result).toMatch(/\+\d+%/)
  })
})

describe('getAllItems', () => {
  it('returns every item in items_db.json', () => {
    expect(getAllItems()).toHaveLength(rawItems.length)
  })
  it('every item has a unique id', () => {
    const ids = getAllItems().map(i => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getItemsByCategory', () => {
  it('filters handbags', () => {
    const bags = getItemsByCategory('handbags')
    expect(bags.length).toBeGreaterThan(0)
    bags.forEach(i => expect(i.category).toBe('handbags'))
  })
  it('filters watches', () => {
    const watches = getItemsByCategory('watches')
    expect(watches.length).toBeGreaterThan(0)
    watches.forEach(i => expect(i.category).toBe('watches'))
  })
})

describe('getItemsByBrand', () => {
  it('returns Chanel items by slug', () => {
    const expectedCount = rawItems.filter(i => i.brand === 'Chanel').length
    const items = getItemsByBrand('chanel')
    expect(items.length).toBe(expectedCount)
    items.forEach(i => expect(i.brand).toBe('Chanel'))
  })
  it('accepts a display name as well as a slug', () => {
    expect(getItemsByBrand('Van Cleef & Arpels').length).toBeGreaterThan(0)
    expect(getItemsByBrand('patek philippe').length).toBeGreaterThan(0)
  })
  it('slug and display-name lookups agree', () => {
    expect(getItemsByBrand('chanel').length).toBe(getItemsByBrand('Chanel').length)
  })
})

describe('getItemBySlug', () => {
  it('finds item by brand + model slug', () => {
    const item = getItemBySlug('chanel', 'classic-flap-medium')
    expect(item?.id).toBe('chanel-classic-flap-medium')
  })
  it('returns undefined for unknown slug', () => {
    expect(getItemBySlug('unknown', 'nope')).toBeUndefined()
  })
})

describe('getAllBrands', () => {
  it('deduplicates brands', () => {
    const brands = getAllBrands()
    const slugs = brands.map(b => b.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
  it('counts models correctly for Chanel', () => {
    const expectedCount = rawItems.filter(i => i.brand === 'Chanel').length
    const chanel = getAllBrands().find(b => b.slug === 'chanel')
    expect(chanel?.count).toBe(expectedCount)
  })
  it('every brand slug matches the prefix used in its items\' own slugs', () => {
    for (const brand of getAllBrands()) {
      const items = getItemsByBrand(brand.slug)
      expect(items.length).toBeGreaterThan(0)
      for (const item of items) {
        expect(item.slug.startsWith(`${brand.slug}/`)).toBe(true)
      }
    }
  })
})
