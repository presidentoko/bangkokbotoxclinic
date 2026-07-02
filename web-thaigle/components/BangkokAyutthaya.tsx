const SPOTS = [
  {
    name: "Ayutthaya UNESCO World Heritage Site",
    emoji: "🏛️",
    area: "Ayutthaya Province, 80km north of Bangkok — 1.5 hours by train, 2 hours by road",
    price: "Train from Hua Lamphong ฿20–350 (class); Tuk-tuk day hire ฿400–700; Temple entry ฿50 each; Day tour ฿1,000–2,500",
    why: "Ayutthaya was Thailand's capital for 417 years (1350–1767) — at its peak it was one of the world's largest cities with a million inhabitants, surpassing contemporary London. The Burmese military sacked and burned Ayutthaya in 1767, leaving a haunting landscape of ruined prangs (tower-shrines), headless Buddha statues, and massive chedi foundations spread across the island-city at the confluence of three rivers. The UNESCO World Heritage designation covers the Ayutthaya Historical Park — a compact area bikeable within hours containing Wat Mahathat (the famous tree-encased Buddha head), Wat Phra Si Sanphet (three royal chedis), Wat Ratchaburana, and dozens of smaller ruins. The combination of historical scale, visual drama, and Bangkok accessibility makes Ayutthaya the most visited day trip destination from Bangkok.",
    tip: "Ayutthaya navigation strategy: bicycle rental (฿50–80/day at shops near the train station) is the optimal way to explore the historical park — distances between main temples are 1–5km, roads are flat, and cycling provides flexibility that tuk-tuk routes lack. Train logistics: third-class non-air-conditioned train from Bangkok Hua Lamphong (฿20, 1.5 hours) is the classic approach — the simplicity and low cost are part of the experience. Return trains: check return schedule before departing, as late afternoon trains fill. Ayutthaya timing: arrive before 9am to experience the major sites before midday heat and coach tour crowds arrive. Temple respectful dress: shoulders and knees covered required at most Ayutthaya temples — bring a sarong if needed.",
  },
  {
    name: "Kanchanaburi — Death Railway & WWII History",
    emoji: "🌉",
    area: "Kanchanaburi Province, 3 hours from Bangkok by road or train",
    price: "Train from Thonburi ฿100; Death Railway Museum entry ฿200; River Kwai Bridge free to view",
    why: "Kanchanaburi is one of Thailand's most historically significant destinations — the site of the Death Railway construction during WWII, where Allied prisoners of war and Asian forced laborers built a rail line for the Japanese military under conditions so brutal that an estimated 100,000+ workers died. The Bridge Over the River Kwai (formally the Kwai Yai, the bridge immortalized in the 1957 David Lean film) is walkable — tourists and trains share the famous steel bridge. The JEATH War Museum and the Thailand-Burma Railway Centre provide extensive documentation of the railway's construction and the prisoner experience. The Kanchanaburi War Cemetery maintains thousands of Allied graves in a dignified setting. The contrast between natural beauty (River Kwai raft house accommodation, waterfalls 1–2 hours further) and this dark history is a characteristic of the destination.",
    tip: "Kanchanaburi historical site logistics: the River Kwai Bridge and war cemeteries are in the town area, easily walkable/tuk-tukable from the train station. The Erawan Falls are 65km further west of town — best with a rental car or organized half-day tour from Kanchanaburi town. Train from Bangkok: the train from Thonburi Station (not Hua Lamphong — different terminal; take the ferry from Bangkok Noi pier near the Royal Barges Museum) provides a scenic route through the western Bangkok suburbs. Kanchanaburi overnight: staying one night allows morning Erawan Falls visit (before crowds), full Bridge/cemetery/museum time, and raft house accommodation on the river — one of Thailand's most atmospheric overnight experiences.",
  },
  {
    name: "Sukhothai — The First Thai Kingdom",
    emoji: "🕌",
    area: "Sukhothai Province, 440km north of Bangkok — best by overnight bus or bus+local transport",
    price: "Bus from Bangkok ฿350–600; Historical Park entry ฿100 (per zone, 4 zones); Bicycle rental ฿30–60; Guesthouse ฿400–1,500",
    why: "Sukhothai (meaning 'Dawn of Happiness') was Thailand's first independent Thai kingdom (1238–1438 CE) and the birthplace of Thai identity — Thai script, Theravada Buddhist traditions, and political concepts that define modern Thai culture were developed here. The Sukhothai Historical Park preserves a complex of over 190 preserved ruins spread across a planned medieval city landscape with moats, lotus ponds, and a distinctive artistic style (the Sukhothai style Buddha is considered the apex of Thai Buddhist art). Sukhothai is less visited than Ayutthaya — further from Bangkok and requiring more planning — but offers a more tranquil, less-commercialized engagement with Thai historical heritage. The Historical Park at sunrise or sunset, with the ruins reflecting in lotus ponds, is one of Thailand's most serene heritage experiences.",
    tip: "Sukhothai trip planning: the most common approach from Bangkok is overnight bus (8–9 hours, departs evenings) or air to Phitsanulok (nearest airport, 1 hour north) then local transport south to Sukhothai. A minimum of 2 days is recommended to cover the Historical Park's multiple zones properly. Bicycle navigation: the central zone is the main attractions; the north, south, and west zones require bicycles or motorbike to reach efficiently. Loi Krathong Festival: Sukhothai's Loi Krathong celebration (November full moon) is Thailand's most spectacular — the originating location of the festival, with thousands of lanterns and krathong on the historical park ponds. Book accommodation months in advance for Loi Krathong dates.",
  },
];

export function BangkokAyutthaya() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-stone-700 mb-3">
        🏛️ Historical day trips from Bangkok — Ayutthaya, Kanchanaburi & Sukhothai ancient kingdoms
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-stone-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-stone-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
