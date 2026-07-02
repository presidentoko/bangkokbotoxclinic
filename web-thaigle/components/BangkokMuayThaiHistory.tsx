const FACTS = [
  { q: "How old is Muay Thai?", a: "Over 2,000 years old. Originally military combat technique used by Siamese warriors. Became a royal sport under King Naresuan (1590s) and Phra Chao Sua 'Tiger King' (1703)." },
  { q: "What makes Muay Thai different from kickboxing?", a: "Muay Thai uses 8 weapons: fists, elbows, knees, and shins — versus 4 in Western kickboxing. Clinch fighting (plum) is a core technique. Also unique: pre-fight Wai Kru Ram Muay ritual dance." },
  { q: "What is the Wai Kru?", a: "The Wai Kru Ram Muay is a pre-fight ritual dance. Fighters bow to their teachers, honor the ring spirits, and perform stylized movements specific to their gym. Each gym has a slightly different style." },
  { q: "Where do the best professional fights happen?", a: "Rajadamnern Stadium (est. 1945) and Lumpinee Boxing Stadium (est. 1956, now in Min Buri). Both host professional championship bouts weekly. Tourist shows in smaller venues are entertainment, not the real thing." },
  { q: "Can tourists train properly in Bangkok?", a: "Absolutely. Bangkok has dozens of serious gyms open to foreigners. Best gyms: Fairtex, Evolve MMA, Sitsongpeenong, Tiger Muay Thai (Phuket). Day sessions from ฿500–800. Weekly immersion programs available." },
];

export function BangkokMuayThaiHistory() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🥊 Muay Thai — history, culture & FAQ
      </div>
      <div className="space-y-2">
        {FACTS.map((f) => (
          <details key={f.q} className="border border-[var(--border)] rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center justify-between gap-2 text-xs font-bold text-[var(--fg)] hover:text-orange-700 transition">
              <span>{f.q}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition shrink-0 text-sm">⌄</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--muted)] leading-relaxed">{f.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
