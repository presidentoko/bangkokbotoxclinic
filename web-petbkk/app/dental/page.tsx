import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ดูแลฟันสุนัขและแมว — คู่มือครบฉบับ',
  description: 'วิธีแปรงฟันสุนัขและแมวที่บ้าน สัญญาณโรคเหงือก ควรไปสเกลฟันเมื่อไหร่ และผลิตภัณฑ์ดูแลฟันสัตว์เลี้ยงที่ดีที่สุด',
  alternates: { canonical: 'https://www.thailandpethub.com/dental' },
  keywords: ['แปรงฟันสุนัข', 'ดูแลฟันแมว', 'โรคเหงือกสัตว์เลี้ยง', 'สเกลฟันสุนัข', 'ฟันสุนัขเหลือง'],
  openGraph: {
    title: 'ดูแลฟันสุนัขและแมว — คู่มือครบฉบับ',
    description: 'วิธีแปรงฟันและดูแลช่องปากสัตว์เลี้ยง ป้องกันโรคเหงือกและฟันผุ',
    url: 'https://www.thailandpethub.com/dental',
  },
}

function DentalSchemaLd() {
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'ดูแลฟันสุนัขและแมว — คู่มือครบฉบับ',
    description: 'วิธีแปรงฟันสุนัขและแมวที่บ้าน สัญญาณโรคเหงือก และการดูแลช่องปากสัตว์เลี้ยง',
    url: 'https://www.thailandpethub.com/dental',
    publisher: { '@type': 'Organization', name: 'ThailandPetHub', url: 'https://www.thailandpethub.com' },
    inLanguage: 'th',
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ต้องแปรงฟันสุนัขบ่อยแค่ไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ควรแปรงฟันสุนัขอย่างน้อย 3 ครั้งต่อสัปดาห์ หรือทุกวันถ้าทำได้ คราบพลัคเริ่มกลายเป็นหินปูนภายใน 3-5 วัน ดังนั้นการแปรงฟันบ่อยๆ ช่วยป้องกันโรคเหงือกได้อย่างมีประสิทธิภาพ',
        },
      },
      {
        '@type': 'Question',
        name: 'สุนัขและแมวจำเป็นต้องสเกลฟันไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ใช่ สัตว์เลี้ยงส่วนใหญ่ควรสเกลฟันทุก 1-2 ปีโดยสัตวแพทย์ การสเกลฟันสัตว์เลี้ยงต้องใช้การวางยาสลบเพื่อทำความสะอาดใต้เหงือกอย่างปลอดภัย สัตวแพทย์จะประเมินความจำเป็นในแต่ละตัว',
        },
      },
      {
        '@type': 'Question',
        name: 'สัญญาณโรคเหงือกในสัตว์เลี้ยงมีอะไรบ้าง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สัญญาณโรคเหงือก ได้แก่ ลมหายใจเหม็น เหงือกแดงหรือบวม น้ำลายมาก กินอาหารลำบาก รากฟันโผล่ ฟันโยกหรือร่วง และน้ำหนักลดเนื่องจากเจ็บปากจนกินน้อยลง ควรพาพบสัตวแพทย์ทันทีที่พบอาการเหล่านี้',
        },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}

const SECTIONS = [
  {
    emoji: '🦷',
    title: 'ทำไมการดูแลฟันถึงสำคัญ?',
    items: [
      'สัตว์เลี้ยง 85% มีโรคเหงือกในระดับหนึ่งเมื่ออายุ 3 ปี',
      'แบคทีเรียในช่องปากอาจเข้าสู่กระแสเลือดและทำลายหัวใจ ไต และตับ',
      'โรคเหงือกทำให้สัตว์เลี้ยงเจ็บปวดและกินอาหารลำบาก ส่งผลต่อคุณภาพชีวิต',
      'การดูแลช่องปากที่ดีช่วยเพิ่มอายุขัยสัตว์เลี้ยงได้ 2-5 ปี',
    ],
  },
  {
    emoji: '🪥',
    title: 'วิธีแปรงฟันสัตว์เลี้ยงที่บ้าน',
    items: [
      'ใช้แปรงสีฟันสัตว์เลี้ยงหรือแปรงนิ้วมือ — ห้ามใช้ของมนุษย์',
      'ใช้ยาสีฟันสัตว์เลี้ยงเท่านั้น ยาสีฟันคนมีฟลูออไรด์ที่เป็นพิษต่อสัตว์',
      'เริ่มจากการให้น้องเลียยาสีฟันก่อน ค่อยๆ ฝึกให้ยอมรับแปรง',
      'แปรงเป็นวงกลม เน้นบริเวณรอยต่อฟันกับเหงือก',
      'ค่อยๆ เพิ่มระยะเวลา เริ่มจาก 30 วินาที ขยายเป็น 2-3 นาที',
    ],
  },
  {
    emoji: '⚠️',
    title: 'สัญญาณโรคเหงือก — ต้องพบสัตวแพทย์',
    items: [
      'ลมหายใจเหม็น (เกินกว่า "กลิ่นตามปกติ")',
      'เหงือกแดง บวม หรือเลือดออกง่าย',
      'น้ำลายมากผิดปกติ มีเมือกในน้ำลาย',
      'กินอาหารลำบาก เคี้ยวด้านเดียว หรือทิ้งอาหารกลางคัน',
      'รากฟันโผล่ ฟันสีเหลืองเข้มหรือน้ำตาล ฟันโยก',
      'ขุดหน้าหรือถูปากบ่อยผิดปกติ',
    ],
  },
  {
    emoji: '🏥',
    title: 'การสเกลฟันโดยสัตวแพทย์',
    items: [
      'ทำภายใต้การวางยาสลบเพื่อความปลอดภัยและประสิทธิผล',
      'ทำความสะอาดทั้งเหนือและใต้เหงือก ซึ่งทำเองที่บ้านไม่ได้',
      'แนะนำทุก 1-2 ปีสำหรับสัตว์เลี้ยงที่ไม่ได้แปรงฟันประจำ',
      'สัตวแพทย์จะตรวจฟันทุกซี่และถอนหากจำเป็น',
      'ราคาโดยประมาณ 2,000-6,000 บาท ขึ้นอยู่กับระดับการดูแลและขนาดสัตว์',
    ],
  },
  {
    emoji: '🦴',
    title: 'ผลิตภัณฑ์ดูแลฟัน (เสริมการแปรง)',
    items: [
      'ขนมแปรงฟัน (Dental Treats) — ช่วยขัดคราบพลัค แต่ไม่แทนการแปรงฟัน',
      'ของเล่นทันตกรรม — ยางแปรงฟัน เชือกขัดฟัน ช่วยขัดฟันได้บ้าง',
      'น้ำยาบ้วนปากสัตว์เลี้ยง — ผสมในน้ำดื่ม ลดแบคทีเรียในช่องปาก',
      'อาหารสูตรทันตกรรม (Dental Diet) — เม็ดใหญ่ ช่วยขัดผิวฟันขณะเคี้ยว',
    ],
  },
]

export default function DentalPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <DentalSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ดูแลฟัน</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🦷 ดูแลฟันสุนัขและแมว</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        สัตว์เลี้ยง <strong>85%</strong> มีโรคเหงือกเมื่ออายุ 3 ปี แต่ป้องกันได้ด้วยการดูแลฟันอย่างสม่ำเสมอ
        คู่มือนี้รวมทุกอย่างที่เจ้าของสัตว์เลี้ยงต้องรู้ ตั้งแต่การแปรงฟันที่บ้านจนถึงการสเกลฟัน
      </p>

      <div className="space-y-6 mb-8">
        {SECTIONS.map((sec) => (
          <section key={sec.title} className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="font-black text-gray-900 text-lg mb-4">
              {sec.emoji} {sec.title}
            </h2>
            <ul className="space-y-2.5">
              {sec.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="text-orange-500 font-bold mt-0.5 flex-shrink-0">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อยเกี่ยวกับฟันสัตว์เลี้ยง</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'ต้องแปรงฟันสุนัขบ่อยแค่ไหน?', a: 'ควรแปรงอย่างน้อย 3 ครั้งต่อสัปดาห์ ทุกวันดีที่สุด คราบพลัคกลายเป็นหินปูนภายใน 3-5 วัน' },
            { q: 'สัตว์เลี้ยงต้องสเกลฟันไหม?', a: 'ใช่ แนะนำทุก 1-2 ปีโดยสัตวแพทย์ ต้องวางยาสลบเพื่อทำความสะอาดใต้เหงือกอย่างปลอดภัย' },
            { q: 'ใช้ยาสีฟันคนกับสัตว์ได้ไหม?', a: 'ไม่ได้เด็ดขาด ยาสีฟันคนมีฟลูออไรด์และไซลิทอลซึ่งเป็นพิษต่อสัตว์ ใช้ยาสีฟันที่ผลิตสำหรับสัตว์เลี้ยงเท่านั้น' },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">🏥 หาสัตวแพทย์ใกล้บ้าน</a>
        <a href="/tips" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">📚 เคล็ดลับดูแลสัตว์เลี้ยง</a>
        <a href="/vaccine" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💉 ตารางวัคซีน</a>
      </div>

      <RelatedGuides current="dental" count={4} />
    </main>
  )
}
