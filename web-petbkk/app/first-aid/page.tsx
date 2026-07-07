import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ปฐมพยาบาลสัตว์เลี้ยงเบื้องต้น — ก่อนพาไปหาหมอ',
  description: 'วิธีปฐมพยาบาลสัตว์เลี้ยงเบื้องต้น กรณีกินยาเกินขนาด บาดแผล หมดสติ ชัก และเลือดออก ก่อนพาไปโรงพยาบาลสัตว์',
  alternates: { canonical: 'https://www.thailandpethub.com/first-aid' },
  keywords: ['ปฐมพยาบาลสัตว์เลี้ยง', 'สุนัขหมดสติ', 'แมวชัก', 'สัตว์เลี้ยงฉุกเฉิน', 'ก่อนพาหาหมอ'],
  openGraph: {
    title: 'ปฐมพยาบาลสัตว์เลี้ยงเบื้องต้น — ก่อนพาไปหาหมอ',
    description: 'วิธีปฐมพยาบาลสัตว์เลี้ยงก่อนพาไปโรงพยาบาลสัตว์',
    url: 'https://www.thailandpethub.com/first-aid',
  },
}

function FirstAidSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สัตว์เลี้ยงกินสิ่งเป็นพิษควรทำอะไรก่อน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อย่าพยายามทำให้อาเจียนเองโดยไม่ปรึกษาสัตวแพทย์ รีบพาไปโรงพยาบาลสัตว์ทันทีพร้อมนำสิ่งที่กินไปด้วย เพื่อช่วยให้สัตวแพทย์วินิจฉัยและรักษาได้เร็ว',
        },
      },
      {
        '@type': 'Question',
        name: 'สุนัขเลือดออกมากควรทำอย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ใช้ผ้าสะอาดกดบาดแผลอย่างต่อเนื่อง 5-10 นาที ห้ามเอาผ้าออกก่อนเพราะจะทำให้เลือดแข็งตัวไม่ได้ หากเลือดไม่หยุดให้รีบพาไปโรงพยาบาลสัตว์ทันที',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const SITUATIONS = [
  {
    title: 'เลือดออก',
    icon: '🩸',
    severity: 'urgent',
    steps: [
      'ใส่ถุงมือหรือใช้ถุงพลาสติก ถ้าไม่มี ล้างมือให้สะอาด',
      'กดผ้าสะอาดหรือผ้าก๊อซที่แผลต่อเนื่อง 5-10 นาที ห้ามยกออก',
      'ถ้าเลือดซึมผ้า ซ้อนผ้าเพิ่ม ไม่ถอดชิ้นเดิมออก',
      'กรณีขาหรือหางเลือดออกมาก อาจรัดห่วงเหนือแผล แต่ต้องคลายทุก 20 นาที',
      'พาไปโรงพยาบาลสัตว์โดยเร็ว',
    ],
  },
  {
    title: 'กินสิ่งเป็นพิษ',
    icon: '☠️',
    severity: 'critical',
    steps: [
      'อย่าพยายามทำให้อาเจียนเองโดยไม่ปรึกษาสัตวแพทย์ — การอาเจียนบางกรณีอันตรายกว่า',
      'เก็บสิ่งที่กินหรือบรรจุภัณฑ์ไปด้วย เพื่อช่วยสัตวแพทย์วินิจฉัย',
      'จดบันทึก: กินอะไร? ปริมาณเท่าไหร่? กินเมื่อไหร่?',
      'รีบพาไปโรงพยาบาลสัตว์ทันที ไม่รอสังเกตอาการ',
    ],
  },
  {
    title: 'หมดสติ/ไม่ตอบสนอง',
    icon: '😵',
    severity: 'critical',
    steps: [
      'ตรวจสอบการหายใจ: ดูหน้าอกขึ้น-ลง ฟังหรือสัมผัสลมหายใจ',
      'ถ้าหายใจ จัดท่าให้นอนตะแคง เพื่อป้องกันสำลัก',
      'ถ้าไม่หายใจ: CPR — กดหน้าอก 30 ครั้งต่อการเป่าลม 2 ครั้ง',
      'เรียกคนช่วยพาไปโรงพยาบาลสัตว์ขณะทำ CPR',
    ],
  },
  {
    title: 'ชัก',
    icon: '⚡',
    severity: 'urgent',
    steps: [
      'เคลียร์พื้นที่รอบน้องให้ปลอดภัย ป้องกันการกระแทกกับของแข็ง',
      'ห้ามจับลิ้นหรือใส่มือในปาก — ระหว่างชักสัตว์เลี้ยงไม่กลืนลิ้น',
      'จับเวลาการชัก ถ้าชักนานกว่า 5 นาที รีบพาหาหมอทันที',
      'หลังชักหยุด น้องมักสับสน อยู่กับน้องในที่เงียบ',
      'บันทึกวิดีโอถ้าทำได้ เพื่อช่วยสัตวแพทย์วินิจฉัย',
    ],
  },
  {
    title: 'กระดูกหัก/ขาเจ็บ',
    icon: '🦴',
    severity: 'urgent',
    steps: [
      'ห้ามพยายามดัดหรือจัดกระดูกเอง',
      'จำกัดการเคลื่อนไหว ใช้กล่องหรือกระดาษแข็งรองรับเป็นเปล',
      'ห่อด้วยผ้าอ่อน ป้องกันการเสียดสีเพิ่มเติม',
      'ยกน้องอย่างนุ่มนวล รองรับทั้งหัว ลำตัว และบริเวณบาดเจ็บ',
      'พาไปโรงพยาบาลสัตว์ทันที ไม่รอ',
    ],
  },
  {
    title: 'จมน้ำ',
    icon: '💧',
    severity: 'critical',
    steps: [
      'ดึงน้องออกจากน้ำ จับหัวให้ต่ำกว่าหน้าอก เพื่อระบายน้ำ',
      'เช็ดตัวให้แห้ง ห่อผ้าอุ่น ป้องกันภาวะตัวเย็น',
      'ตรวจสอบการหายใจ ถ้าไม่หายใจให้ทำ CPR ทันที',
      'พาไปโรงพยาบาลสัตว์ แม้ดูเหมือนฟื้นแล้ว เพราะอาจมีน้ำในปอด',
    ],
  },
]

const SEVERITY_CONFIG = {
  critical: { label: 'วิกฤต', cls: 'bg-red-500 text-white' },
  urgent: { label: 'เร่งด่วน', cls: 'bg-orange-500 text-white' },
}

export default function FirstAidPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <FirstAidSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ปฐมพยาบาลเบื้องต้น</span>
      </nav>

      <div className="bg-red-600 rounded-2xl p-4 mb-6 text-white">
        <p className="font-black text-lg mb-1">🚨 ฉุกเฉินจริงๆ?</p>
        <p className="text-red-100 text-sm mb-3">พาไปโรงพยาบาลสัตว์ทันที อย่าเสียเวลาค้นหาข้อมูล</p>
        <a href="/hospital/emergency" className="inline-block px-4 py-2 bg-white text-red-600 font-bold rounded-xl text-sm hover:bg-red-50 transition-colors">
          หาโรงพยาบาลฉุกเฉิน →
        </a>
      </div>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🩹 ปฐมพยาบาลสัตว์เลี้ยงเบื้องต้น</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        การปฐมพยาบาลเบื้องต้นช่วยรักษาชีวิตสัตว์เลี้ยงได้ก่อนถึงมือสัตวแพทย์
        แต่ <strong>ไม่ใช่การรักษา</strong> — ควรพาไปหาสัตวแพทย์เสมอหลังจากนั้น
      </p>

      <div className="space-y-5 mb-8">
        {SITUATIONS.map(s => {
          const sev = SEVERITY_CONFIG[s.severity as keyof typeof SEVERITY_CONFIG]
          return (
            <section key={s.title} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
                  {s.icon} {s.title}
                </h2>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${sev.cls}`}>{sev.label}</span>
              </div>
              <ol className="p-4 space-y-2.5">
                {s.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-blue-800 mb-3 text-sm">🎒 ชุดปฐมพยาบาลสัตว์เลี้ยงที่ควรมี</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-blue-700">
          {['ผ้าก๊อซและพลาสเตอร์', 'กรรไกรปลายมน', 'เทอร์โมมิเตอร์', 'น้ำเกลือล้างแผล', 'สำลีและ betadine', 'ถุงมือยาง', 'ผ้าห่มสำหรับห่อ', 'กล่องพลาสติกสำหรับขน'].map(item => (
            <div key={item} className="flex items-center gap-1.5"><span>•</span><span>{item}</span></div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/emergency" className="px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition-colors">🚨 คู่มือฉุกเฉิน</a>
        <a href="/hospital/emergency" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏥 โรงพยาบาลฉุกเฉิน</a>
        <a href="/toxic" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">⚠️ อาหารต้องห้าม</a>
      </div>

      <RelatedGuides current="first-aid" count={4} />
    </main>
  )
}
