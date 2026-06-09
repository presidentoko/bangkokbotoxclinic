'use client'
import { useState, useMemo } from 'react'

type Species = 'dog' | 'cat'
type Size    = 'small' | 'medium' | 'large'

function petAgeToHuman(species: Species, size: Size, ageYears: number): number {
  if (ageYears <= 0) return 0
  if (species === 'cat') {
    if (ageYears <= 2) return Math.round(ageYears * 15)
    return Math.round(2 * 15 + (ageYears - 2) * 4)
  }
  const perYear = size === 'small' ? 4 : size === 'medium' ? 5 : 6
  if (ageYears <= 2) return Math.round(ageYears * 15)
  return Math.round(2 * 15 + (ageYears - 2) * perYear)
}

function humanStage(humanAge: number): string {
  if (humanAge < 18) return 'วัยเด็ก 🧒'
  if (humanAge < 36) return 'วัยรุ่น 👦'
  if (humanAge < 60) return 'วัยผู้ใหญ่ 🧑'
  return 'ผู้สูงวัย 👴'
}

const chipCls = (active: boolean) =>
  `px-4 py-2 rounded-full border text-sm transition-colors cursor-pointer ${
    active ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-200 hover:border-orange-300'
  }`

const SIZE_LABELS: Record<Size, string> = {
  small:  'เล็ก (< 10 กก.)',
  medium: 'กลาง (10–25 กก.)',
  large:  'ใหญ่ (> 25 กก.)',
}

export default function AgePage() {
  const [species, setSpecies] = useState<Species>('dog')
  const [size, setSize]       = useState<Size>('small')
  const [age, setAge]         = useState(3)
  const [name, setName]       = useState('')

  const humanAge = useMemo(() => petAgeToHuman(species, size, age), [species, size, age])
  const stage    = humanStage(humanAge)
  const petLabel = species === 'dog' ? 'น้องหมา' : 'น้องแมว'
  const petEmoji = species === 'dog' ? '🐕' : '🐈'

  const lineText = `${name || petLabel}อายุ ${age} ปี เทียบได้กับมนุษย์ ${humanAge} ปี (${stage}) ลองคำนวณที่ https://www.thailandpethub.com/age 🐾`
  const lineUrl  = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent('https://www.thailandpethub.com/age')}&text=${encodeURIComponent(lineText)}`

  return (
    <main className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">อายุสัตว์เลี้ยง → อายุมนุษย์</h1>
      <p className="text-sm text-gray-400 mb-8">คำนวณอายุน้องเป็นปีมนุษย์ แล้วแชร์ให้เพื่อน 🐾</p>

      <div className="bg-white rounded-2xl border p-6 mb-6 space-y-6">
        {/* Species */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">ประเภทสัตว์เลี้ยง</p>
          <div className="flex gap-2">
            <button className={chipCls(species === 'dog')} onClick={() => setSpecies('dog')}>🐕 สุนัข</button>
            <button className={chipCls(species === 'cat')} onClick={() => setSpecies('cat')}>🐈 แมว</button>
          </div>
        </div>

        {/* Size (dogs only) */}
        {species === 'dog' && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">ขนาดสุนัข</p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(SIZE_LABELS) as [Size, string][]).map(([k, label]) => (
                <button key={k} className={chipCls(size === k)} onClick={() => setSize(k)}>{label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Name (optional) */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">ชื่อน้อง (ไม่บังคับ)</p>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="เช่น บัตเตอร์, มูมู..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Age slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">อายุจริง (ปี)</p>
            <span className="text-orange-600 font-bold">{age} ปี</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={age}
            onChange={e => setAge(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 ปี</span><span>20 ปี</span>
          </div>
        </div>
      </div>

      {/* Result */}
      {age > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8 text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">
            {name || petLabel} {petEmoji} อายุ {age} ปี เทียบได้กับมนุษย์
          </p>
          <p className="text-6xl font-black text-orange-600 mb-2">{humanAge} ปี</p>
          <p className="text-lg font-semibold text-gray-700">{stage}</p>
        </div>
      )}

      {/* LINE share */}
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-[#06C755] hover:bg-[#05b34b] text-white font-bold py-3.5 rounded-xl transition-colors mb-6"
      >
        แชร์ผลลัพธ์ผ่าน LINE
      </a>

      {/* Fun facts */}
      <div className="bg-white rounded-2xl border p-5">
        <h2 className="font-bold text-gray-900 mb-3 text-sm">รู้หรือไม่?</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2"><span>🐕</span><span>สุนัขขนาดเล็กมักมีอายุยืนกว่า 15 ปีในขณะที่พันธุ์ใหญ่มักไม่เกิน 10-12 ปี</span></li>
          <li className="flex items-start gap-2"><span>🐈</span><span>แมวบ้านเฉลี่ยอยู่ได้ 12-15 ปี แมวที่อยู่แต่ในบ้านมักอายุยืนกว่าแมวที่ออกนอก</span></li>
          <li className="flex items-start gap-2"><span>🏆</span><span>แมวที่แก่ที่สุดในบันทึกคือ Creme Puff จากสหรัฐอเมริกา อายุ 38 ปี!</span></li>
          <li className="flex items-start gap-2"><span>💉</span><span>การทำหมัน วัคซีน และอาหารดีช่วยเพิ่มอายุขัยสัตว์เลี้ยงได้อย่างมีนัยสำคัญ</span></li>
        </ul>
      </div>
    </main>
  )
}
