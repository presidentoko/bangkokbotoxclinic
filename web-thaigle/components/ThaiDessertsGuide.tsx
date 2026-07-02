const DESSERTS = [
  {
    name: "Mango sticky rice",
    thai: "ข้าวเหนียวมะม่วง (khao niao mamuang)",
    emoji: "🥭",
    cost: "฿60–200",
    where: "Street stalls, Or Tor Kor market, Talad Rot Fai",
    tip: "Best in April–June (peak mango season). Mamuang Ok Rong (nam dok mai) variety is sweetest.",
  },
  {
    name: "Coconut ice cream",
    thai: "ไอติมกะทิ (Aitim gati)",
    emoji: "🥥",
    cost: "฿40–80",
    where: "Chatuchak market, street carts",
    tip: "Served in a coconut shell with toppings: roasted peanuts, corn, taro, jackfruit. Get all toppings.",
  },
  {
    name: "Tub tim grob",
    thai: "ทับทิมกรอบ",
    emoji: "💎",
    cost: "฿40–80",
    where: "Food courts, sweet shops",
    tip: "Water chestnuts in red food colouring + coconut cream + shaved ice. Refreshing in the heat.",
  },
  {
    name: "Khanom krok",
    thai: "ขนมครก",
    emoji: "🌙",
    cost: "฿20–40",
    where: "Morning markets, Chatuchak, Or Tor Kor",
    tip: "Coconut milk pancakes made fresh in cast-iron pan. Crispy outside, creamy inside. Eat immediately.",
  },
  {
    name: "Roti with banana & sweetened condensed milk",
    thai: "โรตีกล้วย",
    emoji: "🫓",
    cost: "฿30–50",
    where: "Muslim-run roti carts near temples and markets",
    tip: "Watch them stretch the dough! Add egg (฿5 extra) for the best version. Khao San Road area has many.",
  },
  {
    name: "Bua loi",
    thai: "บัวลอย",
    emoji: "🍡",
    cost: "฿30–60",
    where: "Sweet shops, Chatuchak, night markets",
    tip: "Coloured rice-flour balls in warm coconut milk with pandan. Comfort food for Thais. Underrated.",
  },
];

export function ThaiDessertsGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🍮 Thai desserts — what to try and where
      </div>
      <div className="grid gap-2">
        {DESSERTS.map((d) => (
          <div key={d.name} className="flex gap-3 border border-[var(--border)] rounded-xl p-3">
            <span className="text-2xl shrink-0">{d.emoji}</span>
            <div className="min-w-0">
              <div className="font-bold text-xs">{d.name}</div>
              <div className="text-[10px] text-[var(--muted)] mb-0.5 font-mono">{d.thai}</div>
              <div className="text-[10px] text-green-700 mb-0.5">฿{d.cost} · {d.where}</div>
              <div className="text-[10px] text-[var(--muted)] leading-snug">{d.tip}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
