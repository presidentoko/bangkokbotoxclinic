'use client'
import { useState } from 'react'

const CONDITIONS = {
  en: [
    { grade: 'Excellent', desc: 'Virtually no signs of wear. May have been worn once or twice. Hardware pristine, interior clean.' },
    { grade: 'Very Good', desc: 'Light signs of use. Minor scuffs possible, overall well-maintained. Best value grade.' },
    { grade: 'Good', desc: 'Visible signs of regular use. May have scratches or wear on corners. Fully functional.' },
  ],
  th: [
    { grade: 'สภาพดีเยี่ยม', desc: 'แทบไม่มีรอยการใช้งาน อาจผ่านการใช้งานเพียง 1-2 ครั้ง อุปกรณ์โลหะสมบูรณ์ ภายในสะอาด' },
    { grade: 'สภาพดีมาก', desc: 'มีรอยการใช้งานเล็กน้อย อาจมีรอยขีดเล็กน้อย ดูแลรักษามาอย่างดี คุ้มค่าที่สุด' },
    { grade: 'สภาพดี', desc: 'มีรอยการใช้งานชัดเจน อาจมีรอยขีดหรือรอยสึกที่มุม ยังใช้งานได้ปกติ' },
  ]
}

export function ConditionGuide({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false)
  const label = locale === 'th' ? 'คู่มือสภาพสินค้า' : 'Condition Guide'
  const items = locale === 'th' ? CONDITIONS.th : CONDITIONS.en
  return (
    <div className="my-6 border border-[#E8E2D9]">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-4 text-sm text-[#6B6052] hover:text-[#1A1A1A] transition-colors">
        <span className="tracking-wide uppercase text-xs font-medium">{label}</span>
        <span className="text-[#B8954A]">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[#E8E2D9] grid sm:grid-cols-3 gap-4 pt-4">
          {items.map(c => (
            <div key={c.grade}>
              <p className="font-serif text-sm font-medium text-[#1A1A1A] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>{c.grade}</p>
              <p className="text-xs text-[#6B6052] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
