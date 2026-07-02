const GUIDE_SETS: Record<string, { title: string; url: string; emoji: string }[]> = {
  activity: [
    { title: "First time in Bangkok guide", url: "/activities/first-time-bangkok", emoji: "🛬" },
    { title: "Bangkok on a budget", url: "/activities/budget", emoji: "💸" },
    { title: "Weekend in Bangkok", url: "/activities/weekend-in-bangkok", emoji: "📅" },
    { title: "Digital nomad Bangkok", url: "/activities/digital-nomad", emoji: "💻" },
    { title: "Couples & date night ideas", url: "/activities/couples", emoji: "❤️" },
    { title: "Wellness week guide", url: "/activities/wellness-week", emoji: "🌿" },
  ],
  restaurant: [
    { title: "Bangkok local tips", url: "/local-tips", emoji: "🍜" },
    { title: "Thai food glossary", url: "/local-tips", emoji: "📖" },
    { title: "Best Bangkok neighborhoods", url: "/restaurants", emoji: "🗺️" },
    { title: "Chinatown food guide", url: "/restaurants/bangkok/chinatown", emoji: "🏮" },
    { title: "Budget dining in Bangkok", url: "/activities/budget", emoji: "💸" },
    { title: "Food festival events", url: "/trending", emoji: "🎉" },
  ],
  general: [
    { title: "Bangkok day planner", url: "/day-plan", emoji: "🗓️" },
    { title: "Trending this week", url: "/trending", emoji: "📈" },
    { title: "Bangkok guides", url: "/guide", emoji: "📚" },
    { title: "Bangkok quiz", url: "/quiz", emoji: "🎯" },
    { title: "Bucket list bingo", url: "/bingo", emoji: "🏆" },
    { title: "My Bangkok trip", url: "/my-trip", emoji: "🧳" },
  ],
};

type RelatedGuidesProps = { context?: "activity" | "restaurant" | "general" };

export function RelatedGuides({ context = "general" }: RelatedGuidesProps) {
  const guides = GUIDE_SETS[context];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📚 More Bangkok guides
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {guides.map((g) => (
          <a
            key={g.url + g.title}
            href={g.url}
            className="flex items-center gap-2 p-2 rounded-xl border border-[var(--border)] hover:border-orange-300 hover:bg-orange-50 transition text-[11px] font-medium text-[var(--fg)] hover:text-orange-700"
          >
            <span className="text-base shrink-0">{g.emoji}</span>
            <span className="truncate">{g.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
