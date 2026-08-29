import type { Hospital } from './types'
import { haversineKm, loadBangkokHospitals, hospitalSlug } from './hospitals'

/**
 * Bangkok khet landing pages.
 *
 * These exist because "คลินิกสัตว์ใกล้ฉัน" is the only query class this site
 * converts on — roughly 11% CTR against under 0.2% on the clinic brand names
 * that supply most of its impressions — and it had no landing page at all.
 *
 * They were not buildable until now: `district` comes from the Places API
 * address, and the coordinates that order each list were grid probe points on
 * 92% of records until the same backfill replaced them. Membership is read off
 * the address text, never inferred from a coordinate, so a clinic is only ever
 * listed under the khet its own address states.
 */
export interface District {
  slug: string
  th: string
  en: string
}

const DISTRICTS: District[] = [
  { slug: 'huai-khwang', th: 'ห้วยขวาง', en: 'Huai Khwang' },
  { slug: 'watthana', th: 'วัฒนา', en: 'Watthana' },
  { slug: 'din-daeng', th: 'ดินแดง', en: 'Din Daeng' },
  { slug: 'chatuchak', th: 'จตุจักร', en: 'Chatuchak' },
  { slug: 'wang-thonglang', th: 'วังทองหลาง', en: 'Wang Thonglang' },
  { slug: 'suan-luang', th: 'สวนหลวง', en: 'Suan Luang' },
  { slug: 'pathum-wan', th: 'ปทุมวัน', en: 'Pathum Wan' },
  { slug: 'phaya-thai', th: 'พญาไท', en: 'Phaya Thai' },
  { slug: 'sathon', th: 'สาทร', en: 'Sathon' },
  { slug: 'thon-buri', th: 'ธนบุรี', en: 'Thon Buri' },
  { slug: 'khlong-toei', th: 'คลองเตย', en: 'Khlong Toei' },
  { slug: 'bangkok-noi', th: 'บางกอกน้อย', en: 'Bangkok Noi' },
  { slug: 'bangkok-yai', th: 'บางกอกใหญ่', en: 'Bangkok Yai' },
  { slug: 'taling-chan', th: 'ตลิ่งชัน', en: 'Taling Chan' },
  { slug: 'chom-thong', th: 'จอมทอง', en: 'Chom Thong' },
  { slug: 'phasi-charoen', th: 'ภาษีเจริญ', en: 'Phasi Charoen' },
  { slug: 'yan-nawa', th: 'ยานนาวา', en: 'Yan Nawa' },
  { slug: 'bang-kho-laem', th: 'บางคอแหลม', en: 'Bang Kho Laem' },
  { slug: 'phra-khanong', th: 'พระโขนง', en: 'Phra Khanong' },
  { slug: 'thung-khru', th: 'ทุ่งครุ', en: 'Thung Khru' },
  { slug: 'prawet', th: 'ประเวศ', en: 'Prawet' },
  { slug: 'bang-na', th: 'บางนา', en: 'Bang Na' },
  { slug: 'bang-khun-thian', th: 'บางขุนเทียน', en: 'Bang Khun Thian' },
  { slug: 'ratchathewi', th: 'ราชเทวี', en: 'Ratchathewi' },
  { slug: 'rat-burana', th: 'ราษฎร์บูรณะ', en: 'Rat Burana' },
  { slug: 'bang-khen', th: 'บางเขน', en: 'Bang Khen' },
  { slug: 'thawi-watthana', th: 'ทวีวัฒนา', en: 'Thawi Watthana' },
  { slug: 'bueng-kum', th: 'บึงกุ่ม', en: 'Bueng Kum' },
  { slug: 'pom-prap', th: 'ป้อมปราบศัตรูพ่าย', en: 'Pom Prap Sattru Phai' },
  { slug: 'bang-rak', th: 'บางรัก', en: 'Bang Rak' },
  { slug: 'dusit', th: 'ดุสิต', en: 'Dusit' },
  { slug: 'bang-bon', th: 'บางบอน', en: 'Bang Bon' },
  { slug: 'lak-si', th: 'หลักสี่', en: 'Lak Si' },
  { slug: 'khan-na-yao', th: 'คันนายาว', en: 'Khan Na Yao' },
  { slug: 'samphanthawong', th: 'สัมพันธวงศ์', en: 'Samphanthawong' },
  { slug: 'phra-nakhon', th: 'พระนคร', en: 'Phra Nakhon' },
  { slug: 'lat-krabang', th: 'ลาดกระบัง', en: 'Lat Krabang' },
  { slug: 'bang-phlat', th: 'บางพลัด', en: 'Bang Phlat' },
  { slug: 'khlong-sam-wa', th: 'คลองสามวา', en: 'Khlong Sam Wa' },
  { slug: 'lat-phrao', th: 'ลาดพร้าว', en: 'Lat Phrao' },
]

/**
 * A page listing two clinics is how you earn "Crawled - currently not indexed",
 * and Search Console already reports 39 of those. Districts below this bar are
 * still reachable through the hub's full A–Z directory, just not given a page.
 */
const MIN_HOSPITALS = 5

export interface DistrictData {
  district: District
  hospitals: Hospital[]
  /** Mean position of the district's own clinics — used only to order `nearby`. */
  center: { lat: number; lng: number }
  nearby: Array<{ hospital: Hospital; distKm: number }>
}

let cache: DistrictData[] | null = null

function buildAll(): DistrictData[] {
  if (cache) return cache
  const all = loadBangkokHospitals()

  cache = DISTRICTS.map(district => {
    const hospitals = all
      .filter(h => h.district === district.th)
      .sort((a, b) =>
        (b.google_rating ?? 0) - (a.google_rating ?? 0) ||
        (b.google_review_count ?? 0) - (a.google_review_count ?? 0)
      )
    if (!hospitals.length) {
      return { district, hospitals, center: { lat: 0, lng: 0 }, nearby: [] }
    }

    const center = {
      lat: hospitals.reduce((s, h) => s + h.lat, 0) / hospitals.length,
      lng: hospitals.reduce((s, h) => s + h.lng, 0) / hospitals.length,
    }

    const own = new Set(hospitals.map(h => h.id))
    const nearby = all
      .filter(h => !own.has(h.id))
      .map(h => ({ hospital: h, distKm: haversineKm(center.lat, center.lng, h.lat, h.lng) }))
      .sort((a, b) => a.distKm - b.distKm)
      .slice(0, 8)

    return { district, hospitals, center, nearby }
  })
  return cache
}

export function getIndexableDistricts(): DistrictData[] {
  return buildAll().filter(d => d.hospitals.length >= MIN_HOSPITALS)
}

export function getDistrictBySlug(slug: string): DistrictData | null {
  return getIndexableDistricts().find(d => d.district.slug === slug) ?? null
}

/** The district page a given hospital belongs on, if that page exists. */
export function districtForHospital(h: Hospital): District | null {
  if (!h.district) return null
  return getIndexableDistricts().find(d => d.district.th === h.district)?.district ?? null
}

export { hospitalSlug }
