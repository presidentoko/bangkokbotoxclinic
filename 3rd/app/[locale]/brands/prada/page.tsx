import type { Metadata } from 'next'
import { getItemsByBrand, getAvgPrice, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/prada'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Pre-Owned Prada in Thailand 2025 | ChicPreowned'
      : 'Prada มือสองในไทย: ราคาและแหล่งซื้อ 2025 | ChicPreowned',
    description: isEn
      ? 'Pre-owned Prada prices in Thailand (THB). Galleria, Re-Edition 2000, Cleo — compare second-hand Prada prices by condition.'
      : 'ราคา Prada มือสองในไทย (บาท) Galleria, Re-Edition 2000, Cleo เปรียบเทียบราคาตามสภาพ',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` },
    },
  }
}

const faqsEn = [
  {
    q: 'Is Prada Saffiano leather worth buying pre-owned in Thailand?',
    a: "Absolutely. Saffiano leather's cross-hatch texture resists scratches and ages exceptionally well in Thailand's humid climate — far better than smooth leather. Pre-owned Saffiano pieces in Good condition often look near-new. The Galleria in Saffiano is one of the best pre-owned luxury buys available in Thailand.",
  },
  {
    q: 'Where can I buy pre-owned Prada in Bangkok?',
    a: "Bangkok has a growing pre-owned luxury scene. Check Carousell Thailand for local listings, luxury resellers in Siam Paragon and Emporium, and LINE group marketplaces. For authenticated pieces with guarantees, Vestiaire Collective ships to Thailand within 1–2 weeks.",
  },
  {
    q: 'Which Prada bag is most popular in Thailand?',
    a: 'The Re-Edition 2000 Mini Bag is the most searched Prada item in Thailand — its compact size and nylon construction suit the Bangkok lifestyle. The Galleria in Saffiano is popular among professional buyers. The Cleo has grown significantly in popularity since 2022.',
  },
  {
    q: 'How do I authenticate a pre-owned Prada bag in Thailand?',
    a: "Check the triangle logo plate — authentic Prada plates are solid metal stamped with 'PRADA MILANO DAL 1913'. Post-2019 bags include an authenticity card with QR code. In Thailand, several authenticated luxury platforms and LINE community experts can verify Prada. The stitching should be tight and the interior lining should show a Prada jacquard pattern.",
  },
]

const faqsTh = [
  {
    q: 'หนัง Saffiano ของ Prada คุ้มค่ากับการซื้อมือสองในไทยไหม?',
    a: 'คุ้มค่ามากเลย พื้นผิวตาข่ายของหนัง Saffiano ต้านทานรอยขีดข่วนและเสื่อมสภาพได้ดีเยี่ยมในสภาพอากาศชื้นของไทย — ดีกว่าหนังเรียบมาก Prada มือสองสภาพ Good มักดูเกือบเหมือนใหม่ Galleria ในหนัง Saffiano เป็นหนึ่งในสินค้า luxury มือสองที่ดีที่สุดในไทย',
  },
  {
    q: 'ซื้อ Prada มือสองในกรุงเทพฯ ได้ที่ไหน?',
    a: 'กรุงเทพฯ มีตลาด luxury มือสองที่เติบโตขึ้น ตรวจสอบ Carousell ไทยสำหรับรายการในประเทศ ร้านค้า luxury reseller ใน Siam Paragon และ Emporium และกลุ่มซื้อขาย LINE สำหรับสินค้าที่ผ่านการตรวจสอบพร้อมการรับประกัน Vestiaire Collective ส่งถึงไทยภายใน 1–2 สัปดาห์',
  },
  {
    q: 'กระเป๋า Prada รุ่นไหนได้รับความนิยมมากที่สุดในไทย?',
    a: 'Re-Edition 2000 Mini Bag เป็นสินค้า Prada ที่ค้นหามากที่สุดในไทย ขนาดที่กะทัดรัดและโครงสร้างไนลอนเหมาะกับไลฟ์สไตล์กรุงเทพฯ Galleria ในหนัง Saffiano เป็นที่นิยมในกลุ่มผู้ซื้อระดับมืออาชีพ Cleo เติบโตอย่างมากในด้านความนิยมตั้งแต่ปี 2022',
  },
  {
    q: 'วิธีตรวจสอบกระเป๋า Prada มือสองในไทย?',
    a: "ตรวจสอบแผ่นโลโก้สามเหลี่ยม — แผ่นของแท้เป็นโลหะแข็งที่ประทับว่า 'PRADA MILANO DAL 1913' กระเป๋าหลังปี 2019 มีบัตรรับรองความแท้พร้อม QR code ในไทย แพลตฟอร์ม luxury ที่ผ่านการตรวจสอบและผู้เชี่ยวชาญในชุมชน LINE สามารถยืนยัน Prada ได้ ตะเข็บควรแน่นและซับในควรแสดงลาย jacquard ของ Prada",
  },
]

export default async function PradaThPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const items = getItemsByBrand('prada').filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
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
        {' › Prada'}
      </p>

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">{isEn ? 'Brand Price Guide' : 'ราคาแบรนด์'}</p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? 'Pre-Owned Prada in Thailand 2025' : 'Prada มือสองในไทย: ราคาและแหล่งซื้อ 2025'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">
        {isEn ? `Updated 2025 · ${items.length} models tracked` : `อัปเดต 2025 · ติดตาม ${items.length} รุ่น`}
      </p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {isEn
            ? "Prada's Saffiano leather and nylon pieces are among the most durable in luxury — they survive decades of daily use. The Re-Edition 2005 is the standout resale hit of 2023–24. In Thailand, Prada has a growing pre-owned market driven by younger luxury buyers."
            : "หนัง Saffiano และผลิตภัณฑ์ไนลอนของ Prada เป็นหนึ่งในวัสดุที่ทนทานที่สุดในวงการ luxury สามารถใช้งานได้หลายสิบปี Re-Edition 2005 เป็นสินค้าที่ขายดีที่สุดในตลาดมือสองปี 2023–24 ในไทย Prada มีตลาดมือสองที่เติบโตขึ้น ขับเคลื่อนโดยผู้ซื้อ luxury รุ่นใหม่"}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Pre-Owned Prada Price Table (THB)' : 'ตารางราคา Prada มือสอง (บาท)'}
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
          {isEn ? 'Key Buying Advice' : 'คำแนะนำสำคัญในการซื้อ'}
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          {isEn
            ? "Saffiano leather is Prada's signature — the cross-hatch embossed pattern makes it naturally scratch-resistant. When buying pre-owned, a Good condition Saffiano piece can look nearly new. Prioritize classic black or camel for resale flexibility. The Re-Edition 2000 in nylon is the best value entry into the Prada ecosystem in Thailand."
            : "หนัง Saffiano เป็น signature ของ Prada — ลายตาข่ายนูนทำให้ต้านทานรอยขีดข่วนได้โดยธรรมชาติ เมื่อซื้อมือสอง Saffiano สภาพ Good มักดูเกือบเหมือนใหม่ ให้ความสำคัญกับสีดำหรือสีครีมสำหรับความยืดหยุ่นในการขายต่อ Re-Edition 2000 ในไนลอนเป็นจุดเริ่มต้นที่คุ้มค่าที่สุดสู่ระบบนิเวศ Prada ในไทย"}
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
