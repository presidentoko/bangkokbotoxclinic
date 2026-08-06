'use client'
import { useState, useEffect } from 'react'
import { isFoodSaved, toggleSavedFood } from '@/lib/savedFoods'

interface Props {
  foodId: string
  size?: 'sm' | 'md'
}

export default function SaveFoodButton({ foodId, size = 'sm' }: Props) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isFoodSaved(foodId))
    const handler = () => setSaved(isFoodSaved(foodId))
    window.addEventListener('savedFoodsUpdate', handler)
    return () => window.removeEventListener('savedFoodsUpdate', handler)
  }, [foodId])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleSavedFood(foodId)
    window.dispatchEvent(new Event('savedFoodsUpdate'))
  }

  // Uniform 44px box either way — below that the tap target fails a11y minimums.
  const dim = size === 'sm' ? 'w-11 h-11 text-base' : 'w-11 h-11 text-lg'

  return (
    <button
      onClick={handleClick}
      title={saved ? 'ลบออกจากรายการบันทึก' : 'บันทึกอาหาร'}
      aria-label={saved ? 'ลบอาหารออกจากรายการบันทึก' : 'บันทึกอาหารนี้'}
      aria-pressed={saved}
      className={`${dim} flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
        saved ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-400 bg-white'
      }`}
    >
      {saved ? '❤️' : '🤍'}
    </button>
  )
}
