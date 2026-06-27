'use client'

import { useState, useRef } from 'react'
import { sendContactMessage } from './actions'

const t = (locale: string, key: string) => {
  const strings: Record<string, Record<string, string>> = {
    en: {
      name: 'Name', email: 'Email', message: 'Message', send: 'Send Message', sending: 'Sending…',
      name_ph: 'Your name', email_ph: 'your@email.com',
      msg_ph: 'Ask about a price, report an error, or just say hi…',
      done_title: 'Message sent!', done_sub: "We'll get back to you soon.", send_another: 'Send another',
      topic: 'Topic',
      type_question: 'Price question', type_wrong: 'Wrong / outdated price data',
      type_ad: 'Ad / sponsored content', type_collab: 'Collaboration / partnership', type_other: 'Other',
    },
    th: {
      name: 'ชื่อ', email: 'อีเมล', message: 'ข้อความ', send: 'ส่งข้อความ', sending: 'กำลังส่ง…',
      name_ph: 'ชื่อของคุณ', email_ph: 'อีเมลของคุณ',
      msg_ph: 'สอบถามราคา แจ้งข้อผิดพลาด หรือทักมาคุยได้เลย…',
      done_title: 'ส่งสำเร็จแล้ว!', done_sub: 'เราจะติดต่อกลับเร็วๆ นี้', send_another: 'ส่งอีกครั้ง',
      topic: 'หัวข้อ',
      type_question: 'สอบถามราคา', type_wrong: 'ข้อมูลราคาผิด / ล้าสมัย',
      type_ad: 'โฆษณา / สปอนเซอร์', type_collab: 'ความร่วมมือ / พาร์ทเนอร์', type_other: 'อื่นๆ',
    },
  }
  return strings[locale]?.[key] ?? strings.en[key] ?? key
}

export function ContactForm({ locale }: { locale: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const formData = new FormData(e.currentTarget)
    formData.set('locale', locale)
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
        <p className="text-green-700 font-medium text-lg">{t(locale, 'done_title')}</p>
        <p className="text-green-600 text-sm mt-1">{t(locale, 'done_sub')}</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-gray-500 underline">{t(locale, 'send_another')}</button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">{t(locale, 'topic')}</label>
        <select id="type" name="type" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 bg-white">
          <option value="question">{t(locale, 'type_question')}</option>
          <option value="wrong_data">{t(locale, 'type_wrong')}</option>
          <option value="ad">{t(locale, 'type_ad')}</option>
          <option value="collaboration">{t(locale, 'type_collab')}</option>
          <option value="other">{t(locale, 'type_other')}</option>
        </select>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t(locale, 'name')} *</label>
        <input id="name" name="name" type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900" placeholder={t(locale, 'name_ph')} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t(locale, 'email')}</label>
        <input id="email" name="email" type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900" placeholder={t(locale, 'email_ph')} />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">{t(locale, 'message')} *</label>
        <textarea id="message" name="message" required rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 resize-none" placeholder={t(locale, 'msg_ph')} />
      </div>
      {status === 'error' && <p className="text-red-600 text-sm">{errorMsg}</p>}
      <button type="submit" disabled={status === 'sending'} className="w-full bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
        {status === 'sending' ? t(locale, 'sending') : t(locale, 'send')}
      </button>
    </form>
  )
}
