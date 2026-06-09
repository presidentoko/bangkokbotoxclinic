import type { PetFood } from '@/lib/types'
import type { FoodGrade } from '@/lib/types'
import { getFoodGrade } from '@/lib/petfood'

const GRADE_COLOR: Record<FoodGrade, string> = {
  A: 'text-green-600',
  B: 'text-lime-600',
  C: 'text-yellow-600',
  D: 'text-orange-600',
  F: 'text-red-600',
}

interface Props {
  foods: PetFood[]
}

export default function SimilarFoods({ foods }: Props) {
  if (!foods.length) return null

  return (
    <section>
      <h2 className="font-semibold mb-3">비슷한 사료</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {foods.map(f => {
          const grade = getFoodGrade(f)
          return (
            <a
              key={f.id}
              href={`/food/${f.id}`}
              className="flex-shrink-0 w-44 bg-white border rounded-xl p-3 hover:border-orange-300 transition-colors"
            >
              <p className="text-xs text-gray-400 mb-0.5">{f.brand}</p>
              <p className="text-sm font-medium leading-tight line-clamp-2 mb-2">
                {f.name_th || f.name_en}
              </p>
              {grade ? (
                <span className={`text-lg font-bold ${GRADE_COLOR[grade]}`}>{grade}</span>
              ) : (
                <span className="text-sm text-gray-400">분석 중</span>
              )}
            </a>
          )
        })}
      </div>
    </section>
  )
}
