"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";

const COPY: Record<Lang, { headline: string; sub: string; ok: string; submit: string; name: string; email: string; phone: string; procedure: string; date: string; message: string }> = {
  en: {
    headline: "Request consultation",
    sub: "We'll forward your request to the clinic. Free, no commitment.",
    ok: "✓ Sent. The clinic will contact you within 24 hours.",
    submit: "Send request",
    name: "Your name",
    email: "Email",
    phone: "Phone or LINE ID",
    procedure: "Procedure of interest",
    date: "Preferred date (optional)",
    message: "Anything else? (optional)",
  },
  ko: {
    headline: "상담 신청",
    sub: "클리닉에 전달드립니다. 무료, 부담 없음.",
    ok: "✓ 접수됨. 24시간 내 클리닉이 연락드립니다.",
    submit: "신청 보내기",
    name: "성함",
    email: "이메일",
    phone: "전화번호 또는 LINE ID",
    procedure: "관심 시술",
    date: "희망 일자 (선택)",
    message: "추가 메시지 (선택)",
  },
  th: {
    headline: "ขอคำปรึกษา",
    sub: "เราจะส่งคำขอของคุณให้คลินิก ฟรี ไม่มีข้อผูกมัด",
    ok: "✓ ส่งแล้ว คลินิกจะติดต่อกลับภายใน 24 ชม.",
    submit: "ส่งคำขอ",
    name: "ชื่อ",
    email: "อีเมล",
    phone: "เบอร์โทร หรือ LINE ID",
    procedure: "ขั้นตอนที่สนใจ",
    date: "วันที่ต้องการ (ไม่บังคับ)",
    message: "ข้อความเพิ่มเติม (ไม่บังคับ)",
  },
  zh: {
    headline: "预约咨询",
    sub: "我们会将您的请求转发给诊所。免费，无承诺。",
    ok: "✓ 已发送。诊所将在 24 小时内联系您。",
    submit: "发送请求",
    name: "姓名",
    email: "邮箱",
    phone: "电话或 LINE ID",
    procedure: "感兴趣的项目",
    date: "首选日期（可选）",
    message: "其他备注（可选）",
  },
  ar: {
    headline: "طلب استشارة",
    sub: "سنحول طلبك إلى العيادة. مجاني، بدون التزام.",
    ok: "✓ تم الإرسال. ستتصل بك العيادة خلال 24 ساعة.",
    submit: "إرسال الطلب",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف أو LINE ID",
    procedure: "الإجراء المهتم به",
    date: "التاريخ المفضل (اختياري)",
    message: "ملاحظات إضافية (اختياري)",
  },
};

export default function ClinicBookingForm({
  lang,
  clinicId,
  clinicName,
  procedures,
}: {
  lang: Lang;
  clinicId: string;
  clinicName: string;
  procedures: string[];
}) {
  const t = COPY[lang];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [procedure, setProcedure] = useState(procedures[0] || "Hair Transplant");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinic_id: clinicId,
          clinicName,
          name,
          email,
          phone,
          procedure,
          date,
          notes: message,
          context: `clinic-page · ${lang}`,
          _hp: hp,
        }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <section className="rounded-[2rem] border-2 bg-mint-50 p-10 text-center dark:bg-mint-950/30" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="inline-grid h-16 w-16 place-items-center rounded-full bg-mint-100 text-mint-700">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
        <p className="mt-4 font-display text-xl font-bold text-mint-800 dark:text-mint-200">{t.ok}</p>
      </section>
    );
  }

  const inputCls = "rounded-xl border bg-[rgb(var(--bg-elev))] px-4 py-3 text-sm font-medium placeholder:text-[rgb(var(--muted))] focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/20 dark:focus:border-gold-400 dark:focus:ring-gold-400/20";

  return (
    <section className="rounded-[2rem] border-2 bg-[rgb(var(--bg-elev))] p-6 shadow-premium sm:p-8" style={{ borderColor: "rgb(var(--border))" }}>
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t.name + " *"}
          className={inputCls} style={{ borderColor: "rgb(var(--border))" }} />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.email + " *"}
          className={inputCls} style={{ borderColor: "rgb(var(--border))" }} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phone}
          className={inputCls} style={{ borderColor: "rgb(var(--border))" }} />
        <select value={procedure} onChange={(e) => setProcedure(e.target.value)}
          className={inputCls} style={{ borderColor: "rgb(var(--border))" }}>
          {(procedures.length ? procedures : ["FUE", "DHI", "FUT", "PRP", "SMP"]).map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder={t.date}
          className={`${inputCls} sm:col-span-2`} style={{ borderColor: "rgb(var(--border))" }} />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.message} rows={3}
          className={`${inputCls} sm:col-span-2 resize-none`} style={{ borderColor: "rgb(var(--border))" }} />
        <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" aria-hidden="true" />
        <button type="submit" disabled={busy} className="sm:col-span-2 btn-primary !py-3.5 !text-base disabled:opacity-50">
          {busy ? "Sending…" : (
            <>
              {t.submit}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </>
          )}
        </button>
        {error && <p className="sm:col-span-2 text-center text-xs text-red-600">Error {error} — please try again</p>}
        <p className="sm:col-span-2 text-center text-[10px] muted">By submitting, you agree the clinic may contact you. We never sell your info.</p>
      </form>
    </section>
  );
}
