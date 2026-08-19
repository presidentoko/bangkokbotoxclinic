import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/best-luxury-bags-under-3000'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Best Pre-Owned Luxury Bags Under ฿108,000 in Thailand ${PRICE_YEAR} | ChicPreowned`
      : `กระเป๋าหรูมือสองที่ดีที่สุดต่ำกว่า ฿108,000 ในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? `Best pre-owned luxury bags under $3,000 / ฿108,000 for Thai buyers ${PRICE_YEAR} — Louis Vuitton, Prada, Celine, Gucci, Bottega picks with THB prices and Bangkok market context.`
      : `กระเป๋าหรูมือสองที่ดีที่สุดต่ำกว่า ฿108,000 สำหรับผู้ซื้อชาวไทย ${PRICE_YEAR} ราคาบาทและบริบทตลาดกรุงเทพ`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function BestBagsUnder3000TH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const picks = isEn ? [
    { brand: 'Louis Vuitton', bag: 'Neverfull MM (Monogram)', price: `${formatPriceTHB(1000)}–${formatPriceTHB(1600)}`, why: 'The most recognized bag in the world, pre-owned Neverfull in excellent condition is 30–50% below current retail. Extremely liquid in Bangkok — sells in any market, any condition. The Monogram Neverfull is the most defensible first pre-owned purchase in this price range.', watchFor: 'Pre-2022 pieces have a date code inside; 2022+ have a microchip. Any seller unable to show the date code on older pieces is a red flag.', resale: '65–80% — safest resale in this range' },
    { brand: 'Prada', bag: 'Re-Edition 2000 Mini (Re-Nylon)', price: `${formatPriceTHB(500)}–${formatPriceTHB(900)}`, why: 'The most affordable entry into a serious luxury brand. Lightweight, functional, recognizable to fashion-literate eyes in Bangkok. The Re-Edition captured the 2021 nostalgia wave and became a permanent Prada staple.', watchFor: 'Check the enamel triangle logo plate for chipping (common wear point). Seams where nylon meets leather trim should be clean.', resale: '60–75% — good liquidity at low entry price' },
    { brand: 'Celine', bag: 'Luggage Nano', price: `${formatPriceTHB(900)}–${formatPriceTHB(1500)}`, why: 'The quietest status symbol in the "quiet luxury" trend. At Nano size (20cm), works as crossbody or top-handle. One of the best quiet-luxury statements under ฿54,000 for Bangkok buyers who want designer recognition without visible logos.', watchFor: 'CÉLINE (Phoebe Philo era, pre-2018) vs CELINE (Hedi Slimane era, post-2018). Philo-era pieces now command a premium. Know which era you are buying.', resale: '50–65% — moderate liquidity' },
    { brand: 'Dior', bag: 'Book Tote (Canvas)', price: `${formatPriceTHB(700)}–${formatPriceTHB(1200)}`, why: 'The most functional Dior bag. Large, structured, toile de jouy pattern. Pre-owned canvas under ฿43,200 is excellent value given retail is now ฿100,800+. Canvas condition holds better than leather — light marks are largely invisible.', watchFor: 'Interior canvas lining stains are harder to clean than leather. Check the interior carefully before purchasing.', resale: '55–70% — steady canvas demand' },
    { brand: 'Gucci', bag: 'Dionysus Small (GG Supreme)', price: `${formatPriceTHB(600)}–${formatPriceTHB(1200)}`, why: 'One of the most collected Gucci pieces from the Alessandro Michele era. GG Supreme canvas is lower maintenance than leather. At ฿21,600–฿43,200 pre-owned, excellent access to one of the most creative recent luxury director runs.', watchFor: 'Michele-era preferred by collectors (hardware, interior stamp differs from 2024+ De Sarno era). Check which era before buying.', resale: '55–70% for Michele-era' },
    { brand: 'Bottega Veneta', bag: 'Jodie Small', price: `${formatPriceTHB(1200)}–${formatPriceTHB(1800)}`, why: 'Zero visible branding, pure Intrecciato weave. Under ฿64,800, the Jodie Small positions you in the strongest-growing quiet luxury segment. Exceptional pre-owned value for Bangkok buyers wanting understatement over status.', watchFor: 'Blazy-era (2022+) has rounder shape vs Lee-era. Both authentic; prices differ. Check weave tightness — uneven weave is a fake indicator.', resale: '70–85% — strongest in this price tier' },
  ] : [
    { brand: 'Louis Vuitton', bag: 'Neverfull MM (Monogram)', price: `${formatPriceTHB(1000)}–${formatPriceTHB(1600)}`, why: 'กระเป๋าที่เป็นที่รู้จักมากที่สุดในโลก Neverfull มือสองสภาพดีเยี่ยมอยู่ที่ 30–50% ต่ำกว่าราคาร้านปัจจุบัน สภาพคล่องสูงในกรุงเทพ ขายได้ในทุกตลาด ทุกสภาพ Monogram Neverfull คือการซื้อมือสองครั้งแรกที่ปลอดภัยที่สุดในช่วงราคานี้', watchFor: 'ชิ้นก่อนปี 2022 มีรหัสวันที่ภายใน 2022+ มีไมโครชิป ผู้ขายที่ไม่แสดงรหัสวันที่ในชิ้นเก่าถือเป็น red flag', resale: '65–80% — ขายต่อปลอดภัยที่สุดในช่วงราคานี้' },
    { brand: 'Prada', bag: 'Re-Edition 2000 Mini (Re-Nylon)', price: `${formatPriceTHB(500)}–${formatPriceTHB(900)}`, why: 'ราคาเริ่มต้นที่ถูกที่สุดเพื่อเข้าสู่แบรนด์ luxury จริงจัง เบา ใช้งานได้ เป็นที่รู้จักในกลุ่มผู้ที่รู้เรื่องแฟชั่นในกรุงเทพ Re-Edition จับกระแส nostalgia ปี 2021 และกลายเป็นสินค้าประจำของ Prada', watchFor: 'ตรวจสอบแผ่นโลโก้รูปสามเหลี่ยมเคลือบสีว่ามีการหลุดล่อน (จุดสึกหรอทั่วไป) ตะเข็บที่ nylon พบหนังควรสะอาด', resale: '60–75% — สภาพคล่องดีที่ราคาเริ่มต้นต่ำ' },
    { brand: 'Celine', bag: 'Luggage Nano', price: `${formatPriceTHB(900)}–${formatPriceTHB(1500)}`, why: 'สัญลักษณ์แสดงสถานะที่เงียบที่สุดในเทรนด์ "quiet luxury" ขนาด Nano (20 ซม.) ใช้ได้ทั้งข้ามตัวและมือถือ หนึ่งในการแสดงออก quiet luxury ที่ดีที่สุดต่ำกว่า ฿54,000 สำหรับผู้ซื้อกรุงเทพที่ต้องการการยอมรับจากดีไซเนอร์โดยไม่มีโลโก้ที่มองเห็นได้', watchFor: 'CÉLINE (ยุค Phoebe Philo ก่อนปี 2018) vs CELINE (ยุค Hedi Slimane หลังปี 2018) ชิ้นยุค Philo ตอนนี้มีราคาสูงกว่า รู้ว่าคุณซื้อยุคไหน', resale: '50–65% — สภาพคล่องปานกลาง' },
    { brand: 'Dior', bag: 'Book Tote (Canvas)', price: `${formatPriceTHB(700)}–${formatPriceTHB(1200)}`, why: 'กระเป๋า Dior ที่ใช้งานได้มากที่สุด ใหญ่ มีโครงสร้าง ลาย toile de jouy มือสอง canvas ต่ำกว่า ฿43,200 คือมูลค่าที่ยอดเยี่ยมเมื่อราคาร้านตอนนี้สูงกว่า ฿100,800 สภาพ canvas ดีกว่าหนัง รอยเล็กน้อยส่วนใหญ่มองไม่เห็นบน canvas', watchFor: 'คราบบนผ้าซับในด้านในทำความสะอาดได้ยากกว่าหนัง ตรวจสอบด้านในอย่างละเอียดก่อนซื้อ', resale: '55–70% — ความต้องการ canvas คงที่' },
    { brand: 'Gucci', bag: 'Dionysus Small (GG Supreme)', price: `${formatPriceTHB(600)}–${formatPriceTHB(1200)}`, why: 'หนึ่งในชิ้น Gucci ที่นักสะสมมากที่สุดจากยุค Alessandro Michele GG Supreme canvas ดูแลรักษาง่ายกว่าหนัง ที่ ฿21,600–฿43,200 มือสอง เป็นโอกาสที่ดีในการเข้าถึงหนึ่งในผู้กำกับ luxury สร้างสรรค์ที่สุดในยุคล่าสุด', watchFor: 'ยุค Michele ได้รับความนิยมจากนักสะสม (hardware ตราประทับภายในแตกต่างจากยุค De Sarno 2024+) ตรวจสอบยุคก่อนซื้อ', resale: '55–70% สำหรับยุค Michele' },
    { brand: 'Bottega Veneta', bag: 'Jodie Small', price: `${formatPriceTHB(1200)}–${formatPriceTHB(1800)}`, why: 'ไม่มี branding ที่มองเห็นได้ ลาย Intrecciato ล้วนๆ ต่ำกว่า ฿64,800 Jodie Small จัดวางคุณในกลุ่ม quiet luxury ที่เติบโตแข็งแกร่งที่สุด มูลค่ามือสองที่ยอดเยี่ยมสำหรับผู้ซื้อกรุงเทพที่ต้องการความเรียบง่ายมากกว่าสถานะ', watchFor: 'ยุค Blazy (2022+) มีรูปร่างกลมกว่า vs ยุค Lee ทั้งคู่ของแท้ ราคาต่างกัน ตรวจสอบความแน่นของลาย Intrecciato ลายหลวมไม่สม่ำเสมอคือสัญญาณของปลอม', resale: '70–85% — แข็งแกร่งที่สุดในช่วงราคานี้' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Best Bags Under $3,000' : 'กระเป๋าที่ดีที่สุดต่ำกว่า ฿108k'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Best Pre-Owned Luxury Bags Under $3,000 (฿108,000) in ${PRICE_YEAR}` : `กระเป๋าหรูมือสองที่ดีที่สุดต่ำกว่า ฿108,000 ในปี ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The best value-to-prestige ratio in pre-owned luxury is under $3,000. These six picks are selected for brand recognition in Thailand, resale flexibility in the Bangkok market, and why they make sense as your first or next pre-owned purchase.'
          : 'อัตราส่วนมูลค่าต่อศักดิ์ศรีที่ดีที่สุดใน luxury มือสองอยู่ที่ต่ำกว่า ฿108,000 หกตัวเลือกนี้ถูกคัดสรรเพื่อการรับรู้แบรนด์ในไทย ความยืดหยุ่นในการขายต่อในตลาดกรุงเทพ และเหตุผลที่ควรซื้อเป็นครั้งแรกหรือครั้งถัดไป'}
      </p>

      <div className="space-y-5 mb-10">
        {picks.map((p, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-3">
              <div>
                <h2 className="font-bold text-gray-900">{p.brand}: {p.bag}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{p.resale}</p>
              </div>
              <div className="shrink-0 font-semibold text-amber-700">{p.price}</div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{p.why}</p>
            <p className="text-xs text-amber-700 bg-amber-50 rounded px-3 py-2"><strong>{isEn ? 'Watch for' : 'ระวัง'}: </strong>{p.watchFor}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/best-luxury-bags-under-3000" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/best-luxury-bags-under-3000" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/first-luxury-bag`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'First Luxury Bag Guide →' : 'คู่มือกระเป๋าแรก →'}</Link>
        <Link href={`/${locale}/guides/luxury-bags-as-investments`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Bags as Investments →' : 'กระเป๋าเป็นการลงทุน →'}</Link>
      </div>
    </div>
  )
}
