const TEMPLES = [
  {
    name: "Wat Pho",
    emoji: "🧘",
    location: "Rattanakosin",
    entry: "฿200",
    highlight: "Reclining Buddha (46m). Also home to Thailand's top massage school.",
    tip: "Buy water bottle included in entry. Massage school 5 min walk — book on arrival.",
    bestTime: "Early morning before 10am",
    url: "/guide",
  },
  {
    name: "Wat Arun (Temple of Dawn)",
    emoji: "🌅",
    location: "Thonburi (river crossing)",
    entry: "฿100",
    highlight: "Iconic spire covered in porcelain. Sunrise views across Chao Phraya.",
    tip: "Cross from Tha Tien pier for ฿4. Come before 7am for zero crowds + golden light.",
    bestTime: "Sunrise (6–8am)",
    url: "/guide",
  },
  {
    name: "Wat Phra Kaew (Grand Palace)",
    emoji: "🏛️",
    location: "Rattanakosin",
    entry: "฿500",
    highlight: "Emerald Buddha + Grand Palace complex. Most visited site in Thailand.",
    tip: "Dress code enforced — shoulders & knees covered. Scarves available at gate for ฿50 rental.",
    bestTime: "Weekday mornings (weekends very crowded)",
    url: "/guide",
  },
  {
    name: "Wat Saket (Golden Mount)",
    emoji: "⛩️",
    location: "Phra Nakhon",
    entry: "฿50",
    highlight: "Spiral staircase to summit. 360° views over old Bangkok. Serene and uncrowded.",
    tip: "Combine with same-day Wat Ratchanatdaram. Walk both in 2 hours max.",
    bestTime: "Late afternoon for sunset",
    url: "/guide",
  },
];

export function TempleGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🏛️ Top Bangkok temples — what to know
      </div>
      <div className="space-y-2">
        {TEMPLES.map((t) => (
          <a key={t.name} href={t.url} className="block border border-[var(--border)] rounded-xl p-3 hover:border-orange-200 hover:shadow-sm transition group">
            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xl">{t.emoji}</span>
                <span className="font-bold text-xs group-hover:text-orange-700 transition">{t.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-orange-600">{t.entry}</span>
                <span className="text-[10px] text-[var(--muted)]">· {t.location}</span>
              </div>
            </div>
            <div className="text-[11px] text-[var(--fg)] mb-1">{t.highlight}</div>
            <div className="text-[10px] text-[var(--muted)]">⏰ Best: {t.bestTime}</div>
            <div className="text-[10px] text-orange-600 leading-snug mt-0.5">💡 {t.tip}</div>
          </a>
        ))}
      </div>
      <div className="mt-3 text-[11px] text-amber-700 bg-amber-50 rounded-xl p-2.5 border border-amber-200">
        <strong>Dress code at ALL temples:</strong> Cover shoulders + knees. Sleeveless tops, shorts, and mini-skirts not allowed. Sarongs available to borrow/buy at most entrances.
      </div>
    </div>
  );
}
