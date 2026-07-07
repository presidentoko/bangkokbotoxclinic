import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ประกันสัตว์เลี้ยงในไทย — เปรียบเทียบและสิ่งที่ต้องรู้',
  description: 'คู่มือประกันสัตว์เลี้ยงในประเทศไทย ประกันครอบคลุมอะไรบ้าง ราคาโดยประมาณ ข้อดีข้อเสีย และวิธีเลือกประกันที่เหมาะสมกับน้อง',
  alternates: { canonical: 'https://www.thailandpethub.com/insurance' },
  keywords: ['ประกันสัตว์เลี้ยง', 'ประกันสุนัข', 'ประกันแมว', 'ประกันสุขภาพสัตว์เลี้ยง', 'ค่ารักษาสัตว์เลี้ยง'],
  openGraph: {
    title: 'ประกันสัตว์เลี้ยงในไทย — เปรียบเทียบและสิ่งที่ต้องรู้',
    description: 'คู่มือประกันสัตว์เลี้ยงในประเทศไทย ประกันครอบคลุมอะไรบ้าง ราคาโดยประมาณ',
    url: 'https://www.thailandpethub.com/insurance',
  },
}

function InsuranceSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ประกันสัตว์เลี้ยงในไทยมีไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'มีประกันสัตว์เลี้ยงในไทยจากหลายบริษัท เช่น AIA, Muang Thai Life, Tokio Marine, และผู้ให้บริการเฉพาะสัตว์เลี้ยง ครอบคลุมทั้งค่ารักษาพยาบาล อุบัติเหตุ และบางแผนครอบคลุมโรคเรื้อรัง',
        },
      },
      {
        '@type': 'Question',
        name: 'ประกันสัตว์เลี้ยงราคาเท่าไหร่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ประกันสัตว์เลี้ยงพื้นฐานในไทยราคาประมาณ 1,500-5,000 บาทต่อปี แผนครอบคลุมมากขึ้นอาจถึง 10,000+ บาทต่อปี ขึ้นอยู่กับอายุ สายพันธุ์ และวงเงินที่คุ้มครอง',
        },
      },
      {
        '@type': 'Question',
        name: 'ควรทำประกันสัตว์เลี้ยงไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ขึ้นอยู่กับปัจจัยส่วนตัว ค่ารักษาสัตว์เลี้ยงในไทยอาจสูงถึงหลักแสน โดยเฉพาะการผ่าตัดหรือโรคร้ายแรง หากไม่มีเงินสำรองฉุกเฉินอย่างน้อย 50,000 บาท ประกันช่วยให้ตัดสินใจรักษาได้โดยไม่ต้องกังวลเรื่องเงิน',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const COVERAGE_TYPES = [
  { type: 'อุบัติเหตุ', detail: 'กระดูกหัก บาดแผล กินสิ่งแปลกปลอม — มักอยู่ในแผนพื้นฐาน', icon: '🩹' },
  { type: 'ป่วยไข้เฉียบพลัน', detail: 'โรคติดเชื้อ อาหารเป็นพิษ ท้องอืด — บางแผนครอบคลุม', icon: '🤒' },
  { type: 'โรคเรื้อรัง', detail: 'เบาหวาน โรคไต มะเร็ง — แผนพรีเมียมเท่านั้น', icon: '💊' },
  { type: 'การผ่าตัด', detail: 'ค่าผ่าตัดและยาสลบ — มักครอบคลุมในแผนกลางขึ้นไป', icon: '🔪' },
  { type: 'ทำหมัน', detail: 'บางแผนคืนเงินค่าทำหมัน', icon: '⚕️' },
  { type: 'ค่ายา/วัคซีน', detail: 'มักไม่ครอบคลุมในแผนพื้นฐาน', icon: '💉' },
]

const FACTORS = [
  { label: 'อายุน้อย', good: true, detail: 'ยิ่งทำตอนอายุน้อย เบี้ยยิ่งถูก และไม่มีโรคที่ถูกยกเว้น' },
  { label: 'สายพันธุ์เสี่ยง', good: false, detail: 'พันธุ์ที่มีโรคพันธุกรรม (Bulldog, Pug) เบี้ยแพงกว่า' },
  { label: 'โรคก่อนทำประกัน', good: false, detail: 'โรคที่เป็นอยู่ก่อนมักไม่ได้รับความคุ้มครอง' },
  { label: 'วงเงินต่อปี', good: true, detail: 'เลือกวงเงินที่ครอบคลุมค่าผ่าตัดฉุกเฉินได้ (50,000+ บาท)' },
]

export default function InsurancePage() {
  return (
    <main className="max-w-3xl mx-auto">
      <InsuranceSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ประกันสัตว์เลี้ยง</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🛡️ ประกันสัตว์เลี้ยงในไทย</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        ค่ารักษาสัตว์เลี้ยงในไทยอาจสูงกว่าที่คิด การผ่าตัดฉุกเฉินอาจถึง 30,000-100,000 บาท
        ประกันสัตว์เลี้ยงช่วยให้ตัดสินใจรักษาได้โดยไม่ต้องกังวลเรื่องเงิน
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        ตลาดประกันสัตว์เลี้ยงในไทยยังเล็กแต่กำลังเติบโต ควรเปรียบเทียบและอ่านเงื่อนไขละเอียดก่อนตัดสินใจ
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-2xl border p-4">
          <p className="text-xs text-gray-400 mb-1">เบี้ยประกันพื้นฐาน</p>
          <p className="font-black text-orange-500 text-xl">1,500-5,000 ฿</p>
          <p className="text-[11px] text-gray-400 mt-1">ต่อปี</p>
        </div>
        <div className="bg-white rounded-2xl border p-4">
          <p className="text-xs text-gray-400 mb-1">ค่าผ่าตัดฉุกเฉิน</p>
          <p className="font-black text-red-500 text-xl">30,000-100,000 ฿</p>
          <p className="text-[11px] text-gray-400 mt-1">โดยประมาณ</p>
        </div>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">📋 สิ่งที่ประกันมักครอบคลุม</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COVERAGE_TYPES.map(c => (
            <div key={c.type} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl flex-shrink-0">{c.icon}</span>
              <div>
                <p className="font-bold text-sm text-gray-800">{c.type}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">⚖️ ปัจจัยที่กำหนดเบี้ยและความคุ้มค่า</h2>
        <div className="space-y-3">
          {FACTORS.map(f => (
            <div key={f.label} className="flex items-start gap-3">
              <span className={`text-sm font-bold flex-shrink-0 ${f.good ? 'text-green-500' : 'text-red-400'}`}>{f.good ? '↓' : '↑'}</span>
              <div>
                <span className="font-semibold text-sm text-gray-800">{f.label}: </span>
                <span className="text-sm text-gray-500">{f.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-blue-800 mb-3 text-sm">🤔 ประกันหรือออมเอง?</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold text-blue-700 mb-2">🛡️ ทำประกัน เหมาะถ้า...</p>
            <ul className="space-y-1 text-blue-600">
              <li>• น้องสายพันธุ์เสี่ยงโรค</li>
              <li>• ไม่มีเงินสำรองฉุกเฉิน 50,000 ฿</li>
              <li>• ทำตอนน้องยังเด็ก</li>
              <li>• รับไม่ได้ถ้าต้องเลือกระหว่างเงินกับน้อง</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-2">💰 ออมเอง เหมาะถ้า...</p>
            <ul className="space-y-1 text-gray-600">
              <li>• มีเงินสำรองมากพอ</li>
              <li>• น้องสุขภาพแข็งแรงและพันธุ์ดี</li>
              <li>• ไม่อยากติดเงื่อนไขประกัน</li>
              <li>• เข้าใจความเสี่ยงและยอมรับได้</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'ประกันสัตว์เลี้ยงในไทยมีไหม?', a: 'มีหลายบริษัท เช่น AIA, Muang Thai Life, Tokio Marine และผู้ให้บริการเฉพาะสัตว์เลี้ยง ตลาดกำลังเติบโตและตัวเลือกเพิ่มขึ้นทุกปี' },
            { q: 'ประกันสัตว์เลี้ยงราคาเท่าไหร่?', a: 'แผนพื้นฐาน 1,500-5,000 บาท/ปี แผนครอบคลุมกว่าอาจถึง 10,000+ บาท ขึ้นอยู่กับอายุ สายพันธุ์ และวงเงินคุ้มครอง' },
            { q: 'ควรทำประกันตอนอายุเท่าไหร่?', a: 'ยิ่งเร็วยิ่งดี ทำขณะยังเด็กและสุขภาพดี เพื่อเบี้ยถูกกว่าและไม่มีเงื่อนไขยกเว้นโรค' },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/cost" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💰 คำนวณค่าใช้จ่าย</a>
        <a href="/hospital" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏥 หาโรงพยาบาลสัตว์</a>
        <a href="/tips" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">📚 เคล็ดลับดูแลน้อง</a>
      </div>

      <RelatedGuides current="insurance" count={4} />
    </main>
  )
}
