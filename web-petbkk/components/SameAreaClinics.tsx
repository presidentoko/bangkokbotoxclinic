import type { Hospital } from '@/lib/types'
import { loadHospitals, hospitalSlug, districtLabel } from '@/lib/hospitals'
import { districtForHospital } from '@/lib/districts'
import { isIndexableHospital } from '@/lib/indexing'
import { CITY_META } from '@/lib/cityHub'

/**
 * Other clinics in the same เขต / อำเภอ, and the way up to the area's hub.
 *
 * Until 2026-10-26 a clinic page linked to exactly three other clinics (the
 * NearbyHospitals strip) and not at all to its district page, so the clinic
 * graph was a set of near-dead ends. Search Console still lists 511 clinic URLs
 * as "Discovered - currently not indexed": known to Google, never fetched, which
 * is what too few internal links looks like from the outside.
 *
 * The area comes from the clinic's own address (districtLabel), never from a
 * coordinate — 92% of the scraped coordinates are grid probe points, not
 * clinics. Linked clinics are the indexable ones, most-reviewed first: a link
 * spent on a page Google has been asked not to index is a link wasted.
 */

const MAX = 8
const MIN = 2

let byArea: Map<string, Hospital[]> | null = null

function areaIndex(): Map<string, Hospital[]> {
  if (byArea) return byArea
  byArea = new Map()
  for (const h of loadHospitals()) {
    const area = districtLabel(h)
    if (!area) continue
    if (!isIndexableHospital(h, hospitalSlug(h))) continue
    const key = `${h.city}|${area}`
    const list = byArea.get(key) ?? []
    list.push(h)
    byArea.set(key, list)
  }
  for (const list of byArea.values()) {
    list.sort((a, b) => (b.google_review_count ?? 0) - (a.google_review_count ?? 0))
  }
  return byArea
}

export default function SameAreaClinics({ hospital }: { hospital: Hospital }) {
  const area = districtLabel(hospital)
  if (!area) return null
  const others = (areaIndex().get(`${hospital.city}|${area}`) ?? [])
    .filter(h => h.id !== hospital.id)
    .slice(0, MAX)

  const hub = districtForHospital(hospital)
  const cityHub = hospital.city === 'bangkok'
    ? { href: '/hospital', th: 'กรุงเทพ' }
    : CITY_META[hospital.city as keyof typeof CITY_META]
      ? { href: `/hospital/${CITY_META[hospital.city as keyof typeof CITY_META].slug}`, th: CITY_META[hospital.city as keyof typeof CITY_META].th }
      : null

  if (others.length < MIN && !hub) return null

  return (
    <section className="mb-6">
      <h2 className="font-semibold mb-2">โรงพยาบาลสัตว์อื่นใน{area}</h2>
      {others.length >= MIN && (
        <ul className="flex flex-wrap gap-2 mb-3">
          {others.map(h => (
            <li key={h.id}>
              <a
                href={`/hospital/${hospitalSlug(h)}`}
                className="inline-block px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                {h.name_th || h.name_en}
                {h.google_rating != null && <span className="text-gray-400"> · {h.google_rating.toFixed(1)}★</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm">
        {hub ? (
          <a href={`/hospital/area/${hub.slug}`} className="font-semibold text-blue-600 hover:underline">
            ดูโรงพยาบาลสัตว์ทั้งหมดในเขต{hub.th} →
          </a>
        ) : cityHub ? (
          <a href={cityHub.href} className="font-semibold text-blue-600 hover:underline">
            ดูโรงพยาบาลสัตว์ทั้งหมดใน{cityHub.th} →
          </a>
        ) : null}
      </p>
    </section>
  )
}
