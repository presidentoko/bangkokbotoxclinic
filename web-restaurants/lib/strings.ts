import type { Locale } from "./locale";

type Tr = Record<Locale, string>;

export const strings = {
  common: {
    home:           { en: "Home",             ko: "홈",        th: "หน้าหลัก" } as Tr,
    about:          { en: "About",            ko: "소개",       th: "เกี่ยวกับ" } as Tr,
    contact:        { en: "Contact",          ko: "문의하기",   th: "ติดต่อ" } as Tr,
    guides:         { en: "Guides",           ko: "가이드",     th: "คู่มือ" } as Tr,
    snsCheck:       { en: "SNS Check",        ko: "SNS 체크",   th: "เช็ค SNS" } as Tr,
    bestOf:         { en: "Best of",          ko: "베스트",     th: "ยอดเยี่ยม" } as Tr,
    thai:           { en: "Thai",             ko: "태국음식",   th: "ไทย" } as Tr,
    forOwners:      { en: "For owners →",     ko: "사장님 →",   th: "เจ้าของร้าน →" } as Tr,
    forRestaurants: { en: "For Restaurants",  ko: "식당 분들께", th: "สำหรับร้านอาหาร" } as Tr,
  },

  bottomNav: {
    home:     { en: "Home",      ko: "홈",     th: "หน้าหลัก" } as Tr,
    snsCheck: { en: "SNS Check", ko: "SNS체크", th: "เช็ค SNS" } as Tr,
    explore:  { en: "Explore",   ko: "탐색",   th: "สำรวจ" } as Tr,
    saved:    { en: "Saved",     ko: "저장",   th: "บันทึก" } as Tr,
    guide:    { en: "Guide",     ko: "가이드", th: "คู่มือ" } as Tr,
  },

  footer: {
    tagline: {
      en: "No filter. Just numbers.",
      ko: "필터 없음. 숫자만.",
      th: "ไม่มีฟิลเตอร์ มีแค่ตัวเลข",
    } as Tr,
    desc: {
      en: "Your feed is a paid ad pretending to be a friend's opinion. We ended it with data.",
      ko: "당신의 피드는 친구 의견처럼 보이는 유료 광고예요. 우리는 데이터로 끝냈습니다.",
      th: "ฟีดของคุณคือโฆษณาที่แอบทำตัวเป็นคำแนะนำจากเพื่อน เราจบมันด้วยข้อมูล",
    } as Tr,
    seeDetector: {
      en: "See the SNS lie detector →",
      ko: "SNS 거짓말 탐지기 보기 →",
      th: "ดู SNS Lie Detector →",
    } as Tr,
    disclaimer: {
      en: "Independent restaurant data analysis. Not affiliated with any restaurant. Rankings derived from public Google Maps review data — no human curation, no editorial intervention. Sponsored slots are clearly labelled and never displace organic results.",
      ko: "독립적인 레스토랑 데이터 분석. 어떤 레스토랑과도 제휴 관계 없음. 랭킹은 공개 Google Maps 리뷰 데이터에서 산출 — 인간 큐레이션 없음, 편집 개입 없음. 스폰서 슬롯은 명확히 표시되며 유기적 결과를 절대 대체하지 않습니다.",
      th: "วิเคราะห์ข้อมูลร้านอาหารอิสระ ไม่มีความสัมพันธ์กับร้านอาหารใดๆ การจัดอันดับมาจากข้อมูล Google Maps สาธารณะ ไม่มีการคัดเลือกโดยมนุษย์ ไม่มีการแทรกแซงบรรณาธิการ",
    } as Tr,
  },

  contact: {
    title:   { en: "Contact", ko: "문의하기", th: "ติดต่อ" } as Tr,
    subtitle: {
      en: "Ad placements, data corrections, media inquiries — we read everything and reply fast.",
      ko: "광고·협찬, 데이터 오류 수정, 취재 문의 등 모든 연락을 받습니다. 빠르게 확인하고 직접 연락드릴게요.",
      th: "โฆษณา แก้ไขข้อมูล สอบถามสื่อ — เราอ่านทุกอย่างและตอบเร็ว",
    } as Tr,
    purposeLabel:       { en: "Inquiry type",         ko: "문의 유형",           th: "ประเภทการติดต่อ" } as Tr,
    adLabel:            { en: "📢 Ad / Sponsorship",  ko: "📢 광고 / 협찬 문의",  th: "📢 โฆษณา / สปอนเซอร์" } as Tr,
    correctionLabel:    { en: "✏️ Data Correction",    ko: "✏️ 데이터 오류 수정",  th: "✏️ แก้ไขข้อมูล" } as Tr,
    pressLabel:         { en: "📰 Media / Press",      ko: "📰 미디어 / 취재",     th: "📰 สื่อ / ข่าว" } as Tr,
    otherLabel:         { en: "❓ Other",              ko: "❓ 기타",              th: "❓ อื่นๆ" } as Tr,
    nameLabel:          { en: "Name / Company",        ko: "이름 / 회사명",        th: "ชื่อ / บริษัท" } as Tr,
    namePlaceholder:    { en: "John / Acme Inc.",      ko: "홍길동 / SNS Inc.",    th: "สมชาย / บริษัท ABC" } as Tr,
    contactLabel:       { en: "Your contact",          ko: "연락처",               th: "ช่องทางติดต่อ" } as Tr,
    contactHint:        { en: "(email / Telegram / LINE)", ko: "(이메일 / 텔레그램 / 카톡ID)", th: "(อีเมล / Telegram / LINE)" } as Tr,
    contactPlaceholder: { en: "your@email.com  or  @telegram_id", ko: "your@email.com  또는  @telegram_id", th: "your@email.com  หรือ  @telegram_id" } as Tr,
    messageLabel:       { en: "Message",               ko: "내용",                 th: "ข้อความ" } as Tr,
    messagePlaceholder: { en: "Tell us what you need.", ko: "문의 내용을 자유롭게 적어주세요.", th: "แจ้งความต้องการของคุณ" } as Tr,
    errorMsg:           { en: "Failed to send. Please try again.", ko: "전송 실패. 잠시 후 다시 시도해주세요.", th: "ส่งไม่สำเร็จ กรุณาลองใหม่" } as Tr,
    sending:            { en: "Sending...",            ko: "전송 중...",            th: "กำลังส่ง..." } as Tr,
    submit:             { en: "Send message →",        ko: "문의 보내기 →",         th: "ส่งข้อความ →" } as Tr,
    hint:               { en: "Include your contact so we can reply directly.", ko: "연락처를 남겨주시면 직접 답변드릴게요.", th: "กรุณาระบุช่องทางติดต่อเพื่อให้เราตอบกลับได้" } as Tr,
    successTitle:       { en: "Message sent!",         ko: "문의가 접수됐어요!",     th: "ส่งข้อความสำเร็จ!" } as Tr,
    successMsg:         { en: "Leave your contact info and we'll get back to you fast.", ko: "연락처를 남겨주셨다면 빠르게 회신할게요.", th: "หากระบุช่องทางติดต่อ เราจะติดต่อกลับโดยเร็ว" } as Tr,
  },

  about: {
    tagline:     { en: "No filter. Just numbers.", ko: "필터 없음. 숫자만.", th: "ไม่มีฟิลเตอร์ มีแค่ตัวเลข" } as Tr,
    heading1:    { en: "Your feed is a paid ad", ko: "당신의 피드는 유료 광고예요", th: "ฟีดของคุณคือโฆษณา" } as Tr,
    heading2:    { en: "pretending to be a friend's opinion.", ko: "친구 의견처럼 보이지만.", th: "ที่แอบทำตัวเป็นคำแนะนำจากเพื่อน" } as Tr,
    introBold:   { en: "1.3 million people who had nothing to gain", ko: "아무 이득 없이 리뷰를 남긴 130만 명", th: "1.3 ล้านคนที่ไม่มีอะไรได้" } as Tr,
    intro1:      { en: "We're here to end it. No influencers. No filters. Just", ko: "우리는 그것을 끝내기 위해 있어요. 인플루언서 없음. 필터 없음. 오직", th: "เราอยู่ที่นี่เพื่อยุติมัน ไม่มีอินฟลูเอนเซอร์ ไม่มีฟิลเตอร์ แค่" } as Tr,
    intro2:      { en: "— real Google reviewers, counted, weighted, and cross-checked by algorithm, not by us.", ko: "— 실제 Google 리뷰어, 알고리즘으로 집계·가중·교차 검증. 우리가 아닌.", th: "— นักวิจารณ์ Google จริงๆ นับ ถ่วงน้ำหนัก และตรวจสอบโดยอัลกอริทึม" } as Tr,
    glanceTitle: { en: "At a glance",          ko: "한눈에 보기",    th: "สรุปข้อมูล" } as Tr,
    restaurants: { en: "Restaurants",          ko: "레스토랑",      th: "ร้านอาหาร" } as Tr,
    fullAnalysis:{ en: "Full review analysis", ko: "리뷰 전체 분석", th: "วิเคราะห์รีวิวครบ" } as Tr,
    cuisines:    { en: "Cuisines",             ko: "요리 종류",     th: "ประเภทอาหาร" } as Tr,
    refreshCycle:{ en: "Data updated",         ko: "데이터 업데이트", th: "อัปเดตข้อมูล" } as Tr,
    howTitle:    { en: "How we end the lie",   ko: "거짓말을 끝내는 방법", th: "วิธีที่เราหยุดความหลอกลวง" } as Tr,
    faqTitle:    { en: "Frequently asked",     ko: "자주 묻는 질문", th: "คำถามที่พบบ่อย" } as Tr,
    legalTitle:  { en: "법적 고지 / Legal Notice", ko: "법적 고지",  th: "ข้อกฎหมาย / Legal Notice" } as Tr,
  },

  famousVsGood: {
    h1a: { en: "Instagram Famous",  ko: "인스타그램 유명 맛집", th: "ดังในอินสตาแกรม" } as Tr,
    h1b: { en: "vs Actually Good",  ko: "vs 진짜 맛집",        th: "vs ดีจริงๆ" } as Tr,
    subtitle: {
      en: "Social media picks restaurants by aesthetics. We rank them by data.\nCross-referenced against real Google review Trust Scores — no sponsored posts, no filters.",
      ko: "SNS는 사진발로 식당을 고릅니다. 우리는 데이터로 랭킹을 매겨요.\n실제 Google 리뷰 Trust Score와 교차 검증 — 협찬 없음, 필터 없음.",
      th: "โซเชียลมีเดียเลือกร้านอาหารตามหน้าตา เราจัดอันดับตามข้อมูล\nตรวจสอบกับ Trust Score รีวิว Google จริงๆ — ไม่มีโพสต์สปอนเซอร์ ไม่มีฟิลเตอร์",
    } as Tr,
    collections: { en: "Collections",      ko: "컬렉션",        th: "คอลเลกชัน" } as Tr,
    analyzed:    { en: "venues analyzed →", ko: "곳 분석 완료 →", th: "สถานที่วิเคราะห์แล้ว →" } as Tr,
    whyTitle:    { en: "Why we built this", ko: "왜 만들었나요?", th: "ทำไมเราถึงสร้างสิ่งนี้" } as Tr,
    whyBody: {
      en: "Instagram and TikTok surface restaurants by how good they look, not how good they are. We ran the numbers.",
      ko: "인스타그램과 틱톡은 맛이 아닌 사진발로 식당을 노출시켜요. 우리가 데이터를 돌렸습니다.",
      th: "Instagram และ TikTok แสดงร้านอาหารตามความสวยงาม ไม่ใช่ความอร่อย เราคำนวณตัวเลข",
    } as Tr,
  },
} as const;

export function tr(entry: Tr, locale: Locale): string {
  return entry[locale] ?? entry["en"];
}
