'use client'
import { Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadFoods } from '@/lib/petfood'
import { getFoodGrade } from '@/lib/grading'
import type { PetFood } from '@/lib/types'
import GradeBar from '@/components/GradeBar'

const GRADE_COLOR: Record<string, string> = {
  A: 'text-green-600', B: 'text-lime-600', C: 'text-yellow-600',
  D: 'text-orange-600', F: 'text-red-600',
}

function Row({ label, values }: { label: string; values: React.ReactNode[] }) {
  return (
    <tr className="border-t">
      <td className="py-2 pr-4 text-xs text-gray-500 whitespace-nowrap">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="py-2 px-2 text-sm text-center">{v}</td>
      ))}
    </tr>
  )
}

function CompareContent() {
  const params = useSearchParams()
  const idsParam = params.get('ids') ?? ''
  const ids = idsParam.split(',').filter(Boolean).slice(0, 3)

  const all = useMemo(() => loadFoods(), [])
  const foods: PetFood[] = useMemo(
    () => ids.map(id => all.find(f => f.id === id)).filter((f): f is PetFood => f != null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idsParam]
  )

  if (foods.length === 0) {
    return (
      <main className="max-w-3xl mx-auto text-center py-20">
        <p className="text-4xl mb-4">⚖️</p>
        <p className="text-gray-500 mb-2 font-medium">ยังไม่มีรายการที่เลือก</p>
        <p className="text-sm text-gray-400 mb-6">ไปที่หน้าอาหาร แล้วกดปุ่ม <span className="font-bold text-orange-500">+</span> บนการ์ดอาหารที่ต้องการเปรียบเทียบ</p>
        <a href="/food" className="inline-block px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">
          ไปเลือกอาหาร →
        </a>
      </main>
    )
  }

  const cols = foods.length

  return (
    <main className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <a href="/food" className="text-sm text-gray-400 hover:text-gray-600">← กลับ</a>
        <h1 className="text-2xl font-bold">เปรียบเทียบอาหาร</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr>
              <th className="text-left py-2 pr-4 w-28 text-xs text-gray-400 font-normal">รายการ</th>
              {foods.map(f => (
                <th key={f.id} className="py-2 px-2 text-center">
                  <p className="text-xs text-gray-400">{f.brand}</p>
                  <p className="text-sm font-semibold line-clamp-2">{f.name_th || f.name_en}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="เกรด" values={foods.map(f => {
              const g = getFoodGrade(f)
              return <span className={`text-2xl font-black ${g ? GRADE_COLOR[g] : 'text-gray-300'}`}>{g ?? '—'}</span>
            })} />
            <Row label="ส่วนประกอบ" values={foods.map(f => (
              <GradeBar green={f.green_count} yellow={f.yellow_count} red={f.red_count} black={f.black_count} />
            ))} />
            <Row label="ราคา/กก." values={foods.map(f => (
              <span className="font-bold text-orange-600">฿{f.price_per_kg > 0 ? f.price_per_kg.toFixed(0) : '—'}</span>
            ))} />
            <Row label="โปรตีน" values={foods.map(f => f.protein_pct > 0 ? `${f.protein_pct}%` : '—')} />
            <Row label="ไขมัน"  values={foods.map(f => f.fat_pct > 0    ? `${f.fat_pct}%`     : '—')} />
            <Row label="ไฟเบอร์" values={foods.map(f => f.fiber_pct > 0  ? `${f.fiber_pct}%`   : '—')} />
            <Row label="ความชื้น" values={foods.map(f => f.moisture_pct > 0 ? `${f.moisture_pct}%` : '—')} />
            <Row label="AAFCO" values={foods.map(f => (
              <span className={f.aafco_meets ? 'text-green-600' : 'text-gray-400'}>
                {f.aafco_meets ? '✓ ผ่าน' : '—'}
              </span>
            ))} />
            <Row label="น้ำหนัก" values={foods.map(f => `${f.weight_kg} kg`)} />
            <Row label="ซื้อที่" values={foods.map(f => f.buy_url ? (
              <a href={f.buy_url} target="_blank" rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xs">ซื้อเลย →</a>
            ) : '—')} />
          </tbody>
        </table>
      </div>

      {cols < 3 && (
        <div className="mt-6 text-center">
          <a href="/food" className="text-sm text-gray-400 hover:text-orange-500">
            + เพิ่มสินค้าเปรียบเทียบ (สูงสุด 3 รายการ)
          </a>
        </div>
      )}
    </main>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">กำลังโหลด...</div>}>
      <CompareContent />
    </Suspense>
  )
}
