const OPTIONS = [
  {
    name: "MK Gold Restaurant (Thai Suki chain)",
    emoji: "🥢",
    type: "Thai suki — clear broth, seafood & vegetables",
    area: "All major malls (80+ Bangkok locations)",
    price: "Set meals ฿250–450/person. À la carte also available.",
    why: "Thailand's most beloved suki chain, operating since 1962. Chicken or seafood broth, fresh ingredients, Thai-style dipping sauce. The defining Thai interpretation of Japanese shabu-shabu.",
    tip: "Order 'MK Gold Set' for best value — includes premium ingredients. Thai suki sauce (nam jim suki) is the key flavor — use generously. Best for groups of 4+ for variety.",
  },
  {
    name: "Haidilao (Sichuan Hotpot)",
    emoji: "🌶️",
    type: "Sichuan mala hotpot — spicy red broth option",
    area: "ICONSIAM, EmQuartier, CentralWorld",
    price: "Per-person average ฿600–1,000 with drinks",
    why: "China's most famous hotpot chain now in Bangkok. Service is extraordinary — free manicures, noodle dance performance, unlimited snacks while waiting. Mala (numbing spice) broth is iconic.",
    tip: "Weekend queues are 45min–2hrs — use app to join waitlist before arriving. Spice level: order 'mild' for first timers (even mild is spicy). Tomato soup half-and-half with mala recommended.",
  },
  {
    name: "Penguin Eat Shabu",
    emoji: "🐧",
    type: "Japanese shabu-shabu — premium wagyu & seafood",
    area: "Sukhumvit Soi 55 Thong Lo area",
    price: "Set meals ฿490–890/person",
    why: "Bangkok's highest-rated Japanese-style shabu-shabu. Penguin themed but serious about quality — A5 wagyu sliced paper thin, live scallops, fresh tofu. Ponzu and sesame dipping sauces.",
    tip: "Wagyu set worth the premium — fold wagyu thin strips and cook 15-seconds only. Kombu (kelp) broth base recommended over chicken. Reservations essential on weekends.",
  },
  {
    name: "Mu Kata (Thai BBQ Hotpot Hybrid)",
    emoji: "🔥",
    type: "Mu Kata — Thai grill + soup in same pot",
    area: "Street level restaurants near Ratchadaphisek / Lat Phrao",
    price: "All-you-can-eat buffet ฿199–299/person",
    why: "Mu Kata is uniquely Thai — pork fat on a dome grill center drips into moat of broth below. Grill meats on top, cook vegetables in the broth simultaneously. Informal, fun, and delicious.",
    tip: "Most Mu Kata places are open late (until 2–3am). Look for places near Mo Chit or Victory Monument with all-you-can-eat signs. Order extra pork belly for the grill — best cut.",
  },
];

export function BangkokHotpot() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🫕 Hotpot & shabu-shabu in Bangkok — suki, mala, mu kata
      </div>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <details key={o.name} className="border border-red-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-red-50 transition">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.type} · {o.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-red-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{o.why}</div>
              <div className="text-[10px] text-red-700">💡 {o.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
