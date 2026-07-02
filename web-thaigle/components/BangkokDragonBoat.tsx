const INFO = [
  {
    name: "Dragon Boat Racing in Bangkok",
    emoji: "🚣",
    area: "Chao Phraya River, Bang Krachao canals, various inner-city khlong (canal)",
    price: "Team registration varies; Training ฿200–500/session",
    why: "Dragon boat racing has an active community in Bangkok — international and Thai teams train on the Chao Phraya River and Bangkok's canal system year-round. The annual King's Cup Dragon Boat race and various corporate/expat team events provide competitive structure. Dragon boat requires synchronized paddling in a 10–20-person boat to a drummer's beat — fundamentally a team sport that builds community fast. Bangkok's flat water canals are ideal training conditions.",
    tip: "Finding Bangkok dragon boat: search 'Bangkok Dragon Boat Club' on Facebook — the international expat dragon boat community is active and welcomes new paddlers. No experience needed to join training sessions. Basic paddle technique is taught at the first session. Bangkok's dragon boat community is diverse — Thai, Chinese, Western, Filipino paddlers in most teams. Race events happen monthly during the racing season (October–February).",
  },
  {
    name: "Traditional Long Boat Racing",
    emoji: "⛵",
    area: "Pinklao, Nonthaburi, Bang Krachao",
    price: "Spectator: free; Team membership: ฿200–600/month",
    why: "Traditional Thai long boat racing (rua yao) is distinct from dragon boat — longer, narrower boats with 40–55 paddlers standing and rowing in Thai style. The racing season coincides with Buddhist Lent (Khao Phansa, typically July–October) when traditional river festivals include boat racing. Wat Phra Kaew and riverside temples maintain ceremonial long boats used in royal processions. The Thai community long boat clubs welcome foreigners for training.",
    tip: "Traditional long boat racing in Bangkok: the largest races are at Pinklao Bridge and Bang Krachao area during the October–November festival season. The Royal Barge Museum (Bangkok) displays ceremonial barges including Suphannahong — the most ornate ceremonial vessel. These are different from racing boats but provide historical context for the river racing tradition.",
  },
  {
    name: "Rowing at Bangkok's Canals (Khlong)",
    emoji: "🛶",
    area: "Bang Krachao (Green Lung), Lat Phrao canals",
    price: "Boat rental ฿200–500; Guided kayak tour ฿800–1,500",
    why: "Beyond competitive dragon boat, Bangkok's canal system is excellent for recreational rowing and kayaking. Bang Krachao (the mangrove island across from Klong Toei) has rental kayaks and rowboats — the canal routes through the orchard and village are genuinely peaceful and very different from urban Bangkok. Weekend kayaking in Bang Krachao is popular with Thai and expat community members as an urban escape.",
    tip: "Bang Krachao kayak rentals: available near the cross-river ferry landing on the Bang Krachao side. Best kayaking time: early morning (7–10am) before afternoon heat and when market activity is highest. The 2-hour canal circuit through Bang Krachao covers the main orchard paths, the Bang Krachao temple, and returns to the pier. Longer routes (4–5 hours) available with guide.",
  },
];

export function BangkokDragonBoat() {
  return (
    <div className="rounded-2xl border border-red-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-800 mb-3">
        🚣 Dragon boat & rowing in Bangkok — canal racing, Thai long boats & kayaking
      </div>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-red-800">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
