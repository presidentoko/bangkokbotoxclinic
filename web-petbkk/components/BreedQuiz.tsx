'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SocialShare from '@/components/SocialShare'

const QUESTIONS = [
  { id: 'home', q: 'บ้านของคุณเป็นแบบไหน?', options: [{ label: '🏢 คอนโด/อพาร์ทเมนต์', value: 'condo' }, { label: '🏠 บ้านมีสวน', value: 'house' }] },
  { id: 'time', q: 'คุณมีเวลาดูแลน้องแค่ไหน?', options: [{ label: '⏰ ยุ่งมาก ออกทำงานทั้งวัน', value: 'busy' }, { label: '🏡 อยู่บ้านหรือมีเวลาพอสมควร', value: 'available' }] },
  { id: 'activity', q: 'ชีวิต active แค่ไหน?', options: [{ label: '🛋️ ชอบอยู่บ้านผ่อนคลาย', value: 'calm' }, { label: '🏃 ชอบออกกำลัง เดินเล่น', value: 'active' }] },
  { id: 'experience', q: 'ประสบการณ์เลี้ยงสัตว์?', options: [{ label: '🆕 มือใหม่ ครั้งแรก', value: 'new' }, { label: '✅ เคยเลี้ยงมาก่อน', value: 'experienced' }] },
]

const BREEDS = [
  { id: 'shih-tzu',        name: 'ชิห์สึ', icon: '🐕', type: 'dog', desc: 'เงียบ รักการนอน เหมาะคอนโดมาก', href: '/breeds/shih-tzu', match: (a: Record<string,string>) => a.home === 'condo' && a.activity === 'calm' },
  { id: 'golden-retriever',name: 'โกลเด้น รีทรีฟเวอร์', icon: '🐕', type: 'dog', desc: 'ฉลาด เป็นมิตร ต้องการพื้นที่และออกกำลัง', href: '/breeds/golden-retriever', match: (a: Record<string,string>) => a.home === 'house' && a.activity === 'active' && a.experience === 'experienced' },
  { id: 'toy-poodle',      name: 'พูเดิล (ทอย)', icon: '🐩', type: 'dog', desc: 'ฉลาด ฝึกง่าย ขนหลุดน้อย เหมาะมือใหม่', href: '/breeds/poodle', match: (a: Record<string,string>) => a.activity === 'calm' && a.experience === 'new' },
  { id: 'pomeranian',      name: 'ปอมเมอเรเนียน', icon: '🐕', type: 'dog', desc: 'น่ารัก สดใส คอนโดได้ แต่ต้องดูแลขน', href: '/breeds/pomeranian', match: (a: Record<string,string>) => a.home === 'condo' && a.activity === 'active' && a.experience === 'new' },
  { id: 'thai-cat',        name: 'แมวไทย/วิเชียรมาศ', icon: '🐱', type: 'cat', desc: 'เป็นอิสระ ดูแลง่าย เหมาะคนยุ่ง', href: '/breeds/thai', match: (a: Record<string,string>) => a.time === 'busy' },
  { id: 'persian',         name: 'เปอร์เซีย', icon: '🐱', type: 'cat', desc: 'เงียบ สงบ สวยงาม แต่ต้องดูแลขนทุกวัน', href: '/breeds/persian', match: (a: Record<string,string>) => a.time === 'available' && a.activity === 'calm' },
  { id: 'british-shorthair', name: 'บริติช ชอร์ตแฮร์', icon: '🐱', type: 'cat', desc: 'สงบ เป็นอิสระ เลี้ยงง่าย เหมาะมือใหม่', href: '/breeds', match: (a: Record<string,string>) => a.experience === 'new' && a.home === 'condo' },
  { id: 'scottish-fold',   name: 'สก็อตติช โฟลด์', icon: '🐱', type: 'cat', desc: 'หน้าตาน่ารัก สงบ ปรับตัวดี', href: '/breeds/scottish-fold', match: (a: Record<string,string>) => a.activity === 'calm' && a.time === 'available' && a.experience === 'experienced' },
]

const DEFAULT = { id: 'rescue-cat', name: 'แมวรับเลี้ยง (Rescue)', icon: '💚', type: 'cat', desc: 'รับเลี้ยงแมวบ้านจากมูลนิธิ — ขอบคุณที่ช่วยชีวิตน้อง!', href: '/adopt', match: () => true }

interface BreedResult {
  id: string
  name: string
  icon: string
  type: string
  desc: string
  href: string
}

function findBreedById(id: string): BreedResult | null {
  return BREEDS.find(b => b.id === id) ?? (id === DEFAULT.id ? DEFAULT : null)
}

export default function BreedQuiz() {
  return (
    <Suspense fallback={null}>
      <BreedQuizInner />
    </Suspense>
  )
}

function BreedQuizInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Capture only the `b` param present at first mount — a real shared link —
  // so it isn't re-triggered by our own router.replace() once the quiz finishes.
  const [sharedResult] = useState(() => {
    const b = searchParams.get('b')
    return b ? findBreedById(b) : null
  })

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0)
  const [ownResult, setOwnResult] = useState<BreedResult | null>(null)
  const done = !!sharedResult || !!ownResult

  const handleAnswer = (value: string) => {
    const newA = { ...answers, [QUESTIONS[step].id]: value }
    setAnswers(newA)
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1)
    } else {
      const match = BREEDS.find(b => b.match(newA)) || DEFAULT
      setOwnResult(match)
      router.replace(`/breed-quiz?b=${match.id}`, { scroll: false })
    }
  }

  const result = sharedResult ?? ownResult
  const reset = () => { setAnswers({}); setStep(0); setOwnResult(null); router.replace('/breed-quiz', { scroll: false }) }
  const shareUrl = result ? `https://www.thailandpethub.com/breed-quiz?b=${result.id}` : undefined

  return (
    <div>
      {!done ? (
        <div className="bg-white rounded-2xl border shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-orange-500 font-bold">คำถาม {step + 1} / {QUESTIONS.length}</span>
            <div className="flex gap-1">{QUESTIONS.map((_, i) => <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? 'bg-orange-400' : 'bg-gray-200'}`} />)}</div>
          </div>
          <p className="text-lg font-black text-gray-800 mb-5">{QUESTIONS[step].q}</p>
          <div className="space-y-3">
            {QUESTIONS[step].options.map(opt => (
              <button key={opt.value} onClick={() => handleAnswer(opt.value)} className="w-full text-left p-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition-all text-sm">
                {opt.label}
              </button>
            ))}
          </div>
          {step > 0 && <button onClick={() => setStep(step - 1)} className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline">← ย้อนกลับ</button>}
        </div>
      ) : result ? (
        <div className="bg-white rounded-2xl border-2 border-orange-300 shadow-md p-6">
          <div className="text-center mb-5">
            {sharedResult && (
              <p className="text-xs text-gray-400 mb-2">🔗 ผลลัพธ์ที่เพื่อนแชร์มา</p>
            )}
            <p className="text-6xl mb-3">{result.icon}</p>
            <p className="text-xs text-orange-500 font-bold uppercase tracking-wide mb-1">น้องที่เหมาะกับคุณ</p>
            <h2 className="text-2xl font-black text-gray-900">{result.name}</h2>
            <p className="text-gray-600 text-sm mt-2">{result.desc}</p>
          </div>
          <div className="flex gap-3 mb-4">
            <a href={result.href} className="flex-1 text-center py-2.5 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors">ดูข้อมูลเพิ่มเติม</a>
            <a href="/adopt" className="flex-1 text-center py-2.5 bg-green-600 text-white font-bold rounded-xl text-sm hover:bg-green-700 transition-colors">💚 รับเลี้ยง</a>
          </div>
          <button onClick={reset} className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 underline">ทำแบบทดสอบอีกครั้ง</button>
          <SocialShare title={`ฉันเหมาะกับ ${result.name} — ลองทำแบบทดสอบดูสิ`} url={shareUrl} />
        </div>
      ) : null}
    </div>
  )
}
