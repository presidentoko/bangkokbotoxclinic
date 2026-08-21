const SPOTS = [
  {
    name: "SEA Life Bangkok Ocean World — Siam Paragon",
    emoji: "🐠",
    area: "Siam Paragon B1–B2, Pathumwan",
    price: "Adult ฿1,090; Child ฿790; Online booking discount 10–20%",
    why: "SEA Life Bangkok is the largest aquarium in Southeast Asia — 8 zones covering 30,000 species including sharks, rays, penguins, seahorses, and an impressive glass tunnel walkway under a large shark tank. Located in Siam Paragon's basement, accessible from Siam BTS. The penguin zone and underwater tunnel are the signature experiences. Consistently rated among Bangkok's top family attractions. Glass-bottom boat rides over the shark tank are an optional add-on.",
    tip: "Book tickets online 1–2 days ahead for weekend visits — the queue for walk-in tickets is long. The glass-bottom boat (฿200 extra) is 15 minutes and genuinely worthwhile for the close-up shark view from below. Arrive when it opens (10am) to beat school groups that arrive mid-morning. The penguin feeding sessions (scheduled daily — check board at entrance) are timed events worth planning around.",
  },
  {
    name: "Samut Prakan Crocodile Farm & Zoo",
    emoji: "🐊",
    area: "Samut Prakan (30 min from Bangkok)",
    price: "Entry ฿200–400; Shows included",
    why: "The world's largest crocodile farm — 100,000+ crocodiles, plus elephant, tiger, and hippo encounters. Less sophisticated than SEA Life but historically important in Bangkok's attraction landscape. Crocodile wrestling shows and feeding sessions are the main draw. Located in Samut Prakan province, easily reached from Bangkok's eastern suburb.",
    tip: "Crocodile Farm Samut Prakan: take BTS to Bang Na, then minibus or songthaew (about ฿30). Shows run every hour from 11am. Animal welfare standards vary — visit with awareness that this is an older-style attraction. The crocodile leather product shops (wallets, bags) at the exit have direct farm production without markup.",
  },
  {
    name: "Bang Kachao Natural Mangrove Exploration",
    emoji: "🌿",
    area: "Bang Krachao, Klong Toei pier (10 min by ferry)",
    price: "Ferry ฿4; Bicycle rental ฿80–100/day",
    why: "For natural aquatic environments near Bangkok, Bang Krachao's canal and mangrove ecosystem provides a fresh-water nature experience impossible within the city. Kingfishers, monitor lizards (large), freshwater fish, frogs, and mangrove plant species visible from the wooden walkways and canal banks. The mangrove forest at the south end of Bang Krachao is the most biodiverse natural habitat accessible as a Bangkok day trip.",
    tip: "Bang Krachao mangrove walk: available year-round but most lush during and just after rainy season (October–November). The bike path from the ferry landing through the orchard area to the southern mangrove takes about 45 minutes one-way. Bring water and insect repellent — the mangrove area has no facilities. Monitor lizards here are the Bengal monitor (Varanus bengalensis) — harmless but can reach 1.5m and are startling at close range.",
  },
];

export function BangkokAquarium() {
  return (
    <div className="rounded-2xl border border-blue-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-800 mb-3">
        🐠 Aquariums & nature in Bangkok — SEA Life Paragon, crocodile farm & Bang Krachao
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
