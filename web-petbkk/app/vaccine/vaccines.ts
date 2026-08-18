/**
 * Shared by the server-rendered schedule tables in page.tsx and by the client
 * calculator. It has to live outside the `'use client'` module: exports from a
 * client module reach a Server Component as reference proxies, not real values,
 * so the build failed with "c is not iterable" when page.tsx tried to sort them.
 */
export interface VaxItem {
  name: string
  // Weeks of age, not months. These values were previously named `ageMonths`
  // and fed straight into `setMonth()`, which turned the standard 6/9/12/14
  // WEEK puppy series into a 6/9/12/14 MONTH one — telling owners to give the
  // first DHPPiL at six months and the rabies shot at fourteen, leaving a puppy
  // unprotected through the whole parvovirus window.
  ageWeeks: number[]
  note: string
  recurring?: number   // months between boosters after initial series (12 = annual)
}

export const DOG_VACCINES: VaxItem[] = [
  { name: 'DHPPiL ครั้งที่ 1', ageWeeks: [6], note: 'ไข้หัดสุนัข, ตับอักเสบ, พาร์โวไวรัส, เลปโตสไปโรซิส' },
  { name: 'DHPPiL ครั้งที่ 2', ageWeeks: [10], note: 'กระตุ้นครั้งที่ 2 ห่างจากเข็มแรกประมาณ 3–4 สัปดาห์' },
  { name: 'DHPPiL ครั้งที่ 3', ageWeeks: [14], note: 'กระตุ้นครั้งที่ 3 ปิดชุดวัคซีนลูกสุนัข' },
  { name: 'วัคซีนพิษสุนัขบ้า', ageWeeks: [14], note: 'บังคับตามกฎหมาย ต่ออายุทุกปี', recurring: 12 },
  { name: 'วัคซีนไข้หวัดสุนัข (Bordetella)', ageWeeks: [8], note: 'แนะนำสำหรับสุนัขที่เข้าฝึกอบรมหรืออยู่รวมกลุ่ม', recurring: 12 },
  { name: 'DHPPiL กระตุ้นประจำปี', ageWeeks: [52], note: 'กระตุ้นเข็มแรกเมื่ออายุ 1 ปี จากนั้นทุกปีตลอดชีวิต', recurring: 12 },
]

export const CAT_VACCINES: VaxItem[] = [
  { name: 'FVRCP ครั้งที่ 1', ageWeeks: [6], note: 'ไข้หวัดแมว, คาลิซิไวรัส, แพนลูโคพีเนีย' },
  { name: 'FVRCP ครั้งที่ 2', ageWeeks: [10], note: 'กระตุ้นครั้งที่ 2 ห่างจากเข็มแรกประมาณ 3–4 สัปดาห์' },
  { name: 'FVRCP ครั้งที่ 3', ageWeeks: [14], note: 'กระตุ้นครั้งที่ 3 ปิดชุดวัคซีนลูกแมว' },
  { name: 'FeLV (มะเร็งเม็ดเลือดขาวแมว)', ageWeeks: [8], note: 'แนะนำสำหรับแมวที่ออกนอกบ้านหรืออยู่รวมหลายตัว', recurring: 12 },
  { name: 'วัคซีนพิษสุนัขบ้า (แมว)', ageWeeks: [14], note: 'แนะนำโดยเฉพาะแมวที่ออกนอกบ้าน', recurring: 12 },
  { name: 'FVRCP กระตุ้นประจำปี/3ปี', ageWeeks: [52], note: 'กระตุ้นเมื่ออายุ 1 ปี จากนั้นทุก 1–3 ปีตามชนิดวัคซีน', recurring: 12 },
]
