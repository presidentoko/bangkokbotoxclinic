const ZONES = [
  {
    name: "Sukhumvit Soi 11 Strip",
    emoji: "🍔",
    vibe: "Young international expats — bars, burgers, clubs",
    picks: [
      { name: "Zanzibar", type: "Steakhouse", price: "฿800–1,800", note: "Consistent aged beef, Thai crowd favourite" },
      { name: "The District", type: "American Bar & Grill", price: "฿400–800", note: "Best burgers in area, draft beer selection" },
      { name: "Iron Balls Distillery", type: "Craft cocktail bar", price: "฿400–700", note: "House-distilled gin, great food pairings" },
    ],
  },
  {
    name: "Thonglor / Ekkamai",
    emoji: "🥩",
    vibe: "Upscale Japanese-Thai crowd, trendy restaurants",
    picks: [
      { name: "Charcoal Tandoor Grill", type: "International grill", price: "฿500–1,200", note: "Best value quality meat in Thonglor" },
      { name: "Fabulous", type: "All-day brunch", price: "฿350–800", note: "Best eggs Benedict in Bangkok, long queues weekend" },
      { name: "Brewski", type: "Rooftop craft beer", price: "฿300–600", note: "Radisson Blu 30F — best mid-range rooftop view" },
    ],
  },
  {
    name: "Sathorn / Silom (Business District)",
    emoji: "🍝",
    vibe: "Business lunches, upscale European dining",
    picks: [
      { name: "Le Beaulieu", type: "Classic French", price: "฿1,200–2,500", note: "Inside French Embassy area — authentic bistro" },
      { name: "Brasserie Europa", type: "European brasserie", price: "฿600–1,500", note: "Open since 1990, reliable quality lunch crowd" },
      { name: "Isao", type: "European-Japanese fusion", price: "฿400–800", note: "Hidden gem at Sala Daeng, creative menu" },
    ],
  },
];

export function BangkokWesternFood() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🍔 Western restaurants in Bangkok — where expats eat
      </div>
      <div className="space-y-4">
        {ZONES.map((z) => (
          <div key={z.name}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{z.emoji}</span>
              <div>
                <div className="font-bold text-xs">{z.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{z.vibe}</div>
              </div>
            </div>
            <div className="space-y-1.5">
              {z.picks.map((p) => (
                <div key={p.name} className="border border-[var(--border)] rounded-xl px-3 py-2 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[11px]">{p.name}</div>
                    <div className="text-[10px] text-[var(--muted)]">{p.type}</div>
                    <div className="text-[10px] text-orange-600 mt-0.5">{p.note}</div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono text-green-700">{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
