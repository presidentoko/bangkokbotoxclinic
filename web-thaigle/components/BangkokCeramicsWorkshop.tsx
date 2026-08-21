const STUDIOS = [
  {
    name: "Hand-Building Ceramics Studios",
    emoji: "🏺",
    area: "Ari, Ekkamai, Charoen Krung — creative district studios",
    price: "Workshop ฿800–2,000; Membership ฿3,000–6,000/month",
    why: "Hand-building ceramics (pinch pot, coil, slab) is more immediately accessible than wheel throwing — most workshop participants leave with a finished piece in 2–3 hours. Bangkok's studio scene in Ari and Ekkamai offers both drop-in workshops and ongoing memberships with kiln access. Glazing and bisque firing included in better studio packages.",
    tip: "If you're only doing one ceramics session in Bangkok, opt for a hand-building slab workshop — you can make a more finished-looking piece in one session than wheel throwing (which takes weeks to master). Pieces are typically fired and shipped/held for pickup within 2 weeks.",
  },
  {
    name: "Wheel Throwing Workshops",
    emoji: "🌀",
    area: "Dedicated ceramics studios with wheel rooms",
    price: "Beginner session ฿1,200–2,500 (90–120 minutes)",
    why: "Wheel throwing — centering clay on a spinning wheel and pulling up the walls — is the most cinematic ceramics experience (think Ghost). Bangkok studios offer beginner sessions where a teacher guides hand placement throughout. Very few people center well on their first attempt — the teacher's hands supplement yours. Expect to make 2–3 bowls/cylinders in a 2-hour session.",
    tip: "Wear dark, expendable clothing — wet clay stains everything. The centering stage (30 minutes of frustration) is where most beginners struggle. Instructor help is critical at this stage — don't be embarrassed to request more guidance. Most studios let beginners take home 1 fired piece from the session.",
  },
  {
    name: "Thai Ceramic Traditions",
    emoji: "🎋",
    area: "Sangkhalok (Sukhothai), Celadon (Chiang Mai) — available in Bangkok shops",
    price: "Authentic Thai ceramics ฿200–5,000+",
    why: "Thailand has a rich ceramic tradition: Sangkhalok (Si Satchanalai province), a 700-year-old tradition of brown-and-cream glazed stoneware; Celadon (northern Thailand), translucent jade-colored glaze on porcelain. Bangkok's antique markets and Chatuchak Weekend Market have the best selection. Museums: National Museum has historic Sangkhalok examples.",
    tip: "Antique Sangkhalok pieces in Chatuchak require caution — reproduction is rampant. Genuine antique pieces (Sukhothai period) can only be verified by provenance and expert appraisal. Contemporary Celadon from Chiang Mai factories is genuine, affordable, and beautiful — excellent souvenir.",
  },
];

export function BangkokCeramicsWorkshop() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-stone-700 mb-3">
        🏺 Ceramics & pottery in Bangkok — wheel throwing, hand-building & Thai traditions
      </h2>
      <div className="space-y-2">
        {STUDIOS.map((s) => (
          <div key={s.name} className="border border-stone-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-stone-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
