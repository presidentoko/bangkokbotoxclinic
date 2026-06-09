'use client'
import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { filterFoods } from '@/lib/petfood'
import { getFoodGrade } from '@/lib/grading'
import type { Animal, LifeStage, PetProfile, PetFood } from '@/lib/types'
import FoodCard from '@/components/FoodCard'

function FoodContent() {
  const params = useSearchParams()

  const validateAnimal = (v: string | null): Animal | undefined =>
    v === 'dog' || v === 'cat' ? v : undefined
  const validateLifeStage = (v: string | null): LifeStage | undefined =>
    v === 'puppy' || v === 'adult' || v === 'senior' ? v : undefined

  const [query, setQuery]         = useState(params.get('q') ?? '')
  const [animal, setAnimal]       = useState<Animal | undefined>(validateAnimal(params.get('animal')))
  const [lifeStage, setLifeStage] = useState<LifeStage | undefined>(validateLifeStage(params.get('life_stage')))
  const [sort, setSort] = useState<'score' | 'price'>('score')
  const [grade, setGrade] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (params.get('animal') || params.get('life_stage')) return
    try {
      const raw = localStorage.getItem('petProfile')
      if (!raw) return
      const p = JSON.parse(raw) as PetProfile
      if (!params.get('animal'))     setAnimal(p.species)
      if (!params.get('life_stage')) setLifeStage(p.lifeStage)
    } catch {
      // ignore
    }
  // run only on mount; params is intentionally excluded because we want to
  // apply the saved profile once (at page load), not re-apply on every filter change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const foods = useMemo(() => {
    let result: PetFood[] = filterFoods({ animal, life_stage: lifeStage, query, sort })
    if (grade) {
      result = result.filter(f => {
        const g = getFoodGrade(f)
        return g === grade
      })
    }
    return result
  }, [animal, lifeStage, query, sort, grade])

  const toggle = <T,>(val: T, current: T | undefined, set: (v: T | undefined) => void) =>
    set(current === val ? undefined : val)

  const chipCls = (active: boolean) =>
    `px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer ${
      active ? 'bg-orange-500 text-white border-orange-500' : 'bg-white hover:bg-orange-50'
    }`

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">ตรวจสอบอาหารสัตว์เลี้ยง</h1>
      <div className="flex items-center justify-between mb-3">
        <a href="/food/best" className="text-sm text-orange-600 hover:underline font-medium">
          ⭐ ดูอาหารเกรด A/B →
        </a>
      </div>

      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="ค้นหาชื่อสินค้า หรือแบรนด์..."
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <button className={chipCls(animal === 'dog')} onClick={() => toggle('dog' as Animal, animal, setAnimal)}>🐕 สุนัข</button>
        <button className={chipCls(animal === 'cat')} onClick={() => toggle('cat' as Animal, animal, setAnimal)}>🐈 แมว</button>
        <button className={chipCls(lifeStage === 'puppy')} onClick={() => toggle('puppy' as LifeStage, lifeStage, setLifeStage)}>ลูก</button>
        <button className={chipCls(lifeStage === 'adult')} onClick={() => toggle('adult' as LifeStage, lifeStage, setLifeStage)}>ผู้ใหญ่</button>
        <button className={chipCls(lifeStage === 'senior')} onClick={() => toggle('senior' as LifeStage, lifeStage, setLifeStage)}>สูงวัย</button>
        <button className={chipCls(sort === 'price')} onClick={() => setSort(sort === 'price' ? 'score' : 'price')}>💰 ราคาต่ำสุด</button>
        {['A','B','C','D','F'].map(g => (
          <button key={g}
            className={chipCls(grade === g)}
            onClick={() => setGrade(grade === g ? undefined : g)}
          >
            เกรด {g}
          </button>
        ))}
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

export default function FoodPage() {
  return (
    <Suspense>
      <FoodContent />
    </Suspense>
  )
}
