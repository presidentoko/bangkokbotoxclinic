import fs from 'node:fs'
import path from 'node:path'
import { loadHospitals, hospitalSlug } from '../lib/hospitals'
import licenses from '../data/hospital-licenses.json'
import registry from '../data/vet-registry.json'

/**
 * public/data/vet-registry-search.json — the DLD register, shaped for the
 * client-side search on /hospital/license.
 *
 * Rows are positional arrays to keep the file small (3,861 clinics), and carry
 * no personal names: the register's licensee and operator columns never leave
 * petvet/output. Where a licence was matched to one of the site's clinic pages
 * the slug is attached, so a search result can link to the full page.
 *
 *   [registered name, province, district, class, licence no, slug | ""]
 */

type Rec = { name: string; province: string; district: string; license_class: string; license_no: string }

const slugByLicence = new Map<string, string>()
const byId = new Map(loadHospitals().map(h => [h.id, h]))
for (const [id, lic] of Object.entries((licenses as { licenses: Record<string, { license_no: string }> }).licenses)) {
  const h = byId.get(id)
  if (h) slugByLicence.set(lic.license_no, hospitalSlug(h))
}

const rows = (registry as { records: Rec[] }).records.map(r => [
  r.name, r.province, r.district, r.license_class, r.license_no, slugByLicence.get(r.license_no) ?? '',
])

const out = path.join(__dirname, '..', 'public', 'data', 'vet-registry-search.json')
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, JSON.stringify({ retrieved: (registry as { retrieved: string }).retrieved, rows }))
console.log(`vet-registry-search.json: ${rows.length} rows, ${(fs.statSync(out).size / 1024).toFixed(0)}KB, ${slugByLicence.size} linked`)
