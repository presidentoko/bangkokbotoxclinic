// 태국어 라벨 공용 테이블.
//
// 2026-10-25: /th/c/[service]/[district] 신설로 /th/c/[service] · /th/d/[district]
// 에만 있던 테이블을 세 페이지가 함께 쓰게 됐다. Next 의 page 파일은 페이지
// 관련 이름만 export 할 수 있어 여기로 옮겼다. 값은 원래 페이지의 것 그대로.

export const TH_LABELS: Record<string, string> = {
  botox: "โบท็อกซ์",
  filler: "ฟิลเลอร์",
  hifu: "HIFU",
  facial: "ดูแลผิวหน้า",
  laser: "เลเซอร์",
  dental: "ทันตกรรม",
  hair_transplant: "ปลูกผม",
  eye: "เลสิก",
};

// GSC 에서 실제로 클릭을 만들고 있는 "…ใกล้ฉัน"(내 근처) 표현. 제목에 그대로
// 쓰기 위해 별도 테이블로 둔다 — 의역하면 매칭이 약해진다.
export const TH_NEAR_ME: Record<string, string> = {
  botox: "คลินิกโบท็อกซ์ใกล้ฉัน",
  filler: "คลินิกฟิลเลอร์ใกล้ฉัน",
  hifu: "คลินิก HIFU ใกล้ฉัน",
  facial: "คลินิกผิวหน้าใกล้ฉัน",
  laser: "คลินิกเลเซอร์ใกล้ฉัน",
  dental: "คลินิกทำฟันใกล้ฉัน",
  hair_transplant: "คลินิกปลูกผมใกล้ฉัน",
  eye: "คลินิกเลสิกใกล้ฉัน",
};

// 손으로 검증된 태국어 구명만 둔다(build_master_db.py 의 별칭 테이블 출처).
// 나머지 지역은 영어 표기를 태국어 문장 안에 그대로 넣는다 — 구글맵·주소
// 표기가 영문인 구가 많아 태국인에게도 자연스럽고, 무엇보다 **틀린 태국어명을
// 붙이는 것보다 낫다**. 수집 주소에서 เขต 뒤 단어를 뽑아 자동 생성해봤으나
// Khlong Toei→พระโขนง, Phaya Thai→เมือง 처럼 오류가 많아 폐기했다(2026-08-23 실측).
export const TH_DISTRICT: Record<string, string> = {
  "Bang Phlat": "บางพลัด",
  "Don Mueang": "ดอนเมือง",
  Dusit: "ดุสิต",
  "Huai Khwang": "ห้วยขวาง",
  "Lak Si": "หลักสี่",
  "Nong Chok": "หนองจอก",
  "Nong Khaem": "หนองแขม",
  "Pathum Wan": "ปทุมวัน",
  "Phaya Thai": "พญาไท",
  "Phra Khanong": "พระโขนง",
  Ratchathewi: "ราชเทวี",
  Watthana: "วัฒนา",
  "Yan Nawa": "ยานนาวา",
};

export const TH_CITY: Record<string, string> = {
  Bangkok: "กรุงเทพฯ",
  Pattaya: "พัทยา",
  "Chiang Mai": "เชียงใหม่",
  Nonthaburi: "นนทบุรี",
  "Samut Prakan": "สมุทรปราการ",
  "Pathum Thani": "ปทุมธานี",
  "Hua Hin": "หัวหิน",
  "Koh Samui": "เกาะสมุย",
};

export const thDistrict = (d: string) => TH_DISTRICT[d] ?? d;
export const thCity = (c: string) => TH_CITY[c] ?? c;

/** "ย่าน" + 구명. 영어 표기가 남은 구는 띄어 쓴다("ย่าน Khlong Toei"),
 *  태국어 구명은 붙여 쓴다("ย่านวัฒนา") — 태국어 표기 관행. */
export const thYan = (dn: string) => `ย่าน${/^[A-Za-z0-9]/.test(dn) ? " " : ""}${dn}`;
