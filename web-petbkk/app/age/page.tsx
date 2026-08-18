'use client'
import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AgeShareCard from '@/components/AgeShareCard'

function AgeSchemaLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'เครื่องคำนวณอายุสัตว์เลี้ยง — Thai Pet Age Calculator',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      url: 'https://www.thailandpethub.com/age',
      description: 'คำนวณอายุสุนัขและแมวเทียบกับอายุมนุษย์ รองรับสุนัขพันธุ์เล็ก กลาง ใหญ่ และแมวทุกสายพันธุ์ ฟรี 100%',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'THB' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'อายุสุนัข 1 ปี เทียบกับมนุษย์กี่ปี?',
          acceptedAnswer: { '@type': 'Answer', text: 'สุนัขอายุ 1 ปี เทียบได้กับมนุษย์ประมาณ 15 ปี เพราะสุนัขพัฒนาเร็วมากในช่วงปีแรก ภายใน 1 ปีพวกเขาเจริญเติบโตจนเป็นผู้ใหญ่ที่สมบูรณ์แล้ว' },
        },
        {
          '@type': 'Question',
          name: 'อายุแมว 1 ปี เทียบกับมนุษย์กี่ปี?',
          acceptedAnswer: { '@type': 'Answer', text: 'แมวอายุ 1 ปี เทียบได้กับมนุษย์ประมาณ 15 ปี เช่นเดียวกับสุนัข แมวพัฒนาเร็วมากในช่วงขวบปีแรก' },
        },
        {
          '@type': 'Question',
          name: 'ทำไมสุนัขพันธุ์ใหญ่อายุสั้นกว่าพันธุ์เล็ก?',
          acceptedAnswer: { '@type': 'Answer', text: 'สุนัขพันธุ์ใหญ่มีอัตราการเมตาบอลิซึมสูงกว่า ร่างกายทำงานหนักกว่า และมีความเสี่ยงต่อปัญหาข้อต่อและหัวใจมากกว่า ทำให้อายุขัยเฉลี่ยสั้นกว่าสุนัขพันธุ์เล็ก' },
        },
      ],
    },
  ]
  return (
    <>
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </>
  )
}

type Species = 'dog' | 'cat'
type Size    = 'small' | 'medium' | 'large'

function petAgeToHuman(species: Species, size: Size, ageYears: number): number {
  if (ageYears <= 0) return 0
  if (species === 'cat') {
    if (ageYears <= 2) return Math.round(ageYears * 15)
    return Math.round(2 * 15 + (ageYears - 2) * 4)
  }
  const perYear = size === 'small' ? 4 : size === 'medium' ? 5 : 6
  if (ageYears <= 2) return Math.round(ageYears * 15)
  return Math.round(2 * 15 + (ageYears - 2) * perYear)
}

function humanStage(humanAge: number): string {
  if (humanAge < 18) return 'วัยเด็ก 🧒'
  if (humanAge < 36) return 'วัยรุ่น 👦'
  if (humanAge < 60) return 'วัยผู้ใหญ่ 🧑'
  return 'ผู้สูงวัย 👴'
}

const chipCls = (active: boolean) =>
  `px-4 py-2 rounded-full border text-sm transition-colors cursor-pointer ${
    active ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-200 hover:border-orange-300'
  }`

const SIZE_LABELS: Record<Size, string> = {
  small:  'เล็ก (< 10 กก.)',
  medium: 'กลาง (10–25 กก.)',
  large:  'ใหญ่ (> 25 กก.)',
}

/**
 * A static conversion table, rendered outside the Suspense boundary.
 *
 * `AgePageInner` calls `useSearchParams()`, which forces its entire boundary to
 * client-side rendering — and the fallback was `null`, so the prerendered HTML
 * for this route contained zero visible text. The route sat in the sitemap
 * advertising a page that, to a crawler, was blank.
 *
 * "อายุสุนัข 3 ปี เท่ากับกี่ปีคน" is a lookup question, and a table is the
 * answer format both featured snippets and answer engines prefer. The numbers
 * come from `petAgeToHuman`, so the table cannot drift from the calculator.
 */
function AgeConversionTable() {
  const ages = [1, 2, 3, 5, 7, 10, 13, 15, 20]
  const cols: Array<{ label: string; species: Species; size: Size }> = [
    { label: 'สุนัขพันธุ์เล็ก', species: 'dog', size: 'small' },
    { label: 'สุนัขพันธุ์กลาง', species: 'dog', size: 'medium' },
    { label: 'สุนัขพันธุ์ใหญ่', species: 'dog', size: 'large' },
    { label: 'แมว', species: 'cat', size: 'small' },
  ]

  return (
    <section className="mt-10">
      <h2 className="text-base font-bold text-gray-800 mb-1">ตารางเทียบอายุสุนัขและแมวเป็นอายุคน</h2>
      <p className="text-xs text-gray-400 mb-3">
        สองปีแรกนับเป็นปีละ 15 ปีคน หลังจากนั้นสุนัขพันธุ์เล็กปีละ 4 ปี พันธุ์กลางปีละ 5 ปี
        พันธุ์ใหญ่ปีละ 6 ปี และแมวปีละ 4 ปี
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-orange-50">
              <th scope="col" className="text-left px-3 py-2 font-semibold text-gray-700 rounded-l-lg">อายุจริง</th>
              {cols.map(c => (
                <th key={c.label} scope="col" className="text-right px-3 py-2 font-semibold text-gray-700 last:rounded-r-lg whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ages.map(a => (
              <tr key={a} className="border-b border-gray-100">
                <th scope="row" className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">{a} ปี</th>
                {cols.map(c => (
                  <td key={c.label} className="text-right px-3 py-2 text-gray-700 tabular-nums">
                    {petAgeToHuman(c.species, c.size, a)} ปีคน
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">
        ตัวเลขเป็นค่าประมาณเพื่อการเปรียบเทียบ อัตราการแก่ของแต่ละตัวขึ้นอยู่กับสายพันธุ์ น้ำหนัก
        และสุขภาพโดยรวม — <a href="/senior-care" className="text-orange-600 hover:underline">ดูคู่มือดูแลสัตว์เลี้ยงสูงวัย</a>
      </p>
    </section>
  )
}

export default function AgePage() {
  return (
    <main className="max-w-xl mx-auto">
      <AgeSchemaLd />
      <h1 className="text-2xl font-black text-gray-900 mb-1">🎂 คำนวณอายุน้องหมาน้องแมวเป็นอายุคน</h1>
      <p className="text-sm text-gray-500 mb-6">
        กรอกอายุจริงของสุนัขหรือแมว แล้วดูว่าเทียบเท่าอายุคนกี่ปี
        รองรับสุนัขพันธุ์เล็ก กลาง ใหญ่ และแมวทุกสายพันธุ์ ใช้ฟรี ไม่ต้องสมัครสมาชิก
      </p>
      <Suspense fallback={null}>
        <AgePageInner />
      </Suspense>
      <AgeConversionTable />
    </main>
  )
}

function AgePageInner() {
  const searchParams = useSearchParams()
  const initialSpecies = searchParams.get('species') === 'cat' ? 'cat' : 'dog'
  const initialSize = (['small', 'medium', 'large'] as Size[]).includes(searchParams.get('size') as Size)
    ? (searchParams.get('size') as Size) : 'small'
  const initialAgeParam = Number(searchParams.get('age'))
  const initialAge = Number.isFinite(initialAgeParam) && initialAgeParam > 0
    ? Math.min(initialAgeParam, 20)
    : 3
  const initialName = searchParams.get('name') ?? ''

  const [species, setSpecies] = useState<Species>(initialSpecies)
  const [size, setSize]       = useState<Size>(initialSize)
  const [age, setAge]         = useState(initialAge)
  const [name, setName]       = useState(initialName)

  const humanAge = useMemo(() => petAgeToHuman(species, size, age), [species, size, age])
  const stage    = humanStage(humanAge)
  const petLabel = species === 'dog' ? 'น้องหมา' : 'น้องแมว'
  const petEmoji = species === 'dog' ? '🐕' : '🐈'

  const shareParams = new URLSearchParams({ species, size, age: String(age) })
  if (name) shareParams.set('name', name)
  const shareUrl = `https://www.thailandpethub.com/age?${shareParams.toString()}`

  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`

  return (
    <>

      <div className="bg-white rounded-2xl border p-6 mb-6 space-y-6">
        {/* Species */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">ประเภทสัตว์เลี้ยง</p>
          <div className="flex gap-2">
            <button className={chipCls(species === 'dog')} onClick={() => setSpecies('dog')}>🐕 สุนัข</button>
            <button className={chipCls(species === 'cat')} onClick={() => setSpecies('cat')}>🐈 แมว</button>
          </div>
        </div>

        {/* Size (dogs only) */}
        {species === 'dog' && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">ขนาดสุนัข</p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(SIZE_LABELS) as [Size, string][]).map(([k, label]) => (
                <button key={k} className={chipCls(size === k)} onClick={() => setSize(k)}>{label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Name (optional) */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">ชื่อน้อง (ไม่บังคับ)</p>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="เช่น บัตเตอร์, มูมู..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Age slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">อายุจริง (ปี)</p>
            <span className="text-orange-600 font-bold">{age} ปี</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={age}
            onChange={e => setAge(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 ปี</span><span>20 ปี</span>
          </div>
        </div>
      </div>

      {/* Result */}
      {age > 0 && (
        <div className="mb-6">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center mb-4">
            <p className="text-sm text-gray-500 mb-1">เทียบเท่าอายุมนุษย์</p>
            <p className="text-5xl font-black text-orange-600 mb-1">{humanAge}</p>
            <p className="text-sm text-gray-500">ปี</p>
          </div>
          <p className="text-center text-sm text-gray-500">
            {name || petLabel} {petEmoji} อายุ {age} ปี — {stage}
          </p>
          <AgeShareCard
            petAge={age}
            humanAge={humanAge}
            species={species}
            petName={name || undefined}
            shareUrl={shareUrl}
          />
        </div>
      )}

      {/* LINE share */}
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-[#06C755] hover:bg-[#05b34b] text-white font-bold py-3.5 rounded-xl transition-colors mb-6"
      >
        แชร์ผลลัพธ์ผ่าน LINE
      </a>

      {/* Fun facts */}
      <div className="bg-white rounded-2xl border p-5">
        <h2 className="font-bold text-gray-900 mb-3 text-sm">รู้หรือไม่?</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2"><span>🐕</span><span>สุนัขขนาดเล็กมักมีอายุยืนกว่า 15 ปีในขณะที่พันธุ์ใหญ่มักไม่เกิน 10-12 ปี</span></li>
          <li className="flex items-start gap-2"><span>🐈</span><span>แมวบ้านเฉลี่ยอยู่ได้ 12-15 ปี แมวที่อยู่แต่ในบ้านมักอายุยืนกว่าแมวที่ออกนอก</span></li>
          <li className="flex items-start gap-2"><span>🏆</span><span>แมวที่แก่ที่สุดในบันทึกคือ Creme Puff จากสหรัฐอเมริกา อายุ 38 ปี!</span></li>
          <li className="flex items-start gap-2"><span>💉</span><span>การทำหมัน วัคซีน และอาหารดีช่วยเพิ่มอายุขัยสัตว์เลี้ยงได้อย่างมีนัยสำคัญ</span></li>
        </ul>
      </div>
    </>
  )
}
