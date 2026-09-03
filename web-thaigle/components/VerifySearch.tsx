"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VERDICT_FROM_SHORT, VERDICT_META } from "@/lib/verdict";
import type { VerdictCode } from "@/lib/verdict";

type Entry = {
  id: string;
  name: string;
  district?: string;
  city_label?: string;
  rating: number;
  trust_score: number;
  t: string;
  v: string;
  n: number;
};

const TYPE_LABEL: Record<string, string> = {
  r: "Restaurant",
  spa: "Spa & massage",
  "yoga-pilates": "Yoga / Pilates",
  "muay-thai": "Muay Thai gym",
  cooking: "Cooking class",
  diving: "Dive centre",
  coworking: "Coworking",
  wellness: "Wellness",
};

const CHIP: Record<VerdictCode, string> = {
  "worth-it": "bg-green-600 text-white",
  solid: "bg-teal-600 text-white",
  mixed: "bg-amber-500 text-white",
  overhyped: "bg-amber-500 text-white",
  "trap-risk": "bg-red-600 text-white",
  "too-new": "bg-gray-500 text-white",
  closed: "bg-gray-700 text-white",
};

// Words that carry no identity — a TikTok caption says "this cafe in
// Bangkok" and none of those three words should decide the match.
const STOP = new Set([
  "the", "a", "an", "at", "in", "of", "and", "restaurant", "cafe", "café", "bar",
  "bangkok", "pattaya", "thailand", "thai", "shop", "co", "ltd", "by",
]);

function normalise(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’'"“”().,!?:;/\\|\-–—_+*&@#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s: string): string[] {
  return normalise(s).split(" ").filter((w) => w && !STOP.has(w));
}

function score(e: Entry, q: string, qTokens: string[], nameNorm: string): number {
  if (!q) return 0;
  if (nameNorm === q) return 100;
  if (nameNorm.startsWith(q)) return 92;
  // Thai (or any unspaced script) — substring is the only sensible test.
  if (nameNorm.includes(q)) return 75;
  if (qTokens.length === 0) return 0;
  const nameTokens = nameNorm.split(" ");
  let hit = 0;
  for (const t of qTokens) {
    if (nameTokens.some((nt) => nt.startsWith(t))) hit++;
  }
  if (hit === qTokens.length) return 80 - Math.min(10, nameTokens.length - hit);
  if (hit > 0 && hit >= Math.ceil(qTokens.length * 0.6)) return 40 + hit * 5;
  const area = normalise(`${e.district ?? ""} ${e.city_label ?? ""}`);
  if (area && qTokens.every((t) => area.includes(t))) return 20;
  return 0;
}

export function VerifySearch({ indexUrl = "/search-index.json" }: { indexUrl?: string }) {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const started = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function load() {
    if (started.current) return;
    started.current = true;
    setLoading(true);
    fetch(indexUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => {
        if (Array.isArray(d)) setIndex(d as Entry[]);
        else setFailed(true);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (initial) load();
    else inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-normalised names, computed once per index load rather than on every
  // keystroke across ~7,000 rows.
  const prepared = useMemo(
    () => (index ?? []).map((e) => ({ e, nameNorm: normalise(e.name) })),
    [index],
  );

  const results = useMemo(() => {
    const qn = normalise(q);
    if (qn.length < 2) return [];
    const qt = tokens(q);
    const scored: { e: Entry; s: number }[] = [];
    for (const { e, nameNorm } of prepared) {
      const s = score(e, qn, qt, nameNorm);
      if (s > 0) scored.push({ e, s });
    }
    scored.sort((a, b) => b.s - a.s || b.e.n - a.e.n);
    return scored.slice(0, 12).map((x) => x.e);
  }, [q, prepared]);

  const typed = normalise(q).length >= 2;

  return (
    <div>
      <form
        action="/verify"
        method="get"
        onSubmit={(ev) => {
          ev.preventDefault();
          load();
        }}
        className="relative"
      >
        <label htmlFor="verify-q" className="sr-only">Place name</label>
        <input
          id="verify-q"
          ref={inputRef}
          name="q"
          value={q}
          onChange={(ev) => {
            setQ(ev.target.value);
            load();
          }}
          onFocus={load}
          autoComplete="off"
          placeholder="Type the name from the video — e.g. Jay Fai, Yunomori, Sarnies"
          className="w-full px-5 py-4 rounded-2xl border-2 border-orange-300 bg-white text-base md:text-lg focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700"
        >
          Verify
        </button>
      </form>

      <div className="mt-4" aria-live="polite">
        {loading && typed && (
          <p className="text-sm text-[var(--muted)]">Loading the index…</p>
        )}
        {failed && (
          <p className="text-sm text-red-700">
            The search index could not be loaded. Try again, or browse{" "}
            <a href="/restaurants" className="underline">restaurants</a> and{" "}
            <a href="/activities" className="underline">activities</a>.
          </p>
        )}
        {typed && index && results.length === 0 && !loading && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm">
            <div className="font-bold mb-1">Not in our database — and that is itself a signal.</div>
            <p className="text-[var(--muted)] mb-2">
              We index every Bangkok and Pattaya restaurant with a real Google footprint plus {Object.keys(TYPE_LABEL).length - 1} activity
              categories across Thailand. A venue that is all over your feed but absent here is usually
              very new, renamed, or not a public business at all. Try a shorter part of the name, or the Thai name.
            </p>
            <a
              href={`/contact?subject=${encodeURIComponent(`Verify: ${q}`)}`}
              className="inline-block px-3 py-1.5 rounded-full bg-white border border-amber-400 font-bold text-amber-900 hover:bg-amber-100"
            >
              Ask us to check it →
            </a>
          </div>
        )}
        {results.length > 0 && (
          <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
            {results.map((r) => {
              const code = VERDICT_FROM_SHORT[r.v] ?? "mixed";
              const meta = VERDICT_META[code];
              return (
                <li key={r.id}>
                  <a href={`/${r.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition">
                    <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${CHIP[code]}`}>
                      <span aria-hidden>{meta.emoji}</span> {meta.short}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold truncate">{r.name}</span>
                      <span className="block text-xs text-[var(--muted)] truncate">
                        {TYPE_LABEL[r.t] ?? r.t}
                        {r.district ? ` · ${r.district}` : ""}
                        {r.city_label ? `, ${r.city_label}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-xs text-[var(--muted)] tabular-nums">
                      <span className="block font-bold text-[var(--fg)]">★ {r.rating.toFixed(1)}</span>
                      <span>{r.n.toLocaleString()} reviews</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
