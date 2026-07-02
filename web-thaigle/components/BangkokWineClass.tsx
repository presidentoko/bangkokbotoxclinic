const VENUES = [
  {
    name: "WSET & Wine Education in Bangkok",
    emoji: "🍷",
    area: "Silom, Sukhumvit — wine education centers",
    price: "WSET Level 2: ฿12,000–18,000; Level 3: ฿22,000–35,000",
    why: "Bangkok has accredited WSET (Wine & Spirit Education Trust) courses taught in English — the globally recognized wine certification. Level 2 (introductory, 2 days + exam) through Level 4 (Diploma, near-professional level). Some Bangkok wine retailers and schools are WSET-approved providers. Useful for wine professionals, serious enthusiasts, and F&B industry workers.",
    tip: "Silom-area wine schools (Vinothèque, WSET-approved Bangkok providers) run courses quarterly. Level 2 is manageable without prior wine knowledge — expect 20–30 hours of self-study for the exam. The Level 3 certificate is valued in Bangkok's restaurant and hospitality sector — good credential for F&B career advancement.",
  },
  {
    name: "Wine Tasting Events & Masterclasses",
    emoji: "🫗",
    area: "Premium wine bars and importers — Sukhumvit, Ari, Sathorn",
    price: "Tasting event ฿600–2,500; Masterclass ฿1,200–4,000",
    why: "Bangkok's wine importer community (La Cave, Wine Connection, Vinothèque, Vinoteca) hosts regular tasting events — winery representative visits, regional showcases (Burgundy night, Champagne masterclass), natural wine introductions. These are informal enough for beginners but educational enough for enthusiasts. Typically 5–10 wines poured with food pairing.",
    tip: "Sign up for mailing lists from Bangkok's premium wine shops — event announcements often sell out within days among Bangkok's wine-enthusiast expat community. La Cave and Vinoteca typically offer the most educational event format. Wine Connection's Friday tasting events are the most accessible price point.",
  },
  {
    name: "Private Wine Education & Sommelier Sessions",
    emoji: "🎓",
    area: "Bangkok fine dining hotels and private wine consultants",
    price: "Private session ฿3,000–8,000 for 2–4 people",
    why: "Bangkok's hotel sommeliers and certified wine educators offer private tasting sessions — bring your own bottles for evaluation, learn cellaring, food pairing, or build a specific wine knowledge foundation. The Mandarin Oriental, Park Hyatt, and Rosewood Bangkok sommeliers are internationally credentialed and available for private education upon request.",
    tip: "Private sommelier education is particularly good for corporate entertaining purposes — understanding wine at the level required to entertain business clients in Bangkok's high-end restaurant scene. Bangkok's restaurant scene is increasingly sophisticated about wine — being knowledgeable is a genuine social advantage.",
  },
];

export function BangkokWineClass() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🍷 Wine education in Bangkok — WSET courses, masterclasses & private tastings
      </div>
      <div className="space-y-2">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{v.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{v.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-red-700">💡 {v.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
