// ⚠️ AUTO-GENERATED from shared/lib/i18n.ts
// DO NOT edit directly — edit shared/lib/i18n.ts, then run `python scripts/sync_shared.py`.

// 다국어 지원 — EN (default) + TH.
// 사용: const t = await loadStrings(lang); t.home.hero
// 페이지 url 패턴: /en/* (default, 생략 가능) | /th/*

export type Lang = "en" | "th";

export const LANGS: Lang[] = ["en", "th"];

type Strings = {
  nav: { all: string; byService: string; forClinics: string; about: string };
  home: { heroSub: string; featured: string; byService: string; byDistrict: string; topByTrust: string; faq: string };
  card: { trust: string; reviews: string; open: string; trendingUp: string; declining: string; localGuides: string };
  clinic: {
    realReviews: string; methodology: string; similar: string; quickActions: string;
    callClinic: string; viewMaps: string; visitWebsite: string; contactLine: string; bookConsult: string;
    address: string; phone: string; website: string;
    timeline: string; topics: string; services: string;
    aiVerified: string; realRate: string; updated: string; lastUpdated: string;
  };
  booking: {
    heading: string; headingClinic: string; sub: string;
    steps: string[];
    selectService: string; preferredDate: string; timeSlot: string;
    name: string; email: string; phone: string; notes: string; optional: string;
    back: string; continue: string; review: string; confirm: string; sending: string;
    receivedTitle: string; receivedBody: string; error: string;
    timeSlots: string[];
  };
  footer: { note: string; forClinics: string; about: string; contact: string };
};

const EN: Strings = {
  nav: {
    all: "All Clinics",
    byService: "By Service",
    forClinics: "For Clinics",
    about: "About",
  },
  home: {
    heroSub: "clinics analyzed · Trust Score from real Google reviews. Updated continuously.",
    featured: "Featured this week",
    byService: "By Service",
    byDistrict: "By District",
    topByTrust: "Top {n} by Trust Score",
    faq: "Frequently asked",
  },
  card: {
    trust: "Trust",
    reviews: "reviews",
    open: "Open",
    trendingUp: "↗ Trending up",
    declining: "↘ Declining",
    localGuides: "Local Guides",
  },
  clinic: {
    realReviews: "Real review excerpts",
    methodology: "How Trust Score is computed",
    similar: "Similar clinics",
    quickActions: "Quick actions",
    callClinic: "Call clinic",
    viewMaps: "View on Google Maps",
    visitWebsite: "Visit website",
    contactLine: "Contact via LINE",
    bookConsult: "Book consultation",
    address: "Address",
    phone: "Phone",
    website: "Website",
    timeline: "Quality trend",
    topics: "What reviewers mention most",
    services: "Services mentioned",
    aiVerified: "AI Verified",
    realRate: "real reviews",
    updated: "Updated",
    lastUpdated: "Last updated",
  },
  booking: {
    heading: "Reserve your consultation",
    headingClinic: "Book consultation at {name}",
    sub: "Free, no obligation. We confirm within 24h.",
    steps: ["Service", "Date", "Contact", "Review"],
    selectService: "Which service?",
    preferredDate: "Preferred date",
    timeSlot: "Time slot",
    name: "Your name",
    email: "Email",
    phone: "Phone / LINE / WhatsApp",
    notes: "Notes",
    optional: "(optional)",
    back: "Back",
    continue: "Continue",
    review: "Review →",
    confirm: "Confirm request",
    sending: "Sending...",
    receivedTitle: "Request received",
    receivedBody: "We'll contact you within 24 hours with confirmed times and pricing.",
    error: "Could not send. Try again or contact directly.",
    timeSlots: ["Morning (9–12)", "Afternoon (12–17)", "Evening (17–20)", "Flexible"],
  },
  footer: {
    note: "Independent review aggregation. Not affiliated with any clinic. Data sourced from public Google Maps listings.",
    forClinics: "For clinics",
    about: "About",
    contact: "Contact",
  },
};

const TH: Strings = {
  nav: {
    all: "คลินิกทั้งหมด",
    byService: "ตามบริการ",
    forClinics: "สำหรับคลินิก",
    about: "เกี่ยวกับ",
  },
  home: {
    heroSub: "คลินิก · คะแนนความน่าเชื่อถือจากรีวิว Google จริง อัปเดตต่อเนื่อง",
    featured: "แนะนำประจำสัปดาห์",
    byService: "ตามบริการ",
    byDistrict: "ตามเขต",
    topByTrust: "อันดับ {n} ตามคะแนนความน่าเชื่อถือ",
    faq: "คำถามที่พบบ่อย",
  },
  card: {
    trust: "คะแนน",
    reviews: "รีวิว",
    open: "เปิด",
    trendingUp: "↗ กำลังขึ้น",
    declining: "↘ ลดลง",
    localGuides: "Local Guides",
  },
  clinic: {
    realReviews: "ตัวอย่างรีวิวจริง",
    methodology: "วิธีคำนวณคะแนนความน่าเชื่อถือ",
    similar: "คลินิกที่คล้ายกัน",
    quickActions: "ติดต่อด่วน",
    callClinic: "โทรหาคลินิก",
    viewMaps: "ดูบน Google Maps",
    visitWebsite: "เว็บไซต์",
    contactLine: "ติดต่อผ่าน LINE",
    bookConsult: "จองคำปรึกษา",
    address: "ที่อยู่",
    phone: "โทรศัพท์",
    website: "เว็บไซต์",
    timeline: "แนวโน้มคุณภาพ",
    topics: "สิ่งที่ผู้รีวิวพูดถึงมากที่สุด",
    services: "บริการที่กล่าวถึง",
    aiVerified: "ตรวจสอบด้วย AI",
    realRate: "รีวิวจริง",
    updated: "อัปเดต",
    lastUpdated: "อัปเดตล่าสุด",
  },
  booking: {
    heading: "จองคำปรึกษา",
    headingClinic: "จองคำปรึกษาที่ {name}",
    sub: "ฟรี ไม่มีข้อผูกมัด ยืนยันภายใน 24 ชม.",
    steps: ["บริการ", "วันที่", "ติดต่อ", "ตรวจสอบ"],
    selectService: "เลือกบริการ",
    preferredDate: "วันที่ต้องการ",
    timeSlot: "ช่วงเวลา",
    name: "ชื่อของคุณ",
    email: "อีเมล",
    phone: "เบอร์ / LINE / WhatsApp",
    notes: "หมายเหตุ",
    optional: "(ไม่บังคับ)",
    back: "ย้อนกลับ",
    continue: "ต่อไป",
    review: "ตรวจสอบ →",
    confirm: "ยืนยันการจอง",
    sending: "กำลังส่ง...",
    receivedTitle: "ได้รับคำขอแล้ว",
    receivedBody: "เราจะติดต่อกลับภายใน 24 ชั่วโมงพร้อมเวลานัดและราคา",
    error: "ส่งไม่ได้ ลองใหม่หรือติดต่อโดยตรง",
    timeSlots: ["เช้า (9–12)", "บ่าย (12–17)", "เย็น (17–20)", "ยืดหยุ่น"],
  },
  footer: {
    note: "ไดเรกทอรีรีวิวอิสระ ไม่ได้เป็นพันธมิตรกับคลินิกใด ข้อมูลจากรายชื่อสาธารณะของ Google Maps",
    forClinics: "สำหรับคลินิก",
    about: "เกี่ยวกับเรา",
    contact: "ติดต่อ",
  },
};

const STRINGS: Record<Lang, Strings> = { en: EN, th: TH };

export function tFor(lang: Lang) {
  return STRINGS[lang] ?? STRINGS.en;
}

export function langFromPath(pathname: string): Lang {
  if (pathname.startsWith("/th")) return "th";
  return "en";
}

export function altLangPath(pathname: string, target: Lang): string {
  const stripped = pathname.replace(/^\/th(\/|$)/, "/");
  if (target === "th") {
    return stripped === "/" ? "/th" : `/th${stripped}`;
  }
  return stripped;
}
