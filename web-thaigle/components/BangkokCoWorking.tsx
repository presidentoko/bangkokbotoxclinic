const SPACES = [
  {
    name: "Hubba Bangkok & Co-Working Chains",
    emoji: "💻",
    area: "Ekkamai (Hubba), Asoke (WeWork), Silom (The Hive), Ari",
    price: "Day pass ฿300–800; Monthly hotdesk ฿4,000–12,000",
    why: "Bangkok's co-working ecosystem is mature and diverse — from WeWork's corporate environment in Asoke to community-focused spaces like Hubba (Ekkamai, Bangkapi) and The Hive (Sukhumvit). For digital nomads and remote workers, Bangkok offers infrastructure competitive with Bali, Chiang Mai, or any Southeast Asian co-working hub — at lower cost per square foot. Many co-working spaces run startup events, pitch nights, and networking sessions that connect the Bangkok startup community.",
    tip: "Bangkok co-working comparison: WeWork has the most reliable infrastructure (fast internet, 24hr access, meeting rooms) but corporate atmosphere; Hubba has the best community culture and startup events; The Hive has the best cafe-working environment. For digital nomads who work well in cafés: Bangkok's café culture is extremely co-working friendly — many cafés have 4–8 hour stay expected norms rather than the 1-hour turnover pressure in Western cities.",
  },
  {
    name: "Café Working in Bangkok",
    emoji: "☕",
    area: "Ari (Roast, Roots), Ekkamai (Rocket, On The Table), Thonglor",
    price: "Coffee purchase ฿80–200; No time limit at most cafés",
    why: "Bangkok café working culture is unusually supportive — most specialty coffee cafés in Ari, Ekkamai, and Thonglor zones expect customers to stay 2–4 hours minimum, have power outlets under every table, and provide fast WiFi without needing to ask. The combination of excellent espresso, air conditioning, and absent laptop-shaming makes Bangkok one of the world's best cities for café working. Many Bangkok freelancers and startup founders work entirely from café to café.",
    tip: "Bangkok café WiFi passwords: usually on the receipt, a chalkboard near the counter, or just ask 'WiFi password krab/ka?' Most cafés have 50–100 Mbps connections. Power outlet availability: Ari cafés have almost universally good outlet density. Signal-of-good-wifi: if a café is packed with Thai young adults on laptops, the WiFi is good. Japanese café chains (Hoshino Coffee, Doutor) have the most reliable outlet density of any chain.",
  },
  {
    name: "Digital Nomad Scene — Ari & Silom",
    emoji: "🌐",
    area: "Ari (highest nomad concentration), Silom, Phrom Phong",
    price: "Monthly all-in: ฿40,000–80,000 (rent + food + co-working)",
    why: "Bangkok's digital nomad scene is the largest in Southeast Asia — larger than Chiang Mai's more famous equivalent. The Ari neighborhood specifically has become a nomad hub: concentrated cafés with good WiFi, walkable grocery shopping (Ari Fresh), extensive fitness options, and excellent street food. Nomadlist and similar platforms consistently rank Bangkok in the top 20 global nomad destinations for cost-value ratio. The Thai immigration system (tourist entry + border run) is manageable for short-term nomads, though LTR visa provides better long-term stability.",
    tip: "Bangkok digital nomad resources: Nomad List Bangkok community, Expat.com Bangkok forums, and the 'Digital Nomads Thailand' Facebook group. The monthly all-in cost for a digital nomad in Bangkok (studio in Ari, co-working 3 days/week, food budget including occasional restaurant meals): ฿40,000–55,000 ($1,100–$1,500 USD). Below the cost of most major Western cities while offering comparable or better urban quality of life.",
  },
];

export function BangkokCoWorking() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        💻 Co-working in Bangkok — WeWork vs Hubba, café working culture & nomad costs
      </div>
      <div className="space-y-2">
        {SPACES.map((s) => (
          <div key={s.name} className="border border-indigo-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-indigo-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
