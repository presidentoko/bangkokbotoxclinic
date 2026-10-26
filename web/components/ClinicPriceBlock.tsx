import type { ProcedureEstimate } from "@/lib/priceEstimates";

const LABEL_TH: Record<string, string> = {
  implants: "รากฟันเทียม", veneers: "วีเนียร์", whitening: "ฟอกสีฟัน", orthodontics: "จัดฟัน", crown: "ครอบฟัน",
};

export function ClinicPriceBlock({
  estimates,
  hdmallMin,
  hdmallMax,
  lang = "en",
}: {
  estimates: ProcedureEstimate[];
  hdmallMin?: number | null;
  hdmallMax?: number | null;
  lang?: "en" | "th";
}) {
  const th = lang === "th";
  const hasHdmall = hdmallMin != null && hdmallMax != null;
  const hasEstimates = estimates.length > 0;

  if (!hasHdmall && !hasEstimates) return null;

  const fmt = (n: number) => `฿${n.toLocaleString()}`;

  return (
    <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
        💰 {th ? "ราคาโดยประมาณที่คลินิกนี้" : "Typical prices at this clinic"}
      </h2>

      {hasHdmall && (
        <div className="flex items-center justify-between py-2 border-b border-emerald-200 last:border-0">
          <span className="text-sm text-[var(--fg)]">{th ? "แพ็กเกจ" : "Packages"}</span>
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
          <span className="text-sm text-[var(--fg)]">{th ? (LABEL_TH[e.procedure] ?? e.label) : e.label}</span>
          <span className="text-sm font-medium text-emerald-900">
            {fmt(e.min)} – {fmt(e.max)}
          </span>
        </div>
      ))}

      <p className="text-xs text-emerald-700 mt-3 opacity-75">
        {th
          ? `ประมาณจากรีวิวคนไข้ ${estimates.reduce((s, e) => s + e.count, 0)} รีวิว · ไม่ใช่ราคาจากคลินิก`
          : `Estimates from ${estimates.reduce((s, e) => s + e.count, 0)} patient reviews · Not clinic quotes`}
      </p>
    </section>
  );
}
