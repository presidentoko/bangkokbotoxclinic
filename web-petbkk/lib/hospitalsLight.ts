import type { HospitalLight, HospitalFilters } from './types'
import lightData from '../data/hospital-index.json'

/**
 * The client-side hospital dataset.
 *
 * Importing this instead of `lib/hospitals` is what keeps the full 431 KB
 * hospitals.json out of the browser bundle — see scripts/build-hospital-index.ts
 * for what is dropped and why. Anything running on the server should keep using
 * `lib/hospitals`, which has the complete records.
 */
export function loadHospitalsLight(): HospitalLight[] {
  return lightData as HospitalLight[]
}

export function filterHospitalsLight(filters: HospitalFilters = {}): HospitalLight[] {
  let list = loadHospitalsLight()
  if (filters.is_24h) list = list.filter(h => h.is_24h)
  return list
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
