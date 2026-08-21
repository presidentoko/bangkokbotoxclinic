const TIPS = [
  {
    topic: "Business Card Etiquette",
    emoji: "💼",
    tip: "Always receive and give cards with BOTH hands. Look at the card, don't put it in your pocket immediately. Thais take business cards seriously — a casual dismissal is rude.",
  },
  {
    topic: "Meeting Culture",
    emoji: "🤝",
    tip: "Never raise your voice or express frustration publicly — 'losing face' concept is real. Hierarchy matters: always greet the most senior person first. Be patient; decisions take longer but are more durable.",
  },
  {
    topic: "Meals & Entertainment",
    emoji: "🍽️",
    tip: "Business dinners are common. Host orders for the table. Don't order food before host. Toasting: 'Chon Kaew' (cheers). Refusing alcohol is fine — just say 'gin mai pen' (I don't drink).",
  },
  {
    topic: "Dress Code",
    emoji: "👔",
    tip: "Business formal (suit + tie) for government meetings. Smart casual acceptable for tech/startup meetings. Bangkok is hot — linen or lightweight suits recommended. Don't show up visibly sweating.",
  },
  {
    topic: "Business Hours & Communication",
    emoji: "⏰",
    tip: "9am–6pm Mon–Fri. Lunch 12–1pm (offices often close). Response times can be slow — don't follow up more than once in 24hrs. LINE app is preferred over email for ongoing relationships.",
  },
  {
    topic: "Meeting Venues (Central Bangkok)",
    emoji: "📍",
    tip: "Central Embassy (Ploenchit) has best hotel meeting rooms (Okura). Park Hyatt Bangkok (Ploenchit) for power dinners. Jasmine City Hotel (Asok) for conference rooms. FYI Center (Rama 9) for tech/startup space.",
  },
];

export function BangkokBusinessTips() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        💼 Bangkok business travel — culture & etiquette guide
      </h2>
      <div className="space-y-1.5">
        {TIPS.map((t) => (
          <div key={t.topic} className="border border-slate-100 rounded-xl px-3 py-2 flex items-start gap-2">
            <span className="text-xl shrink-0">{t.emoji}</span>
            <div>
              <div className="font-bold text-[11px] mb-0.5">{t.topic}</div>
              <div className="text-[10px] text-[var(--fg)] leading-snug">{t.tip}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
