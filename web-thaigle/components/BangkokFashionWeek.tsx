const EVENTS = [
  {
    name: "BIFW — Bangkok International Fashion Week",
    emoji: "👗",
    area: "Central World Plaza, Siam Paragon, rotating major venues",
    price: "Public access: free–฿500; VIP/press: invitation",
    why: "Bangkok International Fashion Week (BIFW) is Thailand's flagship fashion event — organized with UNFPA and internationally recognized Bangkok designers showcasing alongside emerging Thai talent. The event has grown in regional significance, drawing buyers and press from Singapore, Hong Kong, and Japan. Thai fashion design strength lies in craft-intensive luxury pieces using indigenous textiles (silk, handwoven cotton), sustainable materials, and the country's deep artisan tradition. Bangkok's fashion week reflects both high-fashion aspiration and a distinct Thai aesthetic identity.",
    tip: "BIFW access for the public: some runway shows have general admission tickets available through event platforms (Eventpop, Zipevent). The after-parties and fringe events are more accessible than the main runway — follow BIFW social media for announcements. The adjacent exhibition (designer boutiques, emerging talent showcases) is usually fully open to the public. Timing: typically held twice yearly (March and September/October — coordinate with tourism season).",
  },
  {
    name: "TCDC — Thailand Creative & Design Center",
    emoji: "🎨",
    area: "Charoen Krung, Bangkok (Grand Postal Building)",
    price: "Annual membership ฿300; Events vary free–฿500",
    why: "TCDC (now housed in the stunning Grand Postal Building on Charoen Krung) is Thailand's government design promotion center — a combination of design library, co-working space, material library, and event venue for design and creative industry. The material library (open to members) is extraordinary — thousands of fabric, material, and finish samples used by designers for sourcing. TCDC hosts regular exhibitions, talks, and design workshops at affordable prices. The Charoen Krung location has become Bangkok's creative hub anchor.",
    tip: "TCDC membership (annual ฿300) provides access to the material library, design library, and member discounts on workshops. The library itself — design books, material samples, trend reports — is a significant resource not available elsewhere in Bangkok. The building (1937 Art Deco Grand Postal Building) is architecturally remarkable and worth visiting even without a membership. TCDC's neighborhood — Charoen Krung Creative District — has galleries, design studios, and creative businesses that make it a half-day exploration.",
  },
  {
    name: "Bangkok Designer Communities & Startup Scene",
    emoji: "✂️",
    area: "Charoen Krung Creative District, Ekkamai, Ari",
    price: "Events ฿0–500; Studio visits by appointment",
    why: "Beyond the organized fashion events, Bangkok has a genuine independent fashion design scene — young Thai designers building brands that compete internationally. Labels like Kloset, Milin, Theatre, Playhound, Issey Miyake Thailand (regional hub), and dozens of smaller independent names operate ateliers primarily in Ekkamai and the Charoen Krung area. Thai fashion's USP is craft quality at accessible-to-premium prices — designs that would cost twice as much in Paris or New York. The Bangkok independent fashion community connects through Instagram and occasional trunk shows.",
    tip: "Meeting Bangkok's fashion design community: TCDC workshops and design events are the most reliable entry points. The 'Bangkok Fashion Community' Facebook group and Instagram accounts of the major Thai fashion brands often announce events, sample sales (great value), and trunk shows. The pop-up market at Warehouse 30 (Charoen Krung) regularly features independent Thai fashion designers — check their social media schedule. Thai fashion students (Chulalongkorn, Silpakorn, RMUTP fashion programs) hold regular graduate shows open to the public.",
  },
];

export function BangkokFashionWeek() {
  return (
    <div className="rounded-2xl border border-fuchsia-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-fuchsia-700 mb-3">
        👗 Fashion in Bangkok — BIFW, TCDC design center & independent Thai designer scene
      </h2>
      <div className="space-y-2">
        {EVENTS.map((e) => (
          <div key={e.name} className="border border-fuchsia-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{e.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{e.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{e.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{e.why}</div>
            <div className="text-[10px] text-fuchsia-700">💡 {e.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
