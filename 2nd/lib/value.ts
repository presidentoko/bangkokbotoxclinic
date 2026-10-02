import data from '@/data/value_stats.json'

/**
 * Resale figures for the calculators.
 *
 * Written by 3rd/scraper/value_build.py — the same function that writes the
 * value pages on chicpreowned.com — so a calculator here and a value page
 * there can never quote different numbers for the same bag. Do not edit the
 * JSON by hand; edit the build.
 */

export type Grade = 'A' | 'B' | 'C'

export interface GradeStat { median: number; p25?: number; p75?: number; n: number }

export interface CalcModel {
  slug: string
  brand: string
  name: string
  category: string
  basis: 'sold' | 'asking'
  resale: { n: number; median: number; p25?: number; p75?: number }
  grades: Partial<Record<Grade, GradeStat>>
  retail_usd: number | null
  retail_as_of: string | null
  retail_discontinued: boolean
  retention: number | null
}

const file = data as unknown as { generated: string; models: CalcModel[] }

export const DATA_DATE = file.generated

export const VALUE_SITE = 'https://www.chicpreowned.com'

export function valueUrl(slug: string) {
  return `${VALUE_SITE}/en/value/${slug}`
}

export const GRADES: { key: Grade; label: string; detail: string }[] = [
  { key: 'A', label: 'Like new', detail: 'Never worn, or never worn with tags' },
  { key: 'B', label: 'Very good', detail: 'Light signs of use' },
  { key: 'C', label: 'Good / fair', detail: 'Visible wear' },
]

/** Calculators only offer models that have sold data — an estimate built on
 *  asking prices would overstate what anyone gets for their bag. */
export function getCalcModels(): CalcModel[] {
  return file.models
    .filter(m => m.basis === 'sold')
    .sort((a, b) => (a.brand + a.name).localeCompare(b.brand + b.name))
}

export function getCalcModel(slug: string): CalcModel | undefined {
  return file.models.find(m => m.slug === slug)
}

export function usd(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—'
  return '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(n))
}
