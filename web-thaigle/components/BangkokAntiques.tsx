const SPOTS = [
  {
    name: "Chatuchak Weekend Market — Antique Zone",
    emoji: "🏺",
    area: "Section 1 & 26, Chatuchak",
    days: "Sat–Sun 9am–6pm",
    price: "Wide range ฿200–200,000+",
    why: "Thailand's premier antique hunting ground. Sections 1 and 26 specialize in Buddha statues, old ceramic, lacquerware, colonial furniture, teak wood carvings, silver jewelry, and Indochina artifacts. 200+ dedicated antique vendors.",
    tip: "Arrive before 10am for best selection before tourist surge. Bargaining expected — start at 50-60% of first price. Authentic antiques need export permits from the Fine Arts Department. Beware 'new antiques' (modern pieces aged to look old).",
  },
  {
    name: "River City Bangkok Shopping Complex",
    emoji: "🎨",
    area: "Si Phraya Pier, Riverside",
    days: "Daily 10am–10pm",
    price: "Mid-high: ฿5,000–500,000+",
    why: "Bangkok's upmarket antique mall. 4 floors of art galleries and antique shops. Thai, Burmese, Chinese, Khmer antiques. Auction house on premises (scheduled auctions monthly). Quality is generally authenticated. Safe for serious buyers.",
    tip: "River City is good for verified purchases with provenance documentation. Monthly auction events have good deals. Gallery-restaurant basement worth visiting. Free shuttle boat from Sathorn pier. Staff speak English, will explain pieces.",
  },
  {
    name: "Pak Khlong Talat (Flower Market) — Surrounding Area",
    emoji: "🪷",
    area: "Old City, between Saphan Phut and Pak Khlong",
    days: "Daily, morning best",
    price: "Budget antiques ฿100–5,000",
    why: "Around the famous flower market, this area has budget antique dealers, old temple artifacts (legally sold), vintage Chinese ceramics, old Thai banknotes and coins, vintage tin signs and advertising items. More authentic street prices.",
    tip: "This is where dealers buy before reselling at Chatuchak. Rougher condition items but cheaper prices. Thai language helps — English spoken sparsely. Best on weekday mornings when fresh stock arrives from countryside.",
  },
];

const TIPS = [
  "Genuine ancient Buddhas cannot legally leave Thailand without Fine Arts Department permit",
  "Safe to buy: reproductions, modern Thai art, post-1900 ceramics, vintage clothing",
  "River City = authenticated, Chatuchak = research required, street dealers = buyer beware",
  "CITES-protected: ivory, tortoiseshell, wild animal products — do not purchase even antiques",
  "Old Thai coins and paper money: safe to collect, no export restrictions",
];

export function BangkokAntiques() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🏺 Bangkok antiques & vintage shopping — where to find authentic pieces
      </div>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.days} · {s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-amber-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-amber-700 hover:bg-amber-50">
          Legal & ethical buying guide
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {TIPS.map((t) => (
            <li key={t} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-amber-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
