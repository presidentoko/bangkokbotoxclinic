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

export function loadHospitals(): Hospital[] {
  return rawData as Hospital[]
}

export function hospitalSlug(h: Hospital): string {
  const fromId = toSlug(h.id)
  if (fromId.length > 5) return fromId
  const fromName = toSlug(h.name_en)
  if (fromName.length > 5) return fromName
  return toSlug(h.google_place_id)
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
