"use client";

import { useState, useRef, useEffect } from "react";

const REPORT_TYPES = [
  { value: "wrong_price", label: "가격이 틀림 / Wrong price" },
  { value: "wrong_info", label: "병원 정보 오류 / Wrong hospital info" },
  { value: "not_available", label: "패키지 미운영 / Package no longer available" },
  { value: "suspicious_ad", label: "광고 의심 / Suspicious sponsored listing" },
  { value: "other", label: "기타 / Other" },
];

export function ReportButton({ pageUrl, hospitalName }: { pageUrl?: string; hospitalName?: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(REPORT_TYPES[0].value);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "err">("idle");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const selectedLabel = REPORT_TYPES.find((t) => t.value === type)?.label ?? type;
    const message = [
      `Type: ${selectedLabel}`,
      hospitalName ? `Hospital: ${hospitalName}` : null,
      note.trim() ? `Note: ${note.trim()}` : null,
    ].filter(Boolean).join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "correction",
          name: "User report",
          message,
          url: pageUrl ?? (typeof window !== "undefined" ? window.location.href : ""),
        }),
      });
      setStatus(res.ok ? "done" : "err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
        title="Report wrong data"
      >
        <span>⚑</span>
        <span>Report error</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Report an error</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">✕</button>
            </div>

            {status === "done" ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-3">✅</div>
                <p className="font-semibold text-slate-800">Thank you!</p>
                <p className="text-sm text-slate-500 mt-1">We&apos;ll review and correct this data.</p>
                <button onClick={() => { setOpen(false); setStatus("idle"); setNote(""); }}
                  className="mt-4 text-sm text-blue-600 hover:underline">Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">What&apos;s wrong?</label>
                  <div className="space-y-2">
                    {REPORT_TYPES.map((t) => (
                      <label key={t.value} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio" name="type" value={t.value}
                          checked={type === t.value}
                          onChange={() => setType(t.value)}
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900">{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Details <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={note} onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Actual price is ฿12,000 not ฿8,000"
                    rows={3}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                </div>

                {status === "err" && (
                  <p className="text-xs text-red-500">Failed to send. Please try again.</p>
                )}

                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setOpen(false)}
                    className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2 rounded-xl hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={status === "sending"}
                    className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60">
                    {status === "sending" ? "Sending…" : "Submit report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
