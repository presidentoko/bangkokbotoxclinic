const TRANSPORT = [
  {
    mode: "BTS Skytrain",
    emoji: "🚄",
    price: "฿16–59 per trip",
    coverage: "Sukhumvit Line + Silom Line — covers central Bangkok tourist areas",
    tip: "Rabbit card saves 15% vs single-journey tickets. Works on MRT too. Fastest option 7am–9am and 5pm–8pm rush hour when roads are gridlocked.",
    best_for: "Shopping malls, hotels, restaurants near BTS stations",
  },
  {
    mode: "MRT Subway",
    emoji: "🚇",
    price: "฿17–42 per trip",
    coverage: "Blue Line: Chinatown, Chatuchak, Silom, Sukhumvit. Purple Line: Bang Yai. Yellow Line: On Nut–Bang Na",
    tip: "Yellow Line (opened 2023) is underused but great for reaching On Nut and Bang Na areas. Blue Line covers Chinatown (Sam Yan station) and Lat Phrao.",
    best_for: "Chinatown, Chatuchak, connecting between BTS lines",
  },
  {
    mode: "Grab (ride-hailing)",
    emoji: "📱",
    price: "Car: ฿100–300 most trips. Motorbike: ฿40–100",
    coverage: "Citywide. Works even in areas BTS/MRT doesn't reach",
    tip: "Download app before arriving in Thailand. Premium car ฿150–250 more but avoids negotiating. GrabBike (motorbike taxi) is 3× faster in traffic — recommend for solo travelers only.",
    best_for: "Anywhere BTS/MRT doesn't go, late nights, luggage",
  },
  {
    mode: "Metered Taxi",
    emoji: "🚕",
    price: "Flag fall ฿35, roughly ฿60–150 for most trips",
    coverage: "Citywide",
    tip: "Always say 'pid meter' (turn on the meter) when entering. Refuse if driver won't use meter. Pink/orange taxis registered and safer. No tip expected but common.",
    best_for: "Late night when Grab surges, multiple passengers, fixed address destinations",
  },
  {
    mode: "Chao Phraya Express Boat",
    emoji: "⛵",
    price: "฿15–33 depending on flag color (orange = ฿15 locals, yellow = tourist)",
    coverage: "Riverside from Nonthaburi to Sathorn (BTS connection)",
    tip: "Orange flag = local boat (cheapest). Blue flag = tourist boat with guide narration. Runs 6am–8pm. Connects to Khao San Road, Grand Palace, Chinatown areas.",
    best_for: "Avoiding traffic, riverside sightseeing, Khao San / Grand Palace area",
  },
];

export function BangkokTransportGuide() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🗺️ Getting around Bangkok — all transport modes explained
      </div>
      <div className="space-y-2">
        {TRANSPORT.map((t) => (
          <details key={t.mode} className="border border-sky-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-sky-50 transition">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{t.mode}</div>
                <div className="text-[10px] text-[var(--muted)] truncate">{t.best_for}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{t.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-sky-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{t.coverage}</div>
              <div className="text-[10px] text-sky-700">💡 {t.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
