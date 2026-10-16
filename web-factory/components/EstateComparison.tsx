// /best/industrial-estates 전용 — IEAT 공식 단지 전체 비교표.
//
// 왜 (2026-10-16): GSC 에서 이 페이지가 "industrial estate in thailand"(46회 59위),
// "thailand industrial park"(40회 72위) 로 노출 2위 페이지인데, 내용은 "단지 운영사·
// 입주사 50곳 목록" 이었다. 그 검색을 한 사람이 원하는 건 단지 목록 자체 — 어느 도에
// 몇 개, 누가 운영, 얼마나 큰가. 공식 목록(IEAT)과 우리 입주사 매칭으로 전부 계산된다.
// /estate 에도 같은 목록이 있지만 구글은 이 URL 을 고르고 있어서, 여기서 답하고
// /estate 로 이어 준다.
import type { MasterDb } from "@/lib/types";
import { mergeEstates, IEAT_META } from "@/lib/ieatEstates";
import { FaqJsonLd } from "@/components/JsonLd";

const RAI_TO_HA = 0.16;

export function EstateComparison({ db }: { db: MasterDb }) {
  const all = mergeEstates(db).filter((e) => e.ieat_id > 0);
  const rows = [...all].sort((a, b) => (b.area_rai ?? -1) - (a.area_rai ?? -1));

  const byProvince = new Map<string, number>();
  for (const e of all) if (e.province) byProvince.set(e.province, (byProvince.get(e.province) ?? 0) + 1);
  const provinces = [...byProvince.entries()].sort((a, b) => b[1] - a[1]);
  const eastern = (byProvince.get("Chonburi") ?? 0) + (byProvince.get("Rayong") ?? 0) + (byProvince.get("Chachoengsao") ?? 0);

  const byOperator = new Map<string, number>();
  for (const e of all) if (e.operator) byOperator.set(e.operator, (byOperator.get(e.operator) ?? 0) + 1);
  const operators = [...byOperator.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const largest = rows.find((e) => e.area_rai);
  const withTenants = all.filter((e) => e.tenants.length > 0).length;

  const faqs = [
    {
      q: "How many industrial estates are there in Thailand?",
      a: `The Industrial Estate Authority of Thailand (IEAT) lists ${all.length} industrial estates on its official portal. ${eastern} of them are in the three Eastern Economic Corridor provinces — Chonburi, Rayong and Chachoengsao.`,
    },
    {
      q: "Which province has the most industrial estates?",
      a: provinces.length
        ? `${provinces[0][0]} (${provinces[0][1]} estates), followed by ${provinces.slice(1, 3).map(([p, n]) => `${p} (${n})`).join(" and ")}, per the IEAT list.`
        : "See the table below.",
    },
    {
      q: "Who operates the most industrial estates?",
      a: operators.length
        ? `Among the estates whose operator we could identify: ${operators.map(([o, n]) => `${o} (${n})`).join(", ")}. Many smaller estates are run by single-site developers.`
        : "See the operator column in the table below.",
    },
    ...(largest
      ? [{
          q: "What is the largest industrial estate in Thailand?",
          a: `Among estates whose area IEAT publishes, ${largest.name} is the largest at ${largest.area_rai!.toLocaleString()} rai (about ${Math.round(largest.area_rai! * RAI_TO_HA).toLocaleString()} hectares)${largest.province ? `, in ${largest.province}` : ""}.`,
        }]
      : []),
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-2">All {all.length} IEAT industrial estates compared</h2>
      <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
        The official list from the Industrial Estate Authority of Thailand, sorted by size, with the
        number of tenant companies we have mapped inside each estate ({withTenants} estates so far).
        {eastern > 0 && <> {eastern} of the {all.length} sit in the Eastern Economic Corridor (Chonburi, Rayong, Chachoengsao).</>}
      </p>

      {provinces.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {provinces.slice(0, 10).map(([p, n]) => (
            <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-white text-sm">
              {p} <span className="text-[var(--muted)] tabular-nums">{n}</span>
            </span>
          ))}
        </div>
      )}

      <div className="overflow-x-auto border border-[var(--border)] rounded-xl bg-white">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-3 py-2">Estate</th>
              <th className="px-3 py-2">Province</th>
              <th className="px-3 py-2">Operator</th>
              <th className="px-3 py-2 text-right">Area</th>
              <th className="px-3 py-2 text-right">Tenants listed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.ieat_id} className="border-t border-[var(--border)]">
                <td className="px-3 py-2 font-medium">
                  {e.slug ? <a href={`/estate/${e.slug}`} className="hover:underline text-[var(--gold-deep)]">{e.name}</a> : e.name}
                </td>
                <td className="px-3 py-2 text-[var(--muted)]">{e.province ?? "—"}</td>
                <td className="px-3 py-2 text-[var(--muted)]">{e.operator ?? "—"}</td>
                <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                  {e.area_rai ? <>{e.area_rai.toLocaleString()} rai<span className="text-[var(--muted)]"> · {Math.round(e.area_rai * RAI_TO_HA).toLocaleString()} ha</span></> : "—"}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{e.tenants.length || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--muted)] mt-2">
        Source: {IEAT_META.source}, fetched {IEAT_META.fetchedAt.slice(0, 10)}. 1 rai = 1,600 m². Full estate
        profiles and tenant lists: <a href="/estate" className="underline">/estate</a>.
      </p>

      <div className="mt-8 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="bg-white border border-[var(--border)] rounded-lg p-4">
            <summary className="font-medium cursor-pointer">{f.q}</summary>
            <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
      <FaqJsonLd faqs={faqs} />
    </section>
  );
}
