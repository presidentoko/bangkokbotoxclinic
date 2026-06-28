import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-celine'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Celine Bags Thailand 2025 | ChicPreowned'
      : 'วิธีตรวจสอบกระเป๋า Celine แท้ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'How to spot fake Celine in Thailand — Triomphe canvas, interior stamp, turn-lock, zipper, leather, serial tag. Authenticate Celine pre-owned Bangkok 2025.'
      : 'วิธีสังเกตกระเป๋า Celine ปลอมในไทย — canvas Triomphe ตราประทับภายใน turn-lock ซิป หนัง แท็ก serial ตรวจสอบ Celine มือสองในกรุงเทพ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function AuthenticateCelineTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { title: 'Triomphe canvas print', detail: 'The Triomphe "C" overlapping logo must be perfectly symmetrical. Authentic canvas has a fine woven texture — run your finger across and feel it. Fakes use flat printed canvas. The "CELINE" repeat text must have identical kerning throughout. Cut edges should be clean and heat-sealed.' },
    { title: 'Interior stamp and era', detail: 'Authentic Celine: "CELINE / PARIS" in deep debossed gold/silver lettering (not printed). Key era rule: Phoebe Philo era (before 2018) = "CÉLINE" with accent. Hedi Slimane era (2018–present) = "CELINE" no accent. Fakes mix eras — wrong stamp for the bag shape = red flag.' },
    { title: 'Classic Box turn-lock', detail: 'The turn-lock should click decisively when locked — no wobble. "CELINE" engraving on the lock must be deep and precise. Fake locks feel loose with shallow engraving. Press from the side — authentic has zero lateral play.' },
    { title: 'Zipper quality', detail: 'Authentic Celine uses YKK or branded "CELINE" zippers. Heavy pull weight. Luggage bag zippers open and close with even resistance throughout. Fake zippers catch, skip, or feel plasticky.' },
    { title: 'Leather texture', detail: 'Authentic Celine calfskin has a consistently pebbled texture. Clean leather smell — no chemicals. Fakes have irregular pebble with smoothed patches. Interior lining should be evenly soft, not patchy.' },
    { title: 'Serial number tag', detail: 'Leather tag sewn (not glued) inside main compartment. Format: letter + number series. Thread on the tag matches interior lining color. Fake tags are often glued or use mismatched thread.' },
  ] : [
    { title: 'ลาย Triomphe canvas', detail: 'โลโก้ "C" ซ้อนกันต้องสมมาตรสมบูรณ์แบบ canvas แท้มีพื้นผิวทอที่ละเอียด ลูบด้วยนิ้วแล้วรู้สึก ของปลอมใช้ canvas พิมพ์ธรรมดา ข้อความ "CELINE" ที่พิมพ์ซ้ำต้องมี kerning เหมือนกันตลอด ขอบตัดต้องสะอาดและ heat-sealed' },
    { title: 'ตราประทับภายในและยุค', detail: 'Celine แท้: "CELINE / PARIS" ตัวหนังสือแกะสลักลึก gold/silver (ไม่ใช่พิมพ์) กฎสำคัญ: ยุค Phoebe Philo (ก่อน 2018) = "CÉLINE" มีสำเนียง ยุค Hedi Slimane (2018–ปัจจุบัน) = "CELINE" ไม่มีสำเนียง ของปลอมผสมยุค — ตราผิดสำหรับรูปทรงกระเป๋า = สัญญาณเตือน' },
    { title: 'Turn-lock ของ Classic Box', detail: 'Turn-lock ต้องคลิกชัดเจนเมื่อล็อก ไม่สั่น การแกะสลัก "CELINE" บน lock ต้องลึกและแม่นยำ Lock ปลอมรู้สึกหลวมและการแกะสลักตื้น กดจากด้านข้าง — ของแท้ไม่มีการเคลื่อนที่ด้านข้าง' },
    { title: 'คุณภาพซิป', detail: 'Celine แท้ใช้ซิป YKK หรือ "CELINE" แบบ branded น้ำหนักที่จับหนัก ซิปกระเป๋า Luggage เปิดปิดด้วยแรงต้านสม่ำเสมอ ซิปปลอมติด กระโดด หรือรู้สึกเหมือนพลาสติก' },
    { title: 'พื้นผิวหนัง', detail: 'Celine calfskin แท้มีพื้นผิวปุ่มสม่ำเสมอ กลิ่นหนังสะอาด ไม่มีสารเคมี ของปลอมมีปุ่มไม่สม่ำเสมอ มีจุดที่เรียบ ซับในต้องอ่อนนุ่มสม่ำเสมอ ไม่เป็นจุด' },
    { title: 'แท็ก serial', detail: 'แท็กหนังเย็บ (ไม่ใช่ติดกาว) ด้านในช่องหลัก รูปแบบ: ตัวอักษร + ชุดตัวเลข ด้ายบนแท็กต้องตรงกับสีซับใน แท็กปลอมมักติดกาวหรือใช้ด้ายที่ไม่ตรงกัน' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'How to Authenticate Celine' : 'วิธีตรวจสอบ Celine แท้'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Celine Bags 2025' : 'วิธีตรวจสอบกระเป๋า Celine แท้ 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Celine counterfeits have grown more sophisticated with the Triomphe canvas trend. The Luggage and Classic Box are heavily faked in Bangkok markets. The CÉLINE (accent) vs CELINE (no accent) era confusion is the most common fake indicator.'
          : 'ของปลอม Celine ซับซ้อนขึ้นตามเทรนด์ canvas Triomphe Luggage และ Classic Box ถูกปลอมแปลงมากในตลาดกรุงเทพ ความสับสน CÉLINE (มีสำเนียง) vs CELINE (ไม่มีสำเนียง) เป็นตัวบ่งชี้ของปลอมที่พบบ่อยที่สุด'}
      </p>

      <div className="space-y-4 mb-10">
        {checks.map((c, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">{i + 1}</div>
              <div>
                <h2 className="font-bold text-gray-900 mb-1">{c.title}</h2>
                <p className="text-sm text-gray-600">{c.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-blue-900 mb-2">
          {isEn ? 'Era check: CÉLINE vs CELINE' : 'ตรวจสอบยุค: CÉLINE vs CELINE'}
        </h3>
        <p className="text-sm text-blue-800">
          {isEn
            ? 'Phoebe Philo era (before 2018): "CÉLINE" with accent. Hedi Slimane era (2018–present): "CELINE" no accent. A fake mixing eras — Philo-era shape with Slimane-era stamp — is an immediate red flag on Bangkok resale markets.'
            : 'ยุค Phoebe Philo (ก่อน 2018): "CÉLINE" มีสำเนียง ยุค Hedi Slimane (2018–ปัจจุบัน): "CELINE" ไม่มีสำเนียง ของปลอมที่ผสมยุค — รูปทรงยุค Philo กับตราประทับยุค Slimane — เป็นสัญญาณเตือนทันทีในตลาดมือสองกรุงเทพ'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-celine" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-celine" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Celine Pre-Owned →' : 'Celine มือสอง →'}</Link>
        <Link href={`/${locale}/compare/celine-vs-saint-laurent`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Celine vs Saint Laurent →</Link>
      </div>
    </div>
  )
}
