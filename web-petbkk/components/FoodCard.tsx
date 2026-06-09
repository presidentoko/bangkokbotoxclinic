'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { PetFood } from '@/lib/types'
import GradeBar from './GradeBar'
import { getCompareIds, toggleCompare } from '@/lib/compare'

export default function FoodCard({ food }: { food: PetFood }) {
  const [inCompare, setInCompare] = useState(false)

  useEffect(() => {
    setInCompare(getCompareIds().includes(food.id))
    const handler = () => setInCompare(getCompareIds().includes(food.id))
    window.addEventListener('compareUpdate', handler)
    return () => window.removeEventListener('compareUpdate', handler)
  }, [food.id])

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleCompare(food.id)
    window.dispatchEvent(new Event('compareUpdate'))
  }

  return (
    <Link href={`/food/${food.id}`} className="relative block bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
      <p className="text-xs text-gray-400 mb-1">{food.brand}</p>
      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-sm leading-snug pr-8">
        {food.name_th || food.name_en}
      </h3>
      <GradeBar green={food.green_count} yellow={food.yellow_count} red={food.red_count} black={food.black_count} />
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-gray-500">{food.weight_kg}kg</span>
        <span className="text-sm font-bold text-orange-600">฿{food.price_per_kg > 0 ? food.price_per_kg.toFixed(0) : '—'}/kg</span>
      </div>
      <button
        onClick={handleToggle}
        title={inCompare ? 'ลบออกจากการเปรียบเทียบ' : 'เพิ่มเพื่อเปรียบเทียบ'}
        className={`absolute top-3 right-3 w-7 h-7 rounded-full text-xs font-bold transition-colors flex items-center justify-center ${
          inCompare
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-500'
        }`}
      >
        {inCompare ? '✓' : '+'}
      </button>
    </Link>
  )
}
