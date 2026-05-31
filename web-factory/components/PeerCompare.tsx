// Top-N peer companies in same TSIC, side-by-side table.

import type { Supplier } from "@/lib/types";

type Props = {
  me: Supplier;
  peers: Supplier[];     // 같은 TSIC, b2b_score 상위
  tsicLabel?: string;
};

function formatCap(thb: number | null | undefined): string {
  if (!thb) return "—";
  if (thb >= 1_000_000_000) return `฿${(thb / 1_000_000_000).toFixed(1)}B`;
  if (thb >= 1_000_000) return `฿${(thb / 1_000_000).toFixed(1)}M`;
  if (thb >= 1_000) return `฿${(thb / 1_000).toFixed(0)}K`;
  return `฿${thb.toFixed(0)}`;
}

export function PeerCompare({ me, peers, tsicLabel }: Props) {
  if (peers.length === 0) return null;
  const rows = [me, ...peers].slice(0, 4);

  const stats: { key: string; label: string; get: (s: Supplier) => string | number; tag?: "good" | "neutral" }[] = [
    { key: "cap",    label: "Capital (THB)",    get: (s) => formatCap(s.dbd?.capital_thb) },
    { key: "years",  label: "Years in business",get: (s) => s.years_in_business ? `${s.years_in_business}y` : "—" },
    { key: "rating", label: "Google rating",    get: (s) => s.rating > 0 ? `★ ${s.rating.toFixed(1)}` : "—" },
    { key: "reviews",label: "Total reviews",    get: (s) => (s.total_reviews || 0).toLocaleString() },
    { key: "photos", label: "Photos",           get: (s) => `${s.photos?.length || 0}` },
    { key: "estate", label: "Industrial estate",get: (s) => s.estate_name || "—" },
    { key: "halal",  label: "Halal cert.",      get: (s) => s.halal_certified ? "✓" : "—" },
  ];

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-5 overflow-x-auto">
      <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
        <h3 className="text-base font-bold text-stone-900 font-display">Peer comparison</h3>
        <span className="text-xs text-stone-500 font-mono-data">{tsicLabel}</span>
      </div>
      <p className="text-xs text-stone-500 mb-4">
        Top peers in the same TSIC industry, sorted by composite trust score.
      </p>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-amber-700">
            <th className="text-left text-xs uppercase tracking-wider font-bold text-stone-500 py-2 pr-3 w-40">Metric</th>
            {rows.map((s, i) => (
              <th key={s.id} className={`text-left py-2 px-2 text-xs font-bold ${i === 0 ? "text-amber-800 bg-amber-50" : "text-stone-700"}`}>
                <div className="text-[10px] uppercase tracking-wider mb-0.5">{i === 0 ? "This supplier" : `Peer ${i}`}</div>
                <div className="line-clamp-2 leading-tight">{s.name.slice(0, 40)}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stats.map((st, j) => (
            <tr key={st.key} className={`${j % 2 === 0 ? "bg-stone-50/50" : "bg-white"} border-b border-stone-100`}>
              <td className="py-2 pr-3 text-xs text-stone-600 font-medium">{st.label}</td>
              {rows.map((s, i) => (
                <td key={s.id} className={`py-2 px-2 font-mono-data ${i === 0 ? "bg-amber-50/60 text-amber-900 font-bold" : "text-stone-800"}`}>
                  {st.get(s)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
