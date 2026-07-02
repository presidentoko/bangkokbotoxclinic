const SPOTS = [
  {
    name: "Le Normandie",
    emoji: "🇫🇷",
    area: "Mandarin Oriental Hotel, Charoen Krung",
    star: "Michelin 2-Star",
    price: "฿3,500–8,000/person",
    why: "Bangkok's most prestigious French restaurant. Opened 1958. The view over the Chao Phraya adds to experience. Dress code strictly enforced.",
    must: "Foie gras, duck confit, tasting menus only. Jacket required for men.",
  },
  {
    name: "Sühring",
    emoji: "🌟",
    area: "Sukhumvit 53 (Thonglor)",
    star: "Michelin 2-Star (German-French)",
    price: "฿3,500–7,000/person",
    why: "German twin brothers. Contemporary European with French technique. Best wine cellar in Bangkok. Beautifully designed house venue.",
    must: "Tasting menu (12 courses). The best meal in Bangkok by most critics' consensus.",
  },
  {
    name: "Brasserie Cordonnier",
    emoji: "🍷",
    area: "Ploenchit / Langsuan",
    star: "Casual bistro",
    price: "฿600–1,800/person",
    why: "Most authentic French bistro atmosphere in Bangkok. French expats' weekly lunch spot. Proper bistro food at half the price of fine dining.",
    must: "Steak frites, French onion soup, crème brûlée, natural wine selection.",
  },
  {
    name: "Le Cochon Blanc",
    emoji: "🐷",
    area: "Nang Linchi Rd, Yan Nawa",
    star: "Casual French",
    price: "฿500–1,500/person",
    why: "Hidden neighborhood French bistro. Best value French food in Bangkok. French chef who moved here and stayed. Wine list 100% French.",
    must: "Charcuterie board, cassoulet, tarte tatin. Reservations essential.",
  },
];

export function BangkokFrenchFood() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🇫🇷 French restaurants in Bangkok — casual to fine dining
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.star} · {s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">⭐ Order: {s.must}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
