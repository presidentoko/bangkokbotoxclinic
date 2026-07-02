type PriceRange = {
  budget: string;
  emoji: string;
  range: string;
  examples: string;
  url: string;
};

type PriceQuickViewProps = { type?: "restaurant" | "activity" };

const RESTAURANT_PRICES: PriceRange[] = [
  { budget: "Street food", emoji: "🛺", range: "฿30–150", examples: "Pad Thai, Som Tum, Mango Sticky Rice", url: "/local-tips" },
  { budget: "Local restaurant", emoji: "🍜", range: "฿100–300", examples: "Rice dishes, noodles, curry sets", url: "/restaurants/bangkok" },
  { budget: "Mid-range", emoji: "🍽️", range: "฿300–800", examples: "Modern Thai, Japanese, Western", url: "/restaurants/bangkok" },
  { budget: "Fine dining", emoji: "✨", range: "฿800–2500+", examples: "Signature tasting menus, rooftops", url: "/for/views" },
];

const ACTIVITY_PRICES: PriceRange[] = [
  { budget: "Budget (under ฿500)", emoji: "💸", range: "฿150–499", examples: "Thai massage 1hr, Muay Thai day pass", url: "/activities/budget" },
  { budget: "Mid-range", emoji: "💰", range: "฿500–1500", examples: "Cooking class, dive intro, yoga package", url: "/activities" },
  { budget: "Premium", emoji: "⭐", range: "฿1500–4000", examples: "Spa package, sailing trip, surf camp day", url: "/activities" },
  { budget: "Luxury", emoji: "💎", range: "฿4000+", examples: "Full-day private boat, luxury spa retreat", url: "/for/luxury" },
];

export function PriceQuickView({ type = "restaurant" }: PriceQuickViewProps) {
  const prices = type === "activity" ? ACTIVITY_PRICES : RESTAURANT_PRICES;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        💰 Price guide
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {prices.map((p) => (
          <a
            key={p.budget}
            href={p.url}
            className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-green-300 hover:bg-green-50 transition group"
          >
            <span className="text-xl shrink-0 leading-none mt-0.5">{p.emoji}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[var(--fg)] group-hover:text-green-800 transition">{p.budget}</span>
                <span className="text-xs font-mono text-green-700 font-bold bg-green-100 px-1.5 rounded">{p.range}</span>
              </div>
              <div className="text-[10px] text-[var(--muted)] mt-0.5 leading-snug">{p.examples}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
