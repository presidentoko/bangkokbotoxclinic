const TIERS = [
  {
    tier: "Budget Hostels (฿300–600/night)",
    emoji: "🎒",
    areas: "Khao San Road, Silom, Pratunam",
    examples: ["Lub d Silom (pod beds, social bar)", "HQ Hostel (Khao San, party vibe)", "Niras Bankoc (cultural, Rattanakosin)", "The Warehouse Hostel Chinatown"],
    features: "Dorm beds ฿250–450. Private rooms ฿600–900. Breakfast usually extra.",
    tip: "Best for solo travelers. Hostels in Silom > Khao San if you want genuine Bangkok rather than tourist bubble.",
  },
  {
    tier: "Mid-range Boutique (฿1,200–2,500/night)",
    emoji: "🏨",
    areas: "Sukhumvit, Ari, Thonglor",
    examples: ["Riva Surya Bangkok (riverside, great views)", "Bhuthorn Bangkok (Banglamphu shophouse)", "Dusit Princess Srinakarin", "Hotel Muse Bangkok"],
    features: "Usually includes pool. BTS-adjacent most. Breakfast sometimes included.",
    tip: "Sweet spot for Bangkok. Check Agoda/Booking for last-minute rates — Bangkok hotels often drop 30–40% off-season.",
  },
  {
    tier: "Premium Hotels (฿3,500–7,000/night)",
    emoji: "⭐",
    areas: "Sukhumvit Soi 8–39, Riverside",
    examples: ["Rosewood Bangkok (Ploenchit)", "SO Sofitel Bangkok (Lumpini Park)", "Kimpton Maa-Lai", "W Bangkok"],
    features: "Signature pool, club lounge, multiple restaurants. Usually BTS-connected.",
    tip: "Book direct for best rate + complimentary upgrades. Hotel credit cards (e.g. Marriott Bonvoy) give good value here.",
  },
  {
    tier: "Iconic Luxury (฿8,000–30,000+/night)",
    emoji: "👑",
    areas: "Chao Phraya Riverside, Silom",
    examples: ["Mandarin Oriental Bangkok (since 1876)", "Capella Bangkok (best new luxury)", "The Peninsula Bangkok", "Anantara Riverside"],
    features: "River views, butler service, legendary restaurants, historic legacy.",
    tip: "Mandarin Oriental Sunday brunch or afternoon tea is a bucket-list experience even if you're not staying. Book months ahead.",
  },
];

export function BangkokBudgetHotels() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🏨 Bangkok accommodation by budget
      </h2>
      <div className="space-y-2">
        {TIERS.map((t) => (
          <div key={t.tier} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <div>
                <div className="font-bold text-xs">{t.tier}</div>
                <div className="text-[10px] text-[var(--muted)]">Best areas: {t.areas}</div>
              </div>
            </div>
            <div className="space-y-0.5 mb-1.5">
              {t.examples.map((e) => (
                <div key={e} className="text-[10px] flex gap-1.5">
                  <span className="shrink-0 text-blue-500">▸</span>{e}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-[var(--muted)] mb-0.5">{t.features}</div>
            <div className="text-[10px] text-orange-600">💡 {t.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
