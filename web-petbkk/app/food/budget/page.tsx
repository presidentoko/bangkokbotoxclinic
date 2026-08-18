import type { Metadata } from 'next'
import { loadFoods, getFoodGrade, toLightFood } from '@/lib/petfood'
import FoodCard from '@/components/FoodCard'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'อาหารสัตว์เลี้ยงราคาถูกคุณภาพดี — เกรด A-B ราคาประหยัด',
  description: 'รวมอาหารสุนัขและแมวคุณภาพดี (เกรด A-B) ในราคาที่จับต้องได้ วิเคราะห์ส่วนประกอบจริง ฟรี 100% ไม่ต้องจ่ายแพงเพื่อคุณภาพที่ดี',
  alternates: { canonical: 'https://www.thailandpethub.com/food/budget' },
  keywords: ['อาหารสัตว์เลี้ยงราคาถูก', 'อาหารหมาราคาประหยัด', 'อาหารแมวราคาถูก', 'อาหารสัตว์คุ้มค่า', 'อาหารสัตว์เลี้ยงราคาดี'],
  // `price_thb` and `price_per_kg` are 0 on all 986 records, so the price filter
  // this page is built on matched nothing and it shipped an empty list under a
  // "cheap pet food" title. Kept reachable and crawlable (so it keeps passing
  // links on) but out of the index until the scraper actually collects prices.
  robots: { index: false, follow: true },
  openGraph: {
    title: 'อาหารสัตว์เลี้ยงราคาถูก คุณภาพดี — เกรด A-B',
    description: 'อาหารสุนัขและแมวคุณภาพดีราคาประหยัด วิเคราะห์ส่วนประกอบจริง ฟรี',
    url: 'https://www.thailandpethub.com/food/budget',
  },
}

function FaqJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'อาหารสัตว์เลี้ยงราคาถูกคุณภาพดีมีไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'มี! ราคาไม่ได้บ่งบอกคุณภาพเสมอ อาหารสัตว์เลี้ยงที่ดีควรดูที่ส่วนประกอบ ไม่ใช่ราคา ThailandPetHub วิเคราะห์ส่วนประกอบทุกยี่ห้อและให้เกรด A-F อาหารเกรด A-B หลายยี่ห้อมีราคาประหยัดแต่คุณภาพสูง',
        },
      },
      {
        '@type': 'Question',
        name: 'ราคา/กิโลกรัมสำคัญอย่างไรในการเลือกอาหารสัตว์?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'การเปรียบเทียบราคาต่อกิโลกรัมช่วยให้เห็นคุณค่าที่แท้จริงของอาหาร อาหารถุงใหญ่มักถูกกว่าต่อกิโลกรัม แต่ต้องมั่นใจว่าน้องกินหมดก่อนหมดอายุ ควรเปรียบเทียบทั้งราคาและคุณภาพส่วนประกอบไปพร้อมกัน',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

const BUDGET_THRESHOLD = 400 // THB per kg — unusable until prices are scraped

export default function BudgetFoodPage() {
  const allFoods = loadFoods()
  // The price gate (`price_per_kg > 0 && <= BUDGET_THRESHOLD`) excluded every
  // record, because no record has a price. Falling back to grade keeps the page
  // useful — quality is the half of "cheap but good" the data can actually
  // answer — and the price ordering returns once prices exist.
  const budgetFoods = allFoods
    .filter(f => {
      const grade = getFoodGrade(f)
      const withinBudget = f.price_per_kg > 0 ? f.price_per_kg <= BUDGET_THRESHOLD : true
      return (grade === 'A' || grade === 'B') && withinBudget
    })
    .sort((a, b) => {
      const ga = getFoodGrade(a) ?? 'Z'
      const gb = getFoodGrade(b) ?? 'Z'
      if (ga !== gb) return ga.localeCompare(gb)
      if (a.price_per_kg > 0 && b.price_per_kg > 0) return a.price_per_kg - b.price_per_kg
      return b.green_count - a.green_count
    })

  const dogBudget = budgetFoods.filter(f => f.animal === 'dog')
  const catBudget = budgetFoods.filter(f => f.animal === 'cat')

  return (
    <main className="max-w-4xl mx-auto">
      <FaqJsonLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/food" className="hover:text-orange-600">อาหารสัตว์เลี้ยง</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ราคาประหยัด</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">💰 อาหารสัตว์เลี้ยงราคาประหยัด</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        อาหารสุนัขและแมว <strong>เกรด A-B</strong> ที่มีราคาต่ำกว่า{' '}
        <strong>฿{BUDGET_THRESHOLD}/กก.</strong> — คุณภาพดี ไม่ต้องจ่ายแพง
        รวม <strong>{budgetFoods.length} รายการ</strong>
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        ทุกรายการวิเคราะห์จากส่วนประกอบจริง ผ่านเกณฑ์คุณภาพ A หรือ B
        ไม่มีสารกันบูดอันตราย (BHA, BHT, Ethoxyquin) เรียงตามคุณภาพและราคา
      </p>

      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <p className="font-bold text-green-700 text-sm mb-1">วิธีเลือกอาหารคุ้มค่า</p>
          <p className="text-xs text-green-600 leading-relaxed">
            เปรียบเทียบ <strong>ราคา/กก.</strong> ไม่ใช่ราคาต่อถุง · เลือกเกรด A-B เพื่อส่วนประกอบที่ดี ·
            อาหารถุงใหญ่มักถูกกว่าแต่ต้องกินหมดก่อนหมดอายุ
          </p>
        </div>
      </div>

      {dogBudget.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🐕 อาหารสุนัขคุ้มค่า
            <span className="text-sm font-normal text-gray-400">({dogBudget.length} รายการ)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dogBudget.map(food => <FoodCard key={food.id} food={toLightFood(food)} />)}
          </div>
        </section>
      )}

      {catBudget.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🐈 อาหารแมวคุ้มค่า
            <span className="text-sm font-normal text-gray-400">({catBudget.length} รายการ)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catBudget.map(food => <FoodCard key={food.id} food={toLightFood(food)} />)}
          </div>
        </section>
      )}

      {budgetFoods.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🍖</p>
          <p className="text-gray-500">ดูอาหารคุณภาพดีทั้งหมดได้ที่หน้าหลัก</p>
          <a href="/food" className="mt-4 inline-block px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">ดูอาหารทั้งหมด →</a>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        <a href="/food" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">← ดูอาหารทั้งหมด</a>
        <a href="/food/best" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">⭐ เกรด A ทั้งหมด</a>
        <a href="/ingredients" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🔬 ส่วนผสมอันตราย</a>
      </div>

      <RelatedGuides current="food" count={4} />
    </main>
  )
}
