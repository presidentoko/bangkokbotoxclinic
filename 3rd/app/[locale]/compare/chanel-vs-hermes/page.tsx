import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/chanel-vs-hermes'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Chanel vs Hermès Pre-Owned in Thailand 2025 | ChicPreowned'
      : 'Chanel vs Hermès: ซื้อมือสองอันไหนดีกว่าในไทย? | ChicPreowned',
    description: isEn
      ? 'Both trade above retail. Chanel from ฿80k, Hermès Birkin from ฿250k used. Compare the two strongest luxury resale brands in Thailand.'
      : 'ทั้งคู่ราคาเกินของใหม่ Chanel เริ่มที่ ฿80k, Birkin จาก ฿250k มือสอง เปรียบเทียบสองแบรนด์ขายต่อที่แข็งแกร่งที่สุดในไทย',
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
    q: 'Chanel vs Hermès — which holds its value better pre-owned?',
    a: "Hermès edges ahead on pure value retention. Birkin 25 and 30 regularly trade 30–80% above retail. Chanel Classic Flap and Boy Bag trade 5–30% above retail. Both are exceptional — they are the only two mainstream luxury brands where pre-owned prices consistently exceed boutique retail. For most buyers, Chanel offers a lower entry barrier at similar premium return.",
  },
  {
    q: 'What is the cheapest way to enter Chanel vs Hermès pre-owned in Thailand?',
    a: 'Chanel is significantly more accessible. Chanel WOC (Wallet on Chain) starts from approximately ฿80,000 pre-owned — a genuine Chanel piece at a fraction of the Birkin price. Hermès entry through handbags starts at ฿80,000+ for Evelyne or Garden Party, but these do not carry the same investment premium. The first true Hermès investment piece (Constance, Kelly Mini) starts around ฿250,000 pre-owned.',
  },
  {
    q: 'Which is harder to find pre-owned — Chanel or Hermès?',
    a: "Both are supply-constrained, but for different reasons. Chanel is supply-constrained because demand is very high globally — the platform always has listings, but good-condition pieces sell fast. Hermès is genuinely scarce: there simply are not many pre-owned Birkins available at any given time, especially in specific leathers and colours. Hermès scarcity is more structural.",
  },
  {
    q: 'Is Chanel or Hermès better for a first pre-owned luxury purchase in Thailand?',
    a: 'Chanel is better for most first-time luxury buyers in Thailand. The WOC or Mini Flap offers a lower financial commitment while still providing strong resale value and the iconic double-C logo. Hermès requires significantly more capital and carries higher authentication risk due to sophisticated fakes. Once comfortable with luxury buying, upgrading to Hermès makes sense.',
  },
]

const faqsTh = [
  {
    q: 'Chanel vs Hermès — อันไหนรักษามูลค่ามือสองได้ดีกว่า?',
    a: 'Hermès นำหน้าเล็กน้อยในแง่ value retention บริสุทธิ์ Birkin 25 และ 30 ซื้อขายเหนือราคาใหม่ 30–80% อย่างสม่ำเสมอ Chanel Classic Flap และ Boy Bag ซื้อขายเหนือราคาใหม่ 5–30% ทั้งคู่ยอดเยี่ยม — เป็นเพียงสองแบรนด์ luxury กระแสหลักที่ราคามือสองสูงกว่าราคาบูติคอย่างสม่ำเสมอ สำหรับผู้ซื้อส่วนใหญ่ Chanel มีอุปสรรคการเข้าถึงที่ต่ำกว่าในผลตอบแทนพรีเมียมที่ใกล้เคียงกัน',
  },
  {
    q: 'วิธีที่ถูกที่สุดในการเริ่มต้น Chanel vs Hermès มือสองในไทยคืออะไร?',
    a: 'Chanel เข้าถึงได้มากกว่าอย่างมีนัยสำคัญ Chanel WOC (Wallet on Chain) เริ่มต้นประมาณ ฿80,000 มือสอง — เป็น Chanel แท้ในราคาเพียงส่วนหนึ่งของราคา Birkin Hermès เริ่มต้นผ่านกระเป๋าถือที่ ฿80,000+ สำหรับ Evelyne หรือ Garden Party แต่รุ่นเหล่านี้ไม่มีพรีเมียมการลงทุนเดียวกัน ชิ้น Hermès ลงทุนจริงชิ้นแรก (Constance, Kelly Mini) เริ่มต้นประมาณ ฿250,000 มือสอง',
  },
  {
    q: 'อันไหนหายากกว่ามือสอง — Chanel หรือ Hermès?',
    a: 'ทั้งคู่มีข้อจำกัดด้านอุปทาน แต่ด้วยเหตุผลที่ต่างกัน Chanel มีข้อจำกัดเพราะความต้องการสูงมากทั่วโลก — แพลตฟอร์มมีประกาศอยู่เสมอ แต่ชิ้นในสภาพดีขายได้เร็ว Hermès ขาดแคลนจริงๆ: มี Birkin มือสองที่หาได้ในเวลาใดก็ตามน้อยมาก โดยเฉพาะในหนังและสีเฉพาะ ความขาดแคลนของ Hermès เป็นเชิงโครงสร้างมากกว่า',
  },
  {
    q: 'Chanel หรือ Hermès ดีกว่าสำหรับการซื้อ luxury มือสองครั้งแรกในไทย?',
    a: 'Chanel ดีกว่าสำหรับผู้ซื้อ luxury ครั้งแรกส่วนใหญ่ในไทย WOC หรือ Mini Flap มีภาระทางการเงินที่ต่ำกว่าในขณะที่ยังคงให้มูลค่าขายต่อที่แข็งแกร่งและโลโก้ double-C อันเป็นเอกลักษณ์ Hermès ต้องการเงินทุนมากกว่าอย่างมีนัยสำคัญและมีความเสี่ยงในการตรวจสอบสูงกว่าเนื่องจากของปลอมที่ซับซ้อน เมื่อคุ้นเคยกับการซื้อ luxury แล้ว การอัปเกรดเป็น Hermès ก็สมเหตุสมผล',
  },
]

export default async function ChanelVsHermesPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const chanelItems = getItemsByBrand('chanel').filter(i => i.price_ranges?.very_good)
  const hermesItems = getItemsByBrand('hermes').filter(i => i.price_ranges?.very_good)

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

  const renderItems = (items: ReturnType<typeof getItemsByBrand>, brandName: string, taglineEn: string, taglineTh: string) => (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-2xl text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
          {brandName}
        </h2>
        <span className="text-sm text-[#B8954A] font-medium">
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
        {' › Chanel vs Hermès'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn
          ? 'Chanel vs Hermès Pre-Owned in Thailand 2025'
          : 'Chanel vs Hermès: ซื้อมือสองอันไหนดีกว่าในไทย?'}
      </h1>

      <p className="text-[#6B6052] mb-10 leading-relaxed max-w-2xl">
        {isEn
          ? 'The two most investment-grade luxury brands in Thailand — both trade above retail on the secondary market. Chanel is more accessible with entry from ฿80,000; Hermès Birkins start from ฿250,000 used. Here is how to decide between them.'
          : 'สองแบรนด์ luxury ที่เป็นการลงทุนมากที่สุดในไทย — ทั้งคู่ซื้อขายเกินราคาใหม่ในตลาดมือสอง Chanel เข้าถึงได้มากกว่าโดยเริ่มต้นที่ ฿80,000 Hermès Birkin เริ่มต้นที่ ฿250,000 มือสอง นี่คือวิธีตัดสินใจระหว่างทั้งสอง'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {renderItems(chanelItems, 'Chanel', 'From ฿80k · 5–30% above retail', 'เริ่มที่ ฿80k · เกินราคาใหม่ 5–30%')}
        {renderItems(hermesItems, 'Hermès', 'From ฿250k · 20–80% above retail', 'เริ่มที่ ฿250k · เกินราคาใหม่ 20–80%')}
      </div>

      <section className="mb-14 p-6 bg-[#F5F0EB] border border-[#E8E2D9]">
        <h2 className="font-serif text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Buy Decision Guide' : 'คู่มือการตัดสินใจซื้อ'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#6B6052]">
          <div>
            <p className="font-medium text-[#1A1A1A] mb-2">{isEn ? 'Buy Chanel if…' : 'ซื้อ Chanel ถ้า…'}</p>
            <ul className="space-y-1.5">
              <li>{'→ '}{isEn ? 'Budget is ฿80k–฿200k' : 'งบอยู่ที่ ฿80k–฿200k'}</li>
              <li>{'→ '}{isEn ? 'This is your first above-retail luxury purchase' : 'นี่คือการซื้อ luxury เกินราคาใหม่ครั้งแรกของคุณ'}</li>
              <li>{'→ '}{isEn ? 'You want the iconic double-C for daily use' : 'ต้องการ double-C อันเป็นเอกลักษณ์สำหรับใช้งานประจำวัน'}</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-[#1A1A1A] mb-2">{isEn ? 'Buy Hermès if…' : 'ซื้อ Hermès ถ้า…'}</p>
            <ul className="space-y-1.5">
              <li>{'→ '}{isEn ? 'Budget exceeds ฿250,000' : 'งบเกิน ฿250,000'}</li>
              <li>{'→ '}{isEn ? 'Maximum value appreciation is the goal' : 'เป้าหมายคือการแข็งค่าสูงสุด'}</li>
              <li>{'→ '}{isEn ? 'Stealth luxury with no visible logo appeals' : 'ชอบ luxury ที่ไม่มีโลโก้ที่มองเห็น'}</li>
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
