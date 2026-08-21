const TIPS = [
  { emoji: "🙏", title: "Wai greeting", body: "Press palms together & bow slightly to show respect. Thais appreciate when visitors try it." },
  { emoji: "👟", title: "Remove shoes", body: "Always remove shoes before entering temples, many restaurants, and traditional homes. Look for the shoe pile at the door." },
  { emoji: "👗", title: "Temple dress code", body: "Cover shoulders and knees at temples. Carry a light scarf — it doubles as a cover-up and sun protection." },
  { emoji: "🤐", title: "Respect the monarchy", body: "Never criticize the Thai royal family. It's deeply offensive and illegal under lèse-majesté law." },
  { emoji: "💰", title: "Tipping culture", body: "Not mandatory but appreciated: ฿20–50 for massage, 10% for restaurants, ฿20 for taxi. Already included in some hotels." },
  { emoji: "🚿", title: "Street food hygiene", body: "Busiest stalls = freshest food. Look for stalls where locals eat. Avoid pre-cut fruit sitting in heat." },
];

export function BangkokEtiquette() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-800 mb-4">
        🇹🇭 Bangkok Etiquette
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {TIPS.map((t) => (
          <div key={t.title} className="flex gap-3 items-start">
            <span className="text-xl shrink-0 leading-none mt-0.5">{t.emoji}</span>
            <div>
              <div className="text-xs font-bold text-amber-900">{t.title}</div>
              <div className="text-xs text-amber-800 leading-snug opacity-90">{t.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
