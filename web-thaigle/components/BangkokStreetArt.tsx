const ZONES = [
  {
    name: "Talad Noi Art Community",
    emoji: "🎨",
    area: "Charoen Krung near Chinatown (Saphan Taksin BTS, walk 10 min)",
    murals: ["Alex Face (famous rabbit character)", "Mue Bon", "Bonus THR", "Cartoonist Tamtam"],
    why: "Most concentrated mural area in Bangkok. 100+ artworks in a 1km radius. Mix of Thai and international street artists.",
    tip: "Morning (7–9am) best light. Narrow lanes mean telephoto lens difficult. Instagram @talad_noi for newest pieces.",
    best: "Soi Nana (not the adult entertainment one) — small lane with incredible work.",
  },
  {
    name: "On Nut / Phra Khanong Area",
    emoji: "🏙️",
    area: "On Nut BTS",
    murals: ["Large-scale building murals", "Corridor Thai art project", "Local artist residencies"],
    why: "Emerging area for murals. New works added regularly. Less tourist-heavy than Talad Noi so more authentic finding experience.",
    tip: "Walking between On Nut and Phra Khanong BTS along Sukhumvit 77–85 sois reveals most.",
    best: "Late afternoon light on the apartment block murals near Sukhumvit 71.",
  },
  {
    name: "Chatuchak Creative Hub",
    emoji: "🖌️",
    area: "Section 7, Chatuchak Weekend Market",
    murals: ["Various artists change seasonally", "Bangkok street art collective"],
    why: "Chatuchak art section has permanent and rotating mural installations. Combine with market visit.",
    tip: "Section 7–8 is where art/graphic design shops are — many spill into murals around their storefronts.",
    best: "Weekend only (Chatuchak market). Go early (8–10am).",
  },
];

export function BangkokStreetArt() {
  return (
    <div className="rounded-2xl border border-fuchsia-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-fuchsia-700 mb-3">
        🎨 Bangkok street art — mural districts
      </h2>
      <div className="space-y-2.5">
        {ZONES.map((z) => (
          <div key={z.name} className="border border-fuchsia-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{z.emoji}</span>
              <div>
                <h3 className="font-bold text-xs">{z.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {z.area}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1.5 leading-snug">{z.why}</div>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {z.murals.map((m) => (
                <span key={m} className="text-[9px] bg-fuchsia-50 text-fuchsia-700 px-1.5 py-0.5 rounded-full">{m}</span>
              ))}
            </div>
            <div className="text-[10px] text-orange-600 mb-0.5">💡 {z.tip}</div>
            <div className="text-[10px] text-fuchsia-700">⭐ Best: {z.best}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
