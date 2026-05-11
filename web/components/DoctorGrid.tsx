import { CATEGORY_LABELS } from "@/lib/types";
import type { DoctorWithClinic } from "@/lib/data";

const LANG_BADGE: Record<string, { label: string; color: string }> = {
  th: { label: "TH", color: "#dc2626" },
  en: { label: "EN", color: "#2563eb" },
  ko: { label: "KO", color: "#7c3aed" },
  ja: { label: "JA", color: "#ec4899" },
  other: { label: "—", color: "#737373" },
};

export function DoctorGrid({ doctors }: { doctors: DoctorWithClinic[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((d) => (
        <DoctorCard key={d.composite_slug} doc={d} />
      ))}
    </div>
  );
}

export function DoctorCard({ doc: d }: { doc: DoctorWithClinic }) {
  const c = d.clinic;
  const specialty = c.categories.slice(0, 2).map((cat) => CATEGORY_LABELS[cat] ?? cat).join(" · ");
  const langs = Object.entries(d.language_count)
    .filter(([k, v]) => v > 0 && k !== "other")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  return (
    <a
      href={`/doctor/${d.composite_slug}`}
      className="block bg-white border border-[var(--border)] rounded-xl p-4 hover:shadow-md hover:border-black transition group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">
            {specialty || "Aesthetic medicine"}
          </div>
          <h3 className="font-bold text-base truncate group-hover:text-[var(--accent)] transition">
            Dr. {d.name}
          </h3>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-yellow-700 text-sm font-bold tabular-nums">★ {d.rating_avg.toFixed(1)}</div>
        </div>
      </div>
      <div className="text-xs text-[var(--muted)] truncate mb-2">
        at <strong className="text-[var(--fg)]">{c.name}</strong>
        {c.district && <> · {c.district}</>}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {langs.map((lang) => (
            <span
              key={lang}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white tabular-nums"
              style={{ background: LANG_BADGE[lang]?.color || "#737373" }}
            >
              {LANG_BADGE[lang]?.label || lang.toUpperCase()}
            </span>
          ))}
        </div>
        <span className="text-xs text-[var(--muted)] tabular-nums">{d.mentions} mentions</span>
      </div>
    </a>
  );
}
