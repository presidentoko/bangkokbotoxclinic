import fs from 'node:fs'
import path from 'node:path'
import { loadAllHospitals, hospitalSlug, isPublishedHospital } from '../lib/hospitals'

/**
 * data/hospital-excluded-redirects.json — where an unpublished directory entry's
 * URL should go now.
 *
 * The 121 entries that are not veterinary facilities had live, crawled URLs.
 * Dropping them from the data alone would turn those into 404s; each one
 * redirects to its city's clinic list instead, which is the page a visitor who
 * landed on it actually wanted.
 */
const CITY_HUB: Record<string, string> = {
  bangkok: '/hospital',
  chiangmai: '/hospital/chiangmai',
  pattaya: '/hospital/pattaya',
  phuket: '/hospital/phuket',
}

const out: Record<string, string> = {}
for (const h of loadAllHospitals()) {
  if (isPublishedHospital(h)) continue
  out[hospitalSlug(h)] = CITY_HUB[h.city] ?? '/hospital'
}

const file = path.join(__dirname, '..', 'data', 'hospital-excluded-redirects.json')
fs.writeFileSync(file, JSON.stringify(out, null, 1))
console.log(`hospital-excluded-redirects.json: ${Object.keys(out).length} slugs`)
