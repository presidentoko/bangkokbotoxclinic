import type { ProcedureEstimate } from "@/lib/priceEstimates";

export function ClinicPriceBlock({
  estimates,
  hdmallMin,
  hdmallMax,
}: {
  estimates: ProcedureEstimate[];
  hdmallMin?: number | null;
  hdmallMax?: number | null;
}) {
  const hasHdmall = hdmallMin != null && hdmallMax != null;
  const hasEstimates = estimates.length > 0;

  if (!hasHdmall && !hasEstimates) return null;

  const fmt = (n: number) => `฿${n.toLocaleString()}`;

  return (
    <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
        💰 Typical prices at this clinic
      </h2>

      {hasHdmall && (
        <div className="flex items-center justify-between py-2 border-b border-emerald-200 last:border-0">
          <span className="text-sm text-[var(--fg)]">Packages</span>
          <span className="text-sm font-medium text-emerald-900">
            {fmt(hdmallMin!)} – {fmt(hdmallMax!)}
          </span>
        </div>
      )}

      {estimates.map((e) => (
        <div
          key={e.procedure}
          className="flex items-center justify-between py-2 border-b border-emerald-200 last:border-0"
        >
          <span className="text-sm text-[var(--fg)]">{e.label}</span>
          <span className="text-sm font-medium text-emerald-900">
            {fmt(e.min)} – {fmt(e.max)}
          </span>
        </div>
      ))}

      <p className="text-xs text-emerald-700 mt-3 opacity-75">
        Estimates from {estimates.reduce((s, e) => s + e.count, 0)} patient reviews · Not clinic quotes
      </p>
    </section>
  );
}
