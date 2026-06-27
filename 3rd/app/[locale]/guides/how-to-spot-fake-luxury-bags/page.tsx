import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-spot-fake-luxury-bags'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Spot a Fake Luxury Bag in Thailand 2025 | ChicPreowned'
      : 'วิธีดูกระเป๋า Luxury ของแท้ vs ของก็อป — คู่มือ 2025 | ChicPreowned',
    description: isEn
      ? 'Brand-by-brand authentication guide for Chanel, Louis Vuitton, Hermès and Gucci pre-owned bags in Thailand. Key tells and verification tips.'
      : 'คู่มือตรวจสอบความแท้ทีละแบรนด์ Chanel, Louis Vuitton, Hermès และ Gucci มือสองในไทย',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: {
        en: `${BASE}/en/${SLUG}`,
        th: `${BASE}/th/${SLUG}`,
      },
    },
  }
}

const brandTells = [
  {
    brand: 'Chanel',
    tellsEn: [
      'Serial sticker: Chanel uses a holographic serial sticker with a matching authenticity card. The sticker is inside the bag; card must match. Post-2021 Chanel uses a microchip instead of sticker.',
      'Quilting: Caviar leather quilting should have perfectly uniform diamond shapes. Lambskin quilting is softer — uneven puffiness is suspicious.',
      'CC turn-lock: The interlocking C logo should be perfectly symmetrical. On fakes, the Cs often overlap or align incorrectly.',
      'Lining: Authentic Chanel uses Burgundy grosgrain ribbon lining in classic bags. The CC lining logo is always centred and evenly spaced.',
      'Hardware: Gold-tone hardware should not tarnish within normal use. Chain should feel heavy and substantial — count the links on specific models.',
    ],
    tellsTh: [
      'สติ๊กเกอร์ซีเรียล: Chanel ใช้สติ๊กเกอร์ซีเรียลแบบ holographic พร้อมบัตรรับรองที่ตรงกัน สติ๊กเกอร์อยู่ภายในกระเป๋า บัตรต้องตรงกัน หลังปี 2021 Chanel ใช้ microchip แทนสติ๊กเกอร์',
      'การตะเข็บ: การตะเข็บหนัง caviar ควรมีรูปเพชรที่สม่ำเสมออย่างสมบูรณ์ การตะเข็บหนังแกะนุ่มกว่า ความบวมที่ไม่สม่ำเสมอเป็นสัญญาณน่าสงสัย',
      'CC turn-lock: โลโก้ C ที่ซ้อนกันควรสมมาตรอย่างสมบูรณ์ บนของปลอม Cs มักซ้อนทับหรือเรียงผิด',
      'ผ้าซับใน: Chanel แท้ใช้ผ้าซับใน Burgundy grosgrain ribbon ในกระเป๋า classic โลโก้ CC บนผ้าซับในอยู่ตรงกลางเสมอและระยะห่างสม่ำเสมอ',
      'ฮาร์ดแวร์: ฮาร์ดแวร์สีทองไม่ควรขึ้นสนิทในการใช้งานปกติ โซ่ควรรู้สึกหนักและแน่น นับลิงค์โซ่บนรุ่นที่ระบุ',
    ],
  },
  {
    brand: 'Louis Vuitton',
    tellsEn: [
      'Date code: Older LV bags have a date code stamped in the interior. Format: two letters (factory) + four digits (e.g., SD0067). Newer pieces use an RFID microchip readable by the LV app. No date code on a vintage piece is suspicious.',
      'Monogram canvas: The LV and fleur-de-lis pattern must never be cut off at seams on authentic pieces. The pattern is always symmetrical. Monogram should be brown on cream — never orange or yellow.',
      'Hardware: "LOUIS VUITTON" is engraved on all hardware in consistent all-cap serif font. Zipper pulls should have the LV logo. Hardware should feel heavy and brass-tone.',
      'Stitching: Authentic stitching is always amber/mustard tone, never white, black or yellow. Stitch count per inch is consistent and specific to each model.',
      'Dust bag: Authentic LV dust bag is brown or cream canvas with LV monogram. The drawstring should be flat ribbon, not rope.',
    ],
    tellsTh: [
      'Date code: กระเป๋า LV รุ่นเก่ามี date code ประทับภายใน รูปแบบ: ตัวอักษรสองตัว (โรงงาน) + ตัวเลขสี่หลัก (เช่น SD0067) รุ่นใหม่ใช้ RFID microchip ที่อ่านได้ผ่านแอป LV ถ้าไม่มี date code บนชิ้นวินเทจถือว่าน่าสงสัย',
      'Monogram canvas: ลาย LV และ fleur-de-lis ต้องไม่ถูกตัดที่รอยต่อบนชิ้นแท้ ลายเสมอสมมาตร Monogram ควรเป็นสีน้ำตาลบนสีครีม ไม่ใช่สีส้มหรือเหลือง',
      'ฮาร์ดแวร์: "LOUIS VUITTON" แกะสลักบนฮาร์ดแวร์ทั้งหมดในฟอนต์ serif ตัวพิมพ์ใหญ่สม่ำเสมอ หัวซิปควรมีโลโก้ LV ฮาร์ดแวร์ควรรู้สึกหนักและเป็นสีทองเหลือง',
      'การเย็บ: การเย็บแท้เป็นสีอำพัน/มัสตาร์ดเสมอ ไม่ใช่สีขาว ดำ หรือเหลือง จำนวนตะเข็บต่อนิ้วสม่ำเสมอและเฉพาะสำหรับแต่ละรุ่น',
      'ถุงผ้า: ถุงผ้า LV แท้เป็นผ้า canvas สีน้ำตาลหรือครีมพร้อมโมโนแกรม LV เชือกรูดควรเป็นริบบิ้นแบน ไม่ใช่เชือก',
    ],
  },
  {
    brand: 'Hermès',
    tellsEn: [
      'Blind stamp: Every Hermès bag has a blind stamp (craftsperson ID letter + year letter) that is heat-pressed into the leather, usually near the strap or under the flap. The letter system is documented and verifiable.',
      'Stitching: Hermès uses Sellier or Saddle stitch — all stitching is done by hand with two needles. Each stitch is perfectly diagonal and consistent. Machine stitching on a claimed Hermès is a definitive fake tell.',
      'Hardware: All metal hardware is either gold-tone (Plaqué Or), palladium, or ruthenium. Engraving reads "HERMÈS PARIS" in a specific font. Hardware never feels light.',
      'Leather: Togo leather has a distinctive pebbly texture that is uniform. Box leather is smooth and mirror-like when new. Knowing the specific leather type helps verify authenticity.',
      'Dust bag: Hermès dust bags are orange with a brown drawstring and "HERMÈS" or the iconic script logo. Orange should be the correct Hermès orange — not yellowish or reddish.',
    ],
    tellsTh: [
      'Blind stamp: กระเป๋า Hermès ทุกใบมี blind stamp (ตัวอักษรช่างฝีมือ + ตัวอักษรปี) ที่ถูกกดด้วยความร้อนลงในหนัง มักอยู่ใกล้สายหรือใต้ฝา ระบบตัวอักษรมีเอกสารและสามารถยืนยันได้',
      'การเย็บ: Hermès ใช้การเย็บ Sellier หรือ Saddle — การเย็บทั้งหมดทำด้วยมือด้วยเข็มสองเล่ม แต่ละตะเข็บเฉียงอย่างสมบูรณ์และสม่ำเสมอ การเย็บด้วยเครื่องบนกระเป๋าที่อ้างว่าเป็น Hermès เป็นสัญญาณของของปลอมที่ชัดเจน',
      'ฮาร์ดแวร์: ฮาร์ดแวร์โลหะทั้งหมดเป็นสีทอง (Plaqué Or) พาลาเดียม หรือรูทีเนียม การแกะสลักระบุ "HERMÈS PARIS" ในฟอนต์เฉพาะ ฮาร์ดแวร์ไม่มีความรู้สึกเบา',
      'หนัง: หนัง Togo มีพื้นผิวเม็ดเล็กที่โดดเด่นและสม่ำเสมอ หนัง Box เรียบและเหมือนกระจกเมื่อใหม่ การรู้จักประเภทหนังเฉพาะช่วยยืนยันความแท้',
      'ถุงผ้า: ถุงผ้า Hermès เป็นสีส้มพร้อมเชือกรูดสีน้ำตาลและโลโก้ "HERMÈS" สีส้มควรเป็นสีส้ม Hermès ที่ถูกต้อง ไม่ใช่สีเหลืองหรือแดง',
    ],
  },
  {
    brand: 'Gucci',
    tellsEn: [
      'Double-G logo: The interlocking GG logo should have both Gs touching at a single intersection point. On fakes, they often overlap significantly or have incorrect proportions.',
      'GG Supreme canvas: The canvas should have a firm, slightly waxy feel. Monogram print should be perfectly symmetrical — no GG should ever be cut off at a seam on authentic canvas.',
      'Interior serial tag: Authentic Gucci has a serial number on a leather tag inside. The number should correspond to a valid Gucci code format. Post-2016 Gucci bags also have an RFID chip.',
      'Hardware: Gucci hardware is engraved with "GUCCI" in capital letters with a specific square font. Hardware should feel heavy; fake Gucci often uses hollow metal that sounds tinny when tapped.',
      'Stitching: Stitching is a consistent off-white or champagne tone — never pure white. Stitch count should be high and even.',
    ],
    tellsTh: [
      'โลโก้ GG คู่: โลโก้ GG ที่ซ้อนกันควรมีทั้งสอง G แตะกันที่จุดตัดเดียว บนของปลอมมักซ้อนทับอย่างมีนัยสำคัญหรือมีสัดส่วนไม่ถูกต้อง',
      'GG Supreme canvas: ผ้า canvas ควรรู้สึกแน่นและมีความมันเล็กน้อย ลาย monogram ควรสมมาตรอย่างสมบูรณ์ ไม่ควรมี GG ถูกตัดที่รอยต่อบน canvas แท้',
      'แท็กซีเรียลภายใน: Gucci แท้มีหมายเลขซีเรียลบนแท็กหนังภายใน หมายเลขควรสอดคล้องกับรูปแบบรหัส Gucci ที่ถูกต้อง กระเป๋า Gucci หลังปี 2016 ยังมีชิป RFID ด้วย',
      'ฮาร์ดแวร์: ฮาร์ดแวร์ Gucci แกะสลักด้วย "GUCCI" ตัวพิมพ์ใหญ่พร้อมฟอนต์สี่เหลี่ยมเฉพาะ ฮาร์ดแวร์ควรรู้สึกหนัก ของปลอม Gucci มักใช้โลหะกลวงที่เสียงดังเมื่อเคาะ',
      'การเย็บ: การเย็บเป็นสีขาวนวลหรือแชมเปญสม่ำเสมอ ไม่ใช่สีขาวบริสุทธิ์ จำนวนตะเข็บควรสูงและสม่ำเสมอ',
    ],
  },
]

const faqsEn = [
  {
    q: 'How can I verify a luxury bag is authentic before buying in Thailand?',
    a: 'The safest method is to buy only from platforms with authentication guarantees, such as Vestiaire Collective. If buying privately, hire a professional authenticator — LUXE Authentics and Rebagged both operate in Bangkok. Alternatively, post detailed photos (interior, hardware, serial code, stitching close-ups) to authentication communities on Reddit (r/Authenticate) before purchasing.',
  },
  {
    q: 'How common are fake luxury bags in Thailand?',
    a: "Counterfeit luxury bags are extremely common in Thailand, particularly at markets like MBK, Chatuchak, and Patpong. The sophistication ranges from obvious fakes to 'super fakes' that can fool inexperienced buyers. Even on Carousell Thailand, fake listings appear regularly. Never assume a low price means a bargain — it almost always means a fake.",
  },
  {
    q: 'Can I get a refund if I bought a fake luxury bag in Thailand?',
    a: "If you bought from Vestiaire Collective or another platform with buyer protection, you can dispute the sale and receive a refund. For private market purchases on Carousell or Line, recourse depends on payment method — PromptPay transfers are very difficult to reverse. Always use a payment method with buyer protection (credit card, platform escrow) for high-value purchases.",
  },
  {
    q: 'What is the most counterfeited luxury brand in Thailand?',
    a: "Louis Vuitton Monogram is the most counterfeited by volume due to its recognisable pattern. Hermès (particularly fake Birkins) is the most sophisticated — high-quality Hermès fakes can cost ฿30,000–฿80,000 and fool even experienced buyers. Gucci GG canvas and belts are also extremely widely counterfeited at all quality levels.",
  },
]

const faqsTh = [
  {
    q: 'วิธียืนยันว่ากระเป๋า luxury ของแท้ก่อนซื้อในไทยทำอย่างไร?',
    a: 'วิธีที่ปลอดภัยที่สุดคือซื้อจากแพลตฟอร์มที่มีการรับประกันความแท้เท่านั้น เช่น Vestiaire Collective หากซื้อจากเอกชน ให้จ้างผู้ตรวจสอบมืออาชีพ — LUXE Authentics และ Rebagged ดำเนินการในกรุงเทพฯ หรืออาจโพสต์รูปถ่ายรายละเอียด (ภายใน ฮาร์ดแวร์ รหัสซีเรียล ระยะใกล้ตะเข็บ) ไปยังชุมชนตรวจสอบบน Reddit (r/Authenticate) ก่อนซื้อ',
  },
  {
    q: 'กระเป๋า luxury ปลอมพบบ่อยแค่ไหนในไทย?',
    a: 'กระเป๋า luxury ปลอมพบเห็นได้ทั่วไปมากในไทย โดยเฉพาะที่ตลาดอย่าง MBK, จตุจักร และพัฒน์พงศ์ ความซับซ้อนมีตั้งแต่ของปลอมที่เห็นได้ชัดไปจนถึง "super fakes" ที่หลอกผู้ซื้อที่ไม่มีประสบการณ์ได้ แม้แต่บน Carousell Thailand ประกาศปลอมก็ปรากฏขึ้นบ่อยครั้ง อย่าสันนิษฐานว่าราคาต่ำหมายถึงราคาดี — มักหมายถึงของปลอมเสมอ',
  },
  {
    q: 'ขอเงินคืนได้ไหมถ้าซื้อกระเป๋า luxury ปลอมในไทย?',
    a: 'ถ้าซื้อจาก Vestiaire Collective หรือแพลตฟอร์มอื่นที่มีการคุ้มครองผู้ซื้อ คุณสามารถโต้แย้งการขายและรับเงินคืน สำหรับการซื้อจากตลาดเอกชนบน Carousell หรือ Line การเยียวยาขึ้นอยู่กับวิธีการชำระเงิน การโอน PromptPay ยากมากที่จะกลับคืน ควรใช้วิธีการชำระเงินที่มีการคุ้มครองผู้ซื้อ (บัตรเครดิต, escrow ของแพลตฟอร์ม) สำหรับการซื้อมูลค่าสูง',
  },
  {
    q: 'แบรนด์ luxury ไหนที่ถูกปลอมแปลงมากที่สุดในไทย?',
    a: 'Louis Vuitton Monogram ถูกปลอมแปลงมากที่สุดตามปริมาณเนื่องจากลายที่เป็นที่รู้จัก Hermès (โดยเฉพาะ Birkin ปลอม) มีความซับซ้อนมากที่สุด — ของปลอม Hermès คุณภาพสูงอาจราคา ฿30,000–฿80,000 และหลอกแม้แต่ผู้ซื้อที่มีประสบการณ์ GG canvas และเข็มขัด Gucci ก็ถูกปลอมแปลงอย่างแพร่หลายในทุกระดับคุณภาพ',
  },
]

export default async function HowToSpotFakePage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
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

      <p className="text-sm text-[#9C8B7A] mb-3">
        <a href={`/${locale}`} className="hover:text-[#B8954A] transition-colors">{isEn ? 'Home' : 'หน้าหลัก'}</a>
        {' › '}
        <a href={`/${locale}/guides`} className="hover:text-[#B8954A] transition-colors">{isEn ? 'Guides' : 'คู่มือ'}</a>
        {' › '}
        {isEn ? 'How to Spot Fakes' : 'วิธีดูของแท้'}
      </p>

      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? 'How to Spot a Fake Luxury Bag in Thailand 2025' : 'วิธีดูกระเป๋า Luxury ของแท้ vs ของก็อป — คู่มือ 2025'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">
        {isEn ? 'Brand-specific authentication guide for pre-owned buyers in Thailand' : 'คู่มือตรวจสอบความแท้รายแบรนด์สำหรับผู้ซื้อมือสองในไทย'}
      </p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed max-w-2xl">
          {isEn
            ? "Counterfeit luxury bags are widespread in Thailand at all price points. Sophisticated fakes can cost ฿5,000–฿80,000 and pass casual inspection. Below are the key authentication tells for each major brand."
            : 'กระเป๋า luxury ปลอมแพร่หลายในไทยทุกระดับราคา ของปลอมที่ซับซ้อนอาจราคา ฿5,000–฿80,000 และผ่านการตรวจสอบเบื้องต้นได้ ด้านล่างคือสัญญาณตรวจสอบความแท้หลักสำหรับแต่ละแบรนด์หลัก'}
        </p>
      </section>

      <div className="space-y-12 mb-14">
        {brandTells.map(b => (
          <section key={b.brand}>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-5 pb-3 border-b border-[#E8E2D9]" style={{ fontFamily: 'var(--font-playfair)' }}>
              {b.brand}
            </h2>
            <ul className="space-y-4">
              {(isEn ? b.tellsEn : b.tellsTh).map((tell, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#B8954A] font-semibold shrink-0 mt-0.5">{i + 1}.</span>
                  <p className="text-[#6B6052] text-sm leading-relaxed">{tell}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mb-14 p-5 border-l-2 border-[#B8954A] bg-[#FAFAF9]">
        <h2 className="font-serif text-lg text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Professional Authentication in Bangkok' : 'บริการตรวจสอบมืออาชีพในกรุงเทพฯ'}
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          {isEn
            ? "For any purchase above ฿50,000, professional authentication is strongly recommended. LUXE Authentics and Rebagged both offer in-person and photo-based authentication in Bangkok for ฿300–฿800 per item. This cost is minimal compared to the risk of purchasing a sophisticated fake."
            : 'สำหรับการซื้อใดๆ เกิน ฿50,000 ขอแนะนำการตรวจสอบมืออาชีพอย่างยิ่ง LUXE Authentics และ Rebagged ทั้งคู่มีบริการตรวจสอบแบบพบตัวและผ่านรูปถ่ายในกรุงเทพฯ ในราคา ฿300–฿800 ต่อชิ้น ค่าใช้จ่ายนี้น้อยมากเมื่อเทียบกับความเสี่ยงในการซื้อของปลอมที่ซับซ้อน'}
        </p>
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
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
