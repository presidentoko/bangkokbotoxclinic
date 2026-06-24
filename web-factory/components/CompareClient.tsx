"use client";

import { useEffect, useState } from "react";
import { removeFromShortlist, clearShortlist, addToShortlist } from "@/lib/shortlist";
import { useShortlist } from "./useShortlist";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import type { CompareEntry, CompareIndex } from "@/lib/compare";

const VERIF_LABEL: Record<keyof CompareEntry["verifications"], string> = {
  dbd: "DBD",
  halal: "Halal",
  estate: "Industrial estate",
  tsic: "TSIC code",
};

function useCopyShareLink(ids: string[]) {
  const [copied, setCopied] = useState(false);
  function copy() {
    if (ids.length === 0) return;
    const url = `${window.location.origin}/compare?ids=${ids.join(",")}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return { copy, copied };
}

export function CompareClient() {
  const { items, mounted } = useShortlist();
  const [index, setIndex] = useState<CompareIndex | null>(null);
  const [failed, setFailed] = useState(false);

  // Hydrate shortlist from URL ?ids= param (shared comparison link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idsParam = params.get("ids");
    if (!idsParam) return;
    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8);
    if (ids.length === 0) return;

    fetch("/compare-index.json")
      .then((r) => r.json())
      .then((idx: CompareIndex) => {
        for (const id of ids) {
          const entry = idx[id];
          if (entry) addToShortlist({ id, name: entry.name, cityLabel: entry.cityLabel ?? "" });
        }
        // Clean the URL without reload
        const clean = window.location.pathname;
        window.history.replaceState({}, "", clean);
      })
      .catch(() => {});
  // Only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let on = true;
    fetch("/compare-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => on && setIndex(d))
      .catch(() => on && setFailed(true));
    return () => {
      on = false;
    };
  }, []);

  if (!mounted || (index === null && !failed)) {
    return <div className="h-40" aria-hidden />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center">
        <div className="text-3xl mb-2">⚖️</div>
        <h2 className="font-bold text-lg mb-1">Nothing to compare yet</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Browse suppliers and tap <span className="font-bold">＋ Add to bulk quote</span> to shortlist them,
          then compare them side by side here.
        </p>
        <a href="/" className="inline-block py-2.5 px-5 rounded-lg bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 transition">
          Browse suppliers →
        </a>
      </div>
    );
  }

  if (failed || !index) {
    return (
      <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
        Couldn&apos;t load comparison data. Please refresh the page.
      </p>
    );
  }

  const rows = items.map((it) => index[it.id]).filter((e): e is CompareEntry => Boolean(e));
  if (rows.length === 0) {
    return <p className="text-sm text-[var(--muted)]">Selected suppliers are no longer available.</p>;
  }

  const maxTrust = Math.max(...rows.map((r) => r.trust.overall));
  const maxRating = Math.max(...rows.map((r) => r.rating));
  const maxReviews = Math.max(...rows.map((r) => r.reviews));
  const best = "font-bold text-emerald-800";

  const { copy, copied } = useCopyShareLink(rows.map((r) => r.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-[var(--muted)]">Comparing {rows.length} supplier{rows.length > 1 ? "s" : ""}.</p>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={copy}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition ${
              copied
                ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                : "border-[var(--border)] bg-white hover:border-emerald-600 hover:text-emerald-700"
            }`}
          >
            {copied ? "✓ Link copied!" : "🔗 Share comparison"}
          </button>
          <a href="/quote" className="py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition">
            Request one quote →
          </a>
          <button type="button" onClick={() => clearShortlist()} className="py-1.5 px-3 rounded-lg text-xs font-bold border border-[var(--border)] bg-white hover:border-black transition">
            Clear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-stone-50 text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase tracking-wide w-32 min-w-32">
                Attribute
              </th>
              {rows.map((r) => (
                <th key={r.id} className="p-3 align-top text-left min-w-[180px] border-l border-[var(--border)]">
                  <a href={`/supplier/${r.id}`} className="font-bold hover:underline block leading-snug">{r.name}</a>
                  <button
                    type="button"
                    onClick={() => removeFromShortlist(r.id)}
                    className="mt-1 text-xs text-[var(--muted)] hover:text-red-700"
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="Trust Score">
              {rows.map((r) => (
                <Cell key={r.id}>
                  <span className={r.trust.overall === maxTrust ? best : ""}>{r.trust.overall}</span>
                  <span className="text-[var(--muted)]"> · {r.trust.tier}</span>
                </Cell>
              ))}
            </Row>
            <Row label="Rating">
              {rows.map((r) => (
                <Cell key={r.id}>
                  <span className={r.rating === maxRating && maxRating > 0 ? best : ""}>★ {r.rating.toFixed(1)}</span>
                </Cell>
              ))}
            </Row>
            <Row label="Reviews">
              {rows.map((r) => (
                <Cell key={r.id}>
                  <span className={r.reviews === maxReviews && maxReviews > 0 ? best : ""}>{r.reviews.toLocaleString()}</span>
                </Cell>
              ))}
            </Row>
            <Row label="Verification">
              {rows.map((r) => {
                const on = (Object.keys(VERIF_LABEL) as (keyof typeof VERIF_LABEL)[]).filter((k) => r.verifications[k]);
                return (
                  <Cell key={r.id}>
                    {on.length === 0 ? (
                      <span className="text-[var(--muted)]">—</span>
                    ) : (
                      <span className="flex flex-wrap gap-1">
                        {on.map((k) => (
                          <span key={k} className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-medium">
                            {VERIF_LABEL[k]}
                          </span>
                        ))}
                      </span>
                    )}
                  </Cell>
                );
              })}
            </Row>
            <Row label="Location">
              {rows.map((r) => (
                <Cell key={r.id}>
                  {r.cityLabel || "—"}
                  {r.district && <span className="text-[var(--muted)]"> · {r.district}</span>}
                </Cell>
              ))}
            </Row>
            <Row label="Categories">
              {rows.map((r) => (
                <Cell key={r.id}>
                  <span className="flex flex-wrap gap-1">
                    {r.categories.slice(0, 4).map((c) => (
                      <span key={c} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-stone-100 text-xs">
                        <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
                        {CATEGORY_LABELS[c] ?? c}
                      </span>
                    ))}
                    {r.categories.length === 0 && <span className="text-[var(--muted)]">—</span>}
                  </span>
                </Cell>
              ))}
            </Row>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-t border-[var(--border)]">
      <th className="sticky left-0 z-10 bg-stone-50 text-left p-3 font-semibold text-[var(--muted)] text-xs uppercase tracking-wide align-top">
        {label}
      </th>
      {children}
    </tr>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return <td className="p-3 align-top border-l border-[var(--border)]">{children}</td>;
}
