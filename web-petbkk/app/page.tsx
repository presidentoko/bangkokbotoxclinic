'use client'
import { useRouter } from 'next/navigation'
import SearchBar from '@/components/SearchBar'
import PetProfileSetup from '@/components/PetProfileSetup'
import PersonalizedFoodRecs from '@/components/PersonalizedFoodRecs'

const FOOD_CHIPS = [
  { label: 'Royal Canin', href: '/food?q=royal+canin' },
  { label: '🐕 ลูกสุนัข', href: '/food?animal=dog&life_stage=puppy' },
  { label: '🐈 แมว', href: '/food?animal=cat' },
]

const HOSPITAL_CHIPS = [
  { label: '⏰ 24 ชั่วโมง', href: '/hospital?filter=24h' },
  { label: '🚨 ฉุกเฉิน', href: '/hospital?filter=emergency' },
  { label: '🔪 ผ่าตัด', href: '/hospital?filter=surgery' },
]

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="flex flex-col items-center py-16 px-4">
      <div className="mb-2 text-4xl">🐾</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">PetBKK</h1>
      <p className="text-gray-400 text-sm mb-10">
        ตรวจสอบอาหาร · หาโรงพยาบาลสัตว์เลี้ยงในกรุงเทพ
      </p>

      <PetProfileSetup />

      <PersonalizedFoodRecs />

      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <SearchBar
          icon="🐾"
          placeholder="ค้นหาอาหารสัตว์เลี้ยง..."
          onSearch={q => router.push(`/food?q=${encodeURIComponent(q)}`)}
          accentColor="orange"
        />
        <SearchBar
          icon="🏥"
          placeholder="ค้นหาโรงพยาบาลสัตว์..."
          onSearch={q => router.push(`/hospital?q=${encodeURIComponent(q)}`)}
          accentColor="blue"
        />
      </div>

      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-wrap gap-2">
          {FOOD_CHIPS.map(c => (
            <a key={c.href} href={c.href}
              className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors">
              {c.label}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {HOSPITAL_CHIPS.map(c => (
            <a key={c.href} href={c.href}
              className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
