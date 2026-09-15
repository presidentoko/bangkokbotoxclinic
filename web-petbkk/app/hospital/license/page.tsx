import type { Metadata } from 'next'
import registry from '@/data/vet-registry.json'
import { licensedCount, LICENSE_CLASS, LICENSE_SOURCE, type LicenseClass } from '@/lib/licenses'
import LicenseSearch from '@/components/LicenseSearch'

const URL = 'https://www.thailandpethub.com/hospital/license'

export const metadata: Metadata = {
  title: 'ตรวจสอบใบอนุญาตคลินิก/โรงพยาบาลสัตว์ — ค้นจากทะเบียนกรมปศุสัตว์',
  description:
    'ค้นหาว่าคลินิกหรือโรงพยาบาลสัตว์ได้รับใบอนุญาตสถานพยาบาลสัตว์หรือไม่ พร้อมเลขที่ใบอนุญาตและประเภท (รับสัตว์ป่วยค้างคืนได้หรือไม่) จากรายชื่อสถานพยาบาลสัตว์ทั่วประเทศของกรมปศุสัตว์',
  alternates: { canonical: URL },
  openGraph: {
    title: 'ตรวจสอบใบอนุญาตคลินิก/โรงพยาบาลสัตว์',
    description: 'ค้นจากทะเบียนสถานพยาบาลสัตว์ทั่วประเทศ กรมปศุสัตว์',
    url: URL,
  },
}

type Rec = { province: string; license_class: string }

/**
 * /hospital/license — the DLD register as a search tool.
 *
 * One page, not 3,861. The register is valuable precisely because it is hard
 * to use where it is published (ten Looker Studio embeds, one per livestock
 * region, no search across them), and a single tool page answers "is this
 * clinic licensed?" without adding a page per row to a site that was demoted
 * for scaled pages in August 2026.
 */
export default function LicenseCheckPage() {
  const records = (registry as { records: Rec[] }).records
  const byClass = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.license_class] = (acc[r.license_class] ?? 0) + 1
    return acc
  }, {})
  const provinceCounts = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.province] = (acc[r.province] ?? 0) + 1
    return acc
  }, {})
  const provinces = Object.keys(provinceCounts).sort((a, b) => a.localeCompare(b, 'th'))
  const matched = licensedCount()

  const faqs = [
    {
      q: 'คลินิกสัตว์ต้องมีใบอนุญาตไหม?',
      a: 'ต้องมี สถานพยาบาลสัตว์ทุกแห่งต้องได้รับใบอนุญาตให้ตั้งและดำเนินการตามพระราชบัญญัติสถานพยาบาลสัตว์ พ.ศ. 2533 ซึ่งกรมปศุสัตว์เป็นผู้ออกใบอนุญาต',
    },
    {
      q: 'ประเภท 01, 02, 03 ในใบอนุญาตต่างกันอย่างไร?',
      a: `ประเภท 01 คือ${LICENSE_CLASS['01'].official} ประเภท 02 คือ${LICENSE_CLASS['02'].official} และประเภท 03 คือ${LICENSE_CLASS['03'].official} ถ้าสัตว์เลี้ยงอาจต้องนอนโรงพยาบาล ประเภทจึงบอกได้ว่าที่นั่นรับแอดมิทได้หรือไม่`,
    },
    {
      q: 'ค้นแล้วไม่เจอ แปลว่าคลินิกนั้นไม่มีใบอนุญาตหรือเปล่า?',
      a: 'ไม่จำเป็น ทะเบียนใช้ชื่อที่จดทะเบียน ซึ่งอาจเป็นชื่อบริษัทหรือชื่อที่ต่างจากป้ายหน้าร้าน ลองค้นด้วยคำสั้นลงหรือเลือกจังหวัดแล้วไล่ดู หากยังไม่พบ สามารถสอบถามเลขที่ใบอนุญาตจากคลินิกโดยตรง หรือติดต่อสำนักงานปศุสัตว์จังหวัด',
    },
    {
      q: 'ข้อมูลนี้มาจากไหน อัปเดตเมื่อไร?',
      a: `จาก “รายชื่อสถานพยาบาลสัตว์ทั่วประเทศ” ของ${LICENSE_SOURCE.publisher} ซึ่งเผยแพร่แยกตามเขตปศุสัตว์ ThailandPetHub รวบรวมทุกเขตมาไว้ในที่ค้นหาเดียว ดึงข้อมูลล่าสุดเมื่อ ${LICENSE_SOURCE.retrieved}`,
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': URL,
        url: URL,
        name: 'ตรวจสอบใบอนุญาตคลินิก/โรงพยาบาลสัตว์',
        inLanguage: 'th',
        isBasedOn: LICENSE_SOURCE.url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
          { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: 'https://www.thailandpethub.com/hospital' },
          { '@type': 'ListItem', position: 3, name: 'ตรวจสอบใบอนุญาต' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  }

  const classOrder: LicenseClass[] = ['01', '02', '03', '04', 'gov']

  return (
    <main className="max-w-2xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="breadcrumb" className="text-xs text-gray-400 mb-6">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ตรวจสอบใบอนุญาต</span>
      </nav>

      <h1 className="text-2xl font-bold mb-2">ตรวจสอบใบอนุญาตคลินิก/โรงพยาบาลสัตว์</h1>
      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        เห็นคลินิกในคลิปรีวิวหรือโพสต์แนะนำ แล้วอยากรู้ว่าได้รับอนุญาตถูกต้องไหม และรับน้องนอนโรงพยาบาลได้หรือเปล่า —
        ค้นได้จากทะเบียนสถานพยาบาลสัตว์ของกรมปศุสัตว์ {records.length.toLocaleString()} แห่งทั่วประเทศ
        ที่เรารวบรวมจากทุกเขตปศุสัตว์มาไว้ในช่องค้นหาเดียว
      </p>

      <LicenseSearch provinces={provinces} />

      <section className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">ประเภทใบอนุญาตบอกอะไร</h2>
        <div className="space-y-3">
          {classOrder.filter(c => byClass[c]).map(c => (
            <div key={c} className="flex gap-3">
              <span className="flex-shrink-0 w-12 text-center font-mono text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded py-1">
                {c === 'gov' ? 'รัฐ' : c}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {LICENSE_CLASS[c].official}{' '}
                  <span className="font-normal text-gray-400">· {byClass[c].toLocaleString()} แห่ง</span>
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{LICENSE_CLASS[c].meaning}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">ใช้กับหน้าคลินิกบน ThailandPetHub อย่างไร</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          เราจับคู่ทะเบียนกับคลินิกในฐานข้อมูลของเราด้วยชื่อภาษาไทยและเขต/อำเภอ แบบระมัดระวัง —
          ถ้าชื่อกำกวมหรือมีหลายรายการที่เข้าได้ เราจะไม่จับคู่ ตอนนี้จับคู่ได้ {matched.toLocaleString()} แห่ง
          หน้าคลินิกเหล่านั้นจะแสดงกล่อง “พบในทะเบียนสถานพยาบาลสัตว์” พร้อมเลขที่และประเภทใบอนุญาต
          ส่วนคลินิกที่ยังจับคู่ไม่ได้ เราจะไม่แสดงอะไรเลย เพราะการจับคู่ไม่ได้ไม่ใช่หลักฐานว่าไม่มีใบอนุญาต
        </p>
      </section>

      <section className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">คำถามที่พบบ่อย</h2>
        <div className="space-y-3 divide-y divide-gray-100">
          {faqs.map((f, i) => (
            <div key={i} className={i > 0 ? 'pt-3' : ''}>
              <h3 className="font-semibold text-sm text-gray-800 mb-1">{f.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 leading-relaxed mb-8">
        แหล่งข้อมูล:{' '}
        <a href={LICENSE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline">
          รายชื่อสถานพยาบาลสัตว์ทั่วประเทศ
        </a>{' '}
        — {LICENSE_SOURCE.publisher} · ดึงข้อมูลเมื่อ {LICENSE_SOURCE.retrieved} ·
        เราไม่เผยแพร่ชื่อบุคคล (ผู้ตั้ง/ผู้ดำเนินการ) ที่ปรากฏในทะเบียน
      </p>
    </main>
  )
}
