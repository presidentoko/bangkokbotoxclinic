import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/hermes-vs-bottega'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Hermès vs Bottega Veneta Pre-Owned Thailand ${PRICE_YEAR} | ChicPreowned`
      : 'Hermès vs Bottega Veneta: Quiet Luxury อันไหนคุ้มค่ากว่า? | ChicPreowned',
    description: isEn
      ? 'Hermès trades above retail; Bottega Veneta below. Compare quiet luxury pre-owned values in Thailand for both brands.'
      : 'Hermès ราคาเกินของใหม่ Bottega Veneta ต่ำกว่าของใหม่ เปรียบเทียบมูลค่า quiet luxury มือสองในไทย',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: {
        en: `${BASE}/en/${SLUG}`,
        th: `${BASE}/th/${SLUG}`,
        'x-default': `${BASE}/en/${SLUG}`,
      },
    },
  }
}

const faqsEn = [
  {
    q: 'Hermès vs Bottega Veneta — which is the better quiet luxury investment?',
    a: "Hermès wins on investment return — Birkin and Kelly bags regularly trade 20–80% above retail. Bottega Veneta typically retains 50–70% of retail. If investment is the primary goal, Hermès is superior. If style and wearability at a more accessible price point matters, Bottega's Cassette and Jodie bags offer excellent pre-owned value.",
  },
  {
    q: 'Which brand is more recognisable without a logo — Hermès or Bottega Veneta?',
    a: 'Both are stealth luxury brands — no visible logos. Hermès is recognised by its colour (Hermès orange), distinctive silhouettes (Birkin, Kelly), and the Sellier stitch. Bottega Veneta is recognised by its iconic Intrecciato woven leather. Among those who know, both signal extreme wealth. Among non-fashion audiences, neither is recognisable.',
  },
  {
    q: 'What is the entry price for pre-owned Hermès and Bottega in Thailand?',
    a: 'Pre-owned Bottega Veneta accessories (cardholders, small pouches) start from ฿8,000–฿15,000. Jodie Small bags from ฿45,000. Hermès entry-level pre-owned starts higher: Twilly scarves from ฿5,000, Calvi cardholders from ฿10,000, but handbags start from ฿80,000+ for Evelyne and Garden Party.',
  },
  {
    q: 'Should I buy Hermès or Bottega Veneta first?',
    a: "Buy Bottega first if you're new to luxury — better value per baht, more accessible price points, and styles for everyday wear. Buy Hermès first if you want the strongest investment piece and can access pieces above ฿150,000. The two brands are complementary: BV for daily use, Hermès for special occasions and investment.",
  },
]

const faqsTh = [
  {
    q: 'Hermès vs Bottega Veneta — อันไหนเป็นการลงทุน quiet luxury ที่ดีกว่า?',
    a: 'Hermès ชนะในแง่ผลตอบแทนการลงทุน — กระเป๋า Birkin และ Kelly ซื้อขายเหนือราคาใหม่ 20–80% อย่างสม่ำเสมอ Bottega Veneta มักรักษามูลค่าไว้ 50–70% ของราคาใหม่ ถ้าการลงทุนเป็นเป้าหมายหลัก Hermès เหนือกว่า ถ้าสไตล์และความสวมใส่ในราคาที่เข้าถึงได้มากกว่าสำคัญกว่า กระเป๋า Cassette และ Jodie ของ Bottega มีมูลค่ามือสองที่ยอดเยี่ยม',
  },
  {
    q: 'แบรนด์ไหนเป็นที่รู้จักมากกว่าโดยไม่มีโลโก้ — Hermès หรือ Bottega Veneta?',
    a: 'ทั้งคู่เป็นแบรนด์ stealth luxury — ไม่มีโลโก้ที่มองเห็นได้ Hermès เป็นที่รู้จักจากสี (ส้ม Hermès) ซิลลูเอตที่โดดเด่น (Birkin, Kelly) และการเย็บ Sellier Bottega Veneta เป็นที่รู้จักจากหนังทอ Intrecciato อันเป็นเอกลักษณ์ สำหรับผู้รู้ ทั้งคู่แสดงถึงความมั่งคั่งสูงสุด สำหรับผู้ที่ไม่ใช่แฟชั่น ไม่มีฝ่ายใดที่เป็นที่รู้จัก',
  },
  {
    q: 'ราคาเริ่มต้นของ Hermès และ Bottega มือสองในไทยเท่าไหร่?',
    a: 'อุปกรณ์เสริม Bottega Veneta มือสอง (card holder, กระเป๋าเล็ก) เริ่มต้นที่ ฿8,000–฿15,000 กระเป๋า Jodie Small จาก ฿45,000 มือสอง Hermès ระดับเริ่มต้นราคาสูงกว่า: ผ้าพันคอ Twilly จาก ฿5,000, Calvi card holder จาก ฿10,000 แต่กระเป๋าถือเริ่มต้นที่ ฿80,000+ สำหรับ Evelyne และ Garden Party',
  },
  {
    q: 'ควรซื้อ Hermès หรือ Bottega Veneta ก่อน?',
    a: 'ซื้อ Bottega ก่อนถ้าคุณเพิ่งเริ่มต้นกับ luxury — คุ้มค่าต่อบาทมากกว่า ราคาเข้าถึงได้มากกว่า และสไตล์สำหรับการใช้งานประจำวัน ซื้อ Hermès ก่อนถ้าต้องการชิ้นงานการลงทุนที่แข็งแกร่งที่สุดและเข้าถึงชิ้นงานเกิน ฿150,000 ได้ ทั้งสองแบรนด์เสริมกัน: BV สำหรับใช้งานประจำวัน Hermès สำหรับโอกาสพิเศษและการลงทุน',
  },
]

export default async function HermesVsBottegaPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const hermesItems = getItemsByBrand('hermes').filter(i => i.price_ranges?.very_good)
  const bottegaItems = getItemsByBrand('bottega-veneta').filter(i => i.price_ranges?.very_good)

  const faqs = isEn ? faqsEn : faqsTh

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const renderItems = (items: ReturnType<typeof getItemsByBrand>, brandName: string, taglineEn: string, taglineTh: string, aboveRetail?: boolean) => (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-2xl text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
          {brandName}
        </h2>
        <span className={`text-sm font-medium ${aboveRetail ? 'text-[#B8954A]' : 'text-[#4A7A35]'}`}>
          {isEn ? taglineEn : taglineTh}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[#9C8B7A]">{isEn ? 'Price data loading…' : 'กำลังโหลดข้อมูลราคา…'}</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map(item => {
            const vg = item.price_ranges.very_good!
            const avg = getAvgPrice(vg)
            return (
              <a
                key={item.id}
                href={`/${locale}/${item.slug}`}
                className="group flex items-center justify-between p-4 border border-[#E8E2D9] bg-white hover:border-[#B8954A] transition-colors"
              >
                <div>
                  <p className="text-xs text-[#9C8B7A] uppercase tracking-wider">{item.brand}</p>
                  <p className="text-[#1A1A1A] font-medium group-hover:text-[#8C7355] transition-colors">{item.model}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#B8954A] font-medium">{formatPriceTHB(avg)}</p>
                  <p className="text-xs text-[#9C8B7A]">{isEn ? 'Very Good avg' : 'เฉลี่ย VG'}</p>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <p className="text-sm text-[#9C8B7A] mb-3">
        <a href={`/${locale}`} className="hover:text-[#B8954A] transition-colors">{isEn ? 'Home' : 'หน้าหลัก'}</a>
        {' › '}
        {isEn ? 'Compare' : 'เปรียบเทียบ'}
        {' › Hermès vs Bottega Veneta'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn
          ? `Hermès vs Bottega Veneta Pre-Owned Thailand ${PRICE_YEAR}`
          : 'Hermès vs Bottega Veneta: Quiet Luxury อันไหนคุ้มค่ากว่า?'}
      </h1>

      <p className="text-[#6B6052] mb-10 leading-relaxed max-w-2xl">
        {isEn
          ? 'Both are the ultimate quiet luxury brands — no logos, no branding, pure material and craft. But they behave very differently on the secondary market. Hermès trades above retail (20–80% premium); Bottega Veneta trades below (50–70% of retail). Here is what that means for buyers in Thailand.'
          : 'ทั้งคู่เป็นแบรนด์ quiet luxury สูงสุด — ไม่มีโลโก้ ไม่มีการสร้างแบรนด์ บริสุทธิ์ด้วยวัสดุและงานฝีมือ แต่ทั้งคู่ประพฤติตัวแตกต่างกันมากในตลาดมือสอง Hermès ซื้อขายเกินราคาใหม่ (พรีเมียม 20–80%) Bottega Veneta ซื้อขายต่ำกว่า (50–70% ของราคาใหม่) นี่คือความหมายสำหรับผู้ซื้อในไทย'}
      </p>

      <ThaiPriceCallout
        slugs={['hermes/evelyne-tpm', 'hermes/garden-party-36', 'bottega-veneta/cassette-bag', 'bottega-veneta/mini-pouch']}
        locale={locale}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {renderItems(hermesItems, 'Hermès', '20–80% above retail', 'เกินราคาใหม่ 20–80%', true)}
        {renderItems(bottegaItems, 'Bottega Veneta', '50–70% of retail', '50–70% ของราคาใหม่', false)}
      </div>

      <section className="mb-14 p-6 bg-[#F5F0EB] border border-[#E8E2D9]">
        <h2 className="font-serif text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Buy Decision Guide' : 'คู่มือการตัดสินใจซื้อ'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#6B6052]">
          <div>
            <p className="font-medium text-[#1A1A1A] mb-2">{isEn ? 'Buy Hermès if…' : 'ซื้อ Hermès ถ้า…'}</p>
            <ul className="space-y-1.5">
              <li>{'→ '}{isEn ? 'Investment value is your priority' : 'มูลค่าการลงทุนคือสิ่งสำคัญ'}</li>
              <li>{'→ '}{isEn ? 'You can access budget above ฿150,000' : 'เข้าถึงงบเกิน ฿150,000 ได้'}</li>
              <li>{'→ '}{isEn ? 'You want the most iconic status symbol' : 'ต้องการสัญลักษณ์ status ที่โดดเด่นที่สุด'}</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-[#1A1A1A] mb-2">{isEn ? 'Buy Bottega if…' : 'ซื้อ Bottega ถ้า…'}</p>
            <ul className="space-y-1.5">
              <li>{'→ '}{isEn ? 'Style and wearability matter more than ROI' : 'สไตล์และการสวมใส่สำคัญกว่า ROI'}</li>
              <li>{'→ '}{isEn ? 'You want everyday quiet luxury under ฿80,000' : 'ต้องการ quiet luxury ประจำวันต่ำกว่า ฿80,000'}</li>
              <li>{'→ '}{isEn ? 'The Intrecciato weave speaks to your aesthetic' : 'งานทอ Intrecciato ตรงกับสไตล์คุณ'}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#E8E2D9] pb-6">
              <h3 className="text-[#1A1A1A] font-medium mb-2">{faq.q}</h3>
              <p className="text-[#6B6052] text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
