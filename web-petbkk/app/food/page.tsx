import FoodListClient from '@/components/FoodListClient'
import RecentFoods from '@/components/RecentFoods'
import RelatedGuides from '@/components/RelatedGuides'
import type { Animal, LifeStage } from '@/lib/types'

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

export default async function FoodPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; animal?: string; life_stage?: string }>
}) {
  const sp = await searchParams

  const initialAnimal =
    sp.animal === 'dog' || sp.animal === 'cat' ? (sp.animal as Animal) : undefined
  const initialStage = ['puppy', 'adult', 'senior'].includes(sp.life_stage ?? '')
    ? (sp.life_stage as LifeStage)
    : undefined

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
      <RecentFoods />
      <FoodListClient
        initialAnimal={initialAnimal}
        initialStage={initialStage}
        initialQuery={sp.q ?? ''}
      />
      <RelatedGuides current="food" count={4} />
    </main>
  )
}
