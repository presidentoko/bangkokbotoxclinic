const INFO = [
  {
    name: "Chess Association of Thailand — Club Play",
    emoji: "♟️",
    area: "Sports Authority of Thailand, Huamark; café chess clubs across Bangkok",
    price: "Club membership ฿500–2,000/year; Tournament entry ฿200–500",
    why: "Chess has a legitimate competitive culture in Thailand — the Chess Association of Thailand (CAT) is affiliated with FIDE (World Chess Federation) and runs rated tournaments. Bangkok has several FIDE-rated players including national champions. The casual play infrastructure (café chess clubs, chess in parks) adds a social layer. Bangkok's international expat community adds English-speaking chess players to an already active Thai chess scene. Thailand participates in the Chess Olympiad and Asian Chess Championship.",
    tip: "Finding chess in Bangkok: the Bangkokchess Facebook group and Chess Association of Thailand's website list club meeting schedules and tournaments. Café chess: several Bangkok cafés have chess boards available (typically charging only for drinks). Emquartier mall area has had impromptu park chess games. Bangkok chess players range from recreational to serious competitive players — announcing your rating (if you have one) helps find matched games. FIDE standard time control games require a clock — most clubs have clocks; bring one if you have it.",
  },
  {
    name: "Mahjong, Go & Asian Board Games",
    emoji: "🀄",
    area: "Chinese community centers, Chinatown; Go clubs at universities",
    price: "Club membership ฿200–1,000/year; Casual café play free (buy a drink)",
    why: "Bangkok's Chinese-Thai community maintains traditional board game culture — Mahjong (primarily Chinese and Hong Kong rules in Bangkok), Go (weiqi), and Chinese chess (xiangqi) all have active communities. Mahjong parlors (private clubs) exist in the Chinatown area. Go (the ancient Chinese/Japanese abstract strategy game) has a Bangkok Go Association affiliated with the International Go Federation. University go clubs at Thammasat and Chulalongkorn accept visitors. The overlap with the Japanese expat community (Go is deeply embedded in Japanese culture) adds another community dimension.",
    tip: "Bangkok Go (weiqi): the Bangkok Go Association meets weekly — check their Facebook page for current meeting location. For beginners: online go servers (KGS, OGS) allow remote practice against Bangkok players even before joining in-person. Mahjong in Bangkok: the community is primarily Chinese-speaking — bringing a Thai-Chinese or Chinese-speaking friend helps with initial integration. Yaowarat (Chinatown) teahouses sometimes have mahjong groups playing in back rooms — ask respectfully. Xiangqi (Chinese chess) is commonly played on wooden boards in public parks in the Chinatown area — impromptu games with local players are possible.",
  },
  {
    name: "Bridge & Card Game Clubs",
    emoji: "🃏",
    area: "Bangkok Bridge Club (several venues), hotel function rooms",
    price: "Session fee ฿100–300; Duplicate bridge tournament entry ฿200–500",
    why: "Bridge has a long-established expat community in Bangkok — the Bangkok Bridge Club (one of Southeast Asia's oldest) runs duplicate bridge sessions multiple times weekly. The membership is primarily older expat and Thai professional demographics. Card game culture in Bangkok extends to poker (home games are common in expat communities; poker rooms in Macau-connected venues exist) and Uno/casual games at Bangkok's board game cafés. The bridge community provides social connection for newly arrived expats who play the game.",
    tip: "Bangkok Bridge Club: their schedule is online — they run duplicate bridge (pairs and teams) at regular venues. Visitors with bridge experience are welcome to join sessions — announce yourself as a visitor at the start. For poker: home game networks operate through Bangkok expat communities (Bangkok Poker Players Facebook group). Board game cafés (Meeple Café, Game Over Bangkok, and others) have extensive library games available with hourly rates — Catan, Wingspan, Pandemic, and many others available for café patrons.",
  },
];

export function BangkokChessClub() {
  return (
    <div className="rounded-2xl border border-gray-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
        ♟️ Board games in Bangkok — chess clubs, Mahjong, Go & bridge communities
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-gray-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-gray-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
