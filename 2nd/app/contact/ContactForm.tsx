'use client'

import { useState, useRef } from 'react'
import { sendContactMessage } from './actions'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const formData = new FormData(e.currentTarget)
    const result = await sendContactMessage(formData)
    if (result.ok) {
      setStatus('done')
      formRef.current?.reset()
    } else {
      setStatus('error')
      setErrorMsg(result.error || 'Something went wrong.')
    }
  }

  if (status === 'done') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-700 font-medium text-lg">Message sent!</p>
        <p className="text-green-600 text-sm mt-1">We'll get back to you soon.</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-gray-500 underline">Send another</button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 resize-none"
          placeholder="Ask about a price, report an error, or just say hi..."
        />
      </div>
      {status === 'error' && (
        <p className="text-red-600 text-sm">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
