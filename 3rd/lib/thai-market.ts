import market from '@/data/thai_market.json'
import history from '@/data/price_history.json'
import { Condition, Item, headlinePrice, getAvgPrice } from './data'

/**
 * Prices observed on Thai dealers' own shelves.
 *
 * Everything else on this site descends from Vestiaire Collective — a US
 * marketplace, quoted in dollars, converted at the day's rate. For handbags
 * that lands close enough to Bangkok that nobody noticed. For watches it does
 * not: the site was publishing 579,000-767,000 THB for a Datejust 41 that
 * Thai dealers list at 399,000, against a 275,000 THB retail. A visitor who
 * knows the market closes the tab; one who doesn't gets talked out of a fair
 * deal.
 *
 * So a Thai figure, where one exists, is the number the site leads with, and
 * the international figure becomes what it always was — a cross-border
 * comparison. See scraper/thai_match.py for how a listing earns its place.
 */

export interface ThaiSummary {
  n: number
  min: number
  median: number
  max: number
}

/** A model family with the size unknown — see `ThaiEntry.family`. */
export interface ThaiFamily extends ThaiSummary {
  label: string
}

export interface ThaiListing {
  title: string
  price: number
  url: string
  source: string
  in_stock: boolean
  /**
   * The dealer's own thumbnail, served from the dealer's own domain. Empty
   * when the shop published none.
   *
   * These are the only photographs on the site, and they matter more than
   * their size suggests: someone who saw a bag on TikTok cannot tell from a
   * column of numbers whether it is the same bag. Hotlinked deliberately —
   * the file stays on the shop's server, beside the shop's name and a link
   * to the shop's listing, and our referrer rides along so the shop can see
   * the traffic arriving.
   */
  image?: string
}

/** What Thai dealers write instead of the maison's own name for a size. */
export interface ThaiAlias {
  name: string
  /** Listings in the latest sweep using it — the evidence for the claim. */
  count: number
}

/** One piece of dealer shorthand, defined. See scraper/thai_vocab.py. */
export interface ThaiTerm {
  term: string
  en: string
  th: string
  count: number
}

export interface ThaiEntry {
  /** This exact reference. Safe to present as the item's price. */
  variant?: ThaiSummary
  /**
   * The model family across every size the dealers had. Present because Thai
   * dealers title tersely — "HERMES BIRKIN", no 25 or 30 — and a range across
   * sizes is worth more than silence. Never shown as the item's own price.
   */
  family?: ThaiFamily
  by_condition?: Partial<Record<Condition, ThaiSummary>>
  sources: string[]
  listings: ThaiListing[]
  /**
   * The shop's notation for this exact size, where it differs from the
   * maison's. A Thai buyer arrives holding "Classic 10" off a reseller's
   * Instagram post, not "Classic Flap Medium", so the page has to answer to
   * both. Only notations seen in the latest sweep appear.
   */
  aliases?: ThaiAlias[]
}

export interface ThaiBrand {
  brand: string
  n: number
  /** Quartiles, not extremes: a maison's shelf holds card holders and grand
   *  complications, so its min and max describe nothing. */
  p25: number
  median: number
  p75: number
  sources: string[]
}

export interface ThaiSource {
  id: string
  label: string
  url: string
  focus: string
  listings: number
  ok: boolean
  /** Advertises that it buys from the public. Re-read off the shop's own
   *  storefront on every sweep, so a shop that stops offering it stops being
   *  listed as offering it. */
  buys: boolean
  /** Advertises consignment (ฝากขาย). */
  consigns: boolean
}

interface MarketFile {
  generated: string
  listing_count: number
  sources: ThaiSource[]
  items: Record<string, ThaiEntry>
  brands: Record<string, ThaiBrand>
  vocabulary?: ThaiTerm[]
}

const data = market as unknown as MarketFile

export function getThaiEntry(slug: string): ThaiEntry | null {
  return data.items[slug] ?? null
}

export function getThaiBrand(brandSlug: string): ThaiBrand | null {
  return data.brands[brandSlug] ?? null
}

export function getThaiSources(): ThaiSource[] {
  return data.sources.filter(s => s.ok)
}

export function getThaiMeta() {
  return { generated: data.generated, listingCount: data.listing_count }
}

/** Dealer shorthand attested in the latest sweep, commonest first. */
export function getThaiVocabulary(): ThaiTerm[] {
  return data.vocabulary ?? []
}

/** The dealer notations for an item, or an empty list. */
export function getThaiAliases(slug: string): ThaiAlias[] {
  return data.items[slug]?.aliases ?? []
}

/**
 * Every listing photograph we hold for an item, newest sweep only.
 *
 * Deduplicated by URL: two dealers occasionally stock what is visibly the
 * same piece, and the same picture twice reads as a rendering bug.
 */
export function getThaiImages(slug: string): ThaiListing[] {
  const seen = new Set<string>()
  return (data.items[slug]?.listings ?? []).filter(l => {
    if (!l.image || seen.has(l.image)) return false
    seen.add(l.image)
    return true
  })
}

export function sourceLabel(id: string): string {
  return data.sources.find(s => s.id === id)?.label ?? id
}

export function sourceUrl(id: string): string {
  return data.sources.find(s => s.id === id)?.url ?? ''
}

/** Every item that has a Thai figure of either tier, for the /sell index. */
export function getThaiCoveredSlugs(): string[] {
  return Object.keys(data.items)
}

export function hasThaiVariant(slug: string): boolean {
  return !!data.items[slug]?.variant
}

// --- the headline decision -------------------------------------------------

export type PriceBasis = 'thai' | 'thai_family' | 'international'

/** Beyond this the two sources are not describing the same market. */
const DIVERGENCE = 1.6

export interface MarketPrice {
  value: number
  basis: PriceBasis
  /** Dealers behind a Thai figure; listings behind an international one. */
  n: number
  /** Which grade an international figure describes. Thai listings mostly
   *  don't state one, so this is null for them rather than guessed. */
  condition: Condition | null
  range: { min: number; max: number } | null
  /** Family label, when `basis` is 'thai_family'. */
  familyLabel?: string
}

/**
 * The one price a page should lead with.
 *
 * Thai variant data wins outright: same product, same country, the currency
 * the reader pays in.
 *
 * Failing that there is a choice between two imperfect numbers, and which one
 * is less wrong depends on how far apart they are. The international figure
 * is precise about the object and wrong about the country; the Thai family
 * figure is right about the country and vague about the size. Usually the
 * first is close enough. Sometimes it is not:
 *
 *     Louis Vuitton Speedy 25   international 59,750   Thai family 19,900
 *     Louis Vuitton Nano Noé    international 123,500  Thai family 39,900
 *     Prada Galleria Medium     international 43,000   Thai family 18,900
 *
 * A Speedy 25 does not fetch 59,750 baht in Bangkok — that is near its retail
 * price — and leading a Thai reader with it is the same failure as the
 * Datejust, just on handbags. Past DIVERGENCE the site switches to the Thai
 * range and labels it as covering the whole family, because a true bracket
 * that contains the answer beats a precise number that doesn't.
 */
export function marketPrice(item: Item): MarketPrice | null {
  const entry = getThaiEntry(item.slug)
  const variant = entry?.variant
  if (variant) {
    return {
      value: variant.median,
      basis: 'thai',
      n: variant.n,
      condition: null,
      range: { min: variant.min, max: variant.max },
    }
  }

  const intl = headlinePrice(item.price_ranges)
  const family = entry?.family

  if (family && family.median > 0) {
    const intlValue = intl ? getAvgPrice(intl.range) : 0
    const diverges =
      !intlValue ||
      Math.max(intlValue / family.median, family.median / intlValue) >= DIVERGENCE
    if (diverges) {
      return {
        value: family.median,
        basis: 'thai_family',
        n: family.n,
        condition: null,
        range: { min: family.min, max: family.max },
        familyLabel: family.label,
      }
    }
  }

  if (!intl) return null
  return {
    value: getAvgPrice(intl.range),
    basis: 'international',
    n: item.price_samples.length,
    condition: intl.condition,
    range: { min: intl.range.min, max: intl.range.max },
  }
}

/** How much of its retail price the item still commands, as a percentage. */
export function valueRetention(item: Item): number | null {
  const price = marketPrice(item)
  if (!price || item.retail_price_thb <= 0) return null
  return Math.round((price.value / item.retail_price_thb) * 100)
}

/**
 * How far apart the dealers are on the same item.
 *
 * The single most useful number for someone selling: it is the difference
 * between the best and worst quote they are likely to be offered, and the
 * reason to ask more than one shop.
 */
export function dealerSpread(slug: string): { low: number; high: number; ratio: number } | null {
  const entry = getThaiEntry(slug)
  const summary = entry?.variant ?? entry?.family
  if (!summary || summary.min <= 0) return null
  return {
    low: summary.min,
    high: summary.max,
    ratio: Math.round((summary.max / summary.min) * 10) / 10,
  }
}

// --- history ---------------------------------------------------------------

interface HistoryPoint {
  date: string
  items: Record<string, number>
  brands: Record<string, number>
}

// Through `unknown` on purpose. TypeScript types an imported JSON file from
// its literal contents, so the moment two weekly points carried different
// item keys — which is the normal case, since dealers stock different things
// each week — it inferred a union with optional members and refused the
// direct cast. The runtime shape is Record<string, number>; the compiler is
// describing this week's data, not the file's contract.
const points = (history as unknown as { points: HistoryPoint[] }).points ?? []

export interface TrendPoint {
  date: string
  price: number
}

export function getThaiHistory(slug: string): TrendPoint[] {
  return points
    .filter(p => typeof p.items[slug] === 'number')
    .map(p => ({ date: p.date, price: p.items[slug] }))
}

/**
 * Change since the first recorded run, or null until there are two.
 *
 * This file starts almost empty on purpose. No Thai dealer publishes what a
 * bag cost six months ago — their own listing is gone the day it sells — so
 * the trend can only be accumulated, one weekly run at a time, and cannot be
 * back-filled from anywhere. A page that has only one point says so rather
 * than drawing a flat line.
 */
export function thaiTrend(slug: string): { pct: number; from: string; to: string } | null {
  const series = getThaiHistory(slug)
  if (series.length < 2) return null
  const first = series[0]
  const last = series[series.length - 1]
  if (first.price <= 0) return null
  return {
    pct: Math.round(((last.price - first.price) / first.price) * 100),
    from: first.date,
    to: last.date,
  }
}
