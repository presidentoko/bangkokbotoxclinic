import data from '@/data/value/models.json'

/**
 * Resale value — what each model sells for against what the maison charges.
 *
 * Built by scraper/value_build.py from Vestiaire Collective sold listings and
 * a retail price that carries its source. Nothing in here is computed from a
 * number without provenance: a model whose retail price could not be sourced
 * still gets its resale figures, but no retention percentage and no place in
 * a ranking. See value_build.py for the rules.
 */

export type Grade = 'A' | 'B' | 'C'

export interface Stat {
  n: number
  median: number
  p25?: number
  p75?: number
  p10?: number
  p90?: number
}

export interface Retail {
  usd: number
  config?: string
  source_url?: string
  confidence: 'official' | 'reported'
  as_of?: string
  discontinued?: boolean
}

export interface Month {
  month: string
  n: number
  median: number | null
}

export interface ValueModel {
  slug: string
  item_slug: string
  brand: string
  brand_slug: string
  name: string
  category: string
  /** 'sold' = what listings sold for; 'asking' = too few sales, so the live
   *  asking prices — always labelled, never ranked. */
  basis: 'sold' | 'asking'
  resale: Stat
  sold: Partial<Stat> | null
  live: Partial<Stat> | null
  grades: Partial<Record<Grade, Stat>>
  monthly: Month[]
  /** Vestiaire listings for the whole model family, every size. */
  family_stock: number | null
  stock_history: { date: string; family_stock: number }[]
  retail: Retail | null
  retention: number | null
  like_new_vs_retail: number | null
  rankable: boolean
  examples: { price: number; grade: Grade | null; link: string }[]
  generated: string
}

interface ValueFile {
  generated: string
  models: ValueModel[]
  rankings: Record<'value_retention' | 'biggest_depreciation' | 'under_retail', string[]>
}

const file = data as unknown as ValueFile
const bySlug = new Map(file.models.map(m => [m.slug, m]))

export const VALUE_GENERATED = file.generated

export const GRADE_LABEL: Record<Grade, { en: string; th: string; detail: string }> = {
  A: { en: 'Like new', th: 'เหมือนใหม่', detail: 'Never worn / never worn with tags' },
  B: { en: 'Very good', th: 'สภาพดีมาก', detail: 'Light signs of use' },
  C: { en: 'Good / fair', th: 'สภาพดี / พอใช้', detail: 'Visible wear' },
}

export function getValueModels(): ValueModel[] {
  return file.models
}

export function getValueModel(slug: string): ValueModel | undefined {
  return bySlug.get(slug)
}

/** The value page for a catalogue item (`chanel/classic-flap-medium`), if any. */
export function getValueForItem(itemSlug: string): ValueModel | undefined {
  return file.models.find(m => m.item_slug === itemSlug)
}

export type RankingKey = 'value-retention' | 'biggest-depreciation' | 'under-retail'

const RANKING_FIELD: Record<RankingKey, keyof ValueFile['rankings']> = {
  'value-retention': 'value_retention',
  'biggest-depreciation': 'biggest_depreciation',
  'under-retail': 'under_retail',
}

export const RANKING_KEYS = Object.keys(RANKING_FIELD) as RankingKey[]

export function getRanking(key: RankingKey): ValueModel[] {
  return file.rankings[RANKING_FIELD[key]].map(s => bySlug.get(s)!).filter(Boolean)
}

/** Position in the retention ranking, 1-based, or null when unranked. */
export function retentionRank(slug: string): { rank: number; of: number } | null {
  const list = file.rankings.value_retention
  const i = list.indexOf(slug)
  return i < 0 ? null : { rank: i + 1, of: list.length }
}

export function usd(n: number | null | undefined): string {
  if (n == null) return '—'
  return '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)
}

export function pct(n: number | null | undefined, digits = 0): string {
  if (n == null) return '—'
  return `${n.toFixed(digits)}%`
}

export function monthLabel(m: string, locale: string): string {
  const [y, mo] = m.split('-').map(Number)
  return new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "Aug–Sep 2026": the window the sold median was drawn from. */
export function soldWindow(m: ValueModel, locale: string): string | null {
  if (m.monthly.length === 0) return null
  const first = monthLabel(m.monthly[0].month, locale)
  const last = monthLabel(m.monthly[m.monthly.length - 1].month, locale)
  return first === last ? first : `${first} – ${last}`
}

/** Same-brand models with value pages, most-sold first. */
export function siblings(m: ValueModel, limit = 8): ValueModel[] {
  return file.models
    .filter(o => o.brand_slug === m.brand_slug && o.slug !== m.slug)
    .sort((a, b) => (b.resale.n ?? 0) - (a.resale.n ?? 0))
    .slice(0, limit)
}

/**
 * Head-to-head pages. Not every pair — the combinatorial set is mostly
 * questions nobody asks, and a site that publishes hundreds of them reads as
 * exactly the scaled template content both of these domains were demoted for
 * in August 2026. A pair qualifies when shoppers genuinely weigh one against
 * the other: sibling sizes of the same bag, or the named rivals below. Both
 * sides need sold data, or the comparison is one number against a guess.
 */
const RIVALS: [string, string][] = [
  ['hermes-birkin-30', 'hermes-kelly-28'],
  ['hermes-birkin-25', 'hermes-kelly-25'],
  ['chanel-classic-flap-medium', 'hermes-birkin-30'],
  ['chanel-classic-flap-medium', 'chanel-boy-bag-medium'],
  ['chanel-classic-flap-medium', 'dior-lady-dior-medium'],
  ['chanel-classic-flap-medium', 'louis-vuitton-capucines-bb'],
  ['chanel-classic-flap-small', 'chanel-19-bag-small'],
  ['chanel-wallet-on-chain', 'chanel-classic-flap-mini'],
  ['chanel-classic-flap-mini', 'chanel-mini-rectangular-flap'],
  ['louis-vuitton-neverfull-mm', 'louis-vuitton-onthego-mm'],
  ['louis-vuitton-speedy-30', 'louis-vuitton-neverfull-mm'],
  ['louis-vuitton-alma-bb', 'louis-vuitton-pochette-metis'],
  ['louis-vuitton-pochette-metis', 'dior-saddle-bag'],
  ['dior-lady-dior-medium', 'dior-book-tote-medium'],
  ['dior-saddle-bag', 'fendi-baguette-medium'],
  ['celine-classic-box', 'saint-laurent-loulou-small'],
  ['bottega-veneta-jodie-small', 'loewe-puzzle-small-bag'],
  ['gucci-gg-marmont-small', 'saint-laurent-loulou-small'],
  ['prada-re-edition-2005', 'prada-re-edition-2000'],
  ['cartier-love-bracelet', 'van-cleef-arpels-vintage-alhambra-bracelet'],
  ['cartier-love-bracelet', 'cartier-juste-un-clou-bracelet'],
]

export interface Pair { slug: string; a: ValueModel; b: ValueModel }

function pairSlug(a: string, b: string) { return `${a}-vs-${b}` }

export function getPairs(): Pair[] {
  const out = new Map<string, Pair>()
  const ok = (m?: ValueModel) => !!m && m.basis === 'sold'
  const add = (x?: ValueModel, y?: ValueModel) => {
    if (!ok(x) || !ok(y)) return
    const [a, b] = [x!, y!].sort((p, q) => p.slug.localeCompare(q.slug))
    out.set(pairSlug(a.slug, b.slug), { slug: pairSlug(a.slug, b.slug), a, b })
  }
  for (const [a, b] of RIVALS) add(bySlug.get(a), bySlug.get(b))
  // Sibling sizes: same brand, same name once the size word is removed.
  const sizeless = (m: ValueModel) =>
    m.name.toLowerCase().replace(/\b(mini|micro|nano|small|medium|large|jumbo|bb|pm|mm|gm|tpm|\d{2,3}(mm|cm)?)\b/g, '').replace(/\s+/g, ' ').trim()
  const fam = new Map<string, ValueModel[]>()
  for (const m of file.models) {
    if (m.category !== 'handbags') continue
    const k = `${m.brand_slug}|${sizeless(m)}`
    fam.set(k, [...(fam.get(k) ?? []), m])
  }
  for (const group of fam.values()) {
    for (let i = 0; i < group.length; i++)
      for (let j = i + 1; j < group.length; j++) add(group[i], group[j])
  }
  return [...out.values()]
}

export function getPair(slug: string): Pair | undefined {
  return getPairs().find(p => p.slug === slug)
}

export function pairsFor(m: ValueModel): Pair[] {
  return getPairs().filter(p => p.a.slug === m.slug || p.b.slug === m.slug)
}
