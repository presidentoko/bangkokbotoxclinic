"use client";
// "Share your story" UGC capture. Posts to /api/lead with source="testimonial".

import { useState } from "react";

export default function TestimonialSubmitForm({ clinicName }: { clinicName?: string }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", country: "", procedure: "", story: "", rating: 5 });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicName: clinicName || "(community submission)",
          name: f.name,
          email: "noreply@bkkclinics.com",
          service: f.procedure,
          notes: `★${f.rating} from ${f.country}: ${f.story}`,
          _source: "testimonial",
        }),
      });
      setSent(true);
    } catch { /* ignore */ }
    finally { setBusy(false); }
  }

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">Community</div>
          <h3 className="text-base font-black mt-0.5">Share your story{clinicName ? ` about ${clinicName}` : ""}</h3>
        </div>
        {!open && !sent && (
          <button onClick={() => setOpen(true)}
            className="rounded-lg bg-slate-900 text-white px-4 py-2 text-xs font-bold hover:bg-black">
            ✍ Share
          </button>
        )}
      </div>

      {sent ? (
        <p className="text-sm text-emerald-700 font-bold">✓ Thanks — we review submissions weekly. Helpful ones get published.</p>
      ) : open ? (
        <form onSubmit={submit} className="space-y-2">
          <div className="grid sm:grid-cols-2 gap-2">
            <input required placeholder="Your first name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })}
              className="rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" style={{ borderColor: "rgb(var(--border))" }} />
            <input placeholder="Country" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })}
              className="rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" style={{ borderColor: "rgb(var(--border))" }} />
          </div>
          <input placeholder="Procedure (e.g. FUE 2,500 grafts)" value={f.procedure} onChange={(e) => setF({ ...f, procedure: e.target.value })}
            className="w-full rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" style={{ borderColor: "rgb(var(--border))" }} />
          <textarea required rows={4} placeholder="What happened? What worked, what didn't. Honest helps others." value={f.story} onChange={(e) => setF({ ...f, story: e.target.value })}
            className="w-full rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 resize-none" style={{ borderColor: "rgb(var(--border))" }} />
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1 items-center text-sm">
              <span className="text-[rgb(var(--muted))] text-xs mr-1">Rating:</span>
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => setF({ ...f, rating: n })}
                  className={n <= f.rating ? "text-yellow-500" : "text-slate-300"}>★</button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setOpen(false)} className="text-xs text-[rgb(var(--muted))]">Cancel</button>
              <button type="submit" disabled={busy}
                className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-xs font-black hover:bg-emerald-700 disabled:opacity-50">
                {busy ? "…" : "Submit story"}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-[rgb(var(--muted))] mt-1">We publish helpful stories anonymously. We never share email.</p>
        </form>
      ) : (
        <p className="text-sm text-[rgb(var(--muted))]">
          Your honest experience helps future patients. We anonymize and publish weekly.
        </p>
      )}
    </section>
  );
}
