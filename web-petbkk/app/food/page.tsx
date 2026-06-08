import { filterFoods } from '@/lib/petfood'
import type { Animal, LifeStage } from '@/lib/types'
import FoodCard from '@/components/FoodCard'

interface Props {
  searchParams: Promise<{ animal?: string; life_stage?: string; sort?: string }>
}

export default async function FoodPage({ searchParams }: Props) {
  const params = await searchParams
  const foods = filterFoods({
    animal: params.animal as Animal | undefined,
    life_stage: params.life_stage as LifeStage | undefined,
    sort: params.sort as 'score' | 'price' | undefined,
  })

  const filterLink = (key: string, val: string) => {
    const p = new URLSearchParams(params as Record<string, string>)
    p.get(key) === val ? p.delete(key) : p.set(key, val)
    return `/food?${p.toString()}`
  }

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">ตรวจสอบอาหารสัตว์เลี้ยง</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'animal', val: 'dog', label: '🐕 สุนัข' },
          { key: 'animal', val: 'cat', label: '🐈 แมว' },
          { key: 'life_stage', val: 'puppy', label: 'ลูก' },
          { key: 'life_stage', val: 'adult', label: 'ผู้ใหญ่' },
          { key: 'life_stage', val: 'senior', label: 'สูงวัย' },
          { key: 'sort', val: 'price', label: '💰 ราคาต่ำสุด' },
        ].map(f => {
          const active = params[f.key as keyof typeof params] === f.val
          return (
            <a
              key={`${f.key}-${f.val}`}
              href={filterLink(f.key, f.val)}
              className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                active
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white hover:bg-orange-50'
              }`}
            >
              {f.label}
            </a>
          )
        })}
      </div>

      {foods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map(food => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-16">ไม่พบข้อมูล</p>
      )}
    </main>
  )
}
