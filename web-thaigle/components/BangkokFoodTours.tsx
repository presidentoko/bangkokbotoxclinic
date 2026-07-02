const TOURS = [
  {
    name: "Bangkok Food Tours — Old Town Morning Walk",
    emoji: "🍜",
    duration: "3 hrs (7am–10am)",
    price: "฿1,400–1,800/person",
    what: "Rattanakosin Old City + flower market + riverside temples + 7 tastings at local spots",
    highlight: "Breakfast-focused. See Bangkok before the heat and crowds. Guide explains history at each stop.",
    bookVia: "Klook, Airbnb Experiences, or Bangkok Food Tours website",
  },
  {
    name: "Chinatown Night Eating Tour",
    emoji: "🏮",
    duration: "3 hrs (6:30pm–9:30pm)",
    price: "฿1,200–1,500/person",
    what: "Yaowarat Road 8 tastings — braised duck, pad Thai, fresh mango, shark fin alternative, tub tim grob",
    highlight: "Best way to navigate Chinatown confidently. Guide handles ordering in Thai.",
    bookVia: "Klook, Viator, Walking Thai",
  },
  {
    name: "Ari–Phahon Yothin Café + Market Tour",
    emoji: "☕",
    duration: "3 hrs",
    price: "฿1,800–2,200/person",
    what: "4 specialty coffee stops + local market visit + breakfast at Thai family restaurant off-menu",
    highlight: "Most 'local Bangkok' experience. No tourist stops. Areas Bangkok expats actually live.",
    bookVia: "Airbnb Experiences ('Bangkok Like a Local' search)",
  },
  {
    name: "Street Food Motorbike Tour (sunset)",
    emoji: "🏍️",
    duration: "4 hrs (4pm–8pm)",
    price: "฿2,200–2,800/person",
    what: "Pillion motorbike through 6 Bangkok neighborhoods + street food at each. Covers ground taxis can't reach.",
    highlight: "Most unique perspective on Bangkok. Go through narrow sois tourists never see.",
    bookVia: "Urban Adventures, Bangkok by Bike (also offer bicycle version)",
  },
];

export function BangkokFoodTours() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🍜 Bangkok food tours — best guided experiences
      </div>
      <div className="space-y-3">
        {TOURS.map((t) => (
          <div key={t.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[10px] text-[var(--muted)]">⏱️ {t.duration}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono font-black text-green-700">{t.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{t.what}</div>
            <div className="text-[10px] text-blue-700 mb-0.5">⭐ {t.highlight}</div>
            <div className="text-[10px] text-orange-600">📱 Book via: {t.bookVia}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
