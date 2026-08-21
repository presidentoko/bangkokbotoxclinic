import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import HospitalCard from '@/components/HospitalCard'
import RelatedGuides from '@/components/RelatedGuides'
import { getDistrictBySlug, getIndexableDistricts } from '@/lib/districts'
import { hospitalSlug, toLightHospital } from '@/lib/hospitals'
import SponsorSlot from '@/components/SponsorSlot'
import AdSlot from '@/components/AdSlot'
import type { DistrictData } from '@/lib/districts'

const SITE = 'https://www.thailandpethub.com'

export const dynamicParams = false

export function generateStaticParams() {
  return getIndexableDistricts().map(d => ({ district: d.district.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ district: string }> }): Promise<Metadata> {
  const { district } = await params
  const d = getDistrictBySlug(district)
  if (!d) return { title: 'ไม่พบพื้นที่' }

  const { th, en } = d.district
  const count = d.hospitals.length
  const open24h = d.hospitals.filter(h => h.is_24h).length
  const url = `${SITE}/hospital/area/${district}`

  return {
    title: `โรงพยาบาลสัตว์ เขต${th} — ${count} แห่ง คลินิกสัตว์ใกล้ฉัน`,
    description:
      `รายชื่อโรงพยาบาลสัตว์และคลินิกสัตว์ในเขต${th} กรุงเทพ ${count} แห่ง` +
      `${open24h ? ` (เปิด 24 ชั่วโมง ${open24h} แห่ง)` : ''} ` +
      `พร้อมคะแนน Google เบอร์โทร ที่อยู่ และเส้นทาง`,
    keywords: [
      `โรงพยาบาลสัตว์ ${th}`, `คลินิกสัตว์ ${th}`, `คลินิกสัตว์ใกล้ฉัน ${th}`,
      `สัตวแพทย์ ${th}`, `vet ${en} Bangkok`, `animal hospital ${en}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `โรงพยาบาลสัตว์ เขต${th} — ${count} แห่ง`,
      description: `คลินิกสัตว์ในเขต${th} พร้อมคะแนน Google และเส้นทาง`,
      url,
      type: 'website',
    },
  }
}

function DistrictJsonLd({ d, slug }: { d: DistrictData; slug: string }) {
  const { th } = d.district
  const url = `${SITE}/hospital/area/${slug}`
  const open24h = d.hospitals.filter(h => h.is_24h)
  const rated = d.hospitals.filter(h => h.google_rating != null)
  const avg = rated.length
    ? (rated.reduce((s, h) => s + (h.google_rating ?? 0), 0) / rated.length).toFixed(2)
    : null

  const graph = [
    {
      '@type': 'CollectionPage',
      '@id': `${url}#page`,
      url,
      name: `โรงพยาบาลสัตว์ เขต${th}`,
      inLanguage: 'th-TH',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@type': 'Place', name: `เขต${th} กรุงเทพมหานคร` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: `${SITE}/hospital` },
        { '@type': 'ListItem', position: 3, name: `เขต${th}` },
      ],
    },
    {
      '@type': 'ItemList',
      '@id': `${url}#list`,
      name: `โรงพยาบาลสัตว์ในเขต${th}`,
      numberOfItems: d.hospitals.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: d.hospitals.map((h, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/hospital/${hospitalSlug(h)}`,
        name: h.name_th,
      })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `เขต${th} มีโรงพยาบาลสัตว์กี่แห่ง?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `ThailandPetHub รวบรวมโรงพยาบาลสัตว์และคลินิกสัตว์ที่มีที่อยู่อยู่ในเขต${th} ได้ ${d.hospitals.length} แห่ง` +
              `${avg ? ` คะแนน Google เฉลี่ย ${avg} จาก 5 ดาว` : ''}` +
              `${open24h.length ? ` และมี ${open24h.length} แห่งที่เปิดตลอด 24 ชั่วโมง` : ''}`,
          },
        },
        {
          '@type': 'Question',
          name: `โรงพยาบาลสัตว์ในเขต${th} ที่คะแนนรีวิวสูงที่สุดคือที่ไหน?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: d.hospitals.slice(0, 3)
              .map(h => `${h.name_th} (${h.google_rating?.toFixed(1) ?? '—'} ดาว${h.google_review_count ? ` จาก ${h.google_review_count.toLocaleString()} รีวิว` : ''})`)
              .join(', '),
          },
        },
        ...(open24h.length ? [{
          '@type': 'Question',
          name: `เขต${th} มีโรงพยาบาลสัตว์เปิด 24 ชั่วโมงไหม?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `มี ${open24h.length} แห่ง ได้แก่ ${open24h.slice(0, 5).map(h => h.name_th).join(', ')}`,
          },
        }] : []),
      ],
    },
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  )
}

export default async function DistrictPage({ params }: { params: Promise<{ district: string }> }) {
  const { district } = await params
  const d = getDistrictBySlug(district)
  if (!d) notFound()

  const { th, en } = d.district
  const open24h = d.hospitals.filter(h => h.is_24h)
  const rated = d.hospitals.filter(h => h.google_rating != null)
  const avg = rated.length
    ? (rated.reduce((s, h) => s + (h.google_rating ?? 0), 0) / rated.length).toFixed(2)
    : null
  const others = getIndexableDistricts().filter(x => x.district.slug !== district)

  return (
    <main className="max-w-4xl mx-auto">
      <DistrictJsonLd d={d} slug={district} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">เขต{th}</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">
        🏥 โรงพยาบาลสัตว์ เขต{th}
      </h1>

      {/* Answer-first: a self-contained factual paragraph for snippets and
          answer engines, before any interactive or visual element. */}
      <p className="text-sm text-gray-700 leading-relaxed mb-4 max-w-2xl">
        เขต{th} ({en}) มี<strong>โรงพยาบาลสัตว์และคลินิกสัตว์ {d.hospitals.length} แห่ง</strong>
        {avg ? <> คะแนน Google เฉลี่ย <strong>{avg}</strong> จาก 5 ดาว</> : null}
        {open24h.length ? <> และมี <strong>{open24h.length} แห่งที่เปิดตลอด 24 ชั่วโมง</strong></> : null}
        {' '}ทุกแห่งแสดงเบอร์โทร ที่อยู่ จำนวนรีวิว และลิงก์เส้นทาง Google Maps ฟรี
      </p>

      {open24h.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
          <p className="font-bold text-red-700 text-sm mb-1">🚨 เปิด 24 ชั่วโมงในเขตนี้</p>
          <p className="text-sm text-red-600">
            {open24h.map((h, i) => (
              <span key={h.id}>
                {i > 0 && ' · '}
                <a href={`/hospital/${hospitalSlug(h)}`} className="underline hover:no-underline">{h.name_th}</a>
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Above the list, never inside it: the ranking below is by review score
          and stays unbuyable. See /advertise. */}
      <SponsorSlot slot={`district:${d.district.slug}`} className="mb-5" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {d.hospitals.map(h => <HospitalCard key={h.id} hospital={toLightHospital(h)} />)}
      </div>

      <AdSlot slot="1234567890" format="inline" />

      {d.nearby.length > 0 && (
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-800 mb-1">โรงพยาบาลสัตว์ใกล้เขต{th}</h2>
          <p className="text-xs text-gray-400 mb-3">
            อยู่นอกเขต{th} แต่ใกล้ — วัดจากระยะทางจริง เรียงจากใกล้ที่สุด
          </p>
          <ol className="space-y-1.5">
            {d.nearby.map(({ hospital: h, distKm }) => (
              <li key={h.id} className="flex items-baseline gap-2 text-sm">
                <a href={`/hospital/${hospitalSlug(h)}`} className="text-gray-700 hover:text-orange-600 hover:underline">
                  {h.name_th}
                </a>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {distKm < 1 ? `${Math.round(distKm * 1000)} ม.` : `${distKm.toFixed(1)} กม.`}
                  {h.district ? ` · เขต${h.district}` : ''}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="border-t border-gray-100 pt-6 mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-3">ดูเขตอื่นในกรุงเทพ</h2>
        <div className="flex flex-wrap gap-2">
          {others.map(o => (
            <a
              key={o.district.slug}
              href={`/hospital/area/${o.district.slug}`}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors"
            >
              เขต{o.district.th} <span className="text-gray-400">{o.hospitals.length}</span>
            </a>
          ))}
        </div>
      </section>

      <div className="flex gap-3 mb-6">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">
          ← ดูทั้งกรุงเทพ
        </a>
        <a href="/hospital/24h" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
          🕐 เปิด 24 ชม. ทั้งหมด →
        </a>
      </div>

      <RelatedGuides current="hospital" count={4} />
    </main>
  )
}
