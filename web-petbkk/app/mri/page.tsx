import type { Metadata } from 'next'

/**
 * "mri สัตว์เลี้ยง" is one of the few non-brand queries this site ranks for at
 * all (23rd, ~100 impressions in three months), so the page is worth being
 * right — and it was not. It published a price table (MRI สมอง 10,000–25,000,
 * CT 5,000–15,000) and "MRI 1.5T" hospital notes that came from nowhere: no
 * source, and low by roughly half against what the hospitals actually charge.
 * An owner budgeting ฿10,000 for a brain MRI would arrive ฿10,000 short.
 *
 * Everything below is now quoted from the hospital's own published page, with
 * the source named and the date it was read. Where nothing is published —
 * CT prices, what a university hospital charges — the page says so instead of
 * estimating.
 */

const CHECKED = '16 ก.ย. 2569'

interface PriceRow {
  hospital: string
  /** Our own clinic page, when the hospital is in the directory. */
  slug?: string
  item: string
  price: string
  includes: string
  source: string
  sourceLabel: string
}

const PRICES: PriceRow[] = [
  {
    hospital: 'โรงพยาบาลสัตว์ทองหล่อ',
    slug: 'thonglor-pet-hospital',
    item: 'MRI 1 ตำแหน่ง',
    price: '19,900 บาท',
    includes: 'ค่าตรวจด้วยเครื่อง High-field MRI 1.5 Tesla · วิสัญญีสัตวแพทย์ · อ่านผลโดยรังสีแพทย์เฉพาะทาง · เฝ้าสัญญาณชีพตลอดการตรวจ',
    source: 'https://thonglorpet.com/promotion/mri-pet-imaging',
    sourceLabel: 'thonglorpet.com',
  },
  {
    hospital: 'โรงพยาบาลสัตว์ทองหล่อ',
    slug: 'thonglor-pet-hospital',
    item: 'MRI 2 ตำแหน่ง',
    price: '24,900 บาท',
    includes: 'เงื่อนไขเดียวกับ 1 ตำแหน่ง · ตำแหน่งเพิ่มเติมคิด 9,000–14,000 บาทต่อตำแหน่ง',
    source: 'https://thonglorpet.com/promotion/mri-pet-imaging',
    sourceLabel: 'thonglorpet.com',
  },
  {
    hospital: 'โรงพยาบาลสัตว์อารักษ์ สาขาทองหล่อ',
    slug: 'arak-animal-hospital-thonglor',
    item: 'แพ็กเกจ MRI',
    price: 'เริ่มต้น 23,000 บาท',
    includes: 'High-Field MRI 1.5 Tesla · ค่าแพทย์ MRI · อ่านผล · วิสัญญีแพทย์ · ยาระงับประสาท · แอดมิทดูแล 1 คืน',
    source: 'https://arakanimal.com/packages/High-Field-Pet-MRI-23k',
    sourceLabel: 'arakanimal.com',
  },
]

/** Hospitals that state they run an MRI service, whether or not they price it. */
const MRI_HOSPITALS: { name: string; slug?: string; note: string }[] = [
  { name: 'โรงพยาบาลสัตว์ทองหล่อ (เครือ)', slug: 'thonglor-pet-hospital', note: 'ศูนย์สมอง ระบบประสาทและสันหลัง · เครื่อง 1.5 Tesla · ประกาศราคาชัดเจน — โทรยืนยันว่าเครื่องอยู่สาขาไหนก่อนเดินทาง' },
  { name: 'โรงพยาบาลสัตว์อารักษ์ สาขาทองหล่อ', slug: 'arak-animal-hospital-thonglor', note: 'แพ็กเกจ MRI รวมแอดมิท 1 คืน · เครื่อง 1.5 Tesla' },
  { name: 'โรงพยาบาลสัตว์ ทีเอช (TH Animal Hospital)', slug: 'th-animal-hospital', note: 'มีหน้า MRI Center ของโรงพยาบาลเอง (ไม่ประกาศราคา)' },
  { name: 'โรงพยาบาลสัตว์พญาไท 7', slug: 'phyathai-7-animal-hospital', note: 'ระบุว่ามีบริการ MRI สำหรับวินิจฉัยโรคระบบประสาท (ไม่ประกาศราคา)' },
  { name: 'ศูนย์ MRI ในสัตว์เลี้ยง (Animal MRI Center)', slug: 'mri-animal-mri-center', note: 'ศูนย์เฉพาะทางที่รับเคสส่งต่อ' },
]

const faqs = [
  {
    q: 'MRI สัตว์เลี้ยงราคาเท่าไหร่?',
    a: `ราคาที่โรงพยาบาลประกาศเองในกรุงเทพ (ตรวจสอบเมื่อ ${CHECKED}): โรงพยาบาลสัตว์ทองหล่อ MRI 1 ตำแหน่ง 19,900 บาท และ 2 ตำแหน่ง 24,900 บาท ส่วนโรงพยาบาลสัตว์อารักษ์ สาขาทองหล่อ เป็นแพ็กเกจเริ่มต้น 23,000 บาท ทั้งสองรายการรวมค่าวางยาสลบและค่าอ่านผลแล้ว ราคาจริงขึ้นกับจำนวนตำแหน่งที่ต้องสแกนและสภาพของสัตว์`,
  },
  {
    q: 'ทำไมราคาถึงสูงกว่าที่เห็นในเว็บทั่วไป?',
    a: 'เพราะราคา MRI ไม่ได้มีแค่ค่าเครื่อง สัตว์ต้องวางยาสลบเพื่อให้นิ่งพอถ่ายภาพได้ จึงมีค่าวิสัญญีสัตวแพทย์ ค่าเฝ้าสัญญาณชีพ และบางแห่งรวมค่าแอดมิทค้างคืน ตัวเลขที่ต่ำกว่านี้มักเป็นราคาเฉพาะค่าสแกน หรือเป็นตัวเลขที่ไม่มีแหล่งอ้างอิง',
  },
  {
    q: 'โรงพยาบาลสัตว์ไหนในกรุงเทพมีเครื่อง MRI?',
    a: 'ที่ประกาศบริการไว้บนเว็บไซต์ของตัวเอง ได้แก่ โรงพยาบาลสัตว์ทองหล่อ, โรงพยาบาลสัตว์อารักษ์ สาขาทองหล่อ, โรงพยาบาลสัตว์ ทีเอช (MRI Center) และโรงพยาบาลสัตว์พญาไท 7 นอกจากนี้ยังมีศูนย์ MRI ในสัตว์เลี้ยงที่รับเคสส่งต่อ ทุกแห่งต้องนัดล่วงหน้า',
  },
  {
    q: 'ต้องเตรียมตัวอย่างไรก่อนทำ MRI สัตว์เลี้ยง?',
    a: 'โรงพยาบาลสัตว์ทองหล่อระบุให้งดอาหาร 8–12 ชั่วโมงก่อนตรวจ และต้องตรวจเลือดกับประเมินหัวใจก่อน เพื่อให้วางยาสลบได้อย่างปลอดภัย หากสัตว์เลี้ยงมีโรคหัวใจหรือโรคไตอยู่แล้ว ต้องแจ้งสัตวแพทย์ล่วงหน้าเสมอ',
  },
  {
    q: 'MRI สัตว์เลี้ยงใช้เวลานานแค่ไหน?',
    a: 'ตัวการสแกนใช้เวลาประมาณ 30–60 นาที ตามจำนวนตำแหน่งที่ตรวจ (ทองหล่อระบุ 30–60 นาที อารักษ์ระบุประมาณ 30 นาที) แต่ต้องเผื่อเวลาสำหรับการเตรียมตัว วางยาสลบ และฟื้นตัว บางแพ็กเกจให้ค้างคืนที่โรงพยาบาล 1 คืน',
  },
  {
    q: 'สัตว์เลี้ยงต้องทำ MRI เมื่อไหร่?',
    a: 'สัตวแพทย์มักส่งตรวจ MRI เมื่อสงสัยความผิดปกติของสมองหรือไขสันหลัง เช่น ชัก เดินเซ ขาอ่อนแรง ปวดหลังรุนแรง หรือเมื่อเอกซเรย์และอัลตราซาวด์ยังบอกสาเหตุไม่ได้ การตัดสินใจเป็นของสัตวแพทย์ที่ตรวจร่างกายน้องแล้ว ไม่ใช่สิ่งที่เจ้าของเลือกเองจากอาการ',
  },
  {
    q: 'MRI ต่างจาก CT scan อย่างไร?',
    a: 'MRI เห็นเนื้อเยื่ออ่อนได้ละเอียดกว่า จึงเหมาะกับสมอง ไขสันหลัง และหมอนรองกระดูก ส่วน CT ใช้รังสีเอกซ์ เร็วกว่า และเหมาะกับกระดูก ปอด และช่องท้อง เราไม่พบโรงพยาบาลสัตว์ในกรุงเทพที่ประกาศราคา CT ไว้เป็นสาธารณะ จึงแนะนำให้โทรถามโดยตรงแทนการอ้างตัวเลขที่ยืนยันไม่ได้',
  },
]

export const metadata: Metadata = {
  title: 'MRI สัตว์เลี้ยง กรุงเทพ — ราคาจริงจากโรงพยาบาล 19,900–24,900 บาท',
  description: `ราคา MRI สัตว์เลี้ยงที่โรงพยาบาลในกรุงเทพประกาศเอง: ทองหล่อ 19,900 บาท (1 ตำแหน่ง) · อารักษ์ทองหล่อ เริ่ม 23,000 บาท รวมยาสลบและอ่านผล พร้อมรายชื่อโรงพยาบาลที่มีเครื่อง MRI และการเตรียมตัว (ตรวจสอบ ${CHECKED})`,
  keywords: ['mri สัตว์เลี้ยง', 'mri สุนัข', 'mri แมว', 'mri animal hospital bangkok', 'ราคา mri สัตว์', 'โรงพยาบาลสัตว์ mri'],
  alternates: {
    canonical: 'https://www.thailandpethub.com/mri',
  },
  openGraph: {
    title: 'MRI สัตว์เลี้ยง กรุงเทพ — ราคาจริงจากโรงพยาบาล',
    description: 'ราคาที่โรงพยาบาลประกาศเอง 19,900–24,900 บาท รวมวางยาสลบและอ่านผล พร้อมแหล่งอ้างอิง',
    url: 'https://www.thailandpethub.com/mri',
    type: 'article',
  },
}

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
    headline: 'MRI สัตว์เลี้ยง กรุงเทพ — ราคาจริงจากโรงพยาบาล',
    description: 'ราคา MRI สัตว์เลี้ยงที่โรงพยาบาลในกรุงเทพประกาศเอง พร้อมแหล่งอ้างอิง รายชื่อโรงพยาบาลที่มีเครื่อง และการเตรียมตัว',
    citation: PRICES.map(r => r.source),
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
      <p className="text-gray-500 text-sm mb-6">ราคาที่โรงพยาบาลประกาศเอง พร้อมที่มา · รายชื่อโรงพยาบาลที่มีเครื่อง · การเตรียมตัว</p>

      {/* Price card — every figure quoted from the hospital's own page */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
        <h2 className="font-bold text-gray-900 mb-1">ราคาที่โรงพยาบาลประกาศเอง</h2>
        <p className="text-xs text-gray-500 mb-3">
          เฉพาะราคาที่โรงพยาบาลเผยแพร่บนเว็บไซต์ของตัวเอง ไม่ใช่ราคาประเมิน · ตรวจสอบเมื่อ {CHECKED}
        </p>
        <div className="space-y-3">
          {PRICES.map((row, i) => (
            <div key={i} className="bg-white rounded-lg border border-orange-100 p-3">
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  {row.slug ? (
                    <a href={`/hospital/${row.slug}`} className="hover:text-orange-600 hover:underline">{row.hospital}</a>
                  ) : row.hospital}
                </span>
                <span className="font-bold text-gray-900 whitespace-nowrap">{row.price}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{row.item}</p>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">รวม: {row.includes}</p>
              <a href={row.source} target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-orange-600 mt-1 inline-block">
                ที่มา: {row.sourceLabel} ↗
              </a>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
          ราคาจริงขึ้นกับจำนวนตำแหน่งที่ต้องสแกน น้ำหนักตัว และสภาพของน้องก่อนวางยาสลบ
          โรงพยาบาลอื่นที่มีเครื่อง MRI ไม่ได้ประกาศราคาไว้ — เราจึงไม่ใส่ตัวเลขแทน
        </p>
      </div>

      {/* Hospitals */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="font-bold text-gray-900 mb-1">โรงพยาบาลสัตว์ที่ระบุว่ามีบริการ MRI</h2>
        <p className="text-xs text-gray-500 mb-3">ตามที่โรงพยาบาลแต่ละแห่งประกาศไว้เอง · ทุกแห่งต้องนัดล่วงหน้า</p>
        <div className="space-y-3">
          {MRI_HOSPITALS.map((h, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5 text-sm">🏥</span>
              <div>
                <p className="font-medium text-sm text-gray-800">
                  {h.slug ? (
                    <a href={`/hospital/${h.slug}`} className="hover:text-orange-600 hover:underline">{h.name}</a>
                  ) : h.name}
                </p>
                <p className="text-xs text-gray-500">{h.note}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="/hospital" className="mt-3 inline-block text-sm text-orange-600 hover:underline font-medium">
          ดูโรงพยาบาลสัตว์ทั้งหมด →
        </a>
      </div>

      {/* Preparation steps */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="font-bold text-gray-900 mb-3">วิธีเตรียมตัวก่อนทำ MRI</h2>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2"><span className="font-bold text-orange-500">1.</span><span><strong>งดอาหาร 8–12 ชม.</strong> ก่อนตรวจ เพราะต้องวางยาสลบ (ตามที่ รพ.สัตว์ทองหล่อระบุ)</span></li>
          <li className="flex gap-2"><span className="font-bold text-orange-500">2.</span><span><strong>ตรวจเลือดและประเมินหัวใจก่อน</strong> เพื่อให้วางยาสลบได้อย่างปลอดภัย</span></li>
          <li className="flex gap-2"><span className="font-bold text-orange-500">3.</span><span><strong>แจ้งโรคประจำตัวและยาที่ใช้อยู่</strong> โดยเฉพาะโรคหัวใจและโรคไต</span></li>
          <li className="flex gap-2"><span className="font-bold text-orange-500">4.</span><span><strong>นัดล่วงหน้าเสมอ</strong> MRI ไม่มี walk-in</span></li>
          <li className="flex gap-2"><span className="font-bold text-orange-500">5.</span><span><strong>เผื่อเวลาทั้งวัน</strong> ตัวสแกน 30–60 นาที แต่ต้องรอฟื้นจากยาสลบ บางแพ็กเกจให้ค้างคืน 1 คืน</span></li>
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
