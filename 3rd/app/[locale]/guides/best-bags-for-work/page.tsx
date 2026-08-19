import type { Metadata } from 'next'
import { getItemBySlug, getAvgPrice, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/best-bags-for-work'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Best Pre-Owned Luxury Work Bags in Thailand ${PRICE_YEAR} | ChicPreowned`
      : `กระเป๋า Luxury มือสองสำหรับทำงานที่ดีที่สุดในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Structured, professional, and below retail. The best pre-owned luxury bags for the Bangkok office — totes, satchels, and structured classics.'
      : 'มีโครงสร้าง ดูเป็นมืออาชีพ และราคาต่ำกว่าราคาใหม่ กระเป๋า Luxury มือสองที่ดีที่สุดสำหรับออฟฟิศในกรุงเทพฯ',
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
    q: 'What size luxury bag is best for the office?',
    a: 'Medium totes (30–35cm) fit laptops and documents without looking bulky. Prada Galleria Medium and BV Arco Medium are ideal office sizes.',
  },
  {
    q: 'Are canvas luxury bags appropriate for formal work settings in Thailand?',
    a: 'For creative or business casual offices, yes. For corporate banking or law firms, structured leather totes like Prada Galleria or Dior 30 Montaigne project more authority.',
  },
  {
    q: 'Which luxury brands are most recognized in Bangkok offices?',
    a: 'Chanel, Louis Vuitton, and Prada are instantly recognized. Bottega Veneta signals sophisticated taste without obvious branding — popular in creative industries.',
  },
  {
    q: 'Is buying a pre-owned luxury work bag worth it?',
    a: 'Yes. Pre-owned prices are 20–40% below retail, and structured totes in good condition show little wear. A quality dust bag and conditioning cloth are all the maintenance needed.',
  },
]

const faqsTh = [
  {
    q: 'กระเป๋า Luxury ขนาดไหนที่เหมาะกับออฟฟิศที่สุด?',
    a: 'โทตขนาดกลาง (30–35 ซม.) ใส่แล็ปท็อปและเอกสารได้โดยไม่ดูใหญ่โต Prada Galleria Medium และ BV Arco Medium เป็นขนาดออฟฟิศในอุดมคติ',
  },
  {
    q: 'กระเป๋าผ้าใบ Luxury เหมาะกับสภาพแวดล้อมการทำงานที่เป็นทางการในไทยไหม?',
    a: 'สำหรับออฟฟิศสร้างสรรค์หรือ business casual ได้เลย สำหรับธนาคารองค์กรหรือสำนักงานกฎหมาย โทตหนังมีโครงสร้างอย่าง Prada Galleria หรือ Dior 30 Montaigne สร้างความน่าเชื่อถือมากกว่า',
  },
  {
    q: 'แบรนด์ Luxury ไหนที่เป็นที่รู้จักในออฟฟิศกรุงเทพฯ มากที่สุด?',
    a: 'Chanel, Louis Vuitton และ Prada เป็นที่รู้จักทันที Bottega Veneta แสดงถึงรสนิยมที่ซับซ้อนโดยไม่มีโลโก้ชัดเจน — เป็นที่นิยมในอุตสาหกรรมสร้างสรรค์',
  },
  {
    q: 'การซื้อกระเป๋าสำหรับทำงานมือสองคุ้มค่าไหม?',
    a: 'คุ้มค่ามาก ราคามือสองต่ำกว่าราคาใหม่ 20–40% และโทตมีโครงสร้างในสภาพดีแทบไม่แสดงรอยใช้งาน เพียงแค่ถุงกันฝุ่นและผ้าทำความสะอาดก็เพียงพอ',
  },
]

export default async function BestBagsForWorkPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const pradaGalleria = getItemBySlug('prada', 'galleria-medium')
  const bvArco = getItemBySlug('bottega-veneta', 'arco-tote-medium')
  const onthego = getItemBySlug('louis-vuitton', 'onthego-mm')
  const dior30 = getItemBySlug('dior', '30-montaigne')
  const celineLuggage = getItemBySlug('celine', 'luggage-micro')
  const gucciOphidia = getItemBySlug('gucci', 'ophidia-gg-medium')

  const workBags = [
    {
      brand: 'Prada',
      model: 'Galleria Medium',
      slug: 'prada/galleria-medium',
      item: pradaGalleria,
      descEn: 'The original power tote. Saffiano leather, structured silhouette, roomy interior — carries laptops and meeting folders without complaint.',
      descTh: 'โทตแห่งอำนาจต้นฉบับ หนัง Saffiano ทรงมีโครงสร้าง ภายในกว้างขวาง — ใส่แล็ปท็อปและแฟ้มประชุมได้สบาย',
    },
    {
      brand: 'Bottega Veneta',
      model: 'Arco Tote Medium',
      slug: 'bottega-veneta/arco-tote-medium',
      item: bvArco,
      descEn: 'Woven intrecciato leather with architectural handles. No visible logo — maximum sophistication for creative directors and senior professionals.',
      descTh: 'หนัง intrecciato ทอสานพร้อมหูหิ้วทรงสถาปัตยกรรม ไม่มีโลโก้ชัดเจน — ความซับซ้อนสูงสุดสำหรับผู้อำนวยการสร้างและมืออาชีพระดับสูง',
    },
    {
      brand: 'Louis Vuitton',
      model: 'OnTheGo MM',
      slug: 'louis-vuitton/onthego-mm',
      item: onthego,
      descEn: 'Double-faced canvas with interior pockets designed for daily commuting — elegant enough for client meetings, practical enough for everything else.',
      descTh: 'ผ้าใบสองหน้าพร้อมกระเป๋าด้านในที่ออกแบบมาสำหรับการเดินทางประจำวัน — สวยงามพอสำหรับการประชุมลูกค้า ใช้งานได้จริงสำหรับทุกโอกาส',
    },
    {
      brand: 'Dior',
      model: '30 Montaigne',
      slug: 'dior/30-montaigne',
      item: dior30,
      descEn: 'Named after Dior\'s address. Structured box shape with the signature CD clasp — the Parisian choice for Bangkok boardrooms.',
      descTh: 'ตั้งชื่อตามที่อยู่ของ Dior ทรงกล่องมีโครงสร้างพร้อมตัวล็อค CD อันเป็นเอกลักษณ์ — ตัวเลือกแบบปารีสสำหรับห้องประชุมในกรุงเทพฯ',
    },
    {
      brand: 'Celine',
      model: 'Luggage Micro',
      slug: 'celine/luggage-micro',
      item: celineLuggage,
      descEn: 'Compact structured tote with a distinctive smiling silhouette. Fits essentials for a full office day — minimalist and impactful.',
      descTh: 'โทตมีโครงสร้างกะทัดรัดพร้อมซิลูเอตที่ยิ้มเป็นเอกลักษณ์ ใส่ของจำเป็นสำหรับวันทำงานเต็มวัน — minimalist และน่าประทับใจ',
    },
    {
      brand: 'Gucci',
      model: 'Ophidia GG Medium',
      slug: 'gucci/ophidia-gg-medium',
      item: gucciOphidia,
      descEn: 'GG Supreme canvas with Web stripe trim — roomy, professional, and one of Gucci\'s most durable styles for everyday office use.',
      descTh: 'ผ้าใบ GG Supreme พร้อมตกแต่ง Web stripe — ใส่ของได้มาก ดูเป็นมืออาชีพ และเป็นหนึ่งในสไตล์ที่ทนทานที่สุดของ Gucci สำหรับใช้ในออฟฟิศทุกวัน',
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
          ? `Best Pre-Owned Luxury Work Bags in Thailand ${PRICE_YEAR}`
          : `กระเป๋า Luxury มือสองสำหรับทำงานที่ดีที่สุดในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-[#6B6052] mb-2">
        {isEn
          ? 'Structured, professional, and below retail. The best pre-owned luxury bags for the Bangkok office — totes, satchels, and structured classics that mean business.'
          : 'มีโครงสร้าง ดูเป็นมืออาชีพ และราคาต่ำกว่าราคาใหม่ กระเป๋า Luxury มือสองที่ดีที่สุดสำหรับออฟฟิศในกรุงเทพฯ'}
      </p>
      <p className="text-sm text-[#8C7355] mb-12">
        {isEn ? `Updated ${PRICE_YEAR}` : 'อัปเดตมิถุนายน 2025'}
      </p>

      <section className="mb-12">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Top Work Bags by Category' : 'กระเป๋าทำงานยอดนิยมตามประเภท'}
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm leading-relaxed">
          {isEn
            ? 'Bangkok offices range from formal finance towers to creative agency lofts — the right work bag depends on your setting. Structured leather for boardrooms, smart canvas for creative environments.'
            : 'ออฟฟิศในกรุงเทพฯ มีตั้งแต่ตึกการเงินที่เป็นทางการจนถึง creative agency loft — กระเป๋าทำงานที่เหมาะสมขึ้นอยู่กับสภาพแวดล้อม หนังมีโครงสร้างสำหรับห้องประชุม ผ้าใบที่สมาร์ทสำหรับสภาพแวดล้อมสร้างสรรค์'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workBags.map((bag, i) => {
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

      <section className="mb-12 bg-[#F5F0EB] border border-[#E8E2D9] p-6">
        <h2
          className="font-serif text-xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'What Makes a Great Work Bag?' : 'อะไรทำให้กระเป๋าทำงานดีเยี่ยม?'}
        </h2>
        <ul className="space-y-2 text-sm text-[#6B6052]">
          {(isEn ? [
            'Structured shape — holds its form without slumping on your desk or car seat.',
            'Interior organization — at least one zip pocket and card slots.',
            'Durable material — Saffiano, canvas, or intrecciato leather holds up to daily commuting.',
            'Appropriate size — fits a 13" or 15" laptop if you carry one regularly.',
          ] : [
            'ทรงมีโครงสร้าง — รักษารูปทรงโดยไม่พับงอบนโต๊ะหรือที่นั่งในรถ',
            'จัดระเบียบภายใน — มีกระเป๋าซิปอย่างน้อยหนึ่งช่องและช่องใส่บัตร',
            'วัสดุทนทาน — หนัง Saffiano ผ้าใบ หรือหนัง intrecciato ทนต่อการเดินทางประจำวัน',
            'ขนาดเหมาะสม — ใส่แล็ปท็อป 13" หรือ 15" ได้หากคุณพกเป็นประจำ',
          ]).map((point, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[#B8954A] shrink-0 mt-0.5">—</span>
              <span>{point}</span>
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
