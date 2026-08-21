const TYPES = [
  {
    name: "Traditional Thai Massage (นวดแผนไทย)",
    emoji: "🧘",
    duration: "60–120 min",
    price: "฿200–600 (street) / ฿500–1,500 (spa)",
    technique: "Full body stretching, acupressure, no oil. You wear loose clothing.",
    for: "Muscle tension, jet lag, post-flight stiffness. Most active style.",
    whereBest: "Wat Pho Massage School (฿420/hr, best traditional; book on arrival). Health Land (฿550, best chain).",
    avoid: "Pregnancy, recent injury, osteoporosis. Tell therapist about any pain points.",
  },
  {
    name: "Oil Massage / Aromatherapy (นวดน้ำมัน)",
    emoji: "🌿",
    duration: "60–120 min",
    price: "฿400–1,200 (parlour) / ฿1,500–4,000 (luxury spa)",
    technique: "Long flowing strokes with scented oil. Clothes removed, draped with towels.",
    for: "Stress relief, relaxation, skin hydration. Most suitable for beginners.",
    whereBest: "Lek Massage Silom (฿450–600, excellent). Chi Spa Shangri-La (฿2,500+, luxury).",
    avoid: "Skin conditions, sunburn, allergies to specific oils (ask to check).",
  },
  {
    name: "Foot Reflexology (นวดเท้า)",
    emoji: "🦶",
    duration: "30–60 min",
    price: "฿150–400 (parlour) / ฿400–800 (spa)",
    technique: "Pressure points on feet mapped to body organs. Stick tool + thumbs.",
    for: "Tired feet, digestive issues, general wellness. Can be done in clothes.",
    whereBest: "Asok/Sukhumvit foot massage shops (฿150–200/30min). Best value in Bangkok.",
    avoid: "Pregnancy (some pressure points contraindicated). Fungal infections.",
  },
  {
    name: "Herbal Compress (ลูกประคบ)",
    emoji: "🌸",
    duration: "60–90 min",
    price: "฿600–1,500 (add-on or standalone)",
    technique: "Steamed muslin balls filled with lemongrass, ginger, turmeric applied to muscles.",
    for: "Muscle soreness, inflammation, post-workout recovery. Deeply soothing heat.",
    whereBest: "Normally added to a traditional Thai massage. Ask specifically: 'Nuat luk pra-kob'.",
    avoid: "Open wounds, fever, very sensitive skin.",
  },
];

export function BangkokThaiMassageTypes() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        💆 Thai massage types — which one is right for you?
      </h2>
      <div className="space-y-2">
        {TYPES.map((t) => (
          <details key={t.name} className="border border-pink-100 rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs font-bold text-[var(--fg)] hover:text-pink-700 transition">
              <span className="text-lg shrink-0">{t.emoji}</span>
              <span className="flex-1">{t.name}</span>
              <span className="text-[10px] font-mono text-green-700 shrink-0">{t.price}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition text-sm shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3 space-y-1.5">
              <div className="text-[10px]"><span className="font-bold text-pink-700">Duration:</span> {t.duration}</div>
              <div className="text-[10px]"><span className="font-bold">Technique:</span> {t.technique}</div>
              <div className="text-[10px]"><span className="font-bold text-blue-700">Good for:</span> {t.for}</div>
              <div className="text-[10px]"><span className="font-bold text-green-700">Best places:</span> {t.whereBest}</div>
              <div className="text-[10px] text-orange-600"><span className="font-bold">Avoid if:</span> {t.avoid}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
