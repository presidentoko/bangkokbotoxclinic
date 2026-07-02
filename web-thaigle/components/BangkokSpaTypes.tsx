const TREATMENTS = [
  {
    treatment: "Traditional Thai Massage (Nuad Thai)",
    emoji: "🙏",
    duration: "60–120 min",
    price: "฿200–800",
    why: "Pressure-point acupressure + assisted yoga stretching. No oil. Clothes on. UNESCO World Heritage listed.",
    bestFor: "Tight muscles, jetlag recovery, flexibility",
    whereToGo: "Wat Pho Thai Massage School (most authentic, ฿420/hr). Street shops from ฿200.",
  },
  {
    treatment: "Oil massage (Aroma therapy)",
    emoji: "💆",
    duration: "60–120 min",
    price: "฿350–1,200",
    why: "Gentle Swedish-style strokes with scented oil. More relaxing than Thai massage. Usually in dimmed rooms.",
    bestFor: "Stress relief, relaxation, romance",
    whereToGo: "Divana, Oasis Spa, or upscale hotel spas. Most multi-service spas offer this.",
  },
  {
    treatment: "Foot & leg massage",
    emoji: "🦶",
    duration: "30–60 min",
    price: "฿150–400",
    why: "Reflexology-based. Works pressure points on feet connected to body organs. Surprisingly powerful.",
    bestFor: "After walking all day. Great intro to Thai massage.",
    whereToGo: "Every street and mall has foot massage shops. 30 min = perfect afternoon pick-me-up.",
  },
  {
    treatment: "Herbal compress (Luk Pra Kob)",
    emoji: "🌿",
    duration: "90 min (usually add-on)",
    price: "฿600–1,500 standalone",
    why: "Steamed herbal bundle pressed onto body. Deeply therapeutic. Original Thai healing technique.",
    bestFor: "Joint pain, muscle soreness, detox",
    whereToGo: "Wat Pho massage school offers authentic version. Most mid-range spas can add ฿200–400.",
  },
  {
    treatment: "Luxury spa package",
    emoji: "✨",
    duration: "2–5 hrs",
    price: "฿2,000–8,000+",
    why: "Multi-treatment experience: scrub + oil massage + facial + steam + herbal drink. Pure indulgence.",
    bestFor: "Special occasions, honeymoon, treat yourself",
    whereToGo: "Mandarin Oriental Spa, The Oriental Spa, Aman Spa (best in Bangkok).",
  },
];

export function BangkokSpaTypes() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        💆 Bangkok spa treatments — which to choose?
      </div>
      <div className="space-y-2">
        {TREATMENTS.map((t) => (
          <div key={t.treatment} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{t.treatment}</div>
                <div className="text-[10px] text-[var(--muted)]">{t.duration} · <span className="font-mono font-black text-green-700">{t.price}</span></div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{t.why}</div>
            <div className="text-[10px] text-blue-600 mb-0.5">Best for: {t.bestFor}</div>
            <div className="text-[10px] text-orange-600">📍 {t.whereToGo}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
