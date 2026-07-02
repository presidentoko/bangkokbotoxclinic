const SPOTS = [
  {
    name: "Isan Cuisine in Bangkok — Northeastern Thai Food",
    emoji: "🌶️",
    area: "Isan restaurants throughout Bangkok — concentrated in areas with large Isan migrant populations (Pratunam area, On Nut, Bang Na, areas near industrial districts)",
    price: "Som tam: ฿40–80; Larb: ฿60–120; Muu yang (grilled pork): ฿80–150; Kai yang (grilled chicken): ฿60–100; Sticky rice: ฿20–30; Full Isan meal ฿150–350",
    why: "Isan cuisine (the food of Thailand's northeastern region, a vast plateau bordering Laos and Cambodia) has become arguably the most widely eaten Thai regional cuisine in Bangkok — driven by the enormous migration of Isan workers to Bangkok's construction, manufacturing, and service industries. Isan food is distinctively different from Central Thai cuisine: more intense fermented fish sauce (pla raa) flavors, liberal use of raw or briefly cooked meat and offal, the ubiquitous sticky rice (khao niao) rather than steamed jasmine rice, heavy herb and fresh vegetable component, and the characteristic combination of lime-chili-fish sauce-herb sourcing that creates extremely bright and intensely flavored dishes. Som tam (green papaya salad), larb (minced meat salad with roasted rice powder and fresh herbs), muu yang (charcoal-grilled pork), and nam tok (similar to larb but with a slightly different finish) are the foundational dishes. The Isan dining experience: informal seating, plastic tables and chairs, communal eating style.",
    tip: "Bangkok Isan food finding strategy: (1) The best Isan food in Bangkok is at the most informal-looking restaurants — the most worn tables, the paper napkins, the plastic chairs outside, and the biggest crowd of Thai construction workers eating at 5am are the quality signals; (2) Spice warning: authentic Isan som tam and larb are significantly spicier than central Thai curry versions — 'pet nit noi' (a little spicy) still produces what most non-Thai palates consider extremely hot; starting with 'mai pet' (not spicy) and adjusting up is wiser than the reverse; (3) Raw meat components: some Isan dishes (laab dip — raw minced meat salad, sai krok — fermented sausage) have raw or lightly fermented meat components that carry food safety consideration for people with compromised immunity; (4) Sticky rice eating technique: Isan cuisine is eaten with sticky rice rolled into small balls between the fingers and used to scoop other dishes — there's no wrong way to do this as a foreigner, but watching Thai diners for the technique before attempting reveals the correct approach.",
  },
  {
    name: "Northern Thai Cuisine in Bangkok",
    emoji: "🏔️",
    area: "Northern Thai restaurants in Bangkok — specific northern food restaurants in Chatuchak, Silom area, and specialist northern food markets at Chatuchak Weekend Market section 4",
    price: "Khao soi (signature northern curry noodle): ฿70–150; Nam phrik ong (northern chili dip): ฿80–150; Sai ua (northern herb sausage): ฿100–200; Full northern Thai meal: ฿200–500",
    why: "Northern Thai cuisine (Lanna cuisine) is culturally distinct from Central Thai food — the cooler highland climate, the cultural influence of Myanmar, Yunnan Chinese traders, and the local hill tribe populations have produced a cuisine that differs significantly from Bangkok's typical Thai food offerings. Khao soi (egg noodles in a spiced coconut curry broth, served with fried noodles on top and pickled mustard greens and shallots on the side) is Northern Thailand's most internationally recognized dish and widely considered one of the world's great bowl dishes. Nam phrik ong (spiced tomato-pork chili dip eaten with vegetables and pork rinds) and other northern chili dip (nam phrik) preparations are distinctive regional specialties. Sai ua (northern pork and herb sausage) is differentiated by lemongrass, galangal, turmeric, and other aromatics that make it distinctly different from central Thai sausages. Finding genuinely northern-style food in Bangkok requires seeking specific northern restaurants rather than generic Thai restaurants.",
    tip: "Bangkok northern Thai food access: (1) Chatuchak Weekend Market section 4 has northern Thai food vendors including genuine khao soi and other northern specialties; (2) Dedicated northern Thai restaurants in Bangkok are often established by migrants from Chiang Mai, Chiang Rai, and other northern provinces — asking staff if they're from the north (confirming restaurant authenticity) is a reasonable approach; (3) Khao soi ordering: the dish comes with the chili oil, lime, pickled mustard greens, and shallots on the side — squeeze lime, add chili oil to taste, and use the condiments to continuously adjust throughout eating; (4) The Lanna cultural dimension: northern Thai food carries significant Buddhist temple culture and Lanna royal court cultural heritage — the elaborate traditional serving styles (khantoke dinner presentations) reflect this heritage and are available at cultural dinner shows in Bangkok for a fuller understanding.",
  },
  {
    name: "Southern Thai Cuisine in Bangkok",
    emoji: "🥥",
    area: "Southern Thai restaurants in Bangkok — along Silom (significant southern Thai Muslim community), Pratunam area, and specific southern food restaurants throughout the city",
    price: "Khao yam (southern rice salad): ฿60–120; Massaman curry: ฿80–160; Pad sataw (stir-fried stink beans): ฿80–150; Gaeng som (southern sour curry): ฿80–180; Roti: ฿30–80",
    why: "Southern Thai cuisine is the spiciest of Thailand's regional cuisines and the most influenced by Malay, Indian, and Muslim food cultures. The south's coastal geography also means seafood is central to the cuisine. Southern Thai food in Bangkok differs from the generic 'Thai food' of tourist-oriented restaurants in several significant ways: dramatically higher heat levels (bird's eye chili use is more liberal), the incorporation of palm oil rather than coconut oil in some dishes, strong turmeric and galangal flavors in curries, and distinctively fermented flavors from pla raa (fermented fish paste) and other preserved ingredients. Massaman curry (a Thai-Muslim dish with potatoes, peanuts, and warm spices — cardamom, cinnamon, clove — with clearly Indian culinary heritage) is the southern Thai dish that has achieved the widest international recognition. Khao yam (a rice salad with toasted coconut, dried shrimp, herbs, and a budu — fermented fish sauce — dressing) is among the most distinctive southern Thai dishes available at good southern restaurants.",
    tip: "Bangkok southern Thai food exploration: (1) The Silom area has several genuine southern Thai restaurants serving the southern Muslim community — roti canai (flaky flatbread), khao mok (Thai biryani), and massaman are reliably good here; (2) Stink beans (sataw, สะตอ): southern Thailand's most distinctive vegetable — bitter, pungent, and memorable beans stir-fried with shrimp paste or in curries; an acquired taste that polarizes first-timers; (3) Heat warning: southern Thai food at authentic restaurants approaches the limits of what most non-Thai palates can manage — the combination of dried chilies, bird's eye chilies, and chili paste creates cumulative heat; (4) Roti and curry combination: southern Thai roti (influenced by Malaysian roti canai) paired with massaman or fish curry creates one of the most satisfying breakfast or late-morning meals in Bangkok's diverse food landscape.",
  },
];

export function BangkokIsanFood() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🌶️ Bangkok regional Thai cuisines — Isan, Northern Thai & Southern Thai food
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
