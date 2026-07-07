import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'อาหาร Raw สัตว์เลี้ยง — ข้อดี ข้อเสีย ความเสี่ยง และวิธีทำ',
  description: 'คู่มืออาหาร Raw (BARF/PMR) สำหรับสุนัขและแมว ข้อดีและข้อเสีย ความเสี่ยงจากเชื้อโรค วิธีเตรียมให้ปลอดภัย และอาหารที่ห้ามใส่',
  alternates: { canonical: 'https://www.thailandpethub.com/raw-food' },
  keywords: ['อาหาร raw สุนัข', 'อาหาร raw แมว', 'BARF', 'อาหารดิบสัตว์เลี้ยง', 'raw diet ไทย'],
  openGraph: {
    title: 'อาหาร Raw สัตว์เลี้ยง — ข้อดี ข้อเสีย และวิธีทำอย่างปลอดภัย',
    description: 'คู่มือครบสำหรับอาหาร Raw ทั้งข้อดี ข้อเสีย และความเสี่ยงที่ควรรู้',
    url: 'https://www.thailandpethub.com/raw-food',
  },
}

function RawFoodSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'อาหาร Raw ดีกว่าอาหารสำเร็จรูปจริงไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ยังไม่มีงานวิจัยชัดเจนว่าดีกว่า อาหาร Raw มีข้อดีเช่น ไม่มีสารกันบูด โปรตีนสูง แต่มีความเสี่ยงจากเชื้อ Salmonella, E. coli, Listeria ที่อาจติดสัตว์เลี้ยงและคนในบ้าน และต้องใส่ใจโภชนาการครบถ้วน',
        },
      },
      {
        '@type': 'Question',
        name: 'อาหาร Raw เหมาะกับสัตว์เลี้ยงทุกตัวไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ไม่เหมาะกับสัตว์เลี้ยงที่มีระบบภูมิคุ้มกันอ่อนแอ เป็นโรคตับ ไต หรือมะเร็ง รวมถึงบ้านที่มีเด็กเล็ก ผู้สูงอายุ หรือผู้ที่มีภูมิคุ้มกันบกพร่อง ควรปรึกษาสัตวแพทย์ก่อนเปลี่ยน',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const PROS = [
  'ไม่มีสารกันบูดหรือสารเคมีเพิ่ม',
  'โปรตีนและเอนไซม์ตามธรรมชาติสูง',
  'น้ำในอาหารสูง ไตทำงานดีขึ้น (โดยเฉพาะแมว)',
  'สุนัขหลายตัวชอบมากกว่าอาหารสำเร็จรูป',
  'ควบคุมส่วนผสมได้เอง',
]

const CONS = [
  'เสี่ยงเชื้อ Salmonella, E. coli, Listeria ทั้งสัตว์และคนในบ้าน',
  'หากไม่สมดุลโภชนาการ อาจขาดวิตามินแร่ธาตุ',
  'ค่าใช้จ่ายสูงกว่าอาหารสำเร็จรูปที่มีคุณภาพใกล้เคียง',
  'ต้องใช้เวลาเตรียมและจัดเก็บอย่างระมัดระวัง',
  'กระดูกดิบอาจทำให้สำลักหรือบาดทางเดินอาหาร',
]

const SAFE_PROTEINS = ['ไก่ (เนื้อ + กระดูกอ่อน)', 'เนื้อวัว', 'เนื้อหมู (ไม่มีชิ้นใหญ่)', 'ไก่งวง', 'กระต่าย', 'ปลาแซลมอน (ไม่ดิบ)', 'ไข่']
const AVOID_LIST = ['กระดูกปรุงสุก', 'หัวหอม กระเทียม', 'องุ่น ลูกเกด', 'แมคาเดเมีย', 'ช็อกโกแลต', 'Xylitol', 'ตับมากเกินไป (วิตามิน A สูง)']

export default function RawFoodPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <RawFoodSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">อาหาร Raw</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🥩 อาหาร Raw สำหรับสัตว์เลี้ยง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        อาหาร Raw (BARF — Biologically Appropriate Raw Food หรือ Bones and Raw Food)
        เป็นอาหารดิบที่ประกอบด้วยเนื้อสัตว์ กระดูกดิบ อวัยวะ และบางครั้งผักผลไม้
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        มีทั้งข้อดีและความเสี่ยงที่ต้องรู้ก่อนตัดสินใจ
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <section className="bg-green-50 rounded-2xl border border-green-200 p-5">
          <h2 className="font-bold text-green-700 text-sm mb-3">✅ ข้อดี</h2>
          <ul className="space-y-2">
            {PROS.map(p => (
              <li key={p} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">+</span>{p}
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-red-50 rounded-2xl border border-red-200 p-5">
          <h2 className="font-bold text-red-700 text-sm mb-3">⚠️ ข้อเสีย / ความเสี่ยง</h2>
          <ul className="space-y-2">
            {CONS.map(c => (
              <li key={c} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">−</span>{c}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🍗 โปรตีนที่ใช้ได้</h2>
        <div className="flex flex-wrap gap-2">
          {SAFE_PROTEINS.map(p => (
            <span key={p} className="px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs rounded-full">{p}</span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">ปลาดิบส่วนใหญ่มีเอนไซม์ Thiaminase ที่ทำลายวิตามิน B1 — ปลาแซลมอนควรแช่แข็งก่อน (ป้องกัน salmon poisoning)</p>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🚫 ห้ามใส่เด็ดขาด</h2>
        <div className="grid grid-cols-2 gap-2">
          {AVOID_LIST.map(a => (
            <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-red-500 font-bold">✗</span>{a}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🧪 สัดส่วนพื้นฐาน (BARF)</h2>
        <div className="space-y-2">
          {[
            { label: 'เนื้อกล้ามเนื้อ', pct: '70%', color: 'bg-orange-400' },
            { label: 'กระดูกดิบ (ย่อยได้)', pct: '10%', color: 'bg-yellow-400' },
            { label: 'อวัยวะ (ตับ ไต ปอด)', pct: '10%', color: 'bg-red-400' },
            { label: 'ผัก / ผลไม้', pct: '10%', color: 'bg-green-400' },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.color}`} />
              <span className="text-sm text-gray-700 flex-1">{r.label}</span>
              <span className="text-sm font-bold text-gray-500">{r.pct}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">สัดส่วนนี้เป็นจุดเริ่มต้น — แต่ละตัวอาจต้องปรับตามอายุ น้ำหนัก และสุขภาพ ปรึกษาสัตวแพทย์โภชนาการ (board-certified)</p>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/food" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🍖 ตรวจสอบอาหารสำเร็จรูป</a>
        <a href="/toxic" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">⚠️ อาหารต้องห้าม</a>
        <a href="/allergy" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🤧 อาหารแพ้</a>
      </div>

      <RelatedGuides current="raw-food" count={4} />
    </main>
  )
}
