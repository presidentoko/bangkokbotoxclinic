import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ป้องกันหมัดและเห็บในสัตว์เลี้ยง — วิธีกำจัดและยาที่ใช้',
  description: 'วิธีป้องกันและกำจัดหมัดและเห็บในสุนัขและแมว ยาหยด ปลอกคอ สเปรย์ และการทำความสะอาดบ้าน ป้องกันโรคที่มาจากหมัดและเห็บ',
  alternates: { canonical: 'https://www.thailandpethub.com/flea' },
  keywords: ['กำจัดหมัดสุนัข', 'หมัดแมว', 'ยากำจัดหมัด', 'ป้องกันเห็บ', 'หมัดสัตว์เลี้ยง'],
  openGraph: {
    title: 'ป้องกันหมัดและเห็บในสัตว์เลี้ยง — วิธีกำจัดและยาที่ใช้',
    description: 'วิธีป้องกันและกำจัดหมัดและเห็บ รวมถึงยาและผลิตภัณฑ์ที่แนะนำ',
    url: 'https://www.thailandpethub.com/flea',
  },
}

function FleaSchemaLd() {
  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'วิธีกำจัดหมัดในสัตว์เลี้ยงและบ้าน',
    description: 'ขั้นตอนการกำจัดหมัดอย่างครบวงจร ทั้งในตัวสัตว์และสภาพแวดล้อม',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'รักษาสัตว์เลี้ยง', text: 'ให้ยาหยดหลังคอหรือยากินตามน้ำหนักตัว ฆ่าหมัดทุกระยะบนตัวสัตว์' },
      { '@type': 'HowToStep', position: 2, name: 'ซักที่นอนและของเล่น', text: 'ซักด้วยน้ำร้อน 60°C ขึ้นไป ฆ่าไข่และตัวอ่อนหมัด' },
      { '@type': 'HowToStep', position: 3, name: 'ดูดฝุ่นทุกพื้นที่', text: 'ดูดฝุ่นพรม พื้น และรอยแตก เทถุงดูดฝุ่นทิ้งทันทีเพื่อกำจัดไข่หมัด' },
      { '@type': 'HowToStep', position: 4, name: 'ป้องกันต่อเนื่อง', text: 'ให้ยาป้องกันทุกเดือน ไม่หยุดแม้ไม่เห็นหมัดเพราะวงจรชีวิตหมัดยาวถึง 3 เดือน' },
    ],
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สัตว์เลี้ยงมีหมัดรู้ได้อย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สังเกตได้จาก: เกาหรือกัดตัวเองบ่อยผิดปกติ ผิวหนังแดงหรือมีรอยแผล ขนร่วง เห็นจุดสีดำเล็กๆ (อุจจาระหมัด) ในขน หรือเห็นหมัดตัวเล็กๆ สีน้ำตาลกระโดดในขน',
        },
      },
      {
        '@type': 'Question',
        name: 'ยากำจัดหมัดชนิดไหนดีที่สุด?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ยาหยดหลังคอ (Spot-on) เช่น Frontline, Advantage, Revolution ครอบคลุมทั้งหมัด เห็บ และบางชนิดรวมถึงพยาธิหัวใจ ยากิน เช่น Bravecto, NexGard สะดวกและออกฤทธิ์เร็ว ควรปรึกษาสัตวแพทย์เพื่อเลือกที่เหมาะสม',
        },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}

const PRODUCTS = [
  { type: 'ยาหยดหลังคอ (Spot-on)', pros: 'ง่าย ออกฤทธิ์นาน 1 เดือน', cons: 'อาจเปียกน้ำไม่ได้ 24-48 ชม.', brand: 'Frontline, Advantage, Revolution', icon: '💧' },
  { type: 'ยากิน (Oral)', pros: 'สะดวก ออกฤทธิ์เร็ว ไม่กังวลเรื่องอาบน้ำ', cons: 'ราคาสูงกว่า อาจมีผลข้างเคียงในบางตัว', brand: 'Bravecto, NexGard, Simparica', icon: '💊' },
  { type: 'ปลอกคอป้องกัน', pros: 'ออกฤทธิ์ 7-8 เดือน', cons: 'อาจระคายเคืองผิว บางตัวไม่ชอบ', brand: 'Seresto, Preventic', icon: '🟢' },
  { type: 'สเปรย์ฉีดตัว', pros: 'ราคาถูก ใช้ได้กับสภาพแวดล้อม', cons: 'ออกฤทธิ์สั้น ต้องใช้บ่อย', brand: 'Frontline Spray, Adams', icon: '🫙' },
]

const SIGNS = [
  'เกาหรือกัดตัวเองบ่อยผิดปกติ',
  'ผิวหนังแดง มีผดผื่นหรือแผล',
  'ขนร่วงเป็นหย่อม โดยเฉพาะบริเวณหาง',
  'เห็นจุดสีดำเล็กๆ ("หมัดดำ") ในขน',
  'เห็นหมัดตัวเล็กกระโดดในขน',
  'ซีดหรืออ่อนแรง (ในกรณีรุนแรง)',
]

export default function FleaPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <FleaSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ป้องกันหมัดและเห็บ</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🦟 ป้องกันหมัดและเห็บ</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        หมัดเป็นปัญหาที่พบบ่อยที่สุดในสัตว์เลี้ยงของไทย โดยเฉพาะในช่วงฤดูร้อน
        หมัดเพียงตัวเดียวสามารถวางไข่ได้ 50 ฟองต่อวัน และวงจรชีวิตใช้เวลา 3 เดือน
        การป้องกันต่อเนื่องสำคัญกว่าการรักษาเมื่อเป็นแล้ว
      </p>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🔍 สัญญาณว่าน้องมีหมัด</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SIGNS.map(sign => (
            <div key={sign} className="flex items-start gap-2.5 text-sm">
              <span className="text-red-500 font-bold mt-0.5 flex-shrink-0">•</span>
              <span className="text-gray-700">{sign}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">💊 ผลิตภัณฑ์กำจัดหมัดและเห็บ</h2>
        <div className="space-y-4">
          {PRODUCTS.map(p => (
            <div key={p.type} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{p.icon}</span>
                <p className="font-bold text-gray-800 text-sm">{p.type}</p>
              </div>
              <p className="text-xs text-gray-500 mb-1"><span className="font-medium text-green-600">✓ ข้อดี:</span> {p.pros}</p>
              <p className="text-xs text-gray-500 mb-1"><span className="font-medium text-red-500">✗ ข้อควรระวัง:</span> {p.cons}</p>
              <p className="text-xs text-blue-600"><span className="font-medium">ตัวอย่าง:</span> {p.brand}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🏠 วิธีกำจัดหมัดในบ้าน</h2>
        <p className="text-xs text-gray-500 mb-4">90% ของหมัดอยู่ในสภาพแวดล้อม ไม่ใช่บนตัวสัตว์!</p>
        <ol className="space-y-3">
          {[
            'ดูดฝุ่นพรม เบาะ และทุกรอยแตก ทิ้งถุงดูดฝุ่นทันที',
            'ซักที่นอน ผ้าห่ม และของเล่นด้วยน้ำร้อน 60°C',
            'ฉีดสเปรย์กำจัดหมัด (IGR) ในบ้านทุกมุม',
            'ให้ยาหรือทำหัตถการทุกสัตว์ในบ้านพร้อมกัน',
            'ทำซ้ำทุก 2 สัปดาห์เป็นเวลา 3 เดือน',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
        <p className="font-bold text-red-700 text-sm mb-2">⚠️ โรคที่มาจากหมัดและเห็บ</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-red-600">
          {['พยาธิตัวตืด (จากการกินหมัด)', 'โรคบาร์โตเนลลา (แมวข่วน)', 'โรคลีชมาเนีย (เห็บ)', 'โรคเม็ดเลือดแดงแตก (เห็บ)'].map(d => (
            <div key={d} className="flex items-start gap-1.5">
              <span className="mt-0.5">•</span><span>{d}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">🏥 หาสัตวแพทย์</a>
        <a href="/deworming" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🪱 ถ่ายพยาธิ</a>
        <a href="/tips" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">📚 เคล็ดลับดูแล</a>
      </div>

      <RelatedGuides current="flea" count={4} />
    </main>
  )
}
