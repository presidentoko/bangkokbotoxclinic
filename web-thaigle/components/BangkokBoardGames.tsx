const VENUES = [
  {
    name: "Board Game Cafés in Bangkok",
    emoji: "🎲",
    area: "Ari, Ekkamai, Chatuchak areas",
    price: "Table fee ฿100–200/person; drinks/snacks extra",
    why: "Bangkok's board game café scene is a thriving subculture — 50+ dedicated venues citywide. Bored Games Café (Ari), Plus Ultra (Silom), Starboard (Asoke) are established players. Table fee grants access to 500–2000 titles from Catan and Ticket to Ride through complex strategy games (Twilight Imperium, Spirit Island, Gloomhaven). Staff 'game gurus' teach rules to newcomers.",
    tip: "Weekend evenings require reservation — popular tables (like Gloomhaven ongoing campaigns) book 1–2 weeks ahead. The game guru service is free — don't be embarrassed to request a full rules explanation. For groups of 3–5: Catan, Ticket to Ride, Codenames, 7 Wonders are reliable crowd-pleasers. For 2 players: Patchwork, Jaipur, Pandemic.",
  },
  {
    name: "Tabletop RPG & Wargaming Community",
    emoji: "⚔️",
    area: "Specialist shops near MBK and online community meetups",
    price: "TTRPG sessions ฿0–300; Wargaming models ฿200–5,000+",
    why: "Bangkok's tabletop RPG scene (Dungeons & Dragons, Pathfinder, Shadowrun) has grown significantly. Facebook groups organize regular campaign sessions, one-shots, and open tables. Warhammer 40K and other miniature wargame communities also active — shops near MBK Center and online communities organize painting sessions and pickup games. The community is expat-heavy but Thai gamers increasingly dominant.",
    tip: "Search 'Bangkok D&D' or 'Bangkok Warhammer' on Facebook for active groups. One-shot D&D sessions (single-session, no commitment) are the best entry point for newcomers. Bangkok board game cafés often host D&D sessions on Thursday evenings — check venue Facebook events.",
  },
  {
    name: "Magic: The Gathering & Competitive Card Games",
    emoji: "🃏",
    area: "Game shops near Central shopping areas and online community",
    price: "Card singles ฿30–5,000+; Tournament entry ฿100–500",
    why: "Magic: The Gathering is Thailand's most popular competitive card game. Bangkok has a healthy tournament scene with Friday Night Magic events at game shops and regional qualifier tournaments. Other popular games: Flesh and Blood, Pokémon TCG, One Piece TCG. Japanese language cards widely available. The competitive MTG scene produces Thai players who compete internationally.",
    tip: "MTG singles in Bangkok are reasonably priced compared to Western markets. The MTG Bangkok Facebook group posts tournament schedules and draft events weekly. Arrive early at game shops — Friday Night Magic events fill quickly.",
  },
];

export function BangkokBoardGames() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🎲 Board games in Bangkok — cafés, D&D sessions & MTG tournaments
      </div>
      <div className="space-y-2">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{v.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{v.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-green-700">💡 {v.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
