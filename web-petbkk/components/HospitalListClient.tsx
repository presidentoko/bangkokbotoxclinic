'use client'
import { useState, useMemo } from 'react'
import { filterHospitals, haversineKm } from '@/lib/hospitals'
import type { Hospital } from '@/lib/types'
import HospitalCard from '@/components/HospitalCard'
import NearMeButton from '@/components/NearMeButton'
import dynamic from 'next/dynamic'

const HospitalMap = dynamic(() => import('@/components/HospitalMap'), { ssr: false })

interface UserLoc { lat: number; lng: number }

interface Props {
  initialFilter?: 'emergency' | '24h' | 'surgery'
  initialQuery?: string
}

export default function HospitalListClient({ initialFilter, initialQuery = '' }: Props) {
  const [query, setQuery]   = useState(initialQuery)
  const [filters, setFilters] = useState({
    is_24h:        initialFilter === '24h',
    has_emergency: initialFilter === 'emergency',
    has_surgery:   initialFilter === 'surgery',
  })
  const [view, setView]       = useState<'map' | 'list'>('list')
  const [userLoc, setUserLoc] = useState<UserLoc | null>(null)

  const hospitalsWithDist = useMemo(() => {
    let result = filterHospitals(filters)
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((h: Hospital) =>
        h.name_th.toLowerCase().includes(q) ||
        h.name_en.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q)
      )
    }
    if (userLoc) {
      return result
        .map((h: Hospital) => ({ h, distKm: haversineKm(userLoc.lat, userLoc.lng, h.lat, h.lng) }))
        .sort((a: { distKm: number }, b: { distKm: number }) => a.distKm - b.distKm)
    }
    return result.map((h: Hospital) => ({ h, distKm: undefined as number | undefined }))
  }, [filters, query, userLoc])

  const toggle = (key: keyof typeof filters) =>
    setFilters(f => ({ ...f, [key]: !f[key] }))

  const FILTER_CHIPS = [
    { key: 'is_24h' as const,       label: '⏰ 24 ชั่วโมง', activeClass: 'bg-red-500 text-white border-red-500' },
    { key: 'has_emergency' as const, label: '🚨 ฉุกเฉิน',    activeClass: 'bg-orange-500 text-white border-orange-500' },
    { key: 'has_surgery' as const,   label: '🔪 ผ่าตัด',     activeClass: 'bg-blue-500 text-white border-blue-500' },
  ]

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="ค้นหาชื่อโรงพยาบาล หรือที่อยู่..."
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      />

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 mb-4 flex items-center gap-3">
        <NearMeButton
          active={userLoc != null}
          onLocation={(lat, lng) => { setUserLoc({ lat, lng }); setView('list') }}
          onClear={() => setUserLoc(null)}
        />
        <p className="text-sm text-gray-500">ค้นหาโรงพยาบาลใกล้ที่ตั้งของคุณ</p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['map', 'list'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${view === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-blue-50'}`}>
            {v === 'map' ? '🗺️ แผนที่' : '📋 รายการ'}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {FILTER_CHIPS.map(f => (
          <button key={f.key} onClick={() => toggle(f.key)}
            className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${filters[f.key] ? f.activeClass : 'bg-white hover:bg-blue-50'}`}>
            {f.label}
          </button>
        ))}
        <span className="text-sm text-gray-400 self-center">{hospitalsWithDist.length} แห่ง</span>
      </div>

      {view === 'map' ? (
        <HospitalMap hospitals={hospitalsWithDist.map((x: { h: Hospital }) => x.h)} />
      ) : hospitalsWithDist.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-4xl mb-3">🏥</p>
          <p className="text-gray-400 font-medium">ไม่พบโรงพยาบาลที่ตรงกับเงื่อนไข</p>
          <p className="text-sm text-gray-300 mt-1">ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitalsWithDist.map(({ h, distKm }: { h: Hospital; distKm: number | undefined }) => (
            <HospitalCard key={h.id} hospital={h} distanceKm={distKm} />
          ))}
        </div>
      )}
    </>
  )
}
