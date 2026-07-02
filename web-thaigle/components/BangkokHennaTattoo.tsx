const SPOTS = [
  {
    name: "Chatuchak Weekend Market (Section 5)",
    emoji: "🌸",
    area: "Chatuchak Weekend Market, near MRT Chatuchak Park",
    price: "Small design ฿150–300, large ฿500–1,000",
    why: "Best selection of henna artists in Bangkok. Section 5 (antique and accessories area) has 5–8 vendors. Traditional Indian/Moroccan patterns alongside Thai motifs. Very photogenic market setting.",
    tip: "Visit Saturday or Sunday only (Chatuchak is weekend-only). Designs take 20–45 minutes — plan time. Black henna is a scam (contains PPD chemical — allergic reactions common). Only accept natural brown/red henna.",
  },
  {
    name: "Asiatique Night Market",
    emoji: "🌙",
    area: "Asiatique The Riverfront, Charoen Krung",
    price: "Small design ฿200–400",
    why: "Evening market setting with riverfront atmosphere. Henna artists near the entrance. Good option if visiting Asiatique for dinner or cabaret show. Open evenings only (5pm–midnight).",
    tip: "Henna dries in 1–2 hours and should not get wet for the first 6 hours. Paste left on longer = darker, longer-lasting color. Natural henna fades in 2–3 weeks — good for holidays.",
  },
  {
    name: "Khaosan Road Vendors",
    emoji: "🎪",
    area: "Khaosan Road, Banglamphu",
    price: "Small design ฿100–250",
    why: "Cheapest and most convenient option for tourists on Khaosan Road. Quick, simple designs while you're out. Less elaborate than Chatuchak vendors but perfectly fine for small wrist/ankle designs.",
    tip: "⚠️ On Khaosan: always check artist uses red/brown paste, NOT black. If black paste offered = synthetic = avoid. Ask to see the henna tube — natural henna is dark green paste that dries brown-red.",
  },
];

export function BangkokHennaTattoo() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🌸 Henna tattoos in Bangkok — where to get them + black henna warning
      </div>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <div className="border border-red-100 rounded-xl p-2 bg-red-50">
        <div className="text-[10px] font-bold text-red-700 mb-0.5">⚠️ Black henna warning</div>
        <div className="text-[10px] text-red-600">Black henna contains PPD (para-phenylenediamine), a chemical dye that causes severe allergic reactions, chemical burns, and permanent scarring. Real henna is always red-brown. Never allow black henna on your skin.</div>
      </div>
    </div>
  );
}
