// 견적 경매의 표시 문구와 바로가기 링크 — 서버·클라이언트 공용.

import type { ContactMethod, Procedure, QuoteRequest } from "./auctionStore";

export const BID_WINDOW_HOURS = 48;

export const PROCEDURES: { value: Procedure; en: string; th: string; hint: string }[] = [
  { value: "botox", en: "Botox", th: "โบท็อกซ์", hint: "Area and units if you know them, e.g. forehead + frown lines, ~40 units" },
  { value: "filler", en: "Filler", th: "ฟิลเลอร์", hint: "Area and amount, e.g. chin 1 cc, under-eye" },
  { value: "hifu", en: "HIFU / lifting", th: "ไฮฟู / ยกกระชับ", hint: "Machine if you have one in mind (Ultraformer, Ulthera, Thermage), area, shots" },
  { value: "other", en: "Other", th: "อื่น ๆ", hint: "What you want done" },
];

export const CONTACT_METHODS: { value: ContactMethod; label: string; placeholder: string }[] = [
  { value: "whatsapp", label: "WhatsApp", placeholder: "+44 7700 900123" },
  { value: "line", label: "LINE", placeholder: "LINE ID" },
  { value: "email", label: "Email", placeholder: "you@example.com" },
  { value: "instagram", label: "Instagram", placeholder: "@yourname" },
];

export function procedureLabel(p: Procedure): string {
  const x = PROCEDURES.find((q) => q.value === p);
  return x ? `${x.en} (${x.th})` : p;
}

/** WhatsApp 은 국제번호 숫자만. 번호가 안 되면 null. */
export function waLink(phone: string, text: string): string | null {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** LINE 은 특정 상대를 지정할 수 없어 공유 창을 연다 — 상대는 형이 고른다. */
export function lineShareLink(text: string): string {
  return `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
}

export function igHandle(urlOrHandle: string | undefined): string | null {
  if (!urlOrHandle) return null;
  const s = urlOrHandle.trim();
  const m = s.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
  const h = m ? m[1] : s.replace(/^@/, "");
  if (!/^[A-Za-z0-9._]{1,30}$/.test(h) || ["p", "reel", "explore", "accounts"].includes(h)) return null;
  return h;
}

/** 인스타 DM 창을 바로 연다. */
export function igDmLink(handle: string): string {
  return `https://ig.me/m/${handle}`;
}

export function mapsLink(placeId: string | undefined, name: string): string {
  return placeId
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${encodeURIComponent(placeId)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
}

/** 손님 연락 수단으로 바로 메시지 창을 여는 링크. 이메일은 텔레그램 버튼이 안 돼서 null. */
export function customerMessageLink(r: QuoteRequest, text: string): string | null {
  if (r.contact_method === "whatsapp") return waLink(r.contact, text);
  if (r.contact_method === "line") return lineShareLink(text);
  if (r.contact_method === "instagram") {
    const h = igHandle(r.contact);
    return h ? igDmLink(h) : null;
  }
  return null;
}

/** 클리닉에 보낼 인스타 DM 문구 (태국어 + 영어). */
export function clinicDmText(r: QuoteRequest, bidUrl: string): string {
  const what = [procedureLabel(r.procedure), r.details].filter(Boolean).join(" — ");
  return [
    "สวัสดีค่ะ 🙏 มีลูกค้าขอใบเสนอราคาผ่าน Bangkok Botox Clinic",
    `• ${what}`,
    r.area ? `• ย่าน: ${r.area}` : null,
    r.when ? `• วันที่สะดวก: ${r.when}` : null,
    "",
    "เสนอราคาได้ที่ลิงก์นี้ (ไม่ต้องสมัครสมาชิก ใช้เวลา 1 นาที):",
    bidUrl,
    `ปิดรับใน ${BID_WINDOW_HOURS} ชั่วโมง`,
    "",
    "Hi! A patient asked for quotes through Bangkok Botox Clinic. Send your price at the link above — no signup, 1 minute.",
  ].filter((l) => l !== null).join("\n");
}

export function baht(n: number): string {
  return `฿${Math.round(n).toLocaleString("en-US")}`;
}
