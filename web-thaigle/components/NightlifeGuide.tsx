const ZONES = [
  {
    area: "Thonglor / Ekkamai",
    emoji: "🌃",
    vibe: "Hip, upscale, local Thais & expats",
    openHours: "8pm–2am (some 3am)",
    dressCode: "Smart casual — no flip-flops at clubs",
    priceRange: "฿200–400 cocktails",
    picks: ["Rabbit Hole (cocktail bar)", "Studio Lam (DJ, local music)", "Getaway (rooftop)"],
  },
  {
    area: "Silom / Sathorn",
    emoji: "🍸",
    vibe: "Office crowd, after-work, LGBTQ-friendly",
    openHours: "6pm–midnight (Soi 4 later)",
    dressCode: "Casual — Soi 4 very relaxed",
    priceRange: "฿100–250 drinks",
    picks: ["Telephone Bar (Soi 4)", "Maggie Choo's (speakeasy)", "Smalls (jazz)"],
  },
  {
    area: "RCA (Royal City Avenue)",
    emoji: "🎵",
    vibe: "Thai youth, EDM, big clubs",
    openHours: "10pm–3am",
    dressCode: "Club wear — some venues strict",
    priceRange: "฿400–600 per table bottle",
    picks: ["Route 66", "Flix", "Onyx"],
  },
  {
    area: "Khaosan Road / Banglamphu",
    emoji: "🍺",
    vibe: "Backpackers, international, very casual",
    openHours: "7pm–4am",
    dressCode: "Anything goes",
    priceRange: "฿60–120 beer",
    picks: ["Brick Bar (live music)", "Hippie de Bar", "The Club"],
  },
];

export function NightlifeGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🌃 Bangkok nightlife — which zone?
      </div>
      <div className="space-y-2">
        {ZONES.map((z) => (
          <div key={z.area} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xl">{z.emoji}</span>
                <span className="font-bold text-xs">{z.area}</span>
              </div>
              <span className="text-[10px] text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded font-bold">{z.priceRange}</span>
            </div>
            <div className="text-[11px] text-[var(--fg)] mb-1"><span className="font-medium">Vibe:</span> {z.vibe}</div>
            <div className="text-[10px] text-[var(--muted)] mb-1">⏰ {z.openHours} · 👔 {z.dressCode}</div>
            <div className="flex flex-wrap gap-1">
              {z.picks.map((p, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-[var(--muted)]">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-[var(--muted)] bg-amber-50 rounded-xl p-2.5 border border-amber-100">
        <strong>Remember:</strong> Bars close at 2am (some 1am). Alcohol curfew during election days and Buddhist holidays.
      </div>
    </div>
  );
}
