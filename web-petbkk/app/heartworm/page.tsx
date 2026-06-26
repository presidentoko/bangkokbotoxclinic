import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'พยาธิหัวใจในสุนัขและแมว — ป้องกัน ตรวจ และรักษา | ThailandPetHub',
  description: 'คู่มือพยาธิหัวใจสัตว์เลี้ยงในประเทศไทย วิธีป้องกัน ยาที่ใช้ อาการ และการรักษา พยาธิหัวใจพบบ่อยในไทยเพราะอากาศชื้นและมียุงชุก',
  alternates: { canonical: 'https://www.thailandpethub.com/heartworm' },
  keywords: ['พยาธิหัวใจสุนัข', 'พยาธิหัวใจแมว', 'ป้องกันพยาธิหัวใจ', 'ยาพยาธิหัวใจ', 'heartworm ไทย'],
  openGraph: {
    title: 'พยาธิหัวใจในสัตว์เลี้ยง — ป้องกัน ตรวจ และรักษา',
    description: 'คู่มือพยาธิหัวใจสัตว์เลี้ยง วิธีป้องกัน ยาที่ใช้ และอาการที่ต้องระวัง',
    url: 'https://www.thailandpethub.com/heartworm',
  },
}

function HeartwormSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'พยาธิหัวใจในสุนัขรักษาได้ไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'รักษาได้ แต่มีค่าใช้จ่ายสูงและใช้เวลานาน สุนัขต้องพักนิ่งอย่างเคร่งครัดระหว่างการรักษา 2-3 เดือน การป้องกันด้วยยาทุกเดือนถูกกว่าและปลอดภัยกว่ามาก แมวยังไม่มีการรักษาที่ผ่านการรับรอง การป้องกันสำคัญที่สุด',
        },
      },
      {
        '@type': 'Question',
        name: 'ยาป้องกันพยาธิหัวใจต้องให้บ่อยแค่ไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ยาส่วนใหญ่ให้ทุกเดือน บางชนิดทุก 6 เดือน หรือแบบยาหยอดรายเดือน การให้สม่ำเสมอสำคัญมาก ขาดยาแม้แต่เดือนเดียวอาจทำให้ไม่ได้รับการป้องกัน',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const PREVENTION_MEDS = [
  { name: 'Heartgard (Ivermectin)', form: 'ยากิน', freq: 'รายเดือน', note: 'ยอดนิยม ปลอดภัยสูง' },
  { name: 'Revolution (Selamectin)', form: 'ยาหยดหลังคอ', freq: 'รายเดือน', note: 'ครอบคลุมหมัด เห็บ และพยาธิหัวใจ' },
  { name: 'ProHeart 6/12', form: 'ฉีด', freq: 'ทุก 6-12 เดือน', note: 'สะดวก ไม่ต้องจำรายเดือน' },
  { name: 'Advantage Multi', form: 'ยาหยดหลังคอ', freq: 'รายเดือน', note: 'ครอบคลุมพยาธิและหมัด' },
]

const SYMPTOMS_DOG = [
  'ไอแห้งเรื้อรัง', 'เหนื่อยง่ายผิดปกติ', 'ท้องป่อง (น้ำในช่องท้อง)', 'น้ำหนักลด', 'หมดแรง ไม่อยากเล่น', 'เสียงหายใจผิดปกติ (ระยะท้าย)'
]

export default function HeartwormPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <HeartwormSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">พยาธิหัวใจ</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🦟 พยาธิหัวใจในสัตว์เลี้ยง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        ประเทศไทยมีความเสี่ยงสูงจากพยาธิหัวใจ เพราะสภาพอากาศชื้นและมียุงตลอดปี
        พยาธิหัวใจ (Dirofilaria immitis) แพร่ผ่านยุงกัด และอาศัยในหัวใจและหลอดเลือดปอด
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        การป้องกันด้วยยาเพียงเดือนละครั้งมีราคาถูกกว่าการรักษาหลายสิบเท่า
      </p>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-red-700 text-sm mb-1">⚠️ ในไทยทุกสัตว์เลี้ยงที่ออกนอกบ้านควรได้รับยาป้องกัน</p>
        <p className="text-xs text-red-600">แม้แต่แมวในบ้านที่ยุงเข้าได้ก็มีความเสี่ยง</p>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">💊 ยาป้องกันพยาธิหัวใจที่พบบ่อย</h2>
        <div className="space-y-3">
          {PREVENTION_MEDS.map(m => (
            <div key={m.name} className="border border-gray-100 rounded-xl p-4">
              <div className="flex justify-between items-start mb-1.5">
                <p className="font-bold text-gray-800 text-sm">{m.name}</p>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{m.freq}</span>
              </div>
              <p className="text-xs text-gray-500"><span className="font-medium">รูปแบบ:</span> {m.form}</p>
              <p className="text-xs text-blue-600 mt-0.5">{m.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🔍 อาการที่ควรระวัง (สุนัข)</h2>
        <p className="text-xs text-gray-400 mb-3">อาการมักไม่ชัดเจนจนกว่าพยาธิจะเติบโตเต็มที่ (ใช้เวลา 6-7 เดือน)</p>
        <div className="grid grid-cols-2 gap-2">
          {SYMPTOMS_DOG.map(s => (
            <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-red-400 font-bold">•</span>{s}
            </div>
          ))}
        </div>
        <div className="bg-purple-50 rounded-xl p-3 mt-4">
          <p className="text-xs font-semibold text-purple-700 mb-1">แมวมีอาการต่างจากสุนัข</p>
          <p className="text-xs text-purple-600">ไอ หายใจลำบาก อาเจียน หมดสติ หรือเสียชีวิตกะทันหัน แมวมักไม่มีอาการเรื้อรังแบบสุนัข</p>
        </div>
      </section>

      <section className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'ต้องตรวจพยาธิหัวใจก่อนให้ยาป้องกันไหม?', a: 'สำหรับสุนัขที่ไม่เคยได้รับยาป้องกัน สัตวแพทย์จะตรวจเลือดก่อน เพราะถ้ามีพยาธิหัวใจอยู่แล้ว การให้ยาป้องกันบางชนิดอาจเป็นอันตราย' },
            { q: 'พยาธิหัวใจรักษาได้ไหม?', a: 'รักษาได้ในสุนัข แต่ค่าใช้จ่ายสูงและใช้เวลานาน สุนัขต้องพักนิ่งอย่างเคร่งครัด 2-3 เดือน แมวยังไม่มีการรักษาที่รับรอง' },
            { q: 'ขาดยาป้องกันไปเดือนหนึ่งเป็นไร?', a: 'ควรกลับมาให้ยาทันทีที่นึกได้ แต่ถ้าหยุดมากกว่า 2 เดือน ควรตรวจเลือดก่อน โดยเฉพาะถ้าสัตว์เลี้ยงมีโอกาสถูกยุงกัด' },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/deworming" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🪱 ถ่ายพยาธิ</a>
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">🏥 หาสัตวแพทย์</a>
        <a href="/flea" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🦟 กำจัดหมัด/เห็บ</a>
      </div>

      <RelatedGuides current="deworming" count={4} />
    </main>
  )
}
