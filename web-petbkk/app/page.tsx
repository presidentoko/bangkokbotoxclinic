'use client'
import { useRouter } from 'next/navigation'
import SearchBar from '@/components/SearchBar'
import PetProfileSetup from '@/components/PetProfileSetup'
import PersonalizedFoodRecs from '@/components/PersonalizedFoodRecs'

const FOOD_CHIPS = [
  { label: 'Royal Canin', href: '/food?q=royal+canin' },
  { label: '🐕 ลูกสุนัข', href: '/food?animal=dog&life_stage=puppy' },
  { label: '🐈 แมว', href: '/food?animal=cat' },
  { label: '⭐ เกรด A', href: '/food/best' },
]

const HOSPITAL_CHIPS = [
  { label: '⏰ 24 ชั่วโมง', href: '/hospital?filter=24h' },
  { label: '🚨 ฉุกเฉิน', href: '/hospital?filter=emergency' },
  { label: '📍 ใกล้ฉัน', href: '/hospital?filter=near' },
]

const STATS = [
  { num: '49+', label: 'อาหารที่ตรวจสอบแล้ว' },
  { num: '503', label: 'โรงพยาบาลสัตว์' },
  { num: '100%', label: 'ฟรี ไม่มีค่าใช้จ่าย' },
]

const TOOLS = [
  { href: '/food',        icon: '🍖', title: 'ตรวจอาหาร',         desc: 'เกรด A-F พร้อมส่วนผสม' },
  { href: '/hospital',    icon: '🏥', title: 'หาโรงพยาบาล',       desc: 'GPS ใกล้ฉัน + แผนที่' },
  { href: '/compare',     icon: '⚖️', title: 'เปรียบเทียบอาหาร',   desc: 'เทียบโภชนาการได้สูงสุด 3 ชนิด' },
  { href: '/vaccine',     icon: '💉', title: 'ตารางวัคซีน',        desc: 'คำนวณจากวันเกิดน้อง' },
  { href: '/cost',        icon: '💰', title: 'ค่าใช้จ่าย',         desc: 'ประมาณการรายเดือนและ 5 ปี' },
  { href: '/age',         icon: '🎂', title: 'คำนวณอายุ',          desc: 'อายุน้องเทียบมนุษย์ + LINE แชร์' },
  { href: '/adopt',       icon: '🐾', title: 'รับเลี้ยง',          desc: '6 องค์กรช่วยเหลือสัตว์ไทย' },
  { href: '/toxic',       icon: '⚠️', title: 'อาหารต้องห้าม',      desc: '12 อาหารที่เป็นพิษต่อน้อง' },
  { href: '/emergency',   icon: '🚨', title: 'คู่มือฉุกเฉิน',      desc: 'อาการไหนต้องไปหาหมอทันที' },
  { href: '/ingredients', icon: '🔬', title: 'ส่วนผสมอันตราย',     desc: 'BHA, BHT, Ethoxyquin + อื่นๆ' },
  { href: '/tips',        icon: '📚', title: 'เคล็ดลับดูแลน้อง',   desc: '15 คำถามที่พบบ่อย' },
  { href: '/newpet',      icon: '🆕', title: 'เลี้ยงน้องใหม่',      desc: 'เช็คลิสต์ครบ 20 ข้อ' },
]

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="flex flex-col items-center py-10 px-4">
      {/* Hero */}
      <div className="mb-2 text-4xl">🐾</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1 text-center">PetBKK</h1>
      <p className="text-gray-400 text-sm mb-8 text-center">
        ตรวจสอบอาหาร · หาโรงพยาบาล · ดูแลสัตว์เลี้ยงครบจบที่นี่
      </p>

      {/* Pet profile */}
      <PetProfileSetup />

      {/* Personalized recs (shows only when profile set) */}
      <PersonalizedFoodRecs />

      {/* Search bars */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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

      {/* Quick chips */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
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

      {/* Stats strip */}
      <div className="w-full max-w-2xl grid grid-cols-3 gap-3 mb-10">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-xl border px-3 py-4 text-center">
            <p className="text-xl font-black text-orange-600">{s.num}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tools discovery grid */}
      <div className="w-full max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">เครื่องมือทั้งหมด</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TOOLS.map(tool => (
            <a key={tool.href} href={tool.href}
              className="bg-white rounded-xl border p-4 hover:shadow-md hover:border-orange-200 transition-all group">
              <p className="text-2xl mb-2">{tool.icon}</p>
              <p className="font-semibold text-sm text-gray-900 group-hover:text-orange-600 transition-colors">{tool.title}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">{tool.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Adoption CTA */}
      <div className="w-full max-w-2xl mt-8 bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
        <p className="font-bold text-gray-900 mb-1">อย่าซื้อ — ให้รับเลี้ยงแทน 🐾</p>
        <p className="text-sm text-gray-500 mb-3">สัตว์จรจัดในไทยกว่า 5 ล้านตัวรอบ้านใหม่</p>
        <a href="/adopt"
          className="inline-block px-5 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm">
          ดูรายชื่อองค์กรรับเลี้ยง →
        </a>
      </div>
    </main>
  )
}
