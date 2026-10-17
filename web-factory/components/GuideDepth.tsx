// /guide 허브 전용 깊이 블록.
//
// 왜 (2026-10-17): GSC 에서 /guide 가 노출 4위 페이지(109회, 69위)인데 내용은 가이드
// 카드 13장 뿐이었다. 이 URL 로 들어오는 검색은 "태국에서 공장을 어떻게 찾나" 류다 —
// 그 질문에 우리 데이터로 바로 답한다: 어떤 업종이 몇 곳, 어느 도에 몰려 있나, 어떻게
// 실존 회사인지 확인하나. 숫자는 전부 master_db 에서 빌드 때 계산된다.
import type { MasterDb } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { filterByCategory } from "@/lib/data";
import { citySlugFromDisplay } from "@/lib/cityNorm";
import { FaqJsonLd } from "@/components/JsonLd";

// 업종 표에서 뺀다 — 무엇을 만드는지 답이 안 되는 묶음이다.
const NOT_SECTOR = new Set(["manufacturer", "factory", "corporate_office", "exporter", "industrial_estate"]);
const EEC = ["Chon Buri", "Rayong", "Chachoengsao"];

export function GuideDepth({ db }: { db: MasterDb }) {
  const validCities = new Set(Object.keys(db.city_counts));
  const total = db.suppliers.length;
  const verified = db.suppliers.filter((s) => s.verified).length;
  const withPhone = db.suppliers.filter((s) => s.phone).length;

  const provinces = Object.entries(db.city_counts).sort((a, b) => b[1] - a[1]);
  const eec = EEC.reduce((n, p) => n + (db.city_counts[p] ?? 0), 0);
  const topProv = provinces.slice(0, 8);

  const sectors = Object.keys(CATEGORY_LABELS)
    .filter((c) => !NOT_SECTOR.has(c))
    .map((c) => {
      const rows = filterByCategory(db.suppliers, c);
      const prov = new Map<string, number>();
      for (const s of rows) if (s.city_label && validCities.has(s.city_label)) prov.set(s.city_label, (prov.get(s.city_label) ?? 0) + 1);
      const top = [...prov.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([p]) => p);
      return { slug: c, label: CATEGORY_LABELS[c], n: rows.length, top };
    })
    .filter((x) => x.n >= 20)
    .sort((a, b) => b.n - a.n);

  const pct = (n: number) => Math.round((n / Math.max(total, 1)) * 100);

  const faqs = [
    {
      q: "How do I find a factory in Thailand?",
      a: `Start from the product, not the city: pick the industry, then narrow by province. This directory lists ${total.toLocaleString()} B2B suppliers across ${provinces.length} provinces, ${pct(withPhone)}% with a public phone number. Shortlist 5–10, check each company's DBD registration, then send the same short brief (product, annual volume, target price, timeline) to all of them.`,
    },
    {
      q: "Where are most factories in Thailand?",
      a: `Around Bangkok and on the Eastern Seaboard. In our data the top provinces are ${topProv.slice(0, 5).map(([p, n]) => `${p} (${n.toLocaleString()})`).join(", ")}. The three Eastern Economic Corridor provinces — Chonburi, Rayong and Chachoengsao — hold ${eec.toLocaleString()} of the ${total.toLocaleString()} listings (${pct(eec)}%).`,
    },
    {
      q: "How can I check that a Thai company is real?",
      a: `Every Thai company limited is registered with the Department of Business Development (DBD) under a 13-digit juristic person number. Ask for it, then look it up on the DBD DataWarehouse (datawarehouse.dbd.go.th) to see the registered name, capital, directors and filing status. ${verified.toLocaleString()} suppliers here carry a DBD check mark, meaning we matched them to a DBD record.`,
    },
    {
      q: "Do I need a sourcing agent to buy from Thailand?",
      a: "Not usually. Most export-oriented Thai manufacturers have an English-speaking sales contact and quote directly. An agent helps when you need on-site quality inspection or have no time to manage several suppliers — see the direct-sourcing guide below for the process step by step.",
    },
    ...(sectors.length >= 3
      ? [{
          q: "What industries is Thailand strongest in?",
          a: `By number of suppliers in this directory: ${sectors.slice(0, 5).map((s) => `${s.label.toLowerCase()} (${s.n.toLocaleString()})`).join(", ")}. Thailand is also known for automotive production, processed food exports and petrochemicals at Map Ta Phut.`,
        }]
      : []),
  ];

  const steps: { t: string; d: React.ReactNode }[] = [
    { t: "Pick the industry", d: <>Start from what you buy — the table below links every sector page with live supplier counts.</> },
    { t: "Narrow by province or estate", d: <>Most plants cluster around Bangkok and the Eastern Seaboard. Compare <a className="underline" href="/estate">industrial estates</a> if you need a supplier inside one.</> },
    { t: "Check the company exists", d: <>Ask for the 13-digit DBD number and look it up. Our <a className="underline" href="/trust-score">Trust Score</a> adds public review signals.</> },
    { t: "Send one brief to 5–10 suppliers", d: <>Same product spec, volume and timeline to each, so the quotes are comparable. Or post a <a className="underline" href="/quote">free request for quote</a>.</> },
    { t: "Sample, then audit", d: <>Order paid samples before a first PO; visit or hire an inspector for larger orders.</> },
  ];

  return (
    <>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">How to find a factory in Thailand</h2>
        <p className="text-sm text-[var(--muted)] mb-5 leading-relaxed">
          Five steps, based on {total.toLocaleString()} Thai B2B suppliers in {provinces.length} provinces
          ({verified.toLocaleString()} matched to a DBD company record).
        </p>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={s.t} className="flex gap-3 bg-white border border-[var(--border)] rounded-xl p-4">
              <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <div>
                <div className="font-bold">{s.t}</div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Thai suppliers by industry</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Supplier counts and the provinces where each industry is most concentrated. A company can be listed under more than one industry.
        </p>
        <div className="overflow-x-auto border border-[var(--border)] rounded-xl bg-white">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-[var(--muted)]">
              <tr>
                <th className="px-3 py-2">Industry</th>
                <th className="px-3 py-2 text-right">Suppliers</th>
                <th className="px-3 py-2">Most in</th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((s) => (
                <tr key={s.slug} className="border-t border-[var(--border)]">
                  <td className="px-3 py-2 font-medium">
                    <a href={`/c/${s.slug}`} className="hover:underline text-[var(--gold-deep)]">{s.label}</a>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{s.n.toLocaleString()}</td>
                  <td className="px-3 py-2 text-[var(--muted)]">{s.top.join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Where Thai suppliers are</h2>
        <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
          The Eastern Economic Corridor (Chonburi, Rayong, Chachoengsao) holds {pct(eec)}% of listings; Bangkok and its
          neighbouring provinces most of the rest.
        </p>
        <div className="flex flex-wrap gap-2">
          {topProv.map(([p, n]) => (
            <a key={p} href={`/city/${citySlugFromDisplay(p)}`} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-white text-sm hover:border-emerald-400">
              {p} <span className="text-[var(--muted)] tabular-nums">{n.toLocaleString()}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Common questions</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="bg-white border border-[var(--border)] rounded-lg p-4">
              <summary className="font-medium cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <FaqJsonLd faqs={faqs} />
      </section>
    </>
  );
}
