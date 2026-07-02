const SERVICES = [
  { service: "Thai massage 60 min", street: "฿200–300", mid: "฿400–600", luxury: "฿800–1,500" },
  { service: "Oil massage 90 min", street: "฿300–500", mid: "฿600–900", luxury: "฿1,500–3,000" },
  { service: "Foot reflexology 60 min", street: "฿150–250", mid: "฿300–500", luxury: "฿600–1,000" },
  { service: "Hot yoga class", street: "n/a", mid: "฿350–500", luxury: "฿600–900" },
  { service: "Float tank 90 min", street: "n/a", mid: "฿700–900", luxury: "฿1,200–1,800" },
  { service: "Infrared sauna 45 min", street: "n/a", mid: "฿400–600", luxury: "฿800–1,200" },
  { service: "Full spa package (3hr)", street: "n/a", mid: "฿1,800–3,000", luxury: "฿5,000–12,000" },
  { service: "Personal training session", street: "n/a", mid: "฿600–1,000", luxury: "฿1,500–3,000" },
];

export function BangkokWellnessPrices() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        💰 Bangkok wellness prices — street vs mid vs luxury
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left pb-2 pr-2 font-black text-[var(--fg)]">Service</th>
              <th className="text-right pb-2 px-1 font-black text-green-700 whitespace-nowrap">Street</th>
              <th className="text-right pb-2 px-1 font-black text-blue-700 whitespace-nowrap">Mid-range</th>
              <th className="text-right pb-2 pl-1 font-black text-purple-700 whitespace-nowrap">Luxury</th>
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((s, i) => (
              <tr key={s.service} className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <td className="py-1.5 pr-2 font-medium text-[var(--fg)]">{s.service}</td>
                <td className="py-1.5 px-1 text-right text-green-700 font-mono">{s.street}</td>
                <td className="py-1.5 px-1 text-right text-blue-700 font-mono">{s.mid}</td>
                <td className="py-1.5 pl-1 text-right text-purple-700 font-mono">{s.luxury}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-[10px] text-[var(--muted)]">
        Prices in Thai Baht (฿). Tip: 10–15% is appreciated but not mandatory. Always give in cash.
      </div>
    </div>
  );
}
