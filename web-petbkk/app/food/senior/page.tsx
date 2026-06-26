import type { Metadata } from 'next'
import { filterFoods } from '@/lib/petfood'
import FoodCard from '@/components/FoodCard'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'อาหารสัตว์เลี้ยงสูงอายุที่ดีที่สุด — สุนัขและแมว Senior | ThailandPetHub',
  description: 'เปรียบเทียบอาหารสัตว์เลี้ยงสูงอายุ (Senior) สุนัขและแมว พร้อมเกรด A-F จากการวิเคราะห์ส่วนประกอบจริง เลือกอาหารที่ดีที่สุดสำหรับน้องวัยชรา',
  alternates: { canonical: 'https://www.thailandpethub.com/food/senior' },
  keywords: ['อาหารสุนัขสูงอายุ', 'อาหารแมวสูงอายุ', 'อาหาร senior', 'อาหารน้องแก่', 'อาหารสัตว์เลี้ยงผู้สูงวัย'],
  openGraph: {
    title: 'อาหารสัตว์เลี้ยงสูงอายุที่ดีที่สุด — เกรด A-F',
    description: 'อาหาร Senior สุนัขและแมว วิเคราะห์ส่วนประกอบจริง ฟรี 100%',
    url: 'https://www.thailandpethub.com/food/senior',
  },
}

function FaqJsonLd({ dogCount, catCount }: { dogCount: number; catCount: number }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สุนัขอายุเท่าไหร่ถือว่าเข้าสู่วัยสูงอายุ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สุนัขพันธุ์เล็ก (น้อยกว่า 10 กก.) เข้าสู่วัยสูงอายุเมื่ออายุประมาณ 10-12 ปี สุนัขพันธุ์กลาง 8-10 ปี สุนัขพันธุ์ใหญ่ 7-8 ปี สัตว์เลี้ยงสูงวัยต้องการอาหารที่มีแคลอรีลดลง แต่โปรตีนสูง เพื่อรักษามวลกล้ามเนื้อ',
        },
      },
      {
        '@type': 'Question',
        name: 'อาหาร Senior แตกต่างจากอาหารทั่วไปอย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาหาร Senior มักมีแคลอรีต่ำกว่าเพื่อป้องกันน้ำหนักเกิน มีโปรตีนสูงเพื่อรักษากล้ามเนื้อ มีกลูโคซามีนและคอนโดรอิตินสำหรับข้อต่อ มีไขมันโอเมก้า-3 สำหรับสมองและผิวหนัง และโซเดียมต่ำลงเพื่อดูแลไตและหัวใจ',
        },
      },
      {
        '@type': 'Question',
        name: 'อาหารสัตว์เลี้ยงสูงอายุยี่ห้อไหนดีที่สุด?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ThailandPetHub รวบรวมอาหารสัตว์เลี้ยงสูงอายุ ${dogCount + catCount} ยี่ห้อ (สุนัข ${dogCount} / แมว ${catCount}) พร้อมเกรดคุณภาพ A-F จากการวิเคราะห์ส่วนประกอบจริง เลือกอาหารเกรด A หรือ B เพื่อสุขภาพที่ดีที่สุด`,
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function SeniorFoodPage() {
  const dogSenior = filterFoods({ animal: 'dog', life_stage: 'senior', sort: 'score' })
  const catSenior = filterFoods({ animal: 'cat', life_stage: 'senior', sort: 'score' })

  return (
    <main className="max-w-4xl mx-auto">
      <FaqJsonLd dogCount={dogSenior.length} catCount={catSenior.length} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/food" className="hover:text-orange-600">อาหารสัตว์เลี้ยง</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">สูงอายุ</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐾 อาหารสัตว์เลี้ยงสูงอายุ</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        เปรียบเทียบอาหาร Senior <strong>{dogSenior.length + catSenior.length} ยี่ห้อ</strong> พร้อมเกรดคุณภาพ A–F
        จากการวิเคราะห์ส่วนประกอบจริง น้องสูงวัยต้องการโปรตีนสูง แคลอรีพอดี และสารอาหารพิเศษสำหรับข้อต่อและไต
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        สัตว์เลี้ยงสูงอายุมักมีปัญหาข้อต่อ ไต และน้ำหนักเกิน อาหาร Senior ที่ดีควรมีกลูโคซามีน
        โอเมก้า-3 และโซเดียมต่ำ พร้อมโปรตีนจากเนื้อสัตว์คุณภาพสูง
      </p>

      {dogSenior.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🐕 อาหารสุนัขสูงอายุ
            <span className="text-sm font-normal text-gray-400">({dogSenior.length} รายการ)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dogSenior.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      {catSenior.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🐈 อาหารแมวสูงอายุ
            <span className="text-sm font-normal text-gray-400">({catSenior.length} รายการ)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catSenior.map(food => <FoodCard key={food.id} food={food} />)}
          </div>
        </section>
      )}

      {dogSenior.length === 0 && catSenior.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">🐾</p>
          <p>กำลังรวบรวมข้อมูลอาหารสัตว์เลี้ยงสูงอายุ</p>
          <a href="/food" className="mt-4 inline-block px-5 py-2 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">
            ดูอาหารทั้งหมด →
          </a>
        </div>
      )}

      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อยเกี่ยวกับอาหารสัตว์เลี้ยงสูงอายุ</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'สุนัขอายุเท่าไหร่ถือว่าเข้าสู่วัยสูงอายุ?', a: 'สุนัขพันธุ์เล็กเข้าสู่วัยสูงอายุเมื่อ 10-12 ปี พันธุ์กลาง 8-10 ปี พันธุ์ใหญ่ 7-8 ปี แมวเข้าสู่วัยสูงอายุเมื่ออายุ 11 ปีขึ้นไป' },
            { q: 'อาหาร Senior แตกต่างจากอาหารทั่วไปอย่างไร?', a: 'อาหาร Senior มีแคลอรีต่ำกว่า โปรตีนสูง กลูโคซามีนสำหรับข้อต่อ โอเมก้า-3 สำหรับสมองและผิว และโซเดียมต่ำเพื่อดูแลไต' },
            { q: 'ควรเปลี่ยนอาหารสัตว์เลี้ยงสูงอายุอย่างไร?', a: 'ค่อยๆ เปลี่ยนใน 7-10 วัน โดยผสมอาหารใหม่ 25% กับอาหารเก่า 75% ค่อยๆ เพิ่มสัดส่วนอาหารใหม่ขึ้นทุก 2-3 วัน เพื่อหลีกเลี่ยงท้องเสียหรือการปฏิเสธอาหาร' },
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
        <a href="/food/dog" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🐕 อาหารสุนัข</a>
        <a href="/food/cat" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🐈 อาหารแมว</a>
        <a href="/age" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🎂 คำนวณอายุ</a>
      </div>

      <RelatedGuides current="food" count={4} />
    </main>
  )
}
