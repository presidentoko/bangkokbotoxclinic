import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/chanel-price-increase-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Chanel Price Increases 2025 Thailand | ChicPreowned'
      : 'ราคา Chanel เพิ่มขึ้น 2025 ในไทย | ChicPreowned',
    description: isEn
      ? 'Chanel raised prices 40+ times since 2019. Classic Flap doubled. How Chanel price increases affect pre-owned values in Thailand — THB impact 2025.'
      : 'Chanel ขึ้นราคากว่า 40 ครั้งตั้งแต่ปี 2019 Classic Flap ราคาเพิ่มเป็น 2 เท่า ผลกระทบต่อมูลค่า Chanel มือสองในไทย ราคาบาท 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function ChanelPriceIncreaseTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const increases = isEn ? [
    { year: '2019', classic_flap: `$5,400 / ${formatPriceTHB(5400)}`, boy: `$4,000 / ${formatPriceTHB(4000)}`, note: 'Pre-pandemic baseline' },
    { year: '2021', classic_flap: `$7,400 / ${formatPriceTHB(7400)}`, boy: `$5,400 / ${formatPriceTHB(5400)}`, note: '+37% from 2019' },
    { year: '2023', classic_flap: `$9,500 / ${formatPriceTHB(9500)}`, boy: `$6,300 / ${formatPriceTHB(6300)}`, note: '+28% from 2021' },
    { year: '2025 (now)', classic_flap: `$10,800 / ${formatPriceTHB(10800)}`, boy: `$7,200 / ${formatPriceTHB(7200)}`, note: '2× price since 2019' },
  ] : [
    { year: '2019', classic_flap: `${formatPriceTHB(5400)}`, boy: `${formatPriceTHB(4000)}`, note: 'ก่อน COVID' },
    { year: '2021', classic_flap: `${formatPriceTHB(7400)}`, boy: `${formatPriceTHB(5400)}`, note: '+37% จากปี 2019' },
    { year: '2023', classic_flap: `${formatPriceTHB(9500)}`, boy: `${formatPriceTHB(6300)}`, note: '+28% จากปี 2021' },
    { year: '2025 (ปัจจุบัน)', classic_flap: `${formatPriceTHB(10800)}`, boy: `${formatPriceTHB(7200)}`, note: 'ราคาเพิ่มขึ้น 2 เท่าจากปี 2019' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Chanel Price Increases 2025' : 'ราคา Chanel เพิ่มขึ้น 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Chanel Price Increases 2025' : 'ราคา Chanel เพิ่มขึ้น 2025'}
      </h1>
      <p className="text-gray-500 mb-6">
        {isEn
          ? 'Chanel raised prices 40+ times since 2019. The Classic Flap doubled from $5,400 to $10,800. For Thai buyers, this means a pre-owned Classic Flap at ฿270,000–฿320,000 today could be worth ฿360,000+ in two years — without you carrying it.'
          : 'Chanel ขึ้นราคากว่า 40 ครั้งตั้งแต่ปี 2019 Classic Flap ราคาเพิ่มเป็น 2 เท่า สำหรับผู้ซื้อชาวไทย หมายความว่า Classic Flap มือสอง ฿270,000–฿320,000 ในวันนี้ อาจมีมูลค่า ฿360,000+ ในอีกสองปี — โดยไม่ต้องเก็บไว้'}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <p className="text-sm text-amber-800">
          {isEn
            ? 'The math: Classic Flap 2019 = ฿194,400. Classic Flap 2025 = ฿388,800. Pre-owned buyers in 2019 who resold in 2025 profited — even after years of carrying the bag.'
            : 'คำนวณ: Classic Flap 2019 = ฿194,400 ผู้ซื้อมือสองในปี 2019 ที่ขายต่อในปี 2025 มีกำไร แม้หลังจากใช้งานหลายปี Classic Flap 2025 = ฿388,800'}
        </p>
      </div>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">{isEn ? 'Year' : 'ปี'}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Classic Flap M</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Boy Bag M</th>
              <th className="text-left py-3 px-4 text-gray-500">{isEn ? 'Note' : 'หมายเหตุ'}</th>
            </tr>
          </thead>
          <tbody>
            {increases.map((r, i) => (
              <tr key={i} className={`border-b border-gray-100 ${i === increases.length - 1 ? 'bg-gray-50 font-medium' : ''}`}>
                <td className="py-3 px-4 text-gray-900">{r.year}</td>
                <td className="py-3 px-4 text-gray-700">{r.classic_flap}</td>
                <td className="py-3 px-4 text-gray-700">{r.boy}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 mb-10">
        {(isEn ? [
          { title: 'Buy pre-owned at 65–80% of retail — and wait', body: 'A Very Good Classic Flap at ฿270,000 vs retail ฿388,800. When retail reaches ฿430,000 (likely 2026), your pre-owned bag appreciates while you carry it.' },
          { title: 'Classic only — not seasonal', body: 'Classic Flap (caviar/lambskin, black), Boy Bag (ruthenium hardware), and WOC follow the price escalation. Seasonal Chanel pieces lose value — they are fashion, not investment.' },
          { title: 'Condition grade is everything', body: 'A 2018 Classic Flap in Excellent condition outperforms a 2022 bag in Good condition. Scratched corner stitching = ฿18,000 off. Scratched hardware = ฿36,000 off.' },
        ] : [
          { title: 'ซื้อมือสองที่ 65–80% ของราคาร้าน แล้วรอ', body: 'Classic Flap สภาพดีมาก ฿270,000 เทียบกับราคาร้าน ฿388,800 เมื่อราคาร้านถึง ฿430,000 (น่าจะปี 2026) กระเป๋ามือสองของคุณเพิ่มมูลค่าในขณะที่คุณใช้งาน' },
          { title: 'เฉพาะรุ่น Classic เท่านั้น ไม่ใช่ seasonal', body: 'Classic Flap (caviar/lambskin สีดำ) Boy Bag (hardware ruthenium) และ WOC ตามการปรับราคา Chanel seasonal ลดมูลค่า — เป็นแฟชั่น ไม่ใช่การลงทุน' },
          { title: 'เกรดสภาพสำคัญที่สุด', body: 'Classic Flap ปี 2018 สภาพ Excellent มีมูลค่าสูงกว่ากระเป๋าปี 2022 สภาพ Good การเย็บมุมขูด = ลด ฿18,000 hardware ขูด = ลด ฿36,000' },
        ]).map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
            <p className="text-sm text-gray-600">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/chanel-price-increase-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/chanel-price-increase-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Chanel Pre-Owned →' : 'Chanel มือสอง →'}</Link>
        <Link href={`/${locale}/guides/chanel-price-history`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Full Price History →' : 'ประวัติราคาเต็ม →'}</Link>
      </div>
    </div>
  )
}
