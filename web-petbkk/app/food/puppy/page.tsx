import type { Metadata } from 'next'
import { filterFoods } from '@/lib/petfood'
import FoodCard from '@/components/FoodCard'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'อาหารลูกสุนัขและลูกแมวที่ดีที่สุด — เกรด A-F',
  description: 'เปรียบเทียบอาหารลูกสุนัขและลูกแมว (Puppy/Kitten) พร้อมเกรด A-F จากการวิเคราะห์ส่วนประกอบจริง เลือกอาหารที่ดีที่สุดสำหรับน้องวัยเยาว์',
  alternates: { canonical: 'https://www.thailandpethub.com/food/puppy' },
  keywords: ['อาหารลูกสุนัข', 'อาหารลูกแมว', 'อาหาร puppy', 'อาหาร kitten', 'อาหารน้องวัยเยาว์'],
  openGraph: {
    title: 'อาหารลูกสุนัขและลูกแมวที่ดีที่สุด — เกรด A-F',
    description: 'อาหาร Puppy/Kitten วิเคราะห์ส่วนประกอบจริง ฟรี 100%',
    url: 'https://www.thailandpethub.com/food/puppy',
  },
}

function FaqJsonLd({ dogCount, catCount }: { dogCount: number; catCount: number }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ลูกสุนัขควรกินอาหาร puppy จนถึงอายุเท่าไหร่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สุนัขพันธุ์เล็กถึงกลางควรกินอาหาร puppy จนอายุ 12 เดือน สุนัขพันธุ์ใหญ่ถึง 18-24 เดือน เพราะต้องการสารอาหารที่สูงกว่าเพื่อการเจริญเติบโตที่สมบูรณ์',
        },
      },
      {
        '@type': 'Question',
        name: 'อาหารลูกสุนัขแตกต่างจากอาหารผู้ใหญ่อย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาหาร Puppy มีโปรตีนและแคลอรีสูงกว่า มีแคลเซียมและฟอสฟอรัสสำหรับการสร้างกระดูก มี DHA สำหรับการพัฒนาสมองและสายตา และเม็ดขนาดเล็กกว่าเหมาะกับช่องปากลูกสุนัข',
        },
      },
      {
        '@type': 'Question',
        name: 'อาหารลูกสุนัขและลูกแมวยี่ห้อไหนดีที่สุด?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ThailandPetHub รวบรวมอาหารสัตว์เลี้ยงวัยเยาว์ ${dogCount + catCount} ยี่ห้อ (สุนัข ${dogCount} / แมว ${catCount}) พร้อมเกรดคุณภาพ A-F เลือกเกรด A หรือ B ที่มีเนื้อสัตว์เป็นส่วนผสมหลัก`,
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function PuppyFoodPage() {
  const dogPuppy = filterFoods({ animal: 'dog', life_stage: 'puppy', sort: 'score' })
  const catKitten = filterFoods({ animal: 'cat', life_stage: 'puppy', sort: 'score' })

  return (
    <main className="max-w-4xl mx-auto">
      <FaqJsonLd dogCount={dogPuppy.length} catCount={catKitten.length} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/food" className="hover:text-orange-600">อาหารสัตว์เลี้ยง</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ลูกสุนัข/ลูกแมว</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐶 อาหารลูกสุนัขและลูกแมว</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        เปรียบเทียบอาหาร Puppy & Kitten <strong>{dogPuppy.length + catKitten.length} ยี่ห้อ</strong> พร้อมเกรดคุณภาพ A–F
        น้องวัยเยาว์ต้องการโปรตีนสูง DHA สำหรับสมอง และแคลเซียมสำหรับกระดูก
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        ช่วง 12 เดือนแรกของชีวิตสำคัญที่สุดสำหรับการพัฒนาร่างกายและสมอง
        เลือกอาหารคุณภาพสูงที่มีเนื้อสัตว์จริงเป็นส่วนผสมหลัก
      </p>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <p className="font-bold text-amber-700 text-sm mb-1">ให้อาหาร Puppy จนถึงอายุ...</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            พันธุ์เล็ก-กลาง: <strong>12 เดือน</strong> · พันธุ์ใหญ่: <strong>18-24 เดือน</strong> · ลูกแมว: <strong>12 เดือน</strong>
          </p>
        </div>
      </div>

      {dogPuppy.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🐕 อาหารลูกสุนัข (Puppy)
            <span className="text-sm font-normal text-gray-400">({dogPuppy.length} รายการ)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dogPuppy.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      {catKitten.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🐱 อาหารลูกแมว (Kitten)
            <span className="text-sm font-normal text-gray-400">({catKitten.length} รายการ)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catKitten.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      {dogPuppy.length === 0 && catKitten.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">🐶</p>
          <p>กำลังรวบรวมข้อมูลอาหารลูกสัตว์เลี้ยง</p>
          <a href="/food" className="mt-4 inline-block px-5 py-2 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">
            ดูอาหารทั้งหมด →
          </a>
        </div>
      )}

      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อยเกี่ยวกับอาหารลูกสุนัข/ลูกแมว</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'ลูกสุนัขควรกินอาหาร puppy นานแค่ไหน?', a: 'พันธุ์เล็ก-กลาง: 12 เดือน, พันธุ์ใหญ่: 18-24 เดือน เพราะต้องการแคลเซียมและโปรตีนสูงกว่าสำหรับการเจริญเติบโต' },
            { q: 'ควรให้อาหารกี่ครั้งต่อวัน?', a: 'ลูกสุนัข/แมว อายุต่ำกว่า 3 เดือน: 4 ครั้ง/วัน, 3-6 เดือน: 3 ครั้ง/วัน, 6-12 เดือน: 2 ครั้ง/วัน แบ่งมื้อย่อยเพื่อลดความเสี่ยงท้องอืด' },
            { q: 'ควรเปลี่ยนจาก puppy เป็น adult อย่างไร?', a: 'ค่อยๆ เปลี่ยนใน 7-10 วัน ผสมอาหารใหม่ 25% กับเก่า 75% เพิ่มสัดส่วนอาหารใหม่ขึ้นทีละน้อยทุก 2-3 วัน' },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/food" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">← ดูอาหารทั้งหมด</a>
        <a href="/food/senior" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">👴 อาหารสูงอายุ</a>
        <a href="/newpet" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🆕 คู่มือเลี้ยงใหม่</a>
        <a href="/vaccine" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💉 วัคซีนลูกสัตว์</a>
      </div>

      <RelatedGuides current="food" count={4} />
    </main>
  )
}
