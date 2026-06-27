'use client'
import { useState } from 'react'

export function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="bg-[#1A1A1A] text-white py-12 px-4">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-2">Weekly Price Updates</h2>
        <p className="text-[#8C7355] text-sm mb-6">
          Get notified when prices drop on items you're watching. No spam, unsubscribe anytime.
        </p>
        {status === 'done' ? (
          <p className="text-[#B8954A] font-medium">You're on the list ✓</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full text-sm text-[#1A1A1A] focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2 bg-[#B8954A] text-white rounded-full text-sm font-medium hover:bg-[#9A7A3A] transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? '...' : 'Notify me'}
            </button>
          </form>
        )}
        {status === 'error' && <p className="text-red-400 text-sm mt-2">Something went wrong. Try again.</p>}
      </div>
    </section>
  )
}
