const STORES = [
  {
    name: "Studio Secondhand (Chatuchak)",
    emoji: "👕",
    area: "Chatuchak Weekend Market, Section 5-6",
    price: "Jeans ฿100–500, Shirts ฿60–250, Jackets ฿200–800",
    open: "Sat–Sun 9am–6pm",
    selection: "90s US and European secondhand, Japanese vintage casualwear",
    why: "Bangkok's largest cluster of vintage clothing stalls. Section 5 and 6 have dedicated secondhand sellers with curated 90s American clothing bought in bulk from US Goodwill shipments.",
    tip: "Japanese-tagged secondhand (denim especially) commands premium — 'Japan stock' racks are higher quality. Weight-based pricing on some stalls. Arrive 9am for first pick.",
  },
  {
    name: "Mahboonkrong (MBK) 4th Floor",
    emoji: "🏬",
    area: "MBK Center, National Stadium BTS",
    price: "Secondhand brands ฿150–2,000, Accessories ฿50–500",
    open: "Daily 10am–9pm",
    selection: "Mid-range secondhand branded items, fakes mixed with real — expertise needed",
    why: "MBK's 4th floor is Bangkok's most accessible secondhand market for tourists. Air-conditioned, easy to navigate. Wide selection of clothing, bags, electronics.",
    tip: "Know your brands before shopping — lots of replicas mixed in. Secondhand real Nike: ฿300–800. Real Levi's ฿250–600. Always inspect seams and tags carefully.",
  },
  {
    name: "JJ Mall Green Zone",
    emoji: "♻️",
    area: "JJ Mall (near Chatuchak), Mo Chit BTS",
    price: "Bags ฿150–3,000, Accessories ฿50–800",
    open: "Mon–Fri 10am–8pm",
    selection: "Vintage bags, accessories, secondhand luxury (verify authenticity)",
    why: "JJ Mall (adjacent to Chatuchak) has a dedicated secondhand zone including vintage bags. Better organized than Chatuchak itself. Weekday-accessible unlike the weekend market.",
    tip: "Secondhand luxury bags: verify stitching, hardware, dust bags, authenticity cards before paying. MBK and JJ Mall have known replica dealers — treat all unlabeled luxury as suspect.",
  },
  {
    name: "Pratunam Area Thrift Streets",
    emoji: "🛍️",
    area: "Pratunam, near Ratchaprasong BTS",
    price: "Clothing bundles ฿200/kg, Individual ฿50–300",
    open: "Daily 8am–8pm",
    selection: "Bulk imported secondhand from Japan, US, Europe",
    why: "Bangkok's original thrift market. The wholesale district around Pratunam has small vendors buying direct from bulk containers. Quality is hit-or-miss but prices are lowest.",
    tip: "Early morning (8–10am) when containers are freshly sorted. Weight-based pricing (per kilogram) gives best value for experienced shoppers.",
  },
];

export function BangkokThriftStores() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        ♻️ Bangkok thrift & secondhand shopping — vintage clothing guide
      </h2>
      <div className="space-y-2">
        {STORES.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.open}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-amber-700 mb-0.5">Selection: {s.selection}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
