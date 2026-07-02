const SPOTS = [
  {
    name: "Pantip Plaza & Tech Shopping Malls",
    emoji: "🖥️",
    area: "Pantip Plaza (Pratunam BTS), JIB/IT Zone in malls, Thailand Computer Shopping Center (TCSC)",
    price: "Laptop ฿15,000–80,000; Smartphone ฿5,000–60,000; Gaming peripheral ฿500–15,000",
    why: "Bangkok's technology retail market is substantial — Pantip Plaza (the IT mall near Pratunam) has been Bangkok's technology shopping hub for decades, with hundreds of shops across multiple floors covering computers, peripherals, games, software, and electronic components. Thai technology prices are generally competitive with regional markets — significantly below Australia and comparable to Singapore and Hong Kong for major brands. The Bangkok tech market serves both consumers and businesses — component resellers, system builders, and IT service providers operate from the same mall ecosystem. Gaming hardware specifically: Bangkok's gaming culture means gaming peripherals, custom mechanical keyboards, and gaming monitors are widely stocked at competitive prices.",
    tip: "Pantip Plaza reality check: the mall's reputation has evolved — some floors have moved toward more mainstream electronics and entertainment, while specialist computer shops remain concentrated on specific floors. For components and custom builds: the computer component shops (CPU, GPU, RAM, SSD, cooling) are the best value proposition at Pantip versus mainstream electronics. Price comparison: Thai e-commerce (JD Central, Lazada, Shopee) often matches or beats physical store prices for mainstream products — check online before assuming mall prices are optimal. Import and gray market: some Bangkok tech shops sell gray-market products (imported directly, bypassing Thai distributor warranty) at significantly lower prices — this requires understanding the warranty implications. The official Thai distributor warranty process and the gray-market/international warranty process are meaningfully different for complex devices.",
  },
  {
    name: "Camera & Photography Equipment",
    emoji: "📷",
    area: "Pantip Plaza camera floor, MBK camera shops, authorized dealers (Canon, Nikon, Sony showrooms)",
    price: "Entry mirrorless ฿25,000–50,000; Professional DSLR/mirrorless ฿80,000–250,000; Vintage film camera ฿3,000–80,000",
    why: "Bangkok is a viable destination for camera equipment purchase — prices for major brands (Canon, Nikon, Sony, Fujifilm, Olympus) are competitive within Asia, particularly for bodies and native lenses. The camera market divides: authorized dealers (with Thai warranty), gray market (international warranty, lower price), and used/second-hand (from dedicated camera shops and camera community Facebook groups). Film photography has seen revival in Bangkok — film cameras (from entry-level point-and-shoots to classic SLRs to Leica M bodies) appear at camera shops and through enthusiast community sales. Bangkok film photography community is active — film available at specialty camera shops and some 7-Elevens, development at several Bangkok labs (film development is genuinely accessible in Bangkok, unlike many Western cities).",
    tip: "Bangkok camera shopping strategy: the authorized dealers (Central Camera in Silom, dealers in EmQuartier) provide Thai warranty and after-sale service. Gray market: most Bangkok camera shops explicitly sell both Thai warranty and international/gray market versions — the price difference can be 10–25% for professional bodies. Used camera Bangkok: Camera community Facebook groups ('Bangkok Camera' in Thai and English) and dedicated used camera shops in Pantip have strong selection. Bangkok as a photography destination: the city's photographic diversity (markets, temples, street life, modern architecture, river life) makes Bangkok an excellent photography destination regardless of what you buy there — joining a Bangkok street photography walk or meetup introduces you to shooting locations beyond the tourist circuits.",
  },
  {
    name: "Gaming Culture & Esports in Bangkok",
    emoji: "🎮",
    area: "Esports arenas (ESEA Center, TrueArena), gaming cafes throughout Bangkok, gaming peripheral shops",
    price: "Gaming cafe hour ฿25–80; Console game ฿1,500–3,000; PC game (Steam Thai price) regional discount",
    why: "Bangkok's gaming scene has professional infrastructure — True Arena Esports Stadium (in Hua Mak) and gaming-focused spaces throughout the city support both casual and competitive gaming. Thailand's esports sector is genuine: the professional Dota 2, CS2, and League of Legends scenes have Thai teams competing at international events, and the Bangkok esports audience for international tournaments (TI Dota 2, FIBA, etc.) is substantial. Gaming cafes in Bangkok are well-maintained with high-spec machines (RTX 40-series GPUs, 240Hz monitors standard at quality cafes) at very affordable hourly rates. Steam's regional pricing makes games purchased in Thailand region-locked but significantly cheaper — many visiting gamers switch to Thai Steam accounts for purchases. Console gaming: PlayStation, Xbox, and Nintendo Switch are all mainstream in Bangkok — game libraries available at GameMartz and similar shops.",
    tip: "Bangkok gaming cafe quality: cafes near universities (Kasetsart, Rangsit area) tend to have the best machine specifications because they compete for the student market. For esports events: Bangkok hosting international tournaments (ESL, WePlay events) brings world-class competition to Bangkok at accessible ticket prices relative to Western equivalents. VR gaming: several Bangkok gaming cafes have VR sections (Quest 3 and PC VR rigs) — the VR cafe experience is accessible for visitors who don't own headsets. Regional game pricing: the Steam price difference for Thai region can be significant (40–70% off international prices for some games) — Vietnam and Indonesia regions have even lower prices, but Thai accounts are reliably accessible and mainstream.",
  },
];

export function BangkokTechShopping() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        🖥️ Tech & gaming in Bangkok — Pantip Plaza, cameras, gaming cafes & esports
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-cyan-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
