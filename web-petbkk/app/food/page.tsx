'use client'
import { useState, useMemo } from 'react'
import { filterFoods } from '@/lib/petfood'
import type { Animal, LifeStage } from '@/lib/types'
import FoodCard from '@/components/FoodCard'

export default function FoodPage() {
  const [animal, setAnimal] = useState<Animal | undefined>()
  const [lifeStage, setLifeStage] = useState<LifeStage | undefined>()
  const [sort, setSort] = useState<'score' | 'price'>('score')

  const foods = useMemo(
    () => filterFoods({ animal, life_stage: lifeStage, sort }),
    [animal, lifeStage, sort]
  )

  const toggle = <T,>(val: T, current: T | undefined, set: (v: T | undefined) => void) =>
    set(current === val ? undefined : val)

  const chipCls = (active: boolean) =>
    `px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer ${
      active ? 'bg-orange-500 text-white border-orange-500' : 'bg-white hover:bg-orange-50'
    }`

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">ตรวจสอบอาหารสัตว์เลี้ยง</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <button className={chipCls(animal === 'dog')} onClick={() => toggle('dog' as Animal, animal, setAnimal)}>
          🐕 สุนัข
        </button>
        <button className={chipCls(animal === 'cat')} onClick={() => toggle('cat' as Animal, animal, setAnimal)}>
          🐈 แมว
        </button>
        <button className={chipCls(lifeStage === 'puppy')} onClick={() => toggle('puppy' as LifeStage, lifeStage, setLifeStage)}>
          ลูก
        </button>
        <button className={chipCls(lifeStage === 'adult')} onClick={() => toggle('adult' as LifeStage, lifeStage, setLifeStage)}>
          ผู้ใหญ่
        </button>
        <button className={chipCls(lifeStage === 'senior')} onClick={() => toggle('senior' as LifeStage, lifeStage, setLifeStage)}>
          สูงวัย
        </button>
        <button className={chipCls(sort === 'price')} onClick={() => setSort(sort === 'price' ? 'score' : 'price')}>
          💰 ราคาต่ำสุด
        </button>
      </div>

      {foods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map(food => <FoodCard key={food.id} food={food} />)}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-16">ไม่พบข้อมูล</p>
      )}
    </main>
  )
}
