import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { BrandPriceTable } from '@/components/BrandPriceTable'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/patek-philippe'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Patek Philippe Prices Buying Guide Thailand ${PRICE_YEAR} | ChicPreowned`
      : `ราคา Patek Philippe มือสองในไทย ${PRICE_YEAR} — คู่มือซื้อ | ChicPreowned`,
    description: isEn
      ? 'Patek Philippe Nautilus, Aquanaut, Calatrava pre-owned prices in Thailand. Sports models trade 3–5× retail. Updated weekly.'
      : 'ราคา Patek Philippe Nautilus, Aquanaut, Calatrava มือสองในไทย รุ่นกีฬาซื้อขายที่ 3–5 เท่าราคาปลีก',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` },
    },
  }
}

export default async function PatekPhilippeBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'


  const faqs = isEn ? [
    {
      q: 'Why are Patek Philippe watches so expensive in Thailand?',
      a: 'Patek Philippe produces only ~60,000 watches per year globally — a tiny fraction of Rolex\'s output. Each watch is hand-finished over months. In Thailand, import duty and VAT on luxury watches add 30–40% to the Swiss retail price. For pre-owned Patek, you bypass some of this premium, but the Nautilus and Aquanaut trade above retail everywhere because demand massively outstrips supply.'
    },
    {
      q: 'Is it safe to buy Patek Philippe pre-owned in Thailand?',
      a: 'Yes, with the right precautions. Look for dealers who provide independent third-party authentication (not just their own certificate). For any Patek above ฿500,000, require: (1) Patek Extract (official service document), (2) original box and papers, (3) unmolested dial — no refinishing. The movement serial number should match the case and the extract. Fake Patek dials can look convincing — always authenticate with an authorised watchmaker before purchase.'
    },
    {
      q: 'Which Patek Philippe holds value best in Thailand?',
      a: 'The Nautilus 5711/1A (discontinued in 2021) holds the highest premium globally — pre-owned prices are 3–5× retail and have remained elevated even after the 2021–22 peak. For buyers who want appreciation potential, focus on stainless steel sports Patek (Nautilus, Aquanaut) in unworn or box-and-papers condition. Dress Patek (Calatrava) retains value well at 85–95% of retail but does not appreciate.'
    },
  ] : [
    {
      q: 'ทำไม Patek Philippe ถึงแพงมากในไทย?',
      a: 'Patek Philippe ผลิตเพียง ~60,000 เรือนต่อปีทั่วโลก — เศษเสี้ยวของยอดผลิต Rolex แต่ละเรือนได้รับการตกแต่งด้วยมือนานหลายเดือน ในไทย ภาษีนำเข้าและ VAT สำหรับนาฬิกาลักซ์ชูรีเพิ่ม 30–40% จากราคาปลีกสวิส สำหรับ Patek มือสอง คุณหลีกเลี่ยงส่วนหนึ่งของราคาส่วนเกินนี้ได้ แต่ Nautilus และ Aquanaut ซื้อขายเหนือราคาปลีกทุกที่เพราะอุปสงค์มากกว่าอุปทานมาก'
    },
    {
      q: 'ซื้อ Patek Philippe มือสองในไทยปลอดภัยหรือไม่?',
      a: 'ปลอดภัยถ้ามีมาตรการที่ถูกต้อง มองหาดีลเลอร์ที่ให้การยืนยันจากบุคคลที่สาม สำหรับ Patek ใดก็ตามที่เกิน 500,000 บาท ต้องขอ: (1) Patek Extract (เอกสารเซอร์วิสอย่างเป็นทางการ), (2) กล่องและเอกสารต้นฉบับ, (3) หน้าปัดที่ไม่ถูกดัดแปลง หมายเลขซีเรียลของกลไกควรตรงกับตัวเรือนและ Extract'
    },
    {
      q: 'Patek Philippe รุ่นไหนรักษามูลค่าได้ดีที่สุดในไทย?',
      a: 'Nautilus 5711/1A (ยุติการผลิตในปี 2021) มีราคาพรีเมียมสูงที่สุดทั่วโลก — ราคามือสองอยู่ที่ 3–5 เท่าของราคาปลีก สำหรับผู้ซื้อที่ต้องการศักยภาพในการเพิ่มมูลค่า ให้เน้น Patek สแตนเลสกีฬา (Nautilus, Aquanaut) ในสภาพ unworn หรือมีกล่องและเอกสาร Dress Patek (Calatrava) รักษามูลค่าไว้ที่ 85–95% แต่ไม่เพิ่มค่า'
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/watches`} className="hover:text-gray-800">{isEn ? 'Watches' : 'นาฬิกา'}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Patek Philippe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isEn ? `Pre-Owned Patek Philippe Prices in Thailand ${PRICE_YEAR}` : `ราคา Patek Philippe มือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-8">
        {isEn ? 'Sports models 3–5× retail · dress models retain 85–95%'
          : 'รุ่นกีฬา 3–5 เท่าราคาปลีก · รุ่นชุดรักษา 85–95%'}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
        <strong>{isEn ? 'Premium alert:' : 'แจ้งเตือนพรีเมียม:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Nautilus 5711 and Aquanaut 5167 consistently trade 3–5× their retail price — the highest premium of any watch brand. Even entry-level Calatrava retains 85%+ pre-owned.'
            : 'Nautilus 5711 และ Aquanaut 5167 ซื้อขายที่ 3–5 เท่าราคาปลีกอย่างสม่ำเสมอ — พรีเมียมสูงที่สุดของแบรนด์นาฬิกาใดๆ แม้แต่ Calatrava ระดับเริ่มต้นก็รักษา 85%+ มือสอง'}
        </span>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Patek Philippe Pre-Owned Buying Guide Thailand' : 'ราคา Patek Philippe มือสองในไทย'}
        </h2>
        <BrandPriceTable brandSlug="patek-philippe" locale={locale} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          {isEn ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}
        </h2>
        <div className="space-y-5">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-5">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/patek-philippe" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/patek-philippe" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Rolex Prices →' : 'ราคา Rolex →'}
        </Link>
        <Link href={`/${locale}/watches`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? '← All Watches' : '← นาฬิกาทั้งหมด'}
        </Link>
      </div>
    </div>
  )
}
