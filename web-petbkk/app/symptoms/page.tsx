import type { Metadata } from 'next'
import SymptomChecker from '@/components/SymptomChecker'

export const metadata: Metadata = {
  title: 'ตรวจสอบอาการสัตว์เลี้ยง — สุนัขแมวมีอาการแบบนี้ต้องทำอะไร | ThailandPetHub',
  description: 'ตรวจสอบอาการสุนัขและแมว ไม่กิน ท้องเสีย อาเจียน ตาแดง คัน ซึม — เราแนะนำคู่มือที่เหมาะสมและบอกว่าต้องพาหมอหรือเปล่า',
  alternates: { canonical: 'https://www.thailandpethub.com/symptoms' },
  keywords: ['ตรวจสอบอาการสัตว์เลี้ยง', 'สุนัขแมวป่วย', 'อาการสัตว์เลี้ยง', 'ต้องพาหมอไหม'],
  openGraph: {
    title: 'ตรวจสอบอาการสัตว์เลี้ยง — บอกว่าต้องพาหมอหรือเปล่า',
    description: 'เลือกอาการ เราแนะนำขั้นตอนที่เหมาะสม',
    url: 'https://www.thailandpethub.com/symptoms',
  },
}

export default function SymptomsPage() {
  return (
    <main className="max-w-2xl mx-auto">
      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ตรวจสอบอาการ</span>
      </nav>
      <h1 className="text-3xl font-black text-gray-900 mb-2">🩺 ตรวจสอบอาการสัตว์เลี้ยง</h1>
      <p className="text-gray-500 text-sm mb-8">เลือกอาการที่พบ — เราจะแนะนำคู่มือและบอกว่าต้องพาหมอหรือไม่</p>
      <SymptomChecker />
    </main>
  )
}
