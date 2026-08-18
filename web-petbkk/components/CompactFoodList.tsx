import type { PetFoodLight } from '@/lib/types'
import { getFoodGrade } from '@/lib/grading'

/**
 * The tail of a long category listing, as text links instead of cards.
 *
 * /food/cat rendered all 516 matching foods as full FoodCard components and
 * /food/dog all 470, producing 1.4 MB and 1.3 MB HTML documents. Each card
 * carries a grade bar plus two client components, so it costs roughly 1.6 KB of
 * markup and again in the RSC flight payload — about eighty times what a link
 * costs. On a Hobby plan being crawled across 1,590 pages that was a large
 * share of the Fast Origin Transfer quota, and on mobile it is a poor page.
 *
 * Cards stay for the head of the list, where they help someone choose. Beyond
 * that a link carries the same crawl value at a fraction of the weight, so
 * every product keeps exactly one inbound link from its category page.
 */
export default function CompactFoodList({ foods, title }: { foods: PetFoodLight[]; title: string }) {
  if (!foods.length) return null

  return (
    <section className="mb-8">
      <h3 className="text-sm font-bold text-gray-700 mb-1">{title}</h3>
      <p className="text-xs text-gray-400 mb-3">{foods.length} รายการ — เรียงตามเกรดส่วนประกอบ</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
        {foods.map(f => {
          const grade = getFoodGrade(f)
          return (
            <li key={f.id} className="flex items-baseline gap-1.5">
              {grade && (
                <span className="text-[10px] font-bold text-gray-400 w-3 flex-shrink-0">{grade}</span>
              )}
              <a
                href={`/food/${f.slug}`}
                className="text-xs text-gray-500 hover:text-orange-600 hover:underline line-clamp-1"
              >
                {f.brand} {f.name_en}
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
