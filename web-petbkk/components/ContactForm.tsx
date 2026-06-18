'use client'

import { useState } from 'react'

const TOPICS = [
  { icon: '🏥', label: 'แจ้งข้อมูลโรงพยาบาลสัตว์' },
  { icon: '🍖', label: 'ข้อมูลอาหารสัตว์เลี้ยง' },
  { icon: '🐾', label: 'ร่วมกันสร้างชุมชน' },
  { icon: '📣', label: 'ลงโฆษณา / พาร์ทเนอร์' },
  { icon: '❓', label: 'อื่นๆ' },
]

export default function ContactForm() {
  const [topic,   setTopic]   = useState(TOPICS[0].label)
  const [name,    setName]    = useState('')
  const [message, setMessage] = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (message.trim().length < 5) return
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, topic, message }),
      })
      setStatus(r.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <p className="text-4xl mb-3">✅</p>
        <p className="font-bold text-green-800 text-lg mb-1">ส่งสำเร็จแล้ว!</p>
        <p className="text-sm text-green-600">ทีมงานจะติดต่อกลับโดยเร็ว ขอบคุณมากครับ 🐾</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 flex flex-col gap-4">
      {/* Topic */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">หัวข้อ</label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(t => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTopic(t.label)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                topic === t.label
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-orange-300'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          ชื่อ <span className="text-gray-400 font-normal">(ไม่บังคับ)</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="ชื่อของคุณ"
          maxLength={80}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">ข้อความ</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="เขียนข้อความถึงเราที่นี่..."
          required
          minLength={5}
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-500">เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || message.trim().length < 5}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {status === 'loading' ? 'กำลังส่ง...' : 'ส่งข้อความ'}
      </button>
    </form>
  )
}
