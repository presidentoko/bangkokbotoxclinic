const GROUPS = [
  {
    name: "Bangkok Philosophy & Discussion Clubs",
    emoji: "🧠",
    area: "Rotating cafés and bookshops, primarily Sukhumvit and Silom",
    price: "Free or café minimum ฿80–200",
    why: "Bangkok has a small but genuinely intellectually active philosophy and discussion club scene. Socrates Café Bangkok (modeled after the international Socratic dialogue café format), debate clubs connected to the international school and university communities, and book discussion groups all operate. The cross-cultural nature of Bangkok's intellectual community — Thai academics, Western expats, Southeast Asian professionals — creates discussion contexts that don't exist in mono-cultural cities. Buddhist philosophy's living presence in Thai culture (accessible through temple visits, monks in everyday life) gives Bangkok a unique philosophical texture.",
    tip: "Finding Bangkok's intellectual/discussion community: search Meetup.com for 'philosophy Bangkok' and 'discussion group Bangkok'. The Alliance Française and British Council Bangkok host intellectual events (lectures, debates, documentary screenings) open to the public. Expat intellectual communities often form around specific topics — the 'Bangkok Investment Club', 'Bangkok Writers' Group' — searching these names on Facebook reveals the broader community of Bangkok intellectuals who gather regularly.",
  },
  {
    name: "Buddhist Dharma Talks & Temple Study",
    emoji: "☸️",
    area: "English-language dharma: Wat Mahathat, Suan Mokkh Bangkok support group",
    price: "Temple teachings free; Retreat programs ฿500–3,000",
    why: "Bangkok's Buddhist temples provide access to meditation instruction and dharma talks that are intellectually serious, not tourist-oriented. Wat Mahathat (near Sanam Luang) has a dharma study center with instruction in English for foreigners. The Suan Mokkh International Dharma Hermitage (in Chaiya, southern Thailand) runs 10-day silent retreats with Bangkok-based preparation sessions. These temple study experiences are authentically Thai Theravada Buddhism, not adapted Western mindfulness — more rigorous and culturally specific.",
    tip: "Accessing Bangkok's Buddhist teaching community: the World Fellowship of Buddhists (WFB) headquarters is in Bangkok (off Sukhumvit Soi 24) and maintains a library and lecture program with English-language resources. Wat Prayurawongsawat (near the river, on the Thonburi side) has an English-language dharma study group on weekends. For Vipassana (insight meditation) instruction: contact the Thai Meditation Society, which maintains a network of qualified English-speaking teachers.",
  },
  {
    name: "Book Clubs & Literary Communities",
    emoji: "📚",
    area: "Bookshops: Asia Books (multiple), Dasa Book Café (Sukhumvit), Kinokuniya (Siam Paragon)",
    price: "Free (community events)",
    why: "Bangkok's English-language book culture centers on a few anchor bookshops. Dasa Book Café (Sukhumvit Soi 26/28) is Bangkok's beloved secondhand English-language bookshop with a comfortable café, known as a meeting point for the reading expat community. The Bangkok Book Club and various genre-specific reading groups meet monthly. The Alliance Française library (French books, some English) and Goethe-Institut library serve their respective language communities. Bangkok's international English-language literary events attract authors on Asia book tours.",
    tip: "Bangkok book community connections: the 'Bangkok Expats Book Club' on Facebook is the largest English-language book discussion group. Dasa Book Café's notice board has book group advertisements. Bangkok's used book scene is worth exploring beyond Dasa — secondhand book stalls around Banglamphu (backpacker area) have eclectic English selections at very low prices (฿20–80 for paperbacks). The Bangkok Reading Circle meets monthly and welcomes newcomers — formed in 1920 and one of Asia's oldest continuous book clubs.",
  },
];

export function BangkokPhilosophyClub() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        🧠 Philosophy & intellectual life in Bangkok — discussion clubs, dharma study & book clubs
      </div>
      <div className="space-y-2">
        {GROUPS.map((g) => (
          <div key={g.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{g.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{g.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{g.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.why}</div>
            <div className="text-[10px] text-indigo-700">💡 {g.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
