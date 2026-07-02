const SPOTS = [
  {
    name: "Bangkok Esports Scene — Professional Gaming",
    emoji: "🎮",
    area: "MBK Center (gaming floor), True Arena Esports (IMPACT Arena complex), Central Eastville",
    price: "Gaming café hourly ฿30–80; Tournament entry ฿500–5,000; Spectator entry ฿500–1,500",
    why: "Thailand is Southeast Asia's most developed esports market — Thai professional teams compete in global tournaments across VALORANT, League of Legends (LPL/LCS crossover), Mobile Legends, and ROV (Realm of Valor, a Thai-favorite MOBA with massive prize pools). True Arena in the Impact Exhibition Center hosts major international esports events including DOTA 2 tournaments and world championships. The professional infrastructure (practice houses, coaching staff, corporate sponsorships from True Corporation, AIS, and others) rivals South Korea's early esports development era.",
    tip: "Following Thai esports: the ROV Pro League (RPL) is the flagship Thai esports competition — ROV is a mobile MOBA (similar to Mobile Legends) with massive viewership and prize pools. Live events at True Arena sell out — buy tickets in advance from Ticketmelon or True Academy. Gaming cafés in Bangkok often show professional match streams on their main screens. Kaidee and Pantip IT marketplace have the hardware community. For gaming cafés: MBK 4th floor and Pratunam area have the densest concentration.",
  },
  {
    name: "Gaming Cafés & LAN Centers",
    emoji: "🖥️",
    area: "Pratunam, MBK 4F, Siam Square area; neighborhood cybercafés throughout",
    price: "Gaming seat ฿25–80/hour; Premium seats (high-end rigs) ฿60–120/hour",
    why: "Bangkok's gaming café culture is distinct from Western internet cafés — Thai gaming cafés typically feature high-end hardware (RTX 4080/4090 stations, 240Hz 1440p monitors, mechanical keyboards), VIP pod seating for teams, and social tournament areas. The café is a genuine social venue, not just a paid computer access point. Dota 2, CS2 (CS:GO), VALORANT, and ROV/Mobile Legends dominate. Gaming cafés are where Bangkok's competitive gaming community practices and socializes between ranked sessions.",
    tip: "Best gaming cafés in Bangkok: GMZ, EMS Game, and True Gaming Café chains consistently have updated hardware and well-maintained equipment. Pricing: most charge per hour with student discounts available with ID. For serious play: many Bangkok gaming cafés organize weekly internal tournaments (entry ฿50–100) — ask staff about scheduled tournaments. Network: Bangkok gaming cafés run dedicated low-latency connections optimized for esports — lower ping than home internet for many players. Snacks and drinks are available in-venue.",
  },
  {
    name: "Mobile Gaming & Street Tournament Culture",
    emoji: "📱",
    area: "Night markets, BTS concourse areas, weekend market esports zones",
    price: "Street tournament entry ฿50–200; Mobile data costs minimal",
    why: "Thai mobile gaming culture is uniquely vibrant — Free Fire (Garena), ROV, PUBG Mobile, and more recently VALORANT Mobile and Genshin Impact dominate Thai mobile gaming. Street-level mobile gaming tournaments appear at night markets and weekend events. Thai youth gaming culture centers on mobile first — the quality of mobile gaming infrastructure in Thailand (AIS and DTAC 5G networks, affordable gaming phones) rivals dedicated console or PC gaming in many contexts. Mobile esports prize pools in Thailand are in the tens of millions of baht.",
    tip: "Thai mobile gaming social media: TikTok is the dominant platform for Thai gaming content — 'gaming Thailand' hashtags surface top Thai players showing high-rank gameplay. Discord is used by organized Thai guilds and clan structures across ROV, PUBG Mobile, and Genshin. For watching Thai mobile esports: Facebook Gaming and YouTube carry ROV Pro League streams with Thai commentary. Joining Thai gaming Discord servers (many active communities for each major mobile game) is the fastest way to find players and local tournaments.",
  },
];

export function BangkokEsports() {
  return (
    <div className="rounded-2xl border border-purple-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-800 mb-3">
        🎮 Esports & gaming in Bangkok — pro scene, gaming cafés & mobile tournaments
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-purple-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
