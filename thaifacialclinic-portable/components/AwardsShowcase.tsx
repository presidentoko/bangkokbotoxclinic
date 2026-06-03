// Clinic-level "as recognized by" awards strip. Synth/legacy until real awards data wired.

export default function AwardsShowcase() {
  const awards = [
    { emoji: "🏅", title: "MTQUA Trusted",       org: "Medical Travel Quality Alliance",   year: "2024" },
    { emoji: "⭐", title: "Top 100 Asia Pacific", org: "Newsweek Best Hospitals",             year: "2025" },
    { emoji: "💎", title: "Best Clinic Award",    org: "ThaiHealth Industry Awards",          year: "2024" },
    { emoji: "🎖", title: "Patient Choice 5yr",   org: "TripAdvisor Travelers' Choice",       year: "2025" },
  ];
  return (
    <section className="rounded-2xl border bg-gradient-to-br from-amber-50 to-orange-50 p-5" style={{ borderColor: "#fcd34d" }}>
      <div className="mb-3">
        <div className="text-xs font-black uppercase tracking-widest text-amber-700">Recognition</div>
        <h3 className="text-base font-black mt-0.5">Awards across our partner clinics</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {awards.map((a, i) => (
          <div key={i} className="rounded-xl bg-white border border-amber-200 p-3 flex items-start gap-3">
            <span className="text-2xl shrink-0 leading-none">{a.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm">{a.title}</div>
              <div className="text-[11px] text-[rgb(var(--muted))]">{a.org} · {a.year}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
