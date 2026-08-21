const IDEAS = [
  {
    name: "All-you-can-eat Thai BBQ Night",
    emoji: "🔥",
    type: "Communal dining",
    venue: "Mu Kata Jeed Jard (Sukhumvit) / Penguin Eat Shabu",
    price: "฿299–499 per person all-in",
    why: "Best communal farewell format — everyone cooking together at the table breaks conversation barriers. Unlimited food removes the 'let me check the bill' awkwardness. Thai BBQ is universally loved.",
    tip: "Reserve 8+ in advance — walk-in for groups is difficult. Two hours unlimited is plenty. Order the marinated pork belly and tiger prawns first. Bring a small going-away gift for the exchange at the table.",
  },
  {
    name: "Khaosan Road Pub Crawl",
    emoji: "🍺",
    type: "Bar hopping",
    venue: "Khaosan Road, Banglamphu",
    price: "฿200–600 per person (drinks)",
    why: "Classic expat farewell tradition in Bangkok. Khaosan Road has 20+ bars in a 300m strip. Everyone can find their drink of choice. Strangers become friends. Scorpion buckets are obligatory.",
    tip: "Start at Bull Bar or Hippie Bar for normal cocktails, progress to Club Nana for dancing later. Negotiate group discounts at bucket bars (usually 3 buckets for price of 2 for groups). Go Tuesday–Thursday for smaller crowds.",
  },
  {
    name: "Silom Soi 4 & Soi 5 Night Out",
    emoji: "🌈",
    type: "Mixed gay-friendly nightlife",
    venue: "Silom Soi 4, Bangrak",
    price: "฿300–800 per person",
    why: "Bangkok's most welcoming and inclusive nightlife strip. DJ Paradise and Telephone Bar attract a diverse crowd. International expat community makes farewell events feel global. High energy and friendly atmosphere.",
    tip: "Best Thursday–Saturday. DJ Paradise gets going midnight–1am — arrive late. Soi 5 has chill bars for earlier evening and conversation before the later noise. Grab food on Silom Main Road before heading in.",
  },
  {
    name: "Luxury Thai Boat Dinner (Chao Phraya)",
    emoji: "🛥️",
    type: "Cruise dinner",
    venue: "Chao Phraya Princess / Wan Fah Cruise",
    price: "฿900–1,800 per person (dinner cruise)",
    why: "Memorable farewell format — the city looks magical from the water at night. Bangkok temples and bridges lit up while eating Thai food. Usually 2 hours including live music and entertainment. Unique final memory.",
    tip: "Wan Fah Cruise is most popular with expats (less touristy than Princess). Book window seats for the group — request at reservation. Bring a small speech — the format allows for toasts between courses naturally.",
  },
];

export function BangkokFarewellParty() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        👋 Farewell party ideas Bangkok — send-offs worth remembering
      </h2>
      <div className="space-y-2">
        {IDEAS.map((i) => (
          <div key={i.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.type} · {i.venue}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-violet-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
