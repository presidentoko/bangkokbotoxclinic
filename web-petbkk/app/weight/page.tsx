import type { Metadata } from 'next'
import WeightClient from './WeightClient'

export const metadata: Metadata = {
  title: 'ประเมินน้ำหนักสัตว์เลี้ยง (BCS) — อ้วน ผอม หรือสมบูรณ์แบบ?',
  description: 'ประเมิน Body Condition Score (BCS 1-9) ของสุนัขและแมว ตรวจสอบว่าน้องน้ำหนักเกิน อ้วน ผอม หรืออยู่ในเกณฑ์ดี พร้อมคำแนะนำ',
  alternates: { canonical: 'https://www.thailandpethub.com/weight' },
  keywords: ['น้ำหนักสุนัข', 'สุนัขอ้วน', 'แมวอ้วน', 'BCS สัตว์เลี้ยง', 'ประเมินน้ำหนักสัตว์เลี้ยง'],
  openGraph: {
    title: 'ประเมินน้ำหนักสัตว์เลี้ยง BCS — อ้วน ผอม หรือสมบูรณ์?',
    description: 'ประเมิน Body Condition Score ของสุนัขและแมว',
    url: 'https://www.thailandpethub.com/weight',
  },
}

function WeightSchemaLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'เครื่องมือประเมินน้ำหนักสัตว์เลี้ยง (BCS)',
    applicationCategory: 'HealthApplication',
    url: 'https://www.thailandpethub.com/weight',
    description: 'ประเมิน Body Condition Score (BCS) ของสุนัขและแมว ตรวจสอบว่าน้องน้ำหนักเกิน อ้วน หรือผอมเกินไป',
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function WeightPage() {
  return (
    <main className="max-w-2xl mx-auto">
      <WeightSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ประเมินน้ำหนัก BCS</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">⚖️ ประเมินน้ำหนักสัตว์เลี้ยง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        น้ำหนักตัวเลขอย่างเดียวไม่บอกว่าสัตว์เลี้ยงสุขภาพดีไหม
        สัตวแพทย์ใช้ <strong>Body Condition Score (BCS)</strong> 1-9 เพื่อประเมินร่างกายจริง
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        60% ของสัตว์เลี้ยงในไทยมีน้ำหนักเกิน ซึ่งเพิ่มความเสี่ยงโรคเบาหวาน โรคข้อ และอายุสั้นลง
      </p>

      <WeightClient />
    </main>
  )
}
