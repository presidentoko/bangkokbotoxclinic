'use client'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { filterHospitals } from '@/lib/hospitals'
import HospitalCard from '@/components/HospitalCard'
import dynamic from 'next/dynamic'

const HospitalMap = dynamic(() => import('@/components/HospitalMap'), { ssr: false })

export default function HospitalPage() {
  const params = useSearchParams()
  const filterParam = params.get('filter') ?? ''

  const [query, setQuery]   = useState(params.get('q') ?? '')
  const [filters, setFilters] = useState({
    is_24h:        filterParam === '24h',
    has_emergency: filterParam === 'emergency',
    has_surgery:   filterParam === 'surgery',
  })
  const [view, setView] = useState<'map' | 'list'>('map')

  const hospitals = useMemo(() => {
    let result = filterHospitals(filters)
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(h =>
        h.name_th.toLowerCase().includes(q) ||
        h.name_en.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q)
      )
    }
    return result
  }, [filters, query])

  const toggle = (key: keyof typeof filters) =>
    setFilters(f => ({ ...f, [key]: !f[key] }))

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">โรงพยาบาลสัตว์ในกรุงเทพ</h1>

      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="ค้นหาชื่อโรงพยาบาล หรือที่อยู่..."
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      />

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
