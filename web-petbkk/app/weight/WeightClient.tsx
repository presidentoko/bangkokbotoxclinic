'use client'
import { useState } from 'react'
import RelatedGuides from '@/components/RelatedGuides'

const IDEAL_WEIGHTS: Record<string, { min: number; max: number }> = {
  'สุนัขพันธุ์เล็ก (<5 กก.)': { min: 2, max: 5 },
  'สุนัขพันธุ์กลาง (5-25 กก.)': { min: 5, max: 25 },
  'สุนัขพันธุ์ใหญ่ (25-50 กก.)': { min: 25, max: 50 },
  'แมวทั่วไป': { min: 3.5, max: 5.5 },
}

function getBCS(bcs: number): { label: string; color: string; bg: string; advice: string } {
  if (bcs <= 3) return { label: 'ผอมเกินไป', color: 'text-red-600', bg: 'bg-red-50 border-red-200', advice: 'น้องน้ำหนักน้อยเกินไป ควรปรึกษาสัตวแพทย์และเพิ่มอาหารที่มีโปรตีนและแคลอรีสูง' }
  if (bcs <= 5) return { label: 'น้ำหนักดี', color: 'text-green-600', bg: 'bg-green-50 border-green-200', advice: 'น้องมีน้ำหนักอยู่ในเกณฑ์ดี รักษาปริมาณอาหารและการออกกำลังกายในระดับนี้ต่อไป' }
  if (bcs <= 7) return { label: 'น้ำหนักเกิน', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', advice: 'น้องน้ำหนักเกินเล็กน้อย ลดอาหาร 10-20% และเพิ่มการออกกำลังกาย' }
  return { label: 'อ้วน', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', advice: 'น้องมีน้ำหนักมากเกินไป ควรปรึกษาสัตวแพทย์เพื่อวางแผนลดน้ำหนักอย่างปลอดภัย' }
}

const BCS_SCALE = [
  { score: 1, label: '1-2: กระดูกโปนชัด ไม่มีไขมัน' },
  { score: 3, label: '3: ผอมเล็กน้อย สัมผัสกระดูกง่าย' },
  { score: 4, label: '4: น้ำหนักดี สัมผัสซี่โครงได้' },
  { score: 5, label: '5: ดีเยี่ยม เอวชัดเจน' },
  { score: 6, label: '6: เกินเล็กน้อย ซี่โครงสัมผัสยาก' },
  { score: 7, label: '7: น้ำหนักเกิน พุงห้อย' },
  { score: 8, label: '8-9: อ้วนมาก เอวไม่ชัด' },
]

export default function WeightClient() {
  const [bcs, setBcs] = useState(5)
  const result = getBCS(bcs)

  return (
    <>
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-6">📊 ประเมิน BCS ของน้อง</h2>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>ผอมมาก (1)</span>
            <span>สมบูรณ์แบบ (5)</span>
            <span>อ้วนมาก (9)</span>
          </div>
          <input
            type="range"
            min={1}
            max={9}
            value={bcs}
            onChange={e => setBcs(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-xs mt-1">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <span key={n} className={`w-5 text-center font-semibold ${n === bcs ? 'text-orange-600' : 'text-gray-300'}`}>{n}</span>
            ))}
          </div>
        </div>

        <div className={`rounded-xl border p-4 ${result.bg}`}>
          <p className={`text-xl font-black mb-1 ${result.color}`}>BCS {bcs} — {result.label}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{result.advice}</p>
        </div>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🔍 วิธีอ่าน BCS ด้วยการสัมผัส</h2>
        <div className="space-y-2">
          {BCS_SCALE.map(s => (
            <div key={s.score} className={`flex items-start gap-3 p-2.5 rounded-lg text-sm ${bcs === s.score ? 'bg-orange-50 border border-orange-200' : ''}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                s.score <= 3 ? 'bg-red-100 text-red-600' :
                s.score <= 5 ? 'bg-green-100 text-green-600' :
                s.score <= 7 ? 'bg-amber-100 text-amber-600' :
                'bg-orange-100 text-orange-600'
              }`}>{s.score}</span>
              <p className="text-gray-600 leading-relaxed text-xs mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">📏 น้ำหนักที่เหมาะสมโดยประมาณ</h2>
        <div className="space-y-2.5">
          {Object.entries(IDEAL_WEIGHTS).map(([breed, range]) => (
            <div key={breed} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{breed}</span>
              <span className="text-sm font-bold text-orange-500">{range.min}-{range.max} กก.</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">*น้ำหนักอ้างอิง ขึ้นอยู่กับสายพันธุ์จริง โปรดปรึกษาสัตวแพทย์</p>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/cost" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💰 คำนวณค่าใช้จ่าย</a>
        <a href="/food" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🍖 เช็คอาหารที่ให้</a>
        <a href="/hospital" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏥 ปรึกษาสัตวแพทย์</a>
      </div>

      <RelatedGuides current="age" count={4} />
    </>
  )
}
