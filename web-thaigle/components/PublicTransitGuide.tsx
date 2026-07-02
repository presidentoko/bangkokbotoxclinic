const LINES = [
  {
    name: "BTS Skytrain",
    color: "#00A651",
    short: "BTS",
    tip: "Fastest way across Sukhumvit & Silom. Single-day pass ฿150. Connects Asok, Siam, Ekkamai, Thonglor.",
    bestFor: "Sukhumvit dining, Silom bars, nightlife",
  },
  {
    name: "MRT Subway",
    color: "#1E40AF",
    short: "MRT",
    tip: "Covers Chatuchak, Huai Khwang & Lumphini. Single-day pass ฿140. Connects to BTS at Asok/Sukhumvit.",
    bestFor: "Chatuchak market, Chinatown (Yaowarat), Silom",
  },
  {
    name: "Grab",
    color: "#00B14F",
    short: "GRAB",
    tip: "App-based taxi. Book with fixed price before getting in — no haggling. ฿50–200 for most Bangkok trips.",
    bestFor: "Late night, areas without BTS/MRT, luggage",
  },
  {
    name: "Boat (Chao Phraya)",
    color: "#0EA5E9",
    short: "BOAT",
    tip: "Tourist boat ฿60 all-day pass. Connects Chinatown, Rattanakosin, Asiatique. Skip traffic completely.",
    bestFor: "Chinatown, old city, temple areas",
  },
];

export function PublicTransitGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5 my-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🚇</span>
        <div>
          <div className="font-black text-sm">Getting Around Bangkok</div>
          <div className="text-xs text-[var(--muted)]">Best transit options — no taxi scams</div>
        </div>
      </div>
      <div className="space-y-3">
        {LINES.map((l) => (
          <div key={l.short} className="flex gap-3 items-start">
            <span
              className="shrink-0 text-white text-[10px] font-black px-2 py-1 rounded-md leading-tight"
              style={{ background: l.color }}
            >
              {l.short}
            </span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[var(--fg)]">{l.name}</div>
              <div className="text-xs text-[var(--muted)] leading-snug">{l.tip}</div>
              <div className="text-[10px] text-[var(--muted)] mt-0.5">Best for: <span className="font-medium">{l.bestFor}</span></div>
            </div>
          </div>
        ))}
      </div>
      <a
        href="/local-tips"
        className="mt-4 block text-center text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 rounded-full py-1.5 hover:bg-blue-100 transition"
      >
        More local insider tips →
      </a>
    </div>
  );
}
