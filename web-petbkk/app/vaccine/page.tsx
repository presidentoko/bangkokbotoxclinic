'use client'
import { useState, useMemo } from 'react'

type Species = 'dog' | 'cat'

interface VaxItem {
  name: string
  ageMonths: number[]  // months at which to give this vaccine
  note: string
  recurring?: number   // months between boosters after initial series (12 = annual)
}

const DOG_VACCINES: VaxItem[] = [
  { name: 'DHPPiL ครั้งที่ 1', ageMonths: [6], note: 'ไข้หัดสุนัข, ตับอักเสบ, พาร์โวไวรัส, เลปโตสไปโรซิส' },
  { name: 'DHPPiL ครั้งที่ 2', ageMonths: [9], note: 'กระตุ้นครั้งที่ 2' },
  { name: 'DHPPiL ครั้งที่ 3', ageMonths: [12], note: 'กระตุ้นครั้งที่ 3' },
  { name: 'วัคซีนพิษสุนัขบ้า', ageMonths: [14], note: 'บังคับตามกฎหมาย ต่ออายุทุกปี', recurring: 12 },
  { name: 'DHPPiL กระตุ้นประจำปี', ageMonths: [24], note: 'กระตุ้นทุกปีตลอดชีวิต', recurring: 12 },
  { name: 'วัคซีนไข้หวัดสุนัข (Bordetella)', ageMonths: [12], note: 'แนะนำสำหรับสุนัขที่เข้าฝึกอบรมหรืออยู่รวมกลุ่ม', recurring: 12 },
]

const CAT_VACCINES: VaxItem[] = [
  { name: 'FVRCP ครั้งที่ 1', ageMonths: [6], note: 'ไข้หวัดแมว, คาลิซิไวรัส, แพนลูโคพีเนีย' },
  { name: 'FVRCP ครั้งที่ 2', ageMonths: [9], note: 'กระตุ้นครั้งที่ 2' },
  { name: 'FVRCP ครั้งที่ 3', ageMonths: [12], note: 'กระตุ้นครั้งที่ 3' },
  { name: 'วัคซีนพิษสุนัขบ้า (แมว)', ageMonths: [14], note: 'แนะนำโดยเฉพาะแมวที่ออกนอกบ้าน', recurring: 12 },
  { name: 'FVRCP กระตุ้นประจำปี/3ปี', ageMonths: [24], note: 'กระตุ้นทุก 1–3 ปีตามชนิดวัคซีน', recurring: 12 },
  { name: 'FeLV (มะเร็งเม็ดเลือดขาวแมว)', ageMonths: [8], note: 'แนะนำสำหรับแมวที่ออกนอกบ้านหรืออยู่รวมหลายตัว', recurring: 12 },
]

interface ScheduleItem extends VaxItem {
  dueDate: Date
  status: 'overdue' | 'due-soon' | 'upcoming' | 'done'
  daysFromNow: number
}

function computeSchedule(species: Species, birthDate: Date): ScheduleItem[] {
  const vaccines = species === 'dog' ? DOG_VACCINES : CAT_VACCINES
  const now = new Date()
  const result: ScheduleItem[] = []

  for (const v of vaccines) {
    for (const monthOffset of v.ageMonths) {
      const dueDate = new Date(birthDate)
      dueDate.setMonth(dueDate.getMonth() + monthOffset)
      const daysFromNow = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const status: ScheduleItem['status'] =
        daysFromNow < -30 ? 'done' :
        daysFromNow < 0   ? 'overdue' :
        daysFromNow < 30  ? 'due-soon' :
        'upcoming'
      result.push({ ...v, dueDate, status, daysFromNow })
    }
  }

  return result.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
}

const STATUS_STYLES = {
  'done':      { chip: 'bg-gray-100 text-gray-500',   icon: '✓', label: 'ฉีดแล้ว' },
  'overdue':   { chip: 'bg-red-100 text-red-700',     icon: '!', label: 'เลยกำหนด' },
  'due-soon':  { chip: 'bg-orange-100 text-orange-700', icon: '⚡', label: 'ใกล้ถึง' },
  'upcoming':  { chip: 'bg-blue-50 text-blue-600',    icon: '○', label: 'กำลังมา' },
}

const chipCls = (active: boolean) =>
  `px-4 py-2 rounded-full border text-sm transition-colors cursor-pointer ${
    active ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-200 hover:border-orange-300'
  }`

export default function VaccinePage() {
  const [species, setSpecies] = useState<Species>('dog')
  const [birthStr, setBirthStr] = useState('')

  const birthDate = useMemo(() => {
    if (!birthStr) return null
    const d = new Date(birthStr)
    return isNaN(d.getTime()) ? null : d
  }, [birthStr])

  const schedule = useMemo(() =>
    birthDate ? computeSchedule(species, birthDate) : [],
    [species, birthDate]
  )

  const hasUrgent = schedule.some(s => s.status === 'overdue' || s.status === 'due-soon')

  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">ตารางวัคซีนสัตว์เลี้ยง</h1>
      <p className="text-sm text-gray-400 mb-8">ใส่วันเกิดน้อง แล้วเราจะบอกว่าต้องฉีดอะไรบ้าง</p>

      <div className="bg-white rounded-2xl border p-6 mb-6 space-y-5">
        {/* Species */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">ประเภทสัตว์เลี้ยง</p>
          <div className="flex gap-2">
            <button className={chipCls(species === 'dog')} onClick={() => setSpecies('dog')}>🐕 สุนัข</button>
            <button className={chipCls(species === 'cat')} onClick={() => setSpecies('cat')}>🐈 แมว</button>
          </div>
        </div>

        {/* Birth date */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">วันเกิดน้อง</p>
          <input
            type="date"
            value={birthStr}
            onChange={e => setBirthStr(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-xs text-gray-400 mt-1">ถ้าไม่แน่ใจวันเกิด ประมาณปีได้เลย</p>
        </div>
      </div>

      {/* Results */}
      {schedule.length > 0 && (
        <>
          {hasUrgent && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm text-red-700">
              <span>⚠️</span>
              <span className="font-medium">น้องมีวัคซีนที่ใกล้ถึงหรือเลยกำหนดแล้ว กรุณานัดสัตวแพทย์</span>
            </div>
          )}

          <div className="space-y-3">
            {schedule.map((item, i) => {
              const s = STATUS_STYLES[item.status]
              return (
                <div key={i} className={`bg-white rounded-xl border p-4 ${item.status === 'overdue' ? 'border-red-300' : item.status === 'due-soon' ? 'border-orange-300' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
                      <p className="text-xs text-gray-500 mt-1">{fmtDate(item.dueDate)}</p>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${s.chip}`}>
                      {s.icon} {s.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-5 text-center">
            <p className="text-sm text-gray-600 mb-3">หาโรงพยาบาลสัตว์เพื่อนัดวัคซีน</p>
            <a href="/hospital" className="inline-block px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm">
              ค้นหาโรงพยาบาลใกล้บ้าน →
            </a>
          </div>
        </>
      )}

      {!birthDate && (
        <div className="text-center text-gray-400 py-12">
          <p className="text-4xl mb-3">💉</p>
          <p>ใส่วันเกิดน้องด้านบนเพื่อดูตารางวัคซีน</p>
        </div>
      )}
    </main>
  )
}
