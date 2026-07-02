const SPOTS = [
  {
    name: "Lumpini Park",
    emoji: "🌳",
    area: "MRT Lumpini or BTS Sala Daeng",
    best_time: "Early morning or late afternoon (before 9am / after 4pm)",
    why: "Bangkok's largest central park. Shaded areas under large trees, clean grounds, lake views. Popular with families on weekends. Vendors sell snacks and drinks near the park entrance. Monitor lizards sunbathe around the lake — a Bangkok-only picnic companion.",
    bring: "Mat or blanket (park grounds can be damp). Insect repellent. Sun protection if not fully shaded. Thai takeaway food from nearby stalls (Silom street food street is 5 min walk).",
  },
  {
    name: "Benjakitti Forest Park",
    emoji: "🏞️",
    area: "MRT Queen Sirikit National Convention Centre",
    best_time: "Morning or early evening",
    why: "Newest large park in Bangkok. Natural forest feel with elevated boardwalk through mangroves. Less crowded than Lumpini. Beautiful lake views. Families bring children on weekends. The boardwalk elevated sections provide elevated views for photos.",
    bring: "Picnic rug — the shaded lawn areas near the lake are well maintained. ICONSIAM is 20 min by taxi — excellent food hall for pre-picnic grocery run. The park has drinking water stations.",
  },
  {
    name: "Chatuchak Park (Adjacent to Market)",
    emoji: "🌿",
    area: "BTS Mo Chit / MRT Chatuchak Park",
    best_time: "Weekend mornings before market crowds",
    why: "Green park beside the famous weekend market. Locals picnic here while others shop at Chatuchak. Shaded by mature trees. Adjacent to the botanical section. Weekend morning: peaceful before the market chaos. The Or Tor Kor premium fresh market is a short walk — outstanding picnic food sourcing.",
    bring: "Shop Or Tor Kor market for gourmet Thai produce and prepared foods — excellent for picnic spread. Then walk to the park. Bring disposable plates or reuse the containers from Or Tor Kor vendors.",
  },
];

const FOOD = [
  "Thai style: khao niao mamuang (mango sticky rice), nam daeng (fruit syrup slush), fresh fruit platters, grilled corn",
  "Premium picnic: Or Tor Kor market ready-to-eat dishes, coffee from specialty roasters, artisan Thai desserts",
  "International: Tops supermarket (Central shopping centers) has picnic-ready items: cheese, crackers, cold cuts",
  "Thai snacks: kluay thod (fried banana), taro chips, coconut jelly cups — all available from street vendors near parks",
  "Drinks: young coconut (ma phrao on orn) straight from the shell — available from vendors outside most parks",
];

export function BangkokPicnic() {
  return (
    <div className="rounded-2xl border border-lime-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-lime-700 mb-3">
        🧺 Picnic spots in Bangkok — parks, timing & what to bring
      </div>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-lime-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-lime-700">{s.best_time}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-lime-700">🧺 {s.bring}</div>
          </div>
        ))}
      </div>
      <details className="border border-lime-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-lime-700 hover:bg-lime-50">
          Best Bangkok picnic food ideas
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {FOOD.map((f) => (
            <li key={f} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-lime-400 shrink-0">•</span>{f}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
