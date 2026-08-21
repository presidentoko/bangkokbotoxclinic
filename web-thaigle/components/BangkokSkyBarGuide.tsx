const BARS = [
  {
    name: "Sky Bar at Lebua (State Tower)",
    emoji: "🌃",
    area: "State Tower, Silom (near Saphan Taksin BTS)",
    floor: "63rd floor",
    price: "Minimum spend ฿2,500/person. Cocktails ฿550–900.",
    why: "Bangkok's most famous sky bar globally — featured in 'The Hangover Part II'. Dome-shaped top, 360° views, theatrical atmosphere.",
    dresscode: "Smart casual — no flip-flops, shorts, or sleeveless tops. Strictly enforced.",
    tip: "Arrive before 6pm to guarantee your spot. After 8pm it's very crowded. Their Hangovertini cocktail is worth ordering.",
  },
  {
    name: "Octave Rooftop Bar (Marriott Sukhumvit 57)",
    emoji: "🎵",
    area: "Sukhumvit 57 (Thong Lo BTS)",
    floor: "45–49th floors (multi-level)",
    price: "No minimum spend. Cocktails ฿350–500.",
    why: "Most 360° views of any Bangkok rooftop. Three levels wrapping around the building. More accessible than Sky Bar — no minimum spend, casual atmosphere.",
    dresscode: "Smart casual preferred but more relaxed enforcement than Lebua.",
    tip: "Best at 5:30pm for sunset. Tables fill fast — show up early or book online (they take reservations).",
  },
  {
    name: "Seen Restaurant & Bar (Avani Riverside)",
    emoji: "🌊",
    area: "Avani Riverside Hotel, Charoen Nakhon",
    floor: "26th floor",
    price: "Cocktails ฿380–450. No minimum.",
    why: "Chao Phraya River views from rooftop. Grand Palace, Wat Arun visible from here. More relaxed vibe than Lebua crowd.",
    dresscode: "Casual to smart casual. No strict enforcement.",
    tip: "Take BTS to Saphan Taksin then hotel shuttle boat across river (free for bar guests). Beautiful on full moon nights.",
  },
  {
    name: "CRU Champagne Bar (Centara Grand CentralWorld)",
    emoji: "🥂",
    area: "CentralWorld, Ratchaprasong BTS",
    floor: "59th floor",
    price: "Champagne and cocktails from ฿450. No minimum.",
    why: "Most central location — above Bangkok's biggest shopping mall. City center panorama. Perfect for shopping-and-cocktail combo.",
    dresscode: "Smart casual. Business district crowd.",
    tip: "Sunday afternoons quiet. Thursday–Saturday evenings very busy. CentralWorld shopping before sunset on the roof is a good use of time.",
  },
];

export function BangkokSkyBarGuide() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        🌃 Bangkok sky bars — cocktails with city views
      </h2>
      <div className="space-y-2">
        {BARS.map((b) => (
          <details key={b.name} className="border border-slate-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-slate-50 transition">
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{b.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{b.floor} · {b.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{b.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-slate-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{b.why}</div>
              <div className="text-[10px] text-slate-700">👔 Dress code: {b.dresscode}</div>
              <div className="text-[10px] text-orange-600">💡 {b.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
