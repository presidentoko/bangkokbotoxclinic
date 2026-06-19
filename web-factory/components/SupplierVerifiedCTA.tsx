"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "err";

export function SupplierVerifiedCTA() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    fd.set("_locale", "en");
    try {
      const res = await fetch("/api/inquiry", { method: "POST", body: fd });
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 md:p-8">
      <div className="mb-5">
        <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          Most popular
        </span>
        <h3 className="text-2xl font-bold">Verified Supplier Badge — ฿5,000</h3>
        <p className="text-sm text-[var(--muted)] mt-1">
          One-time. Badge stays as long as your DBD registration remains active.
        </p>
      </div>

      {status === "ok" ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-6 text-center">
          <div className="text-2xl mb-2">✅</div>
          <p className="font-bold text-emerald-800">문의가 접수되었습니다.</p>
          <p className="text-sm text-emerald-700 mt-1">빠른 시일 내에 연락드리겠습니다.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1">이름 / Name *</label>
              <input
                name="name"
                required
                placeholder="홍길동 / John Smith"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1">회사명 / Company *</label>
              <input
                name="company"
                required
                placeholder="ABC Co., Ltd."
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1">전화번호 / Phone *</label>
              <input
                name="phone"
                required
                type="tel"
                placeholder="+66 81 234 5678"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1">이메일 / Email *</label>
              <input
                name="email"
                required
                type="email"
                placeholder="you@company.com"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--muted)] mb-1">DBD 등록번호 (선택)</label>
            <input
              name="message"
              placeholder="DBD 등록번호 및 문의 내용"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-3 px-6 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 disabled:opacity-50 transition"
          >
            {status === "sending" ? "전송 중…" : "문의 보내기"}
          </button>

          {status === "err" && (
            <p className="text-xs text-red-600 text-center">전송 실패. 잠시 후 다시 시도해주세요.</p>
          )}
        </form>
      )}
    </div>
  );
}
