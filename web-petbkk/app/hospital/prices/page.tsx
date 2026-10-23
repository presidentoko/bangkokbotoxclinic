import type { Metadata } from 'next'
import { loadHospitals, hospitalSlug } from '@/lib/hospitals'
import { priceSources, PRICES_CHECKED, KIND_TH, formatPrice, PRICE_SERVICES, type PriceItem } from '@/lib/clinicPrices'

/**
 * /hospital/prices — what clinics publish for the same treatment, side by side.
 *
 * The number Thai owners search for most and that no one publishes in one
 * place. Every figure here is from the clinic's own website, read by hand and
 * re-checked against the source page (petvet/clinic_prices.py --verify), and is
 * shown with what it includes, because the comparison is meaningless without
 * it: the lowest number in a row is often the one that leaves out the blood
 * test, the VAT and the hospital fee.
 */

const SITE = 'https://www.thailandpethub.com'

export const metadata: Metadata = {
  title: 'ค่าทำหมันแมว ค่าทำหมันสุนัข ค่าวัคซีน — ราคาที่โรงพยาบาลสัตว์ประกาศเอง',
  description:
    'เทียบราคาทำหมันแมว ทำหมันสุนัข วัคซีน และตรวจสุขภาพ จากเว็บไซต์ของโรงพยาบาลสัตว์โดยตรง ' +
    'พร้อมระบุว่าราคารวมอะไร ไม่รวมอะไร และลิงก์ไปยังหน้าต้นทาง ตรวจสอบล่าสุด ต.ค. 2569',
  alternates: { canonical: `${SITE}/hospital/prices` },
}

const ORDER = [
  'neuter_cat_m', 'neuter_cat_f', 'neuter_dog_m', 'neuter_dog_f',
  'neuter_rabbit_m', 'neuter_rabbit_f',
  'vaccine_cat_combo', 'vaccine_dog_combo', 'vaccine_rabies', 'vaccine_first_year',
  'checkup', 'dental',
]

export default function PricesPage() {
  const byId = new Map(loadHospitals().map(h => [h.id, h]))
  const sources = priceSources()

  // One row per (source, item); the clinic link goes to the first published
  // branch the source covers.
  const rows: Record<string, Array<{ name: string; href: string | null; chain: boolean; branches: number; it: PriceItem }>> = {}
  for (const s of sources) {
    const live = s.clinics.filter(id => byId.has(id))
    const first = live[0] ? byId.get(live[0])! : null
    for (const it of s.items) {
      if (!ORDER.includes(it.service)) continue
      ;(rows[it.service] ??= []).push({
        name: s.name,
        href: first ? `/hospital/${hospitalSlug(first)}` : null,
        chain: s.chain,
        branches: live.length,
        it,
      })
    }
  }
  for (const k of Object.keys(rows)) rows[k].sort((a, b) => a.it.price - b.it.price)

  const covered = new Set(sources.flatMap(s => s.clinics.filter(id => byId.has(id)))).size

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'ค่าทำหมันแมว ค่าทำหมันสุนัข ค่าวัคซีน — ราคาที่โรงพยาบาลสัตว์ประกาศเอง',
        dateModified: PRICES_CHECKED,
        author: { '@type': 'Organization', name: 'ThailandPetHub', url: SITE },
        mainEntityOfPage: `${SITE}/hospital/prices`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: `${SITE}/hospital` },
          { '@type': 'ListItem', position: 3, name: 'ราคา' },
        ],
      },
    ],
  }

  return (
    <main className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ราคา</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">
        ค่าทำหมัน ค่าวัคซีน ค่าตรวจสุขภาพ: ราคาที่โรงพยาบาลสัตว์ประกาศเอง
      </h1>
      <p className="text-gray-600 leading-relaxed mb-3">
        โรงพยาบาลสัตว์ในไทยส่วนใหญ่ไม่ประกาศราคา เราเปิดเว็บไซต์ของคลินิกทุกแห่งที่มีเว็บไซต์ของตัวเอง
        แล้วพบว่ามี <strong>{sources.length} แห่ง</strong> (ครอบคลุม {covered} สาขา) ที่ประกาศราคาไว้
        ทุกตัวเลขในหน้านี้อ่านจากหน้าเว็บนั้นโดยตรง และตรวจซ้ำกับหน้าต้นทางเมื่อ {PRICES_CHECKED}
      </p>
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 text-sm text-amber-900 leading-relaxed">
        <strong>อย่าเทียบแค่ตัวเลข</strong> — ราคาทำหมันแมวตัวผู้ 3,000 บาทที่ไม่รวมตรวจเลือด VAT และค่าโรงพยาบาล
        อาจแพงกว่า 4,300 บาทที่รวมทุกอย่างแล้ว เราจึงระบุ “รวม” และ “ไม่รวม” ไว้ใต้ทุกราคา
        ตามที่คลินิกเขียนไว้ และราคาเปลี่ยนได้ ควรสอบถามก่อนนัดเสมอ
      </div>

      {ORDER.filter(k => rows[k]?.length).map(k => (
        <section key={k} className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{PRICE_SERVICES[k]}</h2>
          <ul className="bg-white border rounded-2xl divide-y">
            {rows[k].map((r, i) => (
              <li key={i} className="p-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm">
                    {r.href ? (
                      <a href={r.href} className="font-semibold text-gray-900 hover:text-orange-600">{r.name}</a>
                    ) : (
                      <span className="font-semibold text-gray-900">{r.name}</span>
                    )}
                    {r.chain && r.branches > 1 && <span className="text-xs text-gray-400"> · เครือ {r.branches} สาขา</span>}
                    {r.it.note && <span className="text-xs text-gray-500"> · {r.it.note}</span>}
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="text-sm font-bold text-gray-900 tabular-nums">{formatPrice(r.it)}</span>
                    {r.it.regular && <span className="block text-xs text-gray-400 line-through tabular-nums">{r.it.regular.toLocaleString('th-TH')} บาท</span>}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="inline-block px-1.5 py-0.5 mr-1.5 rounded bg-gray-100 text-gray-600">{KIND_TH[r.it.kind]}</span>
                  {r.it.includes && <>รวม: {r.it.includes}</>}
                  {r.it.includes && r.it.excludes && ' · '}
                  {r.it.excludes && <span className="text-amber-700">ไม่รวม: {r.it.excludes}</span>}
                  {' '}
                  <a href={r.it.url} target="_blank" rel="noopener nofollow" className="text-blue-600 hover:underline">ที่มา</a>
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="bg-gray-50 border rounded-2xl p-5 mb-8 text-sm text-gray-600 leading-relaxed">
        <h2 className="text-base font-bold text-gray-900 mb-2">เก็บข้อมูลอย่างไร</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>เปิดเว็บไซต์ของคลินิกทุกแห่งในฐานข้อมูลที่มีเว็บไซต์ของตัวเอง ({'79'} โดเมน) รวมถึงหน้าที่ไม่ได้ลิงก์จากหน้าแรกแต่อยู่ในแผนผังเว็บไซต์</li>
          <li>อ่านทีละรายการโดยคน ไม่ใช่ดึงตัวเลขอัตโนมัติ เพราะต้องรู้ว่าราคานั้นเป็นโปรโมชั่น ราคาเริ่มต้น หรือรวมอะไรบ้าง</li>
          <li>ทุกครั้งที่อัปเดต ระบบเปิดหน้าต้นทางอีกครั้งและตรวจว่าตัวเลขยังอยู่ ถ้าคลินิกเปลี่ยนราคา ราคาเก่าจะไม่ค้างอยู่ที่นี่</li>
          <li>เครือโรงพยาบาลขนาดใหญ่หลายแห่งไม่ประกาศราคาเลย การที่คลินิกไม่อยู่ในหน้านี้ไม่ได้แปลว่าแพงหรือถูก</li>
        </ul>
        <p className="mt-3">
          คลินิกที่ต้องการให้ราคาของตนแสดงที่นี่ แจ้งเราได้ที่ <a href="/contact" className="text-blue-600 hover:underline">หน้าติดต่อ</a>
          {' '}— เราจะตรวจกับหน้าเว็บหรือเอกสารของคลินิกก่อนเผยแพร่
        </p>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700">← โรงพยาบาลสัตว์ทั้งหมด</a>
        <a href="/hospital/report" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50">📊 รายงานรีวิว</a>
        <a href="/neutering" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50">✂️ คู่มือทำหมัน</a>
      </div>
    </main>
  )
}
