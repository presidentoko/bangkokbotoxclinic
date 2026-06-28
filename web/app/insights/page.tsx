// /insights — Bangkok aesthetic landscape analytics. Lead magnet + SEO.
// Shows real numbers patients want: count by district, trust distribution, top procedures, language breakdown.

import { loadMasterDb } from "@/lib/data";
import { getSiteConfig, applySiteFilter } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const revalidate = 86400; // 24h ISR — Hobby ISR Writes 한도 절약

export async function generateMetadata(): Promise<Metadata> {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const count = applySiteFilter(db.clinics, cfg).length;
  return {
    title: `${count} Bangkok ${cfg.focus === "all" ? "" : cfg.focus + " "}Clinics — Market Insights & Analytics`,
    description: `Data-driven analysis of ${count} ${cfg.brand} listings: district distribution, trust score breakdown, language coverage, and pricing tiers from real Google review analysis.`,
    alternates: { canonical: "/insights" },
  };
}

export default async function InsightsPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);

  // ── District distribution (top 10) ──
  const districtMap = new Map<string, number>();
  for (const c of focused) {
    if (!c.district) continue;
    districtMap.set(c.district, (districtMap.get(c.district) ?? 0) + 1);
  }
  const topDistricts = Array.from(districtMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxDistrictCount = topDistricts[0]?.[1] ?? 1;

  // ── Trust score distribution ──
  const tsBuckets = { "90+": 0, "80-89": 0, "70-79": 0, "60-69": 0, "<60": 0 };
  for (const c of focused) {
    const t = c.trust_score;
    if (t >= 90) tsBuckets["90+"]++;
    else if (t >= 80) tsBuckets["80-89"]++;
    else if (t >= 70) tsBuckets["70-79"]++;
    else if (t >= 60) tsBuckets["60-69"]++;
    else tsBuckets["<60"]++;
  }
  const tsTotal = focused.length;

  // ── Language coverage (clinics with X language ≥10% of reviews) ──
  const langThreshold = 0.1;
  let langTh = 0, langEn = 0, langKo = 0, langJa = 0;
  for (const c of focused) {
    const total = (c.language_breakdown.th || 0) + (c.language_breakdown.en || 0) +
                  (c.language_breakdown.ko || 0) + (c.language_breakdown.ja || 0) +
                  (c.language_breakdown.other || 0);
    if (!total) continue;
    if ((c.language_breakdown.th || 0) / total >= langThreshold) langTh++;
    if ((c.language_breakdown.en || 0) / total >= langThreshold) langEn++;
    if ((c.language_breakdown.ko || 0) / total >= langThreshold) langKo++;
    if ((c.language_breakdown.ja || 0) / total >= langThreshold) langJa++;
  }

  // ── Category breakdown (for botox=aesthetic rollup, show sub-cats) ──
  const subCats = cfg.focus === "botox"
    ? ["botox", "filler", "hifu", "facial", "laser"]
    : cfg.focus === "all"
    ? ["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant"]
    : [cfg.focus];
  const subCatCounts = subCats.map((k) => ({
    key: k,
    count: focused.filter((c) => c.categories.includes(k)).length,
  })).sort((a, b) => b.count - a.count);

  // ── Top reviewed clinics ──
  const topReviewed = [...focused]
    .sort((a, b) => b.total_reviews - a.total_reviews)
    .slice(0, 5);

  // ── Average rating + total reviews ──
  const avgRating = focused.length
    ? focused.reduce((s, c) => s + (c.rating || 0), 0) / focused.filter((c) => c.rating > 0).length
    : 0;
  const totalReviews = focused.reduce((s, c) => s + c.total_reviews, 0);
  const totalScraped = focused.reduce((s, c) => s + c.scraped_review_count, 0);

  // ── Trust gem candidates (high trust, lower discovery) ──
  const gems = focused
    .filter((c) => c.trust_score >= 75 && c.total_reviews >= 30 && c.total_reviews <= 250)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Insights", url: "/insights" }]} />

      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Insights</span>
      </nav>

      <h1 className="text-4xl font-bold tracking-tight mb-3">
        Bangkok {cfg.focus === "all" ? "Clinic" : cfg.focus.charAt(0).toUpperCase() + cfg.focus.slice(1)} Market — Data Snapshot
      </h1>
      <p className="text-base text-[var(--muted)] mb-8 leading-relaxed max-w-3xl">
        Real numbers from {focused.length.toLocaleString()} verified clinics, analyzed across {totalReviews.toLocaleString()} Google reviews ({totalScraped.toLocaleString()} deep-scraped). Updated continuously.
      </p>

      {/* Top KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <KPI label="Clinics" value={focused.length.toLocaleString()} sub="verified listings" />
        <KPI label="Avg ★" value={avgRating.toFixed(2)} sub={`across ${totalReviews.toLocaleString()} reviews`} />
        <KPI label="Districts" value={districtMap.size.toString()} sub="Bangkok coverage" />
        <KPI label="High-trust" value={(tsBuckets["90+"] + tsBuckets["80-89"]).toLocaleString()} sub="score ≥80" />
      </div>

      {/* Sub-category breakdown */}
      {subCatCounts.length > 1 && (
        <Section title={`Procedure mix${cfg.focus === "botox" ? " (botox/filler/hifu/facial/laser)" : ""}`}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {subCatCounts.map((s) => (
              <div key={s.key} className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold tabular-nums">{s.count.toLocaleString()}</div>
                <div className="text-xs text-[var(--muted)] uppercase tracking-wide mt-1">{s.key}</div>
                <div className="text-[10px] text-[var(--muted)] mt-1">
                  {Math.round((s.count / focused.length) * 100)}% of total
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* District distribution chart */}
      <Section title="Where are the clinics?" subtitle="Top 10 districts by clinic count">
        <div className="space-y-2.5">
          {topDistricts.map(([dist, n]) => (
            <div key={dist} className="flex items-center gap-3">
              <a href={`/d/${encodeURIComponent(dist)}`} className="flex-1 hover:underline">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-bold text-sm">{dist}</span>
                  <span className="tabular-nums text-sm text-[var(--muted)]">
                    <strong className="text-[var(--fg)]">{n}</strong> · {Math.round((n / focused.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(n / maxDistrictCount) * 100}%`, background: cfg.themeAccent }}
                  />
                </div>
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* Trust score distribution */}
      <Section title="Trust Score distribution" subtitle="How clinics rank on our composite score">
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(tsBuckets).map(([range, count]) => {
            const pct = tsTotal ? (count / tsTotal) * 100 : 0;
            const color = range === "90+" ? "#059669" : range === "80-89" ? "#0891b2" : range === "70-79" ? "#7c3aed" : range === "60-69" ? "#d97706" : "#dc2626";
            return (
              <div key={range} className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)] mb-1">{range}</div>
                <div className="h-32 bg-slate-50 rounded-lg relative flex items-end overflow-hidden">
                  <div
                    className="w-full transition-all rounded-t-lg"
                    style={{ height: `${pct}%`, background: color, minHeight: count > 0 ? "8px" : "0" }}
                  />
                </div>
                <div className="text-base font-bold tabular-nums mt-1">{count.toLocaleString()}</div>
                <div className="text-[10px] text-[var(--muted)]">{pct.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-[var(--muted)] leading-relaxed">
          Trust Score blends rating quality, review volume, reviewer credibility (Local Guides), photo evidence, and multi-source presence. Score ≥80 = strong evidence; 70-79 = decent; &lt;60 = thin signal.
        </p>
      </Section>

      {/* Language coverage */}
      <Section title="Multilingual coverage" subtitle="Clinics with ≥10% of reviews in each language">
        <div className="grid grid-cols-4 gap-3">
          <LangCell flag="🇹🇭" label="Thai" count={langTh} total={focused.length} />
          <LangCell flag="🇬🇧" label="English" count={langEn} total={focused.length} />
          <LangCell flag="🇰🇷" label="Korean" count={langKo} total={focused.length} />
          <LangCell flag="🇯🇵" label="Japanese" count={langJa} total={focused.length} />
        </div>
      </Section>

      {/* Top reviewed */}
      <Section title="Most reviewed clinics" subtitle="Highest review counts (volume signal — popularity)">
        <ol className="space-y-2">
          {topReviewed.map((c, i) => (
            <li key={c.id}>
              <a href={`/clinic/${c.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-[var(--border)]">
                <span className="grid place-items-center h-8 w-8 rounded-full bg-slate-900 text-white text-xs font-bold shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{c.name}</div>
                  <div className="text-xs text-[var(--muted)]">{c.district || c.city_label}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold tabular-nums">★ {(c.rating || 0).toFixed(1)}</div>
                  <div className="text-[10px] text-[var(--muted)]">{c.total_reviews.toLocaleString()} reviews</div>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </Section>

      {/* Hidden gems */}
      {gems.length > 0 && (
        <Section title="Hidden gems" subtitle="High trust score (≥75) but under 250 reviews — less crowded, strong signal">
          <ol className="space-y-2">
            {gems.map((c) => (
              <li key={c.id}>
                <a href={`/clinic/${c.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 border-2 border-amber-200">
                  <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-black shrink-0">💎</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{c.name}</div>
                    <div className="text-xs text-[var(--muted)]">{c.district || c.city_label}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold tabular-nums text-amber-700">Trust {c.trust_score}</div>
                    <div className="text-[10px] text-[var(--muted)]">{c.total_reviews} reviews</div>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Methodology note */}
      <div className="mt-12 p-5 bg-blue-50 border border-blue-200 rounded-xl text-sm leading-relaxed">
        <strong className="block mb-1">How this data is gathered</strong>
        Google Maps reviews are scraped, deduplicated, and analyzed for language, rating distribution, reviewer credibility, and procedure mentions. Trust Score is a composite — not just rating average. <a href="/about" className="underline font-bold">Methodology →</a>
      </div>
    </div>
  );
}

function KPI({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4">
      <div className="text-xs text-[var(--muted)] uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold tabular-nums mt-1">{value}</div>
      <div className="text-[10px] text-[var(--muted)] mt-1">{sub}</div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold tracking-tight mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-[var(--muted)] mb-4">{subtitle}</p>}
      {children}
    </section>
  );
}

function LangCell({ flag, label, count, total }: { flag: string; label: string; count: number; total: number }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
      <div className="text-3xl mb-1">{flag}</div>
      <div className="font-bold text-sm">{label}</div>
      <div className="text-lg font-bold tabular-nums mt-1">{count.toLocaleString()}</div>
      <div className="text-[10px] text-[var(--muted)]">{pct}% of clinics</div>
    </div>
  );
}
