const STORES = [
  {
    name: "Asia Books",
    emoji: "📚",
    area: "Multiple: Emporium, EmQuartier, Asiatique, Terminal 21",
    price: "English books: ฿350–800",
    why: "Bangkok's largest English-language bookstore chain. Extensive travel, fiction, Thailand-specific titles. The go-to for English books.",
    tip: "Terminal 21 location has the widest travel section. Good Bangkok city guides, Thai cookbook section, regional travel books.",
  },
  {
    name: "Bookmoby",
    emoji: "📖",
    area: "The Commons, Thong Lo (and Ekkamai)",
    price: "Secondhand: ฿80–300, New: ฿350–700",
    why: "Bangkok's best independent English bookshop. Secondhand and new. Staff recommendations are trustworthy. Comfortable reading corner.",
    tip: "Secondhand trade-in: bring your finished books and swap at credit. Great for travelers cycling through reading material.",
  },
  {
    name: "Kinokuniya",
    emoji: "🏯",
    area: "Central Embassy (Ploenchit BTS) — 3rd floor",
    price: "International prices (฿400–1,500)",
    why: "Japanese chain with Bangkok's most comprehensive English + Japanese section. Art books, manga, professional titles, all current bestsellers.",
    tip: "Best art and architecture book section in Bangkok. Japanese magazine section unparalleled in Thailand.",
  },
  {
    name: "Dasa Book Café",
    emoji: "☕",
    area: "Sukhumvit 26 / Phrom Phong BTS",
    price: "Secondhand ฿60–300",
    why: "Bangkok's legendary secondhand English bookstore for 25+ years. 3 floors of used books, attached café. Great for browsing hours.",
    tip: "Walk every floor slowly — gems are everywhere. Best selection: classic literature, history, Asia/Thailand titles. Trade-in accepted.",
  },
];

export function BangkokBookstores() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        📚 Bangkok bookstores — English-language books & reading culture
      </h2>
      <div className="space-y-2">
        {STORES.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
