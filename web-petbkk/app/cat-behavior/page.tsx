import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'พฤติกรรมแมว — ทำไมแมวถึง... คู่มือเข้าใจภาษาแมว | ThailandPetHub',
  description: 'ทำไมแมวถึงข่วน กัด ร้องตอนดึก ไม่มาหา หรือซ่อนตัว เข้าใจภาษาแมวและแก้พฤติกรรมที่ไม่พึงประสงค์ด้วยวิธีที่ถูกต้อง',
  alternates: { canonical: 'https://www.thailandpethub.com/cat-behavior' },
  keywords: ['พฤติกรรมแมว', 'ทำไมแมวถึงข่วน', 'แมวร้องตอนดึก', 'แมวกัดมือ', 'แมวไม่ยอมให้อุ้ม'],
  openGraph: {
    title: 'พฤติกรรมแมว — ทำไมแมวถึง... คู่มือเข้าใจภาษาแมว',
    description: 'เข้าใจภาษาแมวและแก้พฤติกรรมที่ไม่พึงประสงค์',
    url: 'https://www.thailandpethub.com/cat-behavior',
  },
}

function CatBehaviorSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ทำไมแมวถึงข่วนเฟอร์นิเจอร์?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'การข่วนเป็นพฤติกรรมตามธรรมชาติของแมว เพื่อลับเล็บ ทำเครื่องหมายอาณาเขต (ต่อมกลิ่นที่อุ้งเท้า) และยืดเส้น วิธีแก้คือจัดหาที่ข่วนที่น่าสนใจและตั้งในที่ที่แมวชอบ',
        },
      },
      {
        '@type': 'Question',
        name: 'ทำไมแมวถึงร้องตอนดึก?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สาเหตุที่พบบ่อย: ต้องการความสนใจ หิว ร้อน ไม่มีของเล่น ความเครียด หรืออาการทางสุขภาพ (เช่น ความดันสูง hyperthyroidism ในแมวแก่) ถ้าเกิดกะทันหัน ควรพบสัตวแพทย์',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const BEHAVIORS = [
  {
    q: 'ทำไมแมวถึงข่วนเฟอร์นิเจอร์?',
    reason: 'พฤติกรรมตามธรรมชาติ — ลับเล็บ + ทำเครื่องหมายอาณาเขต + ยืดเส้น',
    fix: 'จัดหาที่ข่วนที่ดี (ไม้บุเชือก, ฝนเล็บ) และตั้งใกล้กับสิ่งที่ข่วน รางวัลเมื่อใช้ถูกที่',
    icon: '🐾',
    dont: 'ห้ามลงโทษหลังข่วนเสร็จ แมวไม่เชื่อมโยงเหตุและผล',
  },
  {
    q: 'ทำไมแมวถึงกัดมือ?',
    reason: 'อาจเป็นการเล่น (โดยเฉพาะลูกแมว) หรือสัญญาณว่าสัมผัสมากเกิน (overstimulation)',
    fix: 'ไม่เล่นด้วยมือเปล่า ใช้ของเล่นแทน เรียนรู้สัญญาณว่าน้องพอแล้ว (หางปัด, หูแนบ)',
    icon: '🦷',
    dont: 'ห้ามดึงมือออกเร็วๆ จะกระตุ้นให้กัดแรงขึ้น ให้หยุดนิ่งแทน',
  },
  {
    q: 'ทำไมแมวถึงร้องตอนดึก?',
    reason: 'ต้องการความสนใจ / หิว / ร้อน / เบื่อ / โรค (hyperthyroidism, ความดันในแมวแก่)',
    fix: 'เล่นก่อนนอน 15 นาที ให้อาหารมื้อเล็กก่อนนอน ตรวจสอบสุขภาพถ้าเพิ่งเริ่ม',
    icon: '🌙',
    dont: 'ห้ามตื่นมาให้ความสนใจ — จะทำให้น้องเรียนรู้ว่าร้องแล้วได้ผล',
  },
  {
    q: 'ทำไมแมวถึงผลักของออกจากโต๊ะ?',
    reason: 'ต้องการความสนใจ หรือสำรวจสภาพแวดล้อม (ประสาทสัมผัสที่อุ้งเท้า)',
    fix: 'เล่นกับน้องมากขึ้น เพิ่มของเล่นที่กระตุ้นความอยากรู้ และจัดของมีค่าออกจากขอบโต๊ะ',
    icon: '📦',
    dont: 'ห้ามแสดงปฏิกิริยามากเกิน แมวอาจทำเพื่อดูว่าเจ้าของทำอะไร',
  },
  {
    q: 'ทำไมแมวถึงไม่ยอมให้อุ้ม?',
    reason: 'ไม่คุ้นเคยตั้งแต่เล็ก หรือถูกอุ้มในวิธีที่ไม่สบาย',
    fix: 'ฝึกค่อยๆ ให้ขนมเมื่อน้องยอมให้แตะ เพิ่มระยะเวลาทีละน้อย อย่าบังคับ',
    icon: '🤗',
    dont: 'ห้ามบังคับ แมวต้องรู้สึกปลอดภัยก่อน ความไว้วางใจต้องสร้างใช้เวลา',
  },
  {
    q: 'ทำไมแมวถึงชอบกล่อง?',
    reason: 'แมวรู้สึกปลอดภัยในที่แคบ ลดความเครียดและให้ความอบอุ่น',
    fix: 'ปล่อยให้เล่น! กล่องเป็นสิ่งดีสำหรับแมว ช่วยลดความวิตกกังวล',
    icon: '📦',
    dont: 'ไม่ต้องทำอะไร — นี่คือพฤติกรรมปกติและดี',
  },
]

const CAT_BODY_LANGUAGE = [
  { signal: 'หางตั้งตรง', meaning: 'ดีใจ มั่นใจ อยากทักทาย' },
  { signal: 'หางปัดเร็ว', meaning: 'หงุดหงิด ไม่ต้องการสัมผัสแล้ว' },
  { signal: 'หางพองฟู', meaning: 'กลัว หรือรู้สึกถูกคุกคาม' },
  { signal: 'หูแนบหัว', meaning: 'กลัว โกรธ หรือเจ็บ' },
  { signal: 'นอนคว่ำแสดงท้อง', meaning: 'ไว้ใจ — แต่ไม่ใช่ขอให้ถูท้องเสมอไป' },
  { signal: 'กะพริบตาช้าๆ', meaning: '"แมวจูบ" — รู้สึกปลอดภัยและรัก' },
  { signal: 'นวดขนม (kneading)', meaning: 'ความสุข ผ่อนคลาย ความรู้สึกอบอุ่น' },
]

export default function CatBehaviorPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <CatBehaviorSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">พฤติกรรมแมว</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐱 ทำไมแมวถึง…</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        แมวมีภาษาของตัวเอง พฤติกรรมที่ดูแปลกอาจมีเหตุผลที่ชัดเจน
        เข้าใจว่าทำไม และวิธีรับมือที่ถูกต้อง
      </p>

      <div className="space-y-4 mb-8">
        {BEHAVIORS.map(b => (
          <section key={b.q} className="bg-white rounded-2xl border shadow-sm p-5">
            <h2 className="font-black text-gray-900 text-base mb-3">{b.icon} {b.q}</h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="text-xs font-bold text-gray-500 mt-0.5 w-12 flex-shrink-0">เหตุผล</span>
                <p className="text-sm text-gray-600 leading-relaxed">{b.reason}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-xs font-bold text-green-600 mt-0.5 w-12 flex-shrink-0">แก้ได้</span>
                <p className="text-sm text-gray-600 leading-relaxed">{b.fix}</p>
              </div>
              <div className="flex items-start gap-2.5 bg-red-50 rounded-lg p-2.5 -mx-0.5">
                <span className="text-xs font-bold text-red-500 mt-0.5 w-12 flex-shrink-0">❌ อย่า</span>
                <p className="text-sm text-red-600 leading-relaxed">{b.dont}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🐈 ภาษากาย — อ่านแมวให้ออก</h2>
        <div className="space-y-2.5">
          {CAT_BODY_LANGUAGE.map(s => (
            <div key={s.signal} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className="font-semibold text-sm text-gray-800 w-36 flex-shrink-0">{s.signal}</span>
              <span className="text-sm text-gray-500">{s.meaning}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/tips" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">📚 เคล็ดลับดูแลน้อง</a>
        <a href="/food/cat" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🐈 อาหารแมว</a>
        <a href="/hospital" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏥 หาสัตวแพทย์</a>
      </div>

      <RelatedGuides current="tips" count={4} />
    </main>
  )
}
