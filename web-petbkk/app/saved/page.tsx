'use client'
import { useState, useEffect } from 'react'
import { getSavedIds } from '@/lib/savedHospitals'
import { loadHospitals } from '@/lib/hospitals'
import HospitalCard from '@/components/HospitalCard'
import type { Hospital } from '@/lib/types'

export default function SavedPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [ready, setReady] = useState(false)
  const all = loadHospitals()

  useEffect(() => {
    const load = () => {
      const ids = getSavedIds()
      setHospitals(all.filter(h => ids.includes(h.id)))
    }
    load()
    setReady(true)
    window.addEventListener('savedHospitalsUpdate', load)
    return () => window.removeEventListener('savedHospitalsUpdate', load)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!ready) return null

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">โรงพยาบาลที่บันทึกไว้ ❤️</h1>
      {hospitals.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">ยังไม่มีโรงพยาบาลที่บันทึก</p>
          <a href="/hospital" className="text-orange-500 hover:underline">← ค้นหาโรงพยาบาล</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map(h => <HospitalCard key={h.id} hospital={h} />)}
        </div>
      )}
    </main>
  )
}
