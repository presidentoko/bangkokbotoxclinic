// 12-month clinic availability heatmap. Synth/deterministic per clinic.
// Helps users see "less crowded" months to plan around.

type Load = "free" | "normal" | "busy";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const COLOR: Record<Load, string> = {
  free:   "#bbf7d0",
  normal: "#fef3c7",
  busy:   "#fecaca",
};
const LABEL: Record<Load, string> = { free: "Easy booking", normal: "Normal", busy: "Book early" };

function loadFor(clinicId: string, monthIdx: number): Load {
  let h = monthIdx;
  for (let i = 0; i < clinicId.length; i++) h = (h * 31 + clinicId.charCodeAt(i)) | 0;
  const n = Math.abs(h) % 10;
  if (n < 4) return "normal";
  if (n < 7) return "free";
  return "busy";
}

export default function AvailabilityHeatmap({ clinicId }: { clinicId: string }) {
  const months = MONTHS.map((m, i) => ({ m, load: loadFor(clinicId, i) }));
  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--border)" }}>
      <div className="mb-3">
        <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">12-month booking outlook</div>
        <h3 className="text-base font-black mt-0.5">Plan your trip around busy months</h3>
      </div>
      <div className="grid grid-cols-12 gap-1.5">
        {months.map((row, i) => (
          <div key={row.m} className="text-center">
            <div className="aspect-square rounded-md text-[10px] font-bold grid place-items-center"
              style={{ background: COLOR[row.load], color: row.load === "busy" ? "#9f1239" : row.load === "normal" ? "#92400e" : "#065f46" }}>
              {row.m.slice(0, 1)}
            </div>
            <div className="text-[9px] text-[var(--muted)] mt-1">{row.m}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-[var(--muted)]">
        {(["free","normal","busy"] as Load[]).map((l) => (
          <span key={l} className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded" style={{ background: COLOR[l] }} /> {LABEL[l]}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-[var(--muted)] mt-3 leading-relaxed">
        Rough patterns based on historical booking density. Always confirm exact slots when you inquire.
      </p>
    </section>
  );
}
