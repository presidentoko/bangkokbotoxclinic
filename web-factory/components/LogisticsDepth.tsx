// /c/logistics 전용 깊이 블록.
//
// 왜 이 페이지만 따로 손보는가 (2026-10-02): "3pl provider thailand" 는 Search
// Console 에서 보이는 쿼리 중 노출 1위다 — 태국 국내에서 166회, 약 60위. 60위는
// 6페이지라 제목을 어떻게 고쳐도 클릭이 0이다. 순위를 올리려면 이 페이지가 그
// 질문의 더 나은 답이어야 하고, 지금은 "물류회사 428곳 목록"뿐이다.
//
// 바이어가 3PL 을 고를 때 실제로 묻는 건 "어떤 종류의 업체가 몇 곳 있고, 내 화물이
// 지나는 지역에 있나" 다. 둘 다 우리 데이터로 계산할 수 있다 — 추측으로 쓴 문장이
// 아니라 집계다.
import type { Supplier } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { cityCategoryPairs } from "@/lib/cityCategory";
import type { MasterDb } from "@/lib/types";

// raw_categories(구글이 매긴 원문 태그) → 바이어가 쓰는 서비스 구분.
// 한 업체가 여러 태그를 달고 있으면 여러 그룹에 든다 — 실제로 겸업이 많다.
const SERVICE_GROUPS: { label: string; blurb: string; keys: string[] }[] = [
  {
    label: "Freight forwarding & customs",
    blurb: "Books ocean or air space, prepares the export paperwork, and clears customs. The right first call if you are shipping rather than storing.",
    keys: ["freight forwarding", "customs broker", "shipping company", "shipping service", "shipping and mailing", "import export"],
  },
  {
    label: "Contract warehousing & distribution",
    blurb: "Holds stock and picks orders on your behalf, usually per pallet position per month plus handling. This is what most buyers mean by 3PL.",
    keys: ["warehouse", "distribution service", "storage", "fulfillment"],
  },
  {
    label: "Trucking & transport",
    blurb: "Moves containers and loose cargo between plant, port and warehouse. Rates are quoted per trip and depend on the lane, not the weight alone.",
    keys: ["transportation service", "trucking", "moving company", "container service"],
  },
  {
    label: "Courier & last mile",
    blurb: "Parcel-scale delivery inside Thailand. Useful for samples and spare parts, not for container freight.",
    keys: ["courier service", "delivery service", "logistics service"],
  },
];

export function LogisticsDepth({ db, suppliers }: { db: MasterDb; suppliers: Supplier[] }) {
  const counts = SERVICE_GROUPS.map((g) => {
    const n = suppliers.filter((s) =>
      (s.raw_categories || []).some((c) => g.keys.some((k) => c.toLowerCase().includes(k))),
    ).length;
    return { ...g, n };
  }).filter((g) => g.n > 0);

  // 도별 — 전용 페이지가 있는 곳만 링크한다 (없는 URL 로 보내지 않는다).
  const provincePages = new Set(
    cityCategoryPairs(db).filter((p) => p.category === "logistics").map((p) => p.citySlug),
  );
  const byProvince = new Map<string, { slug: string; n: number }>();
  for (const s of suppliers) {
    if (!s.city_label || !s.city) continue;
    const e = byProvince.get(s.city_label) ?? { slug: s.city, n: 0 };
    e.n++;
    byProvince.set(s.city_label, e);
  }
  const provinces = [...byProvince.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 10);

  return (
    <>
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-1">What kind of provider do you actually need?</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          &quot;3PL&quot; covers four different businesses in Thailand. Counts below are from the{" "}
          {suppliers.length.toLocaleString()} logistics operators in this directory; many hold more
          than one service tag, so the groups overlap.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {counts.map((g) => (
            <div key={g.label} className="bg-white border border-[var(--border)] rounded-xl p-4">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h3 className="font-bold">{g.label}</h3>
                <span className="text-sm tabular-nums text-[var(--muted)]">{g.n.toLocaleString()}</span>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{g.blurb}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--muted)] mt-3 leading-relaxed">
          Related: <a className="underline" href="/c/warehouse">warehouses and distribution centers</a>{" "}
          for space without the service layer, and{" "}
          <a className="underline" href="/oem/cold-storage">cold storage</a> for temperature-controlled cargo.
        </p>
      </section>

      {provinces.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-1">Coverage by province</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Where the operators are. Chon Buri and Samut Prakan dominate because of Laem Chabang port
            and Suvarnabhumi air cargo respectively.
          </p>
          <div className="flex flex-wrap gap-2">
            {provinces.map(([label, { slug, n }]) => {
              const href = provincePages.has(slug) ? `/city/${slug}/logistics` : `/city/${slug}`;
              return (
                <a
                  key={label}
                  href={href}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--gold)] hover:bg-[var(--gold-bg)] transition"
                >
                  {CATEGORY_LABELS.logistics} {label}
                  <span className="text-[var(--muted)] tabular-nums">{n}</span>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
