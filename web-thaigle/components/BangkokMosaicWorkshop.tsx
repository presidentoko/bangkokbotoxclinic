const WORKSHOPS = [
  {
    name: "Mosaic Art Workshops at Bangkok Studios",
    emoji: "🎨",
    area: "Various locations — Silom, Ari, Chatuchak",
    price: "Workshop ฿800–2,500/session (3–5 hrs)",
    why: "Mosaic art workshops in Bangkok combine colorful stained glass cutting, tile setting, and grout work into a tactile, highly satisfying creative session. Popular team-building and date activity. Common projects: decorative mirror frames, colorful coasters, small wall art pieces, or flower pots. Bangkok's craft studio scene has grown significantly — several studios now run English-language mosaic sessions regularly.",
    tip: "Book mosaic workshops with at least 3 days advance notice — studios need to prepare material kits. Wear clothing that can get grout stains. Beginners take about 3 hours to complete a standard 20x20cm piece. The cutting and setting process is meditative — many Bangkok expats attend solo. Some studios allow taking ungrouted pieces to grout at home (faster session).",
  },
  {
    name: "Thai Temple Mosaic Tile Appreciation",
    emoji: "🏛️",
    area: "Wat Pho, Wat Arun, Grand Palace Complex",
    price: "Temple entry ฿100–500",
    why: "Thai temple architecture uses intricate colored glass mosaic and porcelain tile work on temple exterior walls, stupas (chedis), and mythological guardian figures. Wat Arun's towering prang is entirely covered in Chinese porcelain tiles — millions of dishes and ceramic fragments imported from China in the 19th century. Wat Pho's complex features mosaic-covered structures. Understanding traditional Thai mosaic is valuable context for anyone attending a workshop.",
    tip: "Wat Arun's mosaic tile work was restored between 2013–2017. The close-up detail of the restoration is visible on the lower sections of the prang. Early morning visits (before 9am) allow photography without crowds. The color palette of Thai temple mosaics — gold, blue-green, white, and deep red — is the traditional basis that contemporary Bangkok mosaic artists often reference.",
  },
  {
    name: "Macramé & Fiber Art Classes",
    emoji: "🪢",
    area: "Studio W, Craft + Living spaces, Bangkok",
    price: "Workshop ฿500–1,500/session",
    why: "Alongside mosaic, macramé (knotted fiber art) has exploded as a Bangkok workshop category — wall hangings, plant hangers, keychains. Less messy than mosaic and easier for complete beginners. A 2-hour macramé session produces a finished product that's usable immediately. Bangkok's weekend market scene (Chatuchak, Artbox) has stalls selling macramé materials and patterns alongside workshops.",
    tip: "Macramé workshops use a simple 4-knot vocabulary: square knot, half hitch, spiral, gathering knot. Most Bangkok sessions teach wall hangings. The natural fiber cotton rope is easily available at Chatuchak Market (Section 7, craft supplies). Home practice materials cost ฿150–400 for a starter spool.",
  },
];

export function BangkokMosaicWorkshop() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🎨 Mosaic workshops in Bangkok — glass tile art, temple appreciation & macramé
      </h2>
      <div className="space-y-2">
        {WORKSHOPS.map((w) => (
          <div key={w.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{w.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{w.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{w.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{w.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{w.why}</div>
            <div className="text-[10px] text-amber-700">💡 {w.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
