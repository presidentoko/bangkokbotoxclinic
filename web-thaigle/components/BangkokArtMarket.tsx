const SPOTS = [
  {
    name: "Bangkok Contemporary Art Scene",
    emoji: "🎨",
    area: "BACC (Bangkok Arts and Culture Centre, Siam BTS), galleries in Charoen Krung, 100 Tonson Gallery (Ploenchit)",
    price: "BACC free; Commercial gallery free; Art purchase ฿3,000–500,000+",
    why: "Bangkok's contemporary art scene has developed an international character — the Bangkok Arts and Culture Centre at Siam BTS provides a major public exhibition space showing Thai and international contemporary art. The gallery corridor developing along Charoen Krung Road (Bangkok's oldest commercial street, near the riverfront) concentrates independent galleries alongside design studios, restaurants, and cultural spaces in repurposed heritage buildings. 100 Tonson Gallery (Ploenchit area) is the most established private commercial gallery with international-level programming. Bangkok's contemporary artists work across painting, installation, video, and mixed media — themes often engage with Thai identity, modernization, urban experience, and political questioning in subtle form (political commentary in Thai art is often layered to navigate cultural sensitivities).",
    tip: "BACC exploration strategy: the building hosts multiple simultaneous exhibitions across 9 floors — the free entry makes it worth exploring even if no specific exhibition is planned. Opening events: gallery openings in Bangkok follow the international art world calendar (Art Basel Hong Kong season in late March, Thailand's own art fair calendar) — checking gallery websites for opening events provides access to the art community social scene. Contemporary Thai art collecting: Bangkok has several established auction houses (Christies Asia, Sotheby's hold Southeast Asian art sales) and specialist dealers in contemporary Thai art. For emerging artists: Cartel Art Space, Nova Contemporary, and SAC Gallery support younger Thai artists at more accessible price points.",
  },
  {
    name: "Art Fairs & Design Markets",
    emoji: "🏬",
    area: "Chatuchak Art Section (JJ Market), Bangkok Art Book Fair, Thailand Art Toy Show",
    price: "Art book fair entry free–฿100; Art toy ฿500–50,000+; Design market entry free",
    why: "Bangkok's art market ecosystem extends from major fairs to intimate design markets — the Bangkok Art Book Fair (annual, typically at BACC) draws self-publishers, independent press, and visual art communities from across Southeast Asia. The art toy scene (limited-edition designer vinyl figures, custom Bearbrick and Dunny works by Thai artists) is active in Bangkok's street culture and collector circles. Chatuchak Weekend Market's art section spans commercial art prints to original work — quality varies enormously but the density creates serendipitous discovery opportunities. Thailand's craft and design fair circuit (TCDL, etc.) showcases Thai product designers and artisans at markets where original-run products appear before reaching retail channels.",
    tip: "Bangkok art book fair: the independent publication scene in Bangkok covers artist books, design publications, zines, photography books, and art theory — genres not available in commercial bookshops. Timing: Bangkok art fairs cluster in the November–February cool season (when international visitors are most active and outdoor events are comfortable). Art toy community: Thailand has produced internationally recognized designer toy artists — Thai customs art toy releases appear in Bangkok's specialist shops (particularly Siam Discovery's design level and MBK's art toy section) before international distribution. Prints as Bangkok art investment: limited edition prints by established Thai artists are the most accessible collecting entry point — the Thai Fine Arts Department and respected artist print editions maintain value.",
  },
  {
    name: "Public Art & Street Art in Bangkok",
    emoji: "🖼️",
    area: "Charoen Krung murals, Chula area street art, Bang Rak district art interventions, Ekkamai public art",
    price: "All public and street art is free to view",
    why: "Bangkok's public art scene has grown dramatically — the Charoen Krung Creative District development has catalyzed mural programs along the heritage river road, creating a gallery-without-walls experience through Bangkok's oldest commercial neighborhood. The Chula area (around Chulalongkorn University, Hua Lamphong) has a concentration of street murals that combine Thai Buddhist imagery with urban contemporary aesthetics. Bangkok's art districts (Ari neighborhood, Ekkamai, Sukhumvit corridor) have independent galleries, pop-up exhibitions, and public art interventions appearing in unexpected locations — shop fronts, walls, and public plazas host rotating art programs. The Bang Rak district (near the river, including the TCDC creative district) has official and guerrilla public art across historic facades.",
    action: "Charoen Krung walking route: start at BTS Saphan Taksin, walk north along Charoen Krung toward River City Bangkok — the mural programs appear on shophouse walls along this historic street. TCDC (Thailand Creative and Design Center) in Charoen Krung: a government-funded design resource center with rotating exhibitions, material library, and design workspace — excellent resource for design professionals and curious visitors. Photo walk timing: early morning provides best light and minimal crowds for photographing Bangkok's street art.",
  },
];

export function BangkokArtMarket() {
  return (
    <div className="rounded-2xl border border-fuchsia-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-fuchsia-700 mb-3">
        🎨 Bangkok art scene — galleries, art fairs, design markets & street art
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-fuchsia-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-fuchsia-700">💡 {s.tip ?? s.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
