'use client'
import { useState } from 'react'
import { usePetProfile } from '@/hooks/usePetProfile'
import type { PetProfile } from '@/lib/types'
import PetProfileCard from './PetProfileCard'

type Species = PetProfile['species']
type LifeStage = PetProfile['lifeStage']

const SPECIES_OPTIONS: { value: Species; label: string; emoji: string }[] = [
  { value: 'dog', label: 'สุนัข', emoji: '🐕' },
  { value: 'cat', label: 'แมว',   emoji: '🐈' },
]

const LIFESTAGE_OPTIONS: { value: LifeStage; label: string }[] = [
  { value: 'puppy',  label: 'ลูก' },
  { value: 'adult',  label: 'ผู้ใหญ่' },
  { value: 'senior', label: 'สูงวัย' },
]

const chipCls = (active: boolean) =>
  `px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer select-none ${
    active
      ? 'bg-orange-500 text-white border-orange-500'
      : 'bg-white border-gray-200 hover:border-orange-300 hover:text-orange-600'
  }`

export default function PetProfileSetup() {
  const { profile, ready, saveProfile, clearProfile } = usePetProfile()
  const [editing, setEditing]   = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [species, setSpecies]   = useState<Species>('dog')
  const [lifeStage, setLifeStage] = useState<LifeStage>('adult')
  const [name, setName]         = useState('')

  if (!ready) return <div className="w-full max-w-2xl h-20 mb-4" />

  if (profile && !editing) {
    const emoji = profile.species === 'dog' ? '🐕' : '🐈'
    return (
      <div className="w-full max-w-2xl mb-8 bg-white border border-orange-100 rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-gray-800">
            สวัสดี {profile.name}! 🐾 {emoji}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSpecies(profile.species)
                setLifeStage(profile.lifeStage)
                setName(profile.name)
                setEditing(true)
              }}
              className="text-xs text-gray-400 hover:text-orange-500 transition-colors"
            >
              แก้ไข
            </button>
            <button
              onClick={clearProfile}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              ลบ
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowCard(s => !s)}
          className="mt-3 w-full text-center text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 py-2 rounded-xl transition-colors"
        >
          {showCard ? '▲ ซ่อนบัตรน้อง' : '📸 สร้างบัตรน้องแชร์ LINE'}
        </button>
        {showCard && <PetProfileCard profile={profile} />}
      </div>
    )
  }

  function handleSave() {
    if (!name.trim()) return
    saveProfile({ species, lifeStage, name: name.trim() })
    setEditing(false)
  }

  return (
    <div className="w-full max-w-2xl mb-8 bg-white border border-orange-100 rounded-2xl px-5 py-5">
      <p className="font-semibold text-gray-800 mb-4">บอกเราเกี่ยวกับสัตว์เลี้ยงของคุณ 🐾</p>

      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2">ประเภท</p>
        <div className="flex gap-2">
          {SPECIES_OPTIONS.map(o => (
            <button key={o.value} className={chipCls(species === o.value)} onClick={() => setSpecies(o.value)}>
              {o.emoji} {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2">ช่วงวัย</p>
        <div className="flex gap-2">
          {LIFESTAGE_OPTIONS.map(o => (
            <button key={o.value} className={chipCls(lifeStage === o.value)} onClick={() => setLifeStage(o.value)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">ชื่อสัตว์เลี้ยง</p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="เช่น บัตเตอร์, มูมู..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          บันทึก
        </button>
        {editing && (
          <button
            onClick={() => setEditing(false)}
            className="px-5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </div>
  )
}
