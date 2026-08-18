import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ไม่พบหน้านี้',
  robots: { index: false, follow: true },
}

const POPULAR_LINKS = [
  { href: '/food',     label: '🍖 ตรวจสอบอาหาร',     desc: 'เกรด A-F จากส่วนประกอบจริง' },
  { href: '/hospital', label: '🏥 หาโรงพยาบาลสัตว์',  desc: '503 แห่งในกรุงเทพ' },
  { href: '/guides',   label: '📚 คู่มือทั้งหมด',      desc: 'เคล็ดลับดูแลสัตว์เลี้ยง 60+ หัวข้อ' },
  { href: '/emergency', label: '🚨 คู่มือฉุกเฉิน',     desc: 'อาการที่ต้องไปหาหมอทันที' },
]

export default function NotFound() {
  return (
    <main className="max-w-lg mx-auto text-center py-16">
      <p className="text-6xl mb-4">🐾</p>
      <h1 className="text-xl font-black text-gray-900 mb-2">ไม่พบหน้าที่คุณต้องการ</h1>
      <p className="text-sm text-gray-400 mb-8">ลิงก์อาจถูกย้ายหรือพิมพ์ผิด — ลองดูหน้ายอดนิยมด้านล่าง</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-8">
        {POPULAR_LINKS.map(l => (
          <a
            key={l.href}
            href={l.href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all p-4"
          >
            <p className="font-bold text-gray-800 text-sm mb-0.5">{l.label}</p>
            <p className="text-xs text-gray-400">{l.desc}</p>
          </a>
        ))}
      </div>

      <a href="/" className="inline-block px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm">
        ← กลับหน้าหลัก
      </a>
    </main>
  )
}
