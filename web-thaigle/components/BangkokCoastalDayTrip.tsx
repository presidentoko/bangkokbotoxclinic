const SPOTS = [
  {
    name: "Pattaya — Beach, Culture & Accessibility",
    emoji: "🏖️",
    area: "Chonburi Province, 1.5–2 hours from Bangkok via motorway",
    price: "Bus from Ekkamai ฿120–140; Hotel ฿800–15,000+; Day trip ฿500–1,500 activities",
    why: "Pattaya is Bangkok's closest beach destination — 2 hours by road or bus. The city's reputation as an entertainment town is one dimension; it also has genuinely pleasant beaches (Jomtien Beach is cleaner than central Pattaya beach), authentic Thai beach town culture, seafood restaurants, and accessible water activities (snorkeling at Koh Larn island, jet skiing, parasailing). The Pattaya area has developed significant family and cultural infrastructure beyond entertainment: the Sanctuary of Truth (wood-carved Buddhist temple palace), Pattaya Elephant Village (ethical), and the Nong Nooch Tropical Garden are genuine attractions. Thai expats living in Bangkok often use Pattaya as their regular weekend beach — knowing where they go versus where tourists go unlocks a better experience.",
    tip: "Pattaya practical navigation: avoid Walking Street (entertainment strip) if you're not interested in that scene — Jomtien area, 3km south of central Pattaya, has quieter beaches, family-friendly hotels, and a more relaxed atmosphere. Koh Larn island (20-minute boat from Pattaya pier, ฿30 each way) has multiple beaches with clear water superior to mainland — Hat Tien and Hat Samae are the less-crowded options. Transport: buses from Ekkamai (BTS On Nut area) run frequently to Pattaya — no advance booking needed. Driving: 1.5 hours via the Bang Na–Trat Expressway from Bangkok's east; parking available near beach areas. Sunday morning markets in Pattaya's residential areas serve the expat community with quality food at non-tourist prices.",
  },
  {
    name: "Hua Hin — Royal Resort Town",
    emoji: "🎪",
    area: "Prachuap Khiri Khan Province, 3–3.5 hours from Bangkok by road or train",
    price: "Train from Hua Lamphong ฿44–200; Bus ฿200–350; Night market meal ฿80–300",
    why: "Hua Hin is Thailand's original beach resort — the Thai royal family has maintained a summer palace (Klai Kangwon) here since the 1920s, and the town retains a distinctive upscale-but-unpretentious character distinct from Pattaya or tourist beach towns. The beach is 5km of clean sand with calm Gulf of Thailand water. Hua Hin's authentic charm: a proper fishing pier with seafood restaurants, a night market with genuine local food, the colonial-era Hua Hin Train Station (one of Thailand's most photographed railway buildings), and the contrast between the royal atmosphere and the accessible market town core. Golf: Hua Hin is Bangkok's golf weekend destination — Black Mountain Golf Club, Banyan Golf Club, and Sea Pines Golf Club are among Thailand's most prestigious courses.",
    tip: "Hua Hin by train: the overnight train from Bangkok (Hua Lamphong station, roughly 4 hours) is a classic Thai travel experience — second-class sleeper is clean and comfortable. The Hua Hin Train Station itself is worth a photo stop — built in 1926 with distinctive green-and-white Thai royal style. Food: the fresh seafood restaurants near the pier (Ao Hua Hin) serve the best quality at middle prices — avoid the beachfront tourist restaurants and seek the pier fish restaurants for authenticity. Hua Hin night market: the Cicada Market (Saturday/Sunday, creative market format) and the Hua Hin Night Market (daily, traditional) offer different night market experiences. Hua Hin vs. Cha-Am: Cha-Am (20km north) is where Thai families go — significantly cheaper, busier on weekends, more local atmosphere.",
  },
  {
    name: "Rayong & Ko Samet",
    emoji: "⛵",
    area: "Rayong Province, 3 hours from Bangkok; Ko Samet ferry from Ban Phe pier",
    price: "Bus to Ban Phe ฿200–300; Ko Samet ferry ฿70 each way; Bungalow ฿800–5,000",
    why: "Ko Samet (nationally designated as a marine national park) is the closest clear-water island to Bangkok — 3.5 hours from the capital, it offers white sand beaches and turquoise water that have made it the weekend escape island of choice for Bangkok residents rather than international tourists. The island is small enough to walk across but has multiple distinct beach atmospheres: the north beaches (Hat Sai Kaew) are busier with beach clubs, while the south beaches (Ao Sang Thian, Ao Wai) are quieter with fewer facilities. Rayong province mainland also has underrated seafood — Ban Phe, the ferry town, has seafood restaurants where Bangkok Thais eat before and after island trips.",
    tip: "Ko Samet weekend navigation: ferry to the island runs from Ban Phe pier — most boats go to Na Daan pier on the northern end; beach transfer from there by songthaew. The north beaches fill quickly on Saturday afternoon — arriving Friday evening or very early Saturday morning secures accommodation without the rush. National park entry fee: the ฿200 entry fee for foreigners is collected at Na Daan pier — don't pay more than this. Ko Samet accommodation booking: beach bungalows range from simple to comfortable; the best value accommodation books out 3–4 weeks ahead for high season (December–February) weekends. Glass-bottom boat trips: available at Na Daan pier for Ko Samet's surrounding reef snorkeling areas — clearer water than the beaches themselves.",
  },
];

export function BangkokCoastalDayTrip() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🏖️ Coastal escapes from Bangkok — Pattaya, Hua Hin & Ko Samet day & weekend trips
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-sky-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
