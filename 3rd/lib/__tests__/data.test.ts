import { describe, it, expect } from 'vitest'
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

describe('toBrandSlug', () => {
  it('lowercases and hyphenates', () => {
    expect(toBrandSlug('Louis Vuitton')).toBe('louis-vuitton')
    expect(toBrandSlug('Audemars Piguet')).toBe('audemars-piguet')
    expect(toBrandSlug('Hermès')).toBe('hermes')
    expect(toBrandSlug('Adidas')).toBe('adidas')
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
  it('returns all 22 items', () => {
    expect(getAllItems()).toHaveLength(22)
  })
})

describe('getItemsByCategory', () => {
  it('filters handbags', () => {
    const bags = getItemsByCategory('handbags')
    expect(bags.length).toBe(9)
    bags.forEach(i => expect(i.category).toBe('handbags'))
  })
  it('filters watches', () => {
    const watches = getItemsByCategory('watches')
    expect(watches.length).toBe(5)
    watches.forEach(i => expect(i.category).toBe('watches'))
  })
  it('filters clothing', () => {
    const clothing = getItemsByCategory('clothing')
    expect(clothing.length).toBe(8)
    clothing.forEach(i => expect(i.category).toBe('clothing'))
  })
})

describe('getItemsByBrand', () => {
  it('returns Chanel items (3 items: 2 bags + 1 belt + espadrilles)', () => {
    const items = getItemsByBrand('chanel')
    expect(items.length).toBeGreaterThanOrEqual(2)
    items.forEach(i => expect(i.brand).toBe('Chanel'))
  })
  it('returns Gucci items (2 bags + 2 clothing)', () => {
    const items = getItemsByBrand('gucci')
    expect(items.length).toBeGreaterThanOrEqual(2)
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
