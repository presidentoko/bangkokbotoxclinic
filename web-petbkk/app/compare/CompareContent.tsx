'use client'
import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadFoodsLight } from '@/lib/petfood'
import { getFoodGrade } from '@/lib/grading'
import type { PetFoodLight } from '@/lib/types'
import GradeBar from '@/components/GradeBar'
import SocialShare from '@/components/SocialShare'

const GRADE_COLOR: Record<string, string> = {
  A: 'text-green-600 font-black text-xl',
  B: 'text-lime-600 font-black text-xl',
  C: 'text-yellow-600 font-black text-xl',
  D: 'text-orange-600 font-black text-xl',
  F: 'text-red-600 font-black text-xl',
}

function Row({ label, values, rowIndex }: { label: string; values: React.ReactNode[]; rowIndex: number }) {
  const bg = rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
  return (
    <tr className={`border-t ${bg}`}>
      <td className="py-2 pr-4 text-xs text-gray-500 whitespace-nowrap">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="py-2 px-2 text-sm text-center">{v}</td>
      ))}
    </tr>
  )
}

export default function CompareContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const idsParam = searchParams.get('ids') ?? ''

  const ids = useMemo(
    () => Array.from(new Set(idsParam.split(',').filter(Boolean))).slice(0, 3),
    [idsParam]
  )

  const all = useMemo(() => loadFoodsLight(), [])
  const foods: PetFoodLight[] = useMemo(
    () => ids.map(id => all.find(f => f.id === id)).filter((f): f is PetFoodLight => f != null),
    [ids, all]
  )

  function removeFood(id: string) {
    const next = ids.filter(i => i !== id)
    router.replace(next.length > 0 ? `/compare?ids=${next.map(encodeURIComponent).join(',')}` : '/compare', { scroll: false })
  }

  if (foods.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl">
        <p className="text-4xl mb-4">⚖️</p>
        <p className="text-gray-500 mb-2 font-medium">ยังไม่มีรายการที่เลือก</p>
        <p className="text-sm text-gray-400 mb-6">ไปที่หน้าอาหาร แล้วกดปุ่ม <span className="font-bold text-orange-500">+</span> บนการ์ดอาหารที่ต้องการเปรียบเทียบ</p>
        <a href="/food" className="inline-block px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">
          ไปเลือกอาหาร →
        </a>
      </div>
    )
  }

  const cols = foods.length

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <a href="/food" className="text-sm text-gray-400 hover:text-gray-600">← กลับไปเลือกอาหาร</a>
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="bg-orange-50 text-orange-800 font-bold">
              <th className="text-left py-2 pr-4 w-28 text-xs font-bold">รายการ</th>
              {foods.map(f => (
                <th key={f.id} className="py-2 px-2 text-center align-top">
                  <p className="text-xs opacity-70">{f.brand}</p>
                  <a href={`/food/${f.slug}`} className="text-sm font-bold line-clamp-2 hover:underline block">
                    {f.name_th || f.name_en}
                  </a>
                  <button
                    onClick={() => removeFood(f.id)}
                    aria-label="นำออกจากการเปรียบเทียบ"
                    className="mt-1 text-[11px] text-orange-400 hover:text-orange-700 font-normal"
                  >
                    ✕ นำออก
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row rowIndex={0} label="เกรด" values={foods.map(f => {
              const g = getFoodGrade(f)
              return <span className={g ? GRADE_COLOR[g] : 'text-gray-300 font-black text-xl'}>{g ?? '—'}</span>
            })} />
            <Row rowIndex={1} label="ส่วนประกอบ" values={foods.map(f => (
              <GradeBar green={f.green_count} yellow={f.yellow_count} red={f.red_count} black={f.black_count} />
            ))} />
            <Row rowIndex={2} label="ราคา/กก." values={foods.map(f => (
              <span className="font-bold text-orange-600">฿{f.price_per_kg > 0 ? f.price_per_kg.toFixed(0) : '—'}</span>
            ))} />
            <Row rowIndex={3} label="โปรตีน" values={foods.map(f => f.protein_pct > 0 ? `${f.protein_pct}%` : '—')} />
            <Row rowIndex={4} label="ไขมัน"  values={foods.map(f => f.fat_pct > 0    ? `${f.fat_pct}%`     : '—')} />
            <Row rowIndex={5} label="ไฟเบอร์" values={foods.map(f => f.fiber_pct > 0  ? `${f.fiber_pct}%`   : '—')} />
            <Row rowIndex={6} label="ความชื้น" values={foods.map(f => f.moisture_pct > 0 ? `${f.moisture_pct}%` : '—')} />
            <Row rowIndex={7} label="AAFCO" values={foods.map(f => (
              <span className={f.aafco_meets ? 'text-green-600' : 'text-gray-400'}>
                {f.aafco_meets ? '✓ ผ่าน' : '—'}
              </span>
            ))} />
            <Row rowIndex={8} label="น้ำหนัก" values={foods.map(f => `${f.weight_kg} kg`)} />
            <Row rowIndex={9} label="ซื้อที่" values={foods.map(f => f.buy_url ? (
              <a href={f.buy_url} target="_blank" rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xs">ซื้อเลย →</a>
            ) : '—')} />
          </tbody>
        </table>
      </div>

      {cols < 3 && (
        <p className="text-sm text-gray-400 mt-4 text-center">
          เพิ่มได้อีก {3 - foods.length} รายการ → <a href="/food" className="text-orange-600 underline">ไปเลือกอาหาร</a>
        </p>
      )}

      {foods.length > 0 && <SocialShare title="เปรียบเทียบอาหารสัตว์เลี้ยง — ThailandPetHub" />}
    </div>
  )
}
