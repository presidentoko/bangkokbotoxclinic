import type { Metadata } from 'next'
import { filterHospitals, toLightHospital } from '@/lib/hospitals'
import HospitalCard from '@/components/HospitalCard'
import { loadHospitals, hospitalSlug, districtLabel } from '@/lib/hospitals'
import { getSignals } from '@/lib/hospitalSignals'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'โรงพยาบาลสัตว์ฉุกเฉิน 24 ชั่วโมง — อาการแบบไหนต้องไปทันที',
  description: 'สัตว์เลี้ยงอาการแบบไหนถือว่าฉุกเฉิน ต้องทำอย่างไรระหว่างเดินทาง พร้อมรายชื่อโรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงในกรุงเทพ เบอร์โทรและเส้นทาง ฟรี 100%',
  alternates: { canonical: 'https://www.thailandpethub.com/hospital/emergency' },
  keywords: ['โรงพยาบาลสัตว์ฉุกเฉิน', 'สัตวแพทย์ฉุกเฉิน', 'โรงพยาบาลสัตว์ 24 ชั่วโมง', 'สัตว์เลี้ยงเจ็บป่วยฉุกเฉิน', 'อาการฉุกเฉินสุนัขแมว'],
  openGraph: {
    title: 'โรงพยาบาลสัตว์ฉุกเฉิน 24 ชั่วโมง',
    description: 'อาการแบบไหนต้องไปทันที พร้อมรายชื่อโรงพยาบาลสัตว์เปิด 24 ชม. ในกรุงเทพ',
    url: 'https://www.thailandpethub.com/hospital/emergency',
  },
}

function FaqJsonLd({ count }: { count: number }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สัตว์เลี้ยงอาการแบบไหนถือว่าฉุกเฉิน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาการที่ต้องพาไปโรงพยาบาลสัตว์ทันที ได้แก่ หายใจลำบากหรือหายใจไม่ออก ชักหรือหมดสติ อาเจียนเป็นเลือดหรือถ่ายเป็นเลือด ท้องโป่งผิดปกติ กินสารพิษหรือยาเกินขนาด กระดูกหัก หรือถูกรถชน',
        },
      },
      {
        '@type': 'Question',
        name: 'ระหว่างรอไปโรงพยาบาลสัตว์ฉุกเฉินควรทำอย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'โทรแจ้งโรงพยาบาลล่วงหน้าก่อนเดินทาง วางสัตว์เลี้ยงในกล่องหรือผ้าห่มที่อบอุ่น ห้ามให้น้ำหรืออาหาร ห้ามกดบาดแผลหากมีกระดูกหัก ขับรถไปโดยตรง อย่าเสียเวลาโทรสอบถามหลายที่',
        },
      },
      {
        '@type': 'Question',
        name: 'โรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงมีกี่แห่ง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ThailandPetHub รวบรวมข้อมูลโรงพยาบาลสัตว์ที่เปิดตลอด 24 ชั่วโมงในกรุงเทพและปริมณฑลจำนวน ${count} แห่ง ซึ่งเป็นตัวเลือกแรกเมื่อเกิดเหตุฉุกเฉินนอกเวลาทำการ`,
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

// No source we scrape publishes a reliable "accepts emergencies" flag, so
// `has_emergency` is false for every record — filtering on it rendered an empty
// page (and a FAQ schema advertising "0 แห่ง"). 24-hour operation is the honest,
// verifiable proxy, so that is what we list, and the copy says so. Only the
// best-rated dozen appear here; /hospital/24h remains the full list.
const SHOWN = 12

export default function HospitalEmergencyPage() {
  const open24h = filterHospitals({ is_24h: true })
  const hospitals = [...open24h]
    .sort((a, b) => (b.google_rating ?? 0) - (a.google_rating ?? 0))
    .slice(0, SHOWN)

  // Clinics owners have actually written about an emergency at. 18 of these
  // are not open around the clock, so the 24-hour list cannot surface them —
  // a clinic that takes a bleeding dog at six in the evening is still the
  // answer to somebody's emergency.
  const evidence = loadHospitals()
    .map(h => ({ h, count: getSignals(h.id)?.services?.emergency?.count ?? 0 }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count || (b.h.google_rating ?? 0) - (a.h.google_rating ?? 0))
    .slice(0, 15)

  return (
    <main className="max-w-4xl mx-auto">
      <FaqJsonLd count={open24h.length} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ฉุกเฉิน</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🚨 โรงพยาบาลสัตว์ฉุกเฉิน — เปิด 24 ชั่วโมง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        เมื่อน้องมีอาการวิกฤต สิ่งสำคัญคือหาที่ที่ <strong>เปิดอยู่ตอนนี้</strong> —
        เรารวบรวมโรงพยาบาลสัตว์ที่เปิดตลอด 24 ชั่วโมง <strong>{open24h.length} แห่งในกรุงเทพ</strong>
        พร้อมที่อยู่ เบอร์โทร คะแนน Google และเส้นทาง
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-2xl">
        ด้านล่างคือ {hospitals.length} แห่งที่คะแนนรีวิวสูงสุด — โรงพยาบาลที่เปิด 24 ชั่วโมง
        มักมีสัตวแพทย์เวรพร้อมรับเคสนอกเวลา แต่ควรโทรยืนยันก่อนเดินทางเสมอ
      </p>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
        <p className="font-bold text-red-700 text-sm mb-2">⚠️ อาการที่ต้องไปทันที</p>
        <ul className="text-sm text-red-600 space-y-1 list-none">
          <li>• หายใจลำบาก / หายใจไม่ออก</li>
          <li>• ชัก / หมดสติ / ไม่ตอบสนอง</li>
          <li>• กินสารพิษ / ยาเกินขนาด</li>
          <li>• อาเจียนหรือถ่ายเป็นเลือด</li>
          <li>• ท้องโป่งผิดปกติ / กระดูกหัก</li>
        </ul>
        <a href="/emergency" className="mt-3 inline-block text-xs font-semibold text-red-700 underline">ดูคู่มือฉุกเฉินสัตว์เลี้ยงฉบับเต็ม →</a>
      </div>

      {/* The twelve best-rated 24-hour clinics used to be rendered here as the
          same cards, in the same order, that /hospital/24h already shows. That
          was 82% of this page's text duplicating that one, and it is why
          Search Console files this page under "Duplicate, Google chose
          different canonical than user". The evidence list below answers the
          emergency question better than a rating sort does, and the full
          24-hour directory is one link away. */}

      {/* Ranked by evidence rather than by star rating, which is what makes
          this page something /hospital/24h is not.

          Until now both pages rendered the same cards in the same order — 82%
          of their text was identical, which is why Search Console files this
          one under "Duplicate, Google chose different canonical than user".
          A 4.9 average earned for grooming says nothing about three in the
          morning.

          The count is reviews in which an owner wrote about an emergency at
          that clinic. It is evidence that the place is somewhere emergencies
          are taken, NOT an endorsement: some of those reviews describe being
          turned away, and for a page read at speed that is useful information
          too, which is why the copy says to call ahead rather than drive. The
          reviews themselves, good and bad, are on each clinic's own page. */}
      {evidence.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            ที่ที่มีคนเขียนถึงเคสฉุกเฉินจริง
          </h2>
          <p className="text-sm text-gray-500 mb-1 max-w-2xl leading-relaxed">
            เรียงตามจำนวนรีวิวภาษาไทยที่เจ้าของเล่าถึงเหตุฉุกเฉินที่นั่น ไม่ได้เรียงตามคะแนนดาว
            — คะแนน 4.9 ที่ได้จากการอาบน้ำตัดขนไม่ได้บอกอะไรเกี่ยวกับตีสาม
          </p>
          <p className="text-xs text-amber-700 mb-3 max-w-2xl leading-relaxed">
            ตัวเลขคือ “มีคนเขียนถึงเคสฉุกเฉิน” ไม่ใช่คำรับรอง — บางรีวิวเล่าว่าถูกปฏิเสธเพราะเคสเต็ม
            ซึ่งก็เป็นข้อมูลที่ควรรู้ <strong>โทรแจ้งอาการก่อนออกจากบ้านเสมอ</strong>
          </p>
          <ul className="bg-white border rounded-2xl px-4">
            {evidence.map(({ h, count }) => (
              <li key={h.id} className="py-3 border-b border-gray-100 last:border-0 flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <a href={`/hospital/${hospitalSlug(h)}`} className="font-semibold text-gray-900 hover:text-orange-600">
                    {h.name_th || h.name_en}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {districtLabel(h) ?? ''}
                    {h.is_24h ? ' · เปิด 24 ชม.' : ' · ไม่ได้เปิด 24 ชม. — โทรก่อน'}
                    {h.phone ? ` · ${h.phone}` : ''}
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{count} รีวิว</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <a
        href="/hospital/24h"
        className="inline-block mb-10 text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
      >
        ดูโรงพยาบาลที่เปิด 24 ชั่วโมงทั้งหมด {open24h.length} แห่ง →
      </a>

      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'สัตว์เลี้ยงอาการแบบไหนถือว่าฉุกเฉิน?', a: 'อาการฉุกเฉิน ได้แก่ หายใจลำบาก ชักหรือหมดสติ อาเจียนเป็นเลือดหรือถ่ายเป็นเลือด ท้องโป่งผิดปกติ กินสารพิษ กระดูกหัก หรือถูกรถชน' },
            { q: 'ระหว่างรอไปโรงพยาบาลสัตว์ฉุกเฉินควรทำอย่างไร?', a: 'โทรแจ้งโรงพยาบาลล่วงหน้า วางสัตว์เลี้ยงในที่อบอุ่น ห้ามให้น้ำหรืออาหาร ขับรถไปทันที อย่าเสียเวลาโทรสอบถามหลายที่' },
            { q: 'โรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงมีกี่แห่ง?', a: `ThailandPetHub รวบรวมข้อมูลโรงพยาบาลสัตว์ที่เปิดตลอด 24 ชั่วโมงในกรุงเทพและปริมณฑลจำนวน ${open24h.length} แห่ง ซึ่งเป็นตัวเลือกแรกเมื่อเกิดเหตุฉุกเฉินนอกเวลาทำการ` },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">
          ← ดูโรงพยาบาลทั้งหมด
        </a>
        <a href="/hospital/24h" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
          ⏰ โรงพยาบาล 24 ชั่วโมง →
        </a>
      </div>

      <RelatedGuides current="hospital" count={4} />
    </main>
  )
}
