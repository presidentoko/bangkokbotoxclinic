// Estimated trip cost: roundtrip flight from common cities + 5-night Bangkok hotel.
// Helps medical tourists see all-in cost vs. local pricing.

const FLIGHTS: { flag: string; city: string; thb: number }[] = [
  { flag: "🇰🇷", city: "Seoul (ICN)",      thb: 18_000 },
  { flag: "🇯🇵", city: "Tokyo (NRT)",      thb: 22_000 },
  { flag: "🇸🇬", city: "Singapore (SIN)",  thb: 7_500 },
  { flag: "🇲🇾", city: "KL (KUL)",         thb: 5_500 },
  { flag: "🇭🇰", city: "Hong Kong (HKG)",  thb: 12_000 },
  { flag: "🇦🇪", city: "Dubai (DXB)",      thb: 25_000 },
  { flag: "🇸🇦", city: "Riyadh (RUH)",     thb: 28_000 },
  { flag: "🇺🇸", city: "Los Angeles (LAX)", thb: 45_000 },
  { flag: "🇬🇧", city: "London (LHR)",      thb: 40_000 },
  { flag: "🇦🇺", city: "Sydney (SYD)",      thb: 28_000 },
];

const HOTEL_5NIGHTS = 9_000; // ฿1,800/night, decent 3-star near Sukhumvit

export default function TravelPackageWidget({ procedureCostTHB }: { procedureCostTHB?: number }) {
  return (
    <section className="rounded-2xl border bg-white p-5 sm:p-6" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">All-in trip cost</div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight mt-1">Even with travel, Bangkok wins</h3>
        <p className="text-xs text-[rgb(var(--muted))] mt-1">Roundtrip flight + 5-night decent hotel. Off-peak averages, 2-week advance booking.</p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {FLIGHTS.map((f) => {
          const total = f.thb + HOTEL_5NIGHTS + (procedureCostTHB || 0);
          return (
            <li key={f.city} className="rounded-lg border bg-slate-50 p-3 flex items-center gap-3" style={{ borderColor: "rgb(var(--border))" }}>
              <span className="text-xl shrink-0">{f.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{f.city}</div>
                <div className="text-[10px] text-[rgb(var(--muted))] tabular-nums">
                  ✈️ ฿{f.thb.toLocaleString()} + 🏨 ฿{HOTEL_5NIGHTS.toLocaleString()}
                  {procedureCostTHB ? ` + 💉 ฿${procedureCostTHB.toLocaleString()}` : ""}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-[rgb(var(--muted))]">Total</div>
                <div className="font-black tabular-nums">฿{Math.round(total / 1000)}K</div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-[10px] text-[rgb(var(--muted))] mt-3 leading-relaxed">
        Flight prices are typical low/mid season averages. Hotel: ฿1,800/night × 5 nights near most clinics. Add visa/insurance separately.
      </p>
    </section>
  );
}
