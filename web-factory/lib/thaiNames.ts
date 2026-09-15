// 태국어 지명·업종명. /th/* 페이지와 태국어 상호 supplier 의 메타데이터가 쓴다.
//
// 태국어 페이지가 도시명을 영어로 찍고 있었다 — "ซัพพลายเออร์ในKhon Kaen".
// 태국 바이어는 "คลังสินค้า ขอนแก่น" 으로 검색하는데 페이지에 ขอนแก่น 이라는
// 글자 자체가 없으니 Search Console 에서 54회 노출·70위에 머물렀다
// (2026-09-16 실측). 지명은 번역이 아니라 키워드다.

/** city slug (lib/cityNorm.ts citySlugFromDisplay 결과) → 태국어 지명. */
export const PROVINCE_TH: Record<string, string> = {
  bangkok: "กรุงเทพมหานคร",
  amnat_charoen: "อำนาจเจริญ",
  ang_thong: "อ่างทอง",
  bueng_kan: "บึงกาฬ",
  buri_ram: "บุรีรัมย์",
  chachoengsao: "ฉะเชิงเทรา",
  chai_nat: "ชัยนาท",
  chaiyaphum: "ชัยภูมิ",
  chanthaburi: "จันทบุรี",
  chiang_mai: "เชียงใหม่",
  chiang_rai: "เชียงราย",
  chon_buri: "ชลบุรี",
  chumphon: "ชุมพร",
  kalasin: "กาฬสินธุ์",
  kamphaeng_phet: "กำแพงเพชร",
  kanchanaburi: "กาญจนบุรี",
  khon_kaen: "ขอนแก่น",
  krabi: "กระบี่",
  lampang: "ลำปาง",
  lamphun: "ลำพูน",
  loei: "เลย",
  lopburi: "ลพบุรี",
  mae_hong_son: "แม่ฮ่องสอน",
  maha_sarakham: "มหาสารคาม",
  mukdahan: "มุกดาหาร",
  nakhon_nayok: "นครนายก",
  nakhon_pathom: "นครปฐม",
  nakhon_phanom: "นครพนม",
  nakhon_ratchasima: "นครราชสีมา",
  nakhon_sawan: "นครสวรรค์",
  nakhon_si_thammarat: "นครศรีธรรมราช",
  nan: "น่าน",
  narathiwat: "นราธิวาส",
  nong_bua_lam_phu: "หนองบัวลำภู",
  nong_khai: "หนองคาย",
  nonthaburi: "นนทบุรี",
  pathum_thani: "ปทุมธานี",
  pattani: "ปัตตานี",
  phang_nga: "พังงา",
  phatthalung: "พัทลุง",
  phayao: "พะเยา",
  phetchabun: "เพชรบูรณ์",
  phetchaburi: "เพชรบุรี",
  phichit: "พิจิตร",
  phitsanulok: "พิษณุโลก",
  phra_nakhon_si_ayutthaya: "พระนครศรีอยุธยา",
  ayutthaya: "พระนครศรีอยุธยา",
  phrae: "แพร่",
  phuket: "ภูเก็ต",
  prachin_buri: "ปราจีนบุรี",
  prachuap_khiri_khan: "ประจวบคีรีขันธ์",
  ranong: "ระนอง",
  ratchaburi: "ราชบุรี",
  rayong: "ระยอง",
  roi_et: "ร้อยเอ็ด",
  sa_kaeo: "สระแก้ว",
  sakon_nakhon: "สกลนคร",
  samut_prakan: "สมุทรปราการ",
  samut_sakhon: "สมุทรสาคร",
  samut_songkhram: "สมุทรสงคราม",
  saraburi: "สระบุรี",
  satun: "สตูล",
  si_sa_ket: "ศรีสะเกษ",
  sing_buri: "สิงห์บุรี",
  songkhla: "สงขลา",
  sukhothai: "สุโขทัย",
  suphan_buri: "สุพรรณบุรี",
  surat_thani: "สุราษฎร์ธานี",
  surin: "สุรินทร์",
  tak: "ตาก",
  trang: "ตรัง",
  trat: "ตราด",
  ubon_ratchathani: "อุบลราชธานี",
  udon_thani: "อุดรธานี",
  uthai_thani: "อุทัยธานี",
  uttaradit: "อุตรดิตถ์",
  yala: "ยะลา",
  yasothon: "ยโสธร",
  // 도(จังหวัด)가 아니지만 사이트가 도시 페이지로 다루는 산업 거점.
  si_racha: "ศรีราชา",
  map_ta_phut: "มาบตาพุด",
  laem_chabang: "แหลมฉบัง",
  pattaya: "พัทยา",
  hat_yai: "หาดใหญ่",
  hua_hin: "หัวหิน",
  koh_samui: "เกาะสมุย",
};

/** 도가 아닌 산업 거점 — "จังหวัด" 접두어를 붙이면 틀린 표기가 된다. */
const NOT_PROVINCE = new Set([
  "bangkok", "si_racha", "map_ta_phut", "laem_chabang", "pattaya", "hat_yai",
  "hua_hin", "koh_samui",
]);

export function provinceTh(slug: string | undefined | null): string | null {
  if (!slug) return null;
  return PROVINCE_TH[slug] ?? null;
}

/** "จังหวัดขอนแก่น" 처럼 행정구역 표기까지 붙인 형태. 거점 도시는 이름만. */
export function provinceThFull(slug: string | undefined | null): string | null {
  const th = provinceTh(slug);
  if (!th || !slug) return th;
  return NOT_PROVINCE.has(slug) ? th : `จังหวัด${th}`;
}

/** lib/types.ts CATEGORY_LABELS 와 같은 키. */
export const CATEGORY_LABELS_TH: Record<string, string> = {
  manufacturer: "โรงงานผู้ผลิต",
  auto_parts: "ผู้ผลิตชิ้นส่วนยานยนต์",
  factory: "โรงงาน",
  warehouse: "คลังสินค้า",
  industrial_estate: "นิคมอุตสาหกรรม",
  logistics: "บริษัทโลจิสติกส์",
  food_mfg: "โรงงานผลิตอาหาร",
  electronics: "ผู้ผลิตอิเล็กทรอนิกส์",
  chemical: "ผู้ผลิตเคมีภัณฑ์",
  plastic: "โรงงานพลาสติก",
  steel: "เหล็กและโลหะ",
  machining: "งานกลึง / งานช่าง",
  equipment: "อุปกรณ์อุตสาหกรรม",
  corporate_office: "สำนักงานบริษัท",
  packaging: "บรรจุภัณฑ์",
  rubber: "ยาง",
  textile: "สิ่งทอ",
  machinery: "เครื่องจักร",
  exporter: "ผู้ส่งออก",
};

const THAI_SCRIPT = /[฀-๿]/;

export function hasThaiScript(s: string | null | undefined): boolean {
  return THAI_SCRIPT.test(s ?? "");
}
