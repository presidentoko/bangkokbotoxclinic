import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'อาหารที่ห้ามให้สุนัขและแมวกิน — PetBKK',
  description: 'รายการอาหารที่เป็นพิษต่อสุนัขและแมว พร้อมอาการและความรุนแรง',
}

interface ToxicFood {
  name: string
  nameTh: string
  toxicFor: 'both' | 'dog' | 'cat'
  severity: 'deadly' | 'serious' | 'mild'
  symptoms: string
  why: string
}

const FOODS: ToxicFood[] = [
  { name: 'Chocolate', nameTh: 'ช็อกโกแลต', toxicFor: 'both', severity: 'deadly',
    symptoms: 'อาเจียน ท้องเสีย ชัก หัวใจเต้นผิดปกติ', why: 'Theobromine และ caffeine สะสมในร่างกายสัตว์ ย่อยไม่ได้เหมือนมนุษย์' },
  { name: 'Grapes & Raisins', nameTh: 'องุ่นและลูกเกด', toxicFor: 'both', severity: 'deadly',
    symptoms: 'อาเจียน ซึม ไตวายเฉียบพลัน', why: 'ยังไม่รู้สารพิษแน่ชัด แต่ทำให้ไตวายแม้กินปริมาณน้อย' },
  { name: 'Onion & Garlic', nameTh: 'หัวหอมและกระเทียม', toxicFor: 'both', severity: 'serious',
    symptoms: 'เลือดจาง อ่อนเพลีย ปัสสาวะสีน้ำตาลแดง', why: 'Thiosulfate ทำลายเม็ดเลือดแดง ทุกรูปแบบ (ดิบ, สุก, ผง)' },
  { name: 'Macadamia Nuts', nameTh: 'แมคคาเดเมียนัต', toxicFor: 'dog', severity: 'serious',
    symptoms: 'กล้ามเนื้ออ่อนแรง ไข้สูง อาเจียน ตัวสั่น', why: 'สารพิษในแมคคาเดเมียส่งผลต่อระบบประสาทสุนัขโดยเฉพาะ' },
  { name: 'Xylitol (สารให้ความหวาน)', nameTh: 'Xylitol / น้ำตาลแอลกอฮอล์', toxicFor: 'dog', severity: 'deadly',
    symptoms: 'น้ำตาลในเลือดต่ำ ชัก ตับวาย', why: 'พบในหมากฝรั่ง ขนมหวาน ยาสีฟัน ทำให้ร่างกายหลั่งอินซูลินมากเกิน' },
  { name: 'Avocado', nameTh: 'อะโวคาโด', toxicFor: 'both', severity: 'serious',
    symptoms: 'อาเจียน ท้องเสีย หัวใจและปอดเสียหาย', why: 'Persin ในเปลือก เนื้อ และเมล็ดมีพิษต่อสัตว์เลี้ยง' },
  { name: 'Alcohol', nameTh: 'เครื่องดื่มแอลกอฮอล์', toxicFor: 'both', severity: 'deadly',
    symptoms: 'เดินเซ หายใจช้า ชัก โคม่า', why: 'ร่างกายสัตว์เลี้ยงประมวลผลแอลกอฮอล์ไม่ได้ แม้ปริมาณน้อยก็อันตราย' },
  { name: 'Raw Yeast Dough', nameTh: 'แป้งหมักดิบ (ขนมปัง)', toxicFor: 'both', severity: 'serious',
    symptoms: 'ท้องอืด ปวด ชัก', why: 'ยีสต์ขยายตัวในท้อง ผลิตแอลกอฮอล์และก๊าซ' },
  { name: 'Milk & Dairy (excess)', nameTh: 'นมวัวและผลิตภัณฑ์นม', toxicFor: 'cat', severity: 'mild',
    symptoms: 'ท้องเสีย แก๊ส อาเจียน', why: 'แมวส่วนใหญ่ขาดเอนไซม์ lactase ย่อยน้ำตาลในนมไม่ได้' },
  { name: 'Raw Fish (excessive)', nameTh: 'ปลาดิบ (มากเกินไป)', toxicFor: 'cat', severity: 'mild',
    symptoms: 'ชัก สูญเสียการทรงตัว (thiamine deficiency)', why: 'เอนไซม์ Thiaminase ในปลาดิบทำลาย Vitamin B1 (Thiamine)' },
  { name: 'Coffee & Caffeine', nameTh: 'กาแฟและคาเฟอีน', toxicFor: 'both', severity: 'serious',
    symptoms: 'หัวใจเต้นเร็ว ตัวสั่น ชัก', why: 'Methylxanthines กระตุ้นระบบประสาทรุนแรง' },
  { name: 'Salt (large amounts)', nameTh: 'เกลือ/อาหารเค็มมาก', toxicFor: 'both', severity: 'serious',
    symptoms: 'ดื่มน้ำมาก เดินเซ ไตวาย', why: 'โซเดียมเกินทำให้เซลล์ขาดน้ำ โดยเฉพาะสมองและไต' },
]

const SEV: Record<string, { bg: string; text: string; label: string }> = {
  deadly:  { bg: 'bg-gray-900', text: 'text-white',     label: 'อันตรายถึงชีวิต' },
  serious: { bg: 'bg-red-100',  text: 'text-red-700',   label: 'อันตรายสูง' },
  mild:    { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'ระวัง' },
}

export default function ToxicPage() {
  const faqItems = FOODS.map(f => ({
    q: `สุนัขหรือแมวกิน${f.nameTh}ได้ไหม?`,
    a: `ไม่ได้ — ${f.why} อาการที่พบ: ${f.symptoms}`,
  }))

  return (
    <main className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <h1 className="text-2xl font-bold mb-2">อาหารที่ห้ามให้สุนัขและแมวกิน</h1>
      <p className="text-sm text-gray-400 mb-2">
        อาหารเหล่านี้อาจดูไม่อันตรายสำหรับมนุษย์ แต่เป็นพิษต่อสัตว์เลี้ยง
      </p>
      <div className="flex gap-2 mb-8">
        {Object.entries(SEV).map(([k, v]) => (
          <span key={k} className={`text-xs px-2.5 py-1 rounded-full font-medium ${v.bg} ${v.text}`}>{v.label}</span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {FOODS.map(food => {
          const sev = SEV[food.severity]
          return (
            <div key={food.name} className="bg-white rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-bold text-gray-900">{food.nameTh}</p>
                  <p className="text-xs text-gray-400">{food.name}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sev.bg} ${sev.text}`}>
                    {sev.label}
                  </span>
                  {food.toxicFor !== 'both' && (
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                      {food.toxicFor === 'dog' ? '🐕 สุนัขเท่านั้น' : '🐈 แมวเท่านั้น'}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1"><span className="font-medium">สาเหตุ:</span> {food.why}</p>
              <p className="text-xs text-red-600"><span className="font-medium">อาการ:</span> {food.symptoms}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
        <p className="font-bold text-red-700 mb-2">สัตว์เลี้ยงกินสิ่งเหล่านี้เข้าไป?</p>
        <p className="text-sm text-gray-600 mb-3">อย่ารอ — พาไปโรงพยาบาลสัตว์ทันที</p>
        <a href="/hospital?filter=emergency" className="inline-block px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-sm">
          🚨 หาโรงพยาบาลฉุกเฉิน →
        </a>
      </div>
    </main>
  )
}
