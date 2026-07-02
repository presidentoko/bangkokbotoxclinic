const GEMS = [
  { name: "Bangkrachao Green Lung", emoji: "🌿", type: "Nature", area: "Phra Pradaeng", desc: "25 min from downtown. Rent a bike, cycle through mangroves and local farms. Zero tourists.", url: "/local-tips" },
  { name: "Warehouse 30", emoji: "🏭", type: "Art & food", area: "Charoen Krung", desc: "Converted WWII warehouse. Local designers, craft coffee, rotating art exhibitions. Sat–Sun best.", url: "/guide" },
  { name: "Khlong Lat Mayom", emoji: "🛶", type: "Market", area: "Taling Chan", desc: "Floating market with zero tourist prices. Try nam prik pla yang (grilled fish chili paste) from the boat.", url: "/restaurants/bangkok" },
  { name: "Bang Nam Pheung Market", emoji: "🌺", type: "Market", area: "Samut Prakan", desc: "Weekend floating market inside a huge mangrove. Come by motorbike taxi from BTS Kheha.", url: "/local-tips" },
  { name: "Phloen Chit Flower Market (midnight)", emoji: "🌸", type: "Market", area: "Ratchaprasong", desc: "Pak Khlong Talat midnight flower market. Stunningly photogenic. Active 12–3am.", url: "/local-tips" },
  { name: "Chulalongkorn Centenary Park", emoji: "🏙️", type: "Nature", area: "Siam", desc: "Rooftop park above a shopping mall. Dramatic city views, always quiet. Entry free.", url: "/activities" },
  { name: "Tha Tien Pier neighborhood", emoji: "🍜", type: "Food", area: "Rattanakosin", desc: "Behind Wat Pho: tiny alley restaurants serving excellent boat noodles for ฿40. Locals only.", url: "/restaurants/bangkok" },
];

export function HiddenGemPicker() {
  const seed = Math.floor(Date.now() / 86400000);
  const gem = GEMS[seed % GEMS.length];

  return (
    <a
      href={gem.url}
      className="block rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-teal-50 p-4 my-4 hover:border-green-400 hover:shadow-md transition group"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{gem.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-xs font-black uppercase tracking-widest text-green-700">Today&apos;s hidden gem</div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-200 text-green-800">{gem.type}</span>
          </div>
        </div>
      </div>
      <div className="font-black text-sm text-green-900 group-hover:text-green-700 transition mb-1">{gem.name}</div>
      <div className="text-xs text-green-800 opacity-90 leading-snug mb-2">{gem.desc}</div>
      <div className="text-[10px] text-green-700 font-medium">{gem.area} · Find out more →</div>
    </a>
  );
}
