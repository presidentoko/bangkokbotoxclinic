const SPOTS = [
  {
    name: "Private Room Karaoke (Noraebang/KTV style)",
    emoji: "🎤",
    area: "Thonglor (Korean-style), Asoke, Ratchada, Chinatown, throughout Bangkok",
    price: "Private room ฿300–800/hour (4–8 people); Song credits included; Drinks sold separately",
    why: "Karaoke in Bangkok comes primarily in the private room format (influenced by Korean noraebang and Japanese karaoke box culture) — your group rents a soundproofed room with a large screen, touchscreen song selection system, and microphones for a per-hour fee. Thai karaoke culture is deeply embedded in social life — birthday celebrations, team outings, family nights, and friend gatherings all use karaoke venues. The selection spans Thai pop (major), K-pop (popular with young Thais), English pop and rock, Japanese, and Chinese songs. Food and drinks can typically be brought in or ordered from the venue's menu.",
    tip: "Bangkok karaoke practical tips: the Thonglor area has the highest concentration of Korean-influenced noraebang-style private rooms (catering to Bangkok's large Korean expat community). Prices are typically per-room per-hour — cost per person decreases with more people in the room. Minimum spend: most venues have a minimum purchase (usually 1 drink per person or a minimum room fee). Song selection quality: Korean brand karaoke machines (Kumyoung, TJ Media) have better Korean and English catalogs. For Thai songs: the local TJ Karaoke systems have the most complete Thai popular music library. Book ahead on weekends — prime slots fill quickly.",
  },
  {
    name: "Thai KTV Culture & Open Karaoke Bars",
    emoji: "🎵",
    area: "Nana area, Patpong Soi 2, Silom entertainment strip, Pattaya (day trips)",
    price: "KTV lady drinks ฿200–400; Room fees vary; No-hostess venues ฿300–700/hour",
    why: "Bangkok's KTV (karaoke TV with hostess) entertainment culture is distinct from family-friendly private room karaoke — these venues (concentrated around entertainment districts) offer karaoke with female companions hired for company and drinks. This is culturally accepted Thai entertainment (particularly for groups of businessmen or groups of Thai men) but the context is important to understand: it's commercial social entertainment, not inherently connected to other adult services. The experience is primarily consumed by Thai domestic business entertainment, Chinese business visitors, and regional tourists who are familiar with the format from their home countries.",
    tip: "Bangkok entertainment district navigation: for international visitors, understanding the distinction between private room karaoke (family-friendly, any group) and KTV hostess bars (commercial entertainment) prevents accidental venue confusion. Tourist-facing areas like Thonglor and Ari karaoke venues are overwhelmingly private room format without hostess elements. The Nana and Patpong areas have both formats — make clear when searching which you're looking for. For cultural immersion: witnessing Thai-style group karaoke at a Thai family karaoke venue (grandparents, parents, and children singing together) is an authentic Bangkok cultural experience — ask Thai friends if they'd be willing to share.",
  },
  {
    name: "Singing Lessons & Vocal Coaching",
    emoji: "🎼",
    area: "Music schools (Yamaha, local), private voice coaches throughout Bangkok",
    price: "Private singing lesson ฿800–2,500/hour; Group class ฿400–900",
    why: "Bangkok's music education infrastructure supports vocal coaching — from commercial singing lessons (preparation for Thailand's Got Talent style competitions and the incredibly popular Thai 'academy-format' talent shows) to classical Western voice training and contemporary pop/rock vocal technique. Yamaha Music Thailand has locations throughout Bangkok with vocal programs. Independent vocal coaches (many trained at Berklee, Trinity College London, or Australian conservatories) offer private lessons particularly in the Sukhumvit area. Thai pop music's vocal style has distinctive techniques (certain glottal ornaments, specific vibrato use) that Western-trained singers interested in Thai music seek to learn.",
    tip: "Bangkok vocal coaching finding: look for coaches who specify their background and technique system (Western classical, contemporary commercial music, or Thai pop style) — the approaches are genuinely different and the right coach depends on your goals. For recreational improvement before karaoke competitions or performances: 8–10 lessons can dramatically improve confidence and basic technique. Thai music schools: the Mahidol University College of Music (Salaya campus) has public evening and weekend programs for non-degree students. For children's singing: the Thai competition music culture for children is intense — piano and singing competitions are major events — most Bangkok music schools cater heavily to this market.",
  },
];

export function BangkokKaraoke() {
  return (
    <div className="rounded-2xl border border-pink-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-800 mb-3">
        🎤 Karaoke in Bangkok — private rooms, Thai KTV culture & vocal coaching
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-pink-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
