const FORMATS = [
  {
    icon: "🌅",
    title: "Morning market class",
    duration: "4–5 hours",
    price: "฿1,200–1,800",
    includes: ["Market tour at 8am", "Cook 4–5 dishes", "Keep the recipes", "Eat what you cook"],
    bestFor: "First-timers, food-focused travelers",
  },
  {
    icon: "🍃",
    title: "Evening cooking class",
    duration: "3–4 hours",
    price: "฿900–1,400",
    includes: ["Skip market, start cooking at 4pm", "Cook 3–4 dishes", "Less intense, more relaxed"],
    bestFor: "People with morning tours already booked",
  },
  {
    icon: "👨‍🍳",
    title: "Private chef class",
    duration: "3–6 hours",
    price: "฿2,500–5,000",
    includes: ["1-on-1 instruction", "Custom menu", "Professional kitchen", "Wine pairing optional"],
    bestFor: "Serious foodies, honeymoons, gifts",
  },
];

export function CookingClassPreview() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        👨‍🍳 Cooking class formats — at a glance
      </div>
      <div className="space-y-3">
        {FORMATS.map((f) => (
          <div key={f.title} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{f.icon}</span>
                <span className="font-bold text-xs text-[var(--fg)]">{f.title}</span>
              </div>
              <span className="text-xs font-mono text-green-700 bg-green-100 px-2 py-0.5 rounded font-bold">{f.price}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {f.includes.map((item, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-[var(--muted)]">✓ {item}</span>
              ))}
            </div>
            <div className="text-[10px] text-[var(--muted)]">Best for: <span className="font-medium">{f.bestFor}</span> · {f.duration}</div>
          </div>
        ))}
      </div>
      <a
        href="/activities/cooking"
        className="mt-3 block text-center text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded-full py-1.5 hover:bg-orange-100 transition"
      >
        Browse cooking classes →
      </a>
    </div>
  );
}
