const RULES = [
  {
    rule: "Always insist on the meter",
    emoji: "📊",
    why: "Thai law requires meters in licensed taxis. A taxi refusing to use meter is likely illegal or overcharging. Flag down a different cab.",
    how: "Say 'meter na krap/ka' (มิเตอร์นะครับ/ค่ะ) as soon as you sit down. If refused, exit politely.",
    trap: "Fixed price offers ('200 baht to Sukhumvit') are always overpriced vs. meter.",
  },
  {
    rule: "Grab vs Taxi — know when to use each",
    emoji: "📱",
    why: "Grab shows you the final price upfront — no surprises. Metered taxis are often cheaper for short trips and during non-peak hours.",
    how: "Rush hour (7–9am, 5–8pm): Grab — because taxis refuse short trips. Off-peak: either works fine.",
    trap: "Grab surge pricing can make it 2× standard taxi meter during heavy rain or events.",
  },
  {
    rule: "Know Bangkok addresses phonetically",
    emoji: "🗣️",
    why: "Many Thai taxi drivers don't read English well. Google Maps on your phone is your best tool.",
    how: "Show your destination on Google Maps Thai. Or say cross streets: 'Sukhumvit soi song sip haet' (Sukhumvit Soi 27).",
    trap: "Don't say 'hotel name' only — many drivers unfamiliar with new hotels. Show the map.",
  },
  {
    rule: "Night taxis add a surcharge (legal)",
    emoji: "🌙",
    why: "Night surcharge (midnight–5am) is legal and adds ฿50 to any trip. Also airport pickup surcharge ฿50.",
    how: "Check your taxi receipt at trip end — the meter should show the surcharge automatically.",
    trap: "Fake surcharges for other times (rush hour, rain, etc.) are NOT legal — these are tricks.",
  },
  {
    rule: "Start at ฿35 on the meter",
    emoji: "💰",
    why: "Official Bangkok taxi starting fare is ฿35 for the first 1km. Every 400–700m adds ฿1.50.",
    how: "A 5km trip costs roughly ฿70–90 by meter. Destination in Sukhumvit from Asok should cost ฿40–80 max.",
    trap: "If meter starts above ฿35, driver has tampered with it. Exit and take another cab.",
  },
];

export function BangkokTaxiEtiquette() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🚕 Bangkok taxi guide — meter rules, Grab tips & avoiding scams
      </div>
      <div className="space-y-2">
        {RULES.map((r) => (
          <div key={r.rule} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{r.rule}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{r.why}</div>
            <div className="text-[10px] text-green-700 mb-0.5">✅ How: {r.how}</div>
            <div className="text-[10px] text-red-600">⚠️ Trap: {r.trap}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
