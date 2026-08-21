const SPOTS = [
  {
    name: "Bangkok Board Game Cafés & Tabletop Scene",
    emoji: "🎲",
    area: "Board game cafés across Bangkok: Dice & Dine (Thonglor), Monster Garden (Asok), Cardboard Society (Ari), various mall-based board game cafés at major shopping centers throughout Bangkok",
    price: "Board game café entry (unlimited game access): ฿150–300 per person; With food/drinks order: ฿300–600/person; Private room booking (for group): ฿500–2,000; Board game purchase (hobby shops): ฿500–4,000; Game café monthly membership: ฿500–1,500",
    why: "Bangkok's board game café scene has grown into a substantial and thriving subculture — driven by Thai millennials and the international expat community who share enthusiasm for modern hobby board games. Bangkok board game cafés typically maintain libraries of 500–2,000+ games spanning the full spectrum from classic gateway games (Catan, Ticket to Ride, Codenames) through medium-weight Euro games (Wingspan, Pandemic Legacy, Terraforming Mars) to heavy strategy games (Twilight Imperium, Root, Gloomhaven). The board game café model (pay entry, play from the library, order food and drinks) has proven particularly successful in Bangkok's social culture — providing an alternative to bar/nightclub socializing that appeals to groups who want conversation-based interaction rather than music-volume environments. Thai-language versions of popular games are available, but most serious Bangkok board game cafés stock English-language editions of hobby games that the international community plays.",
    tip: "Bangkok board game café scene: (1) Evening hours are busiest: Bangkok board game cafés peak from 6–10pm on weekday evenings and from 2–10pm on weekends; arriving during off-peak hours (weekday afternoons) means better game master assistance and faster table access; (2) Game master assistance: quality Bangkok board game cafés have English-speaking game masters (staff who know the library and can explain rules) — asking for help selecting and learning a new game is part of the service; (3) Thai-English game divide: Bangkok's board game community plays primarily in English (most hobby games publish only English editions); Thai-language versions of gateway games are available but the enthusiast community uses English editions; (4) Weeknight events: many Bangkok board game cafés host organized game nights (RPG sessions, competitive tournaments, new-release demo evenings) on specific weekdays — checking café social media pages reveals the event calendar; (5) Board game shopping: Bangkok's hobby board game retail market (ZenCon Shop, Box of Bricks, and specialty retailers near game cafés) stocks a wide range at Thai retail prices; international games are imported and priced accordingly, but the selection rivals dedicated hobby game stores in Western cities.",
  },
  {
    name: "Mahjong & Traditional Chinese Games in Bangkok",
    emoji: "🀄",
    area: "Yaowarat (Chinatown) social clubs, Thai-Chinese community centers, residential mahjong groups throughout Bangkok's Chinese community, and occasional mahjong events at Chinese cultural associations",
    price: "Mahjong lesson (introductory): ฿500–1,500; Standard mahjong set purchase: ฿800–3,000; Tournament-quality set: ฿3,000–15,000; Community mahjong participation: typically free or minimal social contribution",
    why: "Mahjong holds a deep place in Bangkok's Thai-Chinese community social culture — the game's combination of strategy, pattern recognition, social dynamics, and the satisfying tactile experience of the tiles has made it a persistent social institution across generations of Bangkok's substantial Thai-Chinese population. Bangkok's mahjong culture is less visible to outsiders than the coffee shop and bar culture, because it primarily occurs within community social clubs, residential gatherings, and Thai-Chinese association clubhouses that don't advertise publicly. The Chinese New Year period and major Thai-Chinese community celebrations provide moments when mahjong becomes more visible through public events organized by Chinese associations in Yaowarat. Beyond the traditional Thai-Chinese community, mahjong has experienced a worldwide revival driven by Hong Kong and Taiwanese media romanticizing the game — Bangkok's younger Thai-Chinese population has reconnected with the game through this broader cultural moment.",
    tip: "Bangkok mahjong community access: (1) Yaowarat connection: Chinese cultural associations in Bangkok's Chinatown (Yaowarat) are the most accessible entry point for outsiders interested in experiencing mahjong culture; cultural events during Chinese New Year and Mid-Autumn Festival sometimes include public mahjong demonstrations; (2) Mahjong variants: the mahjong played in Bangkok's Thai-Chinese community uses Chinese (Cantonese) mahjong rules rather than the riichi mahjong that has become popular internationally through Japanese anime and manga; the two games share tiles but have different rule systems; (3) Physical mahjong tiles in Bangkok: Yaowarat's Chinese supply shops carry genuine mahjong tile sets in various qualities; the full-weight tiles (heavier than plastic toy versions) and traditional bamboo-and-ivory-substitute tiles are available at Bangkok stores at competitive prices; (4) Go (weiqi): Bangkok also has a small but serious Go (weiqi) community; the Thailand Go Association organizes events and the IGoSoftware Bangkok community plays both online and at occasional in-person gatherings; (5) Thai domino variant: Pai Gow (Chinese dominoes) is also played within Bangkok's Chinese community; simpler to learn than mahjong but with the same social atmosphere.",
  },
  {
    name: "Bangkok Dungeons & Dragons & Tabletop RPG",
    emoji: "🐉",
    area: "TTRPG gaming at board game cafés (dedicated RPG evenings), online community meetings coordinated through Bangkok RPG Discord and Facebook groups, Dungeons and Dragons Meetup Bangkok group, hobby shops with gaming spaces",
    price: "D&D Beyond subscription (digital rules): free tier to ฿600/month; Core rulebooks (Player's Handbook, DM's Guide): ฿1,200–2,000 each; Dice set: ฿150–3,000 (basic to precision metal); Pre-painted miniatures: ฿150–1,000+/piece; Drop-in public session (some cafés): ฿200–500",
    why: "Tabletop role-playing games — primarily Dungeons & Dragons (D&D) 5th Edition — have experienced a massive global revival driven by streaming content (Critical Role, Dimension 20) that Bangkok's English-speaking community has fully joined. The Bangkok D&D and TTRPG community is primarily composed of expatriates, English-speaking Thai nationals, and international students — united through Discord servers, Facebook groups, and Meetup events that coordinate regular play sessions across the city. The challenge Bangkok TTRPG players face is the same as the global community: finding players who can commit to consistent weekly schedules (campaigns require 4–8+ sessions). One-shot adventures (self-contained single-session games) have become the format most suited to Bangkok's transient population mix. Board game cafés in Bangkok have begun hosting dedicated TTRPG evenings with dungeon masters who run drop-in one-shots for participants who bring only themselves and enthusiasm.",
    tip: "Bangkok TTRPG scene access: (1) Bangkok RPG Discord: the most active hub for Bangkok's TTRPG community; finding it through Facebook search ('D&D Bangkok') typically provides the current Discord invitation link; (2) One-shot vs. campaign: Bangkok's player population has high turnover (digital nomads move, expat contracts end); one-shot adventures work better for meeting the community than joining a long-term campaign as a new arrival; (3) Hobby game shops for miniatures: Bangkok has several hobby miniature shops (primarily in Ratchada and Siam Square area) that stock D&D official miniatures and TTRPG accessories at reasonable prices; (4) Language: Bangkok's TTRPG community plays entirely in English; Thai-language TTRPG communities exist but are smaller and separate; (5) The Bangkok TTRPG experience difference: playing D&D with a diverse international group in Bangkok — with players from 10+ nationalities at the same table — creates a distinct cultural experience that differs from same-nationality home group gaming; the cross-cultural creative collaboration at these sessions reflects Bangkok's international community character.",
  },
];

export function BangkokBoardgame() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🎲 Bangkok gaming culture — board game cafés, mahjong & tabletop RPG scene
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-violet-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
