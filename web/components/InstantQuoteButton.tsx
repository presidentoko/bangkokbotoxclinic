"use client";
// 30-second inline quote-request form. Pops as modal from anywhere. Submits to /api/lead.

import { useState } from "react";

export default function InstantQuoteButton({
  clinicId,
  clinicName,
}: {
  clinicId: string;
  clinicName: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", service: "", note: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId, clinicName,
          name: form.name,
          email: form.email,
          service: form.service,
          notes: form.note,
        }),
      });
      if (r.ok) setSent(true);
    } catch { /* ignore */ }
    finally { setBusy(false); }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white px-5 py-3 text-sm font-black hover:opacity-90 shadow-md transition"
      >
        ⚡ Get instant quote (30s)
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 toast-fade-up" onClick={() => !sent && setOpen(false)} />
          <div role="dialog" aria-modal="true"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden toast-fade-up">
            <div className="p-6">
              {sent ? (
                <div className="text-center">
                  <div className="text-5xl mb-3">✓</div>
                  <h3 className="text-2xl font-black mb-1">Sent</h3>
                  <p className="text-sm text-[var(--muted)] mb-4">{clinicName} will email you within 4 hours.</p>
                  <button onClick={() => setOpen(false)}
                    className="rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-sm font-black">
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={() => setOpen(false)} aria-label="Close"
                    className="absolute top-3 right-3 text-[var(--muted)] hover:text-black text-lg -m-2 p-2">✕</button>
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="text-xl font-black mb-1">Quick quote from {clinicName}</h3>
                  <p className="text-xs text-[var(--muted)] mb-4">No phone needed. Reply within 4h.</p>
                  <form onSubmit={submit} className="space-y-2">
                    <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-amber-500" style={{ borderColor: "var(--border)" }} />
                    <input required type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-amber-500" style={{ borderColor: "var(--border)" }} />
                    <input placeholder="What service? (e.g. botox forehead)" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-amber-500" style={{ borderColor: "var(--border)" }} />
                    <textarea placeholder="Anything specific? (optional)" rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                      className="w-full rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-amber-500 resize-none" style={{ borderColor: "var(--border)" }} />
                    <button type="submit" disabled={busy}
                      className="w-full rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white py-3 text-base font-black hover:opacity-90 disabled:opacity-50">
                      {busy ? "Sending…" : "Send to clinic →"}
                    </button>
                    <p className="text-[10px] text-center text-[var(--muted)]">
                      We forward your email to the clinic. They reply directly to you.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
