'use client'
import { useEffect, useState } from 'react'

const PRIMARY = [
  { href: '/food',      label: '🍖 อาหาร' },
  { href: '/hospital',  label: '🏥 โรงพยาบาล' },
  { href: '/adopt',     label: '🐾 รับเลี้ยงแทนการซื้อ' },
  { href: '/guides',    label: '📚 คู่มือทั้งหมด' },
  { href: '/emergency', label: '🚨 ฉุกเฉิน' },
]

const GROUPS: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: 'เครื่องมือยอดนิยม',
    items: [
      { href: '/compare',    label: '⚖️ เปรียบเทียบ' },
      { href: '/cost',       label: '💰 ค่าใช้จ่าย' },
      { href: '/age',        label: '🎂 คำนวณอายุ' },
      { href: '/vaccine',    label: '💉 วัคซีน' },
      { href: '/checklist',  label: '✅ เช็คลิสต์' },
      { href: '/symptoms',   label: '🩺 ตรวจอาการ' },
      { href: '/breed-quiz', label: '🐾 ค้นหาสายพันธุ์' },
      { href: '/food-quiz',  label: '🍖 แบบทดสอบอาหาร' },
      { href: '/saved',      label: '❤️ บันทึก' },
    ],
  },
  {
    title: 'ดูแลสุขภาพ',
    items: [
      { href: '/hospital/surgery', label: '🔪 ทำหมัน/ผ่าตัด' },
      { href: '/dental',           label: '🦷 ดูแลฟัน' },
      { href: '/deworming',        label: '🪱 ถ่ายพยาธิ' },
      { href: '/flea',             label: '🦟 หมัด/เห็บ' },
      { href: '/heartworm',        label: '🦟 พยาธิหัวใจ' },
      { href: '/allergy',          label: '🤧 แพ้อาหาร' },
      { href: '/kidney-disease',   label: '🫘 โรคไต' },
      { href: '/first-aid',        label: '🩹 ปฐมพยาบาล' },
      { href: '/microchip',        label: '📡 ไมโครชิป' },
      { href: '/insurance',        label: '🛡️ ประกัน' },
      { href: '/neutering',        label: '✂️ ทำหมัน' },
      { href: '/weight',           label: '⚖️ น้ำหนัก' },
      { href: '/heatstroke',       label: '☀️ ลมแดด' },
      { href: '/diarrhea',         label: '💩 ท้องเสีย' },
      { href: '/not-eating',       label: '🍽️ ไม่กินอาหาร' },
    ],
  },
  {
    title: 'พฤติกรรม & การฝึก',
    items: [
      { href: '/training',       label: '🎓 ฝึกสุนัข' },
      { href: '/potty-training', label: '🚽 ฝึกฉี่ถูกที่' },
      { href: '/cat-behavior',   label: '🐱 พฤติกรรมแมว' },
      { href: '/dog-behavior',   label: '🐕 พฤติกรรมสุนัข' },
      { href: '/anxiety',        label: '😰 แยกไม่ได้' },
      { href: '/breeds',         label: '🐾 สายพันธุ์' },
      { href: '/grooming',       label: '🪮 Grooming' },
    ],
  },
  {
    title: 'อื่นๆ',
    items: [
      { href: '/food/senior', label: '👴 อาหาร Senior' },
      { href: '/food/budget', label: '💰 อาหารประหยัด' },
      { href: '/food/puppy',  label: '🐶 อาหาร Puppy' },
      { href: '/toxic',       label: '⚠️ อาหารต้องห้าม' },
      { href: '/newpet',      label: '🆕 เลี้ยงใหม่' },
      { href: '/travel',      label: '✈️ เดินทาง' },
      { href: '/raw-food',    label: '🥩 Raw Food' },
      { href: '/ingredients', label: '🔬 ส่วนผสม' },
      { href: '/tips',        label: '📚 เคล็ดลับ' },
    ],
  },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="เมนู"
        className="flex sm:hidden items-center justify-center w-11 h-11 rounded-full hover:bg-orange-50 text-gray-600 flex-shrink-0"
      >
        <span className="text-xl">☰</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white shadow-xl overflow-y-auto"
            style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <span className="font-black text-orange-500">🐾 เมนู</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="ปิดเมนู"
                className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <nav className="px-3 py-3">
              <div className="space-y-1 mb-4">
                {PRIMARY.map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center min-h-[44px] px-3 rounded-xl font-semibold text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              {GROUPS.map(group => (
                <div key={group.title} className="mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-3 mb-1">{group.title}</p>
                  <div className="grid grid-cols-1">
                    {group.items.map(item => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center min-h-[44px] px-3 rounded-xl text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
