'use client'
import { useState, useEffect } from 'react'

interface CheckItem {
  id: string
  label: string
  freq: 'daily' | 'weekly' | 'monthly'
  category: 'health' | 'nutrition' | 'grooming' | 'mental'
}

const CHECKLIST: CheckItem[] = [
  // Daily
  { id: 'water',       label: 'เปลี่ยนน้ำสด (อย่างน้อย 1 ครั้ง)',           freq: 'daily',   category: 'nutrition' },
  { id: 'meal',        label: 'ให้อาหารตรงเวลา ตวงปริมาณถูกต้อง',           freq: 'daily',   category: 'nutrition' },
  { id: 'play',        label: 'เล่น/ออกกำลังกาย 15-30 นาที',                freq: 'daily',   category: 'mental' },
  { id: 'observe',     label: 'สังเกตพฤติกรรมผิดปกติ (กิน นอน ขับถ่าย)',    freq: 'daily',   category: 'health' },
  // Weekly
  { id: 'brush',       label: 'แปรงขน / เช็ดตา หู',                         freq: 'weekly',  category: 'grooming' },
  { id: 'teeth',       label: 'แปรงฟัน (อย่างน้อย 3 ครั้ง/สัปดาห์)',        freq: 'weekly',  category: 'health' },
  { id: 'nail',        label: 'ตรวจความยาวเล็บ',                             freq: 'weekly',  category: 'grooming' },
  { id: 'litter',      label: 'ทำความสะอาดกระบะทราย (แมว)',                  freq: 'weekly',  category: 'health' },
  { id: 'weight',      label: 'ประเมินน้ำหนัก (รู้สึกซี่โครง = โอเค)',        freq: 'weekly',  category: 'health' },
  { id: 'enrichment',  label: 'ของเล่นใหม่ / กิจกรรมสร้างสรรค์',            freq: 'weekly',  category: 'mental' },
  // Monthly
  { id: 'flea',        label: 'ยาป้องกันหมัด/เห็บ',                          freq: 'monthly', category: 'health' },
  { id: 'deworming',   label: 'ยาถ่ายพยาธิ (ตามตารางสัตวแพทย์)',             freq: 'monthly', category: 'health' },
  { id: 'vet',         label: 'ทบทวนสุขภาพ — นัดหมอถ้าจำเป็น',              freq: 'monthly', category: 'health' },
]

const CATEGORY_COLOR = {
  health:    'bg-red-50 text-red-700 border-red-200',
  nutrition: 'bg-orange-50 text-orange-700 border-orange-200',
  grooming:  'bg-purple-50 text-purple-700 border-purple-200',
  mental:    'bg-blue-50 text-blue-700 border-blue-200',
}
const CATEGORY_LABEL = { health: 'สุขภาพ', nutrition: 'โภชนาการ', grooming: 'ดูแลขน', mental: 'สุขภาพจิต' }

const FREQ_LABEL = { daily: 'ทำทุกวัน', weekly: 'ทำทุกสัปดาห์', monthly: 'ทำทุกเดือน' }

function getWeekKey(): string {
  const d = new Date()
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7)
  return `checklist_${d.getFullYear()}_w${week}`
}

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const key = getWeekKey()
      const saved = localStorage.getItem(key)
      if (saved) setChecked(new Set(JSON.parse(saved)))
    } catch {}
  }, [])

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem(getWeekKey(), JSON.stringify([...next]))
      } catch {}
      return next
    })
  }

  const total = CHECKLIST.length
  const done = checked.size
  const pct = mounted ? Math.round((done / total) * 100) : 0

  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-1">✅ เช็คลิสต์ดูแลสัตว์เลี้ยง</h1>
      <p className="text-sm text-gray-400 mb-6">รีเซ็ตทุกสัปดาห์ — บันทึกในเครื่องของคุณ</p>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">ความคืบหน้าสัปดาห์นี้</p>
          <span className="text-lg font-black text-orange-600">{mounted ? done : 0}/{total}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && (
          <p className="text-sm text-green-600 font-bold mt-2 text-center">🎉 ยอดเยี่ยม! ครบทุกข้อแล้ว</p>
        )}
      </div>

      {/* Grouped by frequency */}
      {(['daily', 'weekly', 'monthly'] as const).map(freq => {
        const items = CHECKLIST.filter(c => c.freq === freq)
        return (
          <section key={freq} className="mb-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{FREQ_LABEL[freq]}</h2>
            <div className="space-y-2">
              {items.map(item => {
                const isChecked = mounted && checked.has(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      isChecked
                        ? 'bg-green-50 border-green-200 opacity-75'
                        : 'bg-white border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {isChecked && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isChecked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {item.label}
                      </p>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${CATEGORY_COLOR[item.category]}`}>
                      {CATEGORY_LABEL[item.category]}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}

      {/* CTA links */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-4">
        <p className="font-bold text-gray-800 mb-3 text-sm">เครื่องมือที่เกี่ยวข้อง</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { href: '/vaccine', label: '💉 ตารางวัคซีน' },
            { href: '/dental',  label: '🦷 วิธีแปรงฟัน' },
            { href: '/deworming', label: '🪱 ถ่ายพยาธิ' },
            { href: '/hospital', label: '🏥 หาหมอ' },
          ].map(l => (
            <a key={l.href} href={l.href} className="text-sm text-orange-700 font-medium hover:text-orange-800 transition-colors">
              {l.label} →
            </a>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">ข้อมูลบันทึกในเครื่องของคุณเท่านั้น ไม่มีการส่งข้อมูลออกไป</p>
    </main>
  )
}
