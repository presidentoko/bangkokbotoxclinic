import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ฉุกเฉิน! เมื่อไหร่ควรพาสัตว์เลี้ยงไปหาหมอทันที — PetBKK',
  description: 'สัญญาณอันตรายที่ต้องพาสัตว์เลี้ยงไปโรงพยาบาลทันที พร้อมลิสต์โรงพยาบาล 24 ชั่วโมง',
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
  color: string
  borderColor: string
  bgColor: string
  signals: Signal[]
}

const LEVELS: Level[] = [
  {
    level: 'critical',
    emoji: '🚨',
    title: 'ฉุกเฉินสูงสุด — ไปโรงพยาบาลทันที ไม่รอ!',
    subtitle: 'สัญญาณเหล่านี้คือภาวะคุกคามชีวิต',
    color: 'text-red-700',
    borderColor: 'border-red-400',
    bgColor: 'bg-red-50',
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
    title: 'เร่งด่วน — ไปหาหมอภายใน 2-4 ชั่วโมง',
    subtitle: 'ไม่ถึงกับวิกฤต แต่ต้องพบสัตวแพทย์วันนี้',
    color: 'text-orange-700',
    borderColor: 'border-orange-300',
    bgColor: 'bg-orange-50',
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
    title: 'เฝ้าระวัง — นัดหมอปกติได้ แต่จดไว้',
    subtitle: 'ไม่ฉุกเฉิน แต่ควรปรึกษาสัตวแพทย์',
    color: 'text-blue-700',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
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
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">{level.emoji}</span>
              <div>
                <h2 className={`font-bold text-base ${level.color}`}>{level.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{level.subtitle}</p>
              </div>
            </div>
            <div className="space-y-3">
              {level.signals.map(s => (
                <div key={s.symptom} className="bg-white rounded-xl border p-3">
                  <p className="font-semibold text-sm text-gray-900 mb-0.5">{s.symptom}</p>
                  <p className="text-xs text-gray-500">{s.why}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-2xl border p-6 text-center">
        <p className="font-bold text-gray-900 mb-2">ค้นหาโรงพยาบาลสัตว์เลี้ยง 24 ชั่วโมงใกล้บ้าน</p>
        <p className="text-sm text-gray-500 mb-4">เปิดให้บริการตลอด 24 ชั่วโมง รองรับกรณีฉุกเฉิน</p>
        <a
          href="/hospital?filter=24h"
          className="inline-block px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
        >
          🏥 ค้นหาโรงพยาบาล 24 ชม.
        </a>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        * ข้อมูลนี้ไม่ใช่คำแนะนำทางการแพทย์ กรุณาปรึกษาสัตวแพทย์ในกรณีฉุกเฉิน
      </p>
    </main>
  )
}
