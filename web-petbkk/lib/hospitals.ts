import type { Hospital, HospitalFilters, HospitalLight } from './types'
import rawData from '../data/hospitals.json'
import { toSlug } from './slugify'
import { romanizeThai, trimSlug } from './thai'

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

/**
 * Bangkok only. `/hospital`, `/hospital/24h`, `/hospital/emergency` and the
 * เขต-district pages all print Bangkok-specific copy ("โรงพยาบาลสัตว์ในกรุงเทพ
 * N แห่ง") and count on their data being Bangkok-only; once Chiang Mai,
 * Pattaya and Phuket records share the same file, calling `loadHospitals()`
 * from any of those pages would fold another city's clinics into a count and
 * a claim that says "Bangkok". Detail-page generation and the sitemap are
 * deliberately NOT filtered — every city's clinics still get their own
 * indexable page, just not (yet) a city-specific hub.
 */
export function loadBangkokHospitals(): Hospital[] {
  return loadHospitals().filter(h => h.city === 'bangkok')
}

/**
 * A hospital's URL segment.
 *
 * The place-id fallback used to fire for 188 of the 496 clinics, because their
 * only name is Thai and `toSlug()` strips non-ASCII down to nothing — leaving
 * URLs like `/hospital/0x30e2994f708a55310x7ded115b277a88b3`. Transliterating
 * the Thai name first turns those into `/hospital/rong-phayaban-sat-phraram-4`:
 * readable, shareable, and carrying the words a Thai searcher actually types.
 *
 * A hex id is also explicitly rejected when it arrives via `h.id`, since the
 * scraper writes the place id there for exactly the same records.
 */
function baseHospitalSlug(h: Hospital): string {
  const fromId = toSlug(h.id)
  if (fromId.length > 5 && !/^0x[0-9a-f]/.test(fromId)) return fromId
  const fromName = toSlug(h.name_en)
  if (fromName.length > 5) return fromName
  const romanized = trimSlug(romanizeThai(h.name_th || h.name_en))
  if (romanized.length > 5) return romanized
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

/**
 * Narrow a full record to the shape `HospitalCard` takes. Server components
 * hold complete `Hospital` objects; the card is a client component and must not
 * pull in the slug map to build its own URL.
 */
export function toLightHospital(h: Hospital): HospitalLight {
  return {
    id: h.id,
    slug: hospitalSlug(h),
    name_th: h.name_th,
    name_en: h.name_en,
    address: h.address,
    lat: h.lat,
    lng: h.lng,
    phone: h.phone,
    is_24h: h.is_24h,
    google_rating: h.google_rating,
    google_review_count: h.google_review_count,
    ...(h.district ? { district: h.district } : {}),
  }
}

export function getHospitalBySlug(slug: string): Hospital | null {
  return loadHospitals().find(h => hospitalSlug(h) === slug) ?? null
}

// Both current callers (/hospital/24h, /hospital/emergency) print Bangkok-only
// copy, so this filters from loadBangkokHospitals() rather than all cities.
export function filterHospitals(filters: HospitalFilters = {}): Hospital[] {
  let list = loadBangkokHospitals()
  if (filters.is_24h) list = list.filter(h => h.is_24h)
  if (filters.has_emergency) list = list.filter(h => h.has_emergency)
  if (filters.has_surgery) list = list.filter(h => h.has_surgery)
  return list
}

/**
 * 463 of the 503 records (92%) sit on a coordinate shared with at least one
 * other hospital, because `petvet/transform.py` writes `first_seen_lat/lng` —
 * the grid *probe point* the clinic was discovered from — as the clinic's own
 * location. 99 records share the grid centre 13.74629,100.53005 alone, among
 * them clinics that are genuinely in Thonburi, Pathum Wan and Bangkok Noi.
 *
 * A shared coordinate is therefore a reliable "this is the grid cell, not the
 * clinic" marker. Everything that would otherwise assert a location — the
 * GeoCoordinates JSON-LD, the map link, the "0.0 km away" labels — checks this
 * first, so the site stays silent about a location rather than stating a wrong
 * one. Real coordinates need a Places API (New) backfill keyed on place_id.
 */
let preciseIds: Set<string> | null = null

function getPreciseIds(): Set<string> {
  if (preciseIds) return preciseIds
  const counts = new Map<string, number>()
  for (const h of loadHospitals()) {
    const key = `${h.lat.toFixed(5)},${h.lng.toFixed(5)}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  preciseIds = new Set(
    loadHospitals()
      .filter(h => counts.get(`${h.lat.toFixed(5)},${h.lng.toFixed(5)}`) === 1)
      .map(h => h.id)
  )
  return preciseIds
}

export function hasPreciseCoord(h: Hospital): boolean {
  return Boolean(h.lat && h.lng) && getPreciseIds().has(h.id)
}

/**
 * Related hospitals. `distKm` is only returned when *both* endpoints have a
 * trustworthy coordinate — otherwise the caller gets null and renders the card
 * without a distance, instead of the "0.0 km" that 99 co-located records used
 * to produce.
 */
export function getNearbyHospitals(
  hospital: Hospital,
  count = 3,
): Array<{ hospital: Hospital; distKm: number | null }> {
  const anchorPrecise = hasPreciseCoord(hospital)
  const others = loadHospitals().filter(h => h.id !== hospital.id)

  if (!anchorPrecise) {
    // No usable origin, so "nearby" is unknowable. Fall back to the strongest
    // alternatives by rating — still a useful card, just not a distance claim.
    return others
      .filter(h => h.google_rating != null)
      .sort((a, b) => (b.google_rating ?? 0) - (a.google_rating ?? 0))
      .slice(0, count)
      .map(h => ({ hospital: h, distKm: null }))
  }

  return others
    .filter(h => hasPreciseCoord(h))
    .map(h => ({ hospital: h, distKm: haversineKm(hospital.lat, hospital.lng, h.lat, h.lng) }))
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, count)
}
