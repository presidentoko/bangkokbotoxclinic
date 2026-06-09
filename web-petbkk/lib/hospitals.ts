import type { Hospital, HospitalFilters } from './types'
import rawData from '../data/hospitals.json'

export function loadHospitals(): Hospital[] {
  return rawData as Hospital[]
}

export function getHospitalBySlug(slug: string): Hospital | null {
  return loadHospitals().find(h => h.id === slug) ?? null
}

export function filterHospitals(filters: HospitalFilters = {}): Hospital[] {
  let list = loadHospitals()
  if (filters.is_24h) list = list.filter(h => h.is_24h)
  if (filters.has_emergency) list = list.filter(h => h.has_emergency)
  if (filters.has_surgery) list = list.filter(h => h.has_surgery)
  return list
}

export function getNearbyHospitals(hospital: Hospital, count = 3): Hospital[] {
  function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }
  return loadHospitals()
    .filter(h => h.id !== hospital.id)
    .map(h => ({ h, dist: haversine(hospital.lat, hospital.lng, h.lat, h.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count)
    .map(({ h }) => h)
}
