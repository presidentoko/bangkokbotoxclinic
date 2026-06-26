import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'คู่มือฉุกเฉินสัตว์เลี้ยง — อาการไหนต้องไปหาหมอทันที',
  description: 'อาการฉุกเฉินในสัตว์เลี้ยงที่ต้องรีบพบสัตวแพทย์ทันที รวมถึงอาการที่ต้องติดตาม แบ่งตามระดับความรุนแรง',
  openGraph: {
    title: '🚨 คู่มือฉุกเฉินสัตว์เลี้ยง — ต้องไปหาหมอเมื่อไหร่?',
    description: 'อาการฉุกเฉิน 17 ข้อที่ต้องรีบพบสัตวแพทย์ทันที แบ่งตามระดับความรุนแรง',
    url: 'https://www.thailandpethub.com/emergency',
    type: 'website',
  },
}

interface Signal {
  symptom: string
  why: string
}

interface Level {
  level: 'critical' | 'urgent' | 'monitor'
  emoji: string
  title: string
  subtitle: string
  badge: string
  color: string
  badgeColor: string
  borderColor: string
  bgColor: string
  bulletColor: string
  signals: Signal[]
}

const LEVELS: Level[] = [
  {
    level: 'critical',
    emoji: '🚨',
    title: 'ฉุกเฉินสูงสุด',
    subtitle: 'สัญญาณเหล่านี้คือภาวะคุกคามชีวิต',
    badge: 'ไปพบสัตวแพทย์ทันที ไม่รอ!',
    color: 'text-red-700',
    badgeColor: 'bg-red-100 text-red-700',
    borderColor: 'border-red-400',
    bgColor: 'bg-red-50',
    bulletColor: 'text-red-500',
    signals: [
      { symptom: 'หายใจลำบาก / หอบ / ปากเปิดหายใจ (แมว)', why: 'อาจเกิดจากหัวใจ ปอด หรืออุดตันทางเดินหายใจ' },
      { symptom: 'ชัก หรือสั่นเกร็งทั้งตัว', why: 'อาจเป็นพิษ ลมชัก หรือน้ำตาลต่ำ' },
      { symptom: 'หมดสติ / เป็นลม / ไม่ตอบสนอง', why: 'อันตรายถึงชีวิต ต้องช่วยเหลือด่วน' },
      { symptom: 'เลือดออกมาก ห้ามไม่หยุด', why: 'เสี่ยงช็อกจากการเสียเลือด' },
      { symptom: 'ท้องบวมแข็งผิดปกติ โดยเฉพาะสุนัขพันธุ์ใหญ่', why: 'อาจเกิด GDV (กระเพาะบิด) อันตรายถึงตายใน 2-3 ชั่วโมง' },
      { symptom: 'กินสารพิษหรือยาเกินขนาด', why: 'ช็อกโกแลต ยา กำจัดแมลง สารเคมี ต้องล้างพิษด่วน' },
      { symptom: 'ร้องเจ็บปวดมาก เดินไม่ได้ ขาหัก', why: 'บาดเจ็บรุนแรง อาจมีอวัยวะภายในเสียหาย' },
      { symptom: 'ปัสสาวะไม่ออกเกิน 24 ชม. (โดยเฉพาะแมวตัวผู้)', why: 'นิ่วอุดตัน อันตรายถึงตายใน 24-48 ชม. หากไม่รักษา' },
    ],
  },
  {
    level: 'urgent',
    emoji: '⚠️',
    title: 'เร่งด่วน',
    subtitle: 'ไม่ถึงกับวิกฤต แต่ต้องพบสัตวแพทย์วันนี้',
    badge: 'ไปหาหมอภายใน 2-4 ชั่วโมง',
    color: 'text-orange-700',
    badgeColor: 'bg-orange-100 text-orange-700',
    borderColor: 'border-orange-300',
    bgColor: 'bg-orange-50',
    bulletColor: 'text-orange-500',
    signals: [
      { symptom: 'อาเจียนหรือท้องเสียมากกว่า 3 ครั้ง / มีเลือด', why: 'เสี่ยงขาดน้ำและติดเชื้อ' },
      { symptom: 'ไม่กินอาหาร 2 วัน หรือดื่มน้ำมากผิดปกติ', why: 'อาจเป็นสัญญาณเบาหวาน ไตวาย หรือโรคอื่น' },
      { symptom: 'ตาแดง มีขี้ตามาก บวม หรือมองไม่เห็น', why: 'อาจเป็นการติดเชื้อหรือต้อหินเฉียบพลัน' },
      { symptom: 'ขาเป๋ ลากขา ไม่อยากลุก', why: 'อาจเป็นบาดแผล กระดูกหัก หรือปัญหาไขสันหลัง' },
      { symptom: 'หูแดง มีกลิ่นเหม็น ส่ายหัวตลอด', why: 'หูชั้นกลางอักเสบ ต้องรักษาก่อนลุกลาม' },
    ],
  },
  {
    level: 'monitor',
    emoji: '👀',
    title: 'เฝ้าระวัง',
    subtitle: 'ไม่ฉุกเฉิน แต่ควรปรึกษาสัตวแพทย์',
    badge: 'นัดหมอปกติได้ แต่จดไว้',
    color: 'text-blue-700',
    badgeColor: 'bg-blue-100 text-blue-700',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
    bulletColor: 'text-blue-500',
    signals: [
      { symptom: 'น้ำหนักลดหรือเพิ่มผิดปกติ', why: 'อาจสัมพันธ์กับปัญหาระบบเผาผลาญ' },
      { symptom: 'ขนร่วงมากกว่าปกติ', why: 'อาจเป็นภูมิแพ้ ขาดสารอาหาร หรือฮอร์โมน' },
      { symptom: 'หายใจมีเสียงดัง / กรน', why: 'บางสายพันธุ์เป็นปกติ แต่ควรตรวจ' },
      { symptom: 'ขูดหน้า เลียตัว หรือเกาซ้ำๆ', why: 'อาจเป็นภูมิแพ้อาหารหรือสิ่งแวดล้อม' },
    ],
  },
]

export default function EmergencyPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': LEVELS.flatMap(level =>
              level.signals.map(s => ({
                '@type': 'Question',
                'name': s.symptom,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': `${s.why} (ระดับ: ${level.title})`,
                },
              }))
            ),
          }),
        }}
      />
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🚨</span>
        <h1 className="text-2xl font-bold">คู่มือฉุกเฉินสัตว์เลี้ยง</h1>
      </div>
      <p className="text-sm text-gray-400 mb-8">
        บุ๊กมาร์กหน้านี้ไว้ เผื่อวันที่น้องต้องการความช่วยเหลือ
      </p>

      <div className="space-y-6">
        {LEVELS.map(level => (
          <section key={level.level} className={`rounded-2xl border-2 ${level.borderColor} ${level.bgColor} p-6`}>
            {/* Section header */}
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">{level.emoji}</span>
              <div>
                <h2 className={`text-xl font-black ${level.color} mb-1 flex items-center gap-2 flex-wrap`}>
                  {level.title}
                  <span className={`px-2 py-0.5 rounded-full text-sm font-bold ${level.badgeColor}`}>
                    {level.badge}
                  </span>
                </h2>
                <p className="text-sm text-gray-500">{level.subtitle}</p>
              </div>
            </div>

            {/* Signal items */}
            <ul className="space-y-1">
              {level.signals.map(s => (
                <li key={s.symptom} className="flex items-start gap-2 py-2 border-b border-white/60 last:border-0">
                  <span className={`${level.bulletColor} font-bold flex-shrink-0 mt-0.5`}>•</span>
                  <div>
                    <span className="text-gray-800 text-sm font-semibold leading-relaxed">{s.symptom}</span>
                    <span className="text-gray-500 text-xs block mt-0.5">{s.why}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* CTA to hospital */}
      <div className="mt-8 bg-white rounded-2xl border-2 border-red-200 p-6 text-center">
        <p className="font-black text-gray-900 text-lg mb-1">ค้นหาโรงพยาบาลสัตว์เลี้ยง 24 ชั่วโมง</p>
        <p className="text-sm text-gray-500 mb-4">เปิดให้บริการตลอด 24 ชั่วโมง รองรับกรณีฉุกเฉิน</p>
        <a
          href="/hospital?filter=24h"
          className="inline-block px-8 py-3 bg-red-600 text-white font-black text-base rounded-xl hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
        >
          🏥 ค้นหาโรงพยาบาล 24 ชม. →
        </a>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        * ข้อมูลนี้ไม่ใช่คำแนะนำทางการแพทย์ กรุณาปรึกษาสัตวแพทย์ในกรณีฉุกเฉิน
      </p>

      <RelatedGuides current="emergency" />
    </main>
  )
}
