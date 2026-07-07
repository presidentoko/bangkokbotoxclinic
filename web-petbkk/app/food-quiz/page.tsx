import type { Metadata } from 'next'
import FoodQuiz from '@/components/FoodQuiz'

export const metadata: Metadata = {
  title: 'แบบทดสอบ — อาหารสัตว์เลี้ยงที่เหมาะกับน้อง',
  description: 'ตอบ 4 คำถาม รู้ทันทีว่าอาหารยี่ห้อไหนเหมาะกับสุนัขหรือแมวของคุณ',
  alternates: { canonical: 'https://www.thailandpethub.com/food-quiz' },
  keywords: ['แบบทดสอบอาหารสัตว์เลี้ยง', 'อาหารสุนัขที่ดีที่สุด', 'อาหารแมวที่ดีที่สุด', 'เลือกอาหารสัตว์เลี้ยง'],
  openGraph: {
    title: 'แบบทดสอบ — อาหารอะไรเหมาะกับน้อง?',
    description: 'ตอบ 4 คำถาม รู้ทันทีว่าอาหารยี่ห้อไหนเหมาะที่สุด',
    url: 'https://www.thailandpethub.com/food-quiz',
  },
}

export default function FoodQuizPage() {
  return (
    <main className="max-w-xl mx-auto">
      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">แบบทดสอบอาหาร</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-2">🍖 อาหารอะไรเหมาะกับน้อง?</h1>
      <p className="text-gray-500 text-sm mb-6">ตอบ 4 คำถาม รู้ผลทันที — ฟรี ไม่ต้องสมัคร</p>

      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <FoodQuiz />
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
        ต้องการตรวจส่วนผสมเพิ่มเติม? <a href="/food" className="text-orange-500 underline">ดูรายละเอียดอาหารทุกยี่ห้อ</a>
      </div>
    </main>
  )
}
