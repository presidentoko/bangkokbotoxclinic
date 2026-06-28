import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/most-iconic-bags-to-buy-used'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Most Iconic Luxury Bags to Buy Pre-Owned in Thailand 2025 | ChicPreowned'
      : '10 กระเป๋าหรูไอคอนที่ควรซื้อมือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Top 10 iconic luxury bags worth buying pre-owned in Thailand — Chanel Classic, Hermès Birkin, LV Neverfull, Gucci Dionysus. THB prices.'
      : '10 อันดับกระเป๋าหรูไอคอนที่คุ้มค่าซื้อมือสองในไทย — Chanel Classic, Hermès Birkin, LV Neverfull, Gucci Dionysus ราคาบาท',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function IconicBagsTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const bags = isEn ? [
    { rank: 1, name: 'Hermès Birkin 30/35', thb: '฿480,000–฿1,200,000', why: 'The most investment-grade bag ever made. Has never declined in long-run average price. Waiting list at retail; pre-owned is often the only access.' },
    { rank: 2, name: 'Chanel Classic Flap Medium', thb: '฿220,000–฿350,000', why: 'Chanel raises retail 3–5x/year. Pre-owned holds 85–110% of retail. Caviar leather is the most durable. Timeless silhouette.' },
    { rank: 3, name: 'Louis Vuitton Neverfull MM', thb: '฿68,000–฿90,000', why: 'Most versatile LV tote. Discontinued from time to time, driving pre-owned demand. Damier Ebene holds value best.' },
    { rank: 4, name: 'Hermès Kelly 28/32', thb: '฿380,000–฿950,000', why: 'Semi-structured silhouette. Convertible strap (shoulder or top-handle). More structured than Birkin. Investment-grade alongside Birkin.' },
    { rank: 5, name: 'Chanel Boy Bag Medium', thb: '฿160,000–฿260,000', why: 'Statement piece. Ruthenium hardware ages beautifully. More edgy than Classic Flap, holds value well in calfskin.' },
    { rank: 6, name: 'Louis Vuitton Speedy 25/30 B', thb: '฿48,000–฿75,000', why: 'Entry point LV with bandouliere strap. Clean doctor-bag shape. Deep pre-owned market = buy and sell easily.' },
    { rank: 7, name: 'Bottega Veneta Jodie PM', thb: '฿80,000–฿130,000', why: 'Post-Daniel Lee era classic. Intrecciato weave, no branding. Quiet luxury at its purest. Hard to find new.' },
    { rank: 8, name: 'Celine Luggage Tote', thb: '฿120,000–฿200,000', why: 'The Philo-era Céline is collector territory. Structured, practical, minimal. Pre-2017 pieces are the most valuable.' },
    { rank: 9, name: 'Gucci Dionysus Small', thb: '฿52,000–฿85,000', why: 'Distinctive tiger-head closure. Loved globally. Pre-owned market is well-established. Web stripe detail is iconic.' },
    { rank: 10, name: 'Dior Lady Dior Small', thb: '฿88,000–฿150,000', why: 'Named for Princess Diana. Cannage pattern, "DIOR" charms. Feminine, structured, globally recognized. Holds value at 75–90% retail.' },
  ] : [
    { rank: 1, name: 'Hermès Birkin 30/35', thb: '฿480,000–฿1,200,000', why: 'กระเป๋าที่เป็นการลงทุนระดับสูงที่สุดเท่าที่เคยมี ราคาเฉลี่ยระยะยาวไม่เคยลดลง มี waiting list ที่ร้าน การซื้อมือสองมักเป็นทางเลือกเดียว' },
    { rank: 2, name: 'Chanel Classic Flap Medium', thb: '฿220,000–฿350,000', why: 'Chanel ขึ้นราคา 3–5 ครั้ง/ปี มือสองคงมูลค่า 85–110% ของราคาร้าน หนัง caviar ทนทานที่สุด ทรงไม่มีวันล้าสมัย' },
    { rank: 3, name: 'Louis Vuitton Neverfull MM', thb: '฿68,000–฿90,000', why: 'โทต LV ที่ versatile ที่สุด หยุดผลิตเป็นบางช่วง ดันความต้องการมือสอง Damier Ebene คงมูลค่าดีที่สุด' },
    { rank: 4, name: 'Hermès Kelly 28/32', thb: '฿380,000–฿950,000', why: 'ทรงกึ่งแข็ง สายปรับได้ (สะพายไหล่หรือถือ) แข็งทรงกว่า Birkin เป็นการลงทุนระดับ Birkin' },
    { rank: 5, name: 'Chanel Boy Bag Medium', thb: '฿160,000–฿260,000', why: 'ชิ้นเด่น hardware สีรูทีเนียมเก่าสวย เข้มกว่า Classic Flap คงมูลค่าดีในหนังลูกวัว' },
    { rank: 6, name: 'Louis Vuitton Speedy 25/30 B', thb: '฿48,000–฿75,000', why: 'จุดเริ่มต้น LV พร้อมสาย bandouliere ทรงกระเป๋าแพทย์สะอาด ตลาดมือสองลึก ซื้อและขายง่าย' },
    { rank: 7, name: 'Bottega Veneta Jodie PM', thb: '฿80,000–฿130,000', why: 'คลาสสิกหลังยุค Daniel Lee ลาย intrecciato ไม่มีแบรนด์ Quiet luxury บริสุทธิ์ที่สุด หายากใหม่' },
    { rank: 8, name: 'Celine Luggage Tote', thb: '฿120,000–฿200,000', why: 'Céline ยุค Philo คือดินแดนนักสะสม แข็งทรง ใช้งานได้ มินิมอล ชิ้นก่อน 2017 มีค่ามากที่สุด' },
    { rank: 9, name: 'Gucci Dionysus Small', thb: '฿52,000–฿85,000', why: 'ตัวล็อครูปหัวเสือโดดเด่น เป็นที่รักทั่วโลก ตลาดมือสองได้รับการยืนยันดี ลายแถบเว็บเป็นไอคอน' },
    { rank: 10, name: 'Dior Lady Dior Small', thb: '฿88,000–฿150,000', why: 'ตั้งชื่อตาม Princess Diana ลาย cannage จี้ "DIOR" สตรีเพศ แข็งทรง รู้จักทั่วโลก คงมูลค่า 75–90% ของราคาร้าน' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Most Iconic Bags' : 'กระเป๋าไอคอน'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Most Iconic Luxury Bags to Buy Pre-Owned' : '10 กระเป๋าหรูไอคอนที่ควรซื้อมือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Pre-owned buys are strongest when the piece itself is iconic — recognized globally, proven value retention, deep resale market. These 10 bags meet all three criteria.'
          : 'การซื้อมือสองดีที่สุดเมื่อชิ้นนั้นเป็นไอคอน — รู้จักทั่วโลก มูลค่าได้รับการพิสูจน์ ตลาดขายต่อลึก 10 กระเป๋าเหล่านี้ตอบสนองเกณฑ์ทั้งสาม'}
      </p>

      <div className="space-y-4 mb-10">
        {bags.map(b => (
          <div key={b.rank} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl font-black text-gray-200 w-8 shrink-0 leading-tight">{b.rank}</span>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="font-bold text-gray-900">{b.name}</h2>
                  <span className="text-sm text-amber-700 font-semibold ml-3 text-right whitespace-nowrap">{b.thb}</span>
                </div>
                <p className="text-sm text-gray-600">{b.why}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/most-iconic-bags-to-buy-used" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/most-iconic-bags-to-buy-used" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/first-luxury-bag`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'First Luxury Bag →' : 'กระเป๋าหรูใบแรก →'}</Link>
        <Link href={`/${locale}/value-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Value Guide →' : 'คู่มือมูลค่า →'}</Link>
      </div>
    </div>
  )
}
