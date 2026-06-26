'use client'

import { useState } from 'react'
import SocialShare from './SocialShare'

const QUESTIONS = [
  {
    q: 'น้องของคุณเป็น?',
    options: [
      { label: '🐕 สุนัข', value: 'dog' },
      { label: '🐱 แมว', value: 'cat' },
    ],
  },
  {
    q: 'อายุน้อง?',
    options: [
      { label: '🐣 ลูก (< 1 ปี)', value: 'puppy' },
      { label: '🌟 วัยผู้ใหญ่ (1-7 ปี)', value: 'adult' },
      { label: '👴 สูงอายุ (7 ปีขึ้นไป)', value: 'senior' },
    ],
  },
  {
    q: 'น้องมีสุขภาพพิเศษไหม?',
    options: [
      { label: '✅ แข็งแรงปกติ', value: 'healthy' },
      { label: '⚖️ น้ำหนักเกิน', value: 'overweight' },
      { label: '🫘 ไตมีปัญหา', value: 'kidney' },
      { label: '🤧 แพ้อาหาร/ผิวหนัง', value: 'allergy' },
    ],
  },
  {
    q: 'งบประมาณต่อเดือน?',
    options: [
      { label: '💰 ประหยัด (< ฿500)', value: 'budget' },
      { label: '💎 ปานกลาง (฿500-1,500)', value: 'mid' },
      { label: '🏆 ไม่อั้น (฿1,500+)', value: 'premium' },
    ],
  },
]

interface Rec {
  title: string
  desc: string
  href: string
  grade: string
  gradeColor: string
}

function getRecs(answers: string[]): Rec[] {
  const [species, age, health, budget] = answers

  if (health === 'kidney') return [
    { title: 'Royal Canin Renal', desc: 'ลดฟอสฟอรัส สูตรเฉพาะโรคไต', href: '/food?q=royal+canin+renal', grade: 'A', gradeColor: 'bg-green-100 text-green-700' },
    { title: 'Hill\'s k/d', desc: 'สูตร kidney care จาก vet', href: '/food?q=hills+kd', grade: 'A', gradeColor: 'bg-green-100 text-green-700' },
  ]

  if (health === 'allergy') return [
    { title: 'Royal Canin Hypoallergenic', desc: 'โปรตีนไฮโดรไลซ์ ลดการแพ้', href: '/food?q=hypoallergenic', grade: 'A', gradeColor: 'bg-green-100 text-green-700' },
    { title: 'Acana Single Protein', desc: 'โปรตีนเดียว ง่ายต่อ elimination diet', href: '/food?q=acana+single', grade: 'A+', gradeColor: 'bg-green-100 text-green-700' },
  ]

  if (age === 'puppy' && species === 'dog') return [
    { title: 'Royal Canin Puppy', desc: 'โปรตีนสูง DHA สำหรับสมองลูกสุนัข', href: '/food?q=royal+canin+puppy', grade: 'B+', gradeColor: 'bg-blue-100 text-blue-700' },
    { title: 'Acana Puppy & Junior', desc: 'เนื้อเป็นส่วนผสมหลัก ไม่มีสีผสม', href: '/food?q=acana+puppy', grade: 'A', gradeColor: 'bg-green-100 text-green-700' },
  ]

  if (age === 'senior') return [
    { title: 'Hill\'s Science Diet Senior', desc: 'ลดแคลอรี่ เพิ่ม Omega-3 สำหรับข้อ', href: '/food?q=hills+senior', grade: 'A', gradeColor: 'bg-green-100 text-green-700' },
    { title: 'Royal Canin Mature', desc: 'เหมาะกับระบบย่อยอาหารที่ช้าลง', href: '/food?q=royal+canin+mature', grade: 'B+', gradeColor: 'bg-blue-100 text-blue-700' },
  ]

  if (budget === 'budget') return [
    { title: 'SmartHeart Gold', desc: 'ราคาประหยัด โปรตีนพอเพียง', href: '/food?q=smartheart', grade: 'C', gradeColor: 'bg-yellow-100 text-yellow-700' },
    { title: 'Pedigree Adult', desc: 'หาง่ายทุกที่ ราคาดี', href: '/food?q=pedigree', grade: 'C+', gradeColor: 'bg-yellow-100 text-yellow-700' },
  ]

  if (budget === 'premium') return [
    { title: 'Orijen Original', desc: 'เนื้อสัตว์ 85% ไม่มีธัญพืช', href: '/food?q=orijen', grade: 'A+', gradeColor: 'bg-green-100 text-green-700' },
    { title: 'Acana Regionals', desc: 'แหล่งโปรตีนหลากหลาย เกรดสูง', href: '/food?q=acana+regional', grade: 'A+', gradeColor: 'bg-green-100 text-green-700' },
  ]

  return [
    { title: 'Royal Canin Adult', desc: 'มาตรฐาน ราคากลาง หาได้ทุกที่', href: '/food?q=royal+canin+adult', grade: 'B+', gradeColor: 'bg-blue-100 text-blue-700' },
    { title: 'Hill\'s Science Diet', desc: 'ผ่านการวิจัย คุณภาพดี', href: '/food?q=hills+science', grade: 'A', gradeColor: 'bg-green-100 text-green-700' },
  ]
}

export default function FoodQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  const done = step >= QUESTIONS.length
  const recs = done ? getRecs(answers) : []

  const pick = (val: string) => {
    const next = [...answers, val]
    setAnswers(next)
    setStep(step + 1)
  }

  if (done) {
    const speciesLabel = answers[0] === 'dog' ? 'สุนัข' : 'แมว'
    return (
      <div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-4">
          <p className="font-black text-orange-700 text-base mb-1">🎯 อาหารที่แนะนำสำหรับน้อง{speciesLabel}ของคุณ</p>
          <p className="text-xs text-orange-600 mb-4">คลิกเพื่อดูรายละเอียดส่วนผสมและเกรด</p>
          <div className="space-y-3">
            {recs.map(r => (
              <a key={r.href} href={r.href} className="flex items-center justify-between bg-white rounded-xl border border-orange-100 px-4 py-3 hover:border-orange-300 hover:shadow-sm transition-all">
                <div>
                  <p className="font-bold text-sm text-gray-800">{r.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg flex-shrink-0 ml-3 ${r.gradeColor}`}>{r.grade}</span>
              </a>
            ))}
          </div>
        </div>

        <SocialShare title={`ผลแบบทดสอบ: อาหารน้อง${speciesLabel}ที่เหมาะที่สุด — ${recs[0]?.title}`} />

        <div className="mt-4 flex gap-3">
          <button onClick={() => { setStep(0); setAnswers([]) }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">เริ่มใหม่</button>
          <a href="/food" className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold text-center hover:bg-orange-600 transition-colors">ดูอาหารทั้งหมด →</a>
        </div>
      </div>
    )
  }

  const q = QUESTIONS[step]
  return (
    <div>
      {step > 0 && (
        <button onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)) }} className="text-xs text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">← ย้อนกลับ</button>
      )}
      <div className="mb-2">
        <span className="text-xs text-gray-400">{step + 1} / {QUESTIONS.length}</span>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
          <div className="bg-orange-400 h-1.5 rounded-full transition-all" style={{ width: `${((step) / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>
      <p className="font-black text-gray-900 text-lg mb-4">{q.q}</p>
      <div className="space-y-2">
        {q.options.map(o => (
          <button key={o.value} onClick={() => pick(o.value)} className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all font-semibold text-sm text-gray-700">
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
