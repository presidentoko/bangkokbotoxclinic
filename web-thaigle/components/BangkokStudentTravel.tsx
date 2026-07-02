const TIPS = [
  {
    category: "Getting the Best Accommodation",
    emoji: "🛏️",
    advice: "Khaosan Road area: backpacker dorms ฿200–400/night. Silom budget guesthouses: ฿500–900 for private room. For longer stays (1 week+): serviced apartments in On Nut area start at ฿8,000–12,000/month. Hostels in Ari or Ekkamai for a more local experience than Khaosan. Check Hostelworld and Booking.com for last-minute deals.",
  },
  {
    category: "Eating Like a Local on ฿200/day",
    emoji: "🍜",
    advice: "Breakfast: ฿40–60 (pad kra pao rice from corner stall). Lunch: ฿50–80 (canteen-style khao man gai). Dinner: ฿60–120 (night market noodles or somtam). Total: under ฿250. Avoid tourist menus (marked in English with photos — 2–3x price). Ask for 'khao rad na' (rice with topping) at any Thai stall — always cheap. 7-Eleven hot food section: remarkably cheap.",
  },
  {
    category: "Free & Cheap Things to Do",
    emoji: "🎭",
    advice: "Grand Palace area (Sanam Luang public ground): free. National Museum: ฿200. Lumphini Park: free. Chatuchak weekend market browsing: free. Temple visits (most): free. BTS/MRT travel card (Rabbit card): refillable, saves queuing. MBK Center shopping: student-friendly prices on phone accessories, clothes, electronics.",
  },
  {
    category: "Student Discounts",
    emoji: "🎓",
    advice: "ISIC card (International Student Identity Card) recognized at some Bangkok museums. Most popular attractions don't offer student discounts — don't rely on it. Thai national museum: ISIC honored. University campuses (Chulalongkorn, Thammasat) have cafeterias open to public at subsidized prices (฿30–50 per meal).",
  },
  {
    category: "Nightlife on a Budget",
    emoji: "🍺",
    advice: "RCA (Royal City Avenue): local club scene, ฿100–200 covers. Khaosan Road: cheap bucket cocktails (rum/energy drink in bucket ฿200). 7-Eleven beer (Chang, Leo, Singha): ฿40–55 per can — take to a park or riverside. Happy hour at most bars 4–7pm (buy 1 get 1 free or 50฿ off). Avoid tourist club areas (Patpong) — overpriced.",
  },
  {
    category: "Safety for Students",
    emoji: "🛡️",
    advice: "Bangkok is genuinely student-safe. Main scams: tuk-tuk tours to gem shops (always decline 'free tours' from strangers near Grand Palace). Taxi: always use Grab app, never negotiate non-metered trips. Protect your phone and wallet on public transit during rush hour. Keep passport copy separate from original.",
  },
];

export function BangkokStudentTravel() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🎓 Bangkok student travel — budget tips, cheap eats & nightlife guide
      </div>
      <div className="space-y-2">
        {TIPS.map((t) => (
          <div key={t.category} className="border border-violet-100 rounded-xl p-3">
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
