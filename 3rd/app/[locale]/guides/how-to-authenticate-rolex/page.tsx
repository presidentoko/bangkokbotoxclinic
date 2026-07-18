import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-rolex'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Rolex in Thailand 2025 | ChicPreowned'
      : 'วิธีตรวจสอบ Rolex แท้ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Authenticate Rolex watches in Thailand — Cyclops lens, sweep seconds, case back engravings, crown guards. 2025 guide for Thai buyers.'
      : 'ตรวจสอบ Rolex แท้ในไทย — เลนส์ Cyclops เข็มวินาที การแกะสลักหลังเคส crown guards คู่มือ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AuthRolexTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { step: 1, title: 'Cyclops Lens Magnification', detail: 'The Cyclops lens over the date window magnifies 2.5×. On a real Rolex, the date looks noticeably large through the lens. On fakes, magnification is 1–1.5× or the date appears off-center. This is one of the most reliable visual checks.' },
    { step: 2, title: 'Sweep Seconds Hand', detail: 'Rolex seconds hands glide continuously (28,800 beats per hour, 8 beats/second). They do NOT tick. A ticking second hand = quartz movement = not a genuine Rolex (Rolex makes no quartz watches in current production). Even under close inspection, authentic Rolex appears to sweep.' },
    { step: 3, title: 'Crown Guards (Sports Models)', detail: 'On Submariners and GMTs, the crown at 3 o\'clock is protected by two guards on the case. These guards should be symmetrical, crisp, and show no tool marks. Cheap fakes have asymmetrical or poorly finished crown guards.' },
    { step: 4, title: 'Case Back Engravings', detail: 'Most Rolex watches have a plain polished case back (no display, no engravings on the outside). The INSIDE has model/serial/certification markings. A see-through case back = NOT an authentic Rolex (Rolex does not make display case backs in regular production).' },
    { step: 5, title: 'Serial & Model Numbers (Case Side)', detail: 'Between the lugs at 6 o\'clock: model number. Between lugs at 12 o\'clock: serial number. On watches from ~2005 onward, the serial is engraved on the rehaut (inner bezel ring). Clean, precise laser engraving with "Rolex" text. Acid-etched or uneven = fake.' },
    { step: 6, title: 'Reference Number Verification', detail: 'Every Rolex reference has a specific combination of case, dial, bezel, and bracelet. Example: 126610LN = Submariner Date, 41mm, black dial, black cerachrom bezel, Oyster bracelet. Verify the reference against Rolex documentation before purchase. Mixed references are common in fakes.' },
  ] : [
    { step: 1, title: 'กำลังขยายเลนส์ Cyclops', detail: 'เลนส์ Cyclops เหนือช่องวันที่ขยาย 2.5× บน Rolex แท้ วันที่มองดูใหญ่มากผ่านเลนส์ ของปลอมขยาย 1–1.5× หรือวันที่ไม่อยู่ตรงกลาง นี่คือการตรวจที่เชื่อถือได้มากที่สุด' },
    { step: 2, title: 'เข็มวินาทีปัดต่อเนื่อง', detail: 'เข็มวินาที Rolex ไหลต่อเนื่อง (28,800 ครั้งต่อชั่วโมง) ไม่กระตุก เข็มวินาทีกระตุก = กลไกควอตซ์ = ไม่ใช่ Rolex แท้ (Rolex ไม่ผลิตนาฬิกาควอตซ์ในปัจจุบัน)' },
    { step: 3, title: 'Crown Guards (รุ่น Sports)', detail: 'บน Submariner และ GMT มีแกนที่ 3 นาฬิกาได้รับการปกป้องด้วยปีกสองข้าง ปีกควรสมมาตร คมชัด ไม่มีรอยเครื่องมือ ของปลอมถูกมีปีกไม่สมมาตรหรือขัดไม่เรียบ' },
    { step: 4, title: 'การแกะสลักหลังเคส', detail: 'Rolex ส่วนใหญ่มีหลังเคสเรียบขัดเงา (ไม่มีกระจก) ด้านในมีเครื่องหมายรุ่น/ซีเรียล/การรับรอง หลังเคสโปร่งใส = ไม่ใช่ Rolex แท้ (Rolex ไม่ผลิตหลังเคสโปร่งในการผลิตปกติ)' },
    { step: 5, title: 'เลขซีเรียลและรุ่น (ด้านข้างเคส)', detail: 'ระหว่างขาที่ 6 นาฬิกา: รหัสรุ่น ระหว่างขาที่ 12 นาฬิกา: เลขซีเรียล บนนาฬิกาตั้งแต่ ~2005 ซีเรียลแกะสลักบน rehaut (วงแหวนขอบด้านใน) การแกะสลักเลเซอร์สะอาดแม่นยำ กัดกรดหรือไม่สม่ำเสมอ = ปลอม' },
    { step: 6, title: 'การตรวจสอบรหัส Reference', detail: 'ทุก Rolex reference มีชุดเคส หน้าปัด กรอบ และสายเฉพาะ ตัวอย่าง: 126610LN = Submariner Date 41mm หน้าปัดดำ กรอบ cerachrom ดำ สาย Oyster ตรวจ reference กับเอกสาร Rolex ก่อนซื้อ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Rolex' : 'ตรวจสอบ Rolex'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate a Rolex Watch' : 'วิธีตรวจสอบนาฬิกา Rolex แท้'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Rolex is the most counterfeited watch brand. Superclones from Asia can fool beginners, but fail on the mechanics. Six checks — from easy visual to hands-on.'
          : 'Rolex คือแบรนด์นาฬิกาที่ถูกปลอมมากที่สุด Superclones จากเอเชียอาจหลอกมือใหม่ได้ แต่ล้มเหลวด้านกลไก หกการตรวจสอบ ตั้งแต่สายตาง่ายถึงสัมผัสมือ'}
      </p>

      <div className="space-y-4 mb-10">
        {checks.map(c => (
          <div key={c.step} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{c.step}</span>
              <h2 className="font-semibold text-gray-900">{c.title}</h2>
            </div>
            <p className="text-sm text-gray-600 ml-10">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-rolex" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-rolex" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Rolex Pre-Owned →' : 'Rolex มือสอง →'}</Link>
        <Link href={`/${locale}/compare/rolex-vs-patek-philippe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Patek →</Link>
        <Link href={`/${locale}/trends/watch-buying-guide-thailand`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Watch Buying Guide TH →' : 'คู่มือซื้อนาฬิกาไทย →'}</Link>
      </div>
    </div>
  )
}
