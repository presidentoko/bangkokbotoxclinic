"use client";
import { useState } from "react";

const CATEGORIES = [
  {
    label: "Restaurant",
    icon: "🍜",
    phrases: [
      { th: "ขอเมนูหน่อยครับ", roman: "Kho menu noi khrap", en: "May I see the menu?" },
      { th: "ไม่เผ็ด", roman: "Mai phet", en: "Not spicy" },
      { th: "อร่อยมาก", roman: "Aroy mak", en: "Very delicious!" },
      { th: "เก็บเงินด้วยครับ", roman: "Kep ngoen duay khrap", en: "Check please" },
    ],
  },
  {
    label: "Taxi / Grab",
    icon: "🚕",
    phrases: [
      { th: "ไปที่นี่ครับ", roman: "Pai thi ni khrap", en: "Go here please" },
      { th: "เปิดมิเตอร์ด้วย", roman: "Poet mite duay", en: "Use the meter please" },
      { th: "จอดตรงนี้ครับ", roman: "Chot trong ni khrap", en: "Stop here please" },
      { th: "แพงไปครับ", roman: "Phaeng pai khrap", en: "That's too expensive" },
    ],
  },
  {
    label: "Shopping",
    icon: "🛍️",
    phrases: [
      { th: "ราคาเท่าไหร่", roman: "Raka thao rai", en: "How much?" },
      { th: "ลดราคาได้ไหม", roman: "Lot raka dai mai", en: "Can you discount?" },
      { th: "แพงเกินไป", roman: "Phaeng koen pai", en: "Too expensive" },
      { th: "ขอดูได้ไหม", roman: "Kho du dai mai", en: "Can I see it?" },
    ],
  },
  {
    label: "Emergency",
    icon: "🆘",
    phrases: [
      { th: "ช่วยด้วย", roman: "Chuay duay", en: "Help!" },
      { th: "เรียกตำรวจ", roman: "Riak tamruat", en: "Call the police" },
      { th: "โรงพยาบาลอยู่ที่ไหน", roman: "Rong phayaban yu thi nai", en: "Where is the hospital?" },
      { th: "ฉันหายไปครับ", roman: "Chan hai pai khrap", en: "I am lost" },
    ],
  },
];

export function PhraseBook() {
  const [cat, setCat] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    }).catch(() => {});
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-sm font-black mb-3">📖 Bangkok Phrase Book</div>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {CATEGORIES.map((c, i) => (
          <button
            key={i}
            onClick={() => setCat(i)}
            className={`text-xs px-3 py-1.5 rounded-full font-bold border transition ${cat === i ? "bg-orange-500 text-white border-orange-500" : "border-[var(--border)] text-[var(--muted)] hover:border-orange-300"}`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {CATEGORIES[cat].phrases.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
            <div className="min-w-0">
              <div className="font-bold text-sm">{p.th}</div>
              <div className="text-xs text-[var(--muted)]">{p.roman} — {p.en}</div>
            </div>
            <button
              onClick={() => copy(p.th)}
              className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-[var(--border)] hover:border-orange-400 hover:text-orange-600 transition"
            >
              {copied === p.th ? "✓" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
