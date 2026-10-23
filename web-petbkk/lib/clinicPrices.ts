import raw from '@/data/clinic-prices.json'

/**
 * Prices clinics publish on their own websites, read by hand and re-checked
 * against the source page (petvet/clinic_prices.py --verify).
 *
 * The rule that makes these publishable: a price is never shown without what
 * it includes. Talingchan's 3,000 baht cat neuter is before VAT, a hospital fee
 * and a pre-op blood test; UVET's 4,300 includes everything; Pet Friends' 5,500
 * includes three nights' stay. Side by side without that, the cheapest-looking
 * number is often not the cheapest visit — so `includes` / `excludes` travel
 * with every figure, and so does the link to the clinic's own page.
 */
export type PriceKind = 'list' | 'promo' | 'from' | 'range'

export interface PriceItem {
  service: string
  service_th: string
  price: number
  price_max?: number
  regular?: number
  kind: PriceKind
  note?: string
  includes?: string
  excludes?: string
  url: string
  quote: string
  source?: string
  chain?: boolean
}

export interface PriceSource {
  domain: string
  name: string
  chain: boolean
  clinics: string[]
  items: PriceItem[]
}

const file = raw as {
  checked: string
  services: Record<string, string>
  sources: PriceSource[]
  clinics: Record<string, PriceItem[]>
}

export const PRICES_CHECKED = file.checked
export const PRICE_SERVICES = file.services

export function getClinicPrices(hospitalId: string): PriceItem[] | null {
  const items = file.clinics[hospitalId]
  return items && items.length ? items : null
}

export function priceSources(): PriceSource[] {
  return file.sources
}

export const KIND_TH: Record<PriceKind, string> = {
  list: 'ราคาที่ประกาศ',
  promo: 'โปรโมชั่น',
  from: 'ราคาเริ่มต้น',
  range: 'ช่วงราคาโดยประมาณ',
}

export function formatPrice(it: Pick<PriceItem, 'price' | 'price_max' | 'kind'>): string {
  const p = it.price.toLocaleString('th-TH')
  if (it.kind === 'range' && it.price_max) return `${p}–${it.price_max.toLocaleString('th-TH')} บาท`
  if (it.kind === 'from') return `${p}+ บาท`
  return `${p} บาท`
}
