const NUMBERS = [
  { num: "1", thai: "หนึ่ง", roman: "neung" },
  { num: "2", thai: "สอง", roman: "song" },
  { num: "3", thai: "สาม", roman: "sam" },
  { num: "5", thai: "ห้า", roman: "ha" },
  { num: "10", thai: "สิบ", roman: "sip" },
  { num: "20", thai: "ยี่สิบ", roman: "yee-sip" },
  { num: "50", thai: "ห้าสิบ", roman: "ha-sip" },
  { num: "100", thai: "ร้อย", roman: "roi" },
];

const PHRASES = [
  { thai: "เท่าไหร่", roman: "tao rai?", meaning: "How much?" },
  { thai: "แพงเกินไป", roman: "paeng geun bpai", meaning: "Too expensive" },
  { thai: "ลดได้ไหม", roman: "lot dai mai?", meaning: "Can you lower the price?" },
  { thai: "เอาเถอะ", roman: "ao thoe", meaning: "I'll take it" },
  { thai: "ไม่เอา", roman: "mai ao", meaning: "I don't want it" },
];

export function ThaiNumberGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🔢 Thai numbers & market phrases
      </div>
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {NUMBERS.map((n) => (
          <div key={n.num} className="text-center bg-gray-50 rounded-lg p-1.5 border border-[var(--border)]">
            <div className="text-lg font-black text-orange-600">{n.num}</div>
            <div className="text-sm leading-none text-[var(--fg)] mb-0.5">{n.thai}</div>
            <div className="text-[10px] text-[var(--muted)]">{n.roman}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border)] pt-3">
        <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-2">Market bargaining</div>
        <div className="space-y-1.5">
          {PHRASES.map((p) => (
            <div key={p.meaning} className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold">{p.thai} </span>
                <span className="text-xs text-[var(--muted)]">({p.roman})</span>
              </div>
              <span className="shrink-0 text-[11px] font-bold text-teal-700">{p.meaning}</span>
            </div>
          ))}
        </div>
      </div>
      <a
        href="/local-tips"
        className="mt-3 block text-center text-xs font-bold text-teal-600 border border-teal-200 bg-teal-50 rounded-full py-1.5 hover:bg-teal-100 transition"
      >
        More Thai phrases →
      </a>
    </div>
  );
}
