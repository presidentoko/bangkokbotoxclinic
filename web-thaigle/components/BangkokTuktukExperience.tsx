const ROUTES = [
  {
    route: "Old Town Night Tuk-Tuk",
    emoji: "🛺",
    best: "Rattanakosin Island (Grand Palace area to Khao San)",
    price: "Negotiate: ฿100–200 for 15–20 min ride",
    when: "8pm–11pm when road traffic eases",
    why: "At night in old Bangkok, tuk-tuk beats walking and taxi for charm. Wind in your face through illuminated temple streets.",
    howTo: "Negotiate before sitting. Say your destination. Name a fair price first — ฿100–150 for short hops is reasonable.",
    avoid: "Daytime tuk-tuks offering 'special tour + free shop' — they earn commission at gem stores and tailor shops. Politely decline and walk away.",
  },
  {
    route: "Yaowarat Chinatown to Wat Pho",
    emoji: "🏮",
    best: "Short hop across old Bangkok",
    price: "฿80–120 negotiated",
    when: "Anytime. Interesting route through narrow streets.",
    why: "Experience Bangkok's old Chinese neighborhoods at close range. Tuk-tuk can navigate narrow alleys cars can't.",
    howTo: "Stand at Yaowarat intersection and hail any tuk-tuk. Show destination on Google Maps.",
    avoid: "Don't let them 'suggest a route' — state where you want to go directly and negotiate price first.",
  },
];

const TIPS = [
  "Tuk-tuks are NOT metered — always negotiate price BEFORE sitting down. Stand your ground.",
  "Fair price: ฿50–100 for very short (under 1km). ฿100–200 for 2–5 minutes. ฿200–300 for longer.",
  "Tuk-tuks are loud, open-air, and smell like diesel. Fun for 1 short ride; impractical for longer trips.",
  "Night is better: cooler, less traffic, more atmospheric — daytime Bangkok heat + exhaust + traffic = uncomfortable.",
  "Grab GreenTuk (electric tuk-tuk): available in app as a Grab option. Fixed price, AC. More comfortable.",
];

const SCAM = [
  "Never accept a 'free city tour' from a tuk-tuk driver — it always ends at gem/tailor shops with high-pressure sales.",
  "Driver says 'Grand Palace is closed today' — IT IS NEVER CLOSED for 'religious ceremonies'. Classic scam starter.",
];

export function BangkokTuktukExperience() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🛺 Bangkok tuk-tuk guide — when to ride, price to pay, scams to avoid
      </div>
      <div className="space-y-2 mb-3">
        {ROUTES.map((r) => (
          <div key={r.route} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{r.route}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.best} · Best time: {r.when}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{r.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">✅ How: {r.howTo}</div>
            <div className="text-[10px] text-red-600">⚠️ Avoid: {r.avoid}</div>
          </div>
        ))}
      </div>
      <div className="border border-orange-100 rounded-xl p-3 mb-2">
        <div className="text-[10px] font-bold text-orange-700 mb-1.5">💡 Tuk-tuk tips</div>
        <ul className="space-y-0.5">
          {TIPS.map((t, i) => (
            <li key={i} className="text-[10px] text-[var(--fg)] leading-snug flex items-start gap-1.5">
              <span className="text-orange-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </div>
      <div className="border border-red-100 rounded-xl p-3 bg-red-50">
        <div className="text-[10px] font-bold text-red-700 mb-1.5">🚨 Common tuk-tuk scams</div>
        <ul className="space-y-0.5">
          {SCAM.map((s, i) => (
            <li key={i} className="text-[10px] text-red-700 leading-snug flex items-start gap-1.5">
              <span className="shrink-0">•</span>{s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
