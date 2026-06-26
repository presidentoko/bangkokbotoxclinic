import type { Metadata } from 'next'
import PetProfile from '@/components/PetProfile'

export const metadata: Metadata = {
  title: 'โปรไฟล์น้อง — ติดตามวัคซีน ถ่ายพยาธิ และสุขภาพ | ThailandPetHub',
  description: 'บันทึกข้อมูลน้องของคุณ ติดตามวันครบกำหนดวัคซีน ถ่ายพยาธิ และยาหมัดเห็บ ไม่ต้องสมัครสมาชิก เก็บในอุปกรณ์ของคุณ',
  alternates: { canonical: 'https://www.thailandpethub.com/my-pet' },
  keywords: ['โปรไฟล์สัตว์เลี้ยง', 'ติดตามวัคซีน', 'ปฏิทินสัตว์เลี้ยง', 'บันทึกสุขภาพน้อง'],
  openGraph: {
    title: 'โปรไฟล์น้อง — ติดตามวัคซีน ถ่ายพยาธิ ยาหมัด',
    description: 'บันทึกข้อมูลน้อง รู้เมื่อถึงเวลาต้องดูแล',
    url: 'https://www.thailandpethub.com/my-pet',
  },
}

export default function MyPetPage() {
  return (
    <main className="max-w-xl mx-auto">
      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">โปรไฟล์น้อง</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-2">🐾 โปรไฟล์น้องของคุณ</h1>
      <p className="text-gray-500 text-sm mb-6">เก็บข้อมูลในอุปกรณ์ของคุณ ไม่ต้องสมัครสมาชิก</p>

      <PetProfile />

      <div className="mt-6 grid grid-cols-2 gap-3">
        <a href="/vaccine" className="p-3 bg-white rounded-xl border text-center hover:border-orange-200 hover:bg-orange-50 transition-colors">
          <p className="text-xl mb-1">💉</p>
          <p className="text-xs font-bold text-gray-700">ตารางวัคซีน</p>
        </a>
        <a href="/deworming" className="p-3 bg-white rounded-xl border text-center hover:border-orange-200 hover:bg-orange-50 transition-colors">
          <p className="text-xl mb-1">🪱</p>
          <p className="text-xs font-bold text-gray-700">ถ่ายพยาธิ</p>
        </a>
        <a href="/symptoms" className="p-3 bg-white rounded-xl border text-center hover:border-orange-200 hover:bg-orange-50 transition-colors">
          <p className="text-xl mb-1">🩺</p>
          <p className="text-xs font-bold text-gray-700">ตรวจอาการ</p>
        </a>
        <a href="/weight" className="p-3 bg-white rounded-xl border text-center hover:border-orange-200 hover:bg-orange-50 transition-colors">
          <p className="text-xl mb-1">⚖️</p>
          <p className="text-xs font-bold text-gray-700">ประเมินน้ำหนัก</p>
        </a>
      </div>
    </main>
  )
}
