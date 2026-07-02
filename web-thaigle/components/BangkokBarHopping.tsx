const ROUTES = [
  {
    name: "Sukhumvit Soi 11 Circuit",
    emoji: "🍹",
    area: "BTS Nana, Soi 11 and surrounding streets",
    crowd: "International travelers, expats, Bangkok social scene",
    why: "Bangkok's most international bar street. Mix of cocktail bars, rooftop terraces, live music venues, and clubs. Walkable circuit — can do 4–5 bars in a single evening. Skybar at Soi 11 area has multiple venues stacked vertically.",
    bars: "SING Sing Theater (best cocktails on the street), Demo club (EDM), Havana Social Club (Latin), Insanity (club), Iron Fairies Thonglor (30min Grab away).",
    tip: "Start at SING Sing for cocktails (8–10pm), then flow to demo or clubs after midnight. Cover charges on Thursday–Saturday at bigger venues ฿200–400 (includes drink).",
  },
  {
    name: "Thonglor 'Tokyo Street' Route",
    emoji: "🌸",
    area: "BTS Thong Lo, Soi 13 area",
    crowd: "Bangkok affluent locals, Japanese expats, Korean crowd",
    why: "Bangkok's trendiest nightlife area. Japanese-themed bars, K-pop lounges, craft cocktail bars. Very Bangkok affluent Thai crowd — dress up more than Soi 11. More sophisticated vibe, less tourist. New bars open constantly.",
    bars: "Above Eleven (rooftop, best view), Tichuca Bangkok (treehouse cocktail bar), Scratch (DJ bar), DoubleU (popular local club), various small Japanese izakaya-style bars on the side streets.",
    tip: "Thonglor gets going after 10pm — don't arrive early. Grab to/from is essential (BTS last train leaves before the party peaks). Best on Thursday or Friday nights when local crowd is most active.",
  },
  {
    name: "Ekkamai 'Creative Quarter' Crawl",
    emoji: "🎨",
    area: "BTS Ekkamai, Soi 5 area",
    crowd: "Creative Thais, artsy expats, design community",
    why: "Bangkok's creative district nightlife — craft beer, cocktail bars, design spaces turned bar, independent music venues. More alternative and local than Thonglor. Walking distance between venues. Less crowded, more interesting conversations.",
    bars: "Iron Fairies (steampunk cocktail bar), Arena 10 (live music), Kaizen (Japanese craft beer), Ekkamai Beer House (Thai craft beers + food), various small bars tucked down the sois.",
    tip: "Ekkamai is genuinely walkable — park yourself in one area and explore on foot. Live music on weekends at Arena 10. The contrast: early evening craft beer and pizza, then cocktail bars as the night progresses.",
  },
];

export function BangkokBarHopping() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🍹 Bangkok bar hopping — Sukhumvit, Thonglor & Ekkamai circuits
      </div>
      <div className="space-y-2">
        {ROUTES.map((r) => (
          <div key={r.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.area}</div>
              </div>
              <span className="shrink-0 text-[10px] text-violet-700">{r.crowd}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{r.why}</div>
            <div className="text-[10px] text-[var(--muted)] mb-0.5">Venues: {r.bars}</div>
            <div className="text-[10px] text-violet-700">💡 {r.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
