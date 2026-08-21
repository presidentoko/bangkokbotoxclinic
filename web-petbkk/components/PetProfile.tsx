'use client'

import { useState, useEffect } from 'react'
import { syncLightProfile } from '@/lib/petProfileBridge'

interface Pet {
  name: string
  species: 'dog' | 'cat' | ''
  breed: string
  birthday: string
  weight: string
  lastVaccine: string
  lastDeworming: string
  lastFlea: string
}

const EMPTY: Pet = { name: '', species: '', breed: '', birthday: '', weight: '', lastVaccine: '', lastDeworming: '', lastFlea: '' }

function daysSince(dateStr: string): number | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  return Math.floor((Date.now() - d.getTime()) / 86400000)
}

function statusBadge(days: number | null, warnDays: number, alertDays: number) {
  if (days === null) return { text: 'ยังไม่ระบุ', cls: 'bg-gray-100 text-gray-500' }
  if (days > alertDays) return { text: `${days} วันที่แล้ว — ถึงเวลาแล้ว!`, cls: 'bg-red-100 text-red-600' }
  if (days > warnDays) return { text: `${days} วันที่แล้ว — ใกล้ถึงเวลา`, cls: 'bg-yellow-100 text-yellow-600' }
  return { text: `${days} วันที่แล้ว — ยังโอเค`, cls: 'bg-green-100 text-green-600' }
}

export default function PetProfile() {
  const [pet, setPet] = useState<Pet>(EMPTY)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('petbkk_pet')
      if (stored) setPet(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  const save = () => {
    localStorage.setItem('petbkk_pet', JSON.stringify(pet))
    // Mirror into the light profile the food list and recommendations read;
    // without this, filling this form personalised nothing.
    syncLightProfile(pet)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!loaded) return null

  const hasData = pet.name || pet.species

  const ageStr = (() => {
    if (!pet.birthday) return null
    const d = new Date(pet.birthday)
    if (isNaN(d.getTime())) return null
    const months = Math.floor((Date.now() - d.getTime()) / (30.44 * 86400000))
    if (months < 1) return 'น้อยกว่า 1 เดือน'
    if (months < 12) return `${months} เดือน`
    const y = Math.floor(months / 12)
    const m = months % 12
    return m > 0 ? `${y} ปี ${m} เดือน` : `${y} ปี`
  })()

  const vaccineStatus = statusBadge(daysSince(pet.lastVaccine), 270, 365)
  const dewormStatus = statusBadge(daysSince(pet.lastDeworming), 75, 90)
  const fleaStatus = statusBadge(daysSince(pet.lastFlea), 25, 30)

  if (!hasData || editing) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h3 className="font-black text-gray-800 text-sm mb-4">{hasData ? '✏️ แก้ไขข้อมูลน้อง' : '➕ เพิ่มน้องของคุณ'}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">ชื่อน้อง</label>
            <input value={pet.name} onChange={e => setPet({...pet, name: e.target.value})} placeholder="เช่น มะม่วง" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">ชนิด</label>
            <div className="flex gap-2">
              {(['dog', 'cat'] as const).map(s => (
                <button key={s} onClick={() => setPet({...pet, species: s})} className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-colors ${pet.species === s ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600'}`}>
                  {s === 'dog' ? '🐕 สุนัข' : '🐱 แมว'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">สายพันธุ์</label>
              <input value={pet.breed} onChange={e => setPet({...pet, breed: e.target.value})} placeholder="เช่น ชิห์สึ" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">น้ำหนัก (กก.)</label>
              <input value={pet.weight} onChange={e => setPet({...pet, weight: e.target.value})} placeholder="เช่น 3.5" type="number" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">วันเกิด</label>
            <input type="date" value={pet.birthday} onChange={e => setPet({...pet, birthday: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-orange-400 outline-none" />
          </div>
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-500 mb-2">วันที่ทำครั้งล่าสุด</p>
            <div className="space-y-2">
              {[
                { key: 'lastVaccine', label: '💉 วัคซีน' },
                { key: 'lastDeworming', label: '🪱 ถ่ายพยาธิ' },
                { key: 'lastFlea', label: '🦟 ยาหมัด/เห็บ' },
              ].map(f => (
                <div key={f.key} className="flex items-center gap-2">
                  <span className="text-xs w-24 flex-shrink-0 text-gray-600">{f.label}</span>
                  <input type="date" value={pet[f.key as keyof Pet]} onChange={e => setPet({...pet, [f.key]: e.target.value})} className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:border-orange-400 outline-none" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors">บันทึก</button>
            {hasData && <button onClick={() => setEditing(false)} className="px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50">ยกเลิก</button>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{pet.species === 'dog' ? '🐕' : '🐱'}</span>
          <div>
            <p className="font-black text-gray-900">{pet.name}</p>
            {(pet.breed || ageStr) && <p className="text-xs text-gray-400">{[pet.breed, ageStr && `อายุ ${ageStr}`].filter(Boolean).join(' · ')}</p>}
          </div>
        </div>
        <button onClick={() => setEditing(true)} className="text-xs text-orange-500 hover:text-orange-600 font-semibold">แก้ไข</button>
      </div>

      {pet.weight && (
        <div className="text-xs text-gray-500 mb-3">⚖️ น้ำหนัก: <span className="font-bold text-gray-700">{pet.weight} กก.</span></div>
      )}

      <div className="space-y-2">
        <a href="/vaccine" className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group">
          <span className="text-xs font-semibold text-gray-600 group-hover:text-orange-600">💉 วัคซีน</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${vaccineStatus.cls}`}>{vaccineStatus.text}</span>
        </a>
        <a href="/deworming" className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group">
          <span className="text-xs font-semibold text-gray-600 group-hover:text-orange-600">🪱 ถ่ายพยาธิ</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${dewormStatus.cls}`}>{dewormStatus.text}</span>
        </a>
        <a href="/flea" className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group">
          <span className="text-xs font-semibold text-gray-600 group-hover:text-orange-600">🦟 ยาหมัด/เห็บ</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${fleaStatus.cls}`}>{fleaStatus.text}</span>
        </a>
      </div>

      {saved && <p className="text-xs text-green-500 text-center mt-3 font-semibold">✓ บันทึกแล้ว</p>}
    </div>
  )
}
