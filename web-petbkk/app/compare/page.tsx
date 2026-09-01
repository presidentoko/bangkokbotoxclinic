import { Suspense } from 'react'
import type { Metadata } from 'next'
import CompareContent from './CompareContent'
import { loadFoodsLight, getFoodGrade } from '@/lib/petfood'

export const metadata: Metadata = {
  title: 'เปรียบเทียบอาหารสัตว์เลี้ยง — โปรตีน ไขมัน ราคาต่อกิโลกรัม',
  description:
    'เปรียบเทียบอาหารสุนัขและแมวแบบเคียงข้างกัน ดูเกรดส่วนประกอบ โปรตีนและไขมันแบบ dry matter และราคาต่อกิโลกรัม เลือกได้สูงสุด 3 รายการ',
  alternates: { canonical: 'https://www.thailandpethub.com/compare' },
  keywords: ['เปรียบเทียบอาหารสัตว์เลี้ยง', 'เทียบอาหารสุนัข', 'เทียบอาหารแมว', 'ราคาอาหารสัตว์ต่อกิโล'],
}

/**
 * Everything below the fold used to live inside a Suspense boundary whose child
 * reads `?ids=` via useSearchParams, so the prerendered HTML was empty — the
 * route advertised itself in the sitemap and then served a crawler nothing.
 *
 * With no `ids` there is genuinely no comparison to show, so instead of faking
 * one the shell explains the tool and hands out entry points: brand-level
 * links a crawler can follow, which the page previously had none of.
 */
function HowItWorks() {
  const foods = loadFoodsLight()
  const gradeA = foods.filter(f => getFoodGrade(f) === 'A')
  // This used to sort by `green_count` alone, with a comment explaining that
  // price_thb/price_per_kg were 0 across the whole dataset. That is no longer
  // true — the Thai retail import put a price on 697 products and a per-kilo
  // figure on 436 — so the best-value cut this page is for can finally be made.
  // Products still missing a price fall back to the ingredient sort rather than
  // being dropped, so the section never empties.
  const priced = gradeA.filter(f => (f.price_per_kg ?? 0) > 0)
  const pickA = (priced.length >= 5 ? priced : gradeA)
    .slice()
    .sort((a, b) =>
      ((a.price_per_kg ?? 0) > 0 && (b.price_per_kg ?? 0) > 0
        ? (a.price_per_kg ?? 0) - (b.price_per_kg ?? 0)
        : 0) ||
      b.green_count - a.green_count
    )
    .slice(0, 8)

  return (
    <section className="mt-8">
      <h2 className="text-base font-bold text-gray-800 mb-2">เปรียบเทียบอย่างไร</h2>
      <ol className="text-sm text-gray-600 space-y-1.5 mb-6 list-decimal list-inside">
        <li>เปิดหน้าอาหารที่สนใจจาก <a href="/food" className="text-orange-600 hover:underline">รายการอาหารทั้งหมด</a></li>
        <li>กดปุ่มเปรียบเทียบบนการ์ดอาหาร เลือกได้สูงสุด 3 รายการ</li>
        <li>กลับมาที่หน้านี้เพื่อดูโปรตีน ไขมัน (dry matter) เกรดส่วนประกอบ และราคาต่อกิโลกรัมเคียงข้างกัน</li>
      </ol>

      <h2 className="text-base font-bold text-gray-800 mb-1">
        {priced.length >= 5 ? 'อาหารเกรด A ที่คุ้มที่สุดต่อกิโลกรัม' : 'อาหารเกรด A ที่ส่วนผสมดีที่สุด'}
      </h2>
      <p className="text-xs text-gray-400 mb-3">
        จากอาหารเกรด A ทั้งหมด {gradeA.length.toLocaleString()} รายการ — จุดเริ่มต้นที่ดีสำหรับการเปรียบเทียบ
      </p>
      <ol className="space-y-1.5">
        {pickA.map((f, i) => (
          <li key={f.id} className="flex items-baseline gap-2 text-sm">
            <span className="text-xs font-bold text-orange-500 w-5 flex-shrink-0">{i + 1}.</span>
            <a href={`/food/${f.slug}`} className="text-gray-700 hover:text-orange-600 hover:underline">
              {f.brand} {f.name_en}
            </a>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {(f.price_per_kg ?? 0) > 0 ? `฿${Math.round(f.price_per_kg!)}/กก.` : `ส่วนผสมดี ${f.green_count}`}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function ComparePage() {
  return (
    <main>
      <h1 className="text-2xl font-black text-gray-900 mb-1">⚖️ เปรียบเทียบอาหารสัตว์เลี้ยง</h1>
      <p className="text-sm text-gray-500 mb-6">
        เทียบโปรตีน ไขมัน เกรดส่วนประกอบ และราคาต่อกิโลกรัมของอาหารสุนัขและแมวได้สูงสุด 3 รายการพร้อมกัน
      </p>
      <Suspense fallback={null}>
        <CompareContent />
      </Suspense>
      <HowItWorks />
    </main>
  )
}
