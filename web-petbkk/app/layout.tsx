import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PetBKK — ตรวจสอบอาหารและโรงพยาบาลสัตว์เลี้ยงในกรุงเทพ',
  description: 'ตรวจสอบส่วนประกอบอาหารสัตว์เลี้ยงและค้นหาโรงพยาบาลสัตว์ 24 ชั่วโมงในกรุงเทพมหานคร',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <header className="bg-white border-b px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-6">
            <a href="/" className="font-bold text-lg text-orange-600">🐾 PetBKK</a>
            <nav className="flex gap-4 text-sm">
              <a href="/food" className="hover:text-orange-600">อาหาร</a>
              <a href="/hospital" className="hover:text-orange-600">โรงพยาบาล</a>
            </nav>
          </div>
        </header>
        <div className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  )
}
