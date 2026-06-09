'use client'
import { useState, useEffect } from 'react'
import { getRecentFoodIds } from '@/lib/recentFoods'
import { loadFoods } from '@/lib/petfood'
import type { PetFood } from '@/lib/types'
import FoodCard from './FoodCard'

export default function RecentFoods() {
  const [foods, setFoods] = useState<PetFood[]>([])

  useEffect(() => {
    const ids = getRecentFoodIds()
    if (ids.length === 0) return
    const all = loadFoods()
    const recent = ids
      .map(id => all.find(f => f.id === id))
      .filter((f): f is PetFood => f != null)
    setFoods(recent)
  }, [])

  if (foods.length === 0) return null

  return (
    <div className="w-full max-w-2xl mb-6">
      <h2 className="text-sm font-semibold text-gray-500 mb-3">ที่ดูล่าสุด</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {foods.map(food => (
          <div key={food.id} className="flex-shrink-0 w-44">
            <FoodCard food={food} />
          </div>
        ))}
      </div>
    </div>
  )
}
