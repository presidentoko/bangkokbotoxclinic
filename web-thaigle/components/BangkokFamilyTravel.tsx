const INFO = [
  {
    name: "Kid-Friendly Attractions in Bangkok",
    emoji: "👨‍👩‍👧‍👦",
    area: "Siam Discovery, Dusit Zoo, SEA LIFE Ocean World (Siam Paragon), Kidzania (EmQuartier)",
    price: "Kidzania ฿800–1,100/child; SEA LIFE ฿700–950/person; Museum ฿100–400",
    why: "Bangkok has extensive family-friendly infrastructure — the Siam mall area concentrates multiple family attractions within walking distance: SEA LIFE Ocean World (shark tank, ray touch pool, jellyfish exhibit), KidZania (role-playing career city for children aged 4–16), and the Siam Discovery's kid floors. Outside the mall zone: Dream World (Thai-style theme park with roller coasters), Chatuchak Weekend Market's puppet zone, and the Children's Discovery Museum near Chatuchak. Thailand's Buddhist temple culture is genuinely family-accessible — Wat Pho's giant reclining Buddha impresses children; the Grand Palace's scale and ornamentation is spectacular for young visitors.",
    tip: "Bangkok family travel logistics: the BTS Skytrain (air-conditioned, elevated above traffic) is the most family-friendly transport — stroller-accessible at most stations with lifts. Midday heat (11am–3pm) is harsh for young children outdoors — plan indoor activities for this window and outdoor exploration for morning and evening. Restaurant choice: Bangkok restaurants are almost universally child-welcoming — high chairs are available at most mid-range and above establishments; bring activities for wait times. For mixed-age families: the riverboat ferry to Asiatique Riverfront combines boat ride + night market with activities across age groups.",
  },
  {
    name: "Family Accommodation in Bangkok",
    emoji: "🏨",
    area: "Sukhumvit family hotels, serviced apartments, Siam area hotels",
    price: "Family room ฿2,000–8,000/night; Serviced apartment ฿3,000–15,000/night",
    why: "Bangkok's accommodation market has strong family options — serviced apartments (with kitchen facilities) allow meal preparation for picky-eater children and provide more space than hotel rooms. Several Bangkok hotel chains offer connecting rooms or family configurations with child-sized beds and childproofing available. The Sukhumvit BTS corridor concentrates family hotels within walking distance of supermarkets (Tops, Villa Market), international restaurants, and transit. Pool is near-universal at Bangkok hotels above budget tier — essential for heat management with children. The hotel's daycare or kids club availability matters for family scheduling.",
    tip: "Bangkok family accommodation selection criteria: pool with lifeguard (supervise toddler pool access carefully — Thai hotel pools may not have lifeguards), proximity to BTS (reduces taxi dependence with tired children), and in-house restaurant or kitchen access. Budget family travellers: the On Nut BTS area has family-friendly hotels at lower prices than the Asoke/Nana zone with equal BTS access. For extended stays: Oakwood, Somerset, and Ascott serviced apartment brands have Bangkok locations with proper kitchens, laundry facilities, and dedicated family configurations. Baby equipment: major supermarkets carry diapers, formula (Thai brands and imports), and baby food — bring specialized items from home.",
  },
  {
    name: "Day Trips & Nature with Children",
    emoji: "🌿",
    area: "Safari World (northeast Bangkok), Bang Krachao Green Lung, Kanchanaburi",
    price: "Safari World ฿1,500–2,000/person; Kanchanaburi day trip ฿2,000–4,000/family",
    why: "Bangkok's day trip options include several excellent child-focused natural experiences — Safari World (Bangkok's open safari park where animals approach vehicles) is the most child-pleasing day trip from Bangkok. Bang Krachao (the green lung river-enclosed area) provides cycling through quiet tropical greenery with fresh air — a near-miraculous contrast to Bangkok's density. Kanchanaburi (Death Railway area, 2.5 hours by road) combines wartime history (bridge, museum) with elephants at ethical sanctuaries and river activities. Floating market experiences (Amphawa, Damnoen Saduak — each 1.5–2 hours from Bangkok) provide canal culture accessible to all ages.",
    tip: "Safari World Bangkok tips: open safari section (morning) + marine park section (afternoon shows) makes a full day — arrive at opening for least heat. Animal encounter timing: the feeding times and show schedules are listed on arrival — plan the day around them. Elephant encounters near Bangkok: Elephant Jungle Sanctuary Kanchanaburi and similar ethical sanctuaries allow bathing and feeding without riding — the 'no riding' standard is the ethical benchmark. Water activities with children: Siam Park City water park (northeast Bangkok) and Cartoon Network Amazone (Pattaya) are the primary water park options — manageable day trips.",
  },
];

export function BangkokFamilyTravel() {
  return (
    <div className="rounded-2xl border border-yellow-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-800 mb-3">
        👨‍👩‍👧‍👦 Family travel in Bangkok — kids attractions, family hotels & day trips with children
      </h2>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-yellow-800">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
