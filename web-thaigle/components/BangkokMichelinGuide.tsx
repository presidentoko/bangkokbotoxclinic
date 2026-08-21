const STARRED = [
  { name: "Gaggan Anand", stars: 2, cuisine: "Progressive Indian", price: "฿7,000–10,000", book: "3 months ahead", why: "Bangkok's most famous restaurant. 30-course emoji menu. Best fine dining experience in Asia." },
  { name: "Sühring", stars: 2, cuisine: "Modern German", price: "฿5,000–8,000", book: "6–8 weeks ahead", why: "Twin German chefs. Rarest fine dining cuisine in Bangkok. Private garden villa setting." },
  { name: "Le Normandie", stars: 1, cuisine: "Classic French", price: "฿3,500–6,000", book: "1–2 weeks ahead", why: "Mandarin Oriental. Bangkok's oldest fine dining room. Perfect traditional French." },
  { name: "Mezzaluna", stars: 2, cuisine: "Modern European", price: "฿4,500–7,000", book: "2+ weeks ahead", why: "65F rooftop. Highest Michelin-starred restaurant in Bangkok. View + food = extraordinary." },
  { name: "Methavalai Sorndaeng", stars: 1, cuisine: "Royal Thai", price: "฿800–1,500", book: "Day before", why: "Oldest Thai restaurant in Bangkok (since 1957). Most authentic Royal Thai cuisine. Value champion." },
  { name: "Canvas", stars: 1, cuisine: "Thai-inspired contemporary", price: "฿2,800–4,000", book: "1 week ahead", why: "Market-driven, sustainability-focused. Best Thai contemporary tasting menu." },
];

const BIB_GOURMAND = [
  { name: "Raan Jay Fai", cuisine: "Thai street food", price: "฿600–1,500", note: "Street food legend, crab omelette" },
  { name: "Soei", cuisine: "Thai home cooking", price: "฿80–200/dish", note: "Lunch only, cash only, authentic" },
  { name: "Kao Gaeng Jake Puey", cuisine: "Southern Thai curry", price: "฿50–120", note: "Market stall, open morning only" },
];

export function BangkokMichelinGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        ⭐ Bangkok Michelin Guide 2024/25
      </h2>
      <div className="text-xs font-bold mb-2">Starred restaurants</div>
      <div className="space-y-1.5 mb-3">
        {STARRED.map((r) => (
          <div key={r.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1">
              <div className="flex gap-0.5">
                {Array.from({length: r.stars}).map((_, i) => (
                  <span key={i} className="text-yellow-500">⭐</span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs">{r.name}</span>
                <span className="text-[10px] text-[var(--muted)]"> · {r.cuisine}</span>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{r.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-orange-600">📅 Book: {r.book}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-bold mb-2">Bib Gourmand (best value)</div>
      <div className="space-y-1.5">
        {BIB_GOURMAND.map((b) => (
          <div key={b.name} className="flex gap-2 items-start border border-[var(--border)] rounded-xl px-3 py-2">
            <span className="text-red-500 text-sm shrink-0">Ⓑ</span>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-[11px]">{b.name}</span>
              <span className="text-[10px] text-[var(--muted)]"> · {b.cuisine}</span>
              <div className="text-[10px] text-[var(--muted)]">{b.note}</div>
            </div>
            <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{b.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
