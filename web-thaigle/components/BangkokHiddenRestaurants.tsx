const GEMS = [
  {
    name: "Raan Jay Fai",
    emoji: "🔥",
    area: "Rattanakosin / Phra Nakhon",
    why: "Street-food chef with 1 Michelin star. Jay Fai (aged 70+) cooks in goggles over charcoal flames. No AC.",
    dish: "Crab omelette (kai jeow poo) ฿1,200–1,500. Worth every baht.",
    lineup: "Open 2pm–midnight but queues form at noon. Show up at 11:30am to secure a spot.",
    tip: "Cash only. No phone calls. In person only. Long wait — take it as time to explore the neighborhood.",
  },
  {
    name: "P'Aor Tom Yum Noodles",
    emoji: "🍜",
    area: "Din Daeng (near Victory Monument)",
    why: "Bangkok's most concentrated tom yum noodle shop. Tiny, 8 tables, chef-owner, no English menu.",
    dish: "Tom yum noodles dry-style ฿60–80. Probably the best bowl of noodles in Bangkok.",
    lineup: "No queue usually — locals only, unknown to tourists. Lunch service 11am–3pm.",
    tip: "Go with a Thai friend or use Google Translate. Worth the navigation challenge.",
  },
  {
    name: "Soei Restaurant",
    emoji: "🌿",
    area: "Asok / Phetchaburi",
    why: "Authentic central Thai cuisine. Menu rotates daily. Zero tourist concessions.",
    dish: "Gaeng hung lay (Northern curry ฿150), pla kapong neung manao (steamed fish with lime) ฿250–400",
    lineup: "No reservations. Opens 11am, arrives with office workers at 12:15pm.",
    tip: "Cash only. Shared tables. Menu in Thai only. Point at what others are eating or use photos. Incredible value.",
  },
  {
    name: "Samrub Samrub Thai",
    emoji: "🏛️",
    area: "Bang Rak",
    why: "Rare: high-end Thai tasting menu focused on rarely-seen regional dishes. Research-driven kitchen.",
    dish: "Tasting menu 7 courses ฿1,500–2,000. Dishes sourced from 4 Thai regions.",
    lineup: "Reservation required 1 week ahead. Instagram: @samrubsamrubthai",
    tip: "Best for serious food travelers wanting to understand Thai cuisine beyond Pad Thai. Context provided for every dish.",
  },
  {
    name: "Pijiu Bar",
    emoji: "🍻",
    area: "Silom / Bangrak",
    why: "Hidden Chinese-style bar with the best selection of rare Thai craft beers. No signage outside.",
    dish: "Craft beer menu changes weekly. Small plates like moo ping and pork skewers ฿60–100.",
    lineup: "Walk-in only. Open Thu–Sat from 6pm. Tiny, fits 20 people.",
    tip: "Ring the doorbell — it looks closed. This is how you find it. Very Ari/underground Bangkok crowd.",
  },
];

export function BangkokHiddenRestaurants() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🗺️ Bangkok hidden restaurants — what locals actually eat
      </h2>
      <div className="space-y-2">
        {GEMS.map((g) => (
          <div key={g.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{g.emoji}</span>
              <div>
                <h3 className="font-bold text-xs">{g.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {g.area}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{g.why}</div>
            <div className="text-[10px] text-blue-700 mb-0.5">Must order: {g.dish}</div>
            <div className="text-[10px] text-[var(--muted)] mb-0.5">⏱️ {g.lineup}</div>
            <div className="text-[10px] text-orange-600">💡 {g.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
