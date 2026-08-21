const INGREDIENTS = [
  {
    eng: "Fish Sauce",
    thai: "น้ำปลา (Nam Pla)",
    use: "Salt substitute in almost every Thai dish. Adds umami depth.",
    where: "Every supermarket. Brand: Tiparos or Squid Brand.",
    price: "฿25–50 (small bottle)",
    emoji: "🐟",
  },
  {
    eng: "Galangal",
    thai: "ข่า (Kha)",
    use: "Tom kha soup essential. Similar to ginger but more piney/citrusy.",
    where: "Fresh markets, Or Tor Kor Market.",
    price: "฿20–40 per piece",
    emoji: "🌿",
  },
  {
    eng: "Kaffir Lime Leaves",
    thai: "ใบมะกรูด (Bai Makrut)",
    use: "Aromatic leaf for tom yum, curries, stir-fries. Essential Thai flavor.",
    where: "Any fresh market. Buy 10 leaves at once (฿5–10).",
    price: "฿5–20",
    emoji: "🍃",
  },
  {
    eng: "Thai Basil",
    thai: "กะเพรา (Kaprao)",
    use: "Pad kaprao (holy basil stir-fry) — Bangkok's most ordered dish. Distinctive peppery-clove flavor.",
    where: "Every market and some supermarkets.",
    price: "฿5–20 per bunch",
    emoji: "🌱",
  },
  {
    eng: "Lemongrass",
    thai: "ตะไคร้ (Takrai)",
    use: "Tom yum, green curry paste, grilled meats. Citrus-herbal aroma.",
    where: "Fresh markets, Tops Supermarket, Villa Market.",
    price: "฿10–30 per 3 stalks",
    emoji: "🌾",
  },
  {
    eng: "Palm Sugar",
    thai: "น้ำตาลปึก (Nam Tan Peep)",
    use: "All Thai desserts and many sauces. Less sweet than white sugar, butterscotch notes.",
    where: "Supermarkets and traditional markets. Sold in discs.",
    price: "฿30–60 for 500g",
    emoji: "🟤",
  },
];

export function BangkokThaiCookingIngredients() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌿 Thai cooking ingredients — what to buy and use
      </h2>
      <div className="space-y-1.5">
        {INGREDIENTS.map((i) => (
          <div key={i.eng} className="border border-green-100 rounded-xl px-3 py-2 flex items-start gap-2">
            <span className="text-xl shrink-0">{i.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-[11px]">{i.eng}</span>
                <span className="text-[10px] text-[var(--muted)] italic">{i.thai}</span>
              </div>
              <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.use}</div>
              <div className="text-[10px] text-green-700">Where: {i.where}</div>
            </div>
            <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
