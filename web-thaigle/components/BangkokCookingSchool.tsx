const SCHOOLS = [
  {
    name: "Baipai Thai Cooking School",
    emoji: "🏫",
    area: "Ngamwongwan, North Bangkok",
    price: "Half-day class ฿2,400–3,500; Market visit included",
    why: "Baipai is consistently ranked among Bangkok's top Thai cooking schools — the curriculum goes beyond pad thai and green curry to include regional Thai dishes, decorative fruit carving, and Thai herbal knowledge. Classes are small-group (max 8 students), taught in a traditional Thai house setting with an herb garden. The market visit at Bangkae Market in the morning provides genuine context for Thai ingredient sourcing — students learn to identify galangal vs. ginger, Thai basil vs. holy basil, and the different species of eggplant used in Thai cuisine.",
    tip: "Baipai schedule: classes run Tuesday–Sunday (closed Monday). Morning market tour starts at 8:30am. Dietary accommodations: vegetarian and vegan variations available with advance notice. Class size caps at 8 create genuine learning vs. demonstration-only classes at large tourist operations. The school is slightly off the tourist trail (requires taxi/Grab) but the quality justifies the travel. Book 1–2 weeks ahead for weekend classes.",
  },
  {
    name: "Blue Elephant Royal Thai Cuisine School",
    emoji: "🐘",
    area: "Sathorn (Si Lom area), near Surasak BTS",
    price: "Morning class ฿3,000–4,500; Full-day ฿6,000+",
    why: "Blue Elephant's cooking school operates in their colonial-era shophouse (formerly the Royal Dutch East Indies Railways headquarters) — the setting alone justifies visiting. The curriculum focuses on royal Thai cuisine (the refined palace cooking style that shaped modern Thai restaurant food internationally) rather than everyday street food. This is the school to attend if you want to learn presentation, flavor balancing, and the historical logic behind Thai cuisine. The attached restaurant serves lunch using student-prepared dishes.",
    tip: "Blue Elephant class format: morning classes begin with a Thai spice and herb orientation (essential for understanding Thai flavor building). Then cook 4–5 dishes and eat them for lunch. The school maintains high standards and teaches techniques applicable to home cooking. For the price, the experience is premium — Blue Elephant's restaurant reputation (Michelin-recognized) means instructors have professional kitchen standards. Advance booking essential (1–2 weeks minimum). The restaurant has a historical tour component — worthwhile even for non-cooking visitors.",
  },
  {
    name: "Silom Thai Cooking School",
    emoji: "🍳",
    area: "Silom Soi 13, central Bangkok",
    price: "Half-day class ฿1,500–2,000; Market tour included",
    why: "Silom Thai Cooking School offers the most accessible entry point to serious Thai cooking instruction — conveniently located in the Silom business district (5-minute walk from BTS Sala Daeng), small class sizes (10–12 students), and morning market visits at the Silom organic market. The curriculum covers classic Thai dishes across a 4-hour class — each student cooks their own portion rather than watching a demonstration. Vegetarian, vegan, and gluten-free versions offered. Multiple sessions daily.",
    tip: "Silom Cooking School logistics: the 9am morning session includes a market walk before cooking; the 2pm afternoon session skips the market. For first-time Thai cooking students: the morning session with market tour is significantly more educational — walking through the market with an instructor identifying ingredients creates mental maps for Thai grocery shopping later. Class sizes are kept intentionally small. Bring notes — the recipes are provided in a booklet but handwritten notes on technique help most. Conveniently central: easy to combine with Silom area exploration before/after.",
  },
];

export function BangkokCookingSchool() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🍳 Thai cooking schools in Bangkok — hands-on classes, market tours & royal cuisine
      </div>
      <div className="space-y-2">
        {SCHOOLS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
