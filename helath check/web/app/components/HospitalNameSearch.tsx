"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type SearchEntry = {
  /** Display name */
  n: string;
  /** Thai name, when the register has one */
  th: string | null;
  /** Province or city */
  p: string | null;
  href: string;
  sub: string;
  /** Accreditation label, when known */
  ha: string | null;
};

// Words that identify nothing. "Bangkok Hospital" and "hospital in Bangkok"
// should not both match every row containing either word.
const STOP = new Set([
  "hospital", "hospitals", "medical", "center", "centre", "clinic",
  "the", "and", "of", "co", "ltd", "international", "โรงพยาบาล", "รพ",
]);

function normalise(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9฀-๿\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function score(e: SearchEntry, q: string, qTokens: string[]): number {
  const name = normalise(e.n);
  const thai = e.th ? normalise(e.th) : "";
  if (name === q || thai === q) return 100;
  if (name.startsWith(q) || thai.startsWith(q)) return 90;
  // Thai has no word spacing, so substring is the only workable test.
  if (thai && thai.includes(q)) return 80;
  if (name.includes(q)) return 75;
  if (qTokens.length === 0) return 0;
  const words = name.split(" ");
  const hit = qTokens.filter((t) => words.some((w) => w.startsWith(t))).length;
  if (hit === qTokens.length) return 70;
  if (hit > 0) return 30 + hit * 8;
  const where = normalise(e.p ?? "");
  if (where && qTokens.every((t) => where.includes(t))) return 15;
  return 0;
}

export function HospitalNameSearch({ entries }: { entries: SearchEntry[] }) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const qn = normalise(q);
    if (qn.length < 2) return [];
    const qt = qn.split(" ").filter((w) => w && !STOP.has(w));
    const scored: { e: SearchEntry; s: number }[] = [];
    for (const e of entries) {
      const s = score(e, qn, qt);
      if (s > 0) scored.push({ e, s });
    }
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, 20).map((x) => x.e);
  }, [q, entries]);

  const typed = normalise(q).length >= 2;

  return (
    <div>
      <label htmlFor="hospital-q" className="sr-only">
        Hospital name
      </label>
      <input
        id="hospital-q"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
        placeholder="e.g. Bumrungrad, ศิริราช, Bangkok Hospital Phuket"
        // Deliberately large: this site's readers are mostly over 50 and this
        // box is the main way in.
        className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
      />

      <div className="mt-4" aria-live="polite">
        {typed && results.length === 0 && (
          <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-base">
            Nothing matched. Try a shorter part of the name, or the Thai spelling — the register
            lists every hospital under its Thai name.
          </p>
        )}
        {results.length > 0 && (
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {results.map((r) => (
              <li key={r.href + r.n}>
                <Link href={r.href} className="block px-4 py-3 hover:bg-blue-50">
                  <span className="block text-lg font-semibold">{r.n}</span>
                  {r.th && r.th !== r.n && (
                    <span className="block text-sm text-slate-500">{r.th}</span>
                  )}
                  <span className="mt-0.5 block text-sm text-slate-600">
                    {r.sub}
                    {r.ha ? ` · ${r.ha}` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
