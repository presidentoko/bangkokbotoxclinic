import data from '../data/hospital-licenses.json'

/**
 * Department of Livestock Development licence records, matched to clinics.
 *
 * Every animal clinic in Thailand must hold a licence under the Animal Clinic
 * Act B.E. 2533. DLD publishes the national register (petvet/dld_registry.py
 * collects it; petvet/match_registry.py attaches it to directory entries by
 * Thai name and district, conservatively — a wrong match would print another
 * business's licence on a clinic's page).
 *
 * This is the one fact on a clinic page that is not a copy of its Google Maps
 * listing, and it answers the question a directory is actually asked: is this
 * place licensed, and can it keep my animal overnight?
 *
 * An unmatched clinic is NOT evidence of an unlicensed one. The register lists
 * registered names, which often differ from the name on a sign or a map pin,
 * and the matcher leaves anything ambiguous alone. Nothing on the site may say
 * or imply "unlicensed".
 */

export type LicenseClass = '01' | '02' | '03' | '04' | 'gov'

export interface ClinicLicense {
  license_no: string
  license_class: LicenseClass | ''
  /**
   * The year printed in the licence number. Not shown as "licensed since": the
   * register does not say whether it is the year of first issue or of the
   * current licence, and a directory should not guess at a clinic's history.
   */
  license_year_be: number | null
  registered_name: string
}

interface LicenseFile {
  source: string
  publisher: string
  retrieved: string
  licenses: Record<string, ClinicLicense>
}

const file = data as LicenseFile

export const LICENSE_SOURCE = {
  url: file.source,
  publisher: file.publisher,
  retrieved: file.retrieved,
}

export function getLicense(hospitalId: string): ClinicLicense | null {
  return file.licenses[hospitalId] ?? null
}

export function licensedCount(): number {
  return Object.keys(file.licenses).length
}

/** The register's own wording, shortened, plus what it means for an owner. */
export const LICENSE_CLASS: Record<LicenseClass, { short: string; official: string; meaning: string }> = {
  '01': {
    short: 'ไม่มีที่พักสัตว์ป่วยค้างคืน',
    official: 'ประเภทที่ไม่มีที่พักสัตว์ป่วยไว้ค้างคืน',
    meaning: 'ตรวจรักษาแบบไป-กลับ ถ้าน้องต้องแอดมิทหรือเฝ้าดูอาการข้ามคืน อาจต้องส่งต่อที่อื่น',
  },
  '02': {
    short: 'รับสัตว์ป่วยค้างคืนได้ไม่เกิน 10 ตัว',
    official: 'ประเภทที่มีที่พักสัตว์ป่วยไว้ค้างคืนไม่เกินสิบที่',
    meaning: 'แอดมิทได้จำนวนจำกัด ถ้าเป็นเคสหนักหรือช่วงคนไข้แน่น ควรโทรถามว่าที่ว่างก่อนเดินทาง',
  },
  '03': {
    short: 'รับสัตว์ป่วยค้างคืนได้มากกว่า 10 ตัว',
    official: 'ประเภทที่มีที่พักสัตว์ป่วยไว้ค้างคืนเกินสิบที่',
    meaning: 'ระดับโรงพยาบาลสัตว์ รองรับการแอดมิทและผู้ป่วยในได้มากกว่า',
  },
  '04': {
    short: 'ไม่มีที่พักค้างคืน · ผู้ดำเนินการเป็นสัตวแพทย์ชั้นสอง',
    official: 'ประเภทที่ไม่มีที่พักสัตว์ป่วยไว้ค้างคืน สัตวแพทย์ชั้น 2',
    meaning: 'ตรวจรักษาแบบไป-กลับ ขอบเขตงานของผู้ประกอบวิชาชีพชั้นสองแคบกว่าชั้นหนึ่ง เคสที่ซับซ้อนหรือต้องผ่าตัดควรถามก่อนว่ารับได้ไหม',
  },
  gov: {
    short: 'สถานพยาบาลสัตว์ของทางราชการ',
    official: 'สถานพยาบาลสัตว์ของทางราชการ',
    meaning: 'ดำเนินการโดยหน่วยงานรัฐ บริการและเวลาทำการอาจต่างจากคลินิกเอกชน ควรโทรสอบถามก่อน',
  },
}
