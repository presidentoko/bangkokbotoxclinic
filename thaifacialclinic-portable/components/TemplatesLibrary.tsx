"use client";

import { useState } from "react";
import { useToast } from "./Toast";

type Template = {
  category: "intro" | "quote" | "follow_up" | "booking_confirm" | "post_op";
  language: "en" | "ko" | "th" | "ar";
  title: string;
  body: string;
};

const TEMPLATES: Template[] = [
  // Intro / first contact
  {
    category: "intro", language: "en", title: "First contact (English)",
    body: "Hi {name}, thank you for your interest in our clinic! I'm {coordinator_name} from our patient coordination team. Could you share a couple of photos of your hairline (front + top) so our doctor can do an initial assessment? We'll send you a personalized plan + estimated graft count within 24 hours. No pressure 🙂",
  },
  {
    category: "intro", language: "ko", title: "첫 연락 (한국어)",
    body: "안녕하세요 {name}님, 저희 클리닉에 관심 가져주셔서 감사합니다. 환자 코디네이터 {coordinator_name} 입니다. 의사 1차 진단을 위해 헤어라인 사진 (정면 + 윗부분) 2장만 보내주시면, 24시간 내에 맞춤 시술 계획 + 모낭 수 예상을 보내드립니다. 부담 없이 편하게 문의 주세요 🙂",
  },
  {
    category: "intro", language: "th", title: "ติดต่อครั้งแรก (ไทย)",
    body: "สวัสดีคุณ {name} ขอบคุณที่สนใจคลินิกของเรา ผม/ดิฉัน {coordinator_name} ทีมประสานงานผู้ป่วยค่ะ/ครับ ขอภาพแนวผม (ด้านหน้า + ด้านบน) เพื่อให้คุณหมอประเมินเบื้องต้นได้ไหมคะ/ครับ จะส่งแผนการรักษา + ประมาณจำนวน graft กลับให้ภายใน 24 ชม. 🙂",
  },
  // Quote
  {
    category: "quote", language: "en", title: "Price quote (English)",
    body: "Hi {name}, based on the photos you sent, our doctor estimates {grafts} grafts using {procedure}. Total: ฿{price} (all-inclusive: consultation, surgery, post-op kit, 1 follow-up). This is locked-in if you book within 14 days. Want to schedule a free video consultation with our doctor?",
  },
  {
    category: "quote", language: "ko", title: "가격 견적 (한국어)",
    body: "{name}님, 보내주신 사진 기준 의사 진단: {procedure} {grafts}모낭 추정. 총 비용 ฿{price} (상담 · 수술 · 사후 키트 · 1회 follow-up 포함). 14일 내 예약 시 이 가격 보장. 의사와 무료 화상 상담 예약 드릴까요?",
  },
  // Follow-up
  {
    category: "follow_up", language: "en", title: "Follow-up after 3 days (English)",
    body: "Hi {name}, just following up on the quote we sent earlier this week. Happy to answer any questions about flights / hotel / recovery time — many of our international patients ask the same things. No rush at all.",
  },
  {
    category: "follow_up", language: "ko", title: "3일 후 follow-up (한국어)",
    body: "{name}님, 보내드린 견적 잘 받으셨는지 확인차 연락드립니다. 항공권/숙박/회복 기간 등 궁금한 점 있으시면 편하게 물어봐주세요. 국제 환자분들 자주 묻는 질문들이라 답변 정리해뒀어요. 결정 천천히 하셔도 됩니다.",
  },
  // Booking confirm
  {
    category: "booking_confirm", language: "en", title: "Booking confirmed (English)",
    body: "Confirmed! {name}, your {procedure} is booked for {date}. Pre-op checklist attached. Airport pickup: send your flight info 48h before arrival. Our hotel partners have a 15% discount — let me know if you want booking help. See you in Bangkok 🇹🇭",
  },
  // Post-op
  {
    category: "post_op", language: "en", title: "Day 1 post-op (English)",
    body: "Hi {name}, hope you're resting well. Quick reminders for Day 1: sleep at 45°, NO touching scalp, ice over forehead (not directly on grafts). Mild swelling Day 2-3 is normal. Send me a photo tomorrow morning and I'll relay to the doctor. You're doing great!",
  },
];

const CATEGORY_LABEL: Record<Template["category"], string> = {
  intro: "First contact",
  quote: "Price quote",
  follow_up: "Follow-up",
  booking_confirm: "Booking confirmed",
  post_op: "Post-op care",
};

const LANG_LABEL: Record<Template["language"], string> = {
  en: "EN", ko: "한국어", th: "ไทย", ar: "العربية",
};

export default function TemplatesLibrary() {
  const [category, setCategory] = useState<Template["category"] | "all">("all");
  const [lang, setLang] = useState<Template["language"] | "all">("all");
  const [copied, setCopied] = useState<number | null>(null);
  const toast = useToast();

  const filtered = TEMPLATES.filter((t) =>
    (category === "all" || t.category === category) &&
    (lang === "all" || t.language === lang)
  );

  async function copy(text: string, idx: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(idx);
      toast.push("success", "Template copied");
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.push("error", "Copy failed");
    }
  }

  return (
    <section className="card overflow-hidden">
      <div className="border-b p-5" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="eyebrow">Message templates</div>
        <h2 className="mt-1 font-display text-2xl font-bold">LINE / email templates</h2>
        <p className="text-xs muted mt-1">
          Copy-paste-edit. Replace <code className="font-mono text-[11px]">{"{name}"}</code>, <code className="font-mono text-[11px]">{"{procedure}"}</code>, <code className="font-mono text-[11px]">{"{grafts}"}</code>, etc. with actual values.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {(["all", "intro", "quote", "follow_up", "booking_confirm", "post_op"] as const).map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                category === cat ? "bg-navy-900 text-white dark:bg-gold-400 dark:text-navy-950" : "bg-[rgb(var(--bg))] muted"
              }`}>
              {cat === "all" ? "All" : CATEGORY_LABEL[cat]}
            </button>
          ))}
          <span className="text-xs muted mx-2">|</span>
          {(["all", "en", "ko", "th", "ar"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                lang === l ? "bg-navy-900 text-white dark:bg-gold-400 dark:text-navy-950" : "bg-[rgb(var(--bg))] muted"
              }`}>
              {l === "all" ? "All langs" : LANG_LABEL[l]}
            </button>
          ))}
        </div>
      </div>

      <ul className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
        {filtered.length === 0 && (
          <li className="p-8 text-center text-sm muted">No templates match — try clearing filters.</li>
        )}
        {filtered.map((t, i) => (
          <li key={i} className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold">{t.title}</span>
                <span className="rounded bg-navy-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                  {CATEGORY_LABEL[t.category]}
                </span>
                <span className="rounded bg-gold-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-800 dark:bg-gold-900/40 dark:text-gold-200">
                  {LANG_LABEL[t.language]}
                </span>
              </div>
              <button onClick={() => copy(t.body, i)}
                className="rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-bold text-white dark:bg-gold-400 dark:text-navy-950 transition hover:opacity-90">
                {copied === i ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-3 rounded-lg bg-[rgb(var(--bg))] p-3 text-sm leading-relaxed whitespace-pre-wrap" dir={t.language === "ar" ? "rtl" : "ltr"}>
              {t.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
