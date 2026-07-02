const TIPS = [
  {
    category: "Getting Around Together",
    emoji: "🚌",
    advice: "For groups of 4–6: Grab XL (7-seat van) is cheapest and most flexible. For 8+: book minivan from hotel (฿1,800–3,500/day driver included) — far more efficient than coordinating multiple Grabs. BTS/MRT works for groups in off-peak but rush hour (7:30–9am, 5–7pm) gets tight. Tuk-tuks: fun for 2 people, impractical for groups.",
  },
  {
    category: "Group Food & Restaurants",
    emoji: "🍜",
    advice: "Thai restaurants are naturally group-friendly — dishes come in the center for sharing. Minimum spend is per-table, not per-person, making large group dining economical. Best group formats: hot pot (mookata, ฿200–350/person, unlimited time), Thai BBQ (same), Chinese dim sum (1–2 people can order from the trolley). Reserve for groups of 8+ always.",
  },
  {
    category: "Activities Together",
    emoji: "🎉",
    advice: "Muay Thai show (tickets bloc-booked, everyone watches together), cooking class (groups of 4–16 work well, very social), escape rooms (6–8 player rooms available), Thai massage (book adjacent rooms at same shop), river cruise (private charters available for 20+ people).",
  },
  {
    category: "Accommodation Strategy",
    emoji: "🏨",
    advice: "For groups of 6+: serviced apartment or Airbnb villa often cheaper and more social than multiple hotel rooms. Chatrium Residence, Fraser Suites, and multiple Sukhumvit serviced apartments have multi-bedroom units. Pool villa through Airbnb for special occasions. Connecting rooms at hotels if the group prefers hotel services.",
  },
  {
    category: "Money & Group Logistics",
    emoji: "💳",
    advice: "Split payment apps (Splitwise) work globally — designate one person to pay, others reimburse. Bangkok merchants rarely split bills across multiple cards. ATM withdrawal limits mean one person needs to be the 'banker' for cash purchases. Line app (most popular in Thailand) — create a group chat before arrival.",
  },
  {
    category: "Group Discount Opportunities",
    emoji: "🎟️",
    advice: "Grand Palace: no group discount but guides available for ฿2,000–5,000 for the whole group. Cooking classes: groups of 8+ usually get 10–15% off. Private longtail boat: split among 8 people is ฿200/person for 2 hours — far cheaper than individual tickets. Private van transport: split 8 ways can be cheaper than Grab.",
  },
];

export function BangkokGroupTravel() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        👥 Bangkok group travel — transport, dining, activities & cost-splitting
      </div>
      <div className="space-y-2">
        {TIPS.map((t) => (
          <div key={t.category} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <div className="font-bold text-xs">{t.category}</div>
            </div>
            <div className="text-[10px] text-[var(--fg)] leading-snug">{t.advice}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
