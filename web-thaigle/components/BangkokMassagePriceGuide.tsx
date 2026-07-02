const TYPES = [
  {
    name: "Traditional Thai Massage (นวดแผนไทย)",
    emoji: "🙏",
    duration: "60–120 min",
    price: "฿200–500 (local parlors), ฿400–1,500 (spas)",
    what: "No oil. Therapist uses thumbs, palms, elbows, feet. Stretching and joint manipulation. Energy line work. Fully clothed in pajamas.",
    pain: "Can be intense — specify pressure (soft = นุ่ม, medium = ปานกลาง, hard = แรง)",
    best: "Physical recovery, flexibility, chronic tension. Not relaxing in the way Western massage is — invigorating instead.",
  },
  {
    name: "Thai Oil Massage",
    emoji: "🌿",
    duration: "60–90 min",
    price: "฿350–800",
    what: "Lighter pressure than traditional Thai. Warm oil applied and worked in. Combines Swedish and Thai techniques. Undress partially or fully.",
    pain: "Adjustable. Usually gentle-medium. More relaxing than traditional Thai.",
    best: "First-time massage experience, stress relief, relaxation.",
  },
  {
    name: "Foot Massage (นวดเท้า)",
    emoji: "🦶",
    duration: "60 min standard",
    price: "฿200–400",
    what: "Chair massage. Reflexology pressure points on feet and lower legs. Sometimes includes shoulder/neck portion.",
    pain: "Reflexology points can be very tender. The tenderness indicates which organs need attention (per Thai tradition).",
    best: "After walking, shopping, temples. Quick recovery for tired feet. Very common street service.",
  },
  {
    name: "Herbal Compress Ball (ลูกประคบ)",
    emoji: "🫙",
    duration: "Add-on 30 min, or full 90 min session",
    price: "Add-on: +฿150–300. Full session: ฿600–1,200",
    what: "Steamed cloth balls containing ginger, lemongrass, kaffir lime. Rolled over body to relieve inflammation and improve circulation.",
    pain: "Very low. The heat is the main sensation. Deeply soothing.",
    best: "Muscle recovery, joint pain, cold/flu recovery, post-exercise treatment.",
  },
];

const WHERE = [
  { tier: "Budget street parlor", price: "฿150–300/hr", example: "Anywhere near tourist zones — Khao San, Silom, Sukhumvit side streets" },
  { tier: "Mid-range neighborhood spa", price: "฿300–600/hr", example: "Health Land (chain, consistent quality), Divana Virtue" },
  { tier: "Hotel spa", price: "฿1,200–3,000/hr", example: "Chi (Shangri-La), Anantara Spa, Mandarin Oriental Spa" },
];

export function BangkokMassagePriceGuide() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🙏 Bangkok massage guide — types, prices & where to go
      </div>
      <div className="space-y-2 mb-3">
        {TYPES.map((t) => (
          <details key={t.name} className="border border-green-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-green-50 transition">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{t.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{t.duration}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{t.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-green-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{t.what}</div>
              <div className="text-[10px] text-orange-600">🌶 Pain level: {t.pain}</div>
              <div className="text-[10px] text-green-700">✅ Best for: {t.best}</div>
            </div>
          </details>
        ))}
      </div>
      <div className="border border-green-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-green-700 mb-1.5">💰 Price by venue tier</div>
        <div className="space-y-1">
          {WHERE.map((w) => (
            <div key={w.tier} className="text-[10px] text-[var(--fg)]">
              <span className="font-bold">{w.tier}</span> — {w.price} · {w.example}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
