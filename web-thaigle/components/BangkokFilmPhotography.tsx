const SPOTS = [
  {
    name: "Asia Books / B2S (film section)",
    emoji: "🎞️",
    where: "EmQuartier, Terminal 21, Siam Paragon",
    why: "Best retail film selection in Bangkok. Kodak Ultramax 400, Kodak Gold 200, Fujifilm 200, Ilford HP5 stocked consistently. Prices: ฿220–350 per roll (35mm). Medium format limited.",
    tip: "Buy film at B2S Terminal 21 — largest in-store selection. Keep receipts for warranty. Ask staff for current Kodak/Fuji stock — they rotate. Film comes at room temperature, request cold storage for long holds.",
  },
  {
    name: "Lucky Film Lab Bangkok",
    emoji: "🔬",
    where: "Ari / Phahon Yothin area",
    why: "Bangkok's best independent film lab. C-41, E-6 (slide film), and black-and-white. Digital scans included in price. Turnaround: 3–5 days standard, 1 day rush. Popular with Thai film photography community.",
    tip: "Include notes with your film roll — push/pull, cross-process requests, scanning resolution. High-res scans (4000dpi equivalent) cost extra but worth it. Follow their Instagram to see sample work before trusting your rolls.",
  },
  {
    name: "Film Cameras at Chatuchak Market",
    emoji: "📷",
    where: "Chatuchak Weekend Market, Section 3 (antiques)",
    why: "Bangkok's largest second-hand film camera market. Canon AE-1, Pentax K1000, Olympus OM series, Minolta, Nikon FM2 — priced ฿1,500–8,000 depending on condition. Thai sellers are knowledgeable.",
    tip: "Run a test roll before buying (ask seller to load a roll). Check light seals (foam around door) — dry rotted seals cause light leaks. Best deals on Japanese student cameras (Canonet, Yashica). Bring cash only.",
  },
];

const CAFES = [
  "Darkroom Bangkok (Ekkamai) — film-themed café with DIY printing station",
  "Foto Café (Silom) — photography gallery + espresso, regular photo zine events",
  "Analog Bangkok (IG community) — monthly film swap events and group shoots",
  "Mahanak Film Club — darkroom access memberships for serious enthusiasts",
];

export function BangkokFilmPhotography() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-stone-700 mb-3">
        📷 Film photography in Bangkok — where to buy film, get it developed & find cameras
      </h2>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-stone-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.where}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-stone-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-stone-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-stone-700 hover:bg-stone-50">
          Film photography community in Bangkok
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {CAFES.map((c) => (
            <li key={c} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-stone-400 shrink-0">•</span>{c}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
