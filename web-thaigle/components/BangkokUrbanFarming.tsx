const SPOTS = [
  {
    name: "Rooftop Gardens & Urban Farming Communities",
    emoji: "🌱",
    area: "Chatuchak-area rooftop gardens, community garden networks, On Nut/Phra Khanong",
    price: "Community garden plots ฿500–2,000/month; Workshop ฿500–1,500",
    why: "Bangkok has an emerging urban farming movement driven by food security awareness, health consciousness, and the appeal of growing your own food in a dense city. Community gardens operate at multiple scales — building-level rooftop gardens (some condominium buildings have dedicated rooftop growing spaces), neighborhood community plots, and grassroots networks that organize shared growing spaces in vacant lots. Thai kitchen herbs (krapao/holy basil, kaffir lime, galangal, lemongrass) are ideal urban crops requiring minimal space. The COVID-19 period dramatically accelerated Bangkok urban farming interest.",
    tip: "Bangkok urban farming networks: the Bangkok Urban Farming Facebook group and related pages connect growers across the city. Community garden tours: some community farms welcome visitors — reach out through social media. Hydroponic farming has particular traction in Bangkok (year-round growing, no soil needed, balcony-compatible) — hydroponic equipment suppliers cluster around Chatuchak and Minburi. For high-rise dwellers: microgreens and sprouts (no soil, no light beyond ambient) are accessible starting points. The Agri-Nature Center (Bangkok Metropolitan Administration) runs urban farming education at multiple city sites.",
  },
  {
    name: "Bangkok Farmer's Markets & Organic Producers",
    emoji: "🥬",
    area: "Chatuchak JJ Mall organic market, Masjid Haram-area organic market, Srinakarin night bazaar",
    price: "Organic produce 2–4x conventional market prices; Farmers market: budget ฿300–800 per visit",
    why: "Organic and locally-grown food markets in Bangkok have proliferated — the JJ (Chatuchak) Organic Market (weekend mornings), Farmers Market at Central Embassy, and the Samut Prakan organic markets all connect Bangkok consumers with small-scale Thai farmers. These are genuine farmers selling their own produce, not resellers with organic-labeled imports. The market experience includes learning provenance: which region specific items come from, what growing method was used, seasonal availability of Thai specialty produce. The markets also connect urban residents with rural Thailand's food production systems.",
    tip: "Best organic market in Bangkok: the Chatuchak/JJ weekend organic section (Saturday–Sunday mornings, sections near the Or Tor Kor market side) is the most established and most diverse. Or Tor Kor Market (Kamphaengphet 1 Rd, opposite Chatuchak) is Bangkok's premier fresh produce market — not all organic but highest quality produce in the city, patronized by Bangkok's restaurant chefs. For certified organic produce delivered: Doikham and DOA Royal Project outlets in major malls carry certified highland produce. Bangkok's Grab Fresh and other platforms now carry certified organic options.",
  },
  {
    name: "Permaculture, Seed Saving & DIY Homesteading",
    emoji: "🌿",
    area: "Outskirts of Bangkok (Bang Khun Thian, Nong Khaem); rural weekend escapes within 1–2 hours",
    price: "Permaculture workshops ฿800–3,000/day; Seed saving events free–฿300",
    why: "A small but dedicated permaculture and food sovereignty movement operates at Bangkok's edges and in the surrounding provinces — workshops on composting, seed saving, natural building, and permaculture design principles are offered by a network of practitioners who've converted suburban or semi-rural plots. These spaces (often called 'farms' or 'gardens' with educational programs) also offer weekend retreats combining organic agriculture education with meditation and sustainability lifestyle exploration. The Thai Buddhist underpinning of 'sufficiency economy' philosophy (a concept promoted by the late King Bhumibol) aligns with permaculture principles — many practitioners reference this connection.",
    tip: "Finding Bangkok permaculture and sustainable farming: search Facebook for 'permaculture Thailand', 'food forest Bangkok', and 'organic farm weekend'. Seed saving in Thailand: traditional Thai seed varieties (especially rice, vegetables, and medicinal plants) are being preserved by community networks — Seedling Thailand and related groups run occasional seed exchanges. Weekend farm stays near Bangkok: Nakhon Pathom province (45–60 minutes from Bangkok) has a cluster of organic farms offering weekend experiences including planting, harvesting, and Thai cooking from farm-grown ingredients.",
  },
];

export function BangkokUrbanFarming() {
  return (
    <div className="rounded-2xl border border-green-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-800 mb-3">
        🌱 Urban farming in Bangkok — rooftop gardens, organic markets & permaculture
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-green-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
