// Focus-aware "Why us vs them" differentiation grid.
// 5 items × 2 columns (Us / Them). Designed for botox + dental + all other focus deploys.

import type { SiteFocus } from "@/lib/site";

type Lang = "en" | "ko" | "th";

const FOCUS_NOUN: Record<Lang, Record<SiteFocus, string>> = {
  en: { all: "clinic", botox: "botox", filler: "filler", hifu: "HIFU", facial: "skincare", laser: "laser", dental: "dental", hair: "hair-transplant" },
  ko: { all: "클리닉", botox: "보톡스", filler: "필러", hifu: "HIFU", facial: "스킨케어", laser: "레이저", dental: "치과", hair: "모발이식" },
  th: { all: "คลินิก", botox: "โบท็อกซ์", filler: "ฟิลเลอร์", hifu: "HIFU", facial: "สกินแคร์", laser: "เลเซอร์", dental: "ทันตกรรม", hair: "ปลูกผม" },
};

const BASE_ITEMS: Record<Lang, (noun: string) => { good: string; bad: string }[]> = {
  en: (noun) => [
    { good: `We aggregate Google + HDmall + Wongnai + Pantip + Reddit reviews — every ${noun} clinic checked across multiple sources`, bad: "Most directories show only what clinics tell them" },
    { good: "We can NOT delete or hide bad reviews — even for paying partner clinics", bad: "Other sites bury negative reviews for advertisers" },
    { good: "Suspected viral-marketing clinics get flagged (visible via opt-in toggle)", bad: "Other sites give viral clinics the same trust as legit ones" },
    { good: "Trust Score is a transparent formula you can audit — published publicly", bad: "Other 'top-rated' lists are opaque pay-to-play" },
    { good: "Partner clinics pay for placement priority — never for review manipulation", bad: "Many sites quietly sell 'reputation management' services" },
  ],
  ko: (noun) => [
    { good: `Google + HDmall + Wongnai + Pantip + Reddit 리뷰를 통합합니다 — 모든 ${noun} 클리닉을 여러 출처로 교차 검증`, bad: "대부분 디렉토리는 클리닉이 제공한 정보만 표시" },
    { good: "부정 리뷰를 삭제·숨기지 않습니다 — 결제한 파트너 클리닉이라도 예외 없음", bad: "다른 사이트는 광고주의 부정 리뷰를 묻어버림" },
    { good: "바이럴 마케팅 의심 클리닉은 플래그 처리(옵션 토글로 표시)", bad: "다른 사이트는 바이럴 클리닉도 동일한 신뢰도 부여" },
    { good: "신뢰도 점수는 공개 검증 가능한 투명한 공식", bad: "다른 'TOP 추천' 리스트는 불투명한 광고비 기반" },
    { good: "파트너 클리닉은 노출 우선순위에 비용 지불 — 리뷰 조작에는 절대 아님", bad: "많은 사이트가 몰래 '평판 관리' 서비스를 판매" },
  ],
  th: (noun) => [
    { good: `เรารวบรวมรีวิวจาก Google + HDmall + Wongnai + Pantip + Reddit — ตรวจสอบคลินิก${noun}ทุกแห่งจากหลายแหล่ง`, bad: "ไดเรกทอรีส่วนใหญ่แสดงเฉพาะข้อมูลที่คลินิกให้มา" },
    { good: "เราไม่ลบหรือซ่อนรีวิวเชิงลบ — แม้แต่คลินิกพาร์ตเนอร์ที่จ่ายเงิน", bad: "เว็บอื่นซ่อนรีวิวเชิงลบให้ผู้ลงโฆษณา" },
    { good: "คลินิกที่สงสัยว่าใช้การตลาดไวรัลจะถูกตั้งค่าสถานะ (แสดงผ่านตัวเลือกเปิด-ปิด)", bad: "เว็บอื่นให้ความน่าเชื่อถือเท่ากันกับคลินิกไวรัล" },
    { good: "คะแนนความน่าเชื่อถือเป็นสูตรโปร่งใสที่ตรวจสอบได้ — เผยแพร่สู่สาธารณะ", bad: "รายการ 'TOP-rated' อื่นๆ เป็น pay-to-play ที่ไม่โปร่งใส" },
    { good: "คลินิกพาร์ตเนอร์จ่ายเพื่อลำดับการแสดงผล — ไม่เคยจ่ายเพื่อบิดเบือนรีวิว", bad: "หลายเว็บแอบขายบริการ 'จัดการชื่อเสียง'" },
  ],
};

const COPY: Record<Lang, { eyebrow: string; heading: string; sub: (noun: string) => string; us: string; them: string }> = {
  en: {
    eyebrow: "Why we're different", heading: "What other directories won't admit",
    sub: (noun) => `${noun.charAt(0).toUpperCase() + noun.slice(1)} decisions are too important for paid-placement directories. Here's what makes us different.`,
    us: "Us", them: "Them",
  },
  ko: {
    eyebrow: "왜 우리가 다른가", heading: "다른 디렉토리가 인정 안 하는 것",
    sub: (noun) => `${noun} 결정은 광고비 받는 디렉토리에 맡기기엔 너무 중요합니다. 이게 저희의 차이입니다.`,
    us: "우리", them: "다른 곳",
  },
  th: {
    eyebrow: "เราต่างจากที่อื่น", heading: "สิ่งที่ไดเรกทอรีอื่นไม่ยอมพูด",
    sub: (noun) => `การตัดสินใจเรื่อง${noun}สำคัญเกินกว่าจะฝากให้ไดเรกทอรีที่รับเงินจัดอันดับ นี่คือสิ่งที่ทำให้เราต่าง`,
    us: "เรา", them: "ที่อื่น",
  },
};

export default function WhyUs({ focus = "all", lang = "en" }: { focus?: SiteFocus; lang?: Lang }) {
  const t = COPY[lang] ?? COPY.en;
  const noun = (FOCUS_NOUN[lang] ?? FOCUS_NOUN.en)[focus] || FOCUS_NOUN.en.all;
  const items = (BASE_ITEMS[lang] ?? BASE_ITEMS.en)(noun);

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-white p-6 sm:p-12 border" style={{ borderColor: "var(--border)" }}>
      <div className="relative">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">{t.eyebrow}</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">{t.heading}</h2>
          <p className="mt-3 text-sm text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
            {t.sub(noun)}
          </p>
        </div>

        <div className="grid gap-3">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-2xl border bg-[var(--bg)] p-4 sm:grid-cols-2 sm:p-5"
              style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">{t.us}</div>
                  <div className="mt-0.5 text-sm font-semibold leading-snug">{it.good}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0"
                style={{ borderColor: "var(--border)" }}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-100 text-red-700">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-700">{t.them}</div>
                  <div className="mt-0.5 text-sm leading-snug text-[var(--muted)]">{it.bad}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
