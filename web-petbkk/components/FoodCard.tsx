import Link from 'next/link'
import type { PetFood } from '@/lib/types'
import GradeBar from './GradeBar'

export default function FoodCard({ food }: { food: PetFood }) {
  return (
    <Link
      href={`/food/${food.id}`}
      className="block bg-white border rounded-xl p-4 hover:shadow-md transition-shadow"
    >
      <p className="text-xs text-gray-400 mb-1">{food.brand}</p>
      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-sm leading-snug">
        {food.name_th || food.name_en}
      </h3>
      <GradeBar
        green={food.green_count}
        yellow={food.yellow_count}
        red={food.red_count}
        black={food.black_count}
      />
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-gray-500">{food.weight_kg}kg</span>
        <span className="text-sm font-bold text-orange-600">
          ฿{food.price_per_kg > 0 ? food.price_per_kg.toFixed(0) : '—'}/kg
        </span>
      </div>
    </Link>
  )
}
