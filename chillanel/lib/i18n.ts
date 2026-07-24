import type { Lang } from "./site";

export type Dict = {
  nav: { home: string; guides: string; about: string };
  home: {
    heroTitle: string;
    heroSub: string;
    philosophyTitle: string;
    philosophyBody: string;
    featuredTitle: string;
  };
  place: {
    reviewsTitle: string;
    therapistMentionsTitle: string;
    therapistDisclaimer: string;
    noMentions: string;
    ratingLabel: string;
    reviewCountLabel: string;
    addressLabel: string;
    viewOnMaps: string;
  };
  city: { listTitle: string; placeCount: string };
  guide: { indexTitle: string };
  about: { title: string; body: string };
  footer: { rights: string };
};

const en: Dict = {
  nav: { home: "Home", guides: "Guides", about: "About" },
  home: {
    heroTitle: "It's not the spa. It's the hands.",
    heroSub:
      "chillanel is a Bangkok massage & spa guide built around the one thing every ranking site ignores: who's actually giving the massage.",
    philosophyTitle: "Why we're different",
    philosophyBody:
      "A five-star lobby doesn't guarantee a good massage, and a plain shophouse doesn't mean a bad one. We read the reviews for the parts other sites skip — the ones that name names.",
    featuredTitle: "Featured places",
  },
  place: {
    reviewsTitle: "What reviewers say",
    therapistMentionsTitle: "Reviewers mentioned",
    therapistDisclaimer:
      "These names are auto-extracted from public reviews and are unverified — always confirm availability with the venue.",
    noMentions: "No individual staff mentioned by name yet in the reviews we've collected.",
    ratingLabel: "Rating",
    reviewCountLabel: "reviews",
    addressLabel: "Address",
    viewOnMaps: "View on Google Maps",
  },
  city: { listTitle: "Massage & spa in", placeCount: "places" },
  guide: { indexTitle: "Guides" },
  about: {
    title: "About chillanel",
    body:
      "chillanel is an independent guide to massage and spa places in Thailand. We're not affiliated with any venue. Our angle: therapist quality varies far more than facility quality, so we surface what reviewers say about the people, not just the place.",
  },
  footer: { rights: "Independent guide. Not affiliated with any venue." },
};

const th: Dict = {
  nav: { home: "หน้าแรก", guides: "คู่มือ", about: "เกี่ยวกับเรา" },
  home: {
    heroTitle: "ไม่ใช่ร้าน แต่เป็นฝีมือคน",
    heroSub:
      "chillanel คือคู่มือร้านนวด & สปาในกรุงเทพฯ ที่โฟกัสสิ่งที่เว็บจัดอันดับอื่นมองข้าม นั่นคือ ใครเป็นคนนวดจริง ๆ",
    philosophyTitle: "ทำไมเราถึงต่าง",
    philosophyBody:
      "ล็อบบี้ห้าดาวไม่ได้การันตีฝีมือนวดที่ดี และร้านเล็ก ๆ ก็ไม่ได้แปลว่าแย่เสมอไป เราอ่านรีวิวในส่วนที่เว็บอื่นข้ามไป — ส่วนที่เอ่ยชื่อจริง ๆ",
    featuredTitle: "ร้านแนะนำ",
  },
  place: {
    reviewsTitle: "รีวิวจากผู้ใช้บริการ",
    therapistMentionsTitle: "ชื่อที่ถูกกล่าวถึงในรีวิว",
    therapistDisclaimer:
      "ชื่อเหล่านี้ดึงมาจากรีวิวสาธารณะโดยอัตโนมัติและยังไม่ได้ยืนยัน — กรุณาสอบถามร้านโดยตรงก่อนเข้ารับบริการ",
    noMentions: "ยังไม่มีการเอ่ยชื่อพนักงานคนใดในรีวิวที่เรารวบรวมได้",
    ratingLabel: "คะแนน",
    reviewCountLabel: "รีวิว",
    addressLabel: "ที่อยู่",
    viewOnMaps: "ดูใน Google Maps",
  },
  city: { listTitle: "ร้านนวดและสปาใน", placeCount: "ร้าน" },
  guide: { indexTitle: "คู่มือ" },
  about: {
    title: "เกี่ยวกับ chillanel",
    body:
      "chillanel คือคู่มืออิสระสำหรับร้านนวดและสปาในประเทศไทย เราไม่มีส่วนเกี่ยวข้องกับร้านใด ๆ มุมมองของเรา: ฝีมือของพนักงานนวดต่างกันมากกว่าคุณภาพของสถานที่ เราจึงนำเสนอสิ่งที่รีวิวพูดถึงตัวคน ไม่ใช่แค่สถานที่",
  },
  footer: { rights: "คู่มืออิสระ ไม่มีส่วนเกี่ยวข้องกับร้านใด ๆ" },
};

const ko: Dict = {
  nav: { home: "홈", guides: "가이드", about: "소개" },
  home: {
    heroTitle: "중요한 건 스파가 아니라 손끝이에요.",
    heroSub:
      "chillanel은 다른 순위 사이트들이 놓치는 단 하나 — 실제로 누가 마사지를 해주는지에 집중한 방콕 마사지·스파 가이드입니다.",
    philosophyTitle: "우리가 다른 이유",
    philosophyBody:
      "화려한 로비가 좋은 마사지를 보장하지 않고, 소박한 샵이라고 실력이 없는 것도 아니에요. 저희는 다른 사이트가 건너뛰는 리뷰 부분 — 실명이 언급된 부분을 읽습니다.",
    featuredTitle: "추천 업체",
  },
  place: {
    reviewsTitle: "리뷰어들의 후기",
    therapistMentionsTitle: "리뷰에서 언급된 이름",
    therapistDisclaimer:
      "이 이름들은 공개 리뷰에서 자동으로 추출된 것으로 검증되지 않았습니다 — 방문 전 업체에 직접 확인하세요.",
    noMentions: "아직 수집된 리뷰 중 직원 이름이 언급된 사례가 없습니다.",
    ratingLabel: "평점",
    reviewCountLabel: "리뷰",
    addressLabel: "주소",
    viewOnMaps: "구글맵에서 보기",
  },
  city: { listTitle: "의 마사지 & 스파", placeCount: "곳" },
  guide: { indexTitle: "가이드" },
  about: {
    title: "chillanel 소개",
    body:
      "chillanel은 태국 마사지·스파 업체에 대한 독립 가이드입니다. 특정 업체와 제휴 관계가 없습니다. 저희 관점: 시설보다 테라피스트의 실력 차이가 훨씬 크기 때문에, 장소가 아니라 사람에 대한 리뷰 내용을 보여드립니다.",
  },
  footer: { rights: "독립 가이드입니다. 특정 업체와 제휴 관계가 없습니다." },
};

const DICTS: Record<Lang, Dict> = { en, th, ko };

export function tFor(lang: Lang): Dict {
  return DICTS[lang] ?? DICTS.en;
}
