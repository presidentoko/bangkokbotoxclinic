import { notFound } from 'next/navigation'
import { getFoodBySlug, loadFoods, getFoodGrade, getSimilarFoods } from '@/lib/petfood'
import GradeBar from '@/components/GradeBar'
import IngredientGroups from '@/components/IngredientGroups'
import SimilarFoods from '@/components/SimilarFoods'
import ShareCard from '@/components/ShareCard'
import type { Metadata } from 'next'
import type { FoodGrade } from '@/lib/types'

export const dynamicParams = false

export function generateStaticParams() {
  return loadFoods().map(f => ({ slug: f.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const food = getFoodBySlug(slug)
  if (!food) return { title: 'ไม่พบสินค้า' }
  const grade = getFoodGrade(food)
  return {
    title: `${food.brand} ${food.name_en} ${grade ? `— เกรด ${grade}` : ''} | PetBKK`,
    description: `ตรวจสอบส่วนประกอบ ${food.name_th || food.name_en} พร้อมเกรดคุณภาพ`,
  }
}

const GRADE_CONFIG: Record<FoodGrade, { color: string; bgCls: string; label: string }> = {
  A: { color: '#16a34a', bgCls: 'bg-green-500',  label: '우수' },
  B: { color: '#65a30d', bgCls: 'bg-lime-500',   label: '양호' },
  C: { color: '#ca8a04', bgCls: 'bg-yellow-500', label: '보통' },
  D: { color: '#ea580c', bgCls: 'bg-orange-500', label: '주의' },
  F: { color: '#dc2626', bgCls: 'bg-red-500',    label: '위험' },
}

export default async function FoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const food = getFoodBySlug(slug)
  if (!food) notFound()

  const grade = getFoodGrade(food)
  const gradeCfg = grade ? GRADE_CONFIG[grade] : null
  const similar = getSimilarFoods(food)
  const total = food.green_count + food.yellow_count + food.red_count + food.black_count

  return (
    <main className="max-w-2xl mx-auto">
      <a href="/food" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
        ← กลับ
      </a>

      {/* 등급 히어로 */}
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
                <p className="font-bold text-lg" style={{ color: gradeCfg.color }}>등급 {grade} · {gradeCfg.label}</p>
                <p className="text-sm text-gray-500">성분 {total}개 중 우수 {food.green_count}개</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">성분 분석 데이터 없음</p>
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

        <div className="mt-4">
          <ShareCard food={food} />
        </div>
      </div>

      {/* 영양 분석 */}
      <section className="mb-4 bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">คุณค่าทางโภชนาการ</h2>
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

      {/* 성분 신호등 */}
      {food.ingredients.length > 0 && (
        <section className="mb-4">
          <h2 className="font-semibold mb-3">ส่วนประกอบ ({food.ingredients.length} รายการ)</h2>
          <IngredientGroups ingredients={food.ingredients} />
        </section>
      )}

      {/* 비슷한 사료 */}
      {similar.length > 0 && (
        <div className="mb-4">
          <SimilarFoods foods={similar} />
        </div>
      )}

      {/* 구매 버튼 */}
      {food.buy_url && (
        <a
          href={food.buy_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors text-lg"
        >
          🛒 ซื้อราคาถูกสุด
        </a>
      )}
    </main>
  )
}
