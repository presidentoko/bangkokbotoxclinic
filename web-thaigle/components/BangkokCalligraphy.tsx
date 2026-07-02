const STYLES = [
  {
    name: "Thai Calligraphy (Khom Script & Decorative Thai)",
    emoji: "✍️",
    area: "Temple workshops, cultural centers, Neilson Hays Library events",
    price: "Workshop ฿600–1,500",
    why: "Traditional Thai calligraphy uses the Khom script (ancient Khmer-derived script used in sacred texts) and ornate decorative Thai letterforms. Temple festivals sometimes include live calligraphy demonstrations. Bangkok cultural centers and the Bangkok Art & Culture Centre occasionally host Thai script calligraphy workshops taught by certified artists.",
    tip: "Thai script calligraphy as a tourist workshop is uncommon — this requires seeking out specifically. The Thailand Cultural Centre (TCC) and the Joe Louis Thai Puppet Theatre area occasionally host cultural workshops. Check Bangkok Art & Culture Centre's event listings.",
  },
  {
    name: "Chinese Calligraphy (Shūfǎ) in Bangkok",
    emoji: "🎋",
    area: "Yaowarat Chinatown, Chinese cultural associations",
    price: "Workshop ฿400–1,000",
    why: "Bangkok's Chinese community maintains active cultural associations that host calligraphy classes — both formal courses and one-time workshops. Chinese New Year period sees calligraphy booths throughout Yaowarat where masters write personalized New Year scrolls. The Bangkok Chinese Cultural Association and Thai-Chinese Cultural Organizations run regular programs.",
    tip: "Chinese calligraphy brushes and ink are available throughout Yaowarat at stationery shops. The four treasures of Chinese calligraphy (brush, ink, inkstone, paper) sets are sold as souvenirs — genuine handmade options from Chinese specialty shops in Yaowarat.",
  },
  {
    name: "Western & Modern Calligraphy Workshops",
    emoji: "🖊️",
    area: "Art studios and creative workshops — Ari, Thonglor, Ekkamai",
    price: "Workshop ฿800–1,800",
    why: "Bangkok's creative workshop scene includes modern calligraphy and hand-lettering classes — brush lettering, pointed pen (Copperplate, Spencerian), and modern calligraphy. Popular for wedding stationery DIY, personal journal decoration, and creative hobby. Instagram culture has driven the popularity of modern brush calligraphy in Bangkok's millennial creative community.",
    tip: "Modern brush calligraphy classes in Bangkok frequently sell out — book through Eventbrite or instructor Instagram pages 2–3 weeks ahead for weekend sessions. Materials kits (brush pen, practice sheets, ink) typically provided. Pointed pen Copperplate is harder than brush lettering — allow 3–4 sessions before achieving presentable letters.",
  },
];

export function BangkokCalligraphy() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        ✍️ Calligraphy workshops in Bangkok — Thai script, Chinese shūfǎ & brush lettering
      </div>
      <div className="space-y-2">
        {STYLES.map((s) => (
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
