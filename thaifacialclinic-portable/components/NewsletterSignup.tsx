"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { useToast } from "./Toast";

const COPY: Record<Lang, { title: string; sub: string; ph: string; cta: string; ok: string }> = {
  en: {
    title: "Get the Thai hair-transplant guide",
    sub: "Monthly: new verified clinics, cost trends, real patient stories. No spam, unsubscribe anytime.",
    ph: "Your email",
    cta: "Subscribe →",
    ok: "✓ Subscribed — check your inbox for the welcome email.",
  },
  ko: {
    title: "태국 모발이식 가이드 받기",
    sub: "월간: 새 검증 클리닉, 비용 추이, 실제 환자 후기. 스팸 X, 언제든 구독 해지.",
    ph: "이메일",
    cta: "구독하기 →",
    ok: "✓ 구독 완료 — 환영 메일 확인 부탁드립니다.",
  },
  th: {
    title: "รับคู่มือปลูกผมในไทย",
    sub: "รายเดือน: คลินิกใหม่ที่ตรวจสอบแล้ว แนวโน้มราคา รีวิวจริง",
    ph: "อีเมล",
    cta: "สมัคร →",
    ok: "✓ สมัครเรียบร้อย",
  },
  zh: {
    title: "订阅泰国植发指南",
    sub: "每月：新认证诊所、费用趋势、真实患者故事。无垃圾邮件。",
    ph: "邮箱",
    cta: "订阅 →",
    ok: "✓ 已订阅",
  },
  ar: {
    title: "احصل على دليل زراعة الشعر في تايلاند",
    sub: "شهرياً: عيادات موثقة جديدة، اتجاهات التكاليف، قصص مرضى حقيقية.",
    ph: "بريدك الإلكتروني",
    cta: "اشترك →",
    ok: "✓ تم الاشتراك",
  },
};

export default function NewsletterSignup({ lang, source = "footer" }: { lang: Lang; source?: string }) {
  const c = COPY[lang] || COPY.en;
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const r = await fetch("/api/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, source, _hp: hp }),
      });
      if (r.ok) {
        setSent(true);
        toast.push("success", "Subscribed");
      } else {
        const j = await r.json().catch(() => ({}));
        toast.push("error", (j as { error?: string }).error || "Subscribe failed");
      }
    } catch {
      toast.push("error", "Network error");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border-2 border-mint-400 bg-mint-50 px-5 py-4 text-center dark:bg-mint-950/30">
        <p className="font-bold text-mint-800 dark:text-mint-200">{c.ok}</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border-2 bg-[rgb(var(--bg-elev))] p-5 sm:p-6" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="font-display text-lg font-bold tracking-tighter-display sm:text-xl">{c.title}</div>
          <p className="mt-1 text-xs leading-relaxed muted">{c.sub}</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={c.ph}
            className="rounded-xl border bg-[rgb(var(--bg))] px-4 py-2.5 text-sm font-medium sm:w-64"
            style={{ borderColor: "rgb(var(--border))" }}
          />
          <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" aria-hidden />
          <button type="submit" disabled={busy} className="btn-gold !py-2.5 disabled:opacity-50">
            {busy ? "…" : c.cta}
          </button>
        </form>
      </div>
    </section>
  );
}
