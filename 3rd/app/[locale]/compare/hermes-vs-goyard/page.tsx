import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/hermes-vs-goyard'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Hermès vs Goyard Pre-Owned Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Hermès vs Goyard มือสองในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Hermès vs Goyard comparison — resale value, canvas vs leather, Thailand availability. Which is the better pre-owned buy?'
      : 'เปรียบ Hermès กับ Goyard — มูลค่าขายต่อ ผ้า vs หนัง หาง่ายแค่ไหนในไทย อันไหนซื้อมือสองคุ้มกว่า?',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function HermesVsGoyardTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Founded', hermes: '1837 (Paris)', goyard: '1853 (Paris)' },
    { metric: 'Heritage', hermes: 'Saddle & harness maker. Birkin born 1984.', goyard: 'Trunk maker. Served Czar Nicholas II, Pablo Picasso.' },
    { metric: 'Material', hermes: 'Leather (Togo, Epsom, Clemence, Box)', goyard: 'Goyardine canvas (hand-painted on linen)' },
    { metric: 'Resale (entry)', hermes: '฿120,000+ (Herbag, Picotin)', goyard: '฿48,000–72,000 (Saint-Louis PM)' },
    { metric: 'Resale vs retail', hermes: 'Birkin: 200–500%+ above retail at peak', goyard: 'Often at or above retail (+0–30%)' },
    { metric: 'Thailand availability', hermes: 'Boutiques at Siam Paragon, ICONSIAM', goyard: 'Boutique at Emporium. Fewer units.' },
    { metric: 'Recognition (TH market)', hermes: 'Very high — Birkin is status symbol', goyard: 'Growing — preferred by understated buyers' },
    { metric: 'Counterfeiting risk', hermes: 'Very high — especially Birkin', goyard: 'High — Goyardine canvas widely faked' },
    { metric: 'Durability', hermes: 'Exceptional — leather ages beautifully', goyard: 'Good — canvas very durable but scratches show' },
    { metric: 'Who buys pre-owned', hermes: 'Status-driven + investment buyers', goyard: 'Understated taste + scarcity seekers' },
  ] : [
    { metric: 'ก่อตั้ง', hermes: '1837 (ปารีส)', goyard: '1853 (ปารีส)' },
    { metric: 'มรดก', hermes: 'ช่างอานม้าและสายรัด Birkin เกิด 1984', goyard: 'ช่างกล่องเดินทาง รับใช้ Czar Nicholas II, Pablo Picasso' },
    { metric: 'วัสดุ', hermes: 'หนัง (Togo, Epsom, Clemence, Box)', goyard: 'ผ้า Goyardine (วาดลายมือบนผ้าลินิน)' },
    { metric: 'ราคาขายต่อ (เริ่มต้น)', hermes: '฿120,000+ (Herbag, Picotin)', goyard: '฿48,000–72,000 (Saint-Louis PM)' },
    { metric: 'ขายต่อ vs ราคาร้าน', hermes: 'Birkin: 200–500%+ เหนือราคาร้านในช่วงพีค', goyard: 'มักอยู่ที่หรือสูงกว่าราคาร้าน (+0–30%)' },
    { metric: 'หาได้ในไทย', hermes: 'บูติกที่สยามพารากอน ICONSIAM', goyard: 'บูติกที่เอ็มโพเรียม สินค้าน้อยกว่า' },
    { metric: 'การรับรู้ (ตลาดไทย)', hermes: 'สูงมาก — Birkin คือสัญลักษณ์สถานะ', goyard: 'กำลังเติบโต — ชื่นชอบโดยผู้ที่ไม่ชอบโอ้อวด' },
    { metric: 'ความเสี่ยงของปลอม', hermes: 'สูงมาก — โดยเฉพาะ Birkin', goyard: 'สูง — ผ้า Goyardine ถูกปลอมแพร่หลาย' },
    { metric: 'ความทนทาน', hermes: 'ยอดเยี่ยม — หนังเก่าได้อย่างสวยงาม', goyard: 'ดี — ผ้าทนมากแต่รอยขูดเห็นได้' },
    { metric: 'ใครซื้อมือสอง', hermes: 'ผู้ซื้อที่ต้องการสถานะ + นักลงทุน', goyard: 'รสนิยมสุขุม + ผู้ชื่นชอบของหายาก' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Hermès vs Goyard</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Hermès vs Goyard Pre-Owned' : 'Hermès vs Goyard มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both Paris maisons founded within 16 years of each other. Both serve ultra-discerning buyers. But the buyer profile, investment case, and resale market are fundamentally different.'
          : 'ทั้งสองเมซองปารีสก่อตั้งห่างกัน 16 ปี ทั้งคู่รับใช้ผู้ซื้อที่เลือกสรรสูงสุด แต่โปรไฟล์ผู้ซื้อ กรณีการลงทุน และตลาดขายต่อต่างกันโดยพื้นฐาน'}
      </p>

      <ThaiPriceCallout
        slugs={['hermes/evelyne-tpm', 'hermes/garden-party-36']}
        locale={locale}
        title={isEn ? 'Hermes at Thai dealer prices right now' : 'ราคา Hermes ที่ร้านไทยตั้งขายตอนนี้'}
      />

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Hermès</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Goyard</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.hermes}</td>
                <td className="py-3 px-4 text-gray-700">{r.goyard}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h2 className="font-bold text-gray-900 mb-2">{isEn ? 'Buy Hermès if:' : 'ซื้อ Hermès ถ้า:'}</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>→ {isEn ? 'You want the highest-prestige luxury statement' : 'ต้องการกระเป๋าหรูที่มีศักดิ์ศรีสูงสุด'}</li>
            <li>→ {isEn ? 'Investment-grade resale is your priority' : 'การขายต่อระดับลงทุนคือลำดับความสำคัญ'}</li>
            <li>→ {isEn ? 'Budget ฿120,000+' : 'งบ ฿120,000+'}</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h2 className="font-bold text-gray-900 mb-2">{isEn ? 'Buy Goyard if:' : 'ซื้อ Goyard ถ้า:'}</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>→ {isEn ? 'You want luxury without visible logos' : 'ต้องการหรูโดยไม่มีโลโก้ชัดเจน'}</li>
            <li>→ {isEn ? 'Budget ฿48,000–฿100,000' : 'งบ ฿48,000–฿100,000'}</li>
            <li>→ {isEn ? 'You value scarcity and insider recognition' : 'ให้ค่ากับความหายากและการรับรู้ในวงรู้จัก'}</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/hermes-vs-goyard" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/hermes-vs-goyard" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Hermès Pre-Owned →' : 'Hermès มือสอง →'}</Link>
        <Link href={`/${locale}/brands/goyard`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Goyard Pre-Owned →' : 'Goyard มือสอง →'}</Link>
      </div>
    </div>
  )
}
