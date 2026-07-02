const TIPS = [
  { emoji: "🚖", title: "Use Grab, not tuk-tuks for long trips", body: "Tuk-tuks are tourist traps for long distances. Grab is fixed-price, air-conditioned, and insured." },
  { emoji: "💊", title: "Check tap water", body: "Don't drink tap water. Bottle water at 7-Eleven is ฿8. Most hotels provide bottles." },
  { emoji: "🌞", title: "Sunscreen and hydration", body: "Bangkok heat + humidity = dangerous dehydration. Drink 2L+/day. Convenience stores are everywhere." },
  { emoji: "📱", title: "Keep copies of documents", body: "Take photos of passport, hotel booking, insurance. Keep them in Google Photos or email drafts." },
  { emoji: "💰", title: "Don't flash cash", body: "Use an ATM inside a bank or mall. AEON ATMs charge lower fees. Carry small bills in a separate pocket." },
  { emoji: "🍢", title: "Street food hygiene check", body: "High turnover = fresh food. Avoid stalls with pre-cut meat sitting in heat. Busy at lunchtime = safe." },
];

export function SafetyTips() {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-4">
        🛡️ Stay safe in Bangkok
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {TIPS.map((t) => (
          <div key={t.title} className="flex gap-3 items-start">
            <span className="text-xl shrink-0 leading-none mt-0.5">{t.emoji}</span>
            <div>
              <div className="text-xs font-bold text-red-900">{t.title}</div>
              <div className="text-xs text-red-800 opacity-90 leading-snug">{t.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
