import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/chanel'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Chanel Buying Guide Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Chanel มือสองในไทย ${PRICE_YEAR} — คู่มือซื้อ — Classic Flap, Boy Bag, WOC | ChicPreowned`,
    description: isEn
      ? 'Pre-owned Chanel prices in Thailand (THB). Classic Flap, Boy Bag, 2.55, Wallet on Chain — save up to 40% vs current retail. Compare by condition.'
      : 'ราคา Chanel มือสองในไทย (บาท) Classic Flap, Boy Bag, 2.55, WOC — ประหยัดได้ถึง 40% เทียบกับราคาใหม่ เปรียบเทียบตามสภาพ',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Why does Chanel keep raising prices in Thailand?',
    a: 'Chanel has increased global retail prices 20+ times since 2019, with some bags rising over 150% in five years. Thailand prices track global increases via official Chanel boutiques in Bangkok (EmQuartier, ICONSIAM). The consistent price appreciation has made well-maintained pre-owned Chanel bags frequently sell above or equal to their original purchase price, making them strong value-retention assets.',
  },
  {
    q: 'How much does a Chanel Classic Flap cost in Thailand pre-owned?',
    a: 'A pre-owned Chanel Classic Flap Medium in caviar leather in very good condition typically sells for ฿95,000–130,000 on the Thai secondary market (2025). The same bag retails new at approximately ฿180,000–200,000 at Chanel Bangkok, representing a saving of 30–45%.',
  },
  {
    q: 'Where can I buy authentic pre-owned Chanel in Thailand?',
    a: 'The most reliable platforms for Thailand are Vestiaire Collective (international authentication, ships to Thailand), certified luxury resellers in Bangkok (EmQuartier, Central Embassy luxury dealers), and reputable Instagram/Line sellers with established track records. Be very cautious on Carousell Thailand — Chanel fakes are extremely sophisticated and common. Always request authentication certificates.',
  },
  {
    q: 'Caviar or lambskin Chanel — which is better for Thailand\'s climate?',
    a: 'Caviar leather is strongly preferred for Thailand\'s humid climate. The pebbled texture is far more resistant to scratches and moisture than lambskin. Lambskin can soften and develop patina faster in high humidity. For daily use in Bangkok, caviar is the practical choice and also holds resale value better.',
  },
]

const faqsTh = [
  {
    q: 'ทำไม Chanel ถึงขึ้นราคาในไทยตลอด?',
    a: 'Chanel ขึ้นราคาทั่วโลกกว่า 20 ครั้งตั้งแต่ปี 2562 บางรุ่นราคาเพิ่มขึ้นกว่า 150% ใน 5 ปี ราคาไทยติดตามการขึ้นราคาทั่วโลกผ่านบูติค Chanel อย่างเป็นทางการในกรุงเทพฯ (เอ็มควอเทียร์, ไอคอนสยาม) การขึ้นราคาอย่างต่อเนื่องทำให้กระเป๋า Chanel มือสองที่ดูแลดีมักจะขายได้ในราคาเท่ากับหรือสูงกว่าราคาที่ซื้อมา',
  },
  {
    q: 'Chanel Classic Flap มือสองในไทยราคาเท่าไหร่?',
    a: 'Chanel Classic Flap Medium หนัง Caviar สภาพดีมากในตลาดมือสองไทยขายอยู่ที่ประมาณ 95,000–130,000 บาท (2568) กระเป๋าเดียวกันราคาใหม่ประมาณ 180,000–200,000 บาทที่ Chanel กรุงเทพฯ ประหยัดได้ 30–45%',
  },
  {
    q: 'ซื้อ Chanel มือสองแท้ที่ไหนในไทย?',
    a: 'แพลตฟอร์มที่น่าเชื่อถือที่สุดในไทยคือ Vestiaire Collective (ตรวจสอบสากล ส่งมาไทยได้) ดีลเลอร์สินค้าหรูในกรุงเทพฯ (เอ็มควอเทียร์, เซ็นทรัล เอ็มบาสซี) และร้านค้าบน Instagram/Line ที่มีประวัติน่าเชื่อถือ ระวังมากบน Carousell ไทย — ของปลอม Chanel มีความซับซ้อนสูงมากและพบได้บ่อย ควรขอใบรับรองการตรวจสอบเสมอ',
  },
  {
    q: 'หนัง Caviar หรือ Lambskin เหมาะกับสภาพอากาศไทยมากกว่า?',
    a: 'หนัง Caviar เหมาะกับสภาพอากาศชื้นของไทยมากกว่า เนื้อหนังแบบเม็ดเล็กทนทานต่อรอยขีดข่วนและความชื้นได้ดีกว่า Lambskin มาก Lambskin อาจอ่อนตัวและเปลี่ยนสภาพเร็วขึ้นในความชื้นสูง สำหรับการใช้งานประจำวันในกรุงเทพฯ Caviar คือตัวเลือกที่ใช้งานได้จริงและยังรักษามูลค่าได้ดีกว่า',
  },
]

export default async function ChanelBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const faqs = isEn ? faqsEn : faqsTh

  const items = getItemsByBrand('chanel').filter(i => i.retail_price_thb > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: isEn ? 'Pre-Owned Chanel Price Guide Thailand 2025' : 'ราคา Chanel มือสองในไทย 2025',
          url: `${BASE}/${locale}/${SLUG}`,
          numberOfItems: items.length,
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem', position: idx + 1,
            url: `${BASE}/${locale}/${item.slug}`,
            name: isEn ? `Pre-Owned ${item.brand} ${item.model}` : `${item.brand} ${item.model} มือสอง`,
          })),
        })
      }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/handbags`} className="hover:text-gray-800">{isEn ? 'Handbags' : 'กระเป๋า'}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Chanel</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isEn ? `Pre-Owned Chanel in Thailand ${PRICE_YEAR}` : `Chanel มือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-8">
        {isEn
          ? `${items.length} models · prices in THB · save 30–45% vs retail`
          : `${items.length} รุ่น · ราคาในบาท · ประหยัดได้ 30–45% เทียบราคาใหม่`}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
        {isEn
          ? <><strong>Price appreciation note:</strong> Chanel has raised retail prices 20+ times since 2019. Pre-owned Chanel in good condition frequently sells at or above the original purchase price — making it one of the strongest value-retention luxury goods available in Thailand.</>
          : <><strong>หมายเหตุราคา:</strong> Chanel ขึ้นราคาใหม่กว่า 20 ครั้งตั้งแต่ปี 2562 Chanel มือสองสภาพดีมักขายได้ในราคาเท่ากับหรือสูงกว่าราคาที่ซื้อมา ทำให้เป็นสินค้าหรูที่รักษามูลค่าได้ดีที่สุดในไทย</>
        }
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Price Table — Chanel Pre-Owned (THB)' : 'ตารางราคา Chanel มือสอง (บาท)'}
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
          ? <Link href="/th/brands/chanel" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/chanel" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands`} className="text-sm text-gray-500 hover:text-gray-800">
          {isEn ? '← All Brands' : '← แบรนด์ทั้งหมด'}
        </Link>
      </div>
    </div>
  )
}
