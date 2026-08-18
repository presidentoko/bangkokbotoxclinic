import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ทำหมันสุนัขและแมว — ประโยชน์ ราคา และการฟื้นตัว',
  description: 'คู่มือทำหมันสัตว์เลี้ยงครบถ้วน ประโยชน์ของการทำหมัน อายุที่เหมาะสม ราคาโดยประมาณ และการดูแลหลังผ่าตัด ทั้งสุนัขและแมวตัวผู้-ตัวเมีย',
  alternates: { canonical: 'https://www.thailandpethub.com/neutering' },
  keywords: ['ทำหมันสุนัข', 'ทำหมันแมว', 'ราคาทำหมัน', 'ทำหมันดีไหม', 'หมันสุนัขตัวเมีย'],
  openGraph: {
    title: 'ทำหมันสุนัขและแมว — ประโยชน์ ราคา และการฟื้นตัว',
    description: 'คู่มือทำหมันสัตว์เลี้ยงครบถ้วน ประโยชน์ อายุที่เหมาะสม ราคา และการดูแลหลัง',
    url: 'https://www.thailandpethub.com/neutering',
  },
}

function NeuteringSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ทำหมันสุนัขและแมวราคาเท่าไหร่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ราคาทำหมันสุนัขตัวผู้ประมาณ 1,500-4,000 บาท ตัวเมีย 3,000-8,000 บาท แมวตัวผู้ 800-2,000 บาท แมวตัวเมีย 1,500-4,000 บาท ขึ้นอยู่กับขนาด อายุ สถานที่ และรวมค่ายาสลบ',
        },
      },
      {
        '@type': 'Question',
        name: 'ควรทำหมันเมื่ออายุเท่าไหร่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สุนัขพันธุ์เล็ก-กลาง: 6 เดือน, สุนัขพันธุ์ใหญ่: 9-12 เดือน แมว: 4-6 เดือน หรือก่อนเป็นสัด บางสัตวแพทย์แนะนำทำก่อนเป็นสัดครั้งแรกเพื่อลดความเสี่ยงมะเร็งเต้านม',
        },
      },
      {
        '@type': 'Question',
        name: 'ทำหมันแล้วสัตว์เลี้ยงจะอ้วนไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ทำหมันทำให้อัตราการเผาผลาญลดลงเล็กน้อย แต่ถ้าควบคุมอาหารและออกกำลังกายเหมาะสม สัตว์เลี้ยงจะไม่อ้วน แนะนำเปลี่ยนเป็นอาหารสูตร "หลังทำหมัน" ที่มีแคลอรีต่ำกว่า',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const BENEFITS = [
  { icon: '🩺', title: 'ลดความเสี่ยงโรค', items: ['ป้องกันมะเร็งเต้านม (ทำก่อนเป็นสัดครั้งแรก ลดเสี่ยงได้ 99%)', 'ป้องกันมดลูกอักเสบ (pyometra) ซึ่งอันตรายถึงชีวิต', 'ป้องกันมะเร็งอัณฑะในตัวผู้', 'ลดความเสี่ยงต่อมลูกหมากอักเสบ'] },
  { icon: '😌', title: 'พฤติกรรมดีขึ้น', items: ['ลดความก้าวร้าวที่มาจากฮอร์โมน', 'ลดการทำเครื่องหมายอาณาเขตด้วยปัสสาวะ', 'แมวตัวผู้ร้องน้อยลง เดินออกหาคู่น้อยลง', 'ลดความเสี่ยงอุบัติเหตุจากการออกไปหาคู่'] },
  { icon: '🌍', title: 'ลดปัญหาสัตว์จรจัด', items: ['ลดจำนวนลูกที่ไม่ต้องการ', 'ลดสัตว์จรจัดในระยะยาว', 'ช่วยให้สัตว์พักพิงมีทรัพยากรดูแลสัตว์มากขึ้น'] },
]

const PRICE_TABLE = [
  { type: 'แมวตัวผู้', low: 800, high: 2000 },
  { type: 'แมวตัวเมีย', low: 1500, high: 4000 },
  { type: 'สุนัขตัวผู้ (เล็ก <10 กก.)', low: 1500, high: 3000 },
  { type: 'สุนัขตัวผู้ (ใหญ่ >10 กก.)', low: 2500, high: 5000 },
  { type: 'สุนัขตัวเมีย (เล็ก <10 กก.)', low: 3000, high: 6000 },
  { type: 'สุนัขตัวเมีย (ใหญ่ >10 กก.)', low: 5000, high: 10000 },
]

const AGE_GUIDE = [
  { animal: 'แมวตัวผู้', age: '4-6 เดือน', note: 'ก่อนเริ่มทำเครื่องหมายกลิ่น' },
  { animal: 'แมวตัวเมีย', age: '4-6 เดือน', note: 'ก่อนเป็นสัดครั้งแรก' },
  { animal: 'สุนัขตัวผู้ (พันธุ์เล็ก-กลาง)', age: '6 เดือน', note: 'หลังฟันแท้ขึ้นครบ' },
  { animal: 'สุนัขตัวผู้ (พันธุ์ใหญ่)', age: '9-12 เดือน', note: 'รอให้โตเต็มที่ก่อน' },
  { animal: 'สุนัขตัวเมีย (พันธุ์เล็ก-กลาง)', age: '6 เดือน', note: 'ก่อนเป็นสัดครั้งแรก ถ้าทำได้' },
  { animal: 'สุนัขตัวเมีย (พันธุ์ใหญ่)', age: '9-18 เดือน', note: 'ปรึกษาสัตวแพทย์' },
]

export default function NeuteringPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <NeuteringSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ทำหมันสัตว์เลี้ยง</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">✂️ ทำหมันสุนัขและแมว</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        การทำหมัน (spay/neuter) เป็นหนึ่งในสิ่งที่ดีที่สุดที่คุณทำให้สัตว์เลี้ยงได้
        ช่วยยืดอายุ ป้องกันโรคร้ายแรง และลดพฤติกรรมที่ไม่พึงประสงค์
      </p>

      {/* Benefits */}
      <div className="space-y-4 mb-6">
        {BENEFITS.map(b => (
          <section key={b.title} className="bg-white rounded-2xl border shadow-sm p-5">
            <h2 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2">
              {b.icon} {b.title}
            </h2>
            <ul className="space-y-1.5">
              {b.items.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>{item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Age guide */}
      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">📅 อายุที่เหมาะสม</h2>
        <div className="space-y-0">
          {AGE_GUIDE.map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{a.animal}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.note}</p>
              </div>
              <span className="text-sm font-bold text-orange-500 flex-shrink-0">{a.age}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Price */}
      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">💰 ราคาโดยประมาณ</h2>
        <p className="text-xs text-gray-400 mb-4">*ราคาไม่รวม pre-op bloodwork (~500-1,500 ฿) แนะนำตรวจก่อนผ่าตัดเสมอ</p>
        <div className="space-y-0">
          {PRICE_TABLE.map(p => (
            <div key={p.type} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{p.type}</span>
              <span className="text-sm font-bold text-orange-500">{p.low.toLocaleString()}-{p.high.toLocaleString()} ฿</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recovery */}
      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🏥 การดูแลหลังทำหมัน</h2>
        <ol className="space-y-2.5">
          {[
            '24-48 ชม.แรก: สังเกตอาการใกล้ชิด น้องอาจง่วง เดินเซ เป็นเรื่องปกติจากยาสลบ',
            'จำกัดการวิ่งและกระโดด 10-14 วัน ป้องกันแผลแยก',
            'ใส่ปลอกคอป้องกันเลีย (E-collar) ตลอดเวลาจนแผลหาย',
            'ตรวจแผลทุกวัน: ปกติ = ขอบชิด, ไม่บวม, ไม่มีของเหลวไหล',
            'กลับพบสัตวแพทย์ตามนัด (มักวัน 10-14 หลังผ่าตัด)',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-sm text-gray-600 leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
        <div className="bg-red-50 rounded-xl p-3 mt-4 text-xs text-red-600">
          <strong>ไปหาหมอทันทีถ้า:</strong> แผลบวมแดงมาก, มีของเหลวขุ่น, น้องไม่กินอาหาร &gt;24 ชม., อาเจียนซ้ำ หรือซึมผิดปกติ
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">🏥 หาโรงพยาบาลสัตว์</a>
        <a href="/cost" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💰 คำนวณค่าใช้จ่าย</a>
        <a href="/vaccine" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💉 ตารางวัคซีน</a>
      </div>

      <RelatedGuides current="neutering" count={4} />
    </main>
  )
}
