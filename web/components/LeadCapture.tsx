"use client";
// Lead capture form — 사용자 이메일/메시지 → /api/lead 로 POST.
// 클리닉 상세 페이지 + 카테고리 페이지에 inline 으로.

import { useState } from "react";

export function LeadCapture({
  clinicName,
  service,
  context,
}: {
  clinicName?: string;
  service?: string;
  context: string;  // 예: "clinic_detail", "category_botox"
}) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");

  const heading = clinicName
    ? `Get a quote from ${clinicName}`
    : service
    ? `Find the right ${service} clinic for you`
    : "Get personalised clinic recommendations";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: msg, clinicName, service, context }),
      });
      if (res.ok) setStatus("ok");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="my-6 border border-green-200 rounded-xl p-5 bg-green-50">
        <p className="text-sm font-medium text-green-900">
          Thanks — we&apos;ll reach out within 24 hours with your tailored options.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="my-6 border border-[var(--border)] rounded-xl p-5 bg-white">
      <h3 className="font-semibold text-base mb-1">{heading}</h3>
      <p className="text-sm text-[var(--muted)] mb-3">
        Free, no obligation. We&apos;ll match you with verified clinics based on your needs.
      </p>
      <div className="flex flex-col gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
        />
        <textarea
          placeholder="What service are you considering? (optional)"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={2}
          className="border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] resize-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-black text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
        >
          {status === "submitting" ? "Sending..." : "Get quote"}
        </button>
        {status === "error" && (
          <p className="text-xs text-red-700">Something went wrong. Try again or use the direct contact buttons.</p>
        )}
      </div>
    </form>
  );
}
