const ORGS = [
  {
    name: "Elephant Nature Park (Chiang Mai coordination from Bangkok)",
    emoji: "🐘",
    area: "Coordination office in Bangkok, program in Chiang Mai",
    duration: "1 day to 1 month",
    price: "฿2,500–5,000/day (includes accommodation + meals at sanctuary)",
    why: "Thailand's most respected elephant sanctuary. Rescue, rehabilitate, and care for formerly abused elephants. Genuine conservation work — no elephant riding. Highly structured volunteer program with training.",
    how: "Book via official website (elephantnaturepark.org). Bangkok office handles registration. 1-week programs most impactful. International volunteers welcome year-round.",
  },
  {
    name: "Habitat for Humanity Thailand",
    emoji: "🏠",
    area: "Various sites outside Bangkok (Kanchanaburi, Ratchaburi)",
    duration: "2 weeks minimum",
    price: "Free (you pay your own food/accommodation)",
    why: "Building homes for low-income Thai families. Physical construction work alongside local families. No special skills required — enthusiasm and willingness to work. Highly impactful and tangible results.",
    how: "Register at habitat.or.th (Thailand Habitat). Group builds organized quarterly. Individuals can join scheduled group builds. Bangkok-based coordination meeting before each build trip.",
  },
  {
    name: "Bangkok Street Cats & Dogs (Network)",
    emoji: "🐱",
    area: "Bangkok community centers and shelters",
    duration: "Single day sessions",
    price: "Free",
    why: "Network of independent shelters for stray dogs and cats. Volunteer by feeding, bathing, socializing animals, or helping with adoption events. Low commitment — good for shorter visits. Very easy to join.",
    how: "Search 'Bangkok Animal Shelter Volunteer' on Facebook — several active groups with weekly sign-up. Lanta Animal Welfare and CARE Bangkok both have structured one-day volunteer programs.",
  },
];

const ETHICAL_TIPS = [
  "Avoid 'voluntourism' that displaces local workers — ask what specific skill gap you fill",
  "Elephant sanctuaries: riding = bad, walking = acceptable, bathing = acceptable",
  "Orphanage volunteering: most legitimate NGOs don't accept short-term volunteers with children",
  "Teaching English: minimum 2-week commitment to not disrupt students' learning",
  "Research any org you volunteer with — legitimate ones have traceable registration",
];

export function BangkokVolunteer() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🤲 Volunteering in Bangkok — ethical ways to give back while traveling
      </h2>
      <div className="space-y-2 mb-3">
        {ORGS.map((o) => (
          <div key={o.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{o.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{o.duration} · {o.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-emerald-700">💡 {o.how}</div>
          </div>
        ))}
      </div>
      <details className="border border-emerald-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-emerald-700 hover:bg-emerald-50">
          Ethical volunteering tips — avoid voluntourism
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {ETHICAL_TIPS.map((t) => (
            <li key={t} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-emerald-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
