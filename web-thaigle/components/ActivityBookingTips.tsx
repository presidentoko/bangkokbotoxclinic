const TIPS = [
  {
    emoji: "📱",
    title: "Book cooking classes 1–2 days ahead",
    detail: "Good classes (especially with market tours) sell out, especially Dec–Feb. Walk-ins fine May–Sep.",
  },
  {
    emoji: "🥊",
    title: "Muay Thai: walk-in is fine, call ahead in high season",
    detail: "Beginner sessions rarely sold out. WhatsApp the gym night before to guarantee morning slot.",
  },
  {
    emoji: "💆",
    title: "Massage: no booking needed in Bangkok",
    detail: "Street massage shops have walk-in always. Luxury spa (Aman, Mandarin Oriental): book 3–7 days.",
  },
  {
    emoji: "🧘",
    title: "Yoga: first class deals are usually walk-in",
    detail: "Most studios offer first-visit discount at the door. Only monthly pass requires booking.",
  },
  {
    emoji: "🤿",
    title: "Diving: book day before (Pattaya day trips)",
    detail: "Pattaya dive operators run fixed departure times. Book by 8pm the night before.",
  },
  {
    emoji: "💻",
    title: "Coworking: day passes are walk-in friendly",
    detail: "Most Bangkok coworking accepts walk-ins. Meeting rooms must be pre-booked.",
  },
];

export function ActivityBookingTips() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📋 When to book vs walk-in
      </div>
      <div className="space-y-2">
        {TIPS.map((t) => (
          <div key={t.title} className="flex gap-3 items-start border border-[var(--border)] rounded-xl p-3">
            <span className="text-xl shrink-0">{t.emoji}</span>
            <div>
              <div className="font-bold text-xs mb-0.5">{t.title}</div>
              <div className="text-[10px] text-[var(--muted)] leading-snug">{t.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
