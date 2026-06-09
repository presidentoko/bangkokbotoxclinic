import { notFound } from 'next/navigation'
import { getFoodBySlug, loadFoods, getFoodGrade, getSimilarFoods, foodSlug } from '@/lib/petfood'
import { getFoodReviews } from '@/lib/petreviews'
import GradeBar from '@/components/GradeBar'
import IngredientGroups from '@/components/IngredientGroups'
import SimilarFoods from '@/components/SimilarFoods'
import ShareCard from '@/components/ShareCard'
import TrackRecentFood from '@/components/TrackRecentFood'
import PantipReviews from '@/components/PantipReviews'
import type { Metadata } from 'next'
import type { FoodGrade, PetFood } from '@/lib/types'

export const dynamicParams = false

export function generateStaticParams() {
  return loadFoods().map(f => ({ slug: foodSlug(f) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const food = getFoodBySlug(slug)
  if (!food) return { title: 'ไม่พบสินค้า' }
  const grade = getFoodGrade(food)
  const name = food.name_th || food.name_en
  return {
    title: `${food.brand} ${food.name_en} ${grade ? `— เกรด ${grade}` : ''} | PetBKK`,
    description: `ตรวจสอบส่วนประกอบ ${name} พร้อมเกรดคุณภาพ เปรียบเทียบโปรตีน ไขมัน และส่วนประกอบแต่ละชนิด`,
    alternates: {
      canonical: `https://www.thailandpethub.com/food/${slug}`,
    },
    openGraph: {
      title: `${food.brand} ${name}${grade ? ` — เกรด ${grade}` : ''}`,
      description: `ตรวจสอบส่วนประกอบ ${name} พร้อมเกรดคุณภาพ`,
      url: `https://www.thailandpethub.com/food/${slug}`,
      type: 'website',
    },
  }
}

function BreadcrumbJsonLd({ name }: { name: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
      { '@type': 'ListItem', position: 2, name: 'อาหารสัตว์เลี้ยง', item: 'https://www.thailandpethub.com/food' },
      { '@type': 'ListItem', position: 3, name },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

function FoodFaqJsonLd({ food, grade }: { food: PetFood; grade: FoodGrade | null }) {
  const name = food.name_th || food.name_en
  const animalTh = food.animal === 'dog' ? 'สุนัข' : 'แมว'
  const stageTh: Record<string, string> = { puppy: 'ลูก', adult: 'ผู้ใหญ่', senior: 'สูงวัย' }
  const topIngredients = food.ingredients.slice(0, 5).map(i => i.name).join(', ')

  const gradeReasons: Partial<Record<FoodGrade, string>> = {
    A: `ส่วนประกอบคุณภาพสูง ${food.green_count} รายการ ไม่มีสารที่เป็นอันตราย เหมาะเป็นอาหารหลัก`,
    B: `ส่วนประกอบดี ${food.green_count} รายการ มีส่วนที่ควรระวัง ${food.yellow_count} รายการ คุณภาพดี`,
    C: `มีส่วนประกอบดี ${food.green_count} ระวัง ${food.yellow_count} และไม่ดี ${food.red_count} รายการ ควรพิจารณาทางเลือกอื่น`,
    D: `มีส่วนประกอบที่ไม่ดี ${food.red_count} และอันตราย ${food.black_count} รายการ ไม่แนะนำเป็นอาหารหลัก`,
    F: `มีส่วนประกอบที่เป็นอันตราย ${food.black_count} รายการ ไม่แนะนำ`,
  }

  const faqs = [
    {
      q: `${name} มีส่วนผสมอะไรบ้าง?`,
      a: food.ingredients.length > 0
        ? `ส่วนผสมหลักของ ${name} ได้แก่ ${topIngredients}${food.ingredients.length > 5 ? ` และอีก ${food.ingredients.length - 5} รายการ` : ''}`
        : `ยังไม่มีข้อมูลส่วนผสมโดยละเอียด กรุณาตรวจสอบที่ฉลากผลิตภัณฑ์`,
    },
    {
      q: `${name} ได้เกรด ${grade ?? '?'} เพราะอะไร?`,
      a: grade && gradeReasons[grade] ? gradeReasons[grade]! : `ยังไม่มีข้อมูลส่วนประกอบเพียงพอสำหรับการให้เกรด`,
    },
    {
      q: `${name} เหมาะสำหรับ${animalTh}วัยอะไร?`,
      a: `${name} ออกแบบมาสำหรับ${animalTh}วัย${stageTh[food.life_stage] ?? food.life_stage}${food.aafco_meets ? ' และผ่านมาตรฐาน AAFCO' : ''}`,
    },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="mb-4 bg-white border rounded-xl p-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">คำถามที่พบบ่อย</h2>
        <div className="space-y-3 divide-y divide-gray-100">
          {faqs.map((f, i) => (
            <div key={i} className={i > 0 ? 'pt-3' : ''}>
              <p className="font-semibold text-sm text-gray-800 mb-1">{f.q}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

const GRADE_CONFIG: Record<FoodGrade, { color: string; bgCls: string; label: string }> = {
  A: { color: '#16a34a', bgCls: 'bg-green-500',  label: 'ดีเยี่ยม' },
  B: { color: '#65a30d', bgCls: 'bg-lime-500',   label: 'ดี' },
  C: { color: '#ca8a04', bgCls: 'bg-yellow-500', label: 'ปานกลาง' },
  D: { color: '#ea580c', bgCls: 'bg-orange-500', label: 'ระวัง' },
  F: { color: '#dc2626', bgCls: 'bg-red-500',    label: 'อันตราย' },
}

export default async function FoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const food = getFoodBySlug(slug)
  if (!food) notFound()

  const grade = getFoodGrade(food)
  const gradeCfg = grade ? GRADE_CONFIG[grade] : null
  const similar = getSimilarFoods(food)
  const total = food.green_count + food.yellow_count + food.red_count + food.black_count
  const pantipReview = getFoodReviews(food.id)

  return (
    <main className="max-w-2xl mx-auto">
      <TrackRecentFood foodId={food.id} />

      {/* Back link */}
      <a
        href="/food"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-600 mb-6 transition-colors group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        กลับ
      </a>

      {/* Header card */}
      <div className="bg-white rounded-2xl border p-6 mb-4">
        <p className="text-sm text-gray-500 mb-1">{food.brand}</p>
        <h1 className="text-2xl font-bold mb-4">{food.name_th || food.name_en}</h1>

        <div className="flex items-center gap-5 mb-4">
          {grade && gradeCfg ? (
            <div className={`w-16 h-16 rounded-full ${gradeCfg.bgCls} flex items-center justify-center text-white text-3xl font-black flex-shrink-0`}>
              {grade}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm flex-shrink-0">
              ?
            </div>
          )}
          <div>
            {grade && gradeCfg ? (
              <>
                <p className="font-bold text-lg" style={{ color: gradeCfg.color }}>เกรด {grade} · {gradeCfg.label}</p>
                <p className="text-sm text-gray-500">ส่วนประกอบ {total} รายการ · ดีเยี่ยม {food.green_count} รายการ</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">ยังไม่มีข้อมูลส่วนประกอบ</p>
            )}
          </div>
        </div>

        <GradeBar
          green={food.green_count}
          yellow={food.yellow_count}
          red={food.red_count}
          black={food.black_count}
          size="lg"
        />

        {/* Share section */}
        <div className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <ShareCard food={food} />
        </div>
      </div>

      {/* Nutrition section */}
      <section className="mb-4 bg-white border rounded-xl p-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">คุณค่าทางโภชนาการ</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">รายการ</th>
                <th className="pb-2">ตามฉลาก</th>
                <th className="pb-2">Dry Matter</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2">โปรตีน</td><td>{food.protein_pct}%</td><td className="font-medium">{food.protein_dm}%</td></tr>
              <tr><td className="py-2">ไขมัน</td><td>{food.fat_pct}%</td><td className="font-medium">{food.fat_dm}%</td></tr>
              <tr><td className="py-2">ใยอาหาร</td><td>{food.fiber_pct}%</td><td className="text-gray-400">—</td></tr>
              <tr><td className="py-2">ความชื้น</td><td>{food.moisture_pct}%</td><td className="text-gray-400">—</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm font-medium">
          AAFCO: {food.aafco_meets ? '✅ ผ่านเกณฑ์' : '❌ ไม่ผ่านเกณฑ์'}
        </p>
      </section>

      {/* Ingredients section */}
      {food.ingredients.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">ส่วนประกอบ ({food.ingredients.length} รายการ)</h2>
          <IngredientGroups ingredients={food.ingredients} />
        </section>
      )}

      {/* Pantip reviews */}
      {pantipReview && <PantipReviews review={pantipReview} />}

      {/* Similar foods */}
      {similar.length > 0 && (
        <div className="mb-4">
          <SimilarFoods foods={similar} />
        </div>
      )}

      <FoodFaqJsonLd food={food} grade={grade} />

      {/* Buy button */}
      {food.buy_url && (
        <a
          href={food.buy_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-colors shadow-sm text-base block"
        >
          🛒 ซื้อราคาถูกสุด
        </a>
      )}
      <BreadcrumbJsonLd name={food.name_th || food.name_en} />
    </main>
  )
}
