'use client'
import { useState, useMemo } from 'react'
import { calculateCost } from '@/lib/cost'
import type { Species, PetSize } from '@/lib/cost'

const SIZE_LABELS: Record<PetSize, string> = {
  small:  'เล็ก (< 10 กก.)',
  medium: 'กลาง (10–25 กก.)',
  large:  'ใหญ่ (> 25 กก.)',
}

const chipCls = (active: boolean) =>
  `px-4 py-2 rounded-full border text-sm transition-colors cursor-pointer ${
    active
      ? 'bg-orange-500 text-white border-orange-500'
      : 'bg-white border-gray-200 hover:border-orange-300 hover:text-orange-600'
  }`

function fmt(n: number) {
  return n.toLocaleString('th-TH')
}

export default function CostPage() {
  const [species, setSpecies]     = useState<Species>('dog')
  const [size, setSize]           = useState<PetSize>('small')
  const [food, setFood]           = useState(800)

  const result = useMemo(
    () => calculateCost({ species, size, monthlyFoodBudget: food }),
    [species, size, food]
  )

  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-1">💰 ประมาณค่าใช้จ่าย</h1>
      <p className="text-sm text-gray-400 mb-6">คำนวณค่าใช้จ่ายต่อเดือนและระยะยาวสำหรับสัตว์เลี้ยงของคุณ</p>

      {/* Inputs */}
      <div className="bg-white rounded-2xl border p-6 mb-6 space-y-6">
        {/* Species */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">ประเภทสัตว์เลี้ยง</p>
          <div className="flex gap-2">
            <button className={chipCls(species === 'dog')} onClick={() => setSpecies('dog')}>🐕 สุนัข</button>
            <button className={chipCls(species === 'cat')} onClick={() => setSpecies('cat')}>🐈 แมว</button>
          </div>
        </div>

        {/* Size (only for dogs) */}
        {species === 'dog' && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">ขนาด</p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(SIZE_LABELS) as [PetSize, string][]).map(([k, label]) => (
                <button key={k} className={chipCls(size === k)} onClick={() => setSize(k)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Food budget */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">งบอาหารต่อเดือน</p>
            <span className="text-orange-600 font-bold text-sm">฿{fmt(food)}</span>
          </div>
          <input
            type="range"
            min={200}
            max={5000}
            step={100}
            value={food}
            onChange={e => setFood(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>฿200</span><span>฿5,000</span>
          </div>
        </div>
      </div>

      {/* Monthly total — prominent display */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center mb-6">
        <p className="text-sm text-gray-500 mb-1">ค่าใช้จ่ายต่อเดือน (ประมาณ)</p>
        <p className="text-4xl font-black text-orange-600">฿{fmt(result.monthly.total)}</p>
      </div>

      {/* Monthly breakdown */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-4">
        <h2 className="font-black text-gray-900 mb-4">รายละเอียดค่าใช้จ่ายรายเดือน</h2>
        <div className="space-y-3">
          {[
            { label: 'อาหาร',           value: result.monthly.food },
            { label: 'สัตวแพทย์',      value: result.monthly.vet },
            { label: 'ดูแลขน/อาบน้ำ', value: result.monthly.grooming },
            { label: 'อุปกรณ์/ของเล่น', value: result.monthly.accessories },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center text-sm py-1 border-b border-gray-50 last:border-0">
              <span className="text-gray-600">{row.label}</span>
              <span className="font-semibold text-gray-800">฿{fmt(row.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* One-time costs */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-4">
        <h2 className="font-black text-gray-900 mb-4">ค่าใช้จ่ายแรกรับ (ครั้งเดียว)</h2>
        <div className="space-y-3">
          {[
            { label: 'วัคซีน',          value: result.oneTime.vaccines },
            { label: 'ทำหมัน',          value: result.oneTime.neuterSpay },
            { label: 'ไมโครชิป',        value: result.oneTime.microchip },
            { label: 'ชุดเริ่มต้น (ที่นอน ชาม สายจูง)', value: result.oneTime.startupKit },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center text-sm py-1 border-b border-gray-50 last:border-0">
              <span className="text-gray-600">{row.label}</span>
              <span className="font-semibold text-gray-800">฿{fmt(row.value)}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>รวมแรกรับ</span>
            <span className="text-orange-600 text-lg">฿{fmt(result.oneTime.total)}</span>
          </div>
        </div>
      </div>

      {/* 5-year summary */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center mb-4">
        <p className="text-sm text-gray-500 mb-1">ค่าใช้จ่ายตลอด 5 ปี (ประมาณการ)</p>
        <p className="text-4xl font-black text-orange-600">฿{fmt(result.fiveYear)}</p>
        <p className="text-xs text-gray-400 mt-2">เฉลี่ย ฿{fmt(Math.round(result.annual))} / ปี</p>
      </div>

      <p className="text-xs text-gray-400 text-center">
        * ตัวเลขเป็นการประมาณการในกรุงเทพมหานคร ค่าใช้จ่ายจริงอาจแตกต่างตามพื้นที่และพฤติกรรมสัตว์เลี้ยง
      </p>
    </main>
  )
}
