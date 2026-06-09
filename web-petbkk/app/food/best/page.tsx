import type { Metadata } from 'next'
import { loadFoods } from '@/lib/petfood'
import { getFoodGrade } from '@/lib/grading'
import GradeBar from '@/components/GradeBar'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'อาหารสัตว์เลี้ยง Grade A — เกรดดีที่สุด | PetBKK',
  description: 'รายชื่ออาหารสัตว์เลี้ยงที่ได้เกรด A — ส่วนประกอบดีเยี่ยม คุ้มค่าที่สุด',
}

export default function BestFoodsPage() {
  const all = loadFoods()
  const graded = all
    .map(f => ({ f, g: getFoodGrade(f) }))
    .filter(x => x.g === 'A' || x.g === 'B')
    .sort((a, b) => {
      if (a.g !== b.g) return a.g === 'A' ? -1 : 1
      return a.f.price_per_kg - b.f.price_per_kg
    })

  const aFoods = graded.filter(x => x.g === 'A')
  const bFoods = graded.filter(x => x.g === 'B')

  return (
    <main className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">อาหารสัตว์เลี้ยงเกรดดีที่สุด</h1>
      <p className="text-sm text-gray-400 mb-8">
        เรียงตามราคาต่อกิโลกรัม — อาหารที่คุ้มค่าที่สุดสำหรับน้อง
      </p>

      {aFoods.length > 0 && (
        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
            <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-sm">A</span>
            <span>เกรด A — ดีเยี่ยม ({aFoods.length} รายการ)</span>
          </h2>
          <div className="space-y-3">
            {aFoods.map(({ f }) => (
              <Link key={f.id} href={`/food/${f.id}`}
                className="flex items-center gap-4 bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">A</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">{f.brand}</p>
                  <p className="font-semibold text-sm text-gray-900 line-clamp-1">{f.name_th || f.name_en}</p>
                  <GradeBar green={f.green_count} yellow={f.yellow_count} red={f.red_count} black={f.black_count} />
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-orange-600">฿{f.price_per_kg > 0 ? f.price_per_kg.toFixed(0) : '—'}</p>
                  <p className="text-xs text-gray-400">/กก.</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {bFoods.length > 0 && (
        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
            <span className="w-8 h-8 rounded-full bg-lime-500 text-white flex items-center justify-center font-black text-sm">B</span>
            <span>เกรด B — ดี ({bFoods.length} รายการ)</span>
          </h2>
          <div className="space-y-3">
            {bFoods.map(({ f }) => (
              <Link key={f.id} href={`/food/${f.id}`}
                className="flex items-center gap-4 bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-lime-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">B</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">{f.brand}</p>
                  <p className="font-semibold text-sm text-gray-900 line-clamp-1">{f.name_th || f.name_en}</p>
                  <GradeBar green={f.green_count} yellow={f.yellow_count} red={f.red_count} black={f.black_count} />
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-orange-600">฿{f.price_per_kg > 0 ? f.price_per_kg.toFixed(0) : '—'}</p>
                  <p className="text-xs text-gray-400">/กก.</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {graded.length === 0 && (
        <div className="text-center text-gray-400 py-16">
          <p>ยังไม่มีข้อมูลอาหารเกรด A หรือ B</p>
          <a href="/food" className="text-orange-500 hover:underline mt-2 inline-block">← ดูอาหารทั้งหมด</a>
        </div>
      )}

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-center">
        <p className="text-sm text-gray-600 mb-3">เปรียบเทียบอาหารหลายรายการพร้อมกัน</p>
        <a href="/food" className="inline-block px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm">
          ← กลับไปเลือกอาหาร
        </a>
      </div>
    </main>
  )
}
