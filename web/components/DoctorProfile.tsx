// Doctor cards aggregated from review mentions. RealSelf-style.
// Pure server component, shown on clinic detail.

import type { Clinic, DoctorStat } from "@/lib/types";

const LANG_FLAG: Record<string, string> = {
  en: "🇬🇧", th: "🇹🇭", ko: "🇰🇷", ja: "🇯🇵", zh: "🇨🇳", ar: "🇸🇦", other: "🌍",
};

function initials(name: string): string {
  const parts = name.trim().replace(/^Dr\.?\s+/i, "").split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function topLangs(stat: DoctorStat): string[] {
  const counts = stat.language_count || {};
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
    .slice(0, 3);
}

export default function DoctorProfile({ clinic }: { clinic: Clinic }) {
  const docs = (clinic.doctor_stats || []).filter((d) => d.mentions >= 2).slice(0, 6);
  if (docs.length === 0) return null;

  return (
    <section className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <div className="border-b px-5 py-3 flex items-baseline justify-between" style={{ borderColor: "var(--border)" }}>
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Doctors</div>
          <h3 className="text-base font-bold mt-0.5">
            {docs.length} {docs.length === 1 ? "doctor" : "doctors"} mentioned by patients
          </h3>
        </div>
        <span className="text-xs text-[var(--muted)] hidden sm:inline">From verified Google reviews</span>
      </div>

      <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
        {docs.map((d) => {
          const langs = topLangs(d);
          const top = d.samples?.[0];
          return (
            <li key={d.slug} className="p-5 hover:bg-slate-50 transition">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-800 font-black text-lg shrink-0">
                  {initials(d.name)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <div className="font-black">{d.name}</div>
                    {langs.length > 0 && (
                      <span className="text-sm">
                        {langs.map((l) => LANG_FLAG[l] || "").join(" ")}
                      </span>
                    )}
                    <span className="text-xs font-bold text-yellow-700">
                      {d.rating_avg ? `★${d.rating_avg.toFixed(1)}` : ""}
                    </span>
                    <span className="text-xs text-[var(--muted)] tabular-nums">
                      · {d.mentions} mention{d.mentions === 1 ? "" : "s"}
                    </span>
                  </div>

                  {d.experience_signals && d.experience_signals.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {d.experience_signals.slice(0, 3).map((s, i) => (
                        <span key={i} className="rounded-md bg-blue-50 text-blue-800 px-2 py-0.5 text-[11px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {d.procedures && d.procedures.length > 0 && (
                    <div className="mt-2 text-xs text-[var(--muted)]">
                      <span className="font-bold text-[var(--fg)]">Performs:</span>{" "}
                      {d.procedures.slice(0, 4).map((p) => p.service).join(" · ")}
                    </div>
                  )}

                  {top && (
                    <blockquote className="mt-3 border-l-2 border-blue-200 pl-3 text-xs text-[var(--muted)] italic line-clamp-2">
                      &ldquo;{top.text}&rdquo;
                    </blockquote>
                  )}

                  {d.clinic_doctor_url && (
                    <a
                      href={d.clinic_doctor_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="mt-2 inline-block text-xs font-bold text-blue-700 hover:underline"
                    >
                      Official profile →
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
