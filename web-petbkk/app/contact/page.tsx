import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'ติดต่อเรา',
  description: 'ติดต่อทีมงาน ThailandPetHub — แจ้งข้อมูลโรงพยาบาล ส่งข้อมูลอาหาร หรือพูดคุยเรื่องสัตว์เลี้ยง',
  alternates: { canonical: 'https://www.thailandpethub.com/contact' },
}

export default function ContactPage() {
  return (
    <main className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">ติดต่อเรา</h1>
        <p className="text-gray-500 text-sm">
          ThailandPetHub สร้างโดยคนรักสัตว์เลี้ยง เพื่อคนรักสัตว์เลี้ยง — ทุก feedback มีความหมาย
        </p>
      </div>

      <ContactForm />

      <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
        <p className="text-sm text-green-800 font-medium mb-1">ภารกิจของเรา</p>
        <p className="text-sm text-green-700 leading-relaxed">
          เราอยากให้คนไทยรู้จักการ <strong>รับเลี้ยง</strong> สัตว์จากศูนย์พักพิง<br />
          แทนการซื้อ — เพราะสัตว์ทุกตัวสมควรได้รับความรัก 🐾
        </p>
        <a href="/adopt" className="mt-3 inline-block text-sm text-green-600 underline hover:text-green-700">
          ดูสัตว์รอบ้าน →
        </a>
      </div>
    </main>
  )
}
