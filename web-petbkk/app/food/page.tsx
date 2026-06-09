'use client'
import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { filterFoods, loadFoods, foodSlug } from '@/lib/petfood'
import { getFoodGrade } from '@/lib/grading'
import type { Animal, LifeStage, PetProfile, PetFood } from '@/lib/types'
import FoodCard from '@/components/FoodCard'
import RecentFoods from '@/components/RecentFoods'
import Link from 'next/link'

// ─── Grade A/B horizontal spotlight ──────────────────────────────────────────

function BestPicksStrip({ animal }: { animal?: Animal }) {
  const picks = useMemo(() => {
    const all = loadFoods()
    return all
      .filter(f => {
        if (animal && f.animal !== animal) return false
        const g = getFoodGrade(f)
        return g === 'A' || g === 'B'
      })
      .sort((a, b) => {
        const ga = getFoodGrade(a)
        const gb = getFoodGrade(b)
        if (ga !== gb) return ga === 'A' ? -1 : 1
        return b.green_count - a.green_count
      })
      .slice(0, 8)
  }, [animal])

  if (picks.length === 0) return null

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-900">⭐ แนะนำ เกรด A/B</h2>
        <Link href="/food/best" className="text-xs text-orange-500 hover:underline">ดูทั้งหมด →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
        {picks.map(food => {
          const g = getFoodGrade(food)
          const gradeCls = g === 'A'
            ? 'bg-green-500'
            : 'bg-lime-500'
          return (
            <Link
              key={food.id}
              href={`/food/${foodSlug(food)}`}
              className="flex-shrink-0 w-36 bg-white border rounded-2xl p-3 hover:shadow-md transition-shadow snap-start"
            >
              <div className={`w-10 h-10 rounded-xl ${gradeCls} flex items-center justify-center text-white font-black text-lg mb-2`}>
                {g}
              </div>
              <p className="text-[10px] text-gray-400 uppercase font-medium truncate">{food.brand}</p>
              <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight mt-0.5">{food.name_th || food.name_en}</p>
              <p className="text-xs text-orange-600 font-bold mt-1.5">
                {food.price_per_kg > 0 ? `฿${food.price_per_kg.toFixed(0)}/กก.` : ''}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

// ─── Animal picker hero ───────────────────────────────────────────────────────

function AnimalPicker({ value, onChange }: { value?: Animal; onChange: (v?: Animal) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {([
        { key: 'dog' as Animal, emoji: '🐕', label: 'สุนัข', sub: 'พันธุ์เล็ก–ใหญ่ ลูก–สูงวัย', bg: 'bg-amber-50', border: 'border-amber-200', active: 'bg-amber-500 border-amber-500 text-white' },
        { key: 'cat' as Animal, emoji: '🐈', label: 'แมว', sub: 'ในบ้าน กินยาก ดูแลพิเศษ', bg: 'bg-purple-50', border: 'border-purple-200', active: 'bg-purple-500 border-purple-500 text-white' },
      ] as const).map(({ key, emoji, label, sub, bg, border, active }) => {
        const isActive = value === key
        return (
          <button
            key={key}
            onClick={() => onChange(isActive ? undefined : key)}
            className={`rounded-2xl border-2 p-4 text-left transition-all ${isActive ? active : `${bg} ${border} hover:shadow-sm`}`}
          >
            <span className="text-3xl block mb-1">{emoji}</span>
            <p className={`font-bold text-base ${isActive ? 'text-white' : 'text-gray-900'}`}>{label}</p>
            <p className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>{sub}</p>
          </button>
        )
      })}
    </div>
  )
}

// ─── Life stage tab bar ───────────────────────────────────────────────────────

const STAGES: { key: LifeStage | 'all'; label: string; emoji: string }[] = [
  { key: 'all',    label: 'ทุกวัย',  emoji: '🐾' },
  { key: 'puppy',  label: 'ลูก',     emoji: '🍼' },
  { key: 'adult',  label: 'ผู้ใหญ่',  emoji: '💪' },
  { key: 'senior', label: 'สูงวัย',  emoji: '👴' },
]

function StageTabs({ value, onChange }: { value?: LifeStage; onChange: (v?: LifeStage) => void }) {
  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-0.5">
      {STAGES.map(s => (
        <button
          key={s.key}
          onClick={() => onChange(s.key === 'all' ? undefined : s.key as LifeStage)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
            (s.key === 'all' && !value) || value === s.key
              ? 'bg-orange-500 text-white border-orange-500 font-medium'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-orange-50'
          }`}
        >
          <span>{s.emoji}</span>
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Grade filter bar ─────────────────────────────────────────────────────────

const GRADE_META: Record<string, { bg: string; label: string }> = {
  A: { bg: 'bg-green-500',  label: 'ดีเยี่ยม' },
  B: { bg: 'bg-lime-500',   label: 'ดี' },
  C: { bg: 'bg-yellow-500', label: 'ปานกลาง' },
  D: { bg: 'bg-orange-500', label: 'ระวัง' },
  F: { bg: 'bg-red-500',    label: 'อันตราย' },
}

function GradeBar({ value, onChange }: { value?: string; onChange: (v?: string) => void }) {
  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-0.5">
      {Object.entries(GRADE_META).map(([g, meta]) => (
        <button
          key={g}
          onClick={() => onChange(value === g ? undefined : g)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
            value === g
              ? `${meta.bg} text-white border-transparent shadow-sm`
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${value === g ? 'bg-white/70' : meta.bg}`} />
          เกรด {g} · {meta.label}
        </button>
      ))}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function FoodContent() {
  const params = useSearchParams()

  const [query, setQuery]         = useState(params.get('q') ?? '')
  const [animal, setAnimal]       = useState<Animal | undefined>(
    params.get('animal') === 'dog' || params.get('animal') === 'cat' ? params.get('animal') as Animal : undefined
  )
  const [lifeStage, setLifeStage] = useState<LifeStage | undefined>(
    ['puppy','adult','senior'].includes(params.get('life_stage') ?? '') ? params.get('life_stage') as LifeStage : undefined
  )
  const [grade, setGrade]         = useState<string | undefined>(undefined)
  const [sort, setSort]           = useState<'score' | 'price'>('score')
  const [showAll, setShowAll]     = useState(false)

  // Auto-apply saved pet profile on mount
  useEffect(() => {
    if (params.get('animal') || params.get('life_stage')) return
    try {
      const raw = localStorage.getItem('petProfile')
      if (!raw) return
      const p = JSON.parse(raw) as PetProfile
      if (!params.get('animal'))     setAnimal(p.species)
      if (!params.get('life_stage')) setLifeStage(p.lifeStage)
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const foods = useMemo(() => {
    let result: PetFood[] = filterFoods({ animal, life_stage: lifeStage, query, sort })
    if (grade) result = result.filter(f => getFoodGrade(f) === grade)
    return result
  }, [animal, lifeStage, query, sort, grade])

  // Separate foods with/without ingredient data
  const { withData, withoutData } = useMemo(() => ({
    withData:    foods.filter(f => f.ingredients.length > 0),
    withoutData: foods.filter(f => f.ingredients.length === 0),
  }), [foods])

  const displayFoods = showAll ? foods : withData
  const hasQuery = query || grade || lifeStage

  return (
    <main>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1">🍖 เลือกอาหารให้น้อง</h1>
        <p className="text-sm text-gray-400">ตรวจสอบเกรดและส่วนประกอบ เพื่อสุขภาพที่ดีที่สุด</p>
      </div>

      {/* Animal picker */}
      <AnimalPicker value={animal} onChange={setAnimal} />

      {/* Best picks spotlight */}
      {!query && !grade && <BestPicksStrip animal={animal} />}

      {/* Recent */}
      <RecentFoods />

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-base">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ค้นหาชื่อสินค้า หรือแบรนด์..."
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-orange-400"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-sm"
          >✕</button>
        )}
      </div>

      {/* Life stage tabs */}
      <StageTabs value={lifeStage} onChange={setLifeStage} />

      {/* Grade filter + sort */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex-1 min-w-0">
          <GradeBar value={grade} onChange={setGrade} />
        </div>
        <button
          onClick={() => setSort(sort === 'price' ? 'score' : 'price')}
          className={`ml-2 flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
            sort === 'price' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          💰 ราคา
        </button>
      </div>

      {/* Results */}
      {displayFoods.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {displayFoods.map(food => <FoodCard key={food.id} food={food} />)}
          </div>

          {/* Show foods-without-data toggle */}
          {!showAll && withoutData.length > 0 && !hasQuery && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              + ดูอีก {withoutData.length} รายการที่กำลังเพิ่มข้อมูล
            </button>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-400">ไม่พบอาหารที่ตรงกับเงื่อนไข</p>
          <p className="text-sm text-gray-300 mt-1">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
        </div>
      )}
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
