import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/lv-vs-celine'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Louis Vuitton vs Céline Pre-Owned Thailand 2025 | ChicPreowned' : 'Louis Vuitton vs Céline มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'LV vs Céline for Thai buyers — Neverfull vs Luggage THB prices, value retention, which is better pre-owned in Thailand.'
      : 'LV vs Céline สำหรับคนไทย — ราคา Neverfull vs Luggage บาท รักษามูลค่า อันไหนดีกว่าซื้อมือสองในไทย',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function LVVsCelineTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const lvItems = getItemsByBrand('louis vuitton').filter(i => i.price_ranges?.very_good).slice(0, 2)
  const celineItems = getItemsByBrand('celine').filter(i => i.price_ranges?.very_good).slice(0, 2)

  const rows = isEn ? [
    { aspect: 'Entry pre-owned (THB)', lv: '฿19,000 (accessories) · ฿25,000 (Neverfull PM)', celine: '฿17,000 (wallets) · ฿24,000 (Luggage Nano)' },
    { aspect: 'Iconic bag', lv: 'Neverfull — most-traded pre-owned bag globally', celine: 'Luggage Tote (Philo era) — niche premium' },
    { aspect: 'Value retention', lv: '70–90% (Monogram/DE canvas) — extremely stable', celine: '45–65% (current) · Philo era +15–25%' },
    { aspect: 'Thailand market', lv: 'Strongest secondary demand in TH — wide buyer pool', celine: 'Smaller market. Philo pieces sought by fashion insiders' },
    { aspect: 'Liquidity', lv: 'High — Monogram sells within days on Thai platforms', celine: 'Medium — takes longer; Philo pieces to collectors' },
  ] : [
    { aspect: 'ราคาเริ่มต้นมือสอง (บาท)', lv: '19,000 บาท (อุปกรณ์) · 25,000 บาท (Neverfull PM)', celine: '17,000 บาท (กระเป๋าสตางค์) · 24,000 บาท (Luggage Nano)' },
    { aspect: 'กระเป๋าไอคอน', lv: 'Neverfull — กระเป๋ามือสองที่ซื้อขายมากที่สุดในโลก', celine: 'Luggage Tote (ยุค Philo) — niche premium' },
    { aspect: 'รักษามูลค่า', lv: '70–90% (canvas Monogram/DE) — เสถียรมาก', celine: '45–65% (ปัจจุบัน) · ยุค Philo +15–25%' },
    { aspect: 'ตลาดไทย', lv: 'ความต้องการมือสองแข็งแกร่งที่สุดในไทย — ฐานผู้ซื้อกว้าง', celine: 'ตลาดเล็กกว่า Philo pieces ต้องการโดยคนแฟชั่น insider' },
    { aspect: 'สภาพคล่อง', lv: 'สูง — Monogram ขายได้ภายในไม่กี่วันบน platform ไทย', celine: 'กลาง — ใช้เวลานานกว่า Philo pieces ไปหาผู้สะสม' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบ'}</Link>
        <span className="mx-2">/</span>
        <span>LV vs Céline</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Louis Vuitton vs Céline Pre-Owned in Thailand' : 'Louis Vuitton vs Céline มือสองในไทย'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'LV is monogram-forward with massive Thai market demand; Céline (Philo era) is minimalist with a niche but dedicated following. Very different dynamics for Thai buyers.'
          : 'LV มีโลโก้ชัดเจนและความต้องการตลาดไทยสูงมาก Céline (ยุค Philo) เป็นมินิมัลด้วยผู้ติดตามที่เฉพาะแต่ทุ่มเท พลวัตต่างกันมากสำหรับคนไทย'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'หัวข้อ'}</th>
              <th className="text-left py-3 px-4 font-semibold">Louis Vuitton</th>
              <th className="text-left py-3 px-4 font-semibold">Céline</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.lv}</td>
                <td className="py-3 px-4 text-gray-600">{row.celine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(lvItems.length > 0 || celineItems.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {lvItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">LV {isEn ? 'Pre-Owned' : 'มือสอง'}</h3>
              {lvItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${locale}/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPriceTHB(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
            </div>
          )}
          {celineItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Céline {isEn ? 'Pre-Owned' : 'มือสอง'}</h3>
              {celineItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${locale}/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPriceTHB(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/lv-vs-celine" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/lv-vs-celine" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV →</Link>
        <Link href={`/${locale}/brands/celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Céline →</Link>
        <Link href={`/${locale}/compare/dior-vs-celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Céline →</Link>
      </div>
    </div>
  )
}
