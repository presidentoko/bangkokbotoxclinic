const SPOTS = [
  {
    name: "Bangkok's Specialty Coffee Scene — Third Wave",
    emoji: "☕",
    area: "Thong Lor, Ari, Silom, Ekkamai, Phrom Phong — Bangkok's specialty coffee neighborhood clusters",
    price: "Single-origin pour-over ฿120–250; Cold brew ฿120–180; Espresso-based drinks ฿90–180; Coffee cupping session ฿500–1,200",
    why: "Bangkok has emerged as one of Southeast Asia's leading specialty coffee cities — the combination of Thailand's own highland coffee growing regions (Doi Inthanon, Chiang Rai, Chiang Mai), a young professional consumer base willing to pay premium prices for quality, and a creative café design culture has produced a scene that rivals Singapore, Tokyo, and Seoul for quality and innovation. Bangkok's third-wave coffee identity has moved beyond simple product quality into experience design — the best Bangkok specialty cafés are designed spaces that are simultaneously coffee bars, social spaces, creative studios, and often work environments. Thai coffee culture has also developed distinctive local elements: Thai iced coffee with sweetened condensed milk remains culturally dominant, but specialty interpretation of this form has produced a category of 'Thai specialty iced coffee' that combines traditional elements with third-wave sourcing and technique.",
    tip: "Bangkok coffee neighborhood guide: Ari (BTS Ari station) has the highest concentration of genuinely excellent and less-touristed specialty cafés — Hinoki Café, Roots, and numerous others in the residential soi area. Thong Lor and Ekkamai (Sukhumvit Soi 55/63) are the design-forward café zone — many Instagram-worthy spaces alongside quality coffee. Silom area has café options near the BTS stations that serve the finance district professional population. Coffee bean quality evaluation: ask if the café uses Thai highland coffee in their selection — Doi Chang and Wawee Coffee cooperatives from Chiang Rai produce exceptional Arabica with distinctive fruity profiles; a café using these beans has committed to sourcing quality.",
  },
  {
    name: "Thai Coffee Origins — Northern Highlands",
    emoji: "🏔️",
    area: "Source: Chiang Rai, Chiang Mai highlands (Doi Inthanon, Doi Chang, Doi Wawee); Bangkok retail/café availability",
    price: "Thai highland coffee bag (250g) ฿200–600; Hill tribe direct trade ฿300–800; Subscription services available",
    why: "Thailand's coffee growing story is inseparable from the highland hill tribe communities of the north — the Royal Projects initiated by King Bhumibol Adulyadej to provide sustainable agricultural alternatives to opium production planted coffee (particularly Arabica) in the highland villages of Chiang Rai and Chiang Mai provinces from the 1970s onward. The result: Thai Arabica coffee grown at 1,000–1,600m elevation by Akha, Lahu, Lisu, and other highland communities, with profiles ranging from delicately fruited naturals to clean washed process coffees. The Bangkok specialty coffee scene has embraced Thai origins prominently — local sourcing both provides quality coffee and supports a meaningful agricultural development story. Doi Chang village (Chiang Rai) has particular recognition among international specialty roasters for exceptional quality Arabica.",
    tip: "Finding Thai highland coffee in Bangkok: specialty coffee shops in Ari and Thong Lor typically offer Thai single-origin options — ask specifically for 'Thai coffee' or 'Doi Chang / Doi Inthanon' if you want the local origin. Direct purchasing: several northern Thailand coffee cooperatives (Doi Chaang Coffee, Wawee Coffee) have Bangkok retail presence or ship directly — purchasing directly supports communities most efficiently. Coffee tourism: the northern highlands coffee harvest (November–February) coincides with the dry season travel window — Chiang Rai and Chiang Mai specialty coffee tours during harvest are genuinely special, visiting farms and wet mills. Bangkok roasters doing direct trade: Roots Coffee Roaster and a few other Bangkok-based specialty roasters are doing formal direct trade with northern Thai farming communities — their Thai-origin products are premium examples of what the region produces.",
  },
  {
    name: "Café Culture & Work-From-Café Bangkok",
    emoji: "🖥️",
    area: "Café districts throughout Bangkok — specialist lists on Instagram and specialty coffee community accounts",
    price: "Minimum spend per 2-3 hours: ฿150–400; Laptop-friendly café hourly ฿0 minimum–฿150; Premium cafés with power/WiFi ฿200–500",
    why: "Bangkok's café culture has become one of the city's defining characteristics for remote workers, digital nomads, and creative professionals — the Thai specialty café is frequently a dual-purpose space designed for both coffee quality and extended working sessions. The 'laptop-friendly café' culture is deeply embedded: many Bangkok cafés specifically market WiFi speed and power outlet availability alongside their coffee program. The overlap between specialty coffee culture and remote work culture in Bangkok is significant — the best Bangkok cafés are populated by a mix of Thai creative professionals, expats, and international remote workers in a genuinely cosmopolitan working environment. Bangkok café design has developed a distinctive aesthetic: often in repurposed shophouses or renovated industrial buildings, with exposed brick, plants, concrete elements, and natural light — the design sensibility reflects a Thai modernist adaptation of international café design trends.",
    tip: "Laptop-friendly café etiquette in Bangkok: purchase a drink every 2–3 hours as the implicit social contract for extended laptop use — most Bangkok cafés don't enforce this but it's appropriate practice. Rush hour café timing: the most popular Bangkok cafés (especially in Ari and Thong Lor) can be fully occupied by mid-morning on weekdays — arriving by 9am or after 2pm improves seating availability. Power outlet availability varies dramatically between cafés — checking Instagram posts or review photos to see visible outlet locations is a practical research approach. Air conditioning intensity: Bangkok cafés run their AC on maximum in many cases — bringing a light layer for cold AC environments is standard Bangkok café practice. The Instagram discovery method: searching 'café Bangkok Ari' or 'cafe Bangkok [neighborhood]' on Instagram is often more current than Google for finding newly opened quality cafés.",
  },
];

export function BangkokSpecialtyCoffee() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        ☕ Bangkok specialty coffee — third wave cafés, Thai highland origins & café culture
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
