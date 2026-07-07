"use client";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import type { Clinic, Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import ClinicCard from "./ClinicCard";
import ViralFilterToggle from "./ViralFilterToggle";
import SpotlightCard from "./SpotlightCard";
import CityRow from "./CityRow";
import { isPaidPartner } from "@/lib/partnerCheck";

type SortKey = "trust" | "reviews" | "rating";

const fuseIndex = (clinics: Clinic[]) =>
  new Fuse(clinics, {
    keys: [
      { name: "name", weight: 3 },
      { name: "city", weight: 2 },
      { name: "procedures", weight: 2 },
      { name: "category", weight: 1 },
      { name: "address", weight: 0.5 },
    ],
    threshold: 0.35,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });

export default function DirectoryClient({ clinics, lang }: { clinics: Clinic[]; lang: Lang }) {
  const [query, setQuery] = useState("");
  const [filterViral, setFilterViral] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("trust");
  const [procFilter, setProcFilter] = useState<string>("");
  const [cityFilter, setCityFilter] = useState<string>("");

  const allProcs = useMemo(() => {
    const set = new Set<string>();
    for (const c of clinics) c.procedures.forEach((p) => set.add(p));
    return Array.from(set).sort();
  }, [clinics]);

  const cityCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of clinics) {
      if (!c.city || c.city === "nan") continue;
      if (c.is_suspected_viral && filterViral) continue;
      map.set(c.city, (map.get(c.city) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [clinics, filterViral]);

  const suspectedCount = useMemo(() => clinics.filter((c) => c.is_suspected_viral).length, [clinics]);

  // Filtered pool (city/proc/viral filters only — no search, no sort)
  const pool = useMemo(() => clinics.filter((c) => {
    if (filterViral && c.is_suspected_viral) return false;
    if (procFilter && !c.procedures.includes(procFilter)) return false;
    if (cityFilter && c.city !== cityFilter) return false;
    return true;
  }), [clinics, filterViral, procFilter, cityFilter]);

  // Fuse index on pool — rebuilds only when pool changes (not on query/sort changes)
  const poolFuse = useMemo(() => fuseIndex(pool), [pool]);

  const filtered = useMemo(() => {
    const q = query.trim();
    const list: Clinic[] = q
      ? poolFuse.search(q).map((r) => r.item)
      : [...pool];
    list.sort((a, b) => {
      const aP = isPaidPartner(a), bP = isPaidPartner(b);
      if (aP !== bP) return aP ? -1 : 1;
      if (sortKey === "reviews") return (b.review_count || 0) - (a.review_count || 0);
      if (sortKey === "rating") return (b.rating || 0) - (a.rating || 0);
      return b.trust_score - a.trust_score;
    });
    return list;
  }, [pool, poolFuse, query, sortKey]);

  // Spotlight = first result (partner or top trust)
  const spotlight = filtered[0];
  const rest = filtered.slice(1);

  // Use city-row layout when no specific city/proc/query filter is applied
  const showCityRows = !cityFilter && !procFilter && !query.trim();

  // Group rest by city for row mode
  const byCity = useMemo(() => {
    const map = new Map<string, Clinic[]>();
    for (const c of rest) {
      if (!c.city || c.city === "nan") continue;
      const arr = map.get(c.city) || [];
      arr.push(c);
      map.set(c.city, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [rest]);
  return (
    <div className="space-y-8">
      {/* City chips strip */}
      <div className="-mx-4 overflow-x-auto px-4 pb-1">
        <div className="flex gap-2">
          <button
            onClick={() => setCityFilter("")}
            className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
              cityFilter === ""
                ? "border-navy-900 bg-navy-900 text-white dark:border-gold-400 dark:bg-gold-400 dark:text-navy-950"
                : "border-[rgb(var(--border))] bg-[rgb(var(--bg-elev))] hover:border-[rgb(var(--accent))]"
            }`}
          >
            All cities <span className="ml-1 opacity-70 tabular-nums">· {clinics.filter((c) => !filterViral || !c.is_suspected_viral).length}</span>
          </button>
          {cityCounts.map(([city, count]) => (
            <button
              key={city}
              onClick={() => setCityFilter(cityFilter === city ? "" : city)}
              className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
                cityFilter === city
                  ? "border-navy-900 bg-navy-900 text-white dark:border-gold-400 dark:bg-gold-400 dark:text-navy-950"
                  : "border-[rgb(var(--border))] bg-[rgb(var(--bg-elev))] hover:border-[rgb(var(--accent))]"
              }`}
            >
              {city} <span className="ml-1 opacity-70 tabular-nums">· {count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search + filters bar */}
      <div className="sticky top-16 z-20 -mx-4 px-4 py-3 backdrop-blur-md"
        style={{ background: "rgb(var(--bg) / 0.85)", borderBottom: "1px solid rgb(var(--border) / 0.4)" }}>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_ph", lang)}
              className="w-full rounded-xl border bg-[rgb(var(--bg-elev))] py-2.5 pl-9 pr-3 text-sm font-medium placeholder:text-[rgb(var(--muted))] focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/20 dark:focus:border-gold-400 dark:focus:ring-gold-400/20"
              style={{ borderColor: "rgb(var(--border))" }}
            />
          </div>
          <select
            value={procFilter}
            onChange={(e) => setProcFilter(e.target.value)}
            className="rounded-xl border bg-[rgb(var(--bg-elev))] px-3 py-2.5 text-sm font-medium"
            style={{ borderColor: "rgb(var(--border))" }}
            aria-label="Procedure"
          >
            <option value="">All procedures</option>
            {allProcs.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-xl border bg-[rgb(var(--bg-elev))] px-3 py-2.5 text-sm font-medium"
            style={{ borderColor: "rgb(var(--border))" }}
            aria-label={t("sort_by", lang)}
          >
            <option value="trust">Sort: Trust ↓</option>
            <option value="reviews">Sort: Reviews ↓</option>
            <option value="rating">Sort: Rating ↓</option>
          </select>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <ViralFilterToggle on={filterViral} onChange={setFilterViral} lang={lang} hiddenCount={suspectedCount} />
          <span className="ml-auto text-xs font-bold tabular-nums muted">
            {filtered.length} of {clinics.length} clinics
          </span>
        </div>
      </div>

      {/* Result */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-16 text-center" style={{ borderColor: "rgb(var(--border))" }}>
          <p className="text-base font-semibold">No clinics match your filters</p>
          <p className="mt-1 text-sm muted">Try clearing the city or procedure filter.</p>
        </div>
      ) : (
        <>
          {/* Spotlight #1 */}
          {spotlight && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-gold-700 dark:text-gold-400">
                  #1 in {cityFilter || "Thailand"}
                </span>
                <span className="h-px flex-1 bg-[rgb(var(--border))]" />
              </div>
              <SpotlightCard c={spotlight} lang={lang} />
            </div>
          )}

          {/* Rest — city rows OR flat grid based on filter state */}
          {rest.length > 0 && (
            showCityRows ? (
              <div className="space-y-12">
                {byCity.map(([city, list]) => (
                  <CityRow
                    key={city}
                    city={city}
                    clinics={list}
                    lang={lang}
                    onSeeAll={() => {
                      setCityFilter(city);
                      window.scrollTo({ top: window.scrollY - 100, behavior: "smooth" });
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="font-display text-xs font-bold uppercase tracking-[0.2em] muted">
                    {rest.length} more verified
                  </span>
                  <span className="h-px flex-1 bg-[rgb(var(--border))]" />
                </div>
                {/* Varied grid — chunks of 6, then break with interstitial */}
                {(() => {
                  const chunks: typeof rest[] = [];
                  for (let i = 0; i < rest.length; i += 6) chunks.push(rest.slice(i, i + 6));
                  return chunks.map((chunk, idx) => (
                    <div key={idx} className="space-y-6">
                      {/* Alternate layout: mosaic (1 big + 5 small) vs standard 3-col */}
                      {idx % 3 === 0 && chunk.length >= 3 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
                          <div className="lg:row-span-2"><ClinicCard c={chunk[0]} lang={lang} /></div>
                          {chunk.slice(1).map((c) => <ClinicCard key={c.id} c={c} lang={lang} />)}
                        </div>
                      ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                          {chunk.map((c) => <ClinicCard key={c.id} c={c} lang={lang} />)}
                        </div>
                      )}
                      {/* Interstitial banner — every 2 chunks (12 clinics) */}
                      {idx > 0 && idx % 2 === 1 && idx < chunks.length - 1 && (
                        <Interstitial idx={idx} totalShown={(idx + 1) * 6} totalAll={rest.length} lang={lang} />
                      )}
                    </div>
                  ));
                })()}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}

/** Visual break between clinic chunks — cycles 4 variants for variety. */
function Interstitial({ idx, totalShown, totalAll, lang }: { idx: number; totalShown: number; totalAll: number; lang: Lang }) {
  const variant = idx % 4;
  if (variant === 1) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-2 border-emerald-200 dark:border-emerald-800 p-6 sm:p-8 text-center">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">💬 Found a clinic that interests you?</div>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tighter-display">Get a personal quote in 24h</h3>
        <p className="mt-1 text-sm muted">No call, no pressure. Just an honest comparison via LINE.</p>
        <a href="https://line.me/R/ti/p/@405zhjqb" target="_blank" rel="noopener noreferrer"
          className="mt-4 inline-block rounded-full bg-emerald-600 text-white px-6 py-2.5 text-sm font-black hover:bg-emerald-700">
          Chat on LINE →
        </a>
      </div>
    );
  }
  if (variant === 3) {
    return (
      <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 p-5 grid sm:grid-cols-[auto_1fr_auto] gap-4 items-center">
        <span className="text-4xl">📊</span>
        <div>
          <div className="font-display text-base font-bold tracking-tighter-display">
            {totalShown} of {totalAll} clinics shown so far
          </div>
          <p className="text-xs muted mt-0.5">Keep scrolling, or jump to <a href={`/${lang}/guide/hair-transplant-cost-bangkok`} className="underline font-bold">cost guide</a> for market data.</p>
        </div>
        <a href={`/${lang}/guide/hair-transplant-cost-bangkok`} className="rounded-lg bg-amber-600 text-white text-xs font-black px-4 py-2 hover:bg-amber-700 whitespace-nowrap">
          See cost guide →
        </a>
      </div>
    );
  }
  // default: subtle divider with copy
  return (
    <div className="flex items-center gap-3 py-2 text-xs">
      <span className="h-px flex-1 bg-[rgb(var(--border))]" />
      <span className="font-display font-bold uppercase tracking-[0.2em] muted">
        {variant === 0 ? "More verified clinics ↓" : "Keep exploring"}
      </span>
      <span className="h-px flex-1 bg-[rgb(var(--border))]" />
    </div>
  );
}
