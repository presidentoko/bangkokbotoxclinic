/**
 * Generates data/hospital-index.json — the projection of hospitals.json that
 * client components actually read.
 *
 * `HospitalCard` is a client component and calls `hospitalSlug()`, which
 * imports `lib/hospitals` and therefore the whole 431 KB dataset. Every visitor
 * to /hospital, /hospital/24h, /hospital/emergency or any district page
 * downloads all of it — including five price fields that are null on all 496
 * records (61 KB), `has_surgery` and `has_emergency` which are constant
 * (20 KB), the Google place ids (28 KB) and the scrape timestamps (13 KB).
 * None of that is rendered anywhere in the browser.
 *
 * Precomputing the slug here is the part that actually breaks the dependency:
 * with a `slug` on each row the card no longer needs the slug map, so it no
 * longer needs the full dataset. The algorithm must stay identical to
 * `lib/hospitals.ts` or URLs will diverge, so it is imported rather than copied.
 *
 *   npx tsx scripts/build-hospital-index.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { loadHospitals, hospitalSlug } from '../lib/hospitals'
import type { HospitalLight } from '../lib/types'

const index: HospitalLight[] = loadHospitals().map(h => ({
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
}))

const out = path.join(__dirname, '..', 'data', 'hospital-index.json')
fs.writeFileSync(out, JSON.stringify(index))

const full = fs.statSync(path.join(__dirname, '..', 'data', 'hospitals.json')).size
const light = fs.statSync(out).size
console.log(
  `hospital-index.json: ${index.length} rows, ${(light / 1024).toFixed(0)}KB ` +
  `(full data is ${(full / 1024).toFixed(0)}KB)`,
)

const dupes = index.length - new Set(index.map(h => h.slug)).size
if (dupes > 0) {
  console.error(`ABORT: ${dupes} duplicate slugs`)
  process.exit(1)
}
