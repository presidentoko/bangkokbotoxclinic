import { describe, it, expect } from 'vitest'
import rawDb from '../../data/items_db.json'
import {
  getAllItems,
  getItemsByCategory,
  getItemsByBrand,
  getItemBySlug,
  getAllBrands,
  toBrandSlug,
  formatPriceTHB,
  getPriceVsRetail,
} from '../data'

// Compute expectations directly from the data file rather than hardcoding
// magic numbers, so these tests stay green as items_db.json grows/shrinks
// and only fail when the *behavior* of a lib/data.ts function is wrong.
const rawItems = (rawDb as { items: { category: string; brand: string }[] }).items

describe('toBrandSlug', () => {
  it('lowercases and hyphenates', () => {
    expect(toBrandSlug('Louis Vuitton')).toBe('louis-vuitton')
    expect(toBrandSlug('Audemars Piguet')).toBe('audemars-piguet')
    expect(toBrandSlug('Hermès')).toBe('hermes')
    expect(toBrandSlug('Adidas')).toBe('adidas')
  })

  it('does not produce a double hyphen for "&" (regression: Van Cleef & Arpels)', () => {
    expect(toBrandSlug('Van Cleef & Arpels')).toBe('van-cleef-arpels')
  })

  it('never produces consecutive hyphens or leading/trailing hyphens for any brand in the data', () => {
    const brands = new Set(rawItems.map(i => i.brand))
    for (const brand of brands) {
      const slug = toBrandSlug(brand)
      expect(slug).not.toMatch(/--/)
      expect(slug).not.toMatch(/^-|-$/)
    }
  })
})

describe('formatPriceTHB', () => {
  it('formats with baht sign and commas', () => {
    expect(formatPriceTHB(195000)).toBe('฿195,000')
    expect(formatPriceTHB(9500)).toBe('฿9,500')
  })
})

describe('getPriceVsRetail', () => {
  it('shows savings when resale < retail', () => {
    const result = getPriceVsRetail({ min: 140000, max: 200000 }, 385000)
    expect(result).toMatch(/-\d+%/)
  })
  it('shows premium when resale > retail', () => {
    const result = getPriceVsRetail({ min: 5000000, max: 8000000 }, 3000000)
    expect(result).toMatch(/\+\d+%/)
  })
})

describe('getAllItems', () => {
  it('returns every item in the data file', () => {
    expect(getAllItems()).toHaveLength(rawItems.length)
  })

  it('has no duplicate slugs (regression: 6 collided pairs found in the data)', () => {
    const slugs = getAllItems().map(i => i.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('getItemsByCategory', () => {
  it('filters handbags', () => {
    const expected = rawItems.filter(i => i.category === 'handbags').length
    const bags = getItemsByCategory('handbags')
    expect(bags.length).toBe(expected)
    bags.forEach(i => expect(i.category).toBe('handbags'))
  })
  it('filters watches', () => {
    const expected = rawItems.filter(i => i.category === 'watches').length
    const watches = getItemsByCategory('watches')
    expect(watches.length).toBe(expected)
    watches.forEach(i => expect(i.category).toBe('watches'))
  })
  it('filters clothing', () => {
    const expected = rawItems.filter(i => i.category === 'clothing').length
    const clothing = getItemsByCategory('clothing')
    expect(clothing.length).toBe(expected)
    clothing.forEach(i => expect(i.category).toBe('clothing'))
  })
})

describe('getItemsByBrand', () => {
  it('returns Chanel items for the brand slug', () => {
    const expected = rawItems.filter(i => i.brand === 'Chanel').length
    const items = getItemsByBrand('chanel')
    expect(items.length).toBe(expected)
    items.forEach(i => expect(i.brand).toBe('Chanel'))
  })
  it('returns Gucci items for the brand slug', () => {
    const expected = rawItems.filter(i => i.brand === 'Gucci').length
    const items = getItemsByBrand('gucci')
    expect(items.length).toBe(expected)
  })
  it('accepts a raw display name, not just a slug (e.g. "Louis Vuitton")', () => {
    const bySlug = getItemsByBrand('louis-vuitton')
    const byName = getItemsByBrand('Louis Vuitton')
    expect(byName.length).toBe(bySlug.length)
    expect(byName.length).toBeGreaterThan(0)
  })
  it('resolves the "van cleef" shorthand used by /brands/van-cleef to Van Cleef & Arpels', () => {
    const items = getItemsByBrand('van cleef')
    expect(items.length).toBeGreaterThan(0)
    items.forEach(i => expect(i.brand).toBe('Van Cleef & Arpels'))
  })
})

describe('getItemBySlug', () => {
  it('finds item by brand + model slug', () => {
    const item = getItemBySlug('chanel', 'classic-flap-medium')
    expect(item?.id).toBe('chanel-classic-flap-medium')
  })
  it('finds clothing item', () => {
    const item = getItemBySlug('nike', 'air-jordan-1-retro-high')
    expect(item?.category).toBe('clothing')
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
  it('counts Chanel models correctly', () => {
    const chanel = getAllBrands().find(b => b.slug === 'chanel')
    expect(chanel?.count).toBeGreaterThanOrEqual(2)
    expect(chanel?.categories).toContain('handbags')
    expect(chanel?.categories).toContain('clothing')
  })
})

describe('brand spelling consistency (regression: Hermès/Hermes collision)', () => {
  it('never stores the unaccented "Hermes" spelling', () => {
    const unaccented = rawItems.filter(i => i.brand === 'Hermes')
    expect(unaccented).toHaveLength(0)
  })
})
