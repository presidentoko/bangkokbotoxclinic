'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { PetFood } from '@/lib/types'
import { getFoodGrade } from '@/lib/grading'
import { getCompareIds, toggleCompare } from '@/lib/compare'
import { foodSlug } from '@/lib/petfood'

const GRADE_STYLES: Record<string, { bg: string; text: string; border: string; labelBg: string }> = {
  A: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-500',  labelBg: 'bg-green-100' },
  B: { bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-500',   labelBg: 'bg-lime-100'  },
  C: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-500', labelBg: 'bg-yellow-100'},
  D: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-500', labelBg: 'bg-orange-100'},
  F: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-500',    labelBg: 'bg-red-100'   },
}

const GRADE_LABEL: Record<string, string> = {
  A: 'ดีมาก',
  B: 'ดี',
  C: 'พอใช้',
  D: 'ต่ำกว่ามาตรฐาน',
  F: 'หลีกเลี่ยง',
}

const FALLBACK_STYLE = { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-300', labelBg: 'bg-gray-100' }

// ─── Compare button (client-only, handles event) ────────────────────────────

function CompareButton({ foodId }: { foodId: string }) {
  const [inCompare, setInCompare] = useState(false)

  useEffect(() => {
    setInCompare(getCompareIds().includes(foodId))
    const handler = () => setInCompare(getCompareIds().includes(foodId))
    window.addEventListener('compareUpdate', handler)
    return () => window.removeEventListener('compareUpdate', handler)
  }, [foodId])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleCompare(foodId)
    window.dispatchEvent(new Event('compareUpdate'))
  }

  return (
    <button
      onClick={handleClick}
      className={
        inCompare
          ? 'border-t border-orange-100 px-4 py-2.5 text-xs text-orange-600 bg-orange-50 font-medium w-full text-left transition-colors'
          : 'border-t border-gray-100 px-4 py-2.5 text-xs text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition-colors w-full text-left'
      }
    >
      {inCompare ? '✓ กำลังเปรียบเทียบ' : '+ เพิ่มเปรียบเทียบ'}
    </button>
  )
}

// ─── Main card ───────────────────────────────────────────────────────────────

export default function FoodCard({ food }: { food: PetFood }) {
  const gradeKey = getFoodGrade(food)
  const grade = gradeKey ?? '?'
  const style = gradeKey ? (GRADE_STYLES[gradeKey] ?? FALLBACK_STYLE) : FALLBACK_STYLE
  const label = gradeKey ? (GRADE_LABEL[gradeKey] ?? '') : 'ยังไม่มีข้อมูล'

  return (
    <div
      className={`bg-white rounded-2xl border-l-4 ${style.border} shadow-sm hover:shadow-md transition-all group overflow-hidden`}
    >
      <Link href={`/food/${foodSlug(food)}`} className="block p-4">
        {/* Grade badge + brand / name row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Grade circle */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center ${style.labelBg}`}
          >
            <span className={`text-xl font-black leading-none ${style.text}`}>{grade}</span>
            <span className={`text-[9px] font-semibold leading-none mt-0.5 ${style.text} opacity-80`}>
              {label}
            </span>
          </div>

          {/* Brand + name */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide truncate">
              {food.brand}
            </p>
            <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
              {food.name_th || food.name_en}
            </p>
          </div>
        </div>

        {/* Ingredient colour bar */}
        {(() => {
          const total = food.green_count + food.yellow_count + food.red_count + food.black_count
          if (total === 0) return null
          return (
            <div className="flex h-1.5 rounded-full overflow-hidden gap-px mb-3">
              {food.green_count  > 0 && <div className="bg-green-400"  style={{ flex: food.green_count  }} />}
              {food.yellow_count > 0 && <div className="bg-yellow-400" style={{ flex: food.yellow_count }} />}
              {food.red_count    > 0 && <div className="bg-red-400"    style={{ flex: food.red_count    }} />}
              {food.black_count  > 0 && <div className="bg-gray-800"   style={{ flex: food.black_count  }} />}
            </div>
          )
        })()}

        {/* Stats row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="text-orange-500">฿</span>
            <span className="font-semibold text-gray-700">
              {food.price_per_kg > 0 ? food.price_per_kg.toFixed(0) : '—'}
            </span>
            /กก.
          </span>
          {food.protein_pct > 0 && (
            <span className="flex items-center gap-1">
              <span>🥩</span>
              <span className="font-semibold text-gray-700">{food.protein_pct}%</span>
              โปรตีน
            </span>
          )}
          {food.aafco_meets && (
            <span className="ml-auto text-green-600 font-medium">✓ AAFCO</span>
          )}
        </div>
      </Link>

      {/* Compare button — separate from Link to avoid nested interactivity */}
      <CompareButton foodId={food.id} />
    </div>
  )
}
