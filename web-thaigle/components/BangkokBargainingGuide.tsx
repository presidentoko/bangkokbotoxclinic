const PHRASES = [
  { thai: "เท่าไหร่", roman: "Tao rai?", meaning: "How much?" },
  { thai: "แพงไป", roman: "Paeng bpai", meaning: "Too expensive" },
  { thai: "ลดได้ไหม", roman: "Lod dai mai?", meaning: "Can you reduce?" },
  { thai: "เอา [number] ได้ไหม", roman: "Ao [number] dai mai?", meaning: "Can I get it for [price]?" },
  { thai: "ถูกกว่านี้ได้ไหม", roman: "Tuk kwa nee dai mai?", meaning: "Can it be cheaper than this?" },
  { thai: "ไม่เอา", roman: "Mai ao", meaning: "I don't want it / No thanks" },
];

const RULES = [
  { rule: "Only bargain at markets, never in malls or restaurants", ok: true },
  { rule: "Start at 50–60% of asking price", ok: true },
  { rule: "Walk away slowly — often the seller calls you back", ok: true },
  { rule: "Buy multiple items and ask for a bundle deal", ok: true },
  { rule: "Bargain for food or street eats", ok: false },
  { rule: "Negotiate aggressively or aggressively refuse", ok: false },
];

export function BangkokBargainingGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🤝 Bargaining in Bangkok — how to do it right
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {RULES.map((r) => (
          <div key={r.rule} className={`text-[10px] flex gap-1.5 items-start p-2 rounded-xl border ${r.ok ? "border-green-200 bg-green-50" : "border-red-100 bg-red-50"}`}>
            <span className="shrink-0">{r.ok ? "✓" : "✗"}</span>
            <span>{r.rule}</span>
          </div>
        ))}
      </div>
      <div className="text-xs font-black mb-2">Useful phrases</div>
      <div className="space-y-1">
        {PHRASES.map((p) => (
          <div key={p.roman} className="flex items-center justify-between border border-[var(--border)] rounded-lg px-3 py-1.5">
            <div>
              <span className="text-xs font-mono font-bold">{p.roman}</span>
              <span className="text-[10px] text-[var(--muted)] ml-2">{p.meaning}</span>
            </div>
            <span className="text-[10px] text-[var(--muted)] font-mono">{p.thai}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-amber-700 bg-amber-50 rounded-xl p-2 border border-amber-200">
        <strong>Golden rule:</strong> Bargaining is fun and expected in markets. But always stay friendly and smile — "losing face" is a serious Thai concept. Never aggressively push or mock the price.
      </div>
    </div>
  );
}
