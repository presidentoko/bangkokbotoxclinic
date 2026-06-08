'use client'
import { useState } from 'react'
import { filterHospitals } from '@/lib/hospitals'
import HospitalCard from '@/components/HospitalCard'
import dynamic from 'next/dynamic'

const HospitalMap = dynamic(() => import('@/components/HospitalMap'), { ssr: false })

export default function HospitalPage() {
  const [filters, setFilters] = useState({ is_24h: false, has_emergency: false, has_surgery: false })
  const [view, setView] = useState<'map' | 'list'>('map')

  const hospitals = filterHospitals(filters)

  const toggle = (key: keyof typeof filters) =>
    setFilters(f => ({ ...f, [key]: !f[key] }))

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">โรงพยาบาลสัตว์ในกรุงเทพ</h1>

      <div className="flex gap-2 mb-4">
        {(['map', 'list'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              view === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-blue-50'
            }`}
          >
            {v === 'map' ? '🗺️ แผนที่' : '📋 รายการ'}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'is_24h' as const, label: '⏰ 24 ชั่วโมง' },
          { key: 'has_emergency' as const, label: '🚨 ฉุกเฉิน' },
          { key: 'has_surgery' as const, label: '🔪 ผ่าตัด' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => toggle(f.key)}
            className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
              filters[f.key]
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white hover:bg-blue-50'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="text-sm text-gray-400 self-center">{hospitals.length} แห่ง</span>
      </div>

      {view === 'map' ? (
        <HospitalMap hospitals={hospitals} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map(h => <HospitalCard key={h.id} hospital={h} />)}
        </div>
      )}
    </main>
  )
}
