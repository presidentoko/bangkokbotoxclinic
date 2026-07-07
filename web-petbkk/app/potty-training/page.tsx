import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ฝึกสุนัขและแมวฉี่ถูกที่ — คู่มือ Potty Training ฉบับสมบูรณ์',
  description: 'วิธีฝึกลูกสุนัขฉี่ถูกที่ สอนแมวใช้กระบะทราย และแก้พฤติกรรมฉี่ผิดที่ ขั้นตอนทีละก้าว ใช้ positive reinforcement',
  alternates: { canonical: 'https://www.thailandpethub.com/potty-training' },
  keywords: ['ฝึกสุนัขฉี่ถูกที่', 'สอนลูกสุนัขฉี่', 'ฝึกแมวกระบะทราย', 'สุนัขฉี่ผิดที่', 'potty training'],
  openGraph: {
    title: 'ฝึกสุนัขและแมวฉี่ถูกที่ — Potty Training',
    description: 'วิธีฝึกลูกสุนัขฉี่ถูกที่ สอนแมวใช้กระบะทราย',
    url: 'https://www.thailandpethub.com/potty-training',
  },
}

function PottySchemaLd() {
  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'วิธีฝึกลูกสุนัขฉี่ถูกที่',
    description: 'ขั้นตอนการฝึกลูกสุนัขให้ฉี่ถูกที่ด้วยวิธี positive reinforcement',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'กำหนดพื้นที่', text: 'กำหนดบริเวณที่ต้องการให้น้องขับถ่าย วางแผ่นรองซับหรือหญ้าเทียม' },
      { '@type': 'HowToStep', position: 2, name: 'สังเกตสัญญาณ', text: 'สังเกตสัญญาณว่าน้องต้องการขับถ่าย เช่น หมุนตัว ดมพื้น กระสับกระส่าย' },
      { '@type': 'HowToStep', position: 3, name: 'พาไปที่ถูก', text: 'เมื่อเห็นสัญญาณ พาไปพื้นที่ที่กำหนดทันที และรออยู่ด้วย' },
      { '@type': 'HowToStep', position: 4, name: 'ชมเชยทันที', text: 'ทันทีที่ฉี่ถูกที่ ชมเชยด้วยเสียงสนุกและให้ขนมทันที เพื่อเชื่อมโยงพฤติกรรมกับรางวัล' },
    ],
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ฝึกลูกสุนัขฉี่ถูกที่ใช้เวลานานแค่ไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ลูกสุนัขมักใช้เวลา 4-6 เดือนกว่าจะฉี่ถูกที่สม่ำเสมอ ขึ้นอยู่กับอายุ สายพันธุ์ และความสม่ำเสมอในการฝึก ลูกสุนัขอายุต่ำกว่า 12 สัปดาห์ยังควบคุมกระเพาะปัสสาวะได้ไม่ดี ต้องให้เวลา',
        },
      },
      {
        '@type': 'Question',
        name: 'สุนัขฉี่ผิดที่ควรทำอย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ห้ามดุหรือลงโทษหลังจากเกิดแล้ว สุนัขไม่เข้าใจว่าโดนลงโทษเพราะอะไร ให้ทำความสะอาดด้วยน้ำยาขจัดกลิ่นเอ็นไซม์ (enzymatic cleaner) เพื่อกำจัดกลิ่นที่กระตุ้นให้ฉี่ซ้ำ',
        },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}

const DOG_SIGNS = ['หมุนตัวหรือวนรอบพื้นที่', 'ดมพื้นอย่างเร่งรีบ', 'กระสับกระส่ายหรือหยุดเล่นกะทันหัน', 'นั่งหน้าประตู', 'เริ่มหลบไปมุมที่ซ่อน']
const TIMES_TO_TAKE = ['ตื่นนอนทันที', 'หลังกินข้าว 15-20 นาที', 'หลังเล่น', 'ทุก 1-2 ชั่วโมง (ลูกสุนัขอายุต่ำกว่า 12 สัปดาห์)', 'ก่อนนอน']

export default function PottyTrainingPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <PottySchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">Potty Training</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🚽 ฝึกสุนัขและแมวฉี่ถูกที่</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        การฝึกฉี่ถูกที่ต้องอาศัยความสม่ำเสมอ ความอดทน และ positive reinforcement
        ไม่มีทางลัด — แต่ถ้าทำถูกวิธีจะได้ผลเร็วกว่าที่คิด
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

        {/* Dog section */}
        <section className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-black text-gray-900 text-lg mb-5">🐕 ฝึกลูกสุนัข</h2>

          <div className="mb-4">
            <p className="font-semibold text-sm text-gray-700 mb-2">⏱️ เวลาที่ต้องพาไปฉี่</p>
            <ul className="space-y-1.5">
              {TIMES_TO_TAKE.map(t => (
                <li key={t} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-orange-500 mt-0.5 flex-shrink-0">→</span>{t}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-sm text-gray-700 mb-2">👀 สัญญาณว่าน้องต้องการขับถ่าย</p>
            <ul className="space-y-1.5">
              {DOG_SIGNS.map(s => (
                <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>{s}
                </li>
              ))}
            </ul>
          </div>

          <ol className="space-y-3 mb-4">
            <p className="font-semibold text-sm text-gray-700 mb-1">📋 ขั้นตอน</p>
            {['กำหนดพื้นที่ (แผ่นรอง, สนาม, หรือกระถาง)', 'สังเกตสัญญาณ → พาทันที', 'รออยู่ด้วย 5-10 นาที', 'ฉี่ถูกที่ → ชมเชย+ขนมทันที', 'เกิดผิดที่ → ทำความสะอาดด้วย enzymatic cleaner'].map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-sm text-gray-700">{s}</span>
              </li>
            ))}
          </ol>

          <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
            <strong>ไม่ควรทำ:</strong> ตี ดุ หรือใช้จมูกน้องถูกับรอยฉี่ — วิธีนี้ไม่ได้ผลและทำร้ายความไว้วางใจ
          </div>
        </section>

        {/* Cat section */}
        <section className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-black text-gray-900 text-lg mb-5">🐈 ฝึกแมวใช้กระบะทราย</h2>
          <p className="text-xs text-gray-500 mb-4">แมวส่วนใหญ่เรียนรู้กระบะทรายเองตามธรรมชาติ แค่ต้องตั้งในที่ถูก</p>

          <div className="space-y-3 mb-4">
            <p className="font-semibold text-sm text-gray-700 mb-2">📐 หลักการเลือกกระบะ</p>
            {['ขนาดอย่างน้อย 1.5× ความยาวตัวแมว', 'ขอบสูงพอสมควร แต่เข้าได้สบาย (โดยเฉพาะแมวแก่)', 'ต้องการกระบะอย่างน้อย 1 ใบต่อแมว 1 ตัว + อีก 1 ใบ', 'วางในที่เงียบ เข้าถึงได้ง่าย ไม่ใกล้ชามข้าว'].map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-purple-500 mt-0.5 flex-shrink-0">•</span>{s}
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            <p className="font-semibold text-sm text-gray-700">ทรายแมวที่แนะนำ</p>
            {[
              { type: 'ทรายเบนโทไนต์', pros: 'จับตัวเป็นก้อน ดูดกลิ่น ทำความสะอาดง่าย' },
              { type: 'ทรายเต้าหู้', pros: 'เป็นมิตรสิ่งแวดล้อม ปลอดภัยถ้าแมวกิน' },
              { type: 'ทรายซิลิกา', pros: 'ดูดกลิ่นดีมาก เปลี่ยนน้อยกว่า' },
            ].map(t => (
              <div key={t.type} className="bg-gray-50 rounded-lg p-2.5 text-xs">
                <span className="font-medium text-gray-800">{t.type}: </span>
                <span className="text-gray-500">{t.pros}</span>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 rounded-xl p-3 text-xs text-purple-700">
            <strong>ถ้าแมวหยุดใช้กระบะ:</strong> ตรวจสอบความสะอาด (ตักทุกวัน) สาเหตุที่พบบ่อยที่สุดคือกระบะสกปรก หรืออาจมีปัญหาสุขภาพที่ต้องพบสัตวแพทย์
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'ลูกสุนัขฉี่ถูกที่ใช้เวลานานแค่ไหน?', a: 'ลูกสุนัขมักใช้เวลา 4-6 เดือน ขึ้นอยู่กับอายุและความสม่ำเสมอในการฝึก ลูกสุนัขอายุต่ำกว่า 12 สัปดาห์ยังควบคุมกระเพาะปัสสาวะได้ไม่ดี' },
            { q: 'สุนัขฉี่ผิดที่แล้วควรทำอย่างไร?', a: 'ทำความสะอาดด้วย enzymatic cleaner ทันที เพื่อกำจัดกลิ่นที่กระตุ้นให้ฉี่ซ้ำ ห้ามตีหรือดุหลังจากเกิดแล้ว เพราะน้องไม่รู้ว่าโดนลงโทษเพราะอะไร' },
            { q: 'ทำไมแมวถึงหยุดใช้กระบะทราย?', a: 'สาเหตุที่พบบ่อยที่สุดคือกระบะสกปรก (ตักทุกวัน!) รองลงมาคือเปลี่ยนชนิดทราย ย้ายตำแหน่งกระบะ หรืออาจมีปัญหาสุขภาพเช่นโรคทางเดินปัสสาวะ' },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/training" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🐕 ฝึกสุนัขเบื้องต้น</a>
        <a href="/newpet" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🆕 คู่มือเลี้ยงใหม่</a>
        <a href="/food/puppy" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🐶 อาหาร Puppy</a>
      </div>

      <RelatedGuides current="potty-training" count={4} />
    </main>
  )
}
