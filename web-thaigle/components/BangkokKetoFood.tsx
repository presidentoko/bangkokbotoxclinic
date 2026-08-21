const PICKS = [
  {
    name: "Broccoli Revolution",
    emoji: "🥦",
    area: "Sukhumvit 49",
    price: "Keto-friendly bowls ฿290–420",
    why: "Best plant-based keto in Bangkok. Large selection of low-carb bowls and salads. Clearly labeled macros on menu. Zucchini noodles, cauliflower rice, and avocado-based dishes available.",
    tip: "Ask for 'no rice, extra greens' on any bowl. Avocado smoothie bowl (no added sweeteners) is a good keto breakfast. Free to request macros info from staff.",
  },
  {
    name: "Dean & Deluca Bangkok",
    emoji: "🥗",
    area: "CentralWorld, Siam Discovery",
    price: "Salads ฿280–480, protein plates ฿350–580",
    why: "American gourmet grocery with café. Extensive salad bar, grilled proteins, healthy-grab options. Keto-friendly labeling available on most items. Best mall option for low-carb eating.",
    tip: "Create-your-own salad with protein + fat-heavy additions. Cheese, nuts, eggs all available as add-ons. Good for quick keto lunch during shopping.",
  },
  {
    name: "Local Thai Market (Talat)",
    emoji: "🏪",
    area: "Near any BTS station — Or Tor Kor Market (Chatuchak) is best",
    price: "Grilled protein ฿50–120, larb (meat salads) ฿50–80",
    why: "Thailand's traditional food is naturally keto-friendly. Larb (minced meat salad with herbs), grilled meats, coconut-based soups (tom kha without rice). Street market is budget keto paradise.",
    tip: "Order: Gai Yang (grilled chicken) ฿60–80, Nam Tok Mu (pork salad) ฿70, Tom Kha Gai (coconut chicken soup) ฿60 — skip the rice, full keto naturally. Zero carb labeling not available but ingredients are obvious.",
  },
];

const THAI_KETO = [
  "Tom Kha Gai (coconut chicken soup) — naturally keto with no rice",
  "Larb (minced meat salad) — protein + herbs, skip the sticky rice side",
  "Gai Yang (grilled chicken) — no carbs, rich protein",
  "Yam Nuea (beef salad) — lean protein + herbs, very low carb",
  "Pad Prik Khing (dry curry) — skip rice, eat the stir-fry alone",
  "Moo Ping (grilled pork skewers) — street food, pure protein",
];

export function BangkokKetoFood() {
  return (
    <div className="rounded-2xl border border-lime-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-lime-700 mb-3">
        🥩 Keto & low-carb eating in Bangkok — what to order
      </h2>
      <div className="space-y-2 mb-3">
        {PICKS.map((p) => (
          <div key={p.name} className="border border-lime-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-lime-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-lime-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-lime-700 hover:bg-lime-50">
          Naturally keto Thai dishes — skip the rice
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {THAI_KETO.map((d) => (
            <li key={d} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-lime-400 shrink-0">•</span>{d}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
