"use client";

import { useState } from "react";
import type { Clinic, Lang } from "@/lib/types";
import { useCompare, pickCompareClinics, COMPARE_MAX } from "./CompareContext";
import Link from "next/link";

export default function CompareBar({ clinics, lang }: { clinics: Clinic[]; lang: Lang }) {
  const { ids, clear, toggle } = useCompare();
  const [open, setOpen] = useState(false);
  const selected = pickCompareClinics(clinics, ids);

  if (selected.length === 0) return null;

  return (
    <>
      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-gold-400 bg-navy-950 px-4 py-3 text-white shadow-2xl">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="hidden sm:inline-block font-display text-sm font-bold whitespace-nowrap">
              Comparing <span className="text-gold-400">{selected.length}/{COMPARE_MAX}</span>
            </span>
            <div className="flex gap-2">
              {selected.map((c) => (
                <div key={c.id} className="group flex items-center gap-1.5 rounded-full bg-white/10 pl-2 pr-1 py-1 text-xs whitespace-nowrap">
                  <span className="font-semibold max-w-[120px] truncate">{c.name}</span>
                  <button onClick={() => toggle(c.id)} aria-label="Remove"
                    className="grid h-5 w-5 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={clear} className="text-xs muted hover:text-white">Clear</button>
            <button
              onClick={() => setOpen(true)}
              disabled={selected.length < 2}
              className="rounded-xl bg-gold-500 px-4 py-2 text-sm font-bold text-navy-950 transition hover:bg-gold-400 disabled:opacity-50"
            >
              Compare →
            </button>
          </div>
        </div>
      </div>

      {/* Compare modal */}
      {open && (
        <CompareModal clinics={selected} lang={lang} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function CompareModal({ clinics, lang, onClose }: { clinics: Clinic[]; lang: Lang; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="min-h-full grid place-items-start sm:place-items-center p-4 sm:p-8">
        <div className="w-full max-w-5xl rounded-[2rem] bg-[rgb(var(--bg))] shadow-premium-lg" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "rgb(var(--border))" }}>
            <div>
              <div className="eyebrow">Side-by-side</div>
              <h2 className="mt-1 font-display text-2xl font-bold">Compare {clinics.length} clinics</h2>
            </div>
            <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-[rgb(var(--bg-elev))]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto p-5">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider muted pb-3">Spec</th>
                  {clinics.map((c) => (
                    <th key={c.id} className="px-2 pb-3 text-left">
                      {c.top_photo_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.top_photo_url} alt={c.name} className="aspect-video w-full rounded-lg object-cover mb-2"
                          loading="lazy" referrerPolicy="no-referrer" />
                      )}
                      <Link href={`/${lang}/clinic/${c.slug}/`} className="font-display text-base font-bold leading-tight hover:text-gold-600 line-clamp-2 block">
                        {c.name}
                      </Link>
                      <div className="text-xs muted mt-0.5">{c.city}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {([
                  ["Trust Score", (c: Clinic) => `${c.trust_score}/100`],
                  ["Google Rating", (c: Clinic) => c.rating ? `${c.rating.toFixed(1)} ★` : "—"],
                  ["Reviews", (c: Clinic) => String(c.review_count ?? 0)],
                  ["Photos indexed", (c: Clinic) => String(c.photos_count)],
                  ["YouTube videos", (c: Clinic) => String(c.videos_count)],
                  ["Starting price", (c: Clinic) => {
                    const p = c.bookimed_price_from;
                    return p && !["", "nan"].includes(String(p)) ? String(p) : "—";
                  }],
                  ["Bookimed listed", (c: Clinic) => c.bookimed_slug ? "✓" : "—"],
                  ["Partner", (c: Clinic) => c.is_partner ? "✓ Verified" : "—"],
                  ["EN-friendly", (c: Clinic) => c.languages.en ? "✓" : "—"],
                  ["KO-friendly", (c: Clinic) => c.languages.ko ? "✓" : "—"],
                  ["AR-friendly", (c: Clinic) => c.languages.ar ? "✓" : "—"],
                  ["Procedures", (c: Clinic) => c.procedures.length ? c.procedures.slice(0, 4).join(", ") + (c.procedures.length > 4 ? "..." : "") : "—"],
                ] as [string, (c: Clinic) => string][]).map(([label, fn]) => (
                  <tr key={label} className="border-t" style={{ borderColor: "rgb(var(--border))" }}>
                    <td className="py-2.5 pr-3 text-xs font-bold uppercase tracking-wider muted whitespace-nowrap">{label}</td>
                    {clinics.map((c) => (
                      <td key={c.id} className="px-2 py-2.5 align-top">
                        <span className="font-semibold tabular-nums">{fn(c)}</span>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t" style={{ borderColor: "rgb(var(--border))" }}>
                  <td className="py-3 pr-3"></td>
                  {clinics.map((c) => (
                    <td key={c.id} className="px-2 py-3 align-top">
                      <Link href={`/${lang}/clinic/${c.slug}/#booking`}
                        className="inline-block rounded-lg bg-navy-900 px-3 py-2 text-xs font-bold text-white dark:bg-gold-400 dark:text-navy-950">
                        Book →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
