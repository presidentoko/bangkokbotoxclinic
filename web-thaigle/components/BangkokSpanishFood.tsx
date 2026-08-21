const PICKS = [
  {
    name: "Bodega (Wine Bar & Tapas)",
    emoji: "🍷",
    area: "Sukhumvit Soi 33",
    price: "Tapas ฿180–480, Paella ฿650–1,200 (serves 2)",
    why: "Bangkok's most celebrated Spanish restaurant. Spanish owner, authentic tapas from jamón to patatas bravas. Sunday paella order-ahead special is Bangkok's best. Extensive Rioja selection.",
    tip: "Paella takes 25 minutes — order when you arrive. Thursday Spanish night has larger tapas menu and live flamenco guitar some evenings. Reservations strongly recommended weekends.",
  },
  {
    name: "El Tapeo",
    emoji: "🥘",
    area: "Ekkamai / Thong Lo area",
    price: "Tapas ฿150–350, Sangria jug ฿680",
    why: "Casual tapas bar run by a Spanish expat. Tortilla española, gambas al ajillo, croquetas. Sangria by the jug. Happy atmosphere with Spanish football on screens.",
    tip: "Gambas al ajillo (garlic shrimp) is their best dish — order extra bread for dipping. Wednesday tapas happy hour: all tapas ฿120. Reservation not needed but arrive by 7pm.",
  },
  {
    name: "Opus Wine Bar & Restaurant",
    emoji: "🎵",
    area: "Sukhumvit 22",
    price: "Tapas ฿220–480, Spanish mains ฿550–1,200",
    why: "Upscale Spanish-Mediterranean with one of Bangkok's best Spanish wine lists. Chef trained in San Sebastian. Pintxos (Basque-style tapas on bread), excellent seafood paella.",
    tip: "Best for wine-focused Spanish evening — sommeliers know Spanish regions well. Business dinner appropriate. Live jazz some Saturday evenings. Cava (Spanish sparkling) well-priced.",
  },
];

export function BangkokSpanishFood() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥘 Spanish tapas & paella in Bangkok
      </h2>
      <div className="space-y-2">
        {PICKS.map((p) => (
          <div key={p.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-red-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
