const OPTIONS = [
  {
    name: "Thai Catering (Traditional Banquet Style)",
    emoji: "🍽️",
    type: "Formal Thai banquet",
    price: "฿350–800 per person depending on menu and service",
    why: "Traditional Thai catering for events means multiple dishes served family-style or banquet-style. Professional Thai catering companies handle everything from 50–5,000 guests. Menu typically includes: tom yum, green curry, fish dishes, rice, Thai desserts. Staff in traditional dress available.",
    tip: "Thai catering companies require 2-week minimum notice. Ask for: 'set A' (basic), 'set B' (premium), 'set C' (seafood-heavy). Price per head drops dramatically with volume: 50 pax vs 200 pax can be 30% different. Equipment rental (tables, chairs, chafing dishes) usually additional.",
  },
  {
    name: "Hotel Catering / MICE Services",
    emoji: "🏨",
    type: "Professional hotel F&B",
    price: "฿1,200–4,000+ per person (all-inclusive packages)",
    why: "5-star Bangkok hotels provide full catering services including venue, staff, food, AV, and event management. Most professional option for important corporate or wedding events. Thai, international, and fusion menus. Dedicated event coordinator assigned to each booking.",
    tip: "Hotel catering pricing includes venue, tables, linens, cutlery, staff, parking management. 'Minimum spend' structures (not per-head pricing) are common — negotiate F&B minimum versus venue fee. Sofitel, Marriott, and Shangri-La have Bangkok's most experienced event teams.",
  },
  {
    name: "Food Truck / Mobile Catering",
    emoji: "🚚",
    type: "Casual mobile catering",
    price: "฿150–450 per person; truck rental ฿8,000–25,000",
    why: "Bangkok's food truck scene has grown rapidly. Street food trucks (Thai BBQ, som tum, pad thai made fresh) can be booked for private events. Casual, fun atmosphere. Perfect for outdoor corporate events, birthday parties, or private festivals. No tent/venue needed for the food station.",
    tip: "Food truck catering in Bangkok: search 'food truck event Bangkok' on Facebook. Event coordinators who aggregate multiple food trucks for one event are available. 5+ trucks = better variety and competitive pricing. Trucks bring own equipment and prep.",
  },
  {
    name: "Private Chef Experience",
    emoji: "👨‍🍳",
    type: "Intimate private dining",
    price: "฿2,500–8,000 per person (including all food and service)",
    why: "Hire a professional chef to cook at your villa, rented house, or hotel suite. Increasingly popular for intimate dinners (4–15 people). Chef arrives, sets up, cooks, serves, and cleans. Menu customized to preferences. Restaurant-quality food in complete privacy.",
    tip: "Private chef bookings through platforms like Take a Chef, or direct contact with Bangkok culinary schools (they often have graduates willing to do private chef work). Book 1–2 weeks ahead. Provide shopping list preferences — chef sources fresh ingredients. Better value than restaurant for groups 8+.",
  },
];

export function BangkokCatering() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🍽️ Catering & private dining in Bangkok — options for every event type
      </div>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.type}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-amber-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
