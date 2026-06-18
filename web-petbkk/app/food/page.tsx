import FoodListClient from '@/components/FoodListClient'
import type { Animal, LifeStage } from '@/lib/types'

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
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1">🍖 เลือกอาหารให้น้อง</h1>
        <p className="text-sm text-gray-400">ตรวจสอบเกรดและส่วนประกอบ เพื่อสุขภาพที่ดีที่สุด</p>
      </div>
      <FoodListClient
        initialAnimal={initialAnimal}
        initialStage={initialStage}
        initialQuery={sp.q ?? ''}
      />
    </main>
  )
}
