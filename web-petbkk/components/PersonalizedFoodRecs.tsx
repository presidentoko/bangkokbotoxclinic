'use client'
import { useState, useEffect, useMemo } from 'react'
import { filterFoodsLight, getFoodGrade } from '@/lib/petfood'
import type { PetProfile } from '@/lib/types'
import FoodCard from './FoodCard'

const GRADE_ORDER: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, F: 4 }

export default function PersonalizedFoodRecs() {
  const [profile, setProfile] = useState<PetProfile | null>(null)

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem('petProfile')
        setProfile(raw ? (JSON.parse(raw) as PetProfile) : null)
      } catch {}
    }
    read()
    window.addEventListener('petProfileUpdate', read)
    return () => window.removeEventListener('petProfileUpdate', read)
  }, [])

  const recs = useMemo(() => {
    if (!profile) return []
    const foods = filterFoodsLight({ animal: profile.species, life_stage: profile.lifeStage })
    return foods
      .map(f => ({ f, g: getFoodGrade(f) }))
      .sort((a, b) => {
        const ao = a.g ? (GRADE_ORDER[a.g] ?? 99) : 99
        const bo = b.g ? (GRADE_ORDER[b.g] ?? 99) : 99
        return ao - bo
      })
      .slice(0, 4)
      .map(x => x.f)
  }, [profile])

  if (!profile || recs.length === 0) return null

  return (
    <div className="w-full max-w-2xl mb-8">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        อาหารแนะนำสำหรับ {profile.name} 🐾
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {recs.map(food => (
          <div key={food.id} className="flex-shrink-0 w-48">
            <FoodCard food={food} />
          </div>
        ))}
      </div>
    </div>
  )
}
