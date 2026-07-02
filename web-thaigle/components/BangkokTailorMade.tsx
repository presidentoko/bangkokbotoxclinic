const TAILORS = [
  {
    name: "Raja's Fashions",
    emoji: "👔",
    area: "Sukhumvit Soi 4 (Nana area)",
    price: "Men's suit ฿7,000–18,000. Women's dress ฿3,500–9,000",
    specialty: "Men's suiting — linen, wool, and summer blends",
    why: "Bangkok's most famous tailor for Western visitors since 1972. Featured in numerous travel publications. Suits made in 24–48 hours with fabric from Japan, England, and Italy.",
    tip: "First fitting + 2 follow-up fittings minimum for suits. Don't fall for 'one-visit suits' — proper tailoring needs 3 fittings. Raja's gives you honest advice on what will look good.",
    timeline: "Shirt: 24 hours. Suit: 3–5 days (1 fitting). Full wardrobe: 7–10 days.",
  },
  {
    name: "Marco Tailors",
    emoji: "✂️",
    area: "Silom area",
    price: "Shirts from ฿1,800, Suits from ฿9,000",
    specialty: "Italian-influenced tailoring for slim-cut Europeans",
    why: "Italian-trained Bangkok tailor. Produces slim European cuts that fit non-Asian body types well. Fabric selection from Italy includes lightweight wool and wool-silk blends for tropical climate.",
    tip: "Bring a suit you love the cut of to copy — easiest way to communicate desired fit. Lightweight wool works well year-round in Bangkok even with AC. 3-suit package is best value.",
    timeline: "Rush available (฿500 surcharge) for 24-hour shirt. 2-3 day standard.",
  },
  {
    name: "Siam Tailor (Women's Specialist)",
    emoji: "👗",
    area: "Near Siam area",
    price: "Dress ฿1,800–4,500, Blouse ฿800–1,500",
    specialty: "Women's formal and occasion wear",
    why: "Specializes in women's garments in Asian and Thai-influenced fabrics. Silk dresses, formal suits, qipao-style Thai silk garments. Can copy from photos and adapt for fit.",
    tip: "Bring reference photos of styles you want. Thai silk is 30% of cost vs Paris — same fabric quality. Allow longer timeline for complex garments (beading, embroidery adds 2-3 days).",
    timeline: "Simple dress: 2 days. Elaborate formal wear: 5–7 days.",
  },
];

const TIPS = [
  "Golden rule: budget 2–3 fittings if visiting Bangkok for a week+. Rush suits are usually disappointing.",
  "Fabric matters: specify 'lightweight wool' for suits — Bangkok year-round. Pure linen wrinkles but breathes well.",
  "Avoid shops that approach you on the street outside temples — overpriced tourist traps.",
  "Thai silk: ABSOLUTELY worth having a suit, dress, or shirt made in it — unique, beautiful, and affordable.",
  "Bring your best-fitting existing garment — the tailor uses it to copy your ideal measurements.",
];

export function BangkokTailorMade() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        ✂️ Bangkok tailoring guide — custom suits, dresses & shirts
      </div>
      <div className="space-y-2 mb-3">
        {TAILORS.map((t) => (
          <details key={t.name} className="border border-slate-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-slate-50 transition">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{t.specialty} · {t.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{t.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-slate-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{t.why}</div>
              <div className="text-[10px] text-slate-600">⏱️ {t.timeline}</div>
              <div className="text-[10px] text-orange-600">💡 {t.tip}</div>
            </div>
          </details>
        ))}
      </div>
      <div className="border border-slate-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-slate-700 mb-1.5">Tailoring tips (don't get scammed):</div>
        <ul className="space-y-0.5">
          {TIPS.map((tip) => (
            <li key={tip} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-slate-400 shrink-0">•</span>{tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
