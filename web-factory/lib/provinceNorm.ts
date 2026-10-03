import { PROVINCE_TH } from "./thaiNames";

const NORM: Record<string, string> = {
  // Thai script → English
  "จ.ปทุมธานี": "Pathum Thani",
  "จปทุมธานี": "Pathum Thani",
  "ปทุมธานี": "Pathum Thani",
  "จ.นนทบุรี": "Nonthaburi",
  "นนทบุรี": "Nonthaburi",
  "จ.สมุทรปราการ": "Samut Prakan",
  "สมุทรปราการ": "Samut Prakan",
  "จ.ชลบุรี": "Chon Buri",
  "ชลบุรี": "Chon Buri",
  "พิษณุโลก": "Phitsanulok",
  "จ.พิษณุโลก": "Phitsanulok",
  "จังหวัดพิษณุโลก": "Phitsanulok",
  "จ.หนองคาย": "Nong Khai",
  "หนองคาย": "Nong Khai",
  "จ.ระยอง": "Rayong",
  "ระยอง": "Rayong",
  "ตาก": "Tak",
  "จ.ตาก": "Tak",
  "จ.กรุงเทพมหานคร": "Bangkok",
  "กรุงเทพมหานคร": "Bangkok",
  "จ.นครราชสีมา": "Nakhon Ratchasima",
  "นครราชสีมา": "Nakhon Ratchasima",
  "จ.สุราษฎร์ธานี": "Surat Thani",
  "สุราษฎร์ธานี": "Surat Thani",
  "จังหวัดมุกดาหาร": "Mukdahan",
  "มุกดาหาร": "Mukdahan",
  "ฉะเชิงเทรา": "Chachoengsao",
  "จ.ฉะเชิงเทรา": "Chachoengsao",
  "สระแก้ว": "Sa Kaeo",
  "นครปฐม": "Nakhon Pathom",
  "จ.นครปฐม": "Nakhon Pathom",
  "จ.สมุทรสาคร": "Samut Sakhon",
  "สมุทรสาคร": "Samut Sakhon",
  "จ.สระบุรี": "Saraburi",
  "สระบุรี": "Saraburi",
  "จังหวัด กรุงเทพมหานคร": "Bangkok",
  "ชุมพร": "Chumphon",
  "จ.ชุมพร": "Chumphon",
  // บ้านบึง (Ban Bueng) is a district within Chon Buri, not its own province —
  // collapse to the province like every other city_label in this dataset.
  "บ้านบึง": "Chon Buri",
  // Spelling variants → canonical
  "Chonburi": "Chon Buri",
  "Chon buri": "Chon Buri",
  "Pathumthani": "Pathum Thani",
  "Pathum thani": "Pathum Thani",
  "Pathumthanee": "Pathum Thani",
  "Samutsakhon": "Samut Sakhon",
  "Samutprakarn": "Samut Prakan",
  "Samut Prakarn": "Samut Prakan",
  "Nakhon Ratchasima": "Nakhon Ratchasima",
  "Srisaket": "Si Sa Ket",
  "Si Sa Ket": "Si Sa Ket",
  "Suphanburi": "Suphan Buri",
  "Suphan buri": "Suphan Buri",
  // 구(district) 이름이 도 자리에 들어온 것 — 아는 것은 도로 접는다.
  "BANGLAMUNG": "Chon Buri",
  "Banglamung": "Chon Buri",
  "Bang Lamung": "Chon Buri",
  // Remove garbage values
  "City": "",
  "city": "",
  "N/A": "",
};

// 77개 도 + 산업거점의 slug↔태국어는 lib/thaiNames.ts 가 들고 있다. 손으로 쓴
// NORM 에 의존하면 배치마다 새 표기가 샌다 (2026-10-03 신규 배치에서 ภูเก็ต,
// เชียงใหม่, จ.สมุทรสงคราม, BANGLAMUNG, ม.11 이 그대로 도로 등록됐다).
const THAI_TO_DISPLAY: Record<string, string> = {};
const KNOWN_DISPLAY = new Set<string>();
for (const [slug, thai] of Object.entries(PROVINCE_TH)) {
  const display = slug
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  THAI_TO_DISPLAY[thai] = display;
  KNOWN_DISPLAY.add(display.toLowerCase());
}

/**
 * city_label 을 표준 영문 도 이름으로. 모르는 라벨은 "" 로 버린다.
 *
 * "" 는 호출부(lib/data.ts)가 "도 없음" 으로 처리한다 — 공급사는 목록에 남고
 * 도 페이지만 안 생긴다. 주소 조각 하나가 도 페이지를 만드는 것보다 낫다.
 */
export function normalizeProvince(raw: string | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim();

  // 1) 손으로 등록한 변형·쓰레기 (철자 변형, "City", "N/A" 등)
  const mapped = NORM[trimmed];
  if (mapped !== undefined) return mapped;

  // 2) 태국어 표기 — จังหวัด / จ. 접두어를 떼고 77개 도 목록에서 찾는다
  const stripped = trimmed.replace(/^(จังหวัด|จ\.)\s*/, "").trim();
  if (THAI_TO_DISPLAY[stripped]) return THAI_TO_DISPLAY[stripped];

  // 3) 영문이면 목록에 있는 도만 통과 (대소문자 무시)
  if (KNOWN_DISPLAY.has(trimmed.toLowerCase())) {
    const slug = trimmed.toLowerCase().replace(/\s+/g, "_");
    return slug
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  // 4) 그 밖은 버린다. 태국어인데 2)에서 못 찾았으면 도가 아니라 구·주소 조각이고,
  //    영문인데 3)에서 못 찾았으면 BANGLAMUNG 같은 구 이름이거나 오타다.
  return "";
}
