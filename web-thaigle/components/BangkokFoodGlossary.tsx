const TERMS = [
  { thai: "ข้าว", roman: "Khao", meaning: "Rice — the core of every Thai meal" },
  { thai: "ก๋วยเตี๋ยว", roman: "Guay tiao", meaning: "Noodles — rice noodles in any form" },
  { thai: "ผัดไทย", roman: "Pad thai", meaning: "Stir-fried rice noodles with egg, tofu, bean sprouts" },
  { thai: "ต้มยำ", roman: "Tom yum", meaning: "Spicy & sour soup — shrimp version most common" },
  { thai: "แกงเขียวหวาน", roman: "Kaeng khiao wan", meaning: "Green curry — coconut milk + green chilies" },
  { thai: "ส้มตำ", roman: "Som tam", meaning: "Green papaya salad — spicy, sour, salty" },
  { thai: "มะม่วงข้าวเหนียว", roman: "Mango khao niao", meaning: "Mango sticky rice — Thailand's iconic dessert" },
  { thai: "ไก่ย่าง", roman: "Gai yang", meaning: "Grilled marinated chicken — sold on every street" },
];

export function BangkokFoodGlossary() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🍜 Essential Thai food vocabulary
      </h2>
      <div className="grid gap-2">
        {TERMS.map((t) => (
          <div key={t.roman} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50 border border-[var(--border)]">
            <div className="shrink-0 min-w-[56px]">
              <div className="text-sm leading-tight text-[var(--fg)] font-medium">{t.thai}</div>
              <div className="text-[10px] text-orange-600 font-mono">{t.roman}</div>
            </div>
            <div className="text-[11px] text-[var(--muted)] leading-snug pt-0.5">{t.meaning}</div>
          </div>
        ))}
      </div>
      <a
        href="/local-tips"
        className="mt-3 block text-center text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded-full py-1.5 hover:bg-orange-100 transition"
      >
        More Thai food tips →
      </a>
    </div>
  );
}
