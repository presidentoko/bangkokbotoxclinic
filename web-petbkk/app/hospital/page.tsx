import { Suspense } from 'react'
import HospitalListClient from '@/components/HospitalListClient'
import RelatedGuides from '@/components/RelatedGuides'
import { loadHospitals, hospitalSlug } from '@/lib/hospitals'

// The interactive list above is client-rendered (it needs geolocation and URL
// filters), so a crawler's first pass sees only its loading state — which left
// all 500+ detail pages with effectively no inbound internal link. This static
// directory is server-rendered so the hub actually links to what it indexes.
function HospitalDirectory() {
  const hospitals = [...loadHospitals()].sort((a, b) =>
    (a.name_th || a.name_en).localeCompare(b.name_th || b.name_en, 'th')
  )

  return (
    <section className="mt-12 border-t border-gray-100 pt-6">
      <h2 className="text-base font-bold text-gray-800 mb-1">รายชื่อโรงพยาบาลสัตว์ทั้งหมด</h2>
      <p className="text-xs text-gray-400 mb-4">{hospitals.length} แห่งทั่วไทย — เรียงตามตัวอักษร</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5">
        {hospitals.map(h => (
          <li key={h.id}>
            <a
              href={`/hospital/${hospitalSlug(h)}`}
              className="text-xs text-gray-500 hover:text-orange-600 hover:underline line-clamp-1"
            >
              {h.name_th || h.name_en}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function HospitalPage() {
  return (
    <main>
      <h1 className="text-2xl font-black text-gray-900 mb-1">🏥 โรงพยาบาลสัตว์</h1>
      <p className="text-sm text-gray-400 mb-6">ค้นหาโรงพยาบาลสัตว์เลี้ยงใกล้คุณ — 503 แห่งทั่วไทย</p>
      <Suspense fallback={null}>
        <HospitalListClient />
      </Suspense>
      <HospitalDirectory />
      <RelatedGuides current="hospital" count={4} />
    </main>
  )
}
