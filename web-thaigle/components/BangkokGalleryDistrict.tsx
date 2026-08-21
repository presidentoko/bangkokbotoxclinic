const GALLERIES = [
  {
    name: "Charoen Krung Creative District",
    emoji: "🏭",
    area: "Old harbour warehouses (Charoen Krung Rd, BTS Saphan Taksin + Klong San)",
    type: "Emerging creative hub",
    spaces: ["TCDC (Thailand Creative & Design Centre) — library, exhibitions, co-working", "Warehouse 30 — 9 warehouse spaces, pop-ups, galleries, cafés", "Soy Sauce Factory — industrial event space", "Jam Factory — architecture studios, café, bookshop"],
    hours: "Most open Tue–Sun 10am–7pm. Check individual venue hours.",
    why: "Bangkok's design + creative industry lives here. Best neighbourhood for 'authentic creative Bangkok' experience. Walk between venues — 1km radius.",
    tip: "TCDC has the best design bookshop in Bangkok (฿50 day pass for non-members gives full library access).",
  },
  {
    name: "RCA Area / Sukhumvit Emerging Gallery Belt",
    emoji: "🖼️",
    area: "Near RCA (Royal City Avenue), also scattered Sukhumvit 49–71",
    type: "Commercial galleries",
    spaces: ["Bangkok Citycity Gallery — most respected contemporary space", "YELO House — contemporary art, design-forward", "H Gallery — international artists showing in Bangkok", "WTF Gallery — photography focus, original small gallery"],
    hours: "Wed–Sun 12–8pm typical. Closed Mon–Tue.",
    why: "If you want to see what Thai contemporary artists are actually making right now — Bangkok Citycity is the reference point.",
    tip: "Bangkok Citycity shows change every 4–6 weeks. Check their Instagram (@bangkokcitycity) for current show before visiting.",
  },
];

export function BangkokGalleryDistrict() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🖼️ Bangkok gallery districts — art & design scenes
      </h2>
      <div className="space-y-3">
        {GALLERIES.map((g) => (
          <div key={g.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div>
                <h3 className="font-bold text-xs">{g.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{g.type} · {g.area}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {g.spaces.map((s) => (
                <span key={s} className="text-[9px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">💡 {g.tip}</div>
            <div className="text-[10px] text-[var(--muted)]">🕐 {g.hours}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
