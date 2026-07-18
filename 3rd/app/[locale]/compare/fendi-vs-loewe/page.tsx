import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/fendi-vs-loewe'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Fendi vs Loewe: Pre-Owned Bags Thailand 2025 | ChicPreowned' : 'Fendi vs Loewe: กระเป๋ามือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Fendi Baguette vs Loewe Puzzle for Thai buyers — THB pre-owned prices, value retention, and which to buy in Bangkok 2025.'
      : 'Fendi Baguette vs Loewe Puzzle สำหรับผู้ซื้อชาวไทย — ราคามือสองบาท อัตราการรักษามูลค่า และซื้ออะไรดีในกรุงเทพ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function FendiVsLoeweTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const fendiItems = getItemsByBrand('fendi').filter(i => i.price_ranges?.very_good).slice(0, 3)
  const loeweItems = getItemsByBrand('loewe').filter(i => i.price_ranges?.very_good).slice(0, 3)

  const rows = isEn ? [
    { aspect: 'Iconic bag', fendi: 'Baguette, Peekaboo, First', loewe: 'Puzzle, Hammock, Gate, Basket' },
    { aspect: 'Entry (THB pre-owned)', fendi: '฿24,000 (FF charm)', loewe: '฿22,000 (Gate Small)' },
    { aspect: 'Mid-range (THB)', fendi: '฿45,000–75,000 (Baguette)', loewe: '฿45,000–80,000 (Puzzle Small)' },
    { aspect: 'Value retention', fendi: '55–70% (Baguette: 65–75%)', loewe: '55–75% (Puzzle: 65–80%)' },
    { aspect: 'Thailand recognition', fendi: 'High (BTS/Siam crowd recognizes)', loewe: 'Medium-high (design crowd)' },
    { aspect: 'Best pre-owned buy', fendi: 'Baguette 1997 original shape', loewe: 'Puzzle Small Calfskin (Anderson era)' },
  ] : [
    { aspect: 'กระเป๋าไอคอนิก', fendi: 'Baguette, Peekaboo, First', loewe: 'Puzzle, Hammock, Gate, Basket' },
    { aspect: 'ราคาเริ่มต้น (บาทมือสอง)', fendi: '24,000 บาท (FF charm)', loewe: '22,000 บาท (Gate Small)' },
    { aspect: 'ราคากลาง (บาท)', fendi: '45,000–75,000 บาท (Baguette)', loewe: '45,000–80,000 บาท (Puzzle Small)' },
    { aspect: 'อัตราการรักษามูลค่า', fendi: '55–70% (Baguette: 65–75%)', loewe: '55–75% (Puzzle: 65–80%)' },
    { aspect: 'การรู้จักในไทย', fendi: 'สูง (คนแถว BTS/สยามรู้จัก)', loewe: 'ปานกลาง-สูง (กลุ่มคนรักแฟชั่น)' },
    { aspect: 'ซื้อมือสองดีที่สุด', fendi: 'Baguette 1997 ทรงดั้งเดิม', loewe: 'Puzzle Small Calfskin (ยุค Anderson)' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Fendi vs Loewe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Fendi vs Loewe: Pre-Owned Bags in Thailand 2025' : 'Fendi vs Loewe: กระเป๋ามือสองในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Baguette vs Puzzle — which is the better pre-owned buy for the Thai market?'
          : 'Baguette vs Puzzle — ซื้ออะไรดีกว่าสำหรับตลาดไทย?'}
      </p>

      <section className="mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'หัวข้อ'}</th>
                <th className="text-left py-3 px-4 font-semibold">Fendi</th>
                <th className="text-left py-3 px-4 font-semibold">Loewe</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.fendi}</td>
                  <td className="py-3 px-4 text-gray-600">{row.loewe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Verdict for Thai Buyers' : 'บทสรุปสำหรับผู้ซื้อชาวไทย'}
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          {isEn ? <>
            <div className="border-l-4 border-green-400 pl-4"><strong className="text-gray-900">Buy Fendi</strong> if you want high street recognition in Bangkok and love the Baguette's nostalgic shape</div>
            <div className="border-l-4 border-purple-400 pl-4"><strong className="text-gray-900">Buy Loewe</strong> if you want the Puzzle's architectural flair and Jonathan Anderson-era collector appeal</div>
            <div className="border-l-4 border-blue-400 pl-4"><strong className="text-gray-900">Thai resale:</strong> Both sell well on Carousell TH and Line Market — Fendi faster due to higher recognition</div>
          </> : <>
            <div className="border-l-4 border-green-400 pl-4"><strong className="text-gray-900">ซื้อ Fendi</strong> ถ้าต้องการการจดจำบนถนนในกรุงเทพและชอบทรง Baguette แบบ nostalgia</div>
            <div className="border-l-4 border-purple-400 pl-4"><strong className="text-gray-900">ซื้อ Loewe</strong> ถ้าต้องการ Puzzle ทรงสถาปัตยกรรมและ appeal ของนักสะสมยุค Jonathan Anderson</div>
            <div className="border-l-4 border-blue-400 pl-4"><strong className="text-gray-900">ขายต่อในไทย:</strong> ทั้งคู่ขายดีบน Carousell TH และ Line Market — Fendi เร็วกว่าเพราะเป็นที่รู้จักมากกว่า</div>
          </>}
        </div>
      </section>

      {(fendiItems.length > 0 || loeweItems.length > 0) && (
        <section className="mb-10">
          <div className="grid md:grid-cols-2 gap-6">
            {fendiItems.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Fendi {isEn ? 'Pre-Owned' : 'มือสอง'}</h3>
                {fendiItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <Link href={`/${locale}/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                    <span className="text-gray-500">{formatPriceTHB(item.price_ranges.very_good!.min)}+</span>
                  </div>
                ))}
              </div>
            )}
            {loeweItems.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Loewe {isEn ? 'Pre-Owned' : 'มือสอง'}</h3>
                {loeweItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <Link href={`/${locale}/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                    <span className="text-gray-500">{formatPriceTHB(item.price_ranges.very_good!.min)}+</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/fendi-vs-loewe" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/fendi-vs-loewe" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/fendi`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi Guide →</Link>
        <Link href={`/${locale}/brands/loewe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe Guide →</Link>
      </div>
    </div>
  )
}
