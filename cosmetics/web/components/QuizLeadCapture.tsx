"use client";
import { useState } from "react";

interface Props {
  skin: string;
  concern: string;
  budget: string;
  labelTh: string;
  labelEn: string;
  locale: string;
}

export function QuizLeadCapture({ skin, concern, budget, locale }: Props) {
  const isTh = locale === "th";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, skin, concern, budget }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-center text-sm text-green-700 py-4">
        {isTh ? "✓ รับข้อมูลแล้ว ขอบคุณ!" : "✓ Got it, thank you!"}
      </p>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-rose-100 bg-rose-50 p-5 text-center">
      <p className="text-sm font-medium text-rose-900 mb-3">
        {isTh
          ? "รับอัปเดตดีลสกินแคร์ก่อนใคร — ส่งตรงถึง Email"
          : "Get skincare deal alerts first — straight to your inbox"}
      </p>
      <form onSubmit={submit} className="flex gap-2 max-w-xs mx-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isTh ? "อีเมลของคุณ" : "your@email.com"}
          className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {state === "loading" ? "…" : isTh ? "รับเลย" : "Subscribe"}
        </button>
      </form>
      {state === "error" && (
        <p className="text-xs text-red-600 mt-2">{isTh ? "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง" : "Something went wrong, try again"}</p>
      )}
      <p className="text-xs text-rose-400 mt-2">
        {isTh ? "ไม่มีสแปม ยกเลิกได้ตลอด" : "No spam. Unsubscribe anytime."}
      </p>
    </div>
  );
}
