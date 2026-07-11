import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getItemsByBrand, getAllBrands } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

const BASE = 'https://www.chicpreowned.com'

interface BrandEditorial {
  body: string
  facts: string[]
}

function getBrandEditorial(slug: string, brandName: string, locale: string): BrandEditorial | null {
  const isTh = locale === 'th'

  const editorials: Record<string, { en: BrandEditorial; th: BrandEditorial }> = {
    chanel: {
      en: {
        body: 'Chanel bags are among the strongest-appreciating luxury assets of the past decade. Retail prices have increased over 70% since 2019. The Classic Flap and Boy Bag drive the most secondary-market volume in Thailand.',
        facts: [
          'Retail price up ~12% annually',
          'Black caviar leather holds value best',
          'Authentication: check CC turn-lock alignment',
          'Most searched brand in Thai resale market',
        ],
      },
      th: {
        body: 'กระเป๋า Chanel เป็นหนึ่งในสินทรัพย์ฟุ่มเฟือยที่มีมูลค่าเพิ่มขึ้นมากที่สุดในรอบทศวรรษ ราคาขายปลีกเพิ่มขึ้นกว่า 70% ตั้งแต่ปี 2019 Classic Flap และ Boy Bag ขับเคลื่อนตลาดมือสองในไทยมากที่สุด',
        facts: [
          'ราคาขายปลีกเพิ่มขึ้น ~12% ต่อปี',
          'หนัง caviar สีดำรักษามูลค่าได้ดีที่สุด',
          'ตรวจสอบ: ความตรงของ CC turn-lock',
          'แบรนด์ที่ค้นหามากที่สุดในตลาดมือสองไทย',
        ],
      },
    },
    'louis-vuitton': {
      en: {
        body: 'Louis Vuitton is the most liquid luxury brand on the Thai secondary market — any model sells quickly. Monogram canvas pieces resist wear better than leather, ideal for first-time pre-owned buyers.',
        facts: [
          'Most-searched brand on Thai resale platforms',
          'Neverfull discontinued, now commands premium',
          'Speedies and Neverfull fastest-selling in Thailand',
          'Date code: post-2021 Vuitton has no date code',
        ],
      },
      th: {
        body: `${brandName} มือสองในไทยซื้อขายที่ส่วนลด 25–40% จากราคาขายปลีก ทุกรายการผ่านการรับรองความแท้จากแพลตฟอร์มที่เชื่อถือได้`,
        facts: [
          'แบรนด์ที่ค้นหามากที่สุดในแพลตฟอร์มมือสองไทย',
          'Neverfull ยุติการผลิต ราคามือสองสูงกว่าเดิม',
          'Speedy และ Neverfull ขายเร็วที่สุดในไทย',
          'Date code: หลังปี 2021 Vuitton ไม่มี date code',
        ],
      },
    },
    hermes: {
      en: {
        body: 'Hermès consistently sells above retail globally and in Thailand. Birkins and Kellys are investment-grade assets with limited supply and no online shopping.',
        facts: [
          'Birkin appreciation: ~14% annually',
          'Togo and Epsom leather most durable',
          'Full set (box, dustbag, receipt) adds 15–20%',
          'Very limited availability through boutique',
        ],
      },
      th: {
        body: `${brandName} มือสองในไทยซื้อขายที่ส่วนลด 5–15% จากราคาขายปลีก หรือบางรุ่นสูงกว่าราคาใหม่ ทุกรายการผ่านการรับรองความแท้จากแพลตฟอร์มที่เชื่อถือได้`,
        facts: [
          'Birkin มูลค่าเพิ่ม ~14% ต่อปี',
          'หนัง Togo และ Epsom ทนทานที่สุด',
          'ครบชุด (กล่อง ถุงผ้า ใบเสร็จ) ราคาสูงขึ้น 15–20%',
          'หาซื้อได้จำกัดมากจากบูติก',
        ],
      },
    },
    gucci: {
      en: {
        body: "Gucci's resale market has cooled since the peak Michele era. Current prices offer excellent value — the Marmont and Dionysus remain most in demand in Thailand.",
        facts: [
          'Marmont and Dionysus: most popular in Thailand',
          'GG Matelassé leather shows corner wear',
          'Ophidia canvas more durable than leather',
          'New Sabato De Sarno era: resale value TBD',
        ],
      },
      th: {
        body: `${brandName} มือสองในไทยซื้อขายที่ส่วนลด 35–50% จากราคาขายปลีก ทุกรายการผ่านการรับรองความแท้จากแพลตฟอร์มที่เชื่อถือได้`,
        facts: [
          'Marmont และ Dionysus: ยอดนิยมสูงสุดในไทย',
          'หนัง GG Matelassé มักมีรอยที่มุม',
          'ผ้า Ophidia ทนทานกว่าหนัง',
          'ยุค Sabato De Sarno: มูลค่ามือสองยังไม่ชัดเจน',
        ],
      },
    },
    dior: {
      en: {
        body: 'Dior has aggressively raised retail prices, widening the savings gap for pre-owned buyers in Thailand. The Lady Dior and Saddle Bag have 25+ year legacies.',
        facts: [
          'Book Tote: most customizable luxury piece',
          'Cannage quilting: check integrity',
          'Lady Dior serial number under flap on hardware',
          'Popular gift item in Thai market',
        ],
      },
      th: {
        body: `${brandName} มือสองในไทยซื้อขายที่ส่วนลด 30–45% จากราคาขายปลีก ทุกรายการผ่านการรับรองความแท้จากแพลตฟอร์มที่เชื่อถือได้`,
        facts: [
          'Book Tote: ปรับแต่งได้มากที่สุดในบรรดากระเป๋า luxury',
          'ลาย Cannage: ตรวจสอบความสมบูรณ์ของตะเข็บ',
          'หมายเลขซีเรียล Lady Dior อยู่ใต้ฝาที่อุปกรณ์โลหะ',
          'ของขวัญยอดนิยมในตลาดไทย',
        ],
      },
    },
    prada: {
      en: {
        body: "Prada's minimalist aesthetic has made a strong comeback. Pre-owned Prada trades at 40–55% off retail — outstanding value in the Thai market.",
        facts: [
          'Re-Edition 2000: best resale value per baht',
          'Saffiano leather: virtually indestructible',
          'Strong Gen-Z demand in Thailand',
          'Nylon bags: durable, lower resale value',
        ],
      },
      th: {
        body: `${brandName} มือสองในไทยซื้อขายที่ส่วนลด 40–55% จากราคาขายปลีก ทุกรายการผ่านการรับรองความแท้จากแพลตฟอร์มที่เชื่อถือได้`,
        facts: [
          'Re-Edition 2000: มูลค่ามือสองดีที่สุดต่อบาท',
          'หนัง Saffiano: แทบไม่มีรอยขีดข่วน',
          'Gen-Z ในไทยมีดีมานด์สูง',
          'กระเป๋าไนลอน: ทนทานแต่มูลค่ามือสองต่ำกว่า',
        ],
      },
    },
    'saint-laurent': {
      en: {
        body: 'Saint Laurent is the entry point to serious luxury. The Loulou and Kate are among the most popular gifted designer bags in Thailand, with pre-owned prices 35–50% below retail.',
        facts: [
          'Kate and Loulou: highest resale velocity',
          'Grain leather: check corner scratches',
          'Gold hardware tarnishes faster than silver',
          'Cassandre monogram: key authentication point',
        ],
      },
      th: {
        body: `${brandName} มือสองในไทยซื้อขายที่ส่วนลด 35–50% จากราคาขายปลีก ทุกรายการผ่านการรับรองความแท้จากแพลตฟอร์มที่เชื่อถือได้`,
        facts: [
          'Kate และ Loulou: ขายเร็วที่สุดในตลาดมือสอง',
          'หนัง Grain: ตรวจสอบรอยขีดที่มุม',
          'อุปกรณ์โลหะสีทองเสื่อมสีเร็วกว่าสีเงิน',
          'โมโนแกรม Cassandre: จุดตรวจสอบความแท้หลัก',
        ],
      },
    },
    'bottega-veneta': {
      en: {
        body: "Bottega Veneta's Daniel Lee-era pieces command premiums. The Jodie and Cassette are highly sought in the Thai pre-owned market.",
        facts: [
          'Intrecciato weave: check for loose strands',
          'Nappa leather: very soft but marks easily',
          'Jodie and Cassette: strongest resale in Thailand',
          'Original Pouch (Lee era) commands collector premium',
        ],
      },
      th: {
        body: `${brandName} มือสองในไทยซื้อขายที่ส่วนลด 30–45% จากราคาขายปลีก ทุกรายการผ่านการรับรองความแท้จากแพลตฟอร์มที่เชื่อถือได้`,
        facts: [
          'ลาย Intrecciato: ตรวจสอบเส้นหนังที่หลุดรุ่ย',
          'หนัง Nappa: นุ่มมากแต่เป็นรอยง่าย',
          'Jodie และ Cassette: มูลค่ามือสองสูงสุดในไทย',
          'Pouch ยุค Lee: ราคาสะสมสูงกว่าปกติ',
        ],
      },
    },
  }

  const entry = editorials[slug]
  if (!entry) return null
  return isTh ? entry.th : entry.en
}

interface Props { params: Promise<{ locale: string; brand: string }> }

export function generateStaticParams() {
  const locales = ['en', 'th']
  return getAllBrands().flatMap(b => locales.map(locale => ({ locale, brand: b.slug })))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, brand } = await params
  setRequestLocale(locale)
  const items = getItemsByBrand(brand)
  if (!items.length) return {}
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    title: t('page_title_brand', { brand: items[0].brand }),
    description: t('page_meta_brand', { brand: items[0].brand, count: items.length }),
    alternates: {
      canonical: `${BASE}/${locale}/${brand}`,
      languages: {
        en: `${BASE}/en/${brand}`,
        th: `${BASE}/th/${brand}`,
      },
    },
  }
}

export default async function BrandPage({ params }: Props) {
  const { locale, brand } = await params
  setRequestLocale(locale)
  const items = getItemsByBrand(brand)
  if (!items.length) notFound()
  const t = await getTranslations({ locale, namespace: 'common' })
  const brandName = items[0].brand
  const editorial = getBrandEditorial(brand, brandName, locale)

  return (
    <>
      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href={`/${locale}`}>{t('home')}</Link> › {brandName}
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
        {t('page_title_brand', { brand: brandName })}
      </h1>
      <p className="text-[#6B6052] mb-10">{t('page_meta_brand', { brand: brandName, count: items.length })}</p>
      {editorial && (
        <div className="mb-8 p-6 border-l-4 border-[#B8954A] bg-[#FAFAF9]">
          <p className="text-[#3A3228] leading-relaxed mb-4">{editorial.body}</p>
          <ul className="space-y-1">
            {editorial.facts.map((fact, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#6B6052]">
                <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-[#B8954A]" />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}
      {(() => {
        const itemsWithSavings = items.filter(i => i.price_ranges.very_good && i.retail_price_thb > 0)
        if (!itemsWithSavings.length) return null
        const avgSav = Math.round(
          itemsWithSavings.reduce((sum, i) => {
            const vg = i.price_ranges.very_good!
            const avg = (vg.min + vg.max) / 2
            return sum + ((i.retail_price_thb - avg) / i.retail_price_thb * 100)
          }, 0) / itemsWithSavings.length
        )
        if (avgSav <= 0) return null
        return (
          <div className="flex items-center gap-3 mb-6 p-4 bg-[#F5F0E8] border-l-2 border-[#B8954A]">
            <span className="text-2xl font-bold text-[#4A7A35]">{avgSav}%</span>
            <span className="text-sm text-[#6B6052]">
              {locale === 'th'
                ? `ประหยัดเฉลี่ยเทียบราคาใหม่ สำหรับทุกรุ่น ${brandName}`
                : `average savings vs retail across all ${brandName} models`}
            </span>
          </div>
        )
      })()}
      <SortableItemGrid items={items} locale={locale} />
    </>
  )
}
