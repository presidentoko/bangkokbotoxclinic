import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MRI สัตว์เลี้ยง กรุงเทพ — ราคา โรงพยาบาล วิธีเตรียมตัว',
  description: 'MRI สัตว์เลี้ยงในกรุงเทพ ราคา 8,000–30,000 บาท โรงพยาบาลสัตว์ที่มีเครื่อง MRI สำหรับสุนัขและแมว ขั้นตอนการเตรียมตัว และความแตกต่างจาก CT scan',
  keywords: ['mri สัตว์เลี้ยง', 'mri สุนัข', 'mri แมว', 'mri animal hospital bangkok', 'ราคา mri สัตว์', 'โรงพยาบาลสัตว์ mri'],
  alternates: {
    canonical: 'https://www.thailandpethub.com/mri',
  },
  openGraph: {
    title: 'MRI สัตว์เลี้ยง กรุงเทพ — ราคา โรงพยาบาล วิธีเตรียมตัว',
    description: 'MRI สัตว์เลี้ยงในกรุงเทพ ราคา 8,000–30,000 บาท โรงพยาบาลที่ให้บริการ MRI สำหรับสุนัขและแมว',
    url: 'https://www.thailandpethub.com/mri',
    type: 'article',
  },
}

const faqs = [
  {
    q: 'MRI สัตว์เลี้ยงราคาเท่าไหร่?',
    a: 'ราคา MRI สำหรับสัตว์เลี้ยงในกรุงเทพอยู่ที่ประมาณ 8,000–30,000 บาท ขึ้นอยู่กับโรงพยาบาล ขนาดสัตว์เลี้ยง และบริเวณที่ต้องสแกน ราคาครอบคลุมค่ายาสลบและค่าดูแลระหว่างขั้นตอน',
  },
  {
    q: 'โรงพยาบาลสัตว์ไหนในกรุงเทพมีเครื่อง MRI?',
    a: 'โรงพยาบาลสัตว์ที่มีเครื่อง MRI ได้แก่ โรงพยาบาลสัตว์มหาวิทยาลัยเกษตรศาสตร์ (หมอชิต), โรงพยาบาลสัตว์จุฬาลงกรณ์, Thonglor Pet Hospital, และโรงพยาบาลสัตว์เอกชนชั้นนำในกรุงเทพ ควรโทรนัดล่วงหน้าเสมอ',
  },
  {
    q: 'ต้องเตรียมตัวอย่างไรก่อนทำ MRI สัตว์เลี้ยง?',
    a: 'งดอาหาร 6–12 ชั่วโมงก่อนทำ MRI เนื่องจากต้องใช้ยาสลบ งดน้ำ 2–4 ชั่วโมงก่อน สัตวแพทย์จะตรวจสุขภาพก่อนให้ยาสลบ หากสัตว์เลี้ยงมีโรคประจำตัวหัวใจหรือไต กรุณาแจ้งสัตวแพทย์ล่วงหน้า',
  },
  {
    q: 'MRI สัตว์เลี้ยงใช้เวลานานแค่ไหน?',
    a: 'ขั้นตอนการสแกน MRI ใช้เวลา 30–90 นาที รวมเวลาเตรียมและฟื้นตัวจากยาสลบประมาณ 3–5 ชั่วโมง เจ้าของสามารถรอที่โรงพยาบาลได้',
  },
  {
    q: 'สัตว์เลี้ยงต้องทำ MRI เมื่อไหร่?',
    a: 'สัตวแพทย์แนะนำ MRI เมื่อสัตว์เลี้ยงมีอาการ ชัก, เดินเซ, ขาอ่อนแรง, ปวดกระดูกสันหลัง, สงสัยมีก้อนในสมองหรือไขสันหลัง หรือเมื่อ X-ray ไม่สามารถวินิจฉัยได้ชัดเจน',
  },
  {
    q: 'MRI ต่างจาก CT scan สัตว์เลี้ยงอย่างไร?',
    a: 'MRI ให้ภาพเนื้อเยื่ออ่อนได้ชัดเจนกว่า เหมาะสำหรับสมอง ไขสันหลัง และข้อต่อ ส่วน CT scan ใช้รังสีเอกซ์ เหมาะสำหรับกระดูก ปอด และอวัยวะในช่องท้อง ราคา CT scan มักถูกกว่า (5,000–15,000 บาท)',
  },
]

const priceItems = [
  { area: 'MRI สมอง', price: '10,000–25,000 บาท' },
  { area: 'MRI กระดูกสันหลัง', price: '8,000–20,000 บาท' },
  { area: 'MRI ข้อต่อ/กล้ามเนื้อ', price: '8,000–18,000 บาท' },
  { area: 'CT scan (ทั่วไป)', price: '5,000–15,000 บาท' },
]

const hospitals = [
  { name: 'โรงพยาบาลสัตว์มหาวิทยาลัยเกษตรศาสตร์', detail: 'ถ.พหลโยธิน หมอชิต · MRI 1.5T', slug: null },
  { name: 'โรงพยาบาลสัตว์จุฬาลงกรณ์', detail: 'ถ.อังรีดูนังต์ · บริการครบวงจร', slug: null },
  { name: 'Thonglor Pet Hospital', detail: 'ทองหล่อ · เปิด 24 ชั่วโมง', slug: null },
]

export default function MriPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
      { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: 'https://www.thailandpethub.com/hospital' },
      { '@type': 'ListItem', position: 3, name: 'MRI สัตว์เลี้ยง', item: 'https://www.thailandpethub.com/mri' },
    ],
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'MRI สัตว์เลี้ยง กรุงเทพ — ราคา โรงพยาบาล วิธีเตรียมตัว',
    description: 'ข้อมูลครบเกี่ยวกับ MRI สัตว์เลี้ยงในกรุงเทพ ราคา โรงพยาบาล และการเตรียมตัว',
    author: { '@type': 'Organization', name: 'ThailandPetHub' },
    publisher: { '@type': 'Organization', name: 'ThailandPetHub', url: 'https://www.thailandpethub.com' },
    url: 'https://www.thailandpethub.com/mri',
    inLanguage: 'th',
  }

  return (
    <main className="max-w-2xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <a href="/hospital" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
        ← โรงพยาบาลสัตว์
      </a>

      <h1 className="text-2xl font-bold mb-2">🔬 MRI สัตว์เลี้ยง กรุงเทพ</h1>
      <p className="text-gray-500 text-sm mb-6">ราคา โรงพยาบาลที่ให้บริการ และวิธีเตรียมตัว</p>

      {/* Price card */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
        <h2 className="font-bold text-gray-900 mb-3">ราคา MRI สัตว์เลี้ยงในกรุงเทพ (โดยประมาณ)</h2>
        <div className="space-y-2">
          {priceItems.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-gray-700">{item.area}</span>
              <span className="font-semibold text-gray-900">{item.price}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">*ราคารวมค่ายาสลบ อาจแตกต่างตามโรงพยาบาลและขนาดสัตว์</p>
      </div>

      {/* Hospitals */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="font-bold text-gray-900 mb-3">โรงพยาบาลสัตว์ที่มีเครื่อง MRI ในกรุงเทพ</h2>
        <div className="space-y-3">
          {hospitals.map((h, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5 text-sm">🏥</span>
              <div>
                <p className="font-medium text-sm text-gray-800">{h.name}</p>
                <p className="text-xs text-gray-500">{h.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">* แนะนำโทรนัดล่วงหน้าก่อนทุกครั้ง เครื่อง MRI มักมีจำนวนจำกัด</p>
        <a href="/hospital" className="mt-3 inline-block text-sm text-orange-600 hover:underline font-medium">
          ดูโรงพยาบาลสัตว์ทั้งหมด →
        </a>
      </div>

      {/* Preparation steps */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="font-bold text-gray-900 mb-3">วิธีเตรียมตัวก่อนทำ MRI</h2>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2"><span className="font-bold text-orange-500">1.</span><span><strong>งดอาหาร 6–12 ชม.</strong> ก่อนทำ MRI เนื่องจากต้องใช้ยาสลบ</span></li>
          <li className="flex gap-2"><span className="font-bold text-orange-500">2.</span><span><strong>งดน้ำ 2–4 ชม.</strong> ก่อนเวลานัด</span></li>
          <li className="flex gap-2"><span className="font-bold text-orange-500">3.</span><span><strong>แจ้งโรคประจำตัว</strong> หัวใจ ไต หรือยาที่กิน</span></li>
          <li className="flex gap-2"><span className="font-bold text-orange-500">4.</span><span><strong>นัดล่วงหน้า</strong> MRI ต้องจองคิวเสมอ ไม่มี walk-in</span></li>
          <li className="flex gap-2"><span className="font-bold text-orange-500">5.</span><span><strong>เตรียมเวลา 3–5 ชม.</strong> รวมเตรียมตัว ทำ MRI และฟื้นตัวจากยาสลบ</span></li>
        </ol>
      </div>

      {/* FAQ section */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">คำถามที่พบบ่อยเกี่ยวกับ MRI สัตว์เลี้ยง</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {faqs.map((f, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <p className="font-semibold text-sm text-gray-800 mb-1">{f.q}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center mb-6">
        <p className="text-sm text-gray-700 mb-3">ต้องการหาโรงพยาบาลสัตว์ใกล้บ้านของคุณ?</p>
        <a
          href="/hospital"
          className="inline-block bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm hover:bg-blue-700 transition-colors"
        >
          🏥 ค้นหาโรงพยาบาลสัตว์ทั้งหมด
        </a>
      </div>
    </main>
  )
}
