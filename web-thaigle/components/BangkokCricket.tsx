const INFO = [
  {
    heading: "Bangkok Cricket Association & Clubs",
    emoji: "🏏",
    content: "Bangkok has an organized cricket community through the Cricket Association of Thailand (CAT). Regular league cricket every weekend, October–April (cool/dry season). Bangkok expat clubs include Bangkok Cricket Club (oldest), Wanderers CC, and Thai-Pakistani community teams. Grounds: Asian Institute of Technology (Pathumthani), British Club, and Bangkok Patana School fields.",
    contact: "Cricket Association of Thailand (CAT) website + Facebook. Most clubs welcome visiting cricketers — email ahead to arrange a game.",
  },
  {
    heading: "Cricket's Social Scene in Bangkok",
    emoji: "🤝",
    content: "Bangkok cricket is dominated by the South Asian expat community (Pakistani, Indian, Sri Lankan, Bangladeshi) with British, Australian, and New Zealand expats mixed in. Post-match social at the British Club or sports bar is as important as the cricket. Thai players increasingly joining through school programs and CAT development initiatives.",
    contact: "Facebook search 'Bangkok Cricket' for current clubs and fixtures. Pakistani Business Council sometimes sponsors cricket events in Bangkok.",
  },
  {
    heading: "Watching Cricket in Bangkok",
    emoji: "📺",
    content: "Major cricket (IPL, international tests, World Cup) screened at Irish/British pubs: Bull's Head (Sukhumvit 33/1), The Londoner (Silom), O'Reilly's. IPL in particular draws significant viewership from the South Asian expat community. Live streaming parties sometimes organized by cricket clubs at South Asian restaurant venues.",
    contact: "UK Sports Bar Bangkok has comprehensive cricket coverage during major tournaments.",
  },
];

export function BangkokCricket() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🏏 Cricket in Bangkok — expat clubs, CAT league & where to watch
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.heading} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="font-bold text-xs">{i.heading}</div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{i.content}</div>
            <div className="text-[10px] text-green-700">🔍 {i.contact}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
