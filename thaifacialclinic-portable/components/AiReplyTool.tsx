"use client";

import { useState } from "react";
import type { ClinicReview } from "@/lib/types";
import { useToast } from "./Toast";

type Props = {
  clinicId: string;
  clinicName: string;
  accessToken: string | null;
  reviews: ClinicReview[];
  initialDoneHashes: string[];
};

// Mirror of lib/dashboardStore.reviewHash — client-side hash so we can mark done without server round-trip first.
function reviewHash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

const STYLES = [
  { v: 0, label: "Formal" },
  { v: 1, label: "Warm" },
  { v: 2, label: "Brief" },
] as const;

export default function AiReplyTool({ clinicId, clinicName, accessToken, reviews, initialDoneHashes }: Props) {
  const [done, setDone] = useState<Set<string>>(new Set(initialDoneHashes));
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ hash: string; text: string; style: number; source: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState<0 | 1 | 2>(1);
  const [error, setError] = useState("");
  const toast = useToast();

  // Show negative + unrated reviews first (those most in need of a reply)
  const sorted = [...reviews].sort((a, b) => {
    const ra = a.rating ?? 5;
    const rb = b.rating ?? 5;
    return ra - rb;
  });

  async function generate(review: ClinicReview, hash: string) {
    setLoading(true);
    setError("");
    setDraft(null);
    try {
      const r = await fetch("/api/ai/reply/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinic_id: clinicId,
          access_token: accessToken,
          review_text: review.text,
          clinic_name: clinicName,
          author_name: review.reviewer,
          style,
        }),
      });
      const j = await r.json() as { ok: boolean; draft?: string; source?: string; error?: string };
      if (!j.ok) {
        setError(j.error || "failed");
        return;
      }
      setDraft({ hash, text: j.draft || "", style, source: j.source || "?" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "network");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.push("success", "Reply copied to clipboard");
    } catch {
      toast.push("error", "Copy failed — select text manually");
    }
  }

  async function toggleDone(hash: string) {
    const next = new Set(done);
    const isDone = next.has(hash);
    if (isDone) next.delete(hash); else next.add(hash);
    setDone(next);
    toast.push("success", isDone ? "Marked undone" : "Reply marked done");
    try {
      await fetch("/api/owner/reply-done/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinic_id: clinicId, access_token: accessToken, review_hash: hash, done: !isDone }),
      });
    } catch { /* optimistic */ }
  }

  const pending = sorted.filter((r) => !done.has(reviewHash(r.text))).length;

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b p-5" style={{ borderColor: "rgb(var(--border))" }}>
        <div>
          <div className="eyebrow">AI reply tool</div>
          <h2 className="mt-1 font-display text-2xl font-bold">{pending} unanswered review{pending === 1 ? "" : "s"}</h2>
          <p className="text-xs muted mt-1">Click any review → Claude drafts a reply → copy + paste to Google Maps. Sorted negative-first.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="muted">Style:</span>
          {STYLES.map((s) => (
            <button key={s.v} onClick={() => setStyle(s.v as 0 | 1 | 2)}
              className={`rounded-full px-3 py-1 font-bold transition ${style === s.v ? "bg-navy-900 text-white dark:bg-gold-400 dark:text-navy-950" : "bg-[rgb(var(--bg))] muted"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="p-10 text-center text-sm muted">No reviews scraped for this clinic yet.</p>
      ) : (
        <ul className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
          {sorted.map((r, i) => {
            const hash = reviewHash(r.text);
            const isDone = done.has(hash);
            const isOpen = openId === hash;
            const isNegative = (r.rating ?? 5) <= 3;
            return (
              <li key={i} className={isDone ? "opacity-50" : ""}>
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded bg-[rgb(var(--bg))] px-1.5 py-0.5 font-bold uppercase">{r.source}</span>
                      {r.reviewer && <span className="font-semibold">{r.reviewer}</span>}
                      {r.rating !== null && (
                        <span className={`font-bold tabular-nums ${isNegative ? "text-red-600" : "text-gold-600"}`}>
                          {"★".repeat(Math.round(r.rating))}
                        </span>
                      )}
                      {isNegative && !isDone && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">Reply needed</span>}
                      {isDone && <span className="rounded-full bg-mint-100 px-2 py-0.5 text-[10px] font-bold uppercase text-mint-700">Done</span>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggleDone(hash)}
                        className="text-[11px] font-bold underline muted hover:text-[rgb(var(--fg))]">
                        {isDone ? "Mark undone" : "Mark done"}
                      </button>
                      <button onClick={() => { setOpenId(isOpen ? null : hash); setDraft(null); }}
                        className="rounded-lg bg-navy-900 px-3 py-1.5 text-[11px] font-bold text-white dark:bg-gold-400 dark:text-navy-950">
                        {isOpen ? "Close" : "Draft reply →"}
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed">"{r.text}"</p>

                  {isOpen && (
                    <div className="mt-4 rounded-xl border bg-[rgb(var(--bg))] p-4" style={{ borderColor: "rgb(var(--border))" }}>
                      {!draft ? (
                        <div>
                          <button onClick={() => generate(r, hash)} disabled={loading}
                            className="btn-primary disabled:opacity-50">
                            {loading ? "Drafting with Claude…" : `Draft ${STYLES[style].label} reply`}
                          </button>
                          {error && <p className="mt-2 text-xs text-red-600">Error: {error}</p>}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                            <span className="rounded bg-clinic/10 px-2 py-0.5 text-clinic">{STYLES[draft.style].label}</span>
                            <span className="muted">source: {draft.source}</span>
                          </div>
                          <textarea value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                            rows={5}
                            className="w-full rounded-lg border bg-[rgb(var(--bg-elev))] p-3 text-sm leading-relaxed"
                            style={{ borderColor: "rgb(var(--border))" }}
                          />
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => copy(draft.text)} className="btn-primary !text-xs !py-2">
                              📋 Copy reply
                            </button>
                            <button onClick={() => generate(r, hash)} disabled={loading} className="btn-ghost !text-xs !py-2">
                              {loading ? "…" : "Regenerate"}
                            </button>
                            <button onClick={() => { toggleDone(hash); setOpenId(null); }}
                              className="rounded-xl bg-mint-600 px-4 py-2 text-xs font-bold text-white">
                              ✓ Done, posted
                            </button>
                          </div>
                          <p className="text-[10px] muted">Paste this on Google Maps as the official clinic response. Edits welcome — Claude isn't perfect.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
