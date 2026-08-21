const INFO = [
  {
    name: "Bangkok's Dating Culture — Locals & Expats",
    emoji: "💑",
    area: "Nationwide (online-first), social events in Sukhumvit, Ari, Thonglor areas",
    price: "Dating apps: free tier/premium ฿300–900/month; First date: ฿500–2,000 typical",
    why: "Bangkok's dating culture has two overlapping tracks — Thai-Thai dating (heavily influenced by family expectations, social status, and relationship formality) and international/expat dating (much more casual, app-driven, and socially open). Apps dominate initial connection: Bumble, Tinder, OkCupid, Coffee Meets Bagel, and Thai-specific apps (Grindr for LGBTQ+, Blued for gay men) all have substantial Bangkok user bases. Bangkok's social spaces (rooftop bars, co-working communities, international event meetups) create natural meeting grounds beyond apps. Thai Buddhist gender role expectations influence the dating dynamic — understanding these prevents cultural misunderstandings.",
    tip: "Bangkok dating practical notes: the 'dinner and drinks' first date is standard in Bangkok's international community — typical first date costs ฿600–2,000 for both, often split informally. For Thai-expat cross-cultural dating: communication styles differ significantly (indirect communication is culturally Thai; Thai women/men may say yes when they mean no to avoid confrontation) — patience and direct but gentle communication is key. Social circle dating: Bangkok's weekend brunch culture, sports leagues, and activity groups create natural meeting spaces beyond apps. Safety: standard digital safety practices apply — first dates in public spaces, letting someone know your location.",
  },
  {
    name: "LGBTQ+ Scene in Bangkok",
    emoji: "🏳️‍🌈",
    area: "Silom Soi 2 & 4 (gay venues), Nana area, Pride events throughout the city",
    price: "Venue entry ฿200–500 with drinks included; Pride events: free–฿1,000",
    why: "Bangkok is one of Asia's most openly gay-friendly cities — Silom Sois 2 and 4 form the core gay entertainment district with bars, clubs, and karaoke venues that have operated for decades. Bangkok's Thai culture combines Buddhist tolerance with social conservatism — public displays of affection (between any genders) draw attention, but within LGBTQ+ spaces and in Bangkok's international-facing neighborhoods, openness is the norm. Bangkok Pride (annual, typically June) is one of Southeast Asia's largest Pride events. The term 'kathoey' (ladyboy/transgender women) refers to a historically recognized third gender in Thai culture — distinct from Western trans identity frameworks.",
    tip: "Bangkok LGBTQ+ practical info: Silom Soi 2 (Telephone Pub, DJ Station) and Soi 4 (The Balcony, Bearbie) are the landmark gay venues. BTS Sala Daeng or MRT Si Lom both reach this area. Beyond Silom: Bangkok's LGBTQ+ scene extends to Nana area (transgender entertainment), Thonglor (mixed crowd gay-friendly bars), and widespread mainstream acceptance at Bangkok's international restaurants and entertainment venues. Bangkok Pride march: route varies annually — follow Bangkok Pride Facebook for current year logistics. For lesbian venues: smaller scene centered around Silom and Ekkamai; lesbian-focused events listed on Lesla Thailand social media.",
  },
  {
    name: "Social Events, Mixers & Meeting People",
    emoji: "🎉",
    area: "Internations Bangkok events, expat community social groups, regular mixer venues",
    price: "Internations events ฿400–800; Speed dating ฿600–1,200; Meetup events free–฿400",
    why: "Bangkok's expat social infrastructure makes meeting people organized and accessible — Internations Bangkok runs multiple events monthly (casual Friday drinks, professional lunches, themed parties) with a paid membership model that provides access to the vetted expat community. Bangkok Meetup.com groups organize around hobbies (hiking, language exchange, board games, photography) rather than pure social mixing. Speed dating events (English-language, organized by various Bangkok promoters) provide structured meeting opportunities for singles. Bangkok's brunch culture creates consistent weekly touchpoints for single-expat social life.",
    tip: "Best ways to meet people in Bangkok: beyond apps, the most natural way is joining activity-based communities — your yoga class, coworking space, team sports league, or language exchange group creates repeated contact that builds genuine connection. Internations Bangkok: the Ambassador membership (paid, ~฿500/month) gives event access and profile visibility — the ROI is positive for newly-arrived expats actively trying to build a social network. Speed dating in Bangkok: Eventbrite Bangkok lists these — quality varies by organizer. The most successful Bangkok social integration usually combines: 1-2 recurring activity groups + working at a social coworking space + attending events monthly.",
  },
];

export function BangkokDatingScene() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        💑 Dating & social scene in Bangkok — apps, LGBTQ+ venues & expat mixers
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-pink-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
