import type { Lang } from "./site";

export type FaqItem = { q: string; a: string };

export type Dict = {
  nav: { home: string; guides: string; about: string; menuOpen: string; menuClose: string };
  home: {
    heroTitle: string;
    heroSub: string;
    philosophyTitle: string;
    philosophyBody: string;
    featuredTitle: string;
    /** Template with a "{count}" placeholder. */
    trustBadge: string;
    ctaBrowse: string;
    faqTitle: string;
    faq: FaqItem[];
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
    /** Template with a "{n}" placeholder, e.g. "{n} named in reviews". */
    namedInReviews: string;
    anonymousReviewer: string;
  };
  /** listTitle/intro/faqTitle/faq[].* use a "{city}" placeholder, e.g. "Massage & spa in {city}". */
  city: {
    listTitle: string;
    placeCount: string;
    intro: string;
    /** Template with a "{shown}" placeholder, e.g. "Showing the top {shown} by rating.". */
    showingTop: string;
    faqTitle: string;
    faq: FaqItem[];
  };
  guide: { indexTitle: string };
  about: { title: string; body: string };
  footer: { rights: string; tagline: string; exploreTitle: string; languageTitle: string };
};

const en: Dict = {
  nav: { home: "Home", guides: "Guides", about: "About", menuOpen: "Open menu", menuClose: "Close menu" },
  home: {
    heroTitle: "It's not the spa. It's the hands.",
    heroSub:
      "chillanel is a Bangkok massage & spa guide built around the one thing every ranking site ignores: who's actually giving the massage.",
    philosophyTitle: "Why we're different",
    philosophyBody:
      "A five-star lobby doesn't guarantee a good massage, and a plain shophouse doesn't mean a bad one. We read the reviews for the parts other sites skip — the ones that name names.",
    featuredTitle: "Featured places",
    trustBadge: "{count}+ places, built from real Google reviews",
    ctaBrowse: "Browse Bangkok",
    faqTitle: "Common questions",
    faq: [
      {
        q: "How is chillanel different from other massage & spa listing sites?",
        a: "Most sites rank by facility — lobby, decor, price. We read the reviews for the part everyone else skips: which specific therapist people ask for by name. A five-star lobby doesn't guarantee a good massage, and a plain shophouse doesn't mean a bad one.",
      },
      {
        q: "Are the therapist names real?",
        a: "They're auto-extracted from public Google reviews when 2 or more different reviewers mention the same name — always shown with the original quote. We label them clearly as unverified, and you should confirm availability with the venue directly.",
      },
      {
        q: "How do I pick a good massage place in Bangkok?",
        a: "Start with the rating and review count, then check if any therapist is named repeatedly in reviews — that's a stronger signal than the storefront. Read a few recent reviews for context on cleanliness and pressure style.",
      },
    ],
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
    namedInReviews: "{n} named in reviews",
    anonymousReviewer: "Anonymous",
  },
  city: {
    listTitle: "Massage & spa in {city}",
    placeCount: "places",
    intro: "Real Google reviews from {city}, read for the part other sites skip — who's actually behind the massage.",
    showingTop: "Showing the top {shown}, sorted by rating.",
    faqTitle: "Massage & spa in {city} — FAQ",
    faq: [
      {
        q: "What's the best way to choose a massage place in {city}?",
        a: "Look past the star rating alone — check review count for reliability, and see if any therapist is mentioned by name more than once. That's usually a better signal of consistent quality than the storefront.",
      },
      {
        q: "Are these all real businesses?",
        a: "Yes — every listing here comes from real, public Google Maps data for {city}: name, address, rating, and reviews.",
      },
      {
        q: "Does chillanel take bookings?",
        a: "No — chillanel is an independent guide, not a booking platform. Tap through to a place's Google Maps listing to call or get directions directly.",
      },
    ],
  },
  guide: { indexTitle: "Guides" },
  about: {
    title: "About chillanel",
    body:
      "chillanel is an independent guide to massage and spa places in Thailand. We're not affiliated with any venue. Our angle: therapist quality varies far more than facility quality, so we surface what reviewers say about the people, not just the place.",
  },
  footer: {
    rights: "Independent guide. Not affiliated with any venue.",
    tagline: "It's not the spa. It's the hands.",
    exploreTitle: "Explore",
    languageTitle: "Language",
  },
};

const th: Dict = {
  nav: { home: "หน้าแรก", guides: "คู่มือ", about: "เกี่ยวกับเรา", menuOpen: "เปิดเมนู", menuClose: "ปิดเมนู" },
  home: {
    heroTitle: "ไม่ใช่ร้าน แต่เป็นฝีมือคน",
    heroSub:
      "chillanel คือคู่มือร้านนวด & สปาในกรุงเทพฯ ที่โฟกัสสิ่งที่เว็บจัดอันดับอื่นมองข้าม นั่นคือ ใครเป็นคนนวดจริง ๆ",
    philosophyTitle: "ทำไมเราถึงต่าง",
    philosophyBody:
      "ล็อบบี้ห้าดาวไม่ได้การันตีฝีมือนวดที่ดี และร้านเล็ก ๆ ก็ไม่ได้แปลว่าแย่เสมอไป เราอ่านรีวิวในส่วนที่เว็บอื่นข้ามไป — ส่วนที่เอ่ยชื่อจริง ๆ",
    featuredTitle: "ร้านแนะนำ",
    trustBadge: "รวมกว่า {count}+ ร้าน จากรีวิว Google จริง",
    ctaBrowse: "ดูร้านในกรุงเทพฯ",
    faqTitle: "คำถามที่พบบ่อย",
    faq: [
      {
        q: "chillanel ต่างจากเว็บจัดอันดับร้านนวด/สปาอื่นยังไง?",
        a: "เว็บส่วนใหญ่จัดอันดับจากหน้าร้าน ล็อบบี้ ราคา แต่เราอ่านรีวิวในส่วนที่เว็บอื่นข้ามไป — คือใครคือหมอนวดที่คนขอชื่อจริง ๆ ล็อบบี้ห้าดาวไม่ได้การันตีฝีมือนวดที่ดี และร้านเล็ก ๆ ก็ไม่ได้แปลว่าแย่เสมอไป",
      },
      {
        q: "ชื่อหมอนวดที่แสดงเป็นชื่อจริงไหม?",
        a: "ชื่อเหล่านี้ดึงมาอัตโนมัติจากรีวิว Google สาธารณะ เมื่อมีผู้รีวิวอย่างน้อย 2 คนขึ้นไปเอ่ยชื่อเดียวกัน — พร้อมแสดงข้อความรีวิวต้นฉบับเสมอ เราระบุชัดเจนว่ายังไม่ได้ยืนยัน กรุณาสอบถามร้านโดยตรงก่อนเข้ารับบริการ",
      },
      {
        q: "จะเลือกร้านนวดในกรุงเทพฯ ยังไงดี?",
        a: "เริ่มจากคะแนนและจำนวนรีวิว จากนั้นดูว่ามีชื่อหมอนวดคนไหนถูกเอ่ยซ้ำ ๆ ในรีวิวไหม นั่นเป็นสัญญาณที่น่าเชื่อถือกว่าหน้าร้าน แล้วอ่านรีวิวล่าสุดสักสองสามอันเพื่อดูความสะอาดและสไตล์การนวด",
      },
    ],
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
    namedInReviews: "ถูกเอ่ยชื่อในรีวิว {n} คน",
    anonymousReviewer: "ไม่ระบุชื่อ",
  },
  city: {
    listTitle: "ร้านนวดและสปาใน {city}",
    placeCount: "ร้าน",
    intro: "รีวิว Google จริงจาก{city} อ่านในมุมที่เว็บอื่นข้ามไป — ใครคือคนที่นวดให้จริง ๆ",
    showingTop: "แสดง {shown} อันดับแรก เรียงตามคะแนน",
    faqTitle: "นวดและสปาใน{city} — คำถามที่พบบ่อย",
    faq: [
      {
        q: "เลือกร้านนวดใน{city}ยังไงดีที่สุด?",
        a: "อย่าดูแค่คะแนนดาว ให้ดูจำนวนรีวิวประกอบด้วย และดูว่ามีชื่อหมอนวดคนไหนถูกเอ่ยซ้ำในรีวิวไหม มักเป็นสัญญาณคุณภาพที่เสถียรกว่าหน้าร้าน",
      },
      {
        q: "ร้านที่แสดงเป็นร้านจริงทั้งหมดไหม?",
        a: "ใช่ — ทุกร้านที่แสดงมาจากข้อมูล Google Maps สาธารณะจริงใน{city}: ชื่อ ที่อยู่ คะแนน และรีวิว",
      },
      {
        q: "chillanel รับจองคิวไหม?",
        a: "ไม่รับ — chillanel เป็นคู่มืออิสระ ไม่ใช่แพลตฟอร์มจองคิว กดเข้าไปที่ลิงก์ Google Maps ของร้านเพื่อโทรหรือดูเส้นทางได้โดยตรง",
      },
    ],
  },
  guide: { indexTitle: "คู่มือ" },
  about: {
    title: "เกี่ยวกับ chillanel",
    body:
      "chillanel คือคู่มืออิสระสำหรับร้านนวดและสปาในประเทศไทย เราไม่มีส่วนเกี่ยวข้องกับร้านใด ๆ มุมมองของเรา: ฝีมือของพนักงานนวดต่างกันมากกว่าคุณภาพของสถานที่ เราจึงนำเสนอสิ่งที่รีวิวพูดถึงตัวคน ไม่ใช่แค่สถานที่",
  },
  footer: {
    rights: "คู่มืออิสระ ไม่มีส่วนเกี่ยวข้องกับร้านใด ๆ",
    tagline: "ไม่ใช่ร้าน แต่เป็นฝีมือคน",
    exploreTitle: "สำรวจ",
    languageTitle: "ภาษา",
  },
};

const ko: Dict = {
  nav: { home: "홈", guides: "가이드", about: "소개", menuOpen: "메뉴 열기", menuClose: "메뉴 닫기" },
  home: {
    heroTitle: "중요한 건 스파가 아니라 손끝이에요.",
    heroSub:
      "chillanel은 다른 순위 사이트들이 놓치는 단 하나 — 실제로 누가 마사지를 해주는지에 집중한 방콕 마사지·스파 가이드입니다.",
    philosophyTitle: "우리가 다른 이유",
    philosophyBody:
      "화려한 로비가 좋은 마사지를 보장하지 않고, 소박한 샵이라고 실력이 없는 것도 아니에요. 저희는 다른 사이트가 건너뛰는 리뷰 부분 — 실명이 언급된 부분을 읽습니다.",
    featuredTitle: "추천 업체",
    trustBadge: "실제 구글 리뷰 기반, {count}+개 업체 수록",
    ctaBrowse: "방콕 업체 보기",
    faqTitle: "자주 묻는 질문",
    faq: [
      {
        q: "chillanel은 다른 마사지·스파 순위 사이트랑 뭐가 달라요?",
        a: "대부분의 사이트는 로비, 인테리어, 가격 같은 시설 기준으로 순위를 매겨요. 저희는 다른 사이트가 건너뛰는 부분 — 실제로 누가 마사지를 해주는지, 리뷰에서 실명이 언급된 부분을 읽습니다. 화려한 로비가 좋은 마사지를 보장하지 않고, 소박한 샵이라고 실력이 없는 것도 아니에요.",
      },
      {
        q: "리뷰에 나온 테라피스트 이름은 실제인가요?",
        a: "공개된 구글 리뷰에서 2명 이상의 서로 다른 리뷰어가 같은 이름을 언급했을 때 자동으로 추출된 이름이며, 원문 인용과 함께 항상 표시됩니다. 검증되지 않았다는 점을 명확히 표시하니, 방문 전 업체에 직접 확인해 주세요.",
      },
      {
        q: "방콕에서 좋은 마사지샵은 어떻게 고르나요?",
        a: "평점과 리뷰 수를 먼저 확인하고, 리뷰에 반복적으로 언급되는 테라피스트 이름이 있는지 살펴보세요. 이는 매장 외관보다 더 신뢰할 수 있는 신호예요. 최근 리뷰 몇 개를 읽으면 청결도나 마사지 스타일도 파악할 수 있습니다.",
      },
    ],
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
    namedInReviews: "리뷰에 이름 언급 {n}명",
    anonymousReviewer: "익명",
  },
  city: {
    listTitle: "{city}의 마사지 & 스파",
    placeCount: "곳",
    intro: "{city}의 실제 구글 리뷰를 다른 사이트가 건너뛰는 부분까지 — 실제로 누가 마사지를 해주는지 읽어드립니다.",
    showingTop: "평점순으로 상위 {shown}곳을 보여드려요.",
    faqTitle: "{city} 마사지·스파 — 자주 묻는 질문",
    faq: [
      {
        q: "{city}에서 마사지샵을 고르는 가장 좋은 방법은?",
        a: "별점만 보지 말고 리뷰 수도 함께 확인하세요. 그리고 리뷰에 특정 테라피스트 이름이 반복해서 언급되는지 보세요 — 매장 외관보다 훨씬 신뢰할 수 있는 품질 신호입니다.",
      },
      {
        q: "여기 나온 업체들은 다 실제 업체인가요?",
        a: "네 — 여기 수록된 모든 업체는 {city}의 실제 공개 구글맵 데이터를 기반으로 합니다: 이름, 주소, 평점, 리뷰 모두 실제 데이터예요.",
      },
      {
        q: "chillanel에서 예약도 할 수 있나요?",
        a: "아니요 — chillanel은 독립 가이드이며 예약 플랫폼이 아닙니다. 업체의 구글맵 링크로 이동해서 직접 전화하거나 길찾기를 이용해 주세요.",
      },
    ],
  },
  guide: { indexTitle: "가이드" },
  about: {
    title: "chillanel 소개",
    body:
      "chillanel은 태국 마사지·스파 업체에 대한 독립 가이드입니다. 특정 업체와 제휴 관계가 없습니다. 저희 관점: 시설보다 테라피스트의 실력 차이가 훨씬 크기 때문에, 장소가 아니라 사람에 대한 리뷰 내용을 보여드립니다.",
  },
  footer: {
    rights: "독립 가이드입니다. 특정 업체와 제휴 관계가 없습니다.",
    tagline: "중요한 건 스파가 아니라 손끝이에요.",
    exploreTitle: "둘러보기",
    languageTitle: "언어",
  },
};

const DICTS: Record<Lang, Dict> = { en, th, ko };

export function tFor(lang: Lang): Dict {
  return DICTS[lang] ?? DICTS.en;
}
