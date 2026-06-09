import type { Metadata } from 'next'
import { filterFoods } from '@/lib/petfood'
import FoodCard from '@/components/FoodCard'

export const metadata: Metadata = {
  title: 'อาหารสุนัขที่ดีที่สุด — เปรียบเทียบเกรดคุณภาพ | ThailandPetHub',
  description: 'เปรียบเทียบอาหารสุนัขยี่ห้อดัง Royal Canin, Hill\'s, Purina พร้อมเกรด A-F จากการวิเคราะห์ส่วนประกอบจริง หาอาหารสุนัขที่ดีที่สุดสำหรับน้อง ฟรี 100%',
  alternates: { canonical: 'https://www.thailandpethub.com/food/dog' },
  keywords: ['อาหารสุนัข', 'อาหารสุนัขที่ดีที่สุด', 'อาหารหมา', 'Royal Canin', 'Hills', 'Purina', 'เกรดอาหารสุนัข', 'AAFCO'],
  openGraph: {
    title: 'อาหารสุนัขที่ดีที่สุด — เปรียบเทียบ A-F',
    description: 'เปรียบเทียบอาหารสุนัขพร้อมเกรดคุณภาพจากส่วนประกอบจริง ฟรี 100%',
    url: 'https://www.thailandpethub.com/food/dog',
  },
}

function FaqJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'อาหารสุนัขยี่ห้อไหนดีที่สุด?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาหารสุนัขที่ดีควรมีโปรตีนจากเนื้อสัตว์เป็นส่วนประกอบอันดับแรก ผ่านมาตรฐาน AAFCO และไม่มีสารกันบูดที่เป็นอันตราย เช่น BHA หรือ BHT ThailandPetHub วิเคราะห์ส่วนประกอบทุกยี่ห้อและให้เกรด A (ดีเยี่ยม) ถึง F (ควรหลีกเลี่ยง)',
        },
      },
      {
        '@type': 'Question',
        name: 'วิธีอ่านฉลากอาหารสุนัขอย่างถูกต้องเป็นอย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ดูส่วนประกอบแรกสุด ถ้าเป็นโปรตีนจากเนื้อสัตว์ (เช่น chicken, beef, salmon) ถือว่าดี ระวังส่วนประกอบที่ควรหลีกเลี่ยง เช่น BHA, BHT, ethoxyquin, propylene glycol และ corn syrup รวมถึงธัญพืชเป็นส่วนประกอบหลัก',
        },
      },
      {
        '@type': 'Question',
        name: 'AAFCO คืออะไร และสำคัญแค่ไหนในอาหารสุนัข?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AAFCO (Association of American Feed Control Officials) คือมาตรฐานสารอาหารขั้นต่ำสำหรับอาหารสัตว์เลี้ยง อาหารที่ผ่าน AAFCO หมายความว่ามีสารอาหารครบถ้วนตามที่สัตว์เลี้ยงต้องการในแต่ละช่วงวัย',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function DogFoodPage() {
  const allDog = filterFoods({ animal: 'dog', sort: 'score' })
  const puppyFoods = allDog.filter(f => f.life_stage === 'puppy')
  const adultFoods = allDog.filter(f => f.life_stage === 'adult')
  const seniorFoods = allDog.filter(f => f.life_stage === 'senior')

  return (
    <main className="max-w-4xl mx-auto">
      <FaqJsonLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/food" className="hover:text-orange-600">อาหารสัตว์เลี้ยง</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">อาหารสุนัข</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐕 อาหารสุนัขที่ดีที่สุด</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        เปรียบเทียบ <strong>{allDog.length} ยี่ห้อ</strong> พร้อมเกรดคุณภาพ A–F จากการวิเคราะห์ส่วนประกอบจริง
        ดูว่าอาหารสุนัขของคุณมีสารอาหารครบถ้วนหรือไม่ มีส่วนประกอบที่ควรระวังบ้างไหม ฟรี 100%
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        อาหารสุนัขที่ดีควรมีโปรตีนจากเนื้อสัตว์เป็นอันดับแรกในรายการส่วนประกอบ ผ่านมาตรฐาน AAFCO
        และไม่มีสารกันบูดสังเคราะห์อย่าง BHA, BHT หรือ Ethoxyquin
      </p>

      {puppyFoods.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🐶 อาหารลูกสุนัข ({puppyFoods.length} รายการ)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {puppyFoods.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      {adultFoods.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🐕 อาหารสุนัขผู้ใหญ่ ({adultFoods.length} รายการ)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adultFoods.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      {seniorFoods.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🐕 อาหารสุนัขสูงวัย ({seniorFoods.length} รายการ)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {seniorFoods.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      <section className="mt-4 bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อยเกี่ยวกับอาหารสุนัข</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'อาหารสุนัขยี่ห้อไหนดีที่สุด?', a: 'อาหารสุนัขที่ดีควรมีโปรตีนจากเนื้อสัตว์เป็นส่วนประกอบอันดับแรก ผ่านมาตรฐาน AAFCO และไม่มีสารกันบูดที่เป็นอันตราย เช่น BHA หรือ BHT ThailandPetHub วิเคราะห์ส่วนประกอบทุกยี่ห้อและให้เกรด A (ดีเยี่ยม) ถึง F (ควรหลีกเลี่ยง)' },
            { q: 'วิธีอ่านฉลากอาหารสุนัขอย่างถูกต้องเป็นอย่างไร?', a: 'ดูส่วนประกอบแรกสุด ถ้าเป็นโปรตีนจากเนื้อสัตว์ (เช่น chicken, beef, salmon) ถือว่าดี ระวัง BHA, BHT, ethoxyquin, propylene glycol และธัญพืชเป็นส่วนประกอบหลัก' },
            { q: 'AAFCO คืออะไร และสำคัญแค่ไหนในอาหารสุนัข?', a: 'AAFCO คือมาตรฐานสารอาหารขั้นต่ำสำหรับอาหารสัตว์เลี้ยง อาหารที่ผ่าน AAFCO หมายความว่ามีสารอาหารครบถ้วนตามที่สุนัขต้องการในแต่ละช่วงวัย' },
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
        <a href="/food/cat" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
          🐈 อาหารแมว →
        </a>
      </div>
    </main>
  )
}
