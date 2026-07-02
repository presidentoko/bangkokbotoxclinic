const CLUBS = [
  {
    name: "Bangkok Hash House Harriers (BH3)",
    emoji: "🍺",
    area: "Bangkok (rotating suburban locations)",
    run: "Monday evening, ~8km walk/run; ฿200–300 including beer",
    why: "Bangkok's Hash House Harriers chapter is one of Southeast Asia's oldest — established 1970s. Monday evening runs departing from rotating Bangkok suburbs (typically Bang Na, Lad Krabang, or other outer areas). Trail typically 5–8km of urban/suburban 'paper chase' route through unexpected Bangkok back streets. Social group of 50–150 runners weekly.",
    tip: "The 'On-On' post-run gathering is the main event — circle ceremony, songs, naming rituals, large quantities of beer (hashing is a 'drinking club with a running problem'). Newcomers called 'virgins' are welcomed with elaborate ceremonies. Shorts, t-shirt, and comfortable shoes suitable — no special gear needed.",
  },
  {
    name: "Bangkok Hash Trail Philosophy",
    emoji: "🗺️",
    area: "All over Bangkok outer suburbs",
    run: "Non-competitive social running event",
    why: "Hash trails use flour or toilet paper marks to guide runners/walkers through un-mapped routes — the point is to explore areas of Bangkok that normal visitors never see. Expect: klong-side paths, local temple grounds, village sois, construction sites, occasional wading. The route finder (Hare) spends a week pre-marking the trail.",
    tip: "Bangkok Hash is genuinely one of the best ways to see 'real Bangkok' — the routes pass through neighborhoods that no tourist trail or BTS ride reaches. Wear shoes you don't mind getting muddy. The community is very welcoming to runners of all speeds — back of the pack is fine.",
  },
  {
    name: "Other Bangkok Hash Chapters",
    emoji: "🌙",
    area: "Bangkok and surrounding provinces",
    run: "Various days — see Harrier international directory",
    why: "Beyond BH3, Bangkok has multiple Hash chapters including Lady Hash (women-only), Full Moon Hash, Bangkok Night Hash, and chapter runs in Nonthaburi and Pathum Thani. International Harrier chapters worldwide use the same format, so visiting Hashers are instantly welcomed into any chapter as regulars.",
    tip: "Global Hash House Harriers directory lists all chapters by city. If you're a Hasher from another city — say so and you'll receive an immediate warm welcome, free beer, and probably a nickname ceremony. Hash naming is a rite of passage.",
  },
];

export function BangkokHashRun() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🍺 Bangkok Hash House Harriers — social running with beer, Monday nights
      </div>
      <div className="space-y-2">
        {CLUBS.map((c) => (
          <div key={c.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700 max-w-[120px] text-right">{c.run}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
