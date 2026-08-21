const SPOTS = [
  {
    name: "Pantip Plaza",
    emoji: "💻",
    area: "Phetchaburi Rd (Ratchathewi BTS, 10 min walk)",
    why: "Bangkok's most famous IT mall. 5 floors of computers, software, gaming, accessories, phones. Gray market and parallel imports.",
    what: "Laptops, desktop parts, gaming peripherals, software (legitimate and... otherwise), second-hand phones, cables, chargers",
    price: "Competitive. Often 10–20% below retail for gray imports. Negotiate on larger items.",
    tip: "Level 4–5 for service/repair. Very cheap phone screen replacement, data recovery, custom PC builds.",
    note: "Software pricing is well-known here. Legal software at standard price; gray-market at risk.",
  },
  {
    name: "Fortune Town IT Mall",
    emoji: "🖥️",
    area: "Asok MRT (exit toward Fortune Town, 5 min)",
    why: "Larger and more modern than Pantip. Better for legitimate software, Apple products, and brand-name electronics.",
    what: "Apple resellers (iStudio, ThaiMac), Android phones, tablets, cameras, drones, smart home devices",
    price: "Close to official retail. Less gray market than Pantip.",
    tip: "JIB Computer Group (ground floor) has best legit laptop prices. Good for iPhones bought officially.",
    note: "Cleaner experience than Pantip. Better for people who want warranty.",
  },
  {
    name: "MBK Center (Floor 4)",
    emoji: "📱",
    area: "National Stadium BTS",
    why: "Massive used and unlocked phone market. 400+ phone stalls. Also cameras, accessories, and repair services.",
    what: "Second-hand iPhones and Android phones, unlocked phones, SIM cards, phone cases, screen protectors",
    price: "Used iPhones 30–50% cheaper than new. Negotiate for unlocked units.",
    tip: "Check for scratches and test immediately. Bring your SIM to test before paying. Receipts matter — insist on one.",
    note: "Mostly legitimate but inspect carefully. Counterfeit accessories are common — buy name-brand cables directly.",
  },
  {
    name: "Banana IT (Central/mall branches)",
    emoji: "🍌",
    area: "All major malls: Central Embassy, Siam Paragon, Terminal 21",
    why: "Thailand's largest legitimate electronics chain. Official warranty, fixed prices, English-speaking staff.",
    what: "All major brands, gaming laptops, cameras, Apple products, audio equipment",
    price: "Standard retail pricing. Tax refund available on purchases over ฿5,000.",
    tip: "Zero gray market risk. VAT refund on departure for tourism purchases. Best for peace of mind.",
    note: "Prices are non-negotiable. The confidence of warranty is worth the markup vs Pantip.",
  },
];

export function BangkokElectronics() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        💻 Bangkok electronics shopping — IT malls & phone markets
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <details key={s.name} className="border border-blue-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-blue-50 transition">
              <span className="text-xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-blue-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{s.why}</div>
              <div className="text-[10px] text-[var(--muted)] leading-snug">🛒 Sell: {s.what}</div>
              <div className="text-[10px] text-green-700">💰 {s.price}</div>
              <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
              <div className="text-[10px] text-blue-700">ℹ️ {s.note}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
