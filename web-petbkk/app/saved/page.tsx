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
      <h1 className="text-2xl font-black text-gray-900 mb-1">❤️ โรงพยาบาลที่บันทึก</h1>
      <p className="text-sm text-gray-400 mb-6">โรงพยาบาลที่คุณบันทึกไว้</p>
      {hospitals.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-5xl mb-4">❤️</p>
          <p className="text-gray-500 font-medium mb-1">ยังไม่มีโรงพยาบาลที่บันทึก</p>
          <p className="text-sm text-gray-400 mb-6">กดไอคอนหัวใจ ❤️ บนการ์ดโรงพยาบาลเพื่อบันทึก</p>
          <a href="/hospital" className="inline-block px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm">
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
    </main>
  )
}
