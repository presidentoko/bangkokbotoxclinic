import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/saint-laurent-vs-celine'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Saint Laurent vs Celine: Which to Buy Pre-Owned in Thailand ${PRICE_YEAR}?`
      : `Saint Laurent vs Celine: ซื้อมือสองอันไหนดีในไทย ${PRICE_YEAR}?`,
    description: isEn
      ? 'Compare pre-owned Saint Laurent vs Celine in Thailand. Price, value retention, resale, and style — which is right for your lifestyle and budget?'
      : 'เปรียบเทียบ Saint Laurent vs Celine มือสองในไทย ราคา มูลค่า และสไตล์ — อะไรเหมาะกับไลฟ์สไตล์และงบของคุณ?',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

export default async function SaintLaurentVsCelinePage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Creative director (2025)', sl: 'Anthony Vaccarello', celine: 'Hedi Slimane' },
    { aspect: 'Aesthetic', sl: 'Rock-edgy, French girl, Parisian cool', celine: 'Minimalist, intellectual, effortless chic' },
    { aspect: 'Most iconic bag', sl: 'Loulou / Kate Tassel', celine: 'Luggage Tote / Belt Bag / Triomphe' },
    { aspect: 'Pre-owned price range (THB)', sl: '฿22,000–80,000', celine: '฿25,000–120,000' },
    { aspect: 'Value retention', sl: '55–70% of current retail', celine: '60–75% of current retail' },
    { aspect: 'Resale liquidity in Thailand', sl: 'High — Loulou very popular', celine: 'Strong — Belt Bag top-searched' },
    { aspect: 'Entry bag', sl: 'Kate clutch / WOC (~฿22,000)', celine: 'Small Classic Box (~฿25,000)' },
    { aspect: 'Logo visibility', sl: 'YSL logo prominent', celine: 'Logo minimal or absent on older designs' },
  ] : [
    { aspect: 'ผู้อำนวยการสร้างสรรค์ (2568)', sl: 'Anthony Vaccarello', celine: 'Hedi Slimane' },
    { aspect: 'สไตล์', sl: 'ร็อค เท่ สไตล์สาวฝรั่งเศส', celine: 'มินิมอล ปัญญาชน เชิ้ตไม่ต้องพยายาม' },
    { aspect: 'กระเป๋าที่โด่งดังที่สุด', sl: 'Loulou / Kate Tassel', celine: 'Luggage Tote / Belt Bag / Triomphe' },
    { aspect: 'ช่วงราคามือสอง (บาท)', sl: '22,000–80,000 บาท', celine: '25,000–120,000 บาท' },
    { aspect: 'การรักษามูลค่า', sl: '55–70% ของราคาปลีกปัจจุบัน', celine: '60–75% ของราคาปลีกปัจจุบัน' },
    { aspect: 'สภาพคล่องขายต่อในไทย', sl: 'สูง — Loulou นิยมมาก', celine: 'แข็งแกร่ง — Belt Bag ค้นหามากที่สุด' },
    { aspect: 'กระเป๋าเริ่มต้น', sl: 'Kate clutch / WOC (~22,000 บาท)', celine: 'Small Classic Box (~25,000 บาท)' },
    { aspect: 'ความชัดเจนของโลโก้', sl: 'โลโก้ YSL ชัดเจน', celine: 'โลโก้น้อยหรือไม่มีในดีไซน์เก่า' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/handbags`} className="hover:text-gray-800">{isEn ? 'Handbags' : 'กระเป๋า'}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Saint Laurent vs Celine</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Saint Laurent vs Celine: Pre-Owned in Thailand ${PRICE_YEAR}` : `Saint Laurent vs Celine: มือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two distinct visions of French fashion — both strong on Thailand\'s secondary market.'
          : 'สองวิสัยทัศน์ที่แตกต่างของแฟชั่นฝรั่งเศส — ทั้งคู่แข็งแกร่งในตลาดมือสองไทย'}
      </p>

      <ThaiPriceCallout
        slugs={['celine/ava-mini', 'celine/belt-bag-mini']}
        locale={locale}
        title={isEn ? 'Celine at Thai dealer prices right now' : 'ราคา Celine ที่ร้านไทยตั้งขายตอนนี้'}
      />

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Saint Laurent</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ Rock-edged Parisian cool — instantly recognisable</li>
              <li>✓ Loulou is one of the most demanded bags on Thai resale</li>
              <li>✓ Wide range of styles from practical to evening</li>
              <li>✓ Strong international buyer pool — easy to export-sell</li>
              <li>✗ Quality has received mixed reviews on newer pieces</li>
            </> : <>
              <li>✓ ความเท่ร็อคสไตล์ปารีส — เป็นที่รู้จักทันที</li>
              <li>✓ Loulou คือกระเป๋าที่มีความต้องการมากที่สุดชิ้นหนึ่งในตลาดมือสองไทย</li>
              <li>✓ มีสไตล์หลากหลายตั้งแต่ใช้งานได้จริงถึงสำหรับงานเย็น</li>
              <li>✓ กลุ่มผู้ซื้อนานาชาติที่แข็งแกร่ง — ขายออกต่างประเทศได้ง่าย</li>
              <li>✗ คุณภาพได้รับรีวิวแบบผสมผสานสำหรับชิ้นใหม่กว่า</li>
            </>}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Celine</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>✓ Minimalist, logo-quiet (pre-Slimane) — enduring style</li>
              <li>✓ Belt Bag is one of Thailand's top-searched pre-owned items</li>
              <li>✓ Strong quality reputation — durable hardware and leather</li>
              <li>✓ Slightly stronger value retention than YSL</li>
              <li>✗ Slimane-era pieces more polarising to buyers</li>
            </> : <>
              <li>✓ มินิมอล โลโก้เงียบ (ก่อน Slimane) — สไตล์ที่คงทน</li>
              <li>✓ Belt Bag เป็นหนึ่งในสินค้ามือสองที่ค้นหามากที่สุดในไทย</li>
              <li>✓ ชื่อเสียงด้านคุณภาพที่แข็งแกร่ง — ฮาร์ดแวร์และหนังทนทาน</li>
              <li>✓ การรักษามูลค่าดีกว่า YSL เล็กน้อย</li>
              <li>✗ ชิ้นสมัย Slimane ได้รับความคิดเห็นแตกต่างกันมากขึ้น</li>
            </>}
          </ul>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Comparison Table' : 'ตารางเปรียบเทียบ'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'ด้าน'}</th>
                <th className="text-left py-3 px-4 font-semibold">Saint Laurent</th>
                <th className="text-left py-3 px-4 font-semibold">Celine</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.sl}</td>
                  <td className="py-3 px-4 text-gray-600">{row.celine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {isEn ? 'Choose Saint Laurent if:' : 'เลือก Saint Laurent ถ้า:'}
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>• You love the rock-chic, Parisian-girl aesthetic</li>
              <li>• Budget is ฿25,000–50,000 for a great everyday bag</li>
              <li>• You want the Loulou or Kate — universally loved designs</li>
              <li>• You prefer statement hardware (gold chains, tassel)</li>
            </> : <>
              <li>• คุณชอบสไตล์ร็อค-ชิค สาวปารีส</li>
              <li>• งบประมาณ 25,000–50,000 บาทสำหรับกระเป๋าใช้ทุกวันที่ยอดเยี่ยม</li>
              <li>• คุณต้องการ Loulou หรือ Kate — ดีไซน์ที่ทุกคนชื่นชอบ</li>
              <li>• ชอบฮาร์ดแวร์ที่โดดเด่น (โซ่ทอง, พู่)</li>
            </>}
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {isEn ? 'Choose Celine if:' : 'เลือก Celine ถ้า:'}
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            {isEn ? <>
              <li>• You prefer quiet luxury — no visible logos</li>
              <li>• You want a professional bag that works for work and weekend</li>
              <li>• You love the Belt Bag silhouette (still the most searched)</li>
              <li>• Budget is ฿30,000–80,000 for a versatile, lasting piece</li>
            </> : <>
              <li>• ชอบ quiet luxury — ไม่มีโลโก้ที่มองเห็นชัดเจน</li>
              <li>• ต้องการกระเป๋าที่เป็นมืออาชีพที่ใช้ได้ทั้งทำงานและวันหยุด</li>
              <li>• ชื่นชอบรูปทรง Belt Bag (ยังคงเป็นที่ค้นหามากที่สุด)</li>
              <li>• งบประมาณ 30,000–80,000 บาทสำหรับชิ้นที่หลากหลายและคงทน</li>
            </>}
          </ul>
        </div>
      </section>

      <div className="flex gap-4 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/saint-laurent-vs-celine" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/saint-laurent-vs-celine" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/saint-laurent`} className="text-sm text-gray-500 hover:text-gray-800">
          {isEn ? 'Saint Laurent Prices →' : 'ราคา Saint Laurent →'}
        </Link>
        <Link href={`/${locale}/brands/celine`} className="text-sm text-gray-500 hover:text-gray-800">
          {isEn ? 'Celine Prices →' : 'ราคา Celine →'}
        </Link>
      </div>
    </div>
  )
}
