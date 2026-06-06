"use client";
import { useState } from "react";
import type { Lang } from "@/lib/types";

const HEADLINE: Record<Lang, string> = {
  en: "Get personalized clinic recommendations",
  ko: "맞춤형 클리닉 추천 받기",
  th: "รับคำแนะนำคลินิกเฉพาะบุคคล",
  zh: "获取个性化诊所推荐",
  ar: "احصل على توصيات عيادات مخصصة",
};
const SUB: Record<Lang, string> = {
  en: "Tell us your procedure + budget. We'll match 3 clinics within 24 hours. Free, no spam.",
  ko: "시술 종류와 예산만 알려주세요. 24시간 내 3개 클리닉 추천. 무료, 스팸 없음.",
  th: "บอกขั้นตอนและงบประมาณของคุณ เราจะแนะนำ 3 คลินิกภายใน 24 ชั่วโมง",
  zh: "告诉我们项目和预算。我们将在 24 小时内匹配 3 家诊所。免费，无垃圾邮件。",
  ar: "أخبرنا بالإجراء والميزانية. سنقترح 3 عيادات خلال 24 ساعة. مجاني، بدون بريد عشوائي.",
};
const PH_EMAIL: Record<Lang, string> = { en: "Your email", ko: "이메일 주소", th: "อีเมล", zh: "您的邮箱", ar: "بريدك" };
const CTA: Record<Lang, string> = { en: "Get matched →", ko: "매칭 받기 →", th: "ดูคลินิกที่ตรง →", zh: "立即匹配 →", ar: "ابدأ المطابقة →" };
const OK: Record<Lang, string> = {
  en: "✓ Got it. Check your inbox within 24h.",
  ko: "✓ 접수됨. 24시간 내 메일 확인하세요.",
  th: "✓ รับเรื่องแล้ว ตรวจอีเมลภายใน 24 ชม.",
  zh: "✓ 已收到。24小时内查收邮件。",
  ar: "✓ تم الاستلام. تحقق من بريدك خلال 24 ساعة.",
};

const PROCS = ["Hair Transplant (FUE)", "Hair Transplant (DHI)", "SMP (Scalp Tattoo)", "Scar Coverage", "Scalp Treatment"];

export default function LeadCaptureForm({ lang }: { lang: Lang }) {
  const [email, setEmail] = useState("");
  const [proc, setProc] = useState(PROCS[0]);
  const [budget, setBudget] = useState("3000-5000");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hp, setHp] = useState(""); // honeypot

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          procedure: proc,
          notes: `Budget: ${budget}`,
          context: `lead-magnet · ${lang}`,
          _hp: hp,
        }),
      });
      setSent(true);
    } catch {
      setSent(true); // fail-silent UX
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border-2 px-6 py-10 sm:p-12" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-gold-50 via-transparent to-mint-50 dark:from-gold-950/20 dark:to-mint-950/20" aria-hidden />
      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="eyebrow">Free matching service</div>
          <h2 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tighter-display sm:text-4xl">{HEADLINE[lang]}</h2>
          <p className="mt-3 text-base leading-relaxed muted">{SUB[lang]}</p>
          <ul className="mt-5 space-y-2 text-sm">
            {["3 clinic matches within 24 hours", "Includes Trust Score breakdown for each", "Free, no commitment"].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint-100 text-mint-700">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </span>
                <span className="font-medium">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl bg-[rgb(var(--bg-elev))] p-6 shadow-premium ring-1" style={{ ['--tw-ring-color' as never]: "rgb(var(--border))" }}>
          {sent ? (
            <div className="grid place-items-center py-10 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-mint-100 text-mint-700">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <p className="mt-4 font-display text-lg font-bold text-mint-800 dark:text-mint-200">{OK[lang]}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <select value={proc} onChange={(e) => setProc(e.target.value)} className="rounded-xl border bg-[rgb(var(--bg))] px-3 py-3 text-sm font-medium" style={{ borderColor: "rgb(var(--border))" }}>
                  {PROCS.map((p) => <option key={p}>{p}</option>)}
                </select>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} className="rounded-xl border bg-[rgb(var(--bg))] px-3 py-3 text-sm font-medium" style={{ borderColor: "rgb(var(--border))" }}>
                  <option value="<2000">{"<"} $2,000</option>
                  <option value="2000-3000">$2,000 – $3,000</option>
                  <option value="3000-5000">$3,000 – $5,000</option>
                  <option value="5000+">$5,000+</option>
                </select>
              </div>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={PH_EMAIL[lang]}
                className="w-full rounded-xl border bg-[rgb(var(--bg))] px-3 py-3 text-sm font-medium placeholder:text-[rgb(var(--muted))]"
                style={{ borderColor: "rgb(var(--border))" }}
              />
              <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" aria-hidden="true" />
              <button type="submit" disabled={busy} className="w-full btn-gold disabled:opacity-50">
                {busy ? "Sending…" : CTA[lang]}
              </button>
              <p className="text-center text-[10px] muted">No card. No spam. Unsubscribe anytime.</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
