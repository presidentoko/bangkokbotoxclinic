import type { Metadata } from 'next'
import SymptomChecker from '@/components/SymptomChecker'

export const metadata: Metadata = {
  title: 'ตรวจสอบอาการสัตว์เลี้ยง — สุนัขแมวมีอาการแบบนี้ต้องทำอะไร',
  description: 'ตรวจสอบอาการสุนัขและแมว ไม่กิน ท้องเสีย อาเจียน ตาแดง คัน ซึม — เราแนะนำคู่มือที่เหมาะสมและบอกว่าต้องพาหมอหรือเปล่า',
  alternates: { canonical: 'https://www.thailandpethub.com/symptoms' },
  keywords: ['ตรวจสอบอาการสัตว์เลี้ยง', 'สุนัขแมวป่วย', 'อาการสัตว์เลี้ยง', 'ต้องพาหมอไหม'],
  openGraph: {
    title: 'ตรวจสอบอาการสัตว์เลี้ยง — บอกว่าต้องพาหมอหรือเปล่า',
    description: 'เลือกอาการ เราแนะนำขั้นตอนที่เหมาะสม',
    url: 'https://www.thailandpethub.com/symptoms',
  },
}

function SymptomsBreadcrumbJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
      { '@type': 'ListItem', position: 2, name: 'ตรวจสอบอาการ', item: 'https://www.thailandpethub.com/symptoms' },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

/**
 * SymptomChecker is a client component that renders nothing until a symptom is
 * picked, so this route prerendered to ~110 characters — the h1 and subtitle and
 * little else. These entries are server-rendered, which gives the page real
 * content for "อาการสุนัขป่วย"-type queries and, just as importantly, the only
 * crawlable links it has ever had into the individual symptom guides.
 */
const COMMON_SYMPTOMS: Array<{ href: string; label: string; when: string }> = [
  { href: '/vomiting',    label: 'อาเจียน',            when: 'อาเจียนซ้ำหลายครั้งใน 24 ชม. มีเลือดปน หรือซึมร่วมด้วย → พบสัตวแพทย์' },
  { href: '/diarrhea',    label: 'ท้องเสีย',            when: 'ถ่ายเหลวเกิน 2 วัน มีเลือด หรือมีภาวะขาดน้ำ → พบสัตวแพทย์' },
  { href: '/not-eating',  label: 'ไม่กินอาหาร',         when: 'สุนัขไม่กินเกิน 24 ชม. หรือแมวไม่กินเกิน 12–24 ชม. → พบสัตวแพทย์' },
  { href: '/skin',        label: 'คัน ผิวหนังผิดปกติ',  when: 'เกาจนขนร่วงเป็นหย่อม มีแผลเปิด หรือมีกลิ่น → พบสัตวแพทย์' },
  { href: '/eye-care',    label: 'ตาแดง ตาแฉะ',         when: 'ตาขุ่น หรี่ตาข้างเดียว หรือมีขี้ตาเป็นหนอง → พบสัตวแพทย์' },
  { href: '/ear-care',    label: 'สะบัดหัว เกาหู',      when: 'มีกลิ่นเหม็นจากหู มีหนอง หรือเจ็บเมื่อสัมผัส → พบสัตวแพทย์' },
  { href: '/urinary',     label: 'ปัสสาวะผิดปกติ',      when: 'เบ่งแล้วไม่ออก โดยเฉพาะแมวตัวผู้ → ฉุกเฉิน ไปทันที' },
  { href: '/heatstroke',  label: 'หอบหนัก ตัวร้อน',     when: 'หอบไม่หยุด เหงือกแดงจัด ในวันอากาศร้อน → ฉุกเฉิน ไปทันที' },
  { href: '/toxic',       label: 'สงสัยกินสารพิษ',      when: 'กินช็อกโกแลต องุ่น หัวหอม หรือยาคน → ฉุกเฉิน ไปทันที' },
  { href: '/obesity',     label: 'น้ำหนักเปลี่ยนเร็ว',  when: 'น้ำหนักลดหรือเพิ่มผิดปกติโดยไม่ได้เปลี่ยนอาหาร → ควรตรวจ' },
]

function SymptomGuideList() {
  return (
    <section className="mt-10">
      <h2 className="text-base font-bold text-gray-800 mb-1">อาการที่พบบ่อยในสุนัขและแมว</h2>
      <p className="text-xs text-gray-400 mb-4">แต่ละอาการมีคู่มือแยก พร้อมเกณฑ์ว่าเมื่อไหร่ควรพาไปพบสัตวแพทย์</p>
      <ul className="space-y-2.5">
        {COMMON_SYMPTOMS.map(s => (
          <li key={s.href} className="border-b border-gray-100 pb-2.5">
            <a href={s.href} className="font-semibold text-sm text-gray-800 hover:text-orange-600 hover:underline">
              {s.label}
            </a>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.when}</p>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-400 mt-4 leading-relaxed">
        ข้อมูลนี้เพื่อการศึกษา ไม่ใช่การวินิจฉัยทางสัตวแพทย์ หากไม่แน่ใจให้ถือว่าเป็นเหตุฉุกเฉินไว้ก่อน —{' '}
        <a href="/hospital/24h" className="text-orange-600 hover:underline">ดูโรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมง</a>
      </p>
    </section>
  )
}

export default function SymptomsPage() {
  return (
    <main className="max-w-2xl mx-auto">
      <SymptomsBreadcrumbJsonLd />
      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ตรวจสอบอาการ</span>
      </nav>
      <h1 className="text-3xl font-black text-gray-900 mb-2">🩺 ตรวจสอบอาการสัตว์เลี้ยง</h1>
      <p className="text-gray-500 text-sm mb-8">เลือกอาการที่พบ — เราจะแนะนำคู่มือและบอกว่าต้องพาหมอหรือไม่</p>
      <SymptomChecker />
      <SymptomGuideList />
    </main>
  )
}
