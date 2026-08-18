import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/cartier'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Cartier Buying Guide Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Cartier มือสองในไทย ${PRICE_YEAR} — คู่มือซื้อ — Love Bracelet, Juste un Clou | ChicPreowned`,
    description: isEn
      ? 'Pre-owned Cartier jewelry and watch prices in Thailand (THB). Love Bracelet, Juste un Clou, Trinity, Tank — strong resale, 70–90% value retention.'
      : 'ราคา Cartier มือสองในไทย (บาท) Love Bracelet, Juste un Clou, Trinity, Tank — รักษามูลค่าได้ 70–90%',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Does Cartier jewelry hold value in Thailand pre-owned?',
    a: 'Cartier jewelry shows excellent value retention in the Thai market. The Love Bracelet and Juste un Clou typically sell pre-owned at 75–90% of current retail. Strong name recognition means faster sale times on platforms like Vestiaire Collective and established Bangkok dealers compared to less-known luxury jewelry brands.',
  },
  {
    q: 'How much is a Cartier Love Bracelet pre-owned in Thailand?',
    a: 'A pre-owned Cartier Love Bracelet in 18k yellow gold in very good condition sells for approximately ฿140,000–180,000 in Thailand (2025). Retail price at Cartier Bangkok is approximately ฿220,000–240,000, representing a saving of 20–35%. Rose gold commands similar prices; white gold is slightly lower.',
  },
  {
    q: 'Where to buy pre-owned Cartier in Thailand?',
    a: 'Reputable options in Thailand: Vestiaire Collective (international authentication), Siam Paragon luxury floor dealers, and established Instagram/Line sellers with documented history. Cartier\'s own Cartier Care service can authenticate pieces. Official Cartier boutiques in Bangkok (CentralWorld, ICONSIAM) do not buy back pieces but can verify authenticity with receipt.',
  },
  {
    q: 'What\'s the difference between Cartier Love and Juste un Clou?',
    a: 'The Love Bracelet (1969, Aldo Cipullo) is a bangle that screws shut — the original "love lock" concept. The Juste un Clou (1971, also Cipullo) is a nail-shaped bracelet that wraps around the wrist. Both are iconic. The Love is more widely known globally; the Juste un Clou has a slightly more artistic, avant-garde aesthetic. Both perform similarly on resale.',
  },
]

const faqsTh = [
  {
    q: 'เครื่องประดับ Cartier มือสองรักษามูลค่าได้ดีในไทยไหม?',
    a: 'เครื่องประดับ Cartier แสดงการรักษามูลค่าได้ดีเยี่ยมในตลาดไทย Love Bracelet และ Juste un Clou มักขายมือสองได้ที่ 75–90% ของราคาปลีกปัจจุบัน ชื่อเสียงที่แข็งแกร่งหมายถึงเวลาขายที่เร็วกว่าบนแพลตฟอร์มอย่าง Vestiaire Collective และดีลเลอร์กรุงเทพฯ เมื่อเทียบกับแบรนด์เครื่องประดับหรูที่รู้จักน้อยกว่า',
  },
  {
    q: 'Cartier Love Bracelet มือสองราคาเท่าไหร่ในไทย?',
    a: 'Cartier Love Bracelet ทองคำ 18K สีเหลืองสภาพดีมากขายอยู่ที่ประมาณ 140,000–180,000 บาทในไทย (2568) ราคาใหม่ที่ Cartier กรุงเทพฯ ประมาณ 220,000–240,000 บาท ประหยัดได้ 20–35% ทองคำสีกุหลาบมีราคาใกล้เคียงกัน ทองคำขาวต่ำกว่าเล็กน้อย',
  },
  {
    q: 'ซื้อ Cartier มือสองได้ที่ไหนในไทย?',
    a: 'ตัวเลือกที่น่าเชื่อถือในไทย: Vestiaire Collective (ตรวจสอบสากล) ดีลเลอร์ชั้น luxury ของสยามพารากอน และผู้ขายบน Instagram/Line ที่มีประวัติชัดเจน บริการ Cartier Care ของ Cartier เองสามารถตรวจสอบชิ้นส่วนได้ บูติค Cartier อย่างเป็นทางการในกรุงเทพฯ (เซ็นทรัลเวิลด์, ไอคอนสยาม) ไม่รับซื้อคืน แต่สามารถยืนยันความถูกต้องด้วยใบเสร็จ',
  },
  {
    q: 'ต่างกันยังไงระหว่าง Cartier Love กับ Juste un Clou?',
    a: 'Love Bracelet (1969, Aldo Cipullo) เป็นกำไลที่ล็อคด้วยสกรู — แนวคิด "love lock" ต้นฉบับ Juste un Clou (1971, Cipullo เช่นกัน) เป็นกำไลรูปตะปูที่พันรอบข้อมือ ทั้งคู่เป็นไอคอน Love รู้จักกันอย่างกว้างขวางทั่วโลก Juste un Clou มีความเป็นศิลปะและสไตล์ avant-garde มากกว่าเล็กน้อย ทั้งคู่มีผลงานใกล้เคียงกันในตลาดมือสอง',
  },
]

export default async function CartierBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const faqs = isEn ? faqsEn : faqsTh

  const items = getItemsByBrand('cartier').filter(i => i.retail_price_thb > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: isEn ? 'Pre-Owned Cartier Price Guide Thailand 2025' : 'ราคา Cartier มือสองในไทย 2025',
          url: `${BASE}/${locale}/${SLUG}`,
          numberOfItems: items.length,
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem', position: idx + 1,
            url: `${BASE}/${locale}/${item.slug}`,
            name: isEn ? `Pre-Owned Cartier ${item.model}` : `Cartier ${item.model} มือสอง`,
          })),
        })
      }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/jewelry`} className="hover:text-gray-800">{isEn ? 'Jewelry' : 'เครื่องประดับ'}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Cartier</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isEn ? 'Pre-Owned Cartier in Thailand {PRICE_YEAR}' : 'Cartier มือสองในไทย {PRICE_YEAR}'}
      </h1>
      <p className="text-gray-500 mb-8">
        {isEn ? `${items.length} models · 70–90% value retention` : `${items.length} รุ่น · รักษามูลค่า 70–90%`}
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-sm text-blue-900">
        {isEn
          ? <><strong>Investment-grade resale:</strong> Cartier Love Bracelet and Juste un Clou consistently retain 75–90% of current retail — among the highest retention rates in fine jewelry available in Thailand.</>
          : <><strong>มูลค่าการลงทุน:</strong> Love Bracelet และ Juste un Clou ของ Cartier รักษามูลค่าได้ 75–90% ของราคาปลีกปัจจุบันอย่างสม่ำเสมอ — อยู่ในกลุ่มเครื่องประดับหรูที่รักษามูลค่าได้ดีที่สุดในไทย</>
        }
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Price Table — Cartier Pre-Owned (THB)' : 'ตารางราคา Cartier มือสอง (บาท)'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Model' : 'รุ่น'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Retail (THB)' : 'ราคาใหม่ (บาท)'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Very Good' : 'สภาพดีมาก'}</th>
                <th className="text-right py-3 px-4 font-semibold">{isEn ? 'Good' : 'สภาพดี'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const vg = item.price_ranges?.very_good
                const g = item.price_ranges?.good
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/${locale}/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-600">{item.model}</Link>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-500">{formatPriceTHB(item.retail_price_thb)}</td>
                    <td className="text-right py-3 px-4">{vg ? `${formatPriceTHB(vg.min)}–${formatPriceTHB(vg.max)}` : '—'}</td>
                    <td className="text-right py-3 px-4 text-gray-500">{g ? `${formatPriceTHB(g.min)}–${formatPriceTHB(g.max)}` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {isEn ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}
        </h2>
        <div className="space-y-5">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-5">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-4 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/cartier" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/cartier" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands`} className="text-sm text-gray-500 hover:text-gray-800">
          {isEn ? '← All Brands' : '← แบรนด์ทั้งหมด'}
        </Link>
        <Link href={`/${locale}/compare/cartier-vs-van-cleef`} className="text-sm text-gray-500 hover:text-gray-800">
          {isEn ? 'Cartier vs Van Cleef →' : 'Cartier vs Van Cleef →'}
        </Link>
      </div>
    </div>
  )
}
