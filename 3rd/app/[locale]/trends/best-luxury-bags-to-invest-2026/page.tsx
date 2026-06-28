import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/best-luxury-bags-to-invest-2026'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Best Luxury Bags to Invest In 2026 Thailand: Ranked by Resale | ChicPreowned'
      : 'กระเป๋าหรูที่ดีที่สุดในการลงทุน 2026 ในไทย: จัดอันดับตามการขายต่อ | ChicPreowned',
    description: isEn
      ? 'Which luxury bags to invest in 2026 for Thai buyers? Hermès Birkin, Chanel Classic Flap, LV Neverfull — ranked by resale retention and 5-year appreciation. THB prices included.'
      : 'กระเป๋าหรูไหนลงทุนดีที่สุดในปี 2026 สำหรับผู้ซื้อชาวไทย? Hermès Birkin, Chanel Classic Flap, LV Neverfull จัดอันดับตามการรักษามูลค่าและการเพิ่มขึ้น 5 ปี รวมราคาบาท',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function BestBagsToInvest2026TH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const picks = isEn ? [
    {
      rank: 1, tier: 'S-Tier Investment',
      bag: 'Hermès Birkin 25 / 30 (Togo or Epsom)',
      retention: '110–160% of retail', fiveYear: '+40–60% appreciation',
      entryTHB: `From ${formatPriceTHB(9500)}+ pre-owned`,
      why: 'The single best handbag investment available. Retail access is allocation-only, creating persistent secondary market premium. Thai customs duties mean Bangkok Hermès retail is 15–20% above US prices — pre-owned is even more attractive for Thai buyers. Black or Gold Togo are most liquid.',
      note: 'Avoid exotic skins without expert authentication — misidentified skins are common in Thai secondary market.',
    },
    {
      rank: 2, tier: 'S-Tier Investment',
      bag: 'Chanel Classic Flap Medium (Caviar)',
      retention: '80–110% of retail', fiveYear: '+25–45% appreciation',
      entryTHB: `From ${formatPriceTHB(4200)}+ pre-owned`,
      why: 'Chanel raises retail prices ~10% every 6 months. A Classic Flap bought pre-owned two years ago has already appreciated. Caviar leather is more durable than lambskin and holds value better. Bangkok Chanel retail at Siam Paragon is among the most expensive in Asia — pre-owned saves 20–35%.',
      note: 'Authentication critical — CC clasp alignment, quilting symmetry, and interior serial stamp must all be verified.',
    },
    {
      rank: 3, tier: 'A-Tier Investment',
      bag: 'Hermès Kelly 28 / 35',
      retention: '100–145% of retail', fiveYear: '+30–55% appreciation',
      entryTHB: `From ${formatPriceTHB(8500)}+ pre-owned`,
      why: 'More accessible than Birkin through official retail, but still tightly allocation-controlled. The structured silhouette is formally preferred in Bangkok business circles. Sellier construction (external stitching) commands a premium over retourné (interior stitching).',
      note: 'Kelly 25 has become the fastest-appreciating small size since 2022.',
    },
    {
      rank: 4, tier: 'A-Tier Investment',
      bag: 'Louis Vuitton Neverfull MM (Monogram)',
      retention: '70–90% of retail', fiveYear: '+15–25% appreciation',
      entryTHB: `${formatPriceTHB(1200)}–${formatPriceTHB(1800)} pre-owned`,
      why: 'Most liquid pre-owned bag globally — outsells every other single model. Not the highest appreciation, but fastest to sell if you need liquidity. Thai buyers also find it practical for BTS and airport travel. Monogram is preferred over DE for resale.',
      note: 'Thailand duty on LV makes pre-owned even more attractive vs buying new at Siam Paragon.',
    },
    {
      rank: 5, tier: 'B-Tier Investment',
      bag: 'Bottega Veneta Jodie / Arco Tote',
      retention: '50–70% of retail', fiveYear: '+5–15% appreciation',
      entryTHB: `${formatPriceTHB(900)}–${formatPriceTHB(2200)} pre-owned`,
      why: 'BV\'s "quiet luxury" positioning is insulated from trend cycles. The Intrecciato weave is hard to fake at high quality — authentication is easier than most brands. Cloud, Butter, and Fondant colours command premiums. Growing popularity among Bangkok business professionals.',
      note: 'Vintage BV (pre-2018) is undervalued — the weave quality was excellent and fakes are less common.',
    },
    {
      rank: 6, tier: 'B-Tier Investment',
      bag: 'Celine Classic Box (Philo era, pre-2018)',
      retention: '60–85% of purchase price', fiveYear: '+10–30% appreciation',
      entryTHB: `${formatPriceTHB(500)}–${formatPriceTHB(1200)} pre-owned`,
      why: 'The Phoebe Philo label halo effect (2023+) has reignited demand for Philo-era Celine. Only pre-2018 pieces (no accent on CELINE). The Box and Phantom are strongest performers. Growing presence in Bangkok\'s pre-owned market at Chatuchak and online platforms.',
      note: 'Verify Philo era: "CELINE" without accent (not "CÉLINE") on interior stamp.',
    },
  ] : [
    {
      rank: 1, tier: 'S-Tier การลงทุน',
      bag: 'Hermès Birkin 25 / 30 (Togo หรือ Epsom)',
      retention: '110–160% ของราคาร้าน', fiveYear: '+40–60% การเพิ่มขึ้น',
      entryTHB: `จาก ${formatPriceTHB(9500)}+ มือสอง`,
      why: 'การลงทุนกระเป๋าที่ดีที่สุดเท่าที่มี การเข้าถึงร้านค้าปลีกเป็นแบบ allocation เท่านั้น สร้างพรีเมียมตลาดรองที่ต่อเนื่อง ภาษีศุลกากรไทยทำให้ Hermès กรุงเทพแพงกว่า US 15–20% มือสองน่าสนใจกว่าสำหรับผู้ซื้อไทย สีดำหรือ Gold Togo เป็น liquid มากที่สุด',
      note: 'หลีกเลี่ยงหนังสัตว์ exotic โดยไม่มีผู้เชี่ยวชาญยืนยัน หนังที่ระบุผิดพบบ่อยในตลาดรองไทย',
    },
    {
      rank: 2, tier: 'S-Tier การลงทุน',
      bag: 'Chanel Classic Flap Medium (Caviar)',
      retention: '80–110% ของราคาร้าน', fiveYear: '+25–45% การเพิ่มขึ้น',
      entryTHB: `จาก ${formatPriceTHB(4200)}+ มือสอง`,
      why: 'Chanel ขึ้นราคาร้านค้า ~10% ทุก 6 เดือน Classic Flap ที่ซื้อมือสองเมื่อ 2 ปีก่อนขึ้นราคาแล้ว หนัง Caviar ทนทานกว่า lambskin และรักษามูลค่าได้ดีกว่า ร้าน Chanel กรุงเทพที่ Siam Paragon แพงที่สุดในเอเชีย มือสองประหยัด 20–35%',
      note: 'ยืนยันความถูกต้องสำคัญมาก การจัดตำแหน่งตัวล็อค CC ความสมมาตรของลายตาราง และ serial stamp ภายในต้องตรวจสอบทั้งหมด',
    },
    {
      rank: 3, tier: 'A-Tier การลงทุน',
      bag: 'Hermès Kelly 28 / 35',
      retention: '100–145% ของราคาร้าน', fiveYear: '+30–55% การเพิ่มขึ้น',
      entryTHB: `จาก ${formatPriceTHB(8500)}+ มือสอง`,
      why: 'เข้าถึงได้ง่ายกว่า Birkin ผ่านร้านค้าปลีกอย่างเป็นทางการ แต่ยังควบคุมด้วย allocation อย่างเข้มงวด ซิลูเอตมีโครงสร้างได้รับความนิยมในแวดวงธุรกิจกรุงเทพ การก่อสร้าง Sellier (การเย็บด้านนอก) มีพรีเมียมเหนือ retourné',
      note: 'Kelly 25 กลายเป็นขนาดเล็กที่เพิ่มขึ้นเร็วที่สุดนับตั้งแต่ปี 2022',
    },
    {
      rank: 4, tier: 'A-Tier การลงทุน',
      bag: 'Louis Vuitton Neverfull MM (Monogram)',
      retention: '70–90% ของราคาร้าน', fiveYear: '+15–25% การเพิ่มขึ้น',
      entryTHB: `${formatPriceTHB(1200)}–${formatPriceTHB(1800)} มือสอง`,
      why: 'กระเป๋ามือสองที่ liquid ที่สุดทั่วโลก ขายดีกว่าทุก model เดียว ไม่ใช่การเพิ่มขึ้นสูงสุด แต่ขายเร็วที่สุดถ้าต้องการสภาพคล่อง ผู้ซื้อไทยพบว่าใช้งานได้จริงสำหรับ BTS และสนามบิน Monogram ได้รับความนิยมมากกว่า DE สำหรับการขายต่อ',
      note: 'ภาษีไทยบน LV ทำให้มือสองน่าสนใจยิ่งขึ้น vs ซื้อใหม่ที่ Siam Paragon',
    },
    {
      rank: 5, tier: 'B-Tier การลงทุน',
      bag: 'Bottega Veneta Jodie / Arco Tote',
      retention: '50–70% ของราคาร้าน', fiveYear: '+5–15% การเพิ่มขึ้น',
      entryTHB: `${formatPriceTHB(900)}–${formatPriceTHB(2200)} มือสอง`,
      why: 'การวางตำแหน่ง "quiet luxury" ของ BV ป้องกันจากวงจรเทรนด์ การทอ Intrecciato ยากต่อการปลอมในคุณภาพสูง การยืนยันความถูกต้องง่ายกว่าส่วนใหญ่ สี Cloud, Butter และ Fondant มีพรีเมียม ความนิยมเพิ่มขึ้นในหมู่มืออาชีพธุรกิจกรุงเทพ',
      note: 'BV vintage (ก่อนปี 2018) มีมูลค่าต่ำเกินไป คุณภาพการทอดีเยี่ยมและของปลอมน้อยกว่า',
    },
    {
      rank: 6, tier: 'B-Tier การลงทุน',
      bag: 'Celine Classic Box (ยุค Philo ก่อน 2018)',
      retention: '60–85% ของราคาซื้อ', fiveYear: '+10–30% การเพิ่มขึ้น',
      entryTHB: `${formatPriceTHB(500)}–${formatPriceTHB(1200)} มือสอง`,
      why: 'ผลเชิดชูของแบรนด์ Phoebe Philo (2023+) ได้จุดไฟความต้องการ Celine ยุค Philo ใหม่ เฉพาะชิ้นก่อนปี 2018 (ไม่มีสำเนียงบน CELINE) Box และ Phantom แข็งแกร่งที่สุด มีอยู่ในตลาดมือสองกรุงเทพที่ Chatuchak และแพลตฟอร์มออนไลน์',
      note: 'ยืนยันยุค Philo: "CELINE" ไม่มีสำเนียง (ไม่ใช่ "CÉLINE") บน stamp ภายใน',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Best Bags to Invest 2026' : 'กระเป๋าลงทุนดีที่สุด 2026'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Best Luxury Bags to Invest In 2026' : 'กระเป๋าหรูที่ดีที่สุดในการลงทุน 2026'}
      </h1>
      <p className="text-gray-500 mb-2">
        {isEn ? 'Ranked by 5-year appreciation rate and resale market liquidity. Thailand market context included.' : 'จัดอันดับตามอัตราการเพิ่มขึ้น 5 ปีและสภาพคล่องตลาดการขายต่อ รวมบริบทตลาดไทย'}
      </p>
      <p className="text-xs text-gray-400 mb-10">
        {isEn ? 'Based on secondary market data. Past appreciation does not guarantee future returns.' : 'อ้างอิงจากข้อมูลตลาดรอง ผลตอบแทนที่ผ่านมาไม่รับประกันผลตอบแทนในอนาคต'}
      </p>

      <div className="space-y-6 mb-12">
        {picks.map(p => (
          <div key={p.rank} className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">#{p.rank}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.tier.includes('S-Tier') ? 'bg-amber-100 text-amber-800' : p.tier.includes('A-Tier') ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.tier}</span>
                </div>
                <h2 className="font-bold text-gray-900">{p.bag}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{p.entryTHB}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-700">{p.retention}</p>
                <p className="text-xs text-amber-700">{p.fiveYear}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{p.why}</p>
            <p className="text-xs text-gray-400 italic">{p.note}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-900 mb-2">{isEn ? 'What NOT to invest in' : 'อะไรที่ไม่ควรลงทุน'}</h3>
          <ul className="text-sm text-red-800 space-y-1">
            {(isEn ? [
              'Gucci, Prada, Balenciaga — retention 40–60%, trend-sensitive',
              '"It bags" from last 2–3 years — no track record yet',
              'Exotic skins unless you can authenticate perfectly',
              'Limited editions without serial paperwork',
            ] : [
              'Gucci, Prada, Balenciaga — การรักษา 40–60% ขึ้นกับเทรนด์',
              '"It bags" จาก 2–3 ปีล่าสุด — ยังไม่มีประวัติ',
              'หนังสัตว์ exotic โดยไม่สามารถยืนยันได้อย่างสมบูรณ์',
              'Limited editions ที่ไม่มีกระดาษ serial',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Investment rules' : 'กฎการลงทุน'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              'Papers/receipt/dustbag add 10–20% to resale',
              'Neutral colors (black, gold, tan) outperform seasonal',
              'Classic gold hardware outperforms silver on Hermès',
              'Never clean leather yourself — use professionals',
            ] : [
              'กระดาษ/ใบเสร็จ/ถุงฝุ่นเพิ่ม 10–20% ในการขายต่อ',
              'สีกลาง (ดำ ทอง ตาล) ดีกว่าสีตามฤดูกาล',
              'ฮาร์ดแวร์ทองคลาสสิกดีกว่าเงินบน Hermès',
              'อย่าทำความสะอาดหนังเอง ใช้ผู้เชี่ยวชาญเท่านั้น',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/best-luxury-bags-to-invest-2026" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/best-luxury-bags-to-invest-2026" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/trends/hermes-birkin-price-increase-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Birkin {isEn ? 'Price History' : 'ประวัติราคา'} →</Link>
        <Link href={`/${locale}/compare/kelly-vs-birkin`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Kelly vs Birkin →</Link>
        <Link href={`/${locale}/trends/phoebe-philo-effect-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Philo-era Celine →</Link>
      </div>
    </div>
  )
}
