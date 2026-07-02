const ESSENTIALS = [
  {
    title: "International Driving Permit (IDP)",
    emoji: "📄",
    content: "Required by law to drive in Thailand with a foreign license. Get IDP from your home country's auto club before arriving. Thailand accepts IDPs alongside your original license (must carry both). Police checkpoints are common — IDP required. Most countries' AA/AAA issue IDPs same-day.",
  },
  {
    title: "Traffic Rules Key Differences",
    emoji: "🚗",
    content: "Drive on LEFT (same as UK, Australia). Seatbelts mandatory (front + rear). Mobile phone while driving = ฿1,000 fine. Red light cameras in Bangkok CBD. Speed cameras on expressways. Turning right on red is illegal (opposite of US). Horn use extremely common and generally not aggressive — informational use.",
  },
  {
    title: "Expressway System (Tollways)",
    emoji: "🛣️",
    content: "Bangkok has an extensive elevated expressway network. Saves enormous time over surface roads during rush hour. Tollways charge ฿35–75 per point. Pay cash at booths (keep coins handy) or rent a vehicle with an Easy Pass transponder. Expressway maps available on Google Maps — select 'expressway route' option.",
  },
  {
    title: "Parking in Bangkok",
    emoji: "🅿️",
    content: "Most shopping malls have multi-level parking — usually first 2 hours free with purchase validation, ฿20–40/hour thereafter. Street parking exists in many areas — look for white box markings (legal) vs yellow markings (no parking). Parking apps: ParkSquare, AIS Pay. Illegal parking results in wheel clamps + ฿500 fine + waiting for authorities.",
  },
  {
    title: "Navigation & Maps",
    emoji: "📱",
    content: "Google Maps works well in Bangkok with real-time traffic. Download offline maps before driving in case of signal issues. Thai addresses can be complex — save the destination before setting out. The Thai address format: building/house number, soi (lane) number, road name, district. Soi numbers don't always run sequentially.",
  },
  {
    title: "Fuel & Petrol Stations",
    emoji: "⛽",
    content: "PTT, Caltex, Shell, and Esso are main chains. Thailand fuel: Benzine 95 (most common), E20, E85, Gasohol, Diesel. Most rental cars use 95 benzine — confirm with rental company. Self-service at most stations. Attendants help at some older stations. Fill before expressway trips — limited options on tollways.",
  },
];

export function BangkokDriving() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
        🚗 Driving in Bangkok — IDP, expressways, parking & Thai traffic rules
      </div>
      <div className="space-y-2">
        {ESSENTIALS.map((e) => (
          <div key={e.title} className="border border-gray-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-xl shrink-0">{e.emoji}</span>
              <div className="font-bold text-xs">{e.title}</div>
            </div>
            <div className="text-[10px] text-[var(--fg)] leading-snug">{e.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
