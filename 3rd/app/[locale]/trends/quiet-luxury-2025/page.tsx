import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/quiet-luxury-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Quiet Luxury Trend 2025 — Pre-Owned Picks for Thailand | ChicPreowned'
      : 'เทรนด์ Quiet Luxury 2025 — Luxury มือสองสไตล์ไม่โอ้อวด | ChicPreowned',
    description: isEn
      ? 'The old money aesthetic is everywhere. Find pre-owned Bottega Veneta and Celine in Thailand — understated, logo-free luxury at real market prices.'
      : 'สไตล์ "Old Money" กำลังมาแรง ค้นหา Bottega Veneta และ Celine มือสองในไทย — Luxury ไร้โลโก้ในราคาตลาดจริง',
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
    q: 'What is quiet luxury?',
    a: 'Quiet luxury (or the "old money aesthetic") refers to understated, high-quality fashion that avoids loud logos. Think Bottega Veneta intrecciato weave, Celine clean-cut leather, and Hermès minimalism — quality signals itself through craftsmanship, not branding.',
  },
  {
    q: 'Which quiet luxury brands are easiest to find pre-owned in Thailand?',
    a: 'Celine and Bottega Veneta have solid pre-owned supply on Vestiaire Collective with Thailand shipping. Hermès is the hardest to source but the most coveted. Loewe\'s Puzzle Bag is increasingly popular and available on secondary markets.',
  },
  {
    q: 'Is quiet luxury pre-owned a good investment?',
    a: 'Bottega Veneta retains value well (60–75%) and Celine is stable (50–65%). Neither matches Chanel or Rolex for appreciation, but both hold better than fast-fashion alternatives. The main value is cultural capital — wearing pieces that insiders recognise without needing a logo.',
  },
]

const faqsTh = [
  {
    q: 'Quiet Luxury คืออะไร?',
    a: 'Quiet Luxury (หรือสไตล์ "Old Money") หมายถึงแฟชั่นที่มีคุณภาพสูงแต่ไม่โอ้อวด ไม่มีโลโก้ขนาดใหญ่ เช่น ลาย Intrecciato ของ Bottega Veneta หนังตัดสะอาดของ Celine และความเรียบง่ายของ Hermès — คุณภาพแสดงตัวเองผ่านงานฝีมือ ไม่ใช่โลโก้',
  },
  {
    q: 'แบรนด์ Quiet Luxury อะไรที่หาซื้อมือสองได้ง่ายที่สุดในไทย?',
    a: 'Celine และ Bottega Veneta มีซัพพลายมือสองที่ดีบน Vestiaire Collective พร้อมจัดส่งถึงไทย Hermès หายากที่สุดแต่เป็นที่ต้องการมากที่สุด กระเป๋า Puzzle ของ Loewe กำลังได้รับความนิยมเพิ่มขึ้นและหาได้ในตลาดมือสอง',
  },
  {
    q: 'Quiet Luxury มือสองลงทุนคุ้มไหม?',
    a: 'Bottega Veneta รักษามูลค่าได้ดี (60–75%) และ Celine มีเสถียรภาพ (50–65%) ทั้งคู่ไม่ได้มูลค่าเพิ่มเท่า Chanel หรือ Rolex แต่ทั้งคู่รักษาได้ดีกว่าแฟชั่นทั่วไป คุณค่าหลักคือ "cultural capital" — การสวมใส่สิ่งที่คนในวงการรู้จักโดยไม่ต้องมีโลโก้',
  },
]

export default async function QuietLuxury2025Page({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const bottegaItems = getItemsByBrand('bottega-veneta')
  const celineItems = getItemsByBrand('celine')

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

  const ItemCard = ({ item }: { item: (typeof bottegaItems)[number] }) => {
    const vg = item.price_ranges?.very_good
    const avg = vg ? getAvgPrice(vg) : null
    return (
      <a
        href={`/${locale}/${item.slug}`}
        className="group block border border-[#E8E2D9] bg-white hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
      >
        <div className="h-0.5 bg-[#E8E2D9] group-hover:bg-[#B8954A] transition-colors duration-300" />
        <div className="p-5">
          <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-1">{item.brand}</p>
          <h3
            className="font-serif text-lg text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-3 leading-snug"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {item.model}
          </h3>
          {avg !== null ? (
            <div>
              <p className="text-xs text-[#9C8B7A] mb-0.5">{isEn ? 'Avg. Very Good' : 'เฉลี่ย สภาพดีมาก'}</p>
              <p className="text-[#B8954A] font-medium">{formatPriceTHB(avg)}</p>
            </div>
          ) : (
            <p className="text-sm text-[#9C8B7A]">{isEn ? 'Price on request' : 'ติดต่อสอบถามราคา'}</p>
          )}
        </div>
      </a>
    )
  }

  const allItems = [...bottegaItems, ...celineItems]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <p className="text-sm text-[#9C8B7A] mb-3">
        <a href={`/${locale}`} className="hover:text-[#B8954A] transition-colors">{isEn ? 'Home' : 'หน้าหลัก'}</a>
        {' › '}
        {isEn ? 'Trends' : 'เทรนด์'}
        {' › Quiet Luxury 2025'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn
          ? 'Quiet Luxury Trend 2025 — Pre-Owned Picks for Thailand'
          : 'เทรนด์ Quiet Luxury 2025 — Luxury มือสองสไตล์ไม่โอ้อวด'}
      </h1>

      <p className="text-[#6B6052] mb-2 leading-relaxed max-w-2xl">
        {isEn
          ? 'The \'old money aesthetic\' has taken over — understated, logo-free luxury from Bottega Veneta, Celine, and Hermès.'
          : 'เทรนด์ \'ความหรูหราแบบเงียบ\' กำลังมาแรง — Luxury ไร้โลโก้ สไตล์ Bottega Veneta, Celine และ Hermès'}
      </p>
      <p className="text-sm text-[#8C7355] mb-12">
        {isEn ? 'Trend report — June 2025' : 'รายงานเทรนด์ — มิถุนายน 2025'}
      </p>

      <section className="mb-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'What Is Quiet Luxury?' : 'Quiet Luxury คืออะไร?'}
        </h2>
        <div className="text-[#6B6052] leading-relaxed space-y-3 max-w-2xl">
          {isEn ? (
            <>
              <p>Quiet luxury is about wearing pieces that communicate quality without screaming a brand name. The Bottega Veneta Intrecciato weave, the clean lines of a Celine trapeze, the weight of a Hermès leather — these are the signals that matter to those in the know.</p>
              <p>Pre-owned is the smartest entry point: the same pieces, authenticated, at 30–50% below boutique price. The aesthetic is about restraint — buying second-hand fits perfectly.</p>
            </>
          ) : (
            <>
              <p>Quiet Luxury คือการสวมใส่สิ่งที่สื่อถึงคุณภาพโดยไม่ต้องตะโกนชื่อแบรนด์ ลาย Intrecciato ของ Bottega Veneta เส้นสายที่สะอาดของ Celine Trapeze น้ำหนักของหนัง Hermès — เหล่านี้คือสัญญาณที่มีความหมายสำหรับผู้รู้จริง</p>
              <p>มือสองคือจุดเริ่มต้นที่ฉลาดที่สุด: ของชิ้นเดิม ผ่านการรับรอง ในราคาต่ำกว่าบูติค 30–50% ความงามของสไตล์นี้คือความยับยั้งชั่งใจ — การซื้อมือสองเข้ากันอย่างสมบูรณ์</p>
            </>
          )}
        </div>
      </section>

      {bottegaItems.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Bottega Veneta
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {bottegaItems.map(item => <ItemCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {celineItems.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Celine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {celineItems.map(item => <ItemCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {allItems.length === 0 && (
        <div className="py-12 text-center text-[#9C8B7A]">
          <p>{isEn ? 'More items coming soon.' : 'รายการเพิ่มเติมกำลังจะมาในเร็วๆ นี้'}</p>
        </div>
      )}

      <section className="mb-14 p-6 bg-[#F5F0EB] border border-[#E8E2D9]">
        <h2 className="font-serif text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Also Trending: Hermès & Loewe' : 'เทรนด์เพิ่มเติม: Hermès & Loewe'}
        </h2>
        <div className="space-y-3 text-sm text-[#6B6052]">
          <div className="flex items-start gap-3">
            <span className="text-[#B8954A] mt-0.5">→</span>
            <div>
              <p className="font-medium text-[#1A1A1A]">{isEn ? 'Hermès Carré 90' : 'Hermès Carré 90'}</p>
              <p>{isEn ? 'The ultimate quiet luxury accessory. Silk scarf with no visible logo — just unmistakable quality.' : 'อุปกรณ์เสริม Quiet Luxury ระดับสูงสุด ผ้าพันคอไหมที่ไม่มีโลโก้ให้เห็น — แต่คุณภาพที่จำได้ทันที'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#B8954A] mt-0.5">→</span>
            <div>
              <p className="font-medium text-[#1A1A1A]">{isEn ? 'Loewe Puzzle Bag' : 'Loewe Puzzle Bag'}</p>
              <p>{isEn ? 'Architectural leather, minimal branding, Spanish craftsmanship. One of the defining quiet luxury bags of 2024–2025.' : 'หนังแบบสถาปัตยกรรม โลโก้น้อยที่สุด งานฝีมือสเปน หนึ่งในกระเป๋า Quiet Luxury ที่กำหนดเทรนด์ปี 2024–2025'}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`/${locale}/hermes`}
            className="px-4 py-2 border border-[#B8954A] text-[#B8954A] text-sm hover:bg-[#B8954A] hover:text-white transition-colors"
          >
            {isEn ? 'Browse Hermès →' : 'ดู Hermès →'}
          </a>
          <a
            href={`/${locale}/loewe`}
            className="px-4 py-2 border border-[#E8E2D9] text-[#8C7355] text-sm hover:border-[#B8954A] hover:text-[#B8954A] transition-colors"
          >
            {isEn ? 'Browse Loewe →' : 'ดู Loewe →'}
          </a>
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
