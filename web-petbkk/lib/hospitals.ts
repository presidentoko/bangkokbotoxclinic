import type { Hospital, HospitalFilters } from './types'

let rawData: Hospital[] = []
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  rawData = require('../data/hospitals.json') as Hospital[]
} catch {
  rawData = []
}

export function loadHospitals(): Hospital[] {
  return rawData
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
