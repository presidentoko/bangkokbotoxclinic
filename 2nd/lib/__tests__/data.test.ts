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

describe('toBrandSlug', () => {
  it('lowercases and hyphenates', () => {
    expect(toBrandSlug('Louis Vuitton')).toBe('louis-vuitton')
    expect(toBrandSlug('Audemars Piguet')).toBe('audemars-piguet')
    expect(toBrandSlug('Hermès')).toBe('hermes')
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
  it('returns all 13 items', () => {
    expect(getAllItems()).toHaveLength(13)
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
    const items = getItemsByBrand('chanel')
    expect(items.length).toBe(2)
    items.forEach(i => expect(i.brand).toBe('Chanel'))
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
    const chanel = getAllBrands().find(b => b.slug === 'chanel')
    expect(chanel?.count).toBe(2)
  })
})
