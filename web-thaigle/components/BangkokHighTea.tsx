const VENUES = [
  {
    name: "Authors' Lounge — Mandarin Oriental",
    emoji: "🫖",
    area: "Charoen Krung riverside",
    price: "฿1,200–1,800 per person (set)",
    why: "Bangkok's most historic afternoon tea setting. Authors' Lounge in the 1876 East Wing of Mandarin Oriental was frequented by Somerset Maugham, Conrad, and Coward. White gloves, silver tea service, open-sided room facing Chao Phraya River. Bangkok's single most refined afternoon tea experience.",
    book: "Reservation essential — weeks in advance for weekend. Business casual dress. The signature 'Writer's Afternoon Tea' set includes Thai-inspired sweets alongside British classics.",
  },
  {
    name: "Blue Elephant Royal Thai High Tea",
    emoji: "🐘",
    area: "Sathorn Road (former Prime Minister's residence)",
    price: "฿990–1,490 per person",
    why: "High tea with a Thai twist — in a magnificent 1903 colonial mansion. Thai sweets (mango sticky rice, pandan coconut custard) alongside French pastries, finger sandwiches. Thai iced tea and hot tea served. The palace-like setting makes this Bangkok's most dramatic afternoon tea environment.",
    book: "Same-day booking sometimes possible. The restaurant doubles as a Thai cooking school — classes available in the morning before tea.",
  },
  {
    name: "Sky Bar High Tea (With Views)",
    emoji: "🌆",
    area: "Various rooftop hotels",
    price: "฿800–2,000 per person",
    why: "Several Bangkok rooftop venues offer afternoon tea service (3–5pm) with city views. Capella Bangkok, Rosewood Bangkok, and SO/Bangkok all offer afternoon tea programs. Combining the 'tea experience' with Bangkok's skyline creates a distinctly Bangkok-only afternoon tea.",
    book: "Best value: weekday afternoon tea when hotel restaurants are less crowded. The Rosewood Bangkok afternoon tea has earned particularly strong reviews for pastry quality.",
  },
];

export function BangkokHighTea() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🫖 High tea in Bangkok — Mandarin Oriental, Blue Elephant & rooftop settings
      </div>
      <div className="space-y-2">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{v.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{v.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-rose-700">📞 {v.book}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
