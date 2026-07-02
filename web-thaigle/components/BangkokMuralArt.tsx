const AREAS = [
  {
    name: "Charoen Krung Creative District — Street Art Trail",
    emoji: "🎨",
    area: "Charoen Krung (Bang Rak), TCDC area",
    price: "Free walking; TCDC membership optional",
    why: "Charoen Krung is Bangkok's street art heartland — the old trading district transformed into a creative zone with murals, installations, and gallery-quality public art. The Bangkok Design Week (annual, January–February) brings temporary installations and guided art walks. Permanent murals by Thai and international artists cover the walls between the heritage shophouses. The juxtaposition of 100-year-old Chinese-Portuguese architecture and contemporary mural art is one of Bangkok's most distinctive visual experiences.",
    tip: "Charoen Krung street art trail: start from TCDC Bangkok (Thailand Creative & Design Center) near Chao Phraya Express pier and walk south along Charoen Krung toward The Jam Factory. About 2km route with 15–20 significant mural and installation pieces. Best photographed in early morning before delivery traffic. During Bangkok Design Week (January), additional temporary art pieces multiply the experience dramatically.",
  },
  {
    name: "Talat Noi — Hidden Street Art Quarter",
    emoji: "🏛️",
    area: "Talat Noi, between Chinatown and Chao Phraya",
    price: "Free",
    why: "Talat Noi (literally 'little market') is Bangkok's most intriguing street art neighborhood — a compressed zone between Chinatown and the river with narrow soi alleys painted with large-scale murals and smaller pieces. The area's combination of original metal craft workshops (still operating), old shrine buildings, and art installations creates an unrepeatable urban texture. Less touristy than the main Chinatown street but immediately accessible from Yaowarat.",
    tip: "Talat Noi navigation: enter from Charoen Krung Soi 22 or from the riverside (Ratchawongse pier is close). The key junction is at the corner shrine covered in colorful offerings — art covers the surrounding walls. The metalworking businesses in the area are genuine old trade establishments that have coexisted with the art scene. Photography of the workshops requires asking permission from owners.",
  },
  {
    name: "Ekkamai & Thonglor Street Art",
    emoji: "🖌️",
    area: "Ekkamai Soi 4–12, Thonglor Soi 8–12 lane walls",
    price: "Free",
    why: "Bangkok's upscale residential east corridor has its own street art scene — smaller scale than Charoen Krung but more contemporary and design-led. Café-commissioned murals, artist-in-residence wall pieces, and pop art installations on the blank walls between boutiques and cafés in Ekkamai. The Ekkamai art scene reflects the neighborhood's creative class resident profile — younger, internationally influenced, contemporary aesthetics.",
    tip: "Ekkamai street art is scattered rather than concentrated — the best approach is wandering Ekkamai Soi 4 to 12 slowly, looking for painted walls between the shop units. Check Instagram tags #ekkamaiart and #bangkokstreetart for current large pieces — the art changes seasonally as walls are refreshed and new commissions appear. Thonglor's street art is concentrated around the Saturday market area (Soi 10 cluster).",
  },
];

export function BangkokMuralArt() {
  return (
    <div className="rounded-2xl border border-violet-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-800 mb-3">
        🎨 Street art & murals in Bangkok — Charoen Krung trail, Talat Noi & Ekkamai walls
      </div>
      <div className="space-y-2">
        {AREAS.map((a) => (
          <div key={a.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{a.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{a.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{a.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{a.why}</div>
            <div className="text-[10px] text-violet-800">💡 {a.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
