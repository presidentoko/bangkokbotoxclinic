import { notFound } from 'next/navigation'
import { getFoodBySlug, loadFoods } from '@/lib/petfood'
import GradeBar from '@/components/GradeBar'
import IngredientList from '@/components/IngredientList'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return loadFoods().map(f => ({ slug: f.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const food = getFoodBySlug(slug)
  return { title: food ? `${food.brand} ${food.name_en} — PetBKK` : 'ไม่พบสินค้า' }
}

export default async function FoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const food = getFoodBySlug(slug)
  if (!food) notFound()

  return (
    <main className="max-w-2xl mx-auto">
      <a href="/food" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
        ← กลับ
      </a>
      <p className="text-sm text-gray-500 mb-1">{food.brand}</p>
      <h1 className="text-2xl font-bold mb-4">{food.name_th || food.name_en}</h1>

      <div className="mb-6">
        <GradeBar
          green={food.green_count}
          yellow={food.yellow_count}
          red={food.red_count}
          black={food.black_count}
          size="lg"
        />
      </div>

      <section className="mb-6 bg-white border rounded-xl p-4">
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

      <section className="mb-8">
        <h2 className="font-semibold mb-3">ส่วนประกอบ ({food.ingredients.length} รายการ)</h2>
        <IngredientList ingredients={food.ingredients} />
      </section>

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
