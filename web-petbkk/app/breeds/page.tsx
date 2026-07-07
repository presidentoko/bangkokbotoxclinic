import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'
import { BREEDS } from '@/lib/breeds'

export const metadata: Metadata = {
  title: 'สายพันธุ์สุนัขและแมวยอดนิยมในไทย — ลักษณะ นิสัย และการดูแล',
  description: 'รวมสายพันธุ์สุนัขและแมวที่นิยมเลี้ยงในไทย ลักษณะ นิสัย ความต้องการดูแล และสุขภาพที่ต้องระวัง',
  alternates: { canonical: 'https://www.thailandpethub.com/breeds' },
  keywords: ['สายพันธุ์สุนัข', 'สายพันธุ์แมว', 'สุนัขนิยมในไทย', 'แมวนิยมในไทย', 'เลือกสัตว์เลี้ยง'],
  openGraph: {
    title: 'สายพันธุ์สุนัขและแมวยอดนิยมในไทย',
    description: 'ลักษณะ นิสัย ความต้องการดูแล และสุขภาพตามสายพันธุ์',
    url: 'https://www.thailandpethub.com/breeds',
  },
}

const DOG_BREEDS = BREEDS.filter(b => b.animal === 'dog')
const CAT_BREEDS = BREEDS.filter(b => b.animal === 'cat')

const ENERGY_COLORS: Record<string, string> = {
  'สูงมาก': 'bg-red-100 text-red-600',
  'สูง': 'bg-orange-100 text-orange-600',
  'ปานกลาง': 'bg-yellow-100 text-yellow-700',
  'ต่ำ-ปานกลาง': 'bg-green-100 text-green-700',
  'ต่ำ': 'bg-blue-100 text-blue-700',
}

function BreedsJsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
      { '@type': 'ListItem', position: 2, name: 'สายพันธุ์', item: 'https://www.thailandpethub.com/breeds' },
    ],
  }
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'สายพันธุ์สุนัขและแมวยอดนิยมในไทย',
    itemListElement: BREEDS.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      url: `https://www.thailandpethub.com/breeds/${b.slug}`,
    })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    </>
  )
}

export default function BreedsPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <BreedsJsonLd />
      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">สายพันธุ์</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐾 สายพันธุ์ยอดนิยมในไทย</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        การเลือกสายพันธุ์ที่เหมาะกับไลฟ์สไตล์และที่อยู่อาศัยของเจ้าของ
        เป็นกุญแจสำคัญสู่ความสัมพันธ์ที่ดีระยะยาว
      </p>

      <div className="flex gap-3 mb-6">
        <a href="#dogs" className="px-4 py-2 bg-orange-50 text-orange-600 font-semibold text-sm rounded-full border border-orange-200 hover:bg-orange-100 transition-colors">🐕 สุนัข ({DOG_BREEDS.length} สายพันธุ์)</a>
        <a href="#cats" className="px-4 py-2 bg-purple-50 text-purple-600 font-semibold text-sm rounded-full border border-purple-200 hover:bg-purple-100 transition-colors">🐱 แมว ({CAT_BREEDS.length} สายพันธุ์)</a>
      </div>

      <section id="dogs" className="mb-8">
        <h2 className="font-black text-xl text-gray-900 mb-4">🐕 สุนัขยอดนิยมในไทย</h2>
        <div className="space-y-3">
          {DOG_BREEDS.map(b => (
            <a key={b.slug} href={`/breeds/${b.slug}`} className="block bg-white rounded-2xl border shadow-sm p-4 hover:shadow-md hover:border-orange-200 transition-all">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-base">{b.name}</h3>
                <div className="flex gap-1.5 flex-shrink-0 ml-2">
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{b.size}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ENERGY_COLORS[b.energy] ?? 'bg-gray-100 text-gray-500'}`}>{b.energy}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1.5">{b.traits}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="font-medium text-amber-600">⚠️ ระวัง:</span><span>{b.watch}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="cats" className="mb-8">
        <h2 className="font-black text-xl text-gray-900 mb-4">🐱 แมวยอดนิยมในไทย</h2>
        <div className="space-y-3">
          {CAT_BREEDS.map(b => (
            <a key={b.slug} href={`/breeds/${b.slug}`} className="block bg-white rounded-2xl border shadow-sm p-4 hover:shadow-md hover:border-orange-200 transition-all">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-base">{b.name}</h3>
                <div className="flex gap-1.5 flex-shrink-0 ml-2">
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{b.size}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ENERGY_COLORS[b.energy] ?? 'bg-gray-100 text-gray-500'}`}>{b.energy}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1.5">{b.traits}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="font-medium text-amber-600">⚠️ ระวัง:</span><span>{b.watch}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-green-700 text-sm mb-1">💚 พิจารณารับเลี้ยงแทนการซื้อ</p>
        <p className="text-xs text-green-600">สัตว์เลี้ยงไทยพื้นเมือง (หมาบ้าน แมวบ้าน) มีสุขภาพแข็งแรง ดูแลง่าย และมีตัวรอบ้านอยู่มากมาย</p>
        <a href="/adopt" className="inline-block mt-2 text-xs font-semibold text-green-700 underline">ดูองค์กรช่วยสัตว์ →</a>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/newpet" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🆕 เลี้ยงน้องใหม่</a>
        <a href="/cost" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💰 ค่าใช้จ่ายรายเดือน</a>
        <a href="/food" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🍖 อาหารที่เหมาะสม</a>
      </div>

      <RelatedGuides current="breeds" count={4} />
    </main>
  )
}
