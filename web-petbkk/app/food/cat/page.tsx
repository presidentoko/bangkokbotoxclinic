import type { Metadata } from 'next'
import { filterFoods } from '@/lib/petfood'
import FoodCard from '@/components/FoodCard'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'อาหารแมวที่ดีที่สุด — เปรียบเทียบเกรดคุณภาพ',
  description: 'เปรียบเทียบอาหารแมวยี่ห้อดัง Royal Canin, Hill\'s, Whiskas พร้อมเกรด A-F จากการวิเคราะห์ส่วนประกอบจริง หาอาหารแมวที่ดีที่สุดสำหรับน้อง ฟรี 100%',
  alternates: { canonical: 'https://www.thailandpethub.com/food/cat' },
  keywords: ['อาหารแมว', 'อาหารแมวที่ดีที่สุด', 'Royal Canin แมว', 'Hills แมว', 'Whiskas', 'เกรดอาหารแมว', 'AAFCO แมว'],
  openGraph: {
    title: 'อาหารแมวที่ดีที่สุด — เปรียบเทียบ A-F',
    description: 'เปรียบเทียบอาหารแมวพร้อมเกรดคุณภาพจากส่วนประกอบจริง ฟรี 100%',
    url: 'https://www.thailandpethub.com/food/cat',
  },
}

function FaqJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'อาหารแมวยี่ห้อไหนดีที่สุด?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาหารแมวที่ดีควรมีโปรตีนจากเนื้อสัตว์สูง (ขั้นต่ำ 30%) เพราะแมวเป็นสัตว์กินเนื้อโดยธรรมชาติ ควรผ่านมาตรฐาน AAFCO และไม่มีสารกันบูดสังเคราะห์ เช่น BHA, BHT หรือ Ethoxyquin',
        },
      },
      {
        '@type': 'Question',
        name: 'แมวควรกินอาหารเม็ดหรืออาหารเปียกดีกว่า?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาหารเปียกช่วยให้แมวได้รับน้ำมากขึ้น ลดความเสี่ยงโรคนิ่วในทางเดินปัสสาวะ อาหารเม็ดสะดวกกว่าและช่วยทำความสะอาดฟัน ในอุดมคติควรให้ทั้งสองอย่างผสมกัน',
        },
      },
      {
        '@type': 'Question',
        name: 'อาหารแมวที่มีธัญพืชดีหรือไม่มีธัญพืชดีกว่า?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาหารแมวแบบ grain-free ไม่ได้ดีกว่าเสมอไป สิ่งสำคัญคือคุณภาพส่วนประกอบโดยรวม แมวที่มีอาการแพ้ธัญพืชหรือไวต่ออาหารอาจได้ประโยชน์จาก grain-free แต่แมวทั่วไปไม่จำเป็นต้องหลีกเลี่ยงธัญพืชเสมอไป',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function CatFoodPage() {
  const allCat = filterFoods({ animal: 'cat', sort: 'score' })
  const kittenFoods = allCat.filter(f => f.life_stage === 'puppy')
  const adultFoods = allCat.filter(f => f.life_stage === 'adult')
  const seniorFoods = allCat.filter(f => f.life_stage === 'senior')

  return (
    <main className="max-w-4xl mx-auto">
      <FaqJsonLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/food" className="hover:text-orange-600">อาหารสัตว์เลี้ยง</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">อาหารแมว</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐈 อาหารแมวที่ดีที่สุด</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        เปรียบเทียบ <strong>{allCat.length} ยี่ห้อ</strong> พร้อมเกรดคุณภาพ A–F จากการวิเคราะห์ส่วนประกอบจริง
        ดูว่าอาหารแมวของคุณมีโปรตีนเพียงพอหรือไม่ มีส่วนประกอบที่ควรระวังบ้างไหม ฟรี 100%
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        แมวเป็นสัตว์กินเนื้อโดยธรรมชาติ (obligate carnivore) ต้องการโปรตีนจากเนื้อสัตว์สูงและทอรีนที่ได้จากเนื้อสัตว์เท่านั้น
        อาหารแมวที่ดีควรระบุโปรตีนเนื้อสัตว์เป็นอันดับแรก และผ่านมาตรฐาน AAFCO
      </p>

      {kittenFoods.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🐱 อาหารลูกแมว ({kittenFoods.length} รายการ)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kittenFoods.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      {adultFoods.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🐈 อาหารแมวผู้ใหญ่ ({adultFoods.length} รายการ)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adultFoods.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      {seniorFoods.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🐈 อาหารแมวสูงวัย ({seniorFoods.length} รายการ)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {seniorFoods.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      <section className="mt-4 bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อยเกี่ยวกับอาหารแมว</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'อาหารแมวยี่ห้อไหนดีที่สุด?', a: 'อาหารแมวที่ดีควรมีโปรตีนจากเนื้อสัตว์สูง (ขั้นต่ำ 30%) ผ่านมาตรฐาน AAFCO และไม่มีสารกันบูดสังเคราะห์ เช่น BHA, BHT หรือ Ethoxyquin' },
            { q: 'แมวควรกินอาหารเม็ดหรืออาหารเปียกดีกว่า?', a: 'อาหารเปียกช่วยให้แมวได้รับน้ำมากขึ้น ลดความเสี่ยงโรคนิ่ว อาหารเม็ดสะดวกกว่าและช่วยทำความสะอาดฟัน ในอุดมคติควรให้ทั้งสองอย่างผสมกัน' },
            { q: 'อาหารแมวที่มีธัญพืชดีหรือไม่มีธัญพืชดีกว่า?', a: 'Grain-free ไม่ได้ดีกว่าเสมอไป สิ่งสำคัญคือคุณภาพส่วนประกอบโดยรวม แมวที่มีอาการแพ้อาจได้ประโยชน์จาก grain-free แต่แมวทั่วไปไม่จำเป็นต้องหลีกเลี่ยงธัญพืช' },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <a href="/food" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">
          ← ดูอาหารทั้งหมด
        </a>
        <a href="/food/dog" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
          🐕 อาหารสุนัข →
        </a>
      </div>

      <RelatedGuides current="food" count={4} />
    </main>
  )
}
