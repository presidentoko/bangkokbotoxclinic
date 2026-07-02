const INFO = [
  {
    heading: "Bangkok Expat Rugby Clubs",
    emoji: "🏉",
    clubs: ["Bangkok RFC", "British Club Rugby", "Bangkok Warriors RFC", "Hash House Harriers (social running with rugby culture)"],
    why: "Bangkok has 5+ active rugby clubs with weekly training and Saturday matches. Strong expat community from UK, Australia, South Africa, New Zealand, France creates a well-organized rugby scene. Bangkok RFC is the oldest club — founded 1950. Full 15s, 7s formats, and touch rugby available.",
    join: "Facebook search: 'Rugby Bangkok', 'Bangkok RFC'. Most clubs post 'come try' sessions monthly. Trials/tryouts are informal — show up at training with boots.",
  },
  {
    heading: "Thailand 7s Tournament",
    emoji: "🏆",
    clubs: [],
    why: "Annual Thailand 7s tournament in Bangkok draws international club teams from across Asia. Held usually February–March at Pathumthani or British Club. Significant social event as well as competitive rugby. International teams from Hong Kong, Japan, Singapore, Philippines participate.",
    join: "Tournament open to registered teams. Spectator entry usually free or minimal donation. The social atmosphere with international rugby crowd is a significant draw beyond the sport itself.",
  },
  {
    heading: "Touch Rugby (Beginner-Friendly Entry)",
    emoji: "👆",
    clubs: [],
    why: "Touch rugby (no tackle, no contact) runs weekday evenings in Bangkok parks near international schools. Very welcoming to beginners, women, and non-contact sport participants. Social, light-intensity alternative to full contact rugby. British Club hosts touch rugby most Thursdays.",
    join: "Contact British Club Bangkok sports section. Touch rugby is the most accessible entry to Bangkok's rugby community — no need to have played before. All equipment (balls, bibs) provided.",
  },
];

export function BangkokRugby() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🏉 Rugby in Bangkok — expat clubs, tournaments & touch rugby
      </div>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.heading} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="font-bold text-xs">{i.heading}</div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{i.why}</div>
            {i.clubs.length > 0 && (
              <div className="text-[10px] text-[var(--muted)] mb-1">Clubs: {i.clubs.join(", ")}</div>
            )}
            <div className="text-[10px] text-green-700">🔍 {i.join}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
