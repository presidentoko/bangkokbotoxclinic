import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'สัตว์เลี้ยงแพ้อาหาร — อาการ การตรวจ และอาหาร Hypoallergenic',
  description: 'วิธีสังเกตอาการแพ้อาหารในสุนัขและแมว การทำ elimination diet ตรวจหาสาเหตุ และอาหาร hypoallergenic ที่แนะนำ',
  alternates: { canonical: 'https://www.thailandpethub.com/allergy' },
  keywords: ['สุนัขแพ้อาหาร', 'แมวแพ้อาหาร', 'อาการแพ้สัตว์เลี้ยง', 'อาหาร hypoallergenic', 'elimination diet'],
  openGraph: {
    title: 'สัตว์เลี้ยงแพ้อาหาร — อาการ การตรวจ และอาหาร Hypoallergenic',
    description: 'อาการแพ้อาหารในสุนัขและแมว การตรวจหาสาเหตุ และวิธีจัดการ',
    url: 'https://www.thailandpethub.com/allergy',
  },
}

function AllergySchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สุนัขและแมวแพ้อาหารอะไรบ่อยที่สุด?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ส่วนผสมที่ทำให้แพ้บ่อยที่สุดคือโปรตีน ได้แก่ เนื้อวัว ไก่ นม ไข่ แป้งสาลี ข้าวโพด และถั่วเหลือง การแพ้มักพัฒนาต่อส่วนผสมที่กินเป็นประจำในอาหารเดิม',
        },
      },
      {
        '@type': 'Question',
        name: 'วิธีตรวจสอบว่าสัตว์เลี้ยงแพ้อาหารอะไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'การทำ elimination diet (8-12 สัปดาห์) เป็นมาตรฐานทอง ให้อาหารโปรตีนชนิดใหม่ที่ไม่เคยกิน เช่น เนื้อเป็ด กวาง แมลง หรืออาหาร hydrolyzed และสังเกตว่าอาการดีขึ้นไหม',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const ALLERGY_SYMPTOMS = {
  skin: ['คันมาก เกาบ่อย โดยเฉพาะเท้า ใบหน้า และหู', 'ผิวแดง อักเสบ มีรอยแผลจากเกา', 'ขนร่วง โดยเฉพาะบริเวณท้องและขา', 'กลิ่นตัวแรงหรือผิวมัน'],
  gi: ['ท้องเสียเรื้อรัง หรือบ่อยกว่าปกติ', 'อาเจียนซ้ำๆ', 'ท้องอืด ผายลมบ่อย', 'น้ำหนักลด ดูดซึมสารอาหารได้ไม่ดี'],
  ear: ['หูอักเสบซ้ำๆ', 'สั่นหัวหรือเกาหูบ่อย', 'มีของเหลวในหู กลิ่นเหม็น'],
}

const COMMON_ALLERGENS = [
  { ingredient: 'เนื้อวัว', rank: 1, note: 'พบบ่อยที่สุดเพราะอยู่ในอาหารหลายยี่ห้อ' },
  { ingredient: 'นมและผลิตภัณฑ์', rank: 2, note: 'สัตว์เลี้ยงส่วนใหญ่ย่อยน้ำตาลนม (lactose) ได้น้อย' },
  { ingredient: 'ไก่', rank: 3, note: 'พบบ่อยเพราะเป็นโปรตีนหลักในอาหารหลายชนิด' },
  { ingredient: 'แป้งสาลี', rank: 4, note: 'Gluten ไม่ใช่สาเหตุหลัก แต่แป้งสาลีอาจทำให้แพ้' },
  { ingredient: 'ไข่', rank: 5, note: 'โปรตีนในไข่สามารถกระตุ้นการแพ้ได้' },
  { ingredient: 'ถั่วเหลือง', rank: 6, note: 'พบบ่อยในอาหารราคาถูก' },
]

export default function AllergyPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <AllergySchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">แพ้อาหาร</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🤧 สัตว์เลี้ยงแพ้อาหาร</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        การแพ้อาหาร (food allergy) ต่างจากการไม่ทนต่ออาหาร (food intolerance)
        การแพ้เป็นการตอบสนองของระบบภูมิคุ้มกัน มักแสดงอาการทางผิวหนังมากกว่าระบบย่อยอาหาร
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        การแพ้อาหารพัฒนาต่อส่วนผสมที่กินซ้ำๆ เป็นเวลานาน — สัตว์เลี้ยงมักแพ้อาหารที่กินประจำ
      </p>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🔍 อาการที่พบบ่อย</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-sm text-gray-700 mb-2">🐾 ผิวหนัง (พบบ่อยสุด ~70%)</p>
            <ul className="space-y-1.5">
              {ALLERGY_SYMPTOMS.skin.map(s => (
                <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-700 mb-2">🫃 ระบบย่อยอาหาร (~30%)</p>
            <ul className="space-y-1.5">
              {ALLERGY_SYMPTOMS.gi.map(s => (
                <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-700 mb-2">👂 หู</p>
            <ul className="space-y-1.5">
              {ALLERGY_SYMPTOMS.ear.map(s => (
                <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-yellow-400 mt-0.5 flex-shrink-0">•</span>{s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">⚠️ ส่วนผสมที่ทำให้แพ้บ่อย</h2>
        <div className="space-y-0">
          {COMMON_ALLERGENS.map(a => (
            <div key={a.ingredient} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">#{a.rank}</span>
              <div>
                <p className="font-semibold text-sm text-gray-800">{a.ingredient}</p>
                <p className="text-xs text-gray-400">{a.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🧪 Elimination Diet — วิธีตรวจหาสาเหตุ</h2>
        <ol className="space-y-3">
          {[
            'ปรึกษาสัตวแพทย์ก่อน เพื่อแยกสาเหตุอื่นที่ทำให้คัน (เห็บ หมัด โรคผิวหนัง)',
            'เลือกอาหาร "novel protein" ที่น้องไม่เคยกินมาก่อน เช่น เนื้อเป็ด กวาง ม้า หรืออาหาร hydrolyzed',
            'ให้กินเฉพาะอาหารนั้น 8-12 สัปดาห์ ห้ามขนมอื่นโดยเด็ดขาด',
            'ถ้าอาการดีขึ้น: ทดสอบโดยกลับมาให้อาหารเดิม ถ้าอาการกลับมาแสดงว่าแพ้จริง',
            'ค่อยๆ เพิ่มโปรตีนทีละชนิดเพื่อหาตัวที่ทำให้แพ้',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-sm text-gray-700 leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
        <div className="bg-amber-50 rounded-xl p-3 mt-4">
          <p className="text-xs font-semibold text-amber-700 mb-1">⏰ ใช้เวลา 8-12 สัปดาห์</p>
          <p className="text-xs text-amber-600">ต้องอดทน บางตัวใช้เวลานานกว่านั้น อย่าเพิ่งเปลี่ยนอาหารกลางคัน</p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/food/best" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">⭐ อาหารเกรด A</a>
        <a href="/ingredients" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🔬 ส่วนผสมอันตราย</a>
        <a href="/hospital" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏥 หาสัตวแพทย์</a>
      </div>

      <RelatedGuides current="allergy" count={4} />
    </main>
  )
}
