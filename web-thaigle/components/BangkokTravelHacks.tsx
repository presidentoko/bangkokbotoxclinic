const HACKS = [
  {
    category: "Transport",
    emoji: "🚗",
    tips: [
      "BTS + Grab combo beats taxi for most Bangkok trips — BTS to nearest station, Grab for last mile",
      "Motorcycle taxi (orange vest) for solo short distances: ฿15–50, fastest in traffic",
      "Airport Rail Link + BTS saves ฿200+ vs taxi from Suvarnabhumi when traveling with carry-on only",
      "Avoid taxis from airport without meter — always insist on meter or use Grab instead",
      "BTS Rabbit Card (฿100 deposit) is faster than buying per-trip tickets and gives 15% discount",
    ],
  },
  {
    category: "Money",
    emoji: "💵",
    tips: [
      "ATMs charge ฿220 per withdrawal — minimize withdrawals, use ATMs inside 7-Eleven or Bangkok Bank",
      "True Money Wallet or Rabbit Line Pay: load with cash, use QR code payments to skip ATM fees",
      "Exchange booths at Siam Square, Silom, and Khaosan rate significantly better than hotels",
      "SuperRich (orange, green): Bangkok's best official exchange rate, beat bank rates by 1–2%",
      "Credit card widely accepted in malls/restaurants — avoid 'dynamic currency conversion' (DCC), always charge in Thai Baht",
    ],
  },
  {
    category: "Food",
    emoji: "🍜",
    tips: [
      "Lunch is Bangkok's best meal value: same restaurant as dinner but 30–50% cheaper",
      "Air-conditioned mall food courts: sit-down restaurant quality at street food prices (฿60–120/dish)",
      "Or Tor Kor Market: Bangkok's best quality fresh ingredients — superior to supermarket at lower prices",
      "Tell spice level in Thai: 'pet nit noi' (little spicy), 'mai ao pet' (not spicy), 'pet mak' (very spicy)",
      "7-Eleven freshly steamed buns (salapao) at ฿8 each: Bangkok's best budget breakfast or snack",
    ],
  },
  {
    category: "Weather & Comfort",
    emoji: "☀️",
    tips: [
      "Bangkok UV index 8–11 daily: SPF 50 on face, neck, and hands even for short walks",
      "Umbrella or rain jacket March–October: afternoon rain possible even in hot season",
      "Light clothes + pashmina/shawl for air-conditioning in malls, temples, and restaurants (can be cold)",
      "Dehydration happens faster than you expect — drink 2L+ water daily, more if active",
      "Avoid peak heat 11am–2pm for outdoor activities — schedule temples for 8–10am or 4–6pm",
    ],
  },
];

export function BangkokTravelHacks() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🧳 Bangkok travel hacks — transport, money & local tips that actually save you
      </h2>
      <div className="space-y-2">
        {HACKS.map((h) => (
          <details key={h.category} className="border border-indigo-100 rounded-xl overflow-hidden">
            <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-indigo-700 hover:bg-indigo-50 flex items-center gap-2">
              <span>{h.emoji}</span> {h.category} hacks
            </summary>
            <ul className="px-3 pb-3 pt-1 space-y-0.5">
              {h.tips.map((t) => (
                <li key={t} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
                  <span className="text-indigo-400 shrink-0">•</span>{t}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
