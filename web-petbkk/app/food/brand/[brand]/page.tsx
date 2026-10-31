import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allBrandStats, getBrandStats, type NutritionSummary } from '@/lib/brandStats'
import { foodSlug } from '@/lib/petfood'
import { getFoodGrade } from '@/lib/grading'
import type { FoodGrade } from '@/lib/types'

/**
 * /food/brand/[brand] — what a brand's whole range looks like, measured.
 * Only brands that pass the data gate in lib/brandStats.ts exist.
 */

const SITE = 'https://www.thailandpethub.com'

export const dynamicParams = false

export function generateStaticParams() {
  return allBrandStats().map(b => ({ brand: b.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand } = await params
  const b = getBrandStats(brand)
  if (!b) return {}
  const graded = b.graded ? ` เกรด A–F ${b.graded} รายการ` : ''
  return {
    title: `${b.brand} ดีไหม — วิเคราะห์ส่วนผสมและโปรตีนทั้ง ${b.foods.length} สูตร`,
    description:
      `${b.brand}: อาหารแมว ${b.cat} สูตร อาหารสุนัข ${b.dog} สูตร${graded} ` +
      'เทียบโปรตีนแบบ dry matter และส่วนผสมที่ควรระวังที่พบบ่อย จากฉลากจริงของทุกสูตร',
    alternates: { canonical: `${SITE}/food/brand/${b.slug}` },
  }
}

const GRADE_COLOR: Record<FoodGrade, string> = {
  A: 'bg-green-500', B: 'bg-lime-500', C: 'bg-yellow-400', D: 'bg-orange-500', F: 'bg-red-600',
}

function pct(n: number) {
  return `${Math.round(n)}%`
}

function NutritionRow({ label, s }: { label: string; s: NutritionSummary | null }) {
  if (!s) return null
  return (
    <tr className="border-t border-gray-100">
      <td className="py-2 pr-3 text-gray-700">{label}</td>
      <td className="py-2 pr-3 tabular-nums">{s.n}</td>
      <td className="py-2 pr-3 tabular-nums font-semibold">{pct(s.proteinMedian)}</td>
      <td className="py-2 pr-3 tabular-nums text-gray-500">{pct(s.proteinMin)}–{pct(s.proteinMax)}</td>
      <td className="py-2 tabular-nums">{pct(s.fatMedian)}</td>
    </tr>
  )
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params
  const b = getBrandStats(brand)
  if (!b) notFound()

  const others = allBrandStats().filter(x => x.slug !== b.slug)
  const gradeOrder: FoodGrade[] = ['A', 'B', 'C', 'D', 'F']

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Brand',
        name: b.brand,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'อาหารสัตว์เลี้ยง', item: `${SITE}/food` },
          { '@type': 'ListItem', position: 3, name: b.brand },
        ],
      },
    ],
  }

  return (
    <main className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/food" className="hover:text-orange-600">อาหารสัตว์เลี้ยง</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">{b.brand}</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 leading-tight mb-3">
        {b.brand} ดีไหม: ทุกสูตรที่เรามีข้อมูล
      </h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        เราเก็บฉลากของ {b.brand} ไว้ {b.foods.length} สูตร (อาหารแมว {b.cat} · อาหารสุนัข {b.dog})
        และอ่านส่วนผสมกับค่าโภชนาการทีละสูตร หน้านี้สรุปภาพรวมของทั้งแบรนด์ ไม่ใช่สูตรใดสูตรหนึ่ง
      </p>

      {b.graded > 0 && (
        <section className="bg-white border rounded-2xl p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">เกรดส่วนผสม</h2>
          <p className="text-xs text-gray-500 mb-3">
            {b.graded} จาก {b.foods.length} สูตรมีรายการส่วนผสมครบพอจะให้เกรด สูตรที่เหลือไม่มีเกรด ไม่ได้แปลว่าแย่
          </p>
          <div className="flex h-4 rounded-full overflow-hidden mb-2">
            {gradeOrder.filter(g => b.grades[g]).map(g => (
              <div key={g} className={GRADE_COLOR[g]} style={{ width: `${(b.grades[g] / b.graded) * 100}%` }} title={`${g}: ${b.grades[g]}`} />
            ))}
          </div>
          <ul className="flex flex-wrap gap-3 text-sm">
            {gradeOrder.map(g => (
              <li key={g} className="tabular-nums">
                <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1 ${GRADE_COLOR[g]}`} />
                {g} <span className="font-semibold">{b.grades[g]}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-3">
            <a href="/tips" className="text-blue-600 hover:underline">เกรดคิดจากอะไร</a>
          </p>
        </section>
      )}

      {(b.dryCat || b.dryDog) && (
        <section className="bg-white border rounded-2xl p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">โปรตีนและไขมัน (อาหารเม็ด, dry matter)</h2>
          <p className="text-xs text-gray-500 mb-3">
            คิดแบบ dry matter (ตัดความชื้นออก) จึงเทียบข้ามยี่ห้อได้ เฉพาะอาหารเม็ด เพราะอาหารเปียกบนฉลากเทียบตรงๆ ไม่ได้
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="pb-2 pr-3 font-medium"></th>
                  <th className="pb-2 pr-3 font-medium">สูตร</th>
                  <th className="pb-2 pr-3 font-medium">โปรตีน (มัธยฐาน)</th>
                  <th className="pb-2 pr-3 font-medium">ช่วง</th>
                  <th className="pb-2 font-medium">ไขมัน</th>
                </tr>
              </thead>
              <tbody>
                <NutritionRow label="แมว" s={b.dryCat} />
                <NutritionRow label="สุนัข" s={b.dryDog} />
              </tbody>
            </table>
          </div>
          {b.topProtein.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-800 mt-4 mb-1.5">สูตรเม็ดที่โปรตีนสูงสุด</h3>
              <ul className="text-sm divide-y divide-gray-100">
                {b.topProtein.map(f => (
                  <li key={f.id} className="py-1.5 flex justify-between gap-3">
                    <a href={`/food/${foodSlug(f)}`} className="text-gray-800 hover:text-orange-600 truncate">
                      {f.name_th || f.name_en} <span className="text-gray-400">· {f.animal === 'cat' ? 'แมว' : 'สุนัข'}</span>
                    </a>
                    <span className="shrink-0 tabular-nums font-semibold">{pct(f.protein_dm)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {b.flagged.length > 0 && (
        <section className="bg-white border rounded-2xl p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">ส่วนผสมที่ควรระวังที่พบบ่อย</h2>
          <p className="text-xs text-gray-500 mb-3">จาก {b.panels} สูตรที่มีรายการส่วนผสมครบ</p>
          <ul className="text-sm divide-y divide-gray-100">
            {b.flagged.map(f => (
              <li key={f.name} className="py-1.5 flex justify-between gap-3">
                <span className={f.grade === 'black' ? 'text-red-700' : 'text-orange-700'}>{f.name}</span>
                <span className="shrink-0 tabular-nums text-gray-600">{f.products} สูตร ({pct((f.products / b.panels) * 100)})</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-3">
            <a href="/ingredients" className="text-blue-600 hover:underline">ทำไมส่วนผสมเหล่านี้ถูกจัดว่าควรระวัง</a>
          </p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">ทุกสูตรของ {b.brand}</h2>
        <ul className="bg-white border rounded-2xl divide-y text-sm">
          {b.foods.map(f => {
            const g = getFoodGrade(f)
            return (
              <li key={f.id} className="px-3 py-2 flex justify-between gap-3">
                <a href={`/food/${foodSlug(f)}`} className="text-gray-800 hover:text-orange-600 truncate">{f.name_th || f.name_en}</a>
                <span className="shrink-0 text-xs text-gray-500">
                  {f.animal === 'cat' ? 'แมว' : 'สุนัข'}{g ? ` · ${g}` : ''}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      {others.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-2">แบรนด์อื่น</h2>
          <div className="flex flex-wrap gap-2">
            {others.map(o => (
              <a key={o.slug} href={`/food/brand/${o.slug}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:border-orange-300 hover:text-orange-600">
                {o.brand}
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
