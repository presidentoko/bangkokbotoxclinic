const SIM_OPTIONS = [
  {
    provider: "True Move H (Tourist SIM)",
    price: "฿299–599",
    data: "100GB/15 days (฿299) or 30 days (฿599)",
    speed: "4G LTE. Most stable in tourist areas including BTS, malls.",
    buy: "Suvarnabhumi Airport (Level 1 Arrivals), any 7-Eleven, True Shop branches",
    setup: "Insert SIM, dial *100# to activate. English setup available.",
  },
  {
    provider: "AIS Tourist SIM",
    price: "฿299–499",
    data: "100GB/30 days (฿499) or 8 days (฿299)",
    speed: "Best 5G coverage in Bangkok. Best for Grab (faster maps).",
    buy: "Suvarnabhumi arrivals, AIS stores, Robinson/Central department stores",
    setup: "Pack includes English instructions. Call center 1175 for English support.",
  },
  {
    provider: "DTAC Tourist SIM",
    price: "฿200–350",
    data: "30GB/7 days or 50GB/15 days",
    speed: "Budget option. Slower but functional. Fine for normal use.",
    buy: "7-Eleven everywhere. Cheapest to find.",
    setup: "Auto-activates on insert. Check balance: *101#",
  },
];

const WIFI_TIPS = [
  "All malls, 7-Eleven, Starbucks, and major restaurants have free WiFi. Password often on receipt or ask staff.",
  "BTS Skytrain stations: 'AIS FreeWifi' network — open, fast for short use.",
  "Hotel WiFi is usually fast (20–100 Mbps). Ask for password at check-in.",
  "Tuk-tuks and metered taxis: no WiFi. Grab cars sometimes have hotspots.",
  "For coworking: CO-OP Samyan (150 Mbps), Hubba Ekkamai (200 Mbps) both have guaranteed fast connections.",
];

export function BangkokWifiSIM() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        📶 Bangkok SIM cards & WiFi — tourist connectivity guide
      </div>
      <div className="space-y-2 mb-4">
        {SIM_OPTIONS.map((s) => (
          <div key={s.provider} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="font-bold text-xs">{s.provider}</div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5">📡 {s.data}</div>
            <div className="text-[10px] text-[var(--muted)] mb-0.5">⚡ {s.speed}</div>
            <div className="text-[10px] text-teal-700 mb-0.5">🏪 Buy at: {s.buy}</div>
            <div className="text-[10px] text-orange-600">📲 Setup: {s.setup}</div>
          </div>
        ))}
      </div>
      <div className="border border-teal-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-teal-700 mb-2">📶 Free WiFi spots in Bangkok</div>
        <ul className="space-y-1">
          {WIFI_TIPS.map((t, i) => (
            <li key={i} className="text-[10px] text-[var(--fg)] leading-snug flex items-start gap-1.5">
              <span className="shrink-0 text-teal-400">•</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
