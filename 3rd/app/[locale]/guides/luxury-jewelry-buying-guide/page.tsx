import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/luxury-jewelry-buying-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Luxury Jewelry Buying Guide Thailand 2025: Cartier, Tiffany, Van Cleef | ChicPreowned'
      : 'คู่มือซื้อเครื่องประดับหรูในไทย 2025: Cartier Tiffany Van Cleef | ChicPreowned',
    description: isEn
      ? 'Pre-owned luxury jewelry guide for Thai buyers — Cartier Love, Tiffany T, VCA Alhambra. THB prices, resale retention, authentication tips.'
      : 'คู่มือซื้อเครื่องประดับหรูมือสองสำหรับผู้ซื้อชาวไทย — Cartier Love Tiffany T VCA Alhambra ราคาบาท การคงมูลค่า เคล็ดลับตรวจสอบ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function JewelryGuideTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const pieces = isEn ? [
    {
      brand: 'Cartier',
      item: 'Love Bracelet (Yellow Gold, Size 16–19)',
      thb: `${formatPriceTHB(5500)}–${formatPriceTHB(8500)}`,
      retail: `~${formatPriceTHB(10000)}`,
      resale: '55–85%',
      note: 'Most recognizable luxury bracelet in Thailand. Timeless design since 1969. Yellow gold holds value better than rose gold in Asian markets. Condition is critical — scratched screws drop value fast.',
    },
    {
      brand: 'Tiffany & Co.',
      item: 'Tiffany T1 Bangle (Rose Gold)',
      thb: `${formatPriceTHB(1500)}–${formatPriceTHB(3000)}`,
      retail: `~${formatPriceTHB(4500)}`,
      resale: '33–67%',
      note: 'Entry-level luxury jewelry with strong brand recognition. T1 is the current hero product. Rose gold versions are slightly less liquid than yellow gold — consider this for resale.',
    },
    {
      brand: 'Van Cleef & Arpels',
      item: 'Alhambra Vintage 10-Motif Necklace (Yellow Gold/Onyx)',
      thb: `${formatPriceTHB(9000)}–${formatPriceTHB(14000)}`,
      retail: `~${formatPriceTHB(17000)}`,
      resale: '53–82%',
      note: 'VCA Alhambra is a Thai fashion staple. Waitlists at boutiques. Pre-owned is often the only source. Onyx (black) and mother-of-pearl (white) are most liquid. Clover motifs verify as genuine.',
    },
    {
      brand: 'Bulgari',
      item: 'B.zero1 Ring (Yellow Gold, 4-Band)',
      thb: `${formatPriceTHB(3500)}–${formatPriceTHB(6000)}`,
      retail: `~${formatPriceTHB(8500)}`,
      resale: '41–71%',
      note: 'Bulgari B.zero1 is a strong everyday piece and gift item. 4-band (widest) holds value best. The spiral Colosseum-inspired design makes fakes obvious — alignment must be perfect.',
    },
  ] : [
    {
      brand: 'Cartier',
      item: 'Love Bracelet (ทองเหลือง ไซส์ 16–19)',
      thb: `${formatPriceTHB(5500)}–${formatPriceTHB(8500)}`,
      retail: `~${formatPriceTHB(10000)}`,
      resale: '55–85%',
      note: 'กำไลหรูที่เป็นที่รู้จักมากที่สุดในไทย ดีไซน์ไม่มีวันล้าสมัยตั้งแต่ปี 1969 ทองเหลืองคงมูลค่าดีกว่าโรสโกลด์ในตลาดเอเชีย สภาพสำคัญมาก — สกรูขูดลดมูลค่าเร็ว',
    },
    {
      brand: 'Tiffany & Co.',
      item: 'Tiffany T1 Bangle (โรสโกลด์)',
      thb: `${formatPriceTHB(1500)}–${formatPriceTHB(3000)}`,
      retail: `~${formatPriceTHB(4500)}`,
      resale: '33–67%',
      note: 'เครื่องประดับหรูเริ่มต้นพร้อมการรับรู้แบรนด์แข็งแกร่ง T1 คือผลิตภัณฑ์หลักปัจจุบัน เวอร์ชั่นโรสโกลด์มีสภาพคล่องน้อยกว่าทองเหลืองเล็กน้อย — พิจารณาสิ่งนี้เพื่อการขายต่อ',
    },
    {
      brand: 'Van Cleef & Arpels',
      item: 'Alhambra Vintage 10-Motif Necklace (ทองเหลือง/โอนิกซ์)',
      thb: `${formatPriceTHB(9000)}–${formatPriceTHB(14000)}`,
      retail: `~${formatPriceTHB(17000)}`,
      resale: '53–82%',
      note: 'VCA Alhambra คือของต้องมีในแฟชั่นไทย คิวที่บูติก มือสองมักเป็นแหล่งเดียว โอนิกซ์ (ดำ) และเปลือกหอยมุก (ขาว) มีสภาพคล่องสูงสุด ลายโคลเวอร์ตรวจสอบว่าเป็นของแท้',
    },
    {
      brand: 'Bulgari',
      item: 'B.zero1 Ring (ทองเหลือง 4-Band)',
      thb: `${formatPriceTHB(3500)}–${formatPriceTHB(6000)}`,
      retail: `~${formatPriceTHB(8500)}`,
      resale: '41–71%',
      note: 'Bulgari B.zero1 เป็นชิ้นประจำวันและของขวัญที่ดี 4-band (กว้างที่สุด) คงมูลค่าได้ดีที่สุด ดีไซน์ Colosseum เกลียวทำให้ของปลอมชัดเจน — การจัดแนวต้องสมบูรณ์',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Jewelry Buying Guide' : 'คู่มือซื้อเครื่องประดับ'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Luxury Jewelry Buying Guide 2025' : 'คู่มือซื้อเครื่องประดับหรู 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Jewelry holds value differently from bags — the Cartier Love bracelet rivals Birkin resale retention, while fashion jewelry pieces like Tiffany T drop more. Know the hierarchy before you buy pre-owned jewelry in Thailand.'
          : 'เครื่องประดับคงมูลค่าต่างจากกระเป๋า กำไล Cartier Love แข่งขันกับการคงมูลค่า Birkin ในขณะที่ชิ้นแฟชั่นอย่าง Tiffany T ลดมากกว่า รู้ลำดับชั้นก่อนซื้อเครื่องประดับมือสองในไทย'}
      </p>

      <div className="space-y-5 mb-10">
        {pieces.map((p, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{p.brand}</span>
                <h2 className="font-bold text-gray-900 mt-0.5">{p.item}</h2>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold text-amber-700">{p.thb}</div>
                <div className="text-xs text-gray-400">{isEn ? 'Retail' : 'ราคาร้าน'}: {p.retail}</div>
                <div className="text-xs text-gray-500">{isEn ? 'Resale' : 'ขายต่อ'}: {p.resale}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{p.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/luxury-jewelry-buying-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/luxury-jewelry-buying-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/cartier-vs-tiffany`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Tiffany →</Link>
        <Link href={`/${locale}/guides/how-to-authenticate-cartier`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authenticate Cartier →' : 'ตรวจสอบ Cartier →'}</Link>
      </div>
    </div>
  )
}
