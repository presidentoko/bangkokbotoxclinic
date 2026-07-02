const SOUPS = [
  {
    name: "Tom Yum Goong (ต้มยำกุ้ง)",
    emoji: "🍤",
    type: "Spicy-sour prawn soup",
    price: "฿120–250",
    spice: "Hot (adjustable)",
    desc: "Thailand's most famous soup internationally. Clear or creamy coconut milk base. Lemongrass, galangal, kaffir lime leaves, bird's eye chili, fish sauce, lime juice.",
    must: "Tom yum nam sai (clear broth) for authentic version. Tom yum nam khon (milky) is modern. Nam sai is the original.",
    where: "Every Thai restaurant. Best at: Tom Yum Kung Pochana (Rama IX area)",
  },
  {
    name: "Tom Kha Gai (ต้มข่าไก่)",
    emoji: "🥥",
    type: "Coconut galangal chicken soup",
    price: "฿100–200",
    spice: "Mild",
    desc: "Coconut milk soup with galangal (not ginger — different root, more medicinal). Chicken, mushrooms, lemongrass. Fragrant and rich but not spicy.",
    must: "Perfect entry soup for chili newcomers. Rich, creamy, mildly sour from lime leaves.",
    where: "All Thai restaurants. Available everywhere.",
  },
  {
    name: "Khao Tom (ข้าวต้ม)",
    emoji: "🍚",
    type: "Thai rice porridge / congee",
    price: "฿60–120",
    spice: "None",
    desc: "Rice cooked down to soft porridge in clear broth. Topped with minced pork, ginger, green onion, crispy garlic. Thailand's breakfast/sick food.",
    must: "Bangkok breakfast staple. Eat at a street khao tom shop before 9am for full experience.",
    where: "Street stalls, early morning markets. Any khao tom shop (look for 'ข้าวต้ม' sign).",
  },
  {
    name: "Gaeng Jued (แกงจืด)",
    emoji: "🥣",
    type: "Mild clear tofu soup",
    price: "฿50–100",
    spice: "None",
    desc: "Light, clear pork broth with silken tofu, glass noodles, minced pork, sometimes eggs. The anti-spice antidote soup. Ordered alongside spicy dishes.",
    must: "Order alongside heavily spiced dishes to balance the meal. Very gentle on stomach.",
    where: "Thai restaurants and street stalls. Often comes as a set meal default side dish.",
  },
];

export function BangkokSoupGuide() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🍜 Thai soups guide — from fiery tom yum to gentle rice porridge
      </div>
      <div className="space-y-2">
        {SOUPS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.type} · 🌶 {s.spice}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.desc}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">⭐ {s.must}</div>
            <div className="text-[10px] text-[var(--muted)]">📍 {s.where}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
