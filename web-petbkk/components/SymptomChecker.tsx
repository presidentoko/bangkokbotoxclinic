'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SocialShare from '@/components/SocialShare'

type Animal = 'dog' | 'cat' | ''

interface Result {
  title: string
  href: string
  urgent: boolean
  note: string
}

const SYMPTOM_MAP: Record<string, Record<string, Result>> = {
  'ไม่กินอาหาร': {
    dog: { title: 'สุนัขไม่กินอาหาร', href: '/not-eating', urgent: false, note: 'สุนัขอดได้ 48-72 ชม. ก่อนเป็นอันตราย' },
    cat: { title: 'แมวไม่กินอาหาร', href: '/not-eating', urgent: true, note: 'แมวไม่กิน > 24 ชม. เสี่ยงโรคตับ พาหมอด่วน!' },
  },
  'ท้องเสีย/ถ่ายเหลว': {
    dog: { title: 'สุนัขท้องเสีย', href: '/diarrhea', urgent: false, note: 'ดูแลที่บ้านได้ถ้าไม่มีเลือด' },
    cat: { title: 'แมวท้องเสีย', href: '/diarrhea', urgent: false, note: 'ดูแลที่บ้านได้ถ้าไม่มีเลือด' },
  },
  'อาเจียน': {
    dog: { title: 'สุนัขอาเจียน', href: '/emergency', urgent: false, note: 'อาเจียน 1-2 ครั้งปกติ แต่ถ้าซ้ำต้องพาหมอ' },
    cat: { title: 'แมวอาเจียน', href: '/emergency', urgent: false, note: 'แยกแยะก้อนขนปกติกับอาเจียนจริง' },
  },
  'ตาเป็นหนอง/ตาแดง': {
    dog: { title: 'ตาสุนัขอักเสบ', href: '/eye-care', urgent: false, note: 'สีเหลือง/เขียว = พาหมอ' },
    cat: { title: 'ตาแมวเป็นหนอง', href: '/eye-care', urgent: false, note: 'สีเหลือง/เขียว = พาหมอ' },
  },
  'ตะกายหู/หูกลิ่น': {
    dog: { title: 'หูสุนัขอักเสบ', href: '/ear-care', urgent: false, note: 'ทำความสะอาดหูก่อน ถ้าไม่ดีพาหมอ' },
    cat: { title: 'หูแมวมีปัญหา', href: '/ear-care', urgent: false, note: 'อาจเป็นไรหู ต้องตรวจ' },
  },
  'คันผิวหนัง/เกาตัว': {
    dog: { title: 'สุนัขแพ้/คัน', href: '/allergy', urgent: false, note: 'อาจเป็นหมัด อาหาร หรือสภาพแวดล้อม' },
    cat: { title: 'แมวคันผิวหนัง', href: '/allergy', urgent: false, note: 'ตรวจหาหมัดก่อน' },
  },
  'ซึม/อ่อนแรง': {
    dog: { title: 'สุนัขซึม', href: '/emergency', urgent: true, note: 'ซึมมาก อ่อนแรง ต้องพาหมอเร็ว' },
    cat: { title: 'แมวซึม', href: '/emergency', urgent: true, note: 'ซึมมาก อ่อนแรง ต้องพาหมอเร็ว' },
  },
  'น้ำหนักลด': {
    dog: { title: 'สุนัขน้ำหนักลด', href: '/weight', urgent: false, note: 'ตรวจน้ำหนักเทียบ BCS' },
    cat: { title: 'แมวน้ำหนักลด', href: '/weight', urgent: false, note: 'ตรวจน้ำหนักเทียบ BCS' },
  },
  'ดื่มน้ำมากผิดปกติ': {
    dog: { title: 'เสี่ยงโรคเบาหวาน/ไต', href: '/diabetes', urgent: true, note: 'ต้องตรวจเลือดวินิจฉัย' },
    cat: { title: 'เสี่ยงโรคเบาหวาน/ไต', href: '/diabetes', urgent: true, note: 'ต้องตรวจเลือดวินิจฉัย' },
  },
  'ลมแดด/ตัวร้อนมาก': {
    dog: { title: '🚨 ฉุกเฉิน: โรคลมแดด', href: '/heatstroke', urgent: true, note: 'ฉุกเฉิน! ดูคู่มือปฐมพยาบาลทันที' },
    cat: { title: '🚨 ฉุกเฉิน: โรคลมแดด', href: '/heatstroke', urgent: true, note: 'ฉุกเฉิน! ดูคู่มือปฐมพยาบาลทันที' },
  },
}

const SYMPTOMS = Object.keys(SYMPTOM_MAP)

export default function SymptomChecker() {
  return (
    <Suspense fallback={null}>
      <SymptomCheckerInner />
    </Suspense>
  )
}

function SymptomCheckerInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialAnimal = (searchParams.get('animal') === 'dog' || searchParams.get('animal') === 'cat')
    ? (searchParams.get('animal') as Animal) : ''
  const initialSymptom = searchParams.get('symptom') ?? ''

  const [animal, setAnimal] = useState<Animal>(initialAnimal)
  const [symptom, setSymptom] = useState(initialSymptom && SYMPTOMS.includes(initialSymptom) ? initialSymptom : '')
  const result = symptom && animal ? SYMPTOM_MAP[symptom]?.[animal] : null

  const selectSymptom = (a: Animal, s: string) => {
    setSymptom(s)
    if (a) router.replace(`/symptoms?animal=${a}&symptom=${encodeURIComponent(s)}`, { scroll: false })
  }

  const shareUrl = result ? `https://www.thailandpethub.com/symptoms?animal=${animal}&symptom=${encodeURIComponent(symptom)}` : undefined

  return (
    <div>
      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-5">
        <p className="font-bold text-gray-700 text-sm mb-3">น้องของคุณเป็น?</p>
        <div className="grid grid-cols-2 gap-3">
          {[{ val: 'dog', label: '🐕 สุนัข' }, { val: 'cat', label: '🐱 แมว' }].map(a => (
            <button
              key={a.val}
              onClick={() => { setAnimal(a.val as Animal); setSymptom(''); router.replace('/symptoms', { scroll: false }) }}
              className={`p-4 rounded-xl border-2 font-semibold text-base transition-all ${animal === a.val ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50/50'}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </section>

      {animal && (
        <section className="bg-white rounded-2xl border shadow-sm p-6 mb-5">
          <p className="font-bold text-gray-700 text-sm mb-3">อาการที่พบ?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SYMPTOMS.map(s => (
              <button
                key={s}
                onClick={() => selectSymptom(animal, s)}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${symptom === s ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-orange-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      )}

      {result && (
        <div className={`rounded-2xl border-2 p-6 mb-6 ${result.urgent ? 'border-red-400 bg-red-50' : 'border-green-400 bg-green-50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{result.urgent ? '🚨' : '📋'}</span>
            <h2 className={`font-black text-lg ${result.urgent ? 'text-red-700' : 'text-green-700'}`}>{result.title}</h2>
          </div>
          <p className={`text-sm mb-4 ${result.urgent ? 'text-red-600' : 'text-green-600'}`}>{result.note}</p>
          <div className="flex gap-3 flex-wrap">
            <a href={result.href} className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-colors ${result.urgent ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}>
              ดูคู่มือ →
            </a>
            {result.urgent && (
              <a href="/hospital" className="px-4 py-2.5 rounded-xl font-bold text-sm bg-white border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                🏥 หาโรงพยาบาล
              </a>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mb-6 italic">ข้อมูลนี้เป็นแนวทางเบื้องต้น ไม่ใช่คำวินิจฉัยทางสัตวแพทย์</p>
      <SocialShare title="ตรวจสอบอาการสัตว์เลี้ยง — ThailandPetHub" url={shareUrl ?? 'https://www.thailandpethub.com/symptoms'} />
    </div>
  )
}
