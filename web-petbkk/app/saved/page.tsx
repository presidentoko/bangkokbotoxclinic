'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSavedIds } from '@/lib/savedHospitals'
import { getSavedFoodIds } from '@/lib/savedFoods'
import { loadHospitals } from '@/lib/hospitals'
import { loadFoodsLight, getFoodGrade } from '@/lib/petfood'
import HospitalCard from '@/components/HospitalCard'
import type { Hospital, PetFoodLight } from '@/lib/types'

const GRADE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  A: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-400' },
  B: { bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-400'  },
  C: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-400'},
  D: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-400'},
  F: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-400'   },
}
const GRADE_LABEL: Record<string, string> = { A:'ดีมาก', B:'ดี', C:'พอใช้', D:'ต่ำกว่ามาตรฐาน', F:'หลีกเลี่ยง' }

export default function SavedPage() {
  const [tab, setTab] = useState<'hospital' | 'food'>('hospital')
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [foods, setFoods] = useState<PetFoodLight[]>([])
  const [ready, setReady] = useState(false)

  const allHospitals = loadHospitals()
  const allFoods = loadFoodsLight()

  useEffect(() => {
    const loadAll = () => {
      const hIds = getSavedIds()
      setHospitals(allHospitals.filter(h => hIds.includes(h.id)))
      const fIds = getSavedFoodIds()
      setFoods(allFoods.filter(f => fIds.includes(f.id)))
    }
    loadAll()
    setReady(true)
    window.addEventListener('savedHospitalsUpdate', loadAll)
    window.addEventListener('savedFoodsUpdate', loadAll)
    return () => {
      window.removeEventListener('savedHospitalsUpdate', loadAll)
      window.removeEventListener('savedFoodsUpdate', loadAll)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Saved ids live in localStorage, so the first paint has nothing to show —
  // a skeleton keeps the layout stable instead of flashing an empty page.
  if (!ready) return (
    <main className="animate-pulse">
      <div className="h-8 w-56 bg-gray-100 rounded-lg mb-2" />
      <div className="h-4 w-72 bg-gray-100 rounded mb-5" />
      <div className="flex gap-2 mb-6">
        <div className="h-10 w-36 bg-gray-100 rounded-xl" />
        <div className="h-10 w-28 bg-gray-100 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
      </div>
    </main>
  )

  return (
    <main>
      <h1 className="text-2xl font-black text-gray-900 mb-1">❤️ รายการที่บันทึก</h1>
      <p className="text-sm text-gray-400 mb-5">โรงพยาบาลและอาหารที่คุณบันทึกไว้</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('hospital')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === 'hospital'
              ? 'bg-blue-500 text-white'
              : 'bg-white border text-gray-600 hover:border-blue-300'
          }`}
        >
          🏥 โรงพยาบาล {hospitals.length > 0 && <span className="ml-1 opacity-80">({hospitals.length})</span>}
        </button>
        <button
          onClick={() => setTab('food')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === 'food'
              ? 'bg-orange-500 text-white'
              : 'bg-white border text-gray-600 hover:border-orange-300'
          }`}
        >
          🍖 อาหาร {foods.length > 0 && <span className="ml-1 opacity-80">({foods.length})</span>}
        </button>
      </div>

      {/* Hospital tab */}
      {tab === 'hospital' && (
        <>
          {hospitals.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-5xl mb-4">🏥</p>
              <p className="text-gray-500 font-medium mb-1">ยังไม่มีโรงพยาบาลที่บันทึก</p>
              <p className="text-sm text-gray-400 mb-6">กดไอคอนหัวใจ ❤️ บนการ์ดโรงพยาบาลเพื่อบันทึก</p>
              <a href="/hospital" className="inline-block px-6 py-2.5 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors text-sm">
                ค้นหาโรงพยาบาล →
              </a>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-4">{hospitals.length} โรงพยาบาลที่บันทึก</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hospitals.map(h => <HospitalCard key={h.id} hospital={h} />)}
              </div>
            </>
          )}
        </>
      )}

      {/* Food tab */}
      {tab === 'food' && (
        <>
          {foods.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-5xl mb-4">🍖</p>
              <p className="text-gray-500 font-medium mb-1">ยังไม่มีอาหารที่บันทึก</p>
              <p className="text-sm text-gray-400 mb-6">กดไอคอนหัวใจ ❤️ บนการ์ดอาหารเพื่อบันทึก</p>
              <a href="/food" className="inline-block px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm">
                ตรวจสอบอาหาร →
              </a>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-4">{foods.length} อาหารที่บันทึก</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {foods.map(f => {
                  const grade = getFoodGrade(f)
                  const style = grade ? (GRADE_STYLES[grade] ?? GRADE_STYLES.C) : { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-300' }
                  const label = grade ? (GRADE_LABEL[grade] ?? '') : '?'
                  return (
                    <Link key={f.id} href={`/food/${f.slug}`}
                      className={`bg-white rounded-2xl border-l-4 ${style.border} shadow-sm hover:shadow-md transition-all p-4 block`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center ${style.bg}`}>
                          <span className={`text-xl font-black leading-none ${style.text}`}>{grade ?? '?'}</span>
                          <span className={`text-[9px] font-semibold leading-none mt-0.5 ${style.text} opacity-80`}>{label}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide truncate">{f.brand}</p>
                          <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{f.name_th || f.name_en}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        {f.price_per_kg > 0 && (
                          <span>฿ <span className="font-semibold text-gray-700">{f.price_per_kg.toFixed(0)}</span>/กก.</span>
                        )}
                        {f.protein_pct > 0 && (
                          <span>🥩 <span className="font-semibold text-gray-700">{f.protein_pct}%</span> โปรตีน</span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </main>
  )
}
