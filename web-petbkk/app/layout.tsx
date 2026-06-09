import type { Metadata } from 'next'
import './globals.css'
import CompareTray from '@/components/CompareTray'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.thailandpethub.com'),
  title: 'PetBKK — ตรวจสอบอาหารและโรงพยาบาลสัตว์เลี้ยงในกรุงเทพ',
  description: 'ตรวจสอบส่วนประกอบอาหารสัตว์เลี้ยงและค้นหาโรงพยาบาลสัตว์ 24 ชั่วโมงในกรุงเทพมหานคร',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-orange-50 text-gray-900 antialiased">
        <header className="bg-white border-b px-4 py-3 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto">
            {/* Brand + primary nav */}
            <div className="flex items-center gap-4 mb-2">
              <a href="/" className="font-bold text-lg text-orange-600 flex-shrink-0">🐾 PetBKK</a>
              <nav className="flex gap-3 text-sm overflow-x-auto scrollbar-none">
                <a href="/food"     className="whitespace-nowrap hover:text-orange-600">อาหาร</a>
                <a href="/hospital" className="whitespace-nowrap hover:text-orange-600">โรงพยาบาล</a>
                <a href="/adopt"    className="whitespace-nowrap hover:text-orange-600 text-green-600 font-medium">รับเลี้ยง</a>
                <a href="/tips"     className="whitespace-nowrap hover:text-orange-600">เคล็ดลับ</a>
                <a href="/emergency" className="whitespace-nowrap text-red-500 font-medium hover:text-red-600">🚨 ฉุกเฉิน</a>
              </nav>
            </div>
            {/* Tools strip */}
            <nav className="flex gap-2 overflow-x-auto scrollbar-none text-xs text-gray-500 pb-0.5">
              {[
                { href: '/compare',     label: 'เปรียบเทียบ' },
                { href: '/cost',        label: 'ค่าใช้จ่าย' },
                { href: '/age',         label: 'คำนวณอายุ' },
                { href: '/vaccine',     label: '💉 วัคซีน' },
                { href: '/ingredients', label: 'ส่วนผสม' },
                { href: '/saved',       label: '❤️ บันทึก' },
              ].map(l => (
                <a key={l.href} href={l.href}
                  className="whitespace-nowrap px-2.5 py-1 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors flex-shrink-0">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </header>
        <div className="max-w-5xl mx-auto px-4 py-8 pb-28">
          {children}
        </div>
        <CompareTray />
      </body>
    </html>
  )
}
