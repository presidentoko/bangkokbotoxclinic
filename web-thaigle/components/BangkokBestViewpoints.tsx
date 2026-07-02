const VIEWPOINTS = [
  {
    name: "Mahanakhon Tower SkyWalk",
    emoji: "🌆",
    area: "Chong Nonsi BTS",
    height: "314m — Thailand's tallest building",
    price: "Adults ฿870, Glass tray floor included",
    why: "Bangkok's highest viewpoint. Glass floor 'tray' for standing above clouds. 360° observation deck. The glass box extends out from the 78th floor — terrifying and thrilling.",
    tip: "Book online for ฿100 discount. Best at sunset (6–7pm) — arrive 45 min before sunset for both day and night views. Champagne bar at top included in some packages.",
    open: "Daily 10am–midnight",
  },
  {
    name: "Baiyoke Sky Hotel Observation Deck",
    emoji: "🏙️",
    area: "Pratunam area (no BTS — taxi or Grab)",
    height: "309m — 3rd floor observation",
    price: "Adults ฿600 (includes buffet credit)",
    why: "Bangkok's original skyscraper has a rotating observation deck. More touristy than Mahanakhon but restaurant/buffet included. Good 360° views.",
    tip: "Evening buffet dinner package (฿990) better value than observation-only. Rotating deck can be crowded — avoid 6–8pm peak. Best clear-day visibility November–February.",
    open: "Daily 10:30am–10:30pm",
  },
  {
    name: "Wat Saket (Golden Mount)",
    emoji: "🛕",
    area: "Near Khao San Road, Old Bangkok",
    height: "78m — not tall but panoramic for the area",
    price: "฿20",
    why: "Bangkok's original viewpoint before skyscrapers. Spiral staircase up a man-made hill to a golden chedi. Exceptional views of old Bangkok, Grand Palace, Chao Phraya.",
    tip: "Less crowded than commercial observation decks. Best at golden hour (5:30–6:30pm). The staircase walk is a mild workout — about 300 steps with bells along the way.",
    open: "Daily 8am–5pm",
  },
  {
    name: "King Power Mahanakhon Bar (Lower)",
    emoji: "🍸",
    area: "Chong Nonsi BTS",
    height: "68th–74th floor",
    price: "Cocktails from ฿350 (no cover with drink minimum)",
    why: "If the full observation deck is too expensive, the bar level (68F) gives excellent views without the premium ticket. Order a drink and stay 2 hours. Live music some evenings.",
    tip: "No reservation needed for bar seats. Bar level can be accessed separately from observation deck. View is equally dramatic — glass façade makes Bangkok feel enormous.",
    open: "Daily 5pm–midnight",
  },
];

export function BangkokBestViewpoints() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        🌆 Bangkok viewpoints — from skyscrapers to temple hills
      </div>
      <div className="space-y-2">
        {VIEWPOINTS.map((v) => (
          <div key={v.name} className="border border-slate-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{v.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{v.height} · {v.area} · {v.open}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-slate-700">💡 {v.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
