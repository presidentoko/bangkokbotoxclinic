const FRUITS = [
  {
    name: "Durian (ทุเรียน)",
    emoji: "🟡",
    season: "May–August",
    price: "฿100–400/kg depending on variety",
    smell: "Very strong — banned on BTS and many hotels",
    taste: "Custard-like, creamy, complex. Polarizing — you'll love it or hate it.",
    where: "Or Tor Kor Market (best quality Monthong and Musang King varieties). Any fruit stall.",
    tip: "Try Monthong first (milder). Musang King is richer and more expensive. Eat at the market — don't take on public transit.",
  },
  {
    name: "Mango (มะม่วง)",
    emoji: "🥭",
    season: "March–June (peak), some year-round",
    price: "Nam Dok Mai mango: ฿60–120/kg. Mango sticky rice: ฿80–150",
    smell: "Fragrant, tropical",
    taste: "Nam Dok Mai: floral, sweet, incredibly aromatic. Much better than export mangoes.",
    where: "Everywhere. Mango sticky rice (khao niao mamuang): street stalls, 7-Eleven sells in cups.",
    tip: "Nam Dok Mai variety is the gold standard. Avoid green hard mangoes (those are eaten with chili salt — also delicious).",
  },
  {
    name: "Rambutan (เงาะ)",
    emoji: "🔴",
    season: "May–September",
    price: "฿30–60/kg",
    smell: "Mild, floral",
    taste: "Lychee-like but milder. Juicy, slightly acidic flesh. Very refreshing.",
    where: "Street fruit stalls, floating markets, supermarkets",
    tip: "Look for bright red skin. Open by scoring the skin with a fingernail and peeling. Avoid the inner seed.",
  },
  {
    name: "Dragon Fruit (แก้วมังกร)",
    emoji: "🐉",
    season: "Year-round",
    price: "฿40–80/kg",
    smell: "Mild, neutral",
    taste: "Red flesh (sweeter, more flavor) vs white flesh (milder). Pink skin with green tips.",
    where: "Everywhere — very common at breakfast buffets, juice stalls, 7-Eleven",
    tip: "Red-flesh dragon fruit has far more flavor than white. Ask for 'dragon fruit red flesh' (แก้วมังกรเนื้อแดง).",
  },
  {
    name: "Green Papaya / Som Tam Papaya (มะละกอ)",
    emoji: "🟩",
    season: "Year-round",
    price: "Som Tam salad using it: ฿50–80",
    smell: "Mild when green, fragrant when ripe",
    taste: "Ripe: sweet, soft. Green (unripe): crunchy, tart. Used in famous som tam salad.",
    where: "Ripe papaya: fruit stalls. Green papaya: som tam vendors everywhere in Bangkok.",
    tip: "Green papaya is eaten in som tam (shredded papaya salad) — completely different from ripe papaya. Both are worth trying.",
  },
];

export function BangkokThaiFruitGuide() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🍉 Thai tropical fruit guide — what to try in Bangkok
      </div>
      <div className="space-y-2">
        {FRUITS.map((f) => (
          <details key={f.name} className="border border-yellow-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-yellow-50 transition">
              <span className="text-2xl shrink-0">{f.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{f.name}</div>
                <div className="text-[10px] text-[var(--muted)]">Season: {f.season}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{f.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-yellow-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">Taste: {f.taste}</div>
              {f.smell !== "—" && <div className="text-[10px] text-yellow-600">👃 Smell: {f.smell}</div>}
              <div className="text-[10px] text-orange-600">📍 Where: {f.where}</div>
              <div className="text-[10px] text-[var(--muted)]">💡 {f.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
