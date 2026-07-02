const DESSERTS = [
  {
    name: "Mango Sticky Rice (ข้าวเหนียวมะม่วง)",
    emoji: "🥭",
    season: "Best April–June (Mango season)",
    price: "Street stalls ฿50–80, Café versions ฿120–200",
    where: "Or Tor Kor Market (best quality), Hualamphong area carts, Chatuchak vendors",
    why: "Thailand's most iconic dessert. Sweet glutinous rice cooked in coconut milk, served with ripe Nam Dok Mai mango. Seemingly simple, extremely delicious.",
    tip: "Nam Dok Mai or Mahachanok mango varieties are best for sticky rice — sweeter and less fibrous. Ask 'khai mai' (fresh?) at street stalls.",
  },
  {
    name: "Bua Loi (บัวลอย)",
    emoji: "🍡",
    season: "Year-round (especially Nov–Dec Loy Krathong)",
    price: "฿40–80 per bowl",
    where: "Traditional dessert shops, Or Tor Kor Market, most Thai restaurants",
    why: "Glutinous rice balls in warm sweet coconut milk. Comes with taro, yam, or pumpkin filling. Comforting, traditional Thai dessert.",
    tip: "Bua Loi Kai Wan near Silom is considered Bangkok's best. The egg yolk variation (Bua Loi Kai) adds richness — try it once.",
  },
  {
    name: "Kanom Krok (ขนมครก)",
    emoji: "🔥",
    price: "฿20–40 for 6 pieces",
    season: "Year-round",
    where: "Weekend markets, temple fairs, street carts near schools",
    why: "Coconut pancakes cooked in cast-iron dimpled pans. Crispy outside, custard-soft inside. Best eaten hot off the pan — the best 2-minute snack in Bangkok.",
    tip: "Watch for the pan — the distinct cast-iron dimple pan is the tell. Usually sold by elderly Thai grandmothers at morning markets. Best quality at Or Tor Kor.",
  },
  {
    name: "Khanom Buang (ขนมเบื้อง)",
    emoji: "🌮",
    price: "฿30–50 for 3–4 pieces",
    season: "Year-round",
    where: "Royal Palace area vendors, temple markets, Chatuchak",
    why: "Thai crispy crepe with sweet coconut cream filling. Golden, crunchy shell with billowing meringue-like cream inside. Royal Thai tradition — recipe from ancient palace kitchens.",
    tip: "The street vendors near Wat Pho and Grand Palace are the original source. Savoury version (with shrimp) is also worth trying — different from the sweet version.",
  },
  {
    name: "Woon Gati (วุ้นกะทิ)",
    emoji: "🧊",
    price: "฿30–60 per serving",
    season: "Year-round, especially popular in summer heat",
    where: "MBK Food Court, Thai dessert shops, convenience stores (packaged version)",
    why: "Layered coconut jelly. Cool, refreshing, beautiful to look at. Multiple layers of color and texture. Perfect Bangkok heat reliever.",
    tip: "Or Tor Kor Market and the dessert shops around Siam Square have the most visually stunning versions. Also available in convenience stores as a snack (฿15 packaged version is decent).",
  },
];

export function BangkokDessertGuide() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🍮 Thai desserts in Bangkok — street sweets & where to find them
      </div>
      <div className="space-y-2">
        {DESSERTS.map((d) => (
          <details key={d.name} className="border border-pink-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-pink-50 transition">
              <span className="text-2xl shrink-0">{d.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{d.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{d.season} · {d.price}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-pink-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{d.why}</div>
              <div className="text-[10px] text-pink-700">📍 Where: {d.where}</div>
              <div className="text-[10px] text-orange-600">💡 {d.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
