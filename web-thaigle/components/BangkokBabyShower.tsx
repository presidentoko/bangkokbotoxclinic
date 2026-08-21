const IDEAS = [
  {
    title: "Afternoon Tea Baby Shower at a Hotel",
    emoji: "☕",
    venue: "Mandarin Oriental, Peninsula, or Sindhorn Midtown",
    price: "฿4,000–12,000 per person (group packages from ฿15,000)",
    why: "Bangkok's luxury hotels offer full baby shower packages — dedicated room setup, balloon decorations, custom cake, finger food. Mandarin Oriental and Peninsula have the most experience with expat-style private events. Elegant and hassle-free.",
    tip: "Book 3–4 weeks ahead for weekend slots. Hotels can arrange custom cakes with baby themes (฿2,000–6,000 additional). Outside food/cake typically not allowed — hotel catering only. Best for 8–20 guests.",
  },
  {
    title: "Private Villa Pool Party",
    emoji: "🏊",
    venue: "Airbnb/private villa rental with pool, north Bangkok or suburbs",
    price: "Villa ฿8,000–25,000/day + catering ฿300–600/person",
    why: "Bangkok has many rentable private pool villas on Airbnb and local booking platforms. Perfect for bigger groups (20–50 guests). Decorate yourselves, bring outside food/cake, hire a caterer. Full control, best value.",
    tip: "Search 'private pool villa Bangkok event' on Airbnb. Look for properties that explicitly allow events (some don't). Hire a catering service for ฿300–600/person for Thai-Western buffet. Party supply shops near Chatuchak for decorations.",
  },
  {
    title: "Restaurant Private Room Booking",
    emoji: "🍽️",
    venue: "Rooftop restaurants with private sections: Vertigo, Above Eleven, Long Table",
    price: "Minimum spend ฿15,000–50,000 depending on venue",
    why: "Many Bangkok restaurants have private dining rooms perfect for baby showers. Set menus available, sommelier service, beautiful settings. Long Table at Sukhumvit 16 has excellent views and good private room. Good for 15–30 guests.",
    tip: "Restaurants usually require a minimum spend rather than room hire fee. Confirm: do they allow outside cake? Most do for parties (sometimes a corkage fee applies). Send save-the-date 1 month ahead for good venues.",
  },
  {
    title: "Thai Cooking Class Baby Shower",
    emoji: "🥘",
    venue: "Silom Thai Cooking School or Blue Elephant",
    price: "฿2,500–6,000 per person",
    why: "Unique and memorable — guests learn to cook 4–5 Thai dishes together, then eat what they made. Blue Elephant's private event option is excellent. Themed around 'cooking for the new baby' — educational and delicious. For adventurous hosts.",
    tip: "Cooking class baby showers work best for smaller groups (8–15 people). Silom Thai Cooking School has private party packages. Blue Elephant's Grand Mother of Thai Cuisine kitchen is stunning but premium pricing. Book 6 weeks ahead.",
  },
];

export function BangkokBabyShower() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🍼 Baby shower ideas in Bangkok — venues & planning guide
      </h2>
      <div className="space-y-2">
        {IDEAS.map((idea) => (
          <div key={idea.title} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{idea.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{idea.title}</div>
                <div className="text-[10px] text-[var(--muted)]">{idea.venue}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{idea.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{idea.why}</div>
            <div className="text-[10px] text-pink-700">💡 {idea.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
