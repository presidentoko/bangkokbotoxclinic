'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadFoodsLight } from '@/lib/petfood'
import { getFoodGrade } from '@/lib/grading'
import type { PetFoodLight } from '@/lib/types'
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

const GRADE_COLOR: Record<string, string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-lime-100 text-lime-700',
  C: 'bg-yellow-100 text-yellow-700',
  D: 'bg-orange-100 text-orange-700',
  F: 'bg-red-100 text-red-700',
}

const GRADE_RANK: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, F: 4 }

const BUDGET_PER_KG = 400

function toRec(food: PetFoodLight, desc: string): Rec {
  const g = getFoodGrade(food)
  return {
    title: `${food.brand} ${food.name_th || food.name_en}`.trim(),
    desc,
    href: `/food/${food.slug}`,
    grade: g ?? '—',
    gradeColor: g ? GRADE_COLOR[g] : 'bg-gray-100 text-gray-500',
  }
}

function byQuality(a: PetFoodLight, b: PetFoodLight): number {
  const ra = GRADE_RANK[getFoodGrade(a) ?? ''] ?? 9
  const rb = GRADE_RANK[getFoodGrade(b) ?? ''] ?? 9
  return ra - rb || b.green_count - a.green_count
}

function matches(foods: PetFoodLight[], pred: (f: PetFoodLight) => boolean): PetFoodLight[] {
  return foods.filter(pred).sort(byQuality)
}

// A narrow filter (e.g. renal formulas for cats) can come back empty as the
// dataset shifts — fall back to the best-graded foods so the quiz always answers.
function pick(candidates: PetFoodLight[], desc: string, fallbackDesc: string): Rec[] {
  if (candidates.length > 0) return candidates.slice(0, 2).map(f => toRec(f, desc))
  return graded().sort(byQuality).slice(0, 2).map(f => toRec(f, fallbackDesc))
}

function graded(): PetFoodLight[] {
  return loadFoodsLight().filter(f => getFoodGrade(f) != null)
}

function searchText(f: PetFoodLight): string {
  return `${f.brand} ${f.name_en} ${f.name_th}`.toLowerCase()
}

function getRecs(answers: string[]): Rec[] {
  const [species, age, health, budget] = answers
  const all = graded()
  const pool = species === 'dog' || species === 'cat' ? all.filter(f => f.animal === species) : all

  if (health === 'kidney') return pick(
    matches(pool, f => /renal|kidney|k\/d|urinary|ไต/.test(searchText(f))),
    'สูตรดูแลไต ฟอสฟอรัสต่ำ',
    'เกรดดี ส่วนประกอบสะอาด — ปรึกษาสัตวแพทย์ก่อนเปลี่ยนเป็นสูตรโรคไต',
  )

  if (health === 'allergy') return pick(
    matches(pool, f => /hypoallergenic|sensitive|allergy|grain[- ]?free|single|salmon|แพ้|ผิวหนัง/.test(searchText(f))),
    'ลดโอกาสแพ้ โปรตีนย่อยง่าย',
    'ส่วนประกอบสะอาด เหมาะเริ่ม elimination diet',
  )

  if (age === 'puppy') return pick(
    matches(pool, f => f.life_stage === 'puppy'),
    species === 'cat' ? 'สูตรลูกแมว โปรตีนสูงสำหรับการเจริญเติบโต' : 'สูตรลูกสุนัข โปรตีนสูง บำรุงสมองและกระดูก',
    'เกรดดี เหมาะกับน้องวัยกำลังโต',
  )

  if (age === 'senior') return pick(
    matches(pool, f => f.life_stage === 'senior'),
    'สูตรสูงวัย แคลอรีพอดี ดูแลข้อต่อ',
    'เกรดดี ย่อยง่าย เหมาะกับน้องสูงวัย',
  )

  if (budget === 'budget') return pick(
    matches(pool, f => {
      const g = getFoodGrade(f)
      return (g === 'A' || g === 'B') && f.price_per_kg > 0 && f.price_per_kg <= BUDGET_PER_KG
    }),
    `คุณภาพดี ราคาต่ำกว่า ฿${BUDGET_PER_KG}/กก.`,
    'ราคาเข้าถึงได้ ส่วนประกอบผ่านเกณฑ์',
  )

  if (budget === 'premium') return pick(
    matches(pool, f => getFoodGrade(f) === 'A' && f.price_per_kg >= BUDGET_PER_KG),
    'เกรด A ส่วนประกอบระดับพรีเมียม',
    'เกรดสูงสุดเท่าที่มีในฐานข้อมูล',
  )

  return pick(
    matches(pool, f => {
      const g = getFoodGrade(f)
      return f.life_stage === 'adult' && (g === 'A' || g === 'B')
    }),
    'สมดุลทั้งคุณภาพและราคา',
    'เกรดดี เหมาะกับน้องทั่วไป',
  )
}

const ANSWER_KEYS = ['species', 'age', 'health', 'budget']

// Answers can arrive from a shared link, so each must be one of the options we
// actually offer — otherwise a crafted URL injects arbitrary values into getRecs.
const VALID_VALUES = QUESTIONS.map(q => new Set(q.options.map(o => o.value)))

export default function FoodQuiz() {
  return (
    <Suspense fallback={null}>
      <FoodQuizInner />
    </Suspense>
  )
}

function FoodQuizInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawAnswers = ANSWER_KEYS.map(k => searchParams.get(k))
  const sharedAnswers = rawAnswers.every((v, i) => v != null && VALID_VALUES[i].has(v))
    ? (rawAnswers as string[])
    : null

  const [step, setStep] = useState(sharedAnswers ? QUESTIONS.length : 0)
  const [answers, setAnswers] = useState<string[]>(sharedAnswers ?? [])

  const done = step >= QUESTIONS.length
  const recs = done ? getRecs(answers) : []

  const pick = (val: string) => {
    const next = [...answers, val]
    setAnswers(next)
    setStep(step + 1)
    if (step + 1 >= QUESTIONS.length) {
      const params = new URLSearchParams(ANSWER_KEYS.reduce((acc, k, i) => ({ ...acc, [k]: next[i] }), {} as Record<string, string>))
      router.replace(`/food-quiz?${params.toString()}`, { scroll: false })
    }
  }

  const reset = () => { setStep(0); setAnswers([]); router.replace('/food-quiz', { scroll: false }) }

  if (done) {
    const speciesLabel = answers[0] === 'dog' ? 'สุนัข' : 'แมว'
    const shareParams = new URLSearchParams(ANSWER_KEYS.reduce((acc, k, i) => ({ ...acc, [k]: answers[i] }), {} as Record<string, string>))
    const shareUrl = `https://www.thailandpethub.com/food-quiz?${shareParams.toString()}`
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

        <SocialShare title={`ผลแบบทดสอบ: อาหารน้อง${speciesLabel}ที่เหมาะที่สุด — ${recs[0]?.title}`} url={shareUrl} />

        <div className="mt-4 flex gap-3">
          <button onClick={reset} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">เริ่มใหม่</button>
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
