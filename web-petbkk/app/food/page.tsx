'use client'
import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { filterFoods } from '@/lib/petfood'
import { getFoodGrade } from '@/lib/grading'
import type { Animal, LifeStage, PetProfile, PetFood } from '@/lib/types'
import FoodCard from '@/components/FoodCard'
import RecentFoods from '@/components/RecentFoods'

const GRADE_ACTIVE_CLS: Record<string, string> = {
  A: 'bg-green-500  text-white border-green-500',
  B: 'bg-lime-500   text-white border-lime-500',
  C: 'bg-yellow-500 text-white border-yellow-500',
  D: 'bg-orange-500 text-white border-orange-500',
  F: 'bg-red-500    text-white border-red-500',
}

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

  const gradeChipCls = (g: string) => {
    const active = grade === g
    return `px-3 py-1.5 rounded-full border text-sm font-semibold transition-colors cursor-pointer ${
      active ? GRADE_ACTIVE_CLS[g] : 'bg-white hover:bg-gray-50'
    }`
  }

  return (
    <main>
      <h1 className="text-2xl font-black text-gray-900 mb-1">🍖 ตรวจสอบอาหารสัตว์เลี้ยง</h1>
      <p className="text-sm text-gray-400 mb-6">ตรวจสอบเกรดและส่วนประกอบ เพื่อสุขภาพที่ดีของน้อง</p>

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
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-orange-400 mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {/* Animal chips */}
        <button
          className={`px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer ${
            animal === 'dog' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white hover:bg-orange-50'
          }`}
          onClick={() => toggle('dog' as Animal, animal, setAnimal)}
        >
          🐕 สุนัข
        </button>
        <button
          className={`px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer ${
            animal === 'cat' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white hover:bg-orange-50'
          }`}
          onClick={() => toggle('cat' as Animal, animal, setAnimal)}
        >
          🐈 แมว
        </button>

        {/* Life stage chips */}
        <button className={chipCls(lifeStage === 'puppy')}  onClick={() => toggle('puppy'  as LifeStage, lifeStage, setLifeStage)}>ลูก</button>
        <button className={chipCls(lifeStage === 'adult')}  onClick={() => toggle('adult'  as LifeStage, lifeStage, setLifeStage)}>ผู้ใหญ่</button>
        <button className={chipCls(lifeStage === 'senior')} onClick={() => toggle('senior' as LifeStage, lifeStage, setLifeStage)}>สูงวัย</button>

        {/* Sort chip */}
        <button
          className={`px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer ${
            sort === 'price' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white hover:bg-orange-50'
          }`}
          onClick={() => setSort(sort === 'price' ? 'score' : 'price')}
        >
          💰 ราคาต่ำสุด
        </button>

        {/* Grade chips — color-coded */}
        {['A', 'B', 'C', 'D', 'F'].map(g => (
          <button
            key={g}
            className={gradeChipCls(g)}
            onClick={() => setGrade(grade === g ? undefined : g)}
          >
            เกรด {g}
          </button>
        ))}
      </div>

      <RecentFoods />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {foods.length > 0
          ? foods.map(food => <FoodCard key={food.id} food={food} />)
          : (
            <div className="col-span-full py-16 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-400">ไม่พบอาหารที่ตรงกับเงื่อนไข</p>
              <p className="text-sm text-gray-300 mt-1">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
            </div>
          )
        }
      </div>
    </main>
  )
}

export default function FoodPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">กำลังโหลด...</div>}>
      <FoodContent />
    </Suspense>
  )
}
