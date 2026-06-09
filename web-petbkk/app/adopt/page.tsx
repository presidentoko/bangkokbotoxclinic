import type { Metadata } from 'next'
import shelters from '@/data/shelters.json'

export const metadata: Metadata = {
  title: 'รับเลี้ยงสัตว์จรจัด — ไม่ต้องซื้อ ให้รับเลี้ยงแทน',
  description: 'สัตว์จรจัดในไทยกว่า 5 ล้านตัวรอบ้านใหม่ ดูรายชื่อองค์กรรับเลี้ยงสัตว์ที่เชื่อถือได้ฟรี ไม่มีค่าใช้จ่าย',
  openGraph: {
    title: 'รับเลี้ยงสัตว์จรจัด — อย่าซื้อ ให้รับเลี้ยงแทน',
    description: 'สัตว์จรจัดในไทยกว่า 5 ล้านตัวรอบ้านใหม่ ดูรายชื่อองค์กรรับเลี้ยงสัตว์ 6 แห่งในไทย',
    url: 'https://www.thailandpethub.com/adopt',
    type: 'website',
  },
}

interface Shelter {
  id: string
  name_th: string
  name_en: string
  province: string
  type: 'rescue' | 'shelter'
  dogs: boolean
  cats: boolean
  website: string
  facebook: string
  phone: string
  description: string
}

const TYPE_LABEL: Record<Shelter['type'], { label: string; emoji: string }> = {
  rescue:  { label: 'กู้ภัย',      emoji: '🛟' },
  shelter: { label: 'สถานพักพิง', emoji: '🏠' },
}

export default function AdoptPage() {
  return (
    <main className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🐾</div>
        <h1 className="text-3xl font-black text-green-700 mb-3">อย่าซื้อ ให้รับเลี้ยง</h1>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          สุนัขและแมวนับล้านตัวรอบ้านในประเทศไทย
          การรับเลี้ยงหนึ่งชีวิตช่วยเปิดพื้นที่ให้น้องอีกตัวได้รับการช่วยเหลือ
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { num: '5 ล้าน',   label: 'สัตว์จรในไทย',             color: 'text-red-500' },
          { num: '~500,000', label: 'เข้าสถานพักพิงต่อปี',      color: 'text-orange-500' },
          { num: '0 บาท',    label: 'ค่าใช้จ่ายรับเลี้ยง*',    color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border shadow-sm p-4 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.num}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Shelter cards */}
      <h2 className="text-xl font-black text-gray-900 mb-4">องค์กรช่วยเหลือสัตว์เลี้ยง</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {(shelters as Shelter[]).map(s => {
          const typeInfo = TYPE_LABEL[s.type]
          return (
            <div
              key={s.id}
              className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-5 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-black text-gray-900 text-base leading-tight">{s.name_th}</h3>
                <span className="shrink-0 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {s.province}
                </span>
              </div>
              <div className="flex gap-1.5 mb-3 flex-wrap">
                <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full border">
                  {typeInfo.emoji} {typeInfo.label}
                </span>
                {s.dogs && <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full">🐕 หมา</span>}
                {s.cats && <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">🐈 แมว</span>}
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-1">{s.description}</p>
              {s.phone && (
                <a
                  href={`tel:${s.phone}`}
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-2 mb-3"
                >
                  📞 {s.phone}
                </a>
              )}
              <div className="flex gap-2 flex-wrap mt-auto">
                {s.facebook && (
                  <a
                    href={s.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    Facebook →
                  </a>
                )}
                {s.website && (
                  <a
                    href={s.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    เว็บไซต์ →
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">เตรียมพร้อมก่อนรับเลี้ยง</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {[
            'ตรวจสุขภาพและฉีดวัคซีนก่อนพาน้องเข้าบ้าน',
            'เตรียมพื้นที่ส่วนตัวและอุปกรณ์พื้นฐาน (ที่นอน ชาม สายจูง)',
            'หาสัตวแพทย์ประจำตัวในย่านที่คุณอาศัย',
            'วางแผนค่าใช้จ่ายรายเดือน: อาหาร ค่าหมอ ของเล่น',
            'ให้เวลาน้องปรับตัวอย่างน้อย 2–4 สัปดาห์',
          ].map(tip => (
            <li key={tip} className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-gray-400 text-center">* ค่าใช้จ่ายแรกรับ เช่น ค่าวัคซีน ค่าหมัน อาจมีหรือไม่มีขึ้นอยู่กับแต่ละองค์กร</p>
    </main>
  )
}
