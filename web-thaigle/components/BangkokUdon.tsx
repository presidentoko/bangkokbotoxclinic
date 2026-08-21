const SPOTS = [
  {
    name: "Marugame Udon (Chain) — Bangkok",
    emoji: "🍜",
    area: "The Street Ratchada, Emporium, Central WOrld, 10+ locations",
    price: "Sanuki udon ฿100–200; Tempura add-ons ฿30–80",
    why: "Japanese chain specializing in Sanuki-style udon (thick, chewy wheat noodles from Kagawa Prefecture). Self-service cafeteria format — watch noodles being pressed and cut fresh. Bangkok locations maintain the same standard as Japan. Kake udon (hot dashi broth), cold zaru udon (dipping), and curry udon available. The tempura bar adds shrimp, vegetable, and karaage options.",
    tip: "Order kakeudon or kake cold during Bangkok heat — cold udon with dipping sauce is more refreshing. The tempura is best eaten immediately, not after it's been sitting in a steam counter. Arrive when the shop opens — freshest noodles at opening time.",
  },
  {
    name: "Speciality Udon Restaurants",
    emoji: "🍢",
    area: "Thonglor, Ekkamai, Asoke — Japanese restaurant hubs",
    price: "Specialty udon ฿200–450",
    why: "Beyond chain udon, Bangkok's Japanese restaurant scene includes specialty udon houses: thick handmade noodles, premium dashi broth from katsuobushi and konbu, seasonal variations (curry udon in cool months, cold mazemen in summer). Some restaurants specialize in Inaniwa-style (thinner, silkier) or Nabeyaki udon (hot pot in earthenware). The udon specialist shops serve a very different experience from chain udon.",
    tip: "Nabeyaki udon (individual earthenware pot with udon, egg, shrimp tempura, mushrooms, fish cake) is the most elaborate udon preparation — order it on a Bangkok evening when you want a warming, substantial Japanese meal. Available at proper Japanese restaurants, not chains.",
  },
  {
    name: "Yaki Udon & Udon Variations",
    emoji: "🔥",
    area: "Izakayas and Japanese gastropubs",
    price: "Yaki udon ฿150–280",
    why: "Yaki udon (stir-fried udon with vegetables, meat, soy-mirin sauce) is available at Bangkok izakayas alongside standard noodle dishes. Closer to Thai-influenced cooking in technique but unmistakably Japanese in flavor. Carbonara udon (a Japan-invented cream sauce udon) has also appeared at Bangkok's more creative Japanese restaurants.",
    tip: "Yaki udon at Bangkok izakayas is often the best dish for introducing Japanese food to friends unfamiliar with it — stir-fried, meaty, flavorful. The noodle's chewiness is more interesting than standard pasta. Add onsen egg on top for a richer experience.",
  },
];

export function BangkokUdon() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🍜 Udon in Bangkok — Sanuki noodles, Marugame chain & specialist shops
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
