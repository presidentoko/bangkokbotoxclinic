import type { Hospital, HospitalFilters } from './types'
import rawData from '../data/hospitals.json'
import { toSlug } from './slugify'

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

// 149 of the scraped records carry a leading " · " separator left over from the
// listing markup the address was lifted out of. It leaked into <meta description>
// (…รีวิว) ·  · Henri Dunant Rd) and onto the page, so strip it once at load
// rather than at each of the dozen render sites.
let cleaned: Hospital[] | null = null

export function loadHospitals(): Hospital[] {
  if (cleaned) return cleaned
  cleaned = (rawData as Hospital[]).map(h => {
    const address = (h.address ?? '').replace(/^[\s·•\-,|]+/, '').trim()
    return address === h.address ? h : { ...h, address }
  })
  return cleaned
}

function baseHospitalSlug(h: Hospital): string {
  const fromId = toSlug(h.id)
  if (fromId.length > 5) return fromId
  const fromName = toSlug(h.name_en)
  if (fromName.length > 5) return fromName
  return toSlug(h.google_place_id)
}

// A handful of hospitals share the same ASCII slug once Thai-only branch names
// are stripped (e.g. "Animal Clinic" vs "Animal Clinic โชคชัยรักษาสัตว์" both
// collapse to "animal-clinic"). Disambiguate collisions deterministically so
// getHospitalBySlug() never silently shadows a second hospital behind the first.
let slugMap: WeakMap<Hospital, string> | null = null

function getSlugMap(): WeakMap<Hospital, string> {
  if (slugMap) return slugMap
  const map = new WeakMap<Hospital, string>()
  const counts = new Map<string, number>()
  for (const h of loadHospitals()) {
    const base = baseHospitalSlug(h)
    const n = (counts.get(base) ?? 0) + 1
    counts.set(base, n)
    map.set(h, n === 1 ? base : `${base}-${n}`)
  }
  slugMap = map
  return map
}

export function hospitalSlug(h: Hospital): string {
  return getSlugMap().get(h) ?? baseHospitalSlug(h)
}

export function getHospitalBySlug(slug: string): Hospital | null {
  return loadHospitals().find(h => hospitalSlug(h) === slug) ?? null
}

export function filterHospitals(filters: HospitalFilters = {}): Hospital[] {
  let list = loadHospitals()
  if (filters.is_24h) list = list.filter(h => h.is_24h)
  if (filters.has_emergency) list = list.filter(h => h.has_emergency)
  if (filters.has_surgery) list = list.filter(h => h.has_surgery)
  return list
}

export function getNearbyHospitals(hospital: Hospital, count = 3): Array<{ hospital: Hospital; distKm: number }> {
  return loadHospitals()
    .filter(h => h.id !== hospital.id)
    .map(h => ({ hospital: h, distKm: haversineKm(hospital.lat, hospital.lng, h.lat, h.lng) }))
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, count)
}
