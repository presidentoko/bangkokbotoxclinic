import type { FoodGrade } from '@/lib/types'
import type { Alternative } from '@/lib/alternatives'

const GRADE_BG: Record<FoodGrade, string> = {
  A: 'bg-green-500',
  B: 'bg-lime-500',
  C: 'bg-yellow-500',
  D: 'bg-orange-500',
  F: 'bg-red-500',
}

interface Props {
  alternatives: Alternative[]
  /** Grade of the food being viewed, for the heading. */
  currentGrade: FoodGrade | null
}

/**
 * The upgrade path out of a mediocre grade.
 *
 * Placed directly under the ingredient panel, because that is the moment the
 * visitor has just learned the food is a C and has nowhere to go.
 */
export default function BetterAlternatives({ alternatives, currentGrade }: Props) {
  if (!alternatives.length) return null

  return (
    <section className="mb-4 bg-white border rounded-xl p-4">
      <h2 className="text-base font-bold text-gray-900 mb-1">
        {currentGrade
          ? `อาหารที่เกรดดีกว่า ${currentGrade} ในราคาใกล้เคียงกัน`
          : 'อาหารเกรดดีในแบบเดียวกัน'}
      </h2>
      <p className="text-xs text-gray-400 mb-3">
        ชนิดเดียวกัน (เม็ด/เปียก) สำหรับสัตว์ชนิดเดียวกัน เรียงตามความใกล้เคียงของราคาต่อกิโลกรัม
      </p>

      <ul className="space-y-2">
        {alternatives.map(a => (
          <li key={a.food.id}>
            <a
              href={`/food/${a.slug}`}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50/40 transition-colors"
            >
              <span
                className={`w-9 h-9 rounded-full ${GRADE_BG[a.grade]} text-white font-black text-sm flex items-center justify-center flex-shrink-0`}
              >
                {a.grade}
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-gray-400">{a.food.brand}</span>
                <span className="block text-sm font-medium text-gray-800 leading-tight line-clamp-2">
                  {a.food.name_th || a.food.name_en}
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  {a.reasons.join(' · ')}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href="/compare"
        className="mt-3 inline-block text-xs font-semibold text-orange-600 hover:underline"
      >
        เทียบแบบเคียงข้างกัน →
      </a>
    </section>
  )
}
