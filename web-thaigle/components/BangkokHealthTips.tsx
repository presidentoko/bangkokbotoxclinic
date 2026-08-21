const TIPS = [
  {
    category: "Water & Food Safety",
    emoji: "💧",
    items: [
      "Never drink tap water. Bottled water ฿7–15 at 7-Eleven.",
      "Ice in restaurants is machine-made (clean). Avoid ice from ice bags in street stalls.",
      "Bangkok street food is generally safe — hot food = lower risk. Rice dishes left out = higher risk.",
      "Wash hands before eating. Most restaurants have soap + sinks in the bathrooms.",
      "Mango with sticky rice + coconut milk: safe and everywhere. Avoid pre-cut fruit left in sun.",
    ],
  },
  {
    category: "Sun & Heat",
    emoji: "☀️",
    items: [
      "Bangkok heat index regularly hits 38–42°C. Drink 3–4L water daily if active.",
      "SPF 50+ sunscreen is essential. Reapply every 2 hrs outdoors.",
      "Wear a hat between 10am–3pm. Museums, malls = natural cooling midday breaks.",
      "Heat exhaustion symptoms: headache + nausea + rapid pulse. Go to shade + cold water + electrolytes.",
      "7-Eleven sells 100PLUS electrolyte drink (฿20) — buy one on arrival.",
    ],
  },
  {
    category: "Mosquitoes & Dengue",
    emoji: "🦟",
    items: [
      "Dengue fever is present year-round in Bangkok. Use DEET repellent at dawn/dusk.",
      "Mosquito repellent at 7-Eleven: Sketolene DEET spray ฿80–120.",
      "If fever + severe headache + joint pain after mosquito exposure — see a doctor same day.",
      "Hotels in cities are generally low-risk. Risk increases near parks, canals, and green areas.",
      "Malaria is not a risk in Bangkok city. Only in rural/border areas.",
    ],
  },
  {
    category: "Medical Care",
    emoji: "🏥",
    items: [
      "Bangkok has world-class hospitals. Bumrungrad + Bangkok Hospital have dedicated international wards.",
      "Always travel with insurance — even minor emergencies can cost ฿5,000–50,000+.",
      "Pharmacy chains (Boots, Watsons, Fascino) sell most medication OTC without prescription.",
      "Emergency: 1669 (ambulance) or 191 (police). Most operators speak English.",
      "Tourist Police: 1155 (English-speaking, available 24/7).",
    ],
  },
];

export function BangkokHealthTips() {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🏥 Bangkok health & safety — what you need to know
      </h2>
      <div className="space-y-3">
        {TIPS.map((t) => (
          <div key={t.category} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{t.emoji}</span>
              <div className="font-bold text-xs">{t.category}</div>
            </div>
            <div className="space-y-1">
              {t.items.map((item) => (
                <div key={item} className="text-[10px] flex gap-1.5 items-start">
                  <span className="shrink-0 text-red-500 mt-0.5">•</span>
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
