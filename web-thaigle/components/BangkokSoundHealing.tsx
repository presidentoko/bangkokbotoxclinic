const OPTIONS = [
  {
    name: "Tibetan Singing Bowl Sessions",
    emoji: "🎵",
    area: "Wellness studios in Ari, Phrom Phong, Ekkamai",
    price: "Group session ฿500–1,200; Private ฿1,500–3,000",
    why: "Tibetan singing bowl sound healing has a significant presence in Bangkok's wellness scene — deeply influenced by Thailand's Buddhist culture and the country's proximity to Tibet and Nepal. The resonant frequencies of struck bronze singing bowls are used for relaxation, stress reduction, and meditative states. Practitioners with Tibetan or Nepalese training are available in Bangkok's wellness district.",
    tip: "Group sound bath sessions (10–20 people lying on yoga mats while bowls are played around them) are the most immersive format — the vibrations are felt physically as well as heard. Bangkok humidity does not affect the sound quality. Wear comfortable loose clothing and don't eat heavily beforehand.",
  },
  {
    name: "Crystal Singing Bowl & Modern Sound Healing",
    emoji: "🔮",
    area: "New-age wellness studios and yoga centers",
    price: "Workshop ฿400–1,000",
    why: "Crystalline quartz singing bowls produce higher-frequency tones than Tibetan metal bowls. Bangkok's yoga and mindfulness community has integrated crystal bowl sound healing into sessions. Often combined with guided meditation, breathwork, or yoga nidra (yogic sleep). Popular for corporate wellness events and spa-style relaxation treatments.",
    tip: "The difference between Tibetan (metal, warm overtones) and crystal (glass, bright tones) bowls is like the difference between a cello and a flute. Both are meditative tools. Some Bangkok practitioners specialize in combining both for a fuller harmonic range.",
  },
  {
    name: "Thai Traditional Music for Healing",
    emoji: "🪘",
    area: "Cultural centers and traditional music venues",
    price: "Workshop/performance ฿300–800",
    why: "Traditional Thai instruments — ranat (xylophone), khim (hammered dulcimer), saw duang (fiddle) — have been used in temple ceremonies for centuries with resonant meditative qualities. Several Bangkok cultural organizations offer Thai traditional music appreciation sessions. Convergence between traditional Thai music and contemporary sound healing is emerging in Bangkok's wellness space.",
    tip: "The khim (Thai hammered dulcimer) in skilled hands produces a sound remarkably similar to Tibetan healing instruments — the sustained resonance lends itself to meditative listening. The Thailand Cultural Centre and cultural troupes occasionally perform traditional music in healing or meditative contexts.",
  },
];

export function BangkokSoundHealing() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🎵 Sound healing in Bangkok — Tibetan bowls, crystal sound baths & Thai music
      </div>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-teal-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
