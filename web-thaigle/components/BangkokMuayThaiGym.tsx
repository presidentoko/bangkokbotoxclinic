const GYMS = [
  {
    name: "Fairtex Muay Thai — Bangkok",
    emoji: "🥊",
    area: "Bang Phli (20 min from Suvarnabhumi), also Sukhumvit",
    price: "Daily training ฿500–1,000; Monthly ฿8,000–18,000",
    why: "Thailand's most internationally recognized Muay Thai brand. Professional training environment with world-champion coaches. Multiple levels from beginner tourists to serious competitors. Accommodation attached (Bang Phli location). International fighters train here regularly.",
    tip: "Sukhumvit location is more convenient for tourists. Morning sessions (8–11am) are best — smaller class size than afternoon. Single session ฿500 with glove/pad rental included. Call ahead to confirm current schedule — trainers' availability varies.",
  },
  {
    name: "Evolve MMA (Muay Thai training)",
    emoji: "🏆",
    area: "Orchard Towers adjacent, BTS Chidlom area",
    price: "Group class ฿1,500–2,500; Private ฿3,500–6,000",
    why: "Premium MMA and Muay Thai gym with multiple world champion coaches from Thailand, Brazil, Japan. Extremely clean facility. Air-conditioned. Multiple morning and evening class slots. Also offers BJJ, boxing, wrestling. Best if you want serious Muay Thai in polished environment.",
    tip: "Most expensive option but quality matches price. Trial class available (฿1,000). Private sessions with specific champion coaches available by appointment (book 1 week ahead). Good for beginners — safety-focused with structured programs.",
  },
  {
    name: "Sasiprapa Muay Thai Gym",
    emoji: "🎽",
    area: "Bangkok Noi / Thonburi area",
    price: "Daily ฿300–600; Monthly ฿6,000–12,000",
    why: "Traditional Thai Muay Thai camp where real Thai fighters train. Less tourist-oriented, more authentic atmosphere. Training with actual stadium fighters. No air-conditioning, old-school pads and ring. For those who want genuine Muay Thai experience rather than premium gym.",
    tip: "Communication is primarily in Thai — bring Google Translate. Respect fighters' warm-up time (don't jump in uninvited). Best to call ahead even with language barrier — someone usually speaks basic English. Cash only. Great Instagram content for serious trainers.",
  },
  {
    name: "Punch It Gym (Tourist-Friendly)",
    emoji: "🤜",
    area: "Khao San Road area / Banglamphu",
    price: "Drop-in ฿500; 5-class pass ฿2,000",
    why: "Most tourist-accessible Muay Thai gym in Bangkok. Walk-in welcome, English spoken. Beginner-oriented classes, flexible scheduling. Close to Khao San Road backpacker area. Great for travelers who want to try a real Muay Thai session without commitment.",
    tip: "Perfect for 1–3 sessions during a tourist stay. Beginner friendly — instructors explain basics in English. Gear available to borrow. Wear shorts and bring a bottle of water. 2-hour sessions (1h technique + 1h conditioning). Walk-in welcome, no booking needed.",
  },
];

const BASICS = [
  "Muay Thai is 'the art of eight limbs' — fists, elbows, knees, kicks all legal",
  "Training session: warm-up run → shadow boxing → pad work → bag work → sparring (advanced)",
  "Bring: athletic shorts (below knee), sports bra/tank, mouth guard if sparring",
  "Most gyms provide gloves and hand wraps — bring your own for hygiene if training regularly",
  "Etiquette: respect the Wai Kru ceremony (pre-fight ritual), don't touch someone's head",
  "Beginner sessions focus on technique: jab, cross, teep (push kick), roundhouse kick",
];

export function BangkokMuayThaiGym() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥊 Muay Thai gyms in Bangkok — train like a fighter
      </div>
      <div className="space-y-2 mb-3">
        {GYMS.map((g) => (
          <div key={g.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{g.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{g.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{g.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.why}</div>
            <div className="text-[10px] text-red-700">💡 {g.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-red-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-red-700 hover:bg-red-50">
          Muay Thai training basics
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {BASICS.map((b) => (
            <li key={b} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-red-400 shrink-0">•</span>{b}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
