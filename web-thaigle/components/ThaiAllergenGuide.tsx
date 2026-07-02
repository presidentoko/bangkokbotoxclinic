const ALLERGENS = [
  {
    concern: "Peanuts",
    emoji: "🥜",
    thai: "ถั่วลิสง (Thua lisong)",
    how_to_say: "'Mai sai thua lisong' = No peanuts please",
    common_in: "Pad thai, satay sauce, some curries, stir-fries",
    risk: "high",
  },
  {
    concern: "Shellfish / shrimp paste",
    emoji: "🦐",
    thai: "กะปิ (Gapi)",
    how_to_say: "'Mai sai gapi' = No shrimp paste",
    common_in: "Almost ALL Thai cooking. Even 'vegetarian' dishes often have gapi.",
    risk: "very-high",
  },
  {
    concern: "Fish sauce",
    emoji: "🐟",
    thai: "น้ำปลา (Nam pla)",
    how_to_say: "'Mai sai nam pla' = No fish sauce",
    common_in: "Essentially everything. Ask for 'seasoning only with soy sauce'.",
    risk: "very-high",
  },
  {
    concern: "Gluten",
    emoji: "🌾",
    thai: "แป้งสาลี (Paeng salee)",
    how_to_say: "'Pen khon pae paeng salee' = I'm allergic to wheat",
    common_in: "Oyster sauce, soy sauce, some noodles, spring rolls",
    risk: "medium",
  },
  {
    concern: "Nuts (tree nuts)",
    emoji: "🌰",
    thai: "ถั่ว (Thua)",
    how_to_say: "'Pae thua — mai sai thua' = Nut allergy, no nuts",
    common_in: "Cashews in stir-fries, peanuts across dishes",
    risk: "medium",
  },
];

const RISK_COLORS: Record<string, string> = {
  "very-high": "bg-red-100 text-red-700",
  "high": "bg-orange-100 text-orange-700",
  "medium": "bg-yellow-100 text-yellow-700",
};

export function ThaiAllergenGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        ⚠️ Allergen guide for Thai food
      </div>
      <div className="space-y-2">
        {ALLERGENS.map((a) => (
          <div key={a.concern} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xl">{a.emoji}</span>
              <span className="font-bold text-xs">{a.concern}</span>
              <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${RISK_COLORS[a.risk]}`}>
                {a.risk === "very-high" ? "Very Common" : a.risk === "high" ? "Common" : "Moderate"}
              </span>
            </div>
            <div className="text-[10px] font-mono text-teal-700 bg-teal-50 rounded px-2 py-1 mb-1">{a.how_to_say}</div>
            <div className="text-[10px] text-[var(--muted)] leading-snug">Found in: {a.common_in}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-amber-700 bg-amber-50 rounded-xl p-2.5 border border-amber-200">
        <strong>Tip:</strong> For severe allergies, bring a printed allergy card in Thai. Most upscale restaurants can accommodate — smaller street stalls may not be safe.
      </div>
    </div>
  );
}
