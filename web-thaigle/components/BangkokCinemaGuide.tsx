const CINEMAS = [
  {
    name: "IMAX at SF World Cinema (Central World)",
    emoji: "🎥",
    area: "Central World 7F, Ratchaprasong BTS",
    price: "IMAX ฿380–550, Standard ฿180–280",
    format: "IMAX, 4DX, ScreenX, Standard",
    why: "Bangkok's most central cinema complex. 15 screens including Thailand's biggest IMAX screen. 4DX (seats move) and ScreenX (3-screen wrap-around) for immersive experiences.",
    tip: "Book via sfcinemacity.com or their app — online seats often cheaper than walk-up. Row J or K center is optimal for IMAX. Arrive 10 min early for seat selection.",
  },
  {
    name: "Paragon Cineplex (Siam Paragon)",
    emoji: "👑",
    area: "Siam Paragon 5F, Siam BTS",
    price: "Standard ฿200–320, Platinum ฿600–900, Enigma (private room) from ฿10,000",
    format: "Standard, Platinum, Enigma (private screening room for groups)",
    why: "Bangkok's most luxurious cinema. Platinum class: wide reclining seats, table service, full-menu dining during film. Enigma: private 3–7 seat rooms for total privacy.",
    tip: "Platinum seats include meal service — order before the film starts (15 min window). Enigma rooms are perfect for corporate events or special date nights.",
  },
  {
    name: "House Samyan (Samyan Mitrtown)",
    emoji: "🏠",
    area: "Samyan Mitrtown Mall, Sam Yan MRT",
    price: "Standard ฿180–280, House Klass ฿600",
    format: "Art-house and independent films alongside mainstream",
    why: "Bangkok's best cinema for quality film selection. Strong programming of international art-house, Hong Kong cinema, and documentary films. The cinephile's choice.",
    tip: "Check their programming on housesamyan.com. Often the only Bangkok cinema showing non-Hollywood films. Loyalty card saves ฿20/ticket after 10 visits.",
  },
  {
    name: "EGV Gold Class (Siam Discovery)",
    emoji: "🛋️",
    area: "Siam Discovery, Siam BTS",
    price: "Gold Class ฿700–900 (includes food + drink voucher)",
    format: "Gold Class recliner pairs only — romantic cinema experience",
    why: "Recliner pair seats with electronic controls. Good-quality food menu. Serves wine and cocktails. More intimate than Paragon Platinum for a date or anniversary.",
    tip: "Book specific pair seats online — all seats are pairs. No single-seat option. White wine and cheese board is the most popular order.",
  },
];

export function BangkokCinemaGuide() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎬 Bangkok cinemas — from IMAX to private rooms & art-house
      </h2>
      <div className="space-y-2">
        {CINEMAS.map((c) => (
          <div key={c.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{c.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-purple-700 mb-0.5">Formats: {c.format}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-orange-600">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
