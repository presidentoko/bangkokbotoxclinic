import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/bottega-veneta'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Bottega Veneta Buying Guide Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Bottega Veneta มือสองในไทย ${PRICE_YEAR} — คู่มือซื้อ | ChicPreowned`,
    description: isEn
      ? 'Pre-owned Bottega Veneta prices in Thailand (THB). Jodie, Cassette, Arco Tote — compare second-hand BV prices by condition.'
      : 'ราคา Bottega Veneta มือสองในไทย (บาท) Jodie, Cassette, Arco Tote เปรียบเทียบราคาตามสภาพ',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'How do I authenticate Bottega Veneta intrecciato in Thailand?',
    a: "Authentic BV intrecciato has perfectly consistent weave spacing with no loose strands. The leather strips are woven through each other, not glued. In Thailand, several authentication services in Bangkok's luxury shopping districts can inspect the piece. Alternatively, Vestiaire Collective's authentication covers items shipped to Thailand.",
  },
  {
    q: 'What is the best Bottega Veneta bag to buy pre-owned in Thailand?',
    a: 'The Jodie Small and Cassette Bag are the most popular BV pre-owned picks in Thailand. The Jodie offers casual versatility and the intrecciato craftsmanship is clearly visible. The Cassette with its bold plate clasp is more structured. Both are available on Carousell Thailand and international platforms at 40–60% of retail.',
  },
  {
    q: 'Is Bottega Veneta popular in the Thai luxury market?',
    a: 'Yes — BV has grown significantly in Thailand since the Daniel Lee era (2018–2021). The brand resonates with Thai buyers who appreciate quiet luxury without overt logos. Bangkok boutiques have strong BV sales, and the pre-owned market in Thailand reflects this with steady demand on Carousell and LINE groups.',
  },
  {
    q: 'What colorways hold value best for BV in Thailand?',
    a: 'Black, dark brown (fondant), and BV signature green are the most liquid colorways in the Thai market. These colors align with local fashion preferences and are easiest to resell. Bright seasonal colors are harder to move in the Thai market compared to European markets.',
  },
]

const faqsTh = [
  {
    q: 'วิธีตรวจสอบ Bottega Veneta intrecciato ในไทย?',
    a: 'BV intrecciato แท้มีระยะห่างของการทอที่สม่ำเสมออย่างสมบูรณ์แบบ ไม่มีเส้นหนังหลวม แถบหนังถักผ่านกันไม่ใช่กาว ในไทย บริการตรวจสอบหลายแห่งในย่าน luxury ของกรุงเทพฯ สามารถตรวจสอบสินค้าได้ นอกจากนี้ การตรวจสอบของ Vestiaire Collective ครอบคลุมสินค้าที่ส่งถึงไทย',
  },
  {
    q: 'กระเป๋า Bottega Veneta รุ่นไหนควรซื้อมือสองในไทย?',
    a: 'Jodie Small และ Cassette Bag เป็นตัวเลือก BV มือสองที่ได้รับความนิยมมากที่สุดในไทย Jodie มีความหลากหลายในการใช้งานและแสดงฝีมือ intrecciato ได้ชัดเจน Cassette ที่มีที่กดแบบแผ่นมีโครงสร้างมากกว่า ทั้งคู่มีจำหน่ายใน Carousell ไทยและแพลตฟอร์มระหว่างประเทศที่ 40–60% ของราคาใหม่',
  },
  {
    q: 'Bottega Veneta ได้รับความนิยมในตลาด luxury ไทยไหม?',
    a: 'ใช่ — BV เติบโตอย่างมากในไทยตั้งแต่ยุค Daniel Lee (2018–2021) แบรนด์ตอบสนองผู้ซื้อชาวไทยที่ชื่นชอบ quiet luxury โดยไม่มีโลโก้ที่โดดเด่น บูติกในกรุงเทพฯ มียอดขาย BV ที่แข็งแกร่ง และตลาดมือสองในไทยสะท้อนสิ่งนี้ด้วยความต้องการที่สม่ำเสมอบน Carousell และกลุ่ม LINE',
  },
  {
    q: 'สีไหนรักษามูลค่าได้ดีที่สุดสำหรับ BV ในไทย?',
    a: 'สีดำ สีน้ำตาลเข้ม (fondant) และสีเขียว signature ของ BV เป็นสีที่ขายคล่องที่สุดในตลาดไทย สีเหล่านี้สอดคล้องกับความชอบด้านแฟชั่นในท้องถิ่นและขายต่อได้ง่ายที่สุด สีสดใสตามฤดูกาลขายได้ยากกว่าในตลาดไทยเมื่อเทียบกับตลาดยุโรป',
  },
]

export default async function BottegaVenetaThPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const items = getItemsByBrand('bottega-veneta').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <p className="text-sm text-[#9C8B7A] mb-3">
        <a href={`/${locale}`} className="hover:text-[#B8954A] transition-colors">{isEn ? 'Home' : 'หน้าหลัก'}</a>
        {' › '}
        {isEn ? 'Brands' : 'แบรนด์'}
        {' › Bottega Veneta'}
      </p>

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">{isEn ? 'Brand Price Guide' : 'ราคาแบรนด์'}</p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? 'Pre-Owned Bottega Veneta in Thailand {PRICE_YEAR}' : 'Bottega Veneta มือสองในไทย {PRICE_YEAR}'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">
        {isEn ? `Updated {PRICE_YEAR} · ${items.length} models tracked` : `อัปเดต 2025 · ติดตาม ${items.length} รุ่น`}
      </p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {isEn
            ? "Daniel Lee's tenure created the Pouch, Cassette, and Jodie — three pieces that define the stealth luxury era. Pre-owned prices remain close to retail on recent styles. In Thailand, BV has built a devoted following among buyers who prize craftsmanship over logos."
            : "ยุค Daniel Lee สร้าง Pouch, Cassette และ Jodie — สามชิ้นที่นิยามยุค stealth luxury ราคามือสองยังคงใกล้เคียงราคาใหม่สำหรับสไตล์ล่าสุด ในไทย BV สร้างกลุ่มผู้ติดตามที่ภักดีในกลุ่มผู้ซื้อที่ให้คุณค่ากับฝีมือมากกว่าโลโก้"}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Pre-Owned Bottega Veneta Price Table (THB)' : 'ตารางราคา Bottega Veneta มือสอง (บาท)'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Model' : 'รุ่น'}</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Pre-Owned Avg' : 'เฉลี่ยมือสอง'}</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Retail' : 'ราคาใหม่'}</th>
                <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">{isEn ? 'Savings' : 'ประหยัด'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {items.map(item => {
                const vg = item.price_ranges.very_good!
                const avg = getAvgPrice(vg)
                const savingsPct = Math.round((1 - avg / item.retail_price_thb) * 100)
                return (
                  <tr key={item.id}>
                    <td className="py-3 pr-4">
                      <a href={`/${locale}/${item.slug}`} className="text-[#1A1A1A] hover:text-[#B8954A] transition-colors">
                        {item.model}
                      </a>
                    </td>
                    <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{formatPriceTHB(avg)}</td>
                    <td className="py-3 pr-4 text-[#9C8B7A]">{formatPriceTHB(item.retail_price_thb)}</td>
                    <td className={`py-3 font-medium text-sm ${savingsPct > 0 ? 'text-[#4A7A35]' : 'text-[#8C7355]'}`}>
                      {savingsPct > 0 ? `-${savingsPct}%` : `+${Math.abs(savingsPct)}%`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10 p-5 border-l-2 border-[#B8954A] bg-[#FAFAF9]">
        <h2 className="font-serif text-lg text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Authentication Tell' : 'วิธีสังเกตของแท้'}
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          {isEn
            ? 'The intrecciato weave quality is the primary tell. Run your finger along the woven strips — authentic BV uses full-grain nappa that feels buttery. Loose strands or inconsistent spacing indicate wear or a fake. The interior should show clean, tight weave on the lining panels.'
            : 'คุณภาพการทอ intrecciato เป็นสัญญาณหลัก ลากนิ้วไปตามแถบทอ — BV แท้ใช้หนัง nappa เต็มเกรดที่รู้สึกนุ่มลื่น เส้นหลวมหรือระยะห่างที่ไม่สม่ำเสมอบ่งชี้ถึงการสึกหรอหรือของปลอม ภายในควรแสดงการทอที่สะอาดและรัดกุมบนแผงบุด้านใน'}
        </p>
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
