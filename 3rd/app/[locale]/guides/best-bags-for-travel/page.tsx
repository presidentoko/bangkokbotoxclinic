import type { Metadata } from 'next'
import { getItemBySlug, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/best-bags-for-travel'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Best Pre-Owned Luxury Bags for Travel in Thailand ${PRICE_YEAR} | ChicPreowned`
      : `กระเป๋า Luxury มือสองที่ดีที่สุดสำหรับการเดินทาง ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? "Thailand's airports and temples demand a bag that survives both. The best pre-owned travel luxury picks — durable, beautiful, and below retail."
      : 'การเดินทางในไทยต้องการกระเป๋าที่ทนทาน สวยงาม และราคาไม่แพงเกินไป Luxury มือสองคือคำตอบ',
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
    q: 'Can I carry a luxury bag through Thai airport security?',
    a: 'Yes. Place the bag in a tray at security. Monogram canvas and coated canvas bags are unaffected by X-ray screening.',
  },
  {
    q: 'Does Thai humidity damage luxury bags?',
    a: 'Humidity can damage lambskin and smooth leather. Coated canvas (LV Monogram, Gucci GG Supreme) resists moisture far better.',
  },
  {
    q: 'Should I check my luxury bag at the airport?',
    a: 'Never. Always carry luxury bags in the cabin. Checked luggage handling is rough and airlines have liability limits that rarely cover high-value bags.',
  },
  {
    q: 'What is the best bag for temple visits in Thailand?',
    a: 'A compact crossbody like Chanel WOC or Gucci GG Marmont Small — small enough to wear across the body, easy to secure, and requires no digging.',
  },
]

const faqsTh = [
  {
    q: 'พกกระเป๋า Luxury ผ่านด่านรักษาความปลอดภัยในสนามบินไทยได้ไหม?',
    a: 'ได้ วางกระเป๋าในถาดที่ด่านตรวจ ผ้าใบ Monogram และผ้าใบเคลือบไม่ได้รับผลกระทบจากการสแกน X-ray',
  },
  {
    q: 'ความชื้นในไทยทำลายกระเป๋า Luxury ไหม?',
    a: 'ความชื้นอาจทำลายหนัง lambskin และหนังเรียบ ผ้าใบเคลือบ เช่น LV Monogram และ Gucci GG Supreme ต้านทานความชื้นได้ดีกว่ามาก',
  },
  {
    q: 'ควรโหลดกระเป๋า Luxury ใส่ท้องเครื่องไหม?',
    a: 'ไม่ควรเด็ดขาด ควรพกกระเป๋า Luxury ขึ้นห้องโดยสารเสมอ กระเป๋าโหลดถูกจัดการอย่างหยาบ และสายการบินมีวงจำกัดค่าชดเชยที่ไม่ครอบคลุมกระเป๋ามูลค่าสูง',
  },
  {
    q: 'กระเป๋าอะไรที่ดีที่สุดสำหรับเที่ยววัดในไทย?',
    a: 'กระเป๋าสะพายขนาดเล็กอย่าง Chanel WOC หรือ Gucci GG Marmont Small — เล็กพอที่จะสะพายข้ามลำตัว ปลอดภัย และใช้งานสะดวก',
  },
]

export default async function BestBagsForTravelPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const neverfullMm = getItemBySlug('louis-vuitton', 'neverfull-mm')
  const neverfullGm = getItemBySlug('louis-vuitton', 'neverfull-gm')
  const speedy30 = getItemBySlug('louis-vuitton', 'speedy-30')
  const onthego = getItemBySlug('louis-vuitton', 'onthego-mm')
  const woc = getItemBySlug('chanel', 'wallet-on-chain')
  const marmontSmall = getItemBySlug('gucci', 'gg-marmont-small')

  const carryOns = [
    {
      brand: 'Louis Vuitton',
      model: 'Neverfull MM',
      slug: 'louis-vuitton/neverfull-mm',
      item: neverfullMm,
      descEn: 'The most versatile travel tote — fits overhead bins, beach towels, and a temple sarong with room to spare.',
      descTh: 'โทตท่องเที่ยวที่ยืดหยุ่นที่สุด — ใส่ช่องเก็บของเหนือศีรษะได้ บรรจุผ้าเช็ดตัวและผ้าโสร่งวัดได้สบาย',
    },
    {
      brand: 'Louis Vuitton',
      model: 'Speedy 30',
      slug: 'louis-vuitton/speedy-30',
      item: speedy30,
      descEn: 'Compact Boston shape, tough canvas, instantly recognizable. Ideal for short-hop flights around Southeast Asia.',
      descTh: 'ทรง Boston กะทัดรัด ผ้าใบทนทาน เป็นที่จดจำได้ทันที เหมาะสำหรับเที่ยวบินระยะสั้นในเอเชียตะวันออกเฉียงใต้',
    },
    {
      brand: 'Louis Vuitton',
      model: 'OnTheGo MM',
      slug: 'louis-vuitton/onthego-mm',
      item: onthego,
      descEn: 'Double-faced canvas tote with laptop space and an interior organizer — the modern travel upgrade.',
      descTh: 'โทตผ้าใบสองหน้าพร้อมช่องใส่แล็ปท็อปและที่จัดระเบียบภายใน — อัปเกรดการเดินทางสมัยใหม่',
    },
    {
      brand: 'Louis Vuitton',
      model: 'Neverfull GM',
      slug: 'louis-vuitton/neverfull-gm',
      item: neverfullGm,
      descEn: 'The oversized option for longer trips — fits everything without extra checked luggage.',
      descTh: 'ตัวเลือกขนาดใหญ่สำหรับการเดินทางนาน — ใส่ของได้ทุกอย่างโดยไม่ต้องโหลดกระเป๋าเพิ่ม',
    },
  ]

  const crossbodies = [
    {
      brand: 'Chanel',
      model: 'Wallet on Chain',
      slug: 'chanel/wallet-on-chain',
      item: woc,
      descEn: 'The definitive sightseeing bag — keeps hands free at Wat Pho, Chatuchak, and the Grand Palace.',
      descTh: 'กระเป๋าท่องเที่ยวในแบบ definitive — มือว่างที่วัดโพธิ์ จตุจักร และพระบรมมหาราชวัง',
    },
    {
      brand: 'Gucci',
      model: 'GG Marmont Small',
      slug: 'gucci/gg-marmont-small',
      item: marmontSmall,
      descEn: 'Quilted leather crossbody, compact and secure — perfect for busy markets and temple hops.',
      descTh: 'กระเป๋าสะพายหนังลายตาราง กะทัดรัดและปลอดภัย — เหมาะสำหรับตลาดที่คึกคักและการเที่ยววัด',
    },
  ]

  const faqList = isEn ? faqsEn : faqsTh

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h1
        className="font-serif text-4xl text-[#1A1A1A] mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {isEn
          ? `Best Pre-Owned Luxury Bags for Travel in Thailand ${PRICE_YEAR}`
          : `กระเป๋า Luxury มือสองที่ดีที่สุดสำหรับการเดินทาง ${PRICE_YEAR}`}
      </h1>
      <p className="text-[#6B6052] mb-2">
        {isEn
          ? "Thailand's airports and temples demand a bag that survives both. The best pre-owned travel luxury picks — durable, beautiful, and below retail."
          : 'การเดินทางในไทยต้องการกระเป๋าที่ทนทาน สวยงาม และราคาไม่แพงเกินไป Luxury มือสองคือคำตอบ'}
      </p>
      <p className="text-sm text-[#8C7355] mb-12">
        {isEn ? `Updated ${PRICE_YEAR}` : 'อัปเดตมิถุนายน 2025'}
      </p>

      <ThaiPriceCallout
        slugs={['louis-vuitton/neverfull-mm', 'louis-vuitton/speedy-25']}
        locale={locale}
      />

      <section className="mb-12">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Best Carry-On Bags' : 'กระเป๋าสำหรับถือขึ้นเครื่องที่ดีที่สุด'}
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm leading-relaxed">
          {isEn
            ? 'LV Monogram canvas is the gold standard for travel — water-resistant, scratch-proof, and wildly durable. Both Speedy and Neverfull fit overhead bins; OnTheGo MM adds structured pockets for the organized traveller.'
            : 'ผ้าใบ LV Monogram คือมาตรฐานทองสำหรับการเดินทาง — กันน้ำ กันรอย และทนทานมาก Speedy และ Neverfull ใส่ช่องเก็บของเหนือศีรษะได้ทั้งคู่ OnTheGo MM เพิ่มกระเป๋าจัดระเบียบสำหรับนักเดินทางที่มีระเบียบ'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {carryOns.map((bag, i) => {
            const vg = bag.item?.price_ranges?.very_good
            const avgPrice = vg ? getAvgPrice(vg) : null
            return (
              <a
                key={i}
                href={`/${locale}/${bag.slug}`}
                className="group block border border-[#E8E2D9] bg-white hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
              >
                <div className="h-0.5 bg-[#E8E2D9] group-hover:bg-[#B8954A] transition-colors duration-300" />
                <div className="p-6">
                  <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-1">{bag.brand}</p>
                  <h3
                    className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-3 leading-tight"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {bag.model}
                  </h3>
                  <p className="text-sm text-[#6B6052] mb-4 leading-relaxed">
                    {isEn ? bag.descEn : bag.descTh}
                  </p>
                  {avgPrice !== null ? (
                    <div>
                      <p className="text-xs text-[#9C8B7A] mb-0.5">
                        {isEn ? 'Avg. Very Good' : 'เฉลี่ย สภาพดีมาก'}
                      </p>
                      <p className="text-lg font-medium text-[#B8954A]">{formatPriceTHB(avgPrice)}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-[#9C8B7A]">
                      {isEn ? 'Price on request' : 'ติดต่อสอบถามราคา'}
                    </p>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Best Crossbodies for Sightseeing' : 'กระเป๋าสะพายที่ดีที่สุดสำหรับท่องเที่ยว'}
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm leading-relaxed">
          {isEn
            ? 'Hands-free matters at crowded temples and night markets. A compact crossbody keeps your essentials secure while navigating Wat Arun steps or browsing Chatuchak.'
            : 'การมือว่างสำคัญมากในวัดที่แออัดและตลาดกลางคืน กระเป๋าสะพายขนาดเล็กช่วยให้สิ่งของสำคัญปลอดภัยขณะเที่ยวชม'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {crossbodies.map((bag, i) => {
            const vg = bag.item?.price_ranges?.very_good
            const avgPrice = vg ? getAvgPrice(vg) : null
            return (
              <a
                key={i}
                href={`/${locale}/${bag.slug}`}
                className="group block border border-[#E8E2D9] bg-white hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
              >
                <div className="h-0.5 bg-[#E8E2D9] group-hover:bg-[#B8954A] transition-colors duration-300" />
                <div className="p-6">
                  <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-1">{bag.brand}</p>
                  <h3
                    className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-3 leading-tight"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {bag.model}
                  </h3>
                  <p className="text-sm text-[#6B6052] mb-4 leading-relaxed">
                    {isEn ? bag.descEn : bag.descTh}
                  </p>
                  {avgPrice !== null ? (
                    <div>
                      <p className="text-xs text-[#9C8B7A] mb-0.5">
                        {isEn ? 'Avg. Very Good' : 'เฉลี่ย สภาพดีมาก'}
                      </p>
                      <p className="text-lg font-medium text-[#B8954A]">{formatPriceTHB(avgPrice)}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-[#9C8B7A]">
                      {isEn ? 'Price on request' : 'ติดต่อสอบถามราคา'}
                    </p>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Materials That Survive Thai Heat & Humidity' : 'วัสดุที่ทนต่อความร้อนและความชื้นในไทย'}
        </h2>
        <div className="space-y-4">
          <div className="border-l-2 border-[#B8954A] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">
              {isEn ? 'Coated Canvas — Best Choice' : 'ผ้าใบเคลือบ — ตัวเลือกที่ดีที่สุด'}
            </p>
            <p className="text-sm text-[#6B6052] leading-relaxed">
              {isEn
                ? 'LV Monogram and Damier canvas, Gucci GG Supreme — water-resistant, easy to wipe clean, and holds its shape in heat. The ideal travel material.'
                : 'ผ้าใบ LV Monogram และ Damier, Gucci GG Supreme — กันน้ำ เช็ดทำความสะอาดง่าย รูปทรงคงที่ในความร้อน วัสดุท่องเที่ยวในอุดมคติ'}
            </p>
          </div>
          <div className="border-l-2 border-[#E8E2D9] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">
              {isEn ? 'Saffiano Leather — Good' : 'หนัง Saffiano — ดี'}
            </p>
            <p className="text-sm text-[#6B6052] leading-relaxed">
              {isEn
                ? "Prada's cross-hatched leather resists scratches and water. Holds up well in Bangkok's humidity — a step above smooth calfskin."
                : 'หนังลายตารางของ Prada ทนต่อรอยขีดข่วนและน้ำ ทนต่อความชื้นของกรุงเทพฯ ได้ดี — ดีกว่าหนังเรียบหนึ่งระดับ'}
            </p>
          </div>
          <div className="border-l-2 border-[#E8E2D9] pl-4">
            <p className="font-medium text-[#1A1A1A] mb-1">
              {isEn ? 'Lambskin — Avoid for Travel' : 'หนัง Lambskin — หลีกเลี่ยงสำหรับการเดินทาง'}
            </p>
            <p className="text-sm text-[#6B6052] leading-relaxed">
              {isEn
                ? 'Chanel Classic Flap and Boy Bag use lambskin that scratches easily and absorbs moisture. Save these for dinners and events, not beach-to-temple days.'
                : 'Chanel Classic Flap และ Boy Bag ใช้หนัง lambskin ที่เป็นรอยง่ายและดูดซับความชื้น เก็บไว้สำหรับมื้อค่ำและงานกิจกรรม ไม่ใช่วันเที่ยวชายหาดและวัด'}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12 bg-[#F5F0EB] border border-[#E8E2D9] p-6">
        <h2
          className="font-serif text-xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Travel Care Tips' : 'เคล็ดลับการดูแลกระเป๋าขณะเดินทาง'}
        </h2>
        <ul className="space-y-2 text-sm text-[#6B6052]">
          {(isEn ? [
            'Store in its dust bag when not in use — even in your hotel room.',
            'Never check luxury bags as hold luggage. Cabin carry only.',
            'Wipe canvas bags with a slightly damp cloth after beach or temple visits.',
            'Stuff with tissue paper to maintain shape during transit.',
          ] : [
            'เก็บในถุงกันฝุ่นเมื่อไม่ใช้งาน — แม้แต่ในห้องพักโรงแรม',
            'ห้ามโหลดกระเป๋า Luxury ขึ้นเครื่อง พกขึ้นห้องโดยสารเท่านั้น',
            'เช็ดกระเป๋าผ้าใบด้วยผ้าชุบน้ำหมาดๆ หลังเที่ยวชายหาดหรือวัด',
            'ยัดด้วยกระดาษทิชชูเพื่อรักษารูปทรงระหว่างการเดินทาง',
          ]).map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[#B8954A] shrink-0 mt-0.5">—</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t border-[#E8E2D9] pt-10">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}
        </h2>
        <div className="space-y-6">
          {faqList.map((faq, i) => (
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
