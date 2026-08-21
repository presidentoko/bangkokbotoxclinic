import { Suspense } from 'react'
import FoodListClient from '@/components/FoodListClient'
import RecentFoods from '@/components/RecentFoods'
import RelatedGuides from '@/components/RelatedGuides'
import AdSlot from '@/components/AdSlot'
import SponsorSlot from '@/components/SponsorSlot'
import { loadFoodsLight, getFoodGrade } from '@/lib/petfood'

const FOOD_CATEGORIES = [
  { href: '/food/best',   name: 'อาหารเกรด A' },
  { href: '/food/dog',    name: 'อาหารสุนัข' },
  { href: '/food/cat',    name: 'อาหารแมว' },
  { href: '/food/puppy',  name: 'อาหารลูกสุนัข/ลูกแมว' },
  { href: '/food/senior', name: 'อาหารสัตว์เลี้ยงสูงอายุ' },
  { href: '/food/budget', name: 'อาหารราคาประหยัด' },
]

function FoodJsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
      { '@type': 'ListItem', position: 2, name: 'ตรวจสอบอาหาร', item: 'https://www.thailandpethub.com/food' },
    ],
  }
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'หมวดหมู่อาหารสัตว์เลี้ยง',
    itemListElement: FOOD_CATEGORIES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://www.thailandpethub.com${c.href}`,
    })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    </>
  )
}

/**
 * An answer-first summary. The hub used to render ~340 characters of visible
 * text because the whole catalogue lives in a client component — nothing for a
 * snippet or an answer engine to quote about what the page covers.
 */
function KeyFacts() {
  const foods = loadFoodsLight()
  const graded = foods.filter(f => getFoodGrade(f) != null)
  const gradeA = graded.filter(f => getFoodGrade(f) === 'A').length
  const dogs = foods.filter(f => f.animal === 'dog').length
  const cats = foods.filter(f => f.animal === 'cat').length
  const aafco = foods.filter(f => f.aafco_meets).length

  return (
    <section className="bg-white border border-orange-100 rounded-xl p-4 mb-5">
      <p className="text-sm text-gray-700 leading-relaxed">
        ThailandPetHub วิเคราะห์ส่วนประกอบของ{' '}
        <strong>อาหารสัตว์เลี้ยงที่ขายในไทย {foods.length.toLocaleString()} รายการ</strong>{' '}
        (อาหารสุนัข {dogs.toLocaleString()} · อาหารแมว {cats.toLocaleString()}) และให้เกรด A–F
        จากลำดับและชนิดของส่วนประกอบบนฉลาก โดยมี <strong>{gradeA.toLocaleString()} รายการที่ได้เกรด A</strong>{' '}
        และ {aafco.toLocaleString()} รายการที่ระบุว่าผ่านมาตรฐาน AAFCO
        ทุกรายการแสดงรายการส่วนผสมแบบเต็มและการจัดกลุ่มคุณภาพของแต่ละส่วนผสม ฟรี
      </p>
      <dl className="grid grid-cols-4 gap-2 mt-3 text-center">
        {[
          { label: 'ทั้งหมด', value: foods.length.toLocaleString() },
          { label: 'เกรด A', value: gradeA.toLocaleString() },
          { label: 'สุนัข', value: dogs.toLocaleString() },
          { label: 'แมว', value: cats.toLocaleString() },
        ].map(s => (
          <div key={s.label} className="bg-orange-50 rounded-lg py-2">
            <dd className="text-base font-black text-orange-600 leading-none">{s.value}</dd>
            <dt className="text-[11px] text-gray-500 mt-1">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** Ranked shortlist — the format answer engines lift for "best pet food" asks. */
function TopGradedFoods() {
  // Ranking deliberately avoids price: `price_thb` and `price_per_kg` are 0 on
  // all 986 records, so any price-based sort or filter silently empties the list.
  const top = loadFoodsLight()
    .filter(f => getFoodGrade(f) === 'A')
    .sort((a, b) => b.green_count - a.green_count || b.protein_dm - a.protein_dm)
    .slice(0, 10)
  if (!top.length) return null

  return (
    <section className="mt-10">
      <h2 className="text-base font-bold text-gray-800 mb-1">อาหารสัตว์เลี้ยงเกรด A ที่ส่วนผสมดีที่สุด 10 อันดับ</h2>
      <p className="text-xs text-gray-400 mb-3">เรียงตามจำนวนส่วนประกอบคุณภาพดีที่ตรวจพบบนฉลาก</p>
      <ol className="space-y-1.5">
        {top.map((f, i) => (
          <li key={f.id} className="flex items-baseline gap-2 text-sm">
            <span className="text-xs font-bold text-orange-500 w-5 flex-shrink-0">{i + 1}.</span>
            <a href={`/food/${f.slug}`} className="text-gray-700 hover:text-orange-600 hover:underline">
              {f.brand} {f.name_en}
            </a>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              ส่วนผสมดี {f.green_count}{f.protein_dm > 0 ? ` · โปรตีน ${f.protein_dm.toFixed(0)}%` : ''}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

// No searchParams here — FoodListClient reads them client-side, which keeps this
// shell statically rendered instead of forcing the whole route dynamic.
export default function FoodPage() {
  return (
    <main>
      <FoodJsonLd />
      <div className="mb-4">
        <h1 className="text-2xl font-black text-gray-900 mb-1">🍖 เลือกอาหารให้น้อง</h1>
        <p className="text-sm text-gray-400 mb-4">ตรวจสอบเกรดและส่วนประกอบ เพื่อสุขภาพที่ดีที่สุด</p>

        {/* Category quick links */}
        <div className="flex gap-2 flex-wrap mb-2">
          {[
            { href: '/food/best',   label: '⭐ เกรด A',        cls: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' },
            { href: '/food/dog',    label: '🐕 สุนัข',          cls: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
            { href: '/food/cat',    label: '🐈 แมว',            cls: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
            { href: '/food/puppy',  label: '🐶 ลูกสุนัข/แมว',   cls: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100' },
            { href: '/food/senior', label: '👴 สูงอายุ',        cls: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
            { href: '/food/budget', label: '💰 ราคาประหยัด',    cls: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' },
          ].map(c => (
            <a key={c.href} href={c.href}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${c.cls}`}>
              {c.label}
            </a>
          ))}
        </div>
      </div>
      <KeyFacts />
      <SponsorSlot slot="page:food" className="mb-5" />
      <AdSlot slot="1234567893" format="leaderboard" />
      <RecentFoods />
      <Suspense fallback={null}>
        <FoodListClient />
      </Suspense>
      <AdSlot slot="1234567894" format="inline" />
      <TopGradedFoods />
      {/* The full A-Z directory used to sit here, but /food/dog and /food/cat
          between them already link all 986 products (470 + 516), so it was
          986 duplicate links adding ~380 KB to the most-crawled page on the
          site while both Vercel quotas were at their cap. */}
      <p className="mt-8 text-sm text-gray-500">
        ดูรายการทั้งหมดแยกตามสัตว์:{' '}
        <a href="/food/dog" className="text-orange-600 hover:underline">อาหารสุนัขทั้งหมด</a>
        {' · '}
        <a href="/food/cat" className="text-orange-600 hover:underline">อาหารแมวทั้งหมด</a>
      </p>
      <RelatedGuides current="food" count={4} />
    </main>
  )
}
