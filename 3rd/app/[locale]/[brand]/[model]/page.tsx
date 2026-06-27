import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  getItemBySlug,
  getAllItems,
  formatPriceTHB,
  getAvgPrice,
  getPriceVsRetail,
  getItemsByBrand,
  Item,
  PriceRange,
} from '@/lib/data'
import { PriceTable } from '@/components/PriceTable'
import { PriceHistory } from '@/components/PriceHistory'
import { ConditionGuide } from '@/components/ConditionGuide'
import { AffiliateCTA } from '@/components/AffiliateCTA'
import { ShareButton } from '@/components/ShareButton'
import { RecentlyViewed } from '@/components/RecentlyViewed'
import { TrackPageView } from '@/components/TrackPageView'

const BASE = 'https://www.chicpreowned.com'
const YEAR = 2026

interface Props { params: Promise<{ locale: string; brand: string; model: string }> }

export function generateStaticParams() {
  const locales = ['en', 'th']
  return getAllItems().flatMap(item => {
    const [brand, model] = item.slug.split('/')
    return locales.map(locale => ({ locale, brand, model }))
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, brand, model } = await params
  const item = getItemBySlug(brand, model)
  if (!item) return {}
  const t = await getTranslations({ locale, namespace: 'common' })
  const vg = item.price_ranges.very_good
  const otherLocale = locale === 'en' ? 'th' : 'en'
  const title = t('page_title_model', { brand: item.brand, model: item.model, year: YEAR })
  const description = t('page_meta_model', {
    brand: item.brand,
    model: item.model,
    min: vg ? formatPriceTHB(vg.min) : '฿–',
    max: vg ? formatPriceTHB(vg.max) : '฿–',
  })
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/${item.slug}`,
      languages: {
        [locale]: `${BASE}/${locale}/${item.slug}`,
        [otherLocale]: `${BASE}/${otherLocale}/${item.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE}/${locale}/${item.slug}`,
    },
  }
}

function getFAQs(item: Item, locale: string) {
  const isTh = locale === 'th'
  const vg = item.price_ranges.very_good
  const savingsPct = vg && item.retail_price_thb > 0
    ? Math.round(((item.retail_price_thb - (vg.min + vg.max) / 2) / item.retail_price_thb) * 100)
    : null
  const pct = savingsPct && savingsPct > 0 ? `${savingsPct}%` : '20%'

  if (item.category === 'handbags') {
    if (!isTh) {
      return [
        {
          q: `Is buying a pre-owned ${item.model} worth it in Thailand?`,
          a: savingsPct && savingsPct > 0
            ? `Yes — pre-owned ${item.brand} ${item.model} bags in Thailand typically sell ${pct} below retail, making them an excellent value for luxury shoppers.`
            : `Pre-owned ${item.model} bags offer access to a luxury icon. Even at near-retail prices, the secondary market gives you immediate availability without waitlists.`,
        },
        {
          q: `How much does a used ${item.model} cost in Thailand?`,
          a: vg
            ? `A used ${item.model} in Very Good condition typically costs between ${formatPriceTHB(vg.min)} and ${formatPriceTHB(vg.max)} on the Thai secondary market. Prices vary by colour, hardware, and condition.`
            : `Prices for a used ${item.model} vary depending on condition, colourway, and hardware finish. Check Carousell TH and C2C.in.th for current listings.`,
        },
        {
          q: 'Which condition should I buy?',
          a: 'Very Good condition offers the best value — bags show only light signs of use and retain full structural integrity. Excellent condition commands a 10–20% premium and is ideal if you plan to resell. Good condition suits everyday use but may show visible wear.',
        },
        {
          q: `How do I authenticate a pre-owned ${item.brand} bag?`,
          a: `Authenticate a pre-owned ${item.brand} bag by checking the serial number stamp, stitching consistency, hardware weight and engraving, and lining quality. For high-value pieces, use a professional authentication service such as Real Authentication or Entrupy.`,
        },
        {
          q: `Does the ${item.model} hold its value?`,
          a: savingsPct !== null && savingsPct < 15
            ? `Yes — the ${item.model} holds its value exceptionally well. Pre-owned prices remain close to retail, reflecting strong demand in the global luxury market.`
            : `The ${item.model} retains value better than most fashion items. Classic colourways in neutral tones depreciate the least over time.`,
        },
        {
          q: `Where is the best place to buy a used ${item.model} in Thailand?`,
          a: `The top platforms for buying a used ${item.model} in Thailand are Carousell TH (largest selection), Facebook Marketplace TH (direct seller deals), and C2C.in.th (authenticated listings). Always request original receipts and authentication cards.`,
        },
        {
          q: "What's the difference between Excellent, Very Good, and Good condition?",
          a: 'Excellent: minimal use, near-new appearance, may include original packaging. Very Good: light wear on corners or handles, no major scuffs or stains. Good: visible signs of use including scuffs, scratches, or fading — still fully functional but shows its age.',
        },
      ]
    } else {
      return [
        {
          q: `คุ้มค่าไหมที่จะซื้อ${item.model}มือสอง?`,
          a: savingsPct && savingsPct > 0
            ? `คุ้มมาก — กระเป๋า ${item.brand} ${item.model} มือสองในไทยราคาต่ำกว่าของใหม่ถึง ${pct} เหมาะสำหรับผู้ที่ต้องการของ luxury ในราคาที่เข้าถึงได้`
            : `กระเป๋า ${item.model} มือสองช่วยให้คุณเข้าถึงของ luxury ได้โดยไม่ต้องรอคิว แม้ราคาใกล้เคียงของใหม่ก็ยังคุ้มค่าในแง่ความพร้อมจำหน่าย`,
        },
        {
          q: `กระเป๋า${item.model}มือสองราคาเท่าไหร่?`,
          a: vg
            ? `กระเป๋า ${item.model} สภาพดีมากในไทยราคาอยู่ที่ประมาณ ${formatPriceTHB(vg.min)} ถึง ${formatPriceTHB(vg.max)} ราคาขึ้นอยู่กับสี อุปกรณ์โลหะ และสภาพสินค้า`
            : `ราคากระเป๋า ${item.model} มือสองขึ้นอยู่กับสภาพ สี และอุปกรณ์โลหะ ดูราคาปัจจุบันได้ที่ Carousell TH และ C2C.in.th`,
        },
        {
          q: 'ควรเลือกซื้อสภาพไหนดี?',
          a: 'สภาพ Very Good ให้ความคุ้มค่าที่ดีที่สุด — กระเป๋าแทบไม่มีรอยการใช้งานและยังคงสภาพดี สภาพ Excellent เหมาะหากต้องการขายต่อ แต่ราคาสูงกว่า 10–20% ส่วนสภาพ Good เหมาะสำหรับใช้งานประจำวัน',
        },
        {
          q: `จะตรวจสอบความแท้ของกระเป๋า${item.brand}ได้อย่างไร?`,
          a: `ตรวจสอบหมายเลขซีเรียล การเย็บที่สม่ำเสมอ น้ำหนักและการแกะสลักของโลหะ และคุณภาพของผ้าบุภายใน สำหรับของมูลค่าสูงควรใช้บริการตรวจสอบความแท้จากผู้เชี่ยวชาญ`,
        },
        {
          q: `${item.model}รักษามูลค่าได้ดีไหม?`,
          a: savingsPct !== null && savingsPct < 15
            ? `ดีมาก — ${item.model} รักษามูลค่าได้ดีเยี่ยม ราคามือสองยังคงใกล้เคียงราคาใหม่ สะท้อนถึงดีมานด์ที่แข็งแกร่ง`
            : `${item.model} รักษามูลค่าได้ดีกว่าสินค้าแฟชั่นทั่วไป สีคลาสสิกโทนนิวทรัลราคาลดลงน้อยที่สุด`,
        },
        {
          q: `ซื้อกระเป๋า${item.model}มือสองที่ไหนดีในไทย?`,
          a: `แพลตฟอร์มที่ดีที่สุดในการซื้อกระเป๋า ${item.model} มือสองในไทยคือ Carousell TH (ตัวเลือกมากที่สุด) Facebook Marketplace TH (ซื้อตรงจากผู้ขาย) และ C2C.in.th (รายการที่ผ่านการรับรอง) ขอใบเสร็จต้นฉบับและบัตรรับรองทุกครั้ง`,
        },
        {
          q: 'สภาพ Excellent, Very Good และ Good แตกต่างกันอย่างไร?',
          a: 'Excellent: ใช้น้อยมาก ใกล้เคียงของใหม่ อาจมีกล่องและอุปกรณ์ครบ Very Good: มีรอยการใช้งานเล็กน้อยที่มุมหรือหูหิ้ว ไม่มีรอยขีดหรือคราบ Good: มีรอยการใช้งานให้เห็น เช่น รอยขีด รอยถลอก หรือสีซีด แต่ยังใช้งานได้ปกติ',
        },
      ]
    }
  }

  if (item.category === 'watches') {
    const isAboveRetail = vg && (vg.min + vg.max) / 2 > item.retail_price_thb
    if (!isTh) {
      return [
        {
          q: `Does a pre-owned ${item.model} hold its value?`,
          a: isAboveRetail
            ? `Exceptionally well — the ${item.model} commands prices above retail on the secondary market, reflecting strong collector demand and limited supply.`
            : `Yes — the ${item.brand} ${item.model} holds its value better than most luxury watches. Stainless steel models on original bracelet depreciate the least.`,
        },
        {
          q: `How much does a used ${item.model} cost in Thailand?`,
          a: vg
            ? `A used ${item.model} in Very Good condition typically sells for ${formatPriceTHB(vg.min)} to ${formatPriceTHB(vg.max)} on the Thai pre-owned market. Prices vary by reference number, bracelet type, and whether the watch comes with box and papers.`
            : `Used ${item.model} prices vary by reference number, condition, and accessories. Check current listings on Carousell TH and C2C.in.th.`,
        },
        {
          q: `What should I check when buying a used ${item.model}?`,
          a: `When buying a used ${item.model}, verify the serial and reference numbers match the papers, inspect the case for deep scratches, check crown and pusher function, and confirm the movement runs accurately. A pre-purchase service by a certified watchmaker is recommended for high-value pieces.`,
        },
        {
          q: `Is buying a pre-owned ${item.model} risky?`,
          a: `Risk is manageable if you buy from a reputable seller. Key safeguards: request the original box and papers, verify authenticity with a certified watchmaker, and use escrow or platform buyer protection. Avoid cash-only transactions without documentation.`,
        },
        {
          q: `What is the ${item.model} retail price in Thailand?`,
          a: item.retail_price_thb > 0
            ? `The official retail price of the ${item.brand} ${item.model} in Thailand is ${formatPriceTHB(item.retail_price_thb)}. Pre-owned prices ${isAboveRetail ? 'exceed' : 'are typically below'} this figure.`
            : `Official retail pricing for the ${item.model} in Thailand varies by reference and configuration. Contact an authorised ${item.brand} dealer for current pricing.`,
        },
        {
          q: 'Box and papers vs no box — how much price difference?',
          a: 'Full set (original box, papers/warranty card, and all accessories) commands a 10–20% premium over no-papers watches of the same reference and condition. For highly collectible references, the premium can exceed 25%.',
        },
        {
          q: `What's the best time to buy a pre-owned ${item.brand} watch?`,
          a: `The best time to buy is when new model releases are announced — sellers often list pre-owned pieces ahead of upgrades, increasing supply. Post-holiday periods (February, August) also see higher inventory on Thai resale platforms.`,
        },
      ]
    } else {
      return [
        {
          q: `${item.model}มือสองรักษามูลค่าได้ดีไหม?`,
          a: isAboveRetail
            ? `ดีมาก — ${item.model} ราคามือสองสูงกว่าราคาขายปลีก สะท้อนถึงความต้องการของนักสะสมและซัพพลายที่จำกัด`
            : `ใช่ — ${item.brand} ${item.model} รักษามูลค่าได้ดีกว่านาฬิกา luxury ส่วนใหญ่ รุ่นสเตนเลสบนสายดั้งเดิมราคาลดน้อยที่สุด`,
        },
        {
          q: `นาฬิกา${item.model}มือสองในไทยราคาเท่าไหร่?`,
          a: vg
            ? `นาฬิกา ${item.model} สภาพดีมากในไทยราคาอยู่ที่ ${formatPriceTHB(vg.min)} ถึง ${formatPriceTHB(vg.max)} ราคาขึ้นอยู่กับรหัสรุ่น ประเภทสาย และครบชุดหรือไม่`
            : `ราคา ${item.model} มือสองขึ้นอยู่กับรหัสรุ่น สภาพ และอุปกรณ์ประกอบ ดูราคาปัจจุบันได้ที่ Carousell TH และ C2C.in.th`,
        },
        {
          q: `ซื้อนาฬิกา${item.model}มือสองควรดูอะไร?`,
          a: `ตรวจสอบหมายเลขซีเรียลและรหัสรุ่นให้ตรงกับเอกสาร ตรวจตัวเรือนว่ามีรอยขีดลึกหรือไม่ ทดสอบการทำงานของ crown และปุ่มกด และตรวจสอบความแม่นยำของเครื่อง สำหรับชิ้นมูลค่าสูงควรให้ช่างนาฬิกาที่ได้รับการรับรองตรวจสอบก่อนซื้อ`,
        },
        {
          q: 'ซื้อนาฬิกามือสองมีความเสี่ยงไหม?',
          a: `ความเสี่ยงจัดการได้หากซื้อจากผู้ขายที่น่าเชื่อถือ วิธีป้องกัน: ขอกล่องและเอกสารต้นฉบับ ยืนยันความแท้กับช่างนาฬิกาที่ได้รับการรับรอง และใช้ระบบ escrow หรือการคุ้มครองผู้ซื้อของแพลตฟอร์ม หลีกเลี่ยงการจ่ายเงินสดโดยไม่มีเอกสาร`,
        },
        {
          q: `${item.model}ราคาขายปลีกในไทยเท่าไหร่?`,
          a: item.retail_price_thb > 0
            ? `ราคาขายปลีกอย่างเป็นทางการของ ${item.brand} ${item.model} ในไทยอยู่ที่ ${formatPriceTHB(item.retail_price_thb)} ราคามือสอง${isAboveRetail ? 'สูงกว่า' : 'ต่ำกว่า'}ราคานี้`
            : `ราคาขายปลีก ${item.model} ในไทยขึ้นอยู่กับรหัสและตัวเลือก ติดต่อตัวแทนจำหน่าย ${item.brand} อย่างเป็นทางการเพื่อดูราคาปัจจุบัน`,
        },
        {
          q: 'มี box และ papers กับไม่มีราคาต่างกันเท่าไหร่?',
          a: 'ชุดครบ (กล่องต้นฉบับ บัตรรับประกัน และอุปกรณ์ครบ) ราคาสูงกว่าแบบไม่มีเอกสาร 10–20% สำหรับรุ่นที่นักสะสมต้องการมากส่วนต่างอาจสูงกว่า 25%',
        },
        {
          q: `ช่วงไหนดีที่สุดในการซื้อนาฬิกา${item.brand}มือสอง?`,
          a: `ช่วงเวลาที่ดีที่สุดคือเมื่อมีการประกาศรุ่นใหม่ — ผู้ขายมักนำของเก่าออกขายก่อนอัพเกรด ทำให้ซัพพลายเพิ่มขึ้น ช่วงหลังเทศกาล (กุมภาพันธ์ สิงหาคม) ยังมีสินค้าในตลาดมือสองไทยมากกว่าปกติ`,
        },
      ]
    }
  }

  // Default for clothing
  if (!isTh) {
    return [
      {
        q: `Is buying a pre-owned ${item.model} worth it in Thailand?`,
        a: savingsPct && savingsPct > 0
          ? `Yes — pre-owned ${item.brand} ${item.model} in Thailand typically sells ${pct} below retail.`
          : `Pre-owned ${item.model} gives you access to a coveted ${item.brand} piece at more accessible prices.`,
      },
      {
        q: `How do I authenticate a pre-owned ${item.brand} piece?`,
        a: `Check the label stitching, font consistency on tags, and fabric quality. For high-value pieces, use a professional authentication service.`,
      },
      {
        q: `Where is the best place to buy pre-owned ${item.brand} in Thailand?`,
        a: `Carousell TH, Facebook Marketplace TH, and C2C.in.th are the top platforms for pre-owned ${item.brand} in Thailand.`,
      },
    ]
  }
  return [
    {
      q: `คุ้มค่าไหมที่จะซื้อ${item.model}มือสอง?`,
      a: savingsPct && savingsPct > 0
        ? `คุ้มมาก — ${item.brand} ${item.model} มือสองในไทยราคาต่ำกว่าของใหม่ถึง ${pct}`
        : `${item.model} มือสองช่วยให้คุณเข้าถึง ${item.brand} ได้ในราคาที่เข้าถึงได้มากขึ้น`,
    },
    {
      q: `จะตรวจสอบความแท้ของ${item.brand}ได้อย่างไร?`,
      a: `ตรวจสอบการเย็บป้าย ความสม่ำเสมอของฟอนต์ และคุณภาพผ้า สำหรับของมูลค่าสูงควรใช้บริการตรวจสอบความแท้จากผู้เชี่ยวชาญ`,
    },
    {
      q: `ซื้อ${item.brand}มือสองที่ไหนดีในไทย?`,
      a: `Carousell TH Facebook Marketplace TH และ C2C.in.th เป็นแพลตฟอร์มที่ดีที่สุดสำหรับสินค้า ${item.brand} มือสองในไทย`,
    },
  ]
}

export default async function ModelPage({ params }: Props) {
  const { locale, brand, model } = await params
  const item = getItemBySlug(brand, model)
  if (!item) notFound()

  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const faqs = getFAQs(item, locale)

  // FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  // Product + AggregateOffer schema
  const allPrices = Object.values(item.price_ranges).filter(Boolean) as PriceRange[]
  const lowPrice = allPrices.length ? Math.min(...allPrices.map(r => r.min)) : 0
  const highPrice = allPrices.length ? Math.max(...allPrices.map(r => r.max)) : 0

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Used ${item.brand} ${item.model}`,
    brand: { '@type': 'Brand', name: item.brand },
    description: `Pre-owned ${item.brand} ${item.model} — second-hand prices in Thailand`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'THB',
      lowPrice,
      highPrice,
      offerCount: item.price_samples.length,
      availability: 'https://schema.org/InStock',
      url: `${BASE}/${locale}/${item.slug}`,
    },
  }

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: item.brand, item: `${BASE}/${locale}/${brand}` },
      { '@type': 'ListItem', position: 3, name: item.model, item: `${BASE}/${locale}/${item.slug}` },
    ],
  }

  // Related items from same brand
  const relatedItems = getItemsByBrand(brand).filter(i => i.id !== item.id)

  // Share data
  const pageUrl = `${BASE}/${locale}/${item.slug}`
  const vg = item.price_ranges.very_good
  const metaDescription = tCommon('page_meta_model', {
    brand: item.brand,
    model: item.model,
    min: vg ? formatPriceTHB(vg.min) : '฿–',
    max: vg ? formatPriceTHB(vg.max) : '฿–',
  })
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: locale === 'th'
      ? `${item.brand} ${item.model} มือสอง ราคา (${YEAR})`
      : `Used ${item.brand} ${item.model} Price Guide in Thailand (${YEAR})`,
    description: metaDescription,
    url: pageUrl,
    dateModified: item.last_updated || new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'chicpreowned.com' },
    publisher: { '@type': 'Organization', name: 'chicpreowned.com', url: 'https://www.chicpreowned.com' },
    inLanguage: locale === 'th' ? 'th-TH' : 'en-US',
  }
  const shareTitle = `Used ${item.brand} ${item.model} — Price in Thailand`
  const shareText = vg
    ? `Pre-owned ${item.brand} ${item.model}: avg ${formatPriceTHB(getAvgPrice(vg))} on Carousell TH`
    : `Pre-owned ${item.brand} ${item.model} prices in Thailand`

  return (
    <>
      <TrackPageView
        slug={item.slug}
        brand={item.brand}
        model={item.model}
        priceText={vg ? formatPriceTHB(getAvgPrice(vg)) : '–'}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href={`/${locale}`}>{tCommon('home')}</Link> ›{' '}
        <Link href={`/${locale}/${brand}`}>{item.brand}</Link> ›{' '}
        {item.model}
      </p>

      <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        {tCommon('page_title_model', { brand: item.brand, model: item.model, year: YEAR })}
        <span className="block text-xl text-[#9C8B7A] mt-1 font-sans font-normal" style={{ fontFamily: 'var(--font-inter, sans-serif)' }}>
          {locale === 'th' ? 'ราคาตลาดมือสอง' : 'Pre-Owned Market Price'}
        </span>
      </h1>

      <ShareButton title={shareTitle} text={shareText} url={pageUrl} />

      {/* Price Hero */}
      {(() => {
        const vg = item.price_ranges.very_good
        const savingsPct = vg && item.retail_price_thb > 0
          ? Math.round(((item.retail_price_thb - (vg.min + vg.max) / 2) / item.retail_price_thb) * 100)
          : null
        const vestiaire = `https://www.vestiairecollective.com/search/?q=${encodeURIComponent(item.brand + ' ' + item.model)}`
        const ebay = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(item.brand + ' ' + item.model)}`
        const priceLabel = locale === 'th' ? 'ราคาตลาดปัจจุบัน — สภาพดีมาก' : 'Current Market Price — Very Good Condition'
        const shopLabel = locale === 'th' ? 'ช้อปบน Vestiaire →' : 'Shop on Vestiaire →'
        const searchLabel = locale === 'th' ? 'ค้นหาบน eBay' : 'Search eBay'
        const savingsLabel = (pct: number) => locale === 'th' ? `ประหยัด ~${pct}% จากราคาใหม่` : `~${pct}% below retail`

        return (
          <div className="my-8 p-6 bg-[#1A1A1A] text-white">
            <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">
              {priceLabel}
            </p>
            {vg ? (
              <>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-light">{formatPriceTHB(getAvgPrice(vg))}</span>
                </div>
                {savingsPct !== null && savingsPct > 0 && (
                  <p className="text-[#6EBF8B] text-sm mb-1">
                    {savingsLabel(savingsPct)} ({formatPriceTHB(item.retail_price_thb)} {locale === 'th' ? 'ราคาใหม่' : 'new'})
                  </p>
                )}
                {savingsPct !== null && (
                  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={
                      savingsPct >= 40 ? { background: '#1A2E1A', color: '#6EBF8B', border: '1px solid #2D4A2D' } :
                      savingsPct >= 20 ? { background: '#1A2412', color: '#9CB87A', border: '1px solid #2A3A1A' } :
                      savingsPct >= 5  ? { background: '#2A2218', color: '#C8A97E', border: '1px solid #3A3020' } :
                                        { background: '#2A1818', color: '#C88878', border: '1px solid #3A2020' }
                    }
                  >
                    {savingsPct >= 40 ? (locale === 'th' ? '🔥 ดีลสุดคุ้ม' : '🔥 Exceptional Deal') :
                     savingsPct >= 20 ? (locale === 'th' ? '✓ ราคาดี' : '✓ Good Value') :
                     savingsPct >= 5  ? (locale === 'th' ? '◎ ราคาตลาด' : '◎ Fair Market Price') :
                                       (locale === 'th' ? '↑ ตลาดแข็ง' : '↑ Premium Demand')}
                  </div>
                )}
                {savingsPct !== null && (
                  <p className="text-xs text-[#9C8B7A] mt-2 italic">
                    {locale === 'th'
                      ? (savingsPct >= 40 ? '↓ ซัพพลายสูง — เวลาเหมาะสมในการซื้อ'
                        : savingsPct >= 20 ? '→ ตลาดคงที่ — ราคาสมเหตุสมผล'
                        : savingsPct >= 5  ? '↑ ดีมานด์สูง — ตรวจสภาพสินค้าให้ดี'
                        : '↑ ดีมานด์สูงมาก — ของหายาก ราคาสูง')
                      : (savingsPct >= 40 ? '↓ High supply — favorable time to buy'
                        : savingsPct >= 20 ? '→ Stable market — fair listings available'
                        : savingsPct >= 5  ? '↑ Strong demand — verify condition carefully'
                        : '↑ High demand — limited supply, prices elevated')}
                  </p>
                )}
                {/* Savings bar */}
                {savingsPct !== null && savingsPct > 0 && savingsPct < 100 && (
                  <div className="mt-4 mb-6">
                    <div className="flex justify-between text-xs text-[#6B6052] mb-1">
                      <span>{locale === 'th' ? 'ราคามือสองเฉลี่ย' : 'Pre-owned avg'}</span>
                      <span>{locale === 'th' ? 'ราคาปกติ' : 'Retail'}</span>
                    </div>
                    <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#B8954A] rounded-full"
                        style={{ width: `${Math.max(5, 100 - savingsPct)}%` }}
                      />
                    </div>
                  </div>
                )}
                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    href={vestiaire}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#B8954A] text-white text-sm tracking-wide hover:bg-[#A07B38] transition-colors"
                  >
                    {shopLabel}
                  </a>
                  <a
                    href={ebay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[#444] text-[#9C8B7A] text-sm tracking-wide hover:border-[#B8954A] hover:text-[#B8954A] transition-colors"
                  >
                    {searchLabel}
                  </a>
                </div>
              </>
            ) : (
              <p className="text-[#9C8B7A]">{locale === 'th' ? 'ยังไม่มีข้อมูลราคาสำหรับรุ่นนี้' : 'Price data not available for this model yet.'}</p>
            )}
          </div>
        )
      })()}

      <div className="my-4 flex items-center justify-between p-4 bg-[#F5F0E8] border border-[#E8E2D9]">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A]">
            {locale === 'th' ? 'ต้องการแจ้งเตือนราคา?' : 'Want price alerts?'}
          </p>
          <p className="text-xs text-[#6B6052] mt-0.5">
            {locale === 'th' ? 'ติดตามอัปเดตราคาทุกสัปดาห์' : 'Follow us for weekly price updates'}
          </p>
        </div>
        <a
          href="https://twitter.com/intent/follow?screen_name=chicpreowned"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 ml-4 px-4 py-2 bg-[#1A1A1A] text-white text-xs tracking-wide hover:bg-[#333] transition-colors"
        >
          {locale === 'th' ? 'ติดตาม' : 'Follow Updates'}
        </a>
      </div>

      {/* AdSense slot — top */}
      <div className="my-6" />

      <PriceTable
        item={item}
        sampleCount={item.price_samples.length}
        labels={{
          condition: tCommon('condition_label'),
          priceRange: tCommon('price_range_label'),
          excellent: tCommon('condition_excellent'),
          very_good: tCommon('condition_very_good'),
          good: tCommon('condition_good'),
          vsRetail: tCommon('vs_retail', { retail: formatPriceTHB(item.retail_price_thb) }),
          lastUpdated: tCommon('last_updated', { date: item.last_updated }),
        }}
      />
      <PriceHistory samples={item.price_samples} locale={locale} />
      <ConditionGuide locale={locale} />

      <AffiliateCTA item={item} ctaLabel={tCommon('cta_carousell')} />

      {/* AdSense slot — middle */}
      <div className="my-6" />

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1A1A1A]">FAQ</h2>
        <dl className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i}>
              <dt className="font-medium text-[#1A1A1A]">{faq.q}</dt>
              <dd className="mt-1 text-[#6B6052]">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Related items from same brand */}
      {relatedItems.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            {locale === 'th' ? `จาก ${item.brand}` : `More from ${item.brand}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedItems.map(ri => {
              const rvg = ri.price_ranges.very_good
              return (
                <a
                  key={ri.id}
                  href={`/${locale}/${ri.slug}`}
                  className="group block p-6 bg-white border border-[#E8E2D9] rounded-sm hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
                >
                  <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-2">{ri.brand}</p>
                  <h3 className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {ri.model}
                  </h3>
                  {rvg && (
                    <p className="text-sm text-[#6B6052]">
                      {formatPriceTHB(getAvgPrice(rvg))}
                    </p>
                  )}
                </a>
              )
            })}
          </div>
        </section>
      )}

      {/* AdSense slot — bottom */}
      <div className="my-6" />

      <RecentlyViewed currentSlug={item.slug} locale={locale} />

      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2D9] p-3 flex gap-2 sm:hidden z-50">
        <a
          href={item.affiliate_links?.carousell
            ? item.affiliate_links.carousell + '?utm_source=chicpreowned.com&utm_medium=referral&utm_campaign=price-guide'
            : `https://www.carousell.co.th/search/${encodeURIComponent(item.brand + ' ' + item.model)}/?utm_source=chicpreowned.com&utm_medium=referral&utm_campaign=price-guide`
          }
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex-1 bg-[#1A1A1A] text-white text-sm font-medium rounded py-2.5 text-center"
        >
          {tCommon('cta_carousell')}
        </a>
      </div>
    </>
  )
}
