const IDEAS = [
  {
    name: "Rooftop Restaurant at Sunset",
    emoji: "💍",
    area: "Sky Bar Lebua, Vertigo at Banyan Tree, Sirocco",
    price: "฿3,000–8,000 per couple for dinner",
    why: "Bangkok's most cinematic proposal setting — 63 floors above the city with 360° skyline views. Privately arranged with restaurant staff, rose petals and champagne available as add-ons. Vertigo at Banyan Tree and Sirocco (famous from The Hangover 2) both have open-air terraces with unobstructed views. Staff are experienced in romantic proposals — discreet professional photography can sometimes be arranged.",
    tip: "Call at least 2 weeks ahead to arrange a proposal. Request a corner table with city views. Best sunset time is 6pm–7pm. Lebua's Dome rooftop area has the most cinematic view of Bangkok — this is where The Hangover 2 was filmed. Budget ฿6,000–8,000 for dinner, drinks, and proposal décor.",
  },
  {
    name: "Private Boat on Chao Phraya",
    emoji: "🛥️",
    area: "Chao Phraya River, Asiatique, Wat Arun view",
    price: "Private charter ฿3,500–12,000 for 2 hours",
    why: "River dinner cruise on a private long-tail boat or small charter — Wat Arun illuminated at night from the water is uniquely romantic. Private charters allow full customization — roses, champagne, private butler, customized music. The contrast of the glittering modern Bangkok skyline reflected in the river with ancient temple spires creates an irreplaceable romantic backdrop.",
    tip: "Best booked through luxury hotels on the river (Mandarin Oriental, Capella Bangkok). Monsoon season (June–October) means some evenings are cancelled — book a backup plan for peak rain months. Charter boats from Asiatique at 7pm for Wat Arun at its best (fully lit). Sit at the bow facing Wat Arun when the boat slows.",
  },
  {
    name: "Private Temple Garden Setting",
    emoji: "🌸",
    area: "Hotel gardens or temple-adjacent venues",
    price: "Package ฿5,000–20,000 depending on arrangement",
    why: "Some Bangkok luxury hotels offer private proposal packages in their Thai-garden settings — jasmine-strewn paths, candles, and privacy away from city noise. The Peninsula Bangkok's garden pavilion, Capella Bangkok's riverside terrace, and Rosewood Bangkok's rooftop terrace all offer bespoke proposal arrangements. Different aesthetic from the rooftop bar formula — quieter and more intimate.",
    tip: "For the most private experience, go through the hotel's concierge/butler service — they've arranged dozens of proposals and know exactly what works. Flowers and champagne are almost universal; consider adding a traditional Thai element (jasmine garland, Thai floral arrangement) to make it uniquely Bangkok.",
  },
];

export function BangkokProposal() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        💍 Propose in Bangkok — rooftops, river charters & private gardens
      </h2>
      <div className="space-y-2">
        {IDEAS.map((i) => (
          <div key={i.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{i.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-pink-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
