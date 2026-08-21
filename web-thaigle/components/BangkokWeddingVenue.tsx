const VENUES = [
  {
    name: "Anantara Riverside Bangkok Resort",
    emoji: "🌴",
    area: "Charoen Nakhon, opposite ICONSIAM (shuttle boat from Sathorn pier)",
    type: "Garden riverside wedding",
    capacity: "20–500 guests",
    price: "฿150,000–1,500,000+",
    why: "Bangkok's most beautiful garden wedding venue. Chao Phraya River backdrop. Multiple indoor/outdoor spaces. 24-hour concierge for wedding planning.",
    services: "In-house coordinator, catering, floral, photography referrals, honeymoon suite package.",
    tip: "Book 12–18 months ahead for peak season (Oct–Feb). Destination wedding packages for international couples.",
  },
  {
    name: "Capella Bangkok",
    emoji: "✨",
    area: "Charoenkrung (Saphan Taksin BTS area, hotel river shuttle)",
    type: "Ultra-luxury intimate wedding",
    capacity: "8–120 guests",
    price: "฿300,000–2,000,000+",
    why: "Bangkok's most recently awarded hotel for weddings (2023–2025). River-facing pavilion. Exceptional cuisine. Intimately small.",
    services: "Full wedding planning service, exclusive chef's table catering, flower decoration in-house.",
    tip: "Best for under 120 guests who want absolute luxury. River suite for wedding night is extraordinary.",
  },
  {
    name: "The Peninsula Bangkok",
    emoji: "🏰",
    area: "Bangrak, opposite ICONSIAM (hotel river shuttle)",
    type: "Classic luxury ballroom wedding",
    capacity: "30–500 guests",
    price: "฿200,000–2,000,000+",
    why: "Bangkok's most prestigious ballroom. Crystal chandeliers, marble. Most traditional luxury wedding experience. Helipad ceremony possible.",
    services: "Peninsula wedding team, luxury menu, accommodation blocks for guests, transport coordination.",
    tip: "Traditional Thai wedding blessings from local monks can be arranged. Most organized wedding team in Bangkok.",
  },
];

const TIPS = [
  "Legal wedding registration in Thailand requires: passport, embassy affidavit, divorce certificate if applicable. Register at district office (amphur).",
  "Buddhist blessing ceremonies are common — hire local monks (฿5,000–15,000) for morning alms and blessing.",
  "Peak wedding season Oct–Feb (dry season, comfortable 28–32°C). Avoid March–May (very hot) and June–Oct (rainy season risk).",
  "Destination weddings: allow 6–12 months planning. Many venues have international coordinator contacts.",
];

export function BangkokWeddingVenue() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        💍 Bangkok wedding venues — destination weddings & ceremonies
      </h2>
      <div className="space-y-2 mb-4">
        {VENUES.map((v) => (
          <details key={v.name} className="border border-pink-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-pink-50 transition">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{v.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{v.type} · {v.capacity}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-pink-700">{v.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-pink-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{v.why}</div>
              <div className="text-[10px] text-[var(--muted)] leading-snug">📋 {v.services}</div>
              <div className="text-[10px] text-orange-600">💡 {v.tip}</div>
            </div>
          </details>
        ))}
      </div>
      <div className="border border-pink-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-pink-700 mb-2">💍 Bangkok wedding planning essentials</div>
        <ul className="space-y-1">
          {TIPS.map((t, i) => (
            <li key={i} className="text-[10px] text-[var(--fg)] leading-snug flex items-start gap-1.5">
              <span className="text-pink-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
