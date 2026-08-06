'use client'
import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setState('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p className="text-green-600 font-medium text-sm">
        ✅ รับแล้ว! เราจะส่งอัพเดตใหม่ให้คุณ
      </p>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-xs mx-auto">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="อีเมลของคุณ"
          required
          className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 bg-white"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="px-3 py-1.5 text-xs bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex-shrink-0"
        >
          {state === 'loading' ? '...' : 'สมัคร'}
        </button>
      </form>
      {state === 'error' && (
        <p className="text-red-500 text-xs mt-1.5">สมัครไม่สำเร็จ ลองใหม่อีกครั้ง</p>
      )}
    </div>
  )
}
