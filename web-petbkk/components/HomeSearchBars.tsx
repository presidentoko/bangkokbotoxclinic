'use client'
import { useRouter } from 'next/navigation'
import SearchBar from '@/components/SearchBar'

export default function HomeSearchBars() {
  const router = useRouter()

  return (
    <div className="space-y-2.5 max-w-lg mx-auto">
      <SearchBar
        icon="🍖"
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
  )
}
