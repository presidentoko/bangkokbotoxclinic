const STUDIOS = [
  {
    name: "Sak Yant Tattoo (Traditional Thai Sacred)",
    emoji: "🙏",
    area: "Wat Bang Phra (Nakhon Pathom, 60km), local monks in Bangkok",
    price: "฿300–1,000+ donation (Wat Bang Phra) / ฿2,000–8,000+ at Bangkok tattoo studios",
    why: "Thailand's sacred yantra tattoo tradition. Geometric patterns with Buddhist incantation. Received with traditional bamboo needle.",
    what: "Sak Yant means 'sacred geometric tattoo.' Given by Buddhist monks. Believed to provide protection and good luck.",
    tip: "Wat Bang Phra is the most authentic (temple near Bangkok). Long queue — arrive 6am. Dress respectfully, cover all skin.",
    note: "This is a genuine Buddhist spiritual practice. Treat with respect. Not just body art.",
  },
  {
    name: "Hardcore Tattoo Bangkok",
    emoji: "💉",
    area: "Khao San Road area",
    price: "฿1,500–5,000+ depending on size",
    why: "Most established tourist-facing tattoo shop on Khao San. 20+ years reputation. All equipment sterilized. Western-trained artists.",
    what: "Full custom work, cover-ups, small flash designs, Thai temple motifs",
    tip: "Always ask to see the artist's portfolio before booking. Minimum ฿1,500 for any design.",
    note: "Many cheaper shops around Khao San area — research reviews carefully, needle quality varies.",
  },
  {
    name: "Iron Frames Tattoo",
    emoji: "🎨",
    area: "Thonglor Soi 11",
    price: "฿3,000–20,000+ per piece",
    why: "Bangkok's most artistically credible tattoo studio. Gallery-quality artists. Fine-line, blackwork, Japanese traditional.",
    what: "Custom pieces only. Large-scale work. Artist collaboration projects.",
    tip: "Book 2–4 weeks ahead. Initial consultation required. Serious collectors only.",
    note: "Premium pricing reflects gallery-level artistry. Worth it for lifelong quality.",
  },
];

export function BangkokTattooStudios() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
        🎨 Tattoos in Bangkok — from sacred Sak Yant to modern studios
      </h2>
      <div className="space-y-2">
        {STUDIOS.map((s) => (
          <div key={s.name} className="border border-gray-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-[var(--muted)] mb-0.5">✏️ {s.what}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">💡 {s.tip}</div>
            <div className="text-[10px] text-gray-500">⚠️ {s.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
