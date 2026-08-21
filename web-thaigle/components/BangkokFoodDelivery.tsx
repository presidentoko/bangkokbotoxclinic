const APPS = [
  {
    name: "Grab Food",
    emoji: "🟢",
    market: "Largest in Thailand",
    deliveryFee: "฿15–49 flat (often free promo)",
    minOrder: "฿0 (no minimum)",
    selection: "Huge — from street food shops to Michelin restaurants",
    payment: "Card, GrabPay wallet, cash on delivery",
    tip: "Download before landing in Thailand. Subscribe to GrabUnlimited (฿59/month) for free delivery on every order.",
  },
  {
    name: "FoodPanda",
    emoji: "🐼",
    market: "2nd largest, strong in suburbs",
    deliveryFee: "฿19–59, drops with Panda Pro",
    minOrder: "฿0",
    selection: "Strong on Thai local restaurants + fast food chains",
    payment: "Card, True Money, cash",
    tip: "Often has better discounts than Grab. Panda Pro (฿99/month) = free delivery. Best for local Thai food.",
  },
  {
    name: "LINE MAN",
    emoji: "🟡",
    market: "Most popular with Thais",
    deliveryFee: "฿15–35",
    minOrder: "฿0",
    selection: "Deepest local coverage — small Thai restaurants not on Grab/Panda",
    payment: "LINE Pay, card, cash",
    tip: "If you can't find a local restaurant on Grab, it's probably on LINE MAN. Requires LINE app. Most locals use this.",
  },
  {
    name: "Shopee Food",
    emoji: "🛍️",
    market: "Growing fast, aggressive promos",
    deliveryFee: "Often free with promo codes",
    minOrder: "฿0",
    selection: "Decent — better for chain restaurants",
    payment: "Shopee Pay, card, cash",
    tip: "Best promo deals in Thailand right now. Install Shopee app, first order often free delivery + discount.",
  },
];

export function BangkokFoodDelivery() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📱 Bangkok food delivery apps — comparison
      </h2>
      <div className="space-y-2">
        {APPS.map((a) => (
          <div key={a.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{a.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{a.market}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{a.deliveryFee}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5">{a.selection}</div>
            <div className="text-[10px] text-blue-700 mb-0.5">💳 {a.payment}</div>
            <div className="text-[10px] text-orange-600">💡 {a.tip}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-2.5">
        <strong>Fast tip:</strong> Delivery in Bangkok is typically 20–45 minutes. Many condos have a lobby drop-off policy — meet the driver at the lobby. Peak hours (12–1pm, 6–8pm) add 10–15 min.
      </div>
    </div>
  );
}
