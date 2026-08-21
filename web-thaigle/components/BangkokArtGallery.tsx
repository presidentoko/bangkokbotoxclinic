const GALLERIES = [
  {
    name: "Bangkok Art and Culture Centre (BACC)",
    emoji: "🏛️",
    area: "Pathumwan, MBK BTS stop",
    price: "Free entry (most exhibitions)",
    why: "BACC is Bangkok's most important contemporary art institution — a 10-floor circular building directly connected to MBK that hosts rotating major exhibitions, permanent collection galleries, artist studios, and performance spaces. Both Thai and international contemporary art shown here. The permanent collection includes significant Thai contemporary works. BACC also hosts the art book fair, design exhibitions, and experimental performance events.",
    tip: "BACC is free but check the website or Facebook before visiting — not all floors are always active. The building's circular design means you spiral up each floor for a different exhibition. The café on the 5th floor has a view of the BTS intersection below. Free guided tours in English run on some Saturdays — check BACC's Line OA for schedule.",
  },
  {
    name: "SAC Gallery & Silom Private Galleries",
    emoji: "🎨",
    area: "Silom, Sathorn — gallery district",
    price: "Free entry",
    why: "Bangkok's commercial contemporary art gallery district is centered on Silom and Sathorn — SAC Gallery (Silom), NOVA Contemporary (Thonglor), Thavibu Gallery (Silom), and Kathmandu Photo Gallery are among the notable spaces. These galleries represent Thai and Southeast Asian artists in the international contemporary art market. Opening receptions are significant social events in Bangkok's art community and open to the public.",
    tip: "Bangkok's gallery openings concentrate on Thursday evenings — follow galleries on Instagram for opening dates. Art galleries in Bangkok frequently show work by the same artists across exhibitions (Thai contemporary art market is tightly networked). Gallery staff are generally very welcoming to visitors who engage seriously with the work.",
  },
  {
    name: "Moca Bangkok & Thonglor Private Museums",
    emoji: "🖼️",
    area: "Ngam Wong Wan (MOCA), Thonglor/Ekkamai private spaces",
    price: "MOCA: ฿250 adult",
    why: "Museum of Contemporary Art Bangkok (MOCA) houses the Boonchai Bencharongkul collection — 800+ Thai modern and contemporary artworks across 5 floors. Designed as a private museum with significant institutional permanence. The Thonglor area also has several private collector-backed gallery spaces with rotating exhibitions. Cartel Artspace (Ekkamai) represents the younger Thai contemporary art scene.",
    tip: "MOCA's permanent collection rewards multiple visits — different exhibitions rotate in and out around the core collection. The museum is in Ngam Wong Wan area (BTS nearby) and less crowded than BACC. Bangkok's private museum scene is expanding — Chinatown's TCDC (Thailand Creative & Design Center) has design and craft exhibitions alongside the reference library (free with ID deposit).",
  },
];

export function BangkokArtGallery() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🎨 Art galleries in Bangkok — BACC, Silom galleries, MOCA & private collections
      </h2>
      <div className="space-y-2">
        {GALLERIES.map((g) => (
          <div key={g.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{g.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{g.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{g.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{g.why}</div>
            <div className="text-[10px] text-rose-700">💡 {g.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
