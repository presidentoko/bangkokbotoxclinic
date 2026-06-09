'use client'
import { useEffect } from 'react'
import { addRecentFood } from '@/lib/recentFoods'

export default function TrackRecentFood({ foodId }: { foodId: string }) {
  useEffect(() => {
    addRecentFood(foodId)
  }, [foodId])

  return null
}
