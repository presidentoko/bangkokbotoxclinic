import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ดูแลสัตว์เลี้ยงสูงอายุ — สุนัขและแมวสูงวัย',
  description: 'วิธีดูแลสุนัขและแมวสูงอายุ การตรวจสุขภาพ อาหาร การออกกำลังกาย โรคที่พบบ่อยในวัยชรา และสัญญาณที่ต้องพาไปสัตวแพทย์',
  alternates: { canonical: 'https://www.thailandpethub.com/senior-care' },
  keywords: ['ดูแลสุนัขสูงอายุ', 'ดูแลแมวสูงอายุ', 'สัตว์เลี้ยงแก่', 'สุนัขชรา', 'แมวชรา'],
  openGraph: {
    title: 'ดูแลสัตว์เลี้ยงสูงอายุ — คู่มือครบถ้วน',
    description: 'อาหาร สุขภาพ และการดูแลสุนัขและแมวสูงอายุ',
    url: 'https://www.thailandpethub.com/senior-care',
  },
}

function SeniorCareSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สุนัขและแมวอายุเท่าไหร่ถึงเรียกว่า "ผู้สูงวัย"?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สุนัขขนาดเล็ก-กลาง: 7-8 ปีขึ้นไป / สุนัขขนาดใหญ่: 5-6 ปีขึ้นไป (อายุขัยสั้นกว่า) / แมว: 7-10 ปีขึ้นไป ยิ่งอายุมาก ยิ่งควรตรวจสุขภาพบ่อยขึ้น',
        },
      },
      {
        '@type': 'Question',
        name: 'ควรเปลี่ยนอาหารเป็นสูตร Senior เมื่อไหร่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ไม่จำเป็นต้องเปลี่ยนโดยอัตโนมัติ ขึ้นอยู่กับสุขภาพของแต่ละตัว ควรปรึกษาสัตวแพทย์เพื่อประเมินว่าน้องต้องการโปรตีนลดลง หรือสารอาหารพิเศษอื่นไหม อาหาร senior บางยี่ห้อเหมาะสม บางยี่ห้อไม่จำเป็น',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const AGE_GUIDE = [
  { animal: 'สุนัขเล็ก (< 10 กก.)', senior_at: 'ประมาณ 8-10 ปี', lifespan: '12-15 ปี' },
  { animal: 'สุนัขกลาง (10-25 กก.)', senior_at: 'ประมาณ 7-8 ปี', lifespan: '10-13 ปี' },
  { animal: 'สุนัขใหญ่ (> 25 กก.)', senior_at: 'ประมาณ 5-6 ปี', lifespan: '8-11 ปี' },
  { animal: 'แมว', senior_at: 'ประมาณ 7-10 ปี', lifespan: '12-18 ปี' },
]

const COMMON_CONDITIONS = [
  { condition: 'โรคข้อ / ข้ออักเสบ', sign: 'เดินช้า ขึ้นบันไดลำบาก ลังเลก่อนกระโดด', care: 'กลูโคซามีน ที่นอนนุ่ม หลีกเลี่ยงบันไดสูง' },
  { condition: 'โรคไต (CKD)', sign: 'กินน้ำมาก ปัสสาวะบ่อย น้ำหนักลด', care: 'อาหารฟอสฟอรัสต่ำ น้ำสะอาดตลอดเวลา ตรวจเลือดทุกปี' },
  { condition: 'โรคหัวใจ', sign: 'ไอ เหนื่อยง่าย ท้องบวม', care: 'จำกัดโซเดียม ออกกำลังเบาๆ ยาตามแพทย์สั่ง' },
  { condition: 'ต้อกระจก / สายตาเสื่อม', sign: 'ชนสิ่งของ ไม่กล้าเดินในที่มืด', care: 'ไม่เปลี่ยนตำแหน่งเฟอร์นิเจอร์ แสงสว่างเพียงพอ' },
  { condition: 'ภาวะสมองเสื่อม (CDS)', sign: 'สับสน ร้องกลางคืน เดินวน ลืมที่ฉี่', care: 'ใช้ชีวิตสม่ำเสมอ ยาเสริมสมองตามแพทย์' },
]

export default function SeniorCarePage() {
  return (
    <main className="max-w-3xl mx-auto">
      <SeniorCareSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ดูแลน้องสูงวัย</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">👴 ดูแลสัตว์เลี้ยงสูงอายุ</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        สัตว์เลี้ยงสูงวัยมีความต้องการที่เปลี่ยนแปลงไป ทั้งด้านอาหาร การออกกำลังกาย
        และการดูแลสุขภาพ การปรับตัวให้เหมาะสมช่วยให้น้องมีคุณภาพชีวิตที่ดีได้นานขึ้น
      </p>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6 overflow-x-auto">
        <h2 className="font-black text-gray-900 text-base mb-3">📊 อายุที่เข้าสู่วัยชรา</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-gray-400">
              <th className="text-left py-2 pr-4 font-medium">สัตว์เลี้ยง</th>
              <th className="text-left py-2 pr-4 font-medium">เริ่มสูงวัย</th>
              <th className="text-left py-2 font-medium">อายุขัยเฉลี่ย</th>
            </tr>
          </thead>
          <tbody>
            {AGE_GUIDE.map(a => (
              <tr key={a.animal} className="border-b border-gray-50 last:border-0">
                <td className="py-2 pr-4 text-gray-700 font-medium text-xs">{a.animal}</td>
                <td className="py-2 pr-4 text-orange-600 font-semibold text-xs">{a.senior_at}</td>
                <td className="py-2 text-gray-500 text-xs">{a.lifespan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🏥 โรคที่พบบ่อยในสัตว์สูงอายุ</h2>
        <div className="space-y-4">
          {COMMON_CONDITIONS.map(c => (
            <div key={c.condition} className="border border-gray-100 rounded-xl p-4">
              <p className="font-bold text-gray-800 text-sm mb-1.5">{c.condition}</p>
              <p className="text-xs text-gray-500 mb-2"><span className="font-medium text-gray-600">สัญญาณ: </span>{c.sign}</p>
              <p className="text-xs text-blue-600"><span className="font-medium">การดูแล: </span>{c.care}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">✅ เช็คลิสต์ดูแลน้องสูงวัย</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { tip: 'ตรวจสุขภาพทุก 6 เดือน (ไม่ใช่ปีละครั้ง)' },
            { tip: 'ตรวจเลือด ตรวจไต ทุกปี' },
            { tip: 'วัดน้ำหนักทุกเดือน สังเกตการเปลี่ยนแปลง' },
            { tip: 'อาหารเปียกเพิ่มขึ้น เพิ่มน้ำในร่างกาย' },
            { tip: 'ออกกำลังเบาๆ สม่ำเสมอ หลีกเลี่ยงหักโหม' },
            { tip: 'ที่นอนนุ่ม อุ่น เข้าถึงได้ง่าย' },
            { tip: 'กระบะทรายขอบเตี้ยสำหรับแมว' },
            { tip: 'ดูแลฟัน ลดความเสี่ยงโรคหัวใจ' },
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>{t.tip}
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/food/senior" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🍖 อาหาร Senior</a>
        <a href="/kidney-disease" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🫘 โรคไต CKD</a>
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">🏥 หาสัตวแพทย์</a>
      </div>

      <RelatedGuides current="senior-care" count={4} />
    </main>
  )
}
