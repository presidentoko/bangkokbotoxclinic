const CATEGORIES = [
  {
    type: "Fashion & clothes",
    emoji: "👗",
    best: ["Chatuchak Weekend Market (vintage, local designers)", "Platinum Fashion Mall (bulk wholesale prices)", "Central World / EmQuartier (brands)"],
    tip: "Chatuchak Section 26 = best vintage. Platinum is wholesale — buy 3+ pieces for best rates. Bargaining common in markets only.",
  },
  {
    type: "Electronics & tech",
    emoji: "💻",
    best: ["MBK Center 4th floor (phones, cameras)", "Pantip Plaza (computers, software)", "JD Central (online — best prices)"],
    tip: "MBK is fine for accessories. For major purchases, prices aren't necessarily lower than home. Check warranties.",
  },
  {
    type: "Thai souvenirs & gifts",
    emoji: "🪆",
    best: ["Or Tor Kor Market (food souvenirs)", "Chatuchak (handmade crafts)", "Narayana Phand (government handicrafts)"],
    tip: "Narayana Phand on Ratchadamri has quality-controlled Thai handicrafts at fair prices. No bargaining needed.",
  },
  {
    type: "Spa products & skincare",
    emoji: "🧴",
    best: ["Boots Thailand (affordable, reliable)", "Eveandboy (Thai beauty)", "Watsons (skincare brands)"],
    tip: "Snail cream, collagen masks, whitening products — massive selection, 30–50% cheaper than back home.",
  },
  {
    type: "Thai silk & textiles",
    emoji: "🧵",
    best: ["Jim Thompson flagship store (Surawong)", "Chatuchak market", "Pratunam Market"],
    tip: "Jim Thompson is the most reliable for quality Thai silk. Worth the premium. Check the Surawong factory outlet.",
  },
  {
    type: "Street fashion (knock-offs)",
    emoji: "👟",
    best: ["MBK 4th floor", "Patpong Night Market (declared — never buy blindly)", "Pratunam"],
    tip: "Everything is fake. Prices from ฿100–500 per item. Quality varies wildly. Don't expect authentic.",
  },
];

export function BangkokShopping() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🛍️ Bangkok shopping guide by category
      </h2>
      <div className="space-y-3">
        {CATEGORIES.map((c) => (
          <div key={c.type} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{c.emoji}</span>
              <span className="font-bold text-xs">{c.type}</span>
            </div>
            <div className="space-y-1 mb-2">
              {c.best.map((b) => (
                <div key={b} className="text-[10px] text-[var(--fg)] flex gap-1.5 items-start">
                  <span className="shrink-0 text-orange-500 mt-px">▸</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-orange-600 italic">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
