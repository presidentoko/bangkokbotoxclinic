'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import { loadFoods, getFoodGrade, foodSlug } from '@/lib/petfood'

const GRADE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  A: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-400' },
  B: { bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-400'  },
  C: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-400'},
}

export default function PopularFoods() {
  const foods = useMemo(() => {
    return loadFoods()
      .map(f => ({ f, grade: getFoodGrade(f) }))
      .filter(x => x.grade === 'A' || x.grade === 'B')
      .sort((a, b) =>
        b.f.green_count - a.f.green_count ||
        (a.f.red_count + a.f.black_count) - (b.f.red_count + b.f.black_count)
      )
      .slice(0, 8)
  }, [])

  if (foods.length === 0) return null

  return (
    <div className="max-w-2xl mx-auto px-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-black text-gray-800 flex items-center gap-2">
          <span className="w-1 h-5 bg-green-400 rounded-full inline-block"></span>
          อาหารเกรด A แนะนำ
        </h2>
        <a href="/food/best" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
          ดูทั้งหมด →
        </a>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        {foods.map(({ f, grade }) => {
          const style = grade ? (GRADE_STYLES[grade] ?? GRADE_STYLES.C) : GRADE_STYLES.C
          const total = f.green_count + f.yellow_count + f.red_count + f.black_count
          return (
            <Link
              key={f.id}
              href={`/food/${foodSlug(f)}`}
              className={`flex-shrink-0 w-40 bg-white rounded-xl border-l-4 ${style.border} shadow-sm hover:shadow-md transition-all p-3 block`}
            >
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${style.bg} mb-2`}>
                <span className={`text-sm font-black ${style.text}`}>{grade}</span>
                <span className={`text-[10px] ${style.text} opacity-70`}>เกรด</span>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide truncate">{f.brand}</p>
              <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mt-0.5">{f.name_th || f.name_en}</p>
              {total > 0 && (
                <div className="flex h-1 rounded-full overflow-hidden gap-px mt-2">
                  {f.green_count  > 0 && <div className="bg-green-400"  style={{ flex: f.green_count  }} />}
                  {f.yellow_count > 0 && <div className="bg-yellow-400" style={{ flex: f.yellow_count }} />}
                  {f.red_count    > 0 && <div className="bg-red-400"    style={{ flex: f.red_count    }} />}
                  {f.black_count  > 0 && <div className="bg-gray-800"   style={{ flex: f.black_count  }} />}
                </div>
              )}
              {f.price_per_kg > 0 && (
                <p className="text-[10px] text-gray-400 mt-1.5">฿{f.price_per_kg.toFixed(0)}/กก.</p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
