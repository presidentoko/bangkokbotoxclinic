const SPOTS = [
  {
    name: "Oil Painting & Fine Art Studios",
    emoji: "🎨",
    area: "Art studios near Silpakorn University (Wang Na), Bangkok Art Mile (Charoen Krung)",
    price: "Workshop ฿500–2,000; Supplies ฿500–5,000; Private lessons ฿800–2,000/session",
    why: "Bangkok has a genuine fine art community anchored by Silpakorn University — Thailand's premier fine arts institution established 1943, producing Thai artists who exhibit internationally. The university's location near the Grand Palace and National Museum places it at Bangkok's cultural heart. Art studios and supply shops cluster around Silpakorn and along the Bangkok Art Mile (Charoen Krung). Oil painting workshops for beginners and intermediate painters are available through private studios that have developed expat and tourist programs — typically small groups with instruction in English.",
    tip: "Oil painting supplies in Bangkok: the area around Silpakorn University (Wang Na road, near Sanam Luang) has dedicated art supply shops with canvas, oil paints (local Thai brands and imported Winsor & Newton, Rembrandt), linseed oil, and brushes. Prices are comparable to or slightly lower than Singapore and Hong Kong. For oil painting lessons: several Bangkok artists offer private tuition — search Instagram using #BangkokArt or #ThaiArt to find instructors who accept students. The Silpakorn Fine Arts gallery is free to enter and shows current student and faculty work.",
  },
  {
    name: "Watercolor & Sketching Bangkok's Architecture",
    emoji: "🖌️",
    area: "Charoen Krung, Rattanakosin, Chinatown — urban sketching locations",
    price: "Workshop ฿500–1,500; Materials ฿300–1,000",
    why: "Bangkok's architectural richness — colonial shophouses, ornate temple rooflines, modernist concrete, traditional wooden canal houses — makes it an extraordinary urban sketching and watercolor subject. The Urban Sketchers Bangkok community (affiliated with the international Urban Sketchers organization) meets regularly at different city locations. The Charoen Krung area (Art Deco post office, colonial trading houses, new creative businesses) and Rattanakosin (temple complexes, royal buildings) provide the most visually complex subject matter. Bangkok's colors and light (particularly the golden hour before sunset) are dramatically different from European urban sketching contexts.",
    tip: "Urban Sketchers Bangkok: follow their Facebook group and Instagram for monthly location announcements. Sessions are open to all skill levels — experienced sketchers and beginners sketch side by side. Materials recommended for Bangkok: watercolor paper that handles humidity (some papers buckle badly in Bangkok's moisture — ask the group for recommendations). The city's best watercolor subjects: canal scenes in Bang Kok Noi/Thonburi, the Chao Phraya at sunset from Tha Tien pier, Chinatown's layered facades at dawn.",
  },
  {
    name: "Traditional Thai Painting & Lacquerwork",
    emoji: "🪷",
    area: "Cultural centers, fine arts schools, craft workshops",
    price: "Workshop ฿800–2,500; Materials included",
    why: "Traditional Thai painting (Thep Phanom style — religious figures in gold leaf and tempera on lacquer panels; Benjarong ceramic painting) is a specialized art form taught at cultural centers and craft workshops. The techniques — laying gold leaf, preparing lacquer surfaces, painting traditional figures — require different skills and tools from Western painting traditions. The aesthetic (flat perspective, formal iconography, vibrant mineral pigments) has its own internal logic that rewards study. Traditional Thai painted benjarong ceramics (five-colored enamelware) is a related craft available as workshop experiences.",
    tip: "Traditional Thai painting workshops: the Jim Thompson House (Siam area) occasionally offers Thai art workshops. Specialty craft workshops at the SUPPORT Foundation (Queen Sirikit Museum of Textiles area) include traditional Thai arts. Finding workshops: the Tourism Authority of Thailand (TAT) maintains a list of certified cultural experience operators. Wat Prayurawongsawat (Thonburi side, near the river) has traditional Thai mural paintings — visiting to study them before a painting workshop provides valuable visual context.",
  },
];

export function BangkokOilPainting() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🎨 Painting workshops in Bangkok — oil painting, urban sketching & traditional Thai art
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
