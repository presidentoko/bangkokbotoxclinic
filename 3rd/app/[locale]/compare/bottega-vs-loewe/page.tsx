import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/bottega-vs-loewe'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Bottega Veneta vs Loewe Pre-Owned Thailand ${PRICE_YEAR} | ChicPreowned`
      : 'Bottega Veneta vs Loewe: Quiet Luxury ตัวไหนดีกว่า? | ChicPreowned',
    description: isEn
      ? `Bottega Veneta vs Loewe pre-owned in Thailand ${PRICE_YEAR}: intrecciato vs Puzzle — two quiet luxury giants compared.`
      : `Bottega Veneta vs Loewe มือสองในไทย ${PRICE_YEAR}: intrecciato vs Puzzle — สอง quiet luxury giants เปรียบเทียบกัน`,
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Does Bottega Veneta or Loewe hold value better in Thailand?',
    a: 'Bottega Veneta has a more established secondary market in Thailand with better liquidity. Lee-era BV pieces (Jodie, Cassette, Pouch) have collector demand. Loewe is less liquid in the Thai market but the Puzzle bag holds value well in classic colors — estimated 55–70% retention.',
  },
  {
    q: 'Is the Loewe Puzzle available pre-owned in Thailand?',
    a: 'Yes, but supply is limited on local platforms. Carousell Thailand occasionally has Puzzle listings. Vestiaire Collective has better Loewe selection and ships to Thailand. Expect to pay ฿35,000–฿75,000 for a Puzzle Small in Very Good condition.',
  },
  {
    q: 'Which brand is better for the quiet luxury aesthetic in Thailand?',
    a: "Both serve the quiet luxury buyer. BV's intrecciato is completely logo-free — it communicates wealth through craft alone. Loewe uses the subtle Anagram hardware logo. For maximum discretion, BV wins. For architectural interest and versatility, Loewe's Puzzle (with 6 carry configurations) is remarkable.",
  },
  {
    q: "Are Bottega Veneta bags worth buying pre-owned in Thailand's humidity?",
    a: "Yes, but with care. BV's nappa leather can absorb moisture, so avoid carrying in heavy rain. Store with silica gel sachets in Bangkok's humid season. The intrecciato weave is actually more moisture-resilient than solid leather as the gaps allow air circulation.",
  },
]

const faqsTh = [
  {
    q: 'Bottega Veneta หรือ Loewe รักษามูลค่าได้ดีกว่าในไทย?',
    a: 'Bottega Veneta มีตลาดมือสองที่มั่นคงกว่าในไทยพร้อมสภาพคล่องที่ดีกว่า ชิ้นงานยุค Lee (Jodie, Cassette, Pouch) มีความต้องการจากนักสะสม Loewe มีสภาพคล่องน้อยกว่าในตลาดไทย แต่ Puzzle bag รักษามูลค่าได้ดีในสีคลาสสิก — ประมาณ 55–70% การรักษามูลค่า',
  },
  {
    q: 'มี Loewe Puzzle มือสองในไทยไหม?',
    a: 'มี แต่ซัพพลายจำกัดบนแพลตฟอร์มในประเทศ Carousell ไทยมีประกาศ Puzzle เป็นครั้งคราว Vestiaire Collective มีตัวเลือก Loewe ที่ดีกว่าและส่งถึงไทย คาดว่าจะจ่าย ฿35,000–฿75,000 สำหรับ Puzzle Small สภาพ Very Good',
  },
  {
    q: 'แบรนด์ไหนเหมาะกับ aesthetic ของ quiet luxury ในไทยมากกว่า?',
    a: 'ทั้งสองรองรับผู้ซื้อ quiet luxury การทอ intrecciato ของ BV ปราศจากโลโก้โดยสิ้นเชิง สื่อสารความมั่งคั่งผ่านฝีมือเพียงอย่างเดียว Loewe ใช้โลโก้ฮาร์ดแวร์ Anagram ที่ละเอียดอ่อน สำหรับความเป็นส่วนตัวสูงสุด BV ชนะ สำหรับความน่าสนใจทางสถาปัตยกรรมและความหลากหลาย Puzzle ของ Loewe (มี 6 รูปแบบการถือ) น่าทึ่งมาก',
  },
  {
    q: 'กระเป๋า Bottega Veneta คุ้มค่ากับการซื้อมือสองในความชื้นของไทยไหม?',
    a: 'ใช่ แต่ต้องดูแล หนัง nappa ของ BV สามารถดูดซับความชื้นได้ ดังนั้นหลีกเลี่ยงการพกพาในฝนหนัก เก็บพร้อมถุงซิลิกาเจลในช่วงฤดูชื้นของกรุงเทพฯ การทอ intrecciato จริงๆ แล้วต้านความชื้นได้ดีกว่าหนังแผ่นเพราะช่องว่างช่วยให้อากาศหมุนเวียนได้',
  },
]

export default async function BottegaVsLoeweThPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const faqs = isEn ? faqsEn : faqsTh

  const bvItems = getItemsByBrand('bottega-veneta').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
  const loeweItems = getItemsByBrand('loewe').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)

  function getStats(items: typeof bvItems) {
    if (!items.length) return { count: 0, avgRetentionPct: 0 }
    const count = items.length
    const avgRetentionPct = Math.round(
      items.reduce((sum, i) => sum + (getAvgPrice(i.price_ranges.very_good!) / i.retail_price_thb) * 100, 0) / count
    )
    return { count, avgRetentionPct }
  }

  const bvStats = getStats(bvItems)
  const loeweStats = getStats(loeweItems)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  function renderItems(items: typeof bvItems, brandSlug: string, brandLabel: string, retainLabel: string) {
    const top5 = [...items].sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!)).slice(0, 5)
    return (
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-serif text-2xl text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
            {brandLabel}
          </h2>
          {items.length > 0 && (
            <span className="text-sm text-[#B8954A] font-medium">{retainLabel}</span>
          )}
        </div>
        {top5.length === 0 ? (
          <p className="text-sm text-[#9C8B7A] italic">{isEn ? 'Price data coming soon' : 'ข้อมูลราคากำลังจะมาเร็วๆ นี้'}</p>
        ) : (
          <div className="space-y-3">
            {top5.map(item => {
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
        <div className="mt-4">
          <a href={`/${locale}/${brandSlug}`} className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
            {isEn ? `View all ${brandLabel} →` : `ดูทั้งหมด ${brandLabel} →`}
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <p className="text-sm text-[#9C8B7A] mb-3">
        <a href={`/${locale}`} className="hover:text-[#B8954A] transition-colors">{isEn ? 'Home' : 'หน้าหลัก'}</a>
        {' › '}
        {isEn ? 'Compare' : 'เปรียบเทียบ'}
        {' › Bottega Veneta vs Loewe'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? 'Bottega Veneta vs Loewe Pre-Owned Thailand {PRICE_YEAR}' : 'Bottega Veneta vs Loewe: Quiet Luxury ตัวไหนดีกว่า?'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">{isEn ? 'Updated {PRICE_YEAR} · Thailand market' : 'อัปเดต 2025 · ตลาดไทย'}</p>

      <p className="text-[#6B6052] mb-10 leading-relaxed max-w-2xl">
        {isEn
          ? "Both Bottega Veneta and Loewe define the quiet luxury aesthetic — logo-free craftsmanship over brand signaling. In Thailand, BV has an established pre-owned market. Loewe is gaining momentum with the Puzzle bag emerging as a cult favourite."
          : "ทั้ง Bottega Veneta และ Loewe นิยาม aesthetic ของ quiet luxury — ฝีมือที่ปราศจากโลโก้มากกว่าการส่งสัญญาณแบรนด์ ในไทย BV มีตลาดมือสองที่มั่นคง Loewe กำลังได้รับแรงผลักดันโดยมี Puzzle bag กลายเป็นที่ชื่นชอบอย่างสุดๆ"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {renderItems(bvItems, 'bottega-veneta', 'Bottega Veneta', isEn ? `${bvStats.avgRetentionPct}% retained` : `รักษามูลค่า ${bvStats.avgRetentionPct}%`)}
        {renderItems(loeweItems, 'loewe', 'Loewe', isEn ? `${loeweStats.avgRetentionPct}% retained` : `รักษามูลค่า ${loeweStats.avgRetentionPct}%`)}
      </div>

      <section className="mb-14 p-6 bg-[#F5F0EB] border border-[#E8E2D9]">
        <h2 className="font-serif text-xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Key Differences' : 'ความแตกต่างหลัก'}
        </h2>
        <div className="space-y-4 text-sm text-[#6B6052]">
          <div className="border-l-2 border-[#B8954A] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Secondary Market' : 'ตลาดมือสอง'}</p>
            <p>{isEn ? 'BV has better liquidity in Thailand. Loewe growing.' : 'BV มีสภาพคล่องดีกว่าในไทย Loewe กำลังเติบโต'}</p>
          </div>
          <div className="border-l-2 border-[#E8E2D9] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Craft' : 'ฝีมือ'}</p>
            <p>{isEn ? 'BV intrecciato weave vs Loewe 16-piece Puzzle construction.' : 'การทอ intrecciato ของ BV vs โครงสร้าง Puzzle 16 ชิ้นของ Loewe'}</p>
          </div>
          <div className="border-l-2 border-[#E8E2D9] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">{isEn ? 'Logo' : 'โลโก้'}</p>
            <p>{isEn ? 'BV completely logo-free. Loewe has subtle Anagram hardware.' : 'BV ปราศจากโลโก้โดยสิ้นเชิง Loewe มีฮาร์ดแวร์ Anagram ที่ละเอียดอ่อน'}</p>
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
