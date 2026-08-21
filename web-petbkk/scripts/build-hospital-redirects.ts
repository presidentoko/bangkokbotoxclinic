/**
 * Writes data/hospital-redirects.json — old slug → new slug for every clinic
 * whose URL changed when Thai transliteration replaced the place-id fallback.
 *
 * 187 URLs move. Regenerating this by hand is how a redirect map goes stale, so
 * it is derived from the same dataset the pages are built from, and the old
 * slug rule is reproduced here verbatim rather than imported — `lib/hospitals`
 * only knows the *current* rule, and this file has to remember the previous one.
 *
 *   npx tsx scripts/build-hospital-redirects.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import hospitals from '../data/hospitals.json'
import { toSlug } from '../lib/slugify'
import { hospitalSlug, loadHospitals } from '../lib/hospitals'
import type { Hospital } from '../lib/types'

// The slug rule as it stood before transliteration: id, then English name, then
// the raw Google place id.
function legacyBase(h: Hospital): string {
  const fromId = toSlug(h.id)
  if (fromId.length > 5) return fromId
  const fromName = toSlug(h.name_en)
  if (fromName.length > 5) return fromName
  return toSlug(h.google_place_id)
}

const counts = new Map<string, number>()
const redirects: Record<string, string> = {}

for (const h of loadHospitals()) {
  const base = legacyBase(h)
  const n = (counts.get(base) ?? 0) + 1
  counts.set(base, n)
  const legacy = n === 1 ? base : `${base}-${n}`
  const current = hospitalSlug(h)
  if (legacy !== current) redirects[legacy] = current
}

// A legacy slug that is also a live slug would create a redirect loop.
const live = new Set(loadHospitals().map(hospitalSlug))
for (const from of Object.keys(redirects)) {
  if (live.has(from)) {
    console.error(`REFUSING: "${from}" is both a legacy and a current slug`)
    process.exit(1)
  }
}

const out = path.join(__dirname, '..', 'data', 'hospital-redirects.json')
fs.writeFileSync(out, JSON.stringify(redirects, null, 0))
console.log(`${Object.keys(redirects).length} redirects -> data/hospital-redirects.json`)
console.log(`total hospitals: ${(hospitals as Hospital[]).length}, live slugs: ${live.size}`)
