const OPTIONS = [
  {
    name: "I Tim Pad — Rolled Ice Cream",
    emoji: "🍦",
    price: "฿60–100 per portion",
    where: "Street carts at Chatuchak, Or Tor Kor, Silom area; dedicated shops in malls",
    style: "Thai-invented rolled ice cream — liquid cream base rolled on cold plate",
    why: "Bangkok's most famous street dessert export. Watch it being made — liquid poured on freezing plate, mix-ins added, rolled up. Performance-dessert at its finest.",
    tip: "Milk chocolate and banana or coconut are the most traditional flavors. Avoid the overtly Instagram versions (black charcoal, rainbow) — flavor suffers for color.",
  },
  {
    name: "Coconut Shell Ice Cream",
    emoji: "🥥",
    price: "฿40–80 for coconut bowl presentation",
    where: "Chatuchak Weekend Market Section 26, beach markets, Or Tor Kor Market",
    style: "Traditional Thai ice cream served in fresh young coconut shell",
    why: "Young coconut ice cream served in its own shell with young coconut flesh, corn, and red beans as toppings. Uniquely Thai — sweet, creamy, refreshing.",
    tip: "Request 'not too sweet' (mai wan mak). The corn and red bean toppings are traditional and delicious — don't skip them even if they look odd.",
  },
  {
    name: "After You Dessert Café",
    emoji: "🍧",
    price: "Shibuya Honey Toast ฿245–295, Kakigori shaved ice ฿195–245",
    where: "Multiple: EmQuartier, Central Embassy, Siam Paragon, Ekkamai, The Commons",
    style: "Thai-Japanese dessert café chain — Bangkok institution",
    why: "Bangkok's most popular dessert café chain. Famous for Shibuya Honey Toast (thick bread cube, ice cream, fruit). Japanese-inspired shaved ice. Long queues — go weekday.",
    tip: "Queues can be 30–60 min on weekends. EmQuartier location has pleasant rooftop seating. Best time: weekday 3–4pm.",
  },
  {
    name: "Boon Gelato",
    emoji: "🍨",
    price: "Scoop ฿80–120, Sundae ฿180–240",
    where: "Icon Siam and central Bangkok locations",
    style: "Thai-ingredient artisan gelato",
    why: "Uses Thai flavors — pandan, black sesame, lychee, young rice, nam dok mai mango. Fresh ingredients from Thai farms. One of Asia's best artisan gelato concepts.",
    tip: "Seasonal flavors change monthly. Durian gelato is genuinely excellent for durian fans. Order 3 flavors minimum to experience the range.",
  },
];

export function BangkokIceCreamGuide() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🍦 Bangkok ice cream & frozen desserts — the essential guide
      </div>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.style}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-sky-700 mb-0.5">📍 {o.where}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-orange-600">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
