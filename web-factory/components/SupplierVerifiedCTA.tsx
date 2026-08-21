"use client";

// Verified 배지 주문 폼 — /for-suppliers (en/ko/th).
//
// 이전 버전은 영어 페이지에 한국어 UI 만 있었다("문의가 접수되었습니다",
// "전송 실패") — 태국·서양 공급사가 결제 직전 화면에서 못 읽는 언어를 만났다.
// 또 DBD 번호 칸이 선택 입력인데 서버는 message 를 필수로 받아서, 그 칸을
// 비우고 보내면 400 → "전송 실패" 였다. 즉 ฿5,000 주문이 그냥 실패했다.

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "err";
type Locale = "en" | "ko" | "th";

const T: Record<Locale, {
  badge: string; title: string; sub: string;
  okTitle: string; okBody: string;
  name: string; namePh: string; company: string;
  phone: string; email: string;
  dbd: string; dbdPh: string;
  send: string; sending: string; err: string;
}> = {
  en: {
    badge: "Most popular",
    title: "Verified Supplier Badge — ฿5,000",
    sub: "One-time. Badge stays as long as your DBD registration remains active.",
    okTitle: "Request received.",
    okBody: "We'll reply within one business day.",
    name: "Name *", namePh: "John Smith", company: "Company *",
    phone: "Phone *", email: "Email *",
    dbd: "DBD registration number (optional)",
    dbdPh: "DBD number or anything you'd like us to know",
    send: "Send request", sending: "Sending…",
    err: "Couldn't send. Please try again in a moment.",
  },
  ko: {
    badge: "가장 많이 선택",
    title: "Verified 배지 — ฿5,000",
    sub: "1회 결제. DBD 등록이 유효한 동안 배지가 유지됩니다.",
    okTitle: "문의가 접수되었습니다.",
    okBody: "영업일 기준 1일 이내에 연락드리겠습니다.",
    name: "이름 *", namePh: "홍길동", company: "회사명 *",
    phone: "전화번호 *", email: "이메일 *",
    dbd: "DBD 등록번호 (선택)",
    dbdPh: "DBD 등록번호 또는 문의 내용",
    send: "문의 보내기", sending: "전송 중…",
    err: "전송에 실패했습니다. 잠시 후 다시 시도해주세요.",
  },
  th: {
    badge: "ได้รับความนิยมสูงสุด",
    title: "ตราสัญลักษณ์ Verified — ฿5,000",
    sub: "ชำระครั้งเดียว ตราจะคงอยู่ตราบเท่าที่การจดทะเบียน DBD ยังมีผล",
    okTitle: "ได้รับคำขอของคุณแล้ว",
    okBody: "เราจะติดต่อกลับภายใน 1 วันทำการ",
    name: "ชื่อ *", namePh: "สมชาย ใจดี", company: "บริษัท *",
    phone: "โทรศัพท์ *", email: "อีเมล *",
    dbd: "เลขทะเบียน DBD (ไม่บังคับ)",
    dbdPh: "เลขทะเบียน DBD หรือรายละเอียดเพิ่มเติม",
    send: "ส่งคำขอ", sending: "กำลังส่ง…",
    err: "ส่งไม่สำเร็จ กรุณาลองอีกครั้ง",
  },
};

// 결제 링크가 설정돼 있으면 접수 완료 화면에서 바로 결제로 보낸다.
// 없으면(현재 기본값) 예전처럼 "연락드리겠습니다" 로 끝난다 — 지금 이 사이트에는
// 결제 수단이 하나도 없어서 모든 티어가 텔레그램 메시지로만 접수된다.
const PAY_URL = process.env.NEXT_PUBLIC_PAY_VERIFIED || "";

const PAY_LABEL: Record<Locale, string> = {
  en: "Pay ฿5,000 and start verification →",
  ko: "฿5,000 결제하고 검증 시작 →",
  th: "ชำระ ฿5,000 และเริ่มการตรวจสอบ →",
};

export function SupplierVerifiedCTA({ locale = "en" }: { locale?: Locale }) {
  const [status, setStatus] = useState<Status>("idle");
  const t = T[locale];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    fd.set("_locale", locale);
    fd.set("_subject", "Verified Supplier Badge order (฿5,000)");
    // 서버는 message 를 필수로 받는다. DBD 칸은 선택 입력이므로 비어 있으면
    // 주문 사실 자체를 본문으로 채운다 — 없으면 400 으로 주문이 유실된다.
    const dbd = String(fd.get("message") ?? "").trim();
    fd.set(
      "message",
      dbd
        ? `Verified Supplier Badge order (฿5,000). DBD / notes: ${dbd}`
        : "Verified Supplier Badge order (฿5,000). No DBD number provided.",
    );
    try {
      const res = await fetch("/api/inquiry", { method: "POST", body: fd });
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  const field =
    "w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400";
  const label = "block text-xs font-bold text-[var(--muted)] mb-1";

  return (
    <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 md:p-8">
      <div className="mb-5">
        <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          {t.badge}
        </span>
        <h3 className="text-2xl font-bold">{t.title}</h3>
        <p className="text-sm text-[var(--muted)] mt-1">{t.sub}</p>
      </div>

      {status === "ok" ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-6 text-center">
          <div className="text-2xl mb-2">✅</div>
          <p className="font-bold text-emerald-800">{t.okTitle}</p>
          <p className="text-sm text-emerald-700 mt-1">{t.okBody}</p>
          {PAY_URL && (
            <a
              href={PAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 py-2.5 px-5 rounded-lg bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 transition"
            >
              {PAY_LABEL[locale]}
            </a>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={label}>{t.name}</label>
              <input name="name" required placeholder={t.namePh} className={field} />
            </div>
            <div>
              <label className={label}>{t.company}</label>
              <input name="company" required placeholder="ABC Co., Ltd." className={field} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={label}>{t.phone}</label>
              <input name="phone" required type="tel" placeholder="+66 81 234 5678" className={field} />
            </div>
            <div>
              <label className={label}>{t.email}</label>
              <input name="email" required type="email" placeholder="you@company.com" className={field} />
            </div>
          </div>

          <div>
            <label className={label}>{t.dbd}</label>
            <input name="message" placeholder={t.dbdPh} className={field} />
          </div>

          {/* 허니팟 — 서버가 값이 있으면 조용히 버린다. 사람 눈에는 안 보인다. */}
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] w-px h-px opacity-0"
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-3 px-6 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 disabled:opacity-50 transition"
          >
            {status === "sending" ? t.sending : t.send}
          </button>

          {status === "err" && (
            <p className="text-xs text-red-600 text-center">{t.err}</p>
          )}
        </form>
      )}
    </div>
  );
}
