const DESSERTS = [
  {
    name: "Mango Sticky Rice (ข้าวเหนียวมะม่วง)",
    emoji: "🥭",
    thai: "Khao Niao Mamuang",
    season: "Best March–June (ripe mango season)",
    price: "฿60–150",
    where: "Every market, Or Tor Kor (best quality), Chatuchak",
    why: "Thailand's most famous dessert. Glutinous rice + fresh mango + coconut cream. Deceptively simple, incredibly good in season.",
  },
  {
    name: "Tub Tim Grob (ทับทิมกรอบ)",
    emoji: "💎",
    thai: "Water chestnuts in coconut milk",
    season: "Year-round",
    price: "฿30–60",
    where: "Street stalls, dessert shops",
    why: "Red jewel-like water chestnut pieces in icy coconut milk syrup. Refreshing, visually beautiful, very Thai.",
  },
  {
    name: "Khanom Buang (ขนมบ้วง)",
    emoji: "🥚",
    thai: "Thai crispy crepes",
    season: "Year-round",
    price: "฿20–50 per 3 pieces",
    where: "Wat Pho area, Chatuchak, Chinatown",
    why: "Paper-thin crispy crepes folded with sweet/savory fillings. Shredded coconut, egg yolk strands, or meringue. Street snack.",
  },
  {
    name: "Khao Tom Mad (ข้าวต้มมัด)",
    emoji: "🍃",
    thai: "Banana sticky rice parcel",
    season: "Year-round",
    price: "฿15–40",
    where: "Morning markets, 7-Eleven (surprisingly good)",
    why: "Banana + black beans inside sticky rice, wrapped in banana leaf, steamed. Portable, satisfying, ancient recipe.",
  },
  {
    name: "Bua Loy (บัวลอย)",
    emoji: "🍡",
    thai: "Rice balls in coconut milk",
    season: "Year-round (peak Loy Krathong festival)",
    price: "฿30–60",
    where: "Traditional dessert shops, temple fairs",
    why: "Soft glutinous rice dumplings in warm sweet coconut milk. Pandan (green), taro (purple), original. Most comforting Thai dessert.",
  },
  {
    name: "Thai Ice Cream Sandwich",
    emoji: "🍦",
    thai: "Ice cream cone with sticky rice bun",
    season: "Year-round",
    price: "฿20–40",
    where: "Street carts everywhere in tourist areas",
    why: "Ice cream scoop on a hot-dog bun (or coconut sticky rice roll). Unique Thai twist. Chocolate, corn, Thai tea flavors most popular.",
  },
];

export function BangkokThaiDesserts() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🍡 Thai desserts guide — sweet Bangkok
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {DESSERTS.map((d) => (
          <div key={d.name} className="border border-pink-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
            <span className="text-2xl shrink-0">{d.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs">{d.name}</div>
              <div className="text-[10px] text-[var(--muted)]">{d.thai} · {d.season} · {d.where}</div>
              <div className="text-[10px] text-[var(--fg)] mt-0.5 leading-snug">{d.why}</div>
            </div>
            <span className="shrink-0 text-[10px] font-mono text-green-700">{d.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
