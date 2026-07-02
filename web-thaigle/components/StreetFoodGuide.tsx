const DISHES = [
  { name: "Pad Thai", price: "฿50-80", where: "Any noodle stall", safe: true, spicy: false, emoji: "🍜" },
  { name: "Som Tum", price: "฿40-60", where: "Green papaya stalls", safe: true, spicy: true, emoji: "🥗" },
  { name: "Mango Sticky Rice", price: "฿60-100", where: "Fruit stalls, markets", safe: true, spicy: false, emoji: "🥭" },
  { name: "Satay Skewers", price: "฿30-50", where: "Night markets, MBK", safe: true, spicy: false, emoji: "🍡" },
  { name: "Boat Noodles", price: "฿15-30", where: "Floating boat carts", safe: true, spicy: false, emoji: "🫙" },
  { name: "Pad Kra Pao", price: "฿50-80", where: "Rice + stir fry stalls", safe: true, spicy: true, emoji: "🌶️" },
];

export function StreetFoodGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-sm font-black mb-1">🛺 Bangkok Street Food Starter Pack</div>
      <p className="text-xs text-[var(--muted)] mb-3">Safe dishes for first-timers — ordered from least to most adventurous</p>
      <div className="space-y-2">
        {DISHES.map((d, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <span className="text-lg shrink-0">{d.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">{d.name}</div>
              <div className="text-xs text-[var(--muted)]">{d.where}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-bold text-green-700">{d.price}</div>
              {d.spicy && <div className="text-[10px] text-red-600 font-bold">🌶️ spicy</div>}
            </div>
          </div>
        ))}
      </div>
      <a href="/restaurants/cuisine/street_food" className="mt-3 block text-center text-xs font-bold text-orange-600 hover:underline">
        Find street food near you →
      </a>
    </div>
  );
}
