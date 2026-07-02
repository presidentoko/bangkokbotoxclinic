const FACTS = [
  {
    q: "How much should a tuk-tuk cost?",
    a: "Negotiate BEFORE getting in. Short hop (1–2km): ฿60–100. Medium (2–5km): ฿100–200. Never pay more than ฿250 within central Bangkok. If price seems too low (฿10 to 'see the city'), it's a scam.",
  },
  {
    q: "The ฿10 tuk-tuk scam — how it works",
    a: "Driver offers ฿10–30 city tour. Stops at 2–3 'grand jewelry shops' or 'government tailors' with hard sales pressure. You spend 20 min at each (driver gets fuel vouchers). Common near Grand Palace, Khao San, Siam. Just decline or take BTS instead.",
  },
  {
    q: "When is a tuk-tuk actually worth it?",
    a: "Short trips where BTS doesn't go. Night market runs. Photo opportunity on your first night. Temple-to-temple in Old City where roads are narrow. The experience itself is genuinely fun once.",
  },
  {
    q: "Tuk-tuk vs Grab — which is faster?",
    a: "Grab is almost always faster for distances over 2km (no negotiation, A/C, meter price). Tuk-tuk wins only for 1–2 stop local hops where you know the neighborhood and have already agreed the price.",
  },
  {
    q: "Which tuk-tuks can I trust?",
    a: "Hotel-arranged tuk-tuks are reliable and fair. Street tuk-tuks near tourist sites: negotiate firmly or walk away if price doubles. Tuk-tuks parked outside temples are most likely to push shops scam.",
  },
];

export function BangkokTukTukGuide() {
  return (
    <div className="rounded-2xl border border-yellow-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🛺 Tuk-tuk guide — pricing, scams & when to use one
      </div>
      <div className="space-y-1.5">
        {FACTS.map((f) => (
          <details key={f.q} className="border border-yellow-200 rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer text-xs font-bold text-[var(--fg)] hover:text-yellow-700 transition flex items-center gap-2">
              <span className="flex-1">{f.q}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug">{f.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
