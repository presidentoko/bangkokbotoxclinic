import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-care-for-luxury-bags'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Care for Pre-Owned Luxury Bags in Thailand | ChicPreowned'
      : 'วิธีดูแลกระเป๋าแบรนด์เนมมือสองในไทย | ChicPreowned',
    description: isEn
      ? 'Complete guide to caring for luxury bags in Thailand\'s humid climate. Storage, cleaning, hardware care, and humidity protection for Chanel, LV, Hermès and more.'
      : 'คู่มือดูแลกระเป๋าแบรนด์เนมในสภาพอากาศชื้นของไทย การเก็บรักษา ทำความสะอาด และป้องกันความชื้น สำหรับ Chanel, LV, Hermès',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

export default async function HowToCareForLuxuryBagsPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{isEn ? 'How to Care for Luxury Bags' : 'วิธีดูแลกระเป๋าแบรนด์เนม'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Care for Luxury Bags in Thailand' : 'วิธีดูแลกระเป๋าแบรนด์เนมในไทย'}
      </h1>
      <p className="text-gray-600 mb-10">
        {isEn
          ? "Thailand's climate is one of the most challenging for luxury leather goods — high heat and humidity accelerate ageing, discolouration, and mold growth. Here's how to protect your investment."
          : 'สภาพอากาศไทยเป็นหนึ่งในความท้าทายที่สุดสำหรับสินค้าหนัง luxury — ความร้อนสูงและความชื้นเร่งการเสื่อมสภาพ การเปลี่ยนสี และการเจริญเติบโตของรา นี่คือวิธีปกป้องการลงทุนของคุณ'}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          {isEn ? '1. Storage' : '1. การเก็บรักษา'}
        </h2>
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            {isEn
              ? 'Always store bags in their dust bags, stuffed with acid-free tissue paper to maintain shape. Do NOT use newspaper — the ink transfers to leather. Stand the bag upright; do not stack bags on top of each other.'
              : 'เก็บกระเป๋าในถุงผ้าเสมอ ยัดด้วยกระดาษทิชชูปลอดกรดเพื่อรักษารูปทรง อย่าใช้หนังสือพิมพ์ — หมึกติดหนัง ตั้งกระเป๋าตรง อย่าวางซ้อนกัน'}
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <strong className="text-yellow-800">{isEn ? 'Thailand tip:' : 'เคล็ดลับสำหรับไทย:'}</strong>
            <span className="text-yellow-700 ml-2">
              {isEn
                ? 'Put 2–3 silica gel packets inside each dust bag. Replace them every 3 months. This is the single most important step in Thailand\'s climate.'
                : 'ใส่ซิลิกาเจล 2–3 ถุงในถุงผ้าแต่ละใบ เปลี่ยนทุก 3 เดือน นี่คือขั้นตอนที่สำคัญที่สุดเพียงอย่างเดียวในสภาพอากาศไทย'}
            </span>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          {isEn ? '2. Cleaning by Leather Type' : '2. การทำความสะอาดตามประเภทหนัง'}
        </h2>
        <div className="space-y-4">
          {(isEn ? [
            { type: 'Caviar leather (Chanel)', tip: 'Wipe with a slightly damp white cloth. For scuffs, use a Chanel leather conditioner or Cadillac leather conditioner. The pebbled texture hides minor marks well.' },
            { type: 'Lambskin (Chanel, Dior)', tip: 'Extremely delicate — use only a dry soft cloth. No water contact. For conditioning, use a product designed specifically for lambskin (Venetian Shoe Cream works well). Avoid touching with dirty hands.' },
            { type: 'Monogram canvas (Louis Vuitton)', tip: 'Wipe with a damp cloth for the canvas. The vachetta (natural leather trim) darkens with use — this is normal patina, not damage. Do NOT condition the vachetta — it will darken unevenly.' },
            { type: 'Clemence/Togo leather (Hermès)', tip: 'These are the most forgiving Hermès leathers. Wipe with a damp cloth, then dry immediately. Use a light leather conditioner (Hermès leather care products or Coach leather conditioner) every 3–6 months.' },
            { type: 'Nylon/Re-Nylon (Prada)', tip: 'Can be spot-cleaned with mild soap and water. For deeper cleaning, consult Prada — some nylon pieces can be gently hand-washed.' },
          ] : [
            { type: 'หนัง Caviar (Chanel)', tip: 'เช็ดด้วยผ้าขาวชื้นเล็กน้อย สำหรับรอยขีดข่วน ใช้ครีมหนัง Chanel หรือ Cadillac leather conditioner เนื้อหนังแบบเม็ดซ่อนรอยเล็กน้อยได้ดี' },
            { type: 'หนัง Lambskin (Chanel, Dior)', tip: 'บอบบางมาก — ใช้เฉพาะผ้านุ่มแห้ง ห้ามสัมผัสน้ำ สำหรับการบำรุง ใช้ผลิตภัณฑ์ที่ออกแบบมาเฉพาะสำหรับ lambskin โดยเฉพาะ หลีกเลี่ยงการสัมผัสด้วยมือที่สกปรก' },
            { type: 'ผ้า Monogram (Louis Vuitton)', tip: 'เช็ดผ้าด้วยผ้าชื้น หนัง vachetta (ขอบหนังธรรมชาติ) จะดำขึ้นตามการใช้งาน — นี่คือสีที่เข้มขึ้นตามธรรมชาติ ไม่ใช่ความเสียหาย อย่าบำรุง vachetta — จะดำขึ้นไม่สม่ำเสมอ' },
            { type: 'หนัง Clemence/Togo (Hermès)', tip: 'หนัง Hermès ที่อดทนที่สุด เช็ดด้วยผ้าชื้น แล้วเช็ดให้แห้งทันที ใช้ครีมบำรุงหนังเบาๆ ทุก 3–6 เดือน' },
            { type: 'ไนลอน/Re-Nylon (Prada)', tip: 'ทำความสะอาดจุดด้วยสบู่อ่อนและน้ำ สำหรับการทำความสะอาดลึกขึ้น ปรึกษา Prada — บางชิ้นสามารถซักมือเบาๆ ได้' },
          ]).map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <strong className="text-gray-900 text-sm">{item.type}</strong>
              <p className="text-gray-600 text-sm mt-1">{item.tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          {isEn ? '3. Hardware Care' : '3. การดูแลฮาร์ดแวร์'}
        </h2>
        <ul className="text-sm text-gray-600 space-y-3">
          {(isEn ? [
            'Gold hardware: Wipe with a dry soft cloth. Avoid abrasive cleaners — they remove the plating. For dullness, a jeweller\'s polishing cloth works well.',
            'Silver/palladium hardware: More prone to tarnish in humid climates. Wipe after each use and store with an anti-tarnish strip in the dust bag.',
            'Ruthenium (YSL dark hardware): Very durable but shows fingerprints. Regular dry cloth wipe is all needed.',
            'Zippers: Apply a tiny amount of beeswax to the zipper teeth if stiff — not oil or WD-40.',
          ] : [
            'ฮาร์ดแวร์ทอง: เช็ดด้วยผ้านุ่มแห้ง หลีกเลี่ยงน้ำยาขัดที่ขัดสี — จะลอกการชุบ สำหรับความหมองคล้ำ ผ้าขัดเงาของช่างทองให้ผลดี',
            'ฮาร์ดแวร์เงิน/พัลลาเดียม: เกิดสนิมง่ายในสภาพอากาศชื้น เช็ดหลังใช้แต่ละครั้งและเก็บกับแผ่นป้องกันสนิมในถุงผ้า',
            'Ruthenium (ฮาร์ดแวร์ YSL สีเข้ม): ทนทานมากแต่แสดงลายนิ้วมือ เช็ดผ้าแห้งเป็นประจำก็พอ',
            'ซิป: ทาขี้ผึ้งผึ้งเล็กน้อยที่ฟันซิปหากแน่น — ไม่ใช่น้ำมันหรือ WD-40',
          ]).map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gray-400 flex-shrink-0">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          {isEn ? '4. Humidity — The #1 Enemy in Thailand' : '4. ความชื้น — ศัตรูหมายเลข 1 ในไทย'}
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-900 mb-4">
          <strong>{isEn ? 'Warning:' : 'คำเตือน:'}</strong>
          <span className="ml-2">
            {isEn
              ? 'Mold can grow inside a luxury bag stored in a closed cabinet in Thailand in as little as 2–3 weeks during monsoon season. Never store bags without silica gel in humid months.'
              : 'เชื้อราสามารถเจริญเติบโตภายในกระเป๋าที่เก็บในตู้ปิดในไทยได้ภายใน 2–3 สัปดาห์ในช่วงมรสุม อย่าเก็บกระเป๋าโดยไม่มีซิลิกาเจลในช่วงเดือนที่ชื้น'}
          </span>
        </div>
        <ul className="text-sm text-gray-600 space-y-3">
          {(isEn ? [
            'Run your storage area\'s air conditioning or dehumidifier regularly — humidity should stay below 55%.',
            'Air bags out once a month: remove from dust bag, leave open in an air-conditioned room for an hour.',
            'Never store bags in plastic bags or airtight containers — moisture gets trapped inside.',
            'If you spot white spots (mold): act immediately. Wipe with a cloth dampened with diluted white vinegar (1:1 with water), dry thoroughly, then condition. For severe mold, see a professional leather spa in Bangkok.',
          ] : [
            'เปิดแอร์หรือเครื่องลดความชื้นในพื้นที่เก็บรักษาอย่างสม่ำเสมอ — ความชื้นควรต่ำกว่า 55%',
            'นำกระเป๋าออกระบายอากาศเดือนละครั้ง: นำออกจากถุงผ้า วางเปิดในห้องปรับอากาศ 1 ชั่วโมง',
            'อย่าเก็บกระเป๋าในถุงพลาสติกหรือภาชนะปิดสนิท — ความชื้นจะถูกดักจับข้างใน',
            'หากพบจุดขาว (รา): ดำเนินการทันที เช็ดด้วยผ้าชุ่มน้ำส้มสายชูขาวเจือจาง (1:1 กับน้ำ) เช็ดให้แห้งสนิท แล้วบำรุง สำหรับราที่รุนแรง ให้ไปที่ร้านดูแลหนังมืออาชีพในกรุงเทพฯ',
          ]).map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gray-400 flex-shrink-0">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Related Guides' : 'คู่มือที่เกี่ยวข้อง'}
        </h2>
        <div className="flex gap-3 flex-wrap">
          <Link href={`/${locale}/guides/how-to-spot-fake-luxury-bags`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
            {isEn ? 'How to Spot Fakes →' : 'วิธีสังเกตของปลอม →'}
          </Link>
          <Link href={`/${locale}/guides/luxury-bags-as-investments`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
            {isEn ? 'Bags as Investments →' : 'กระเป๋าเพื่อการลงทุน →'}
          </Link>
        </div>
      </section>

      <div className="mt-8">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-care-for-luxury-bags" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-care-for-luxury-bags" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
      </div>
    </div>
  )
}
