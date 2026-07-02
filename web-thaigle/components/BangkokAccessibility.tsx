const TOPICS = [
  {
    title: "Wheelchair Access & Physical Mobility in Bangkok",
    emoji: "♿",
    summary: "Bangkok's accessibility for wheelchair users and people with physical mobility limitations is uneven — the infrastructure ranges from excellent (major international hotels, BTS stations with lifts, newer malls) to very challenging (uneven sidewalks, open drains, no curb cuts, crowded markets, older buildings with stairs). The BTS Skytrain system has lifts at most major stations (not all) — verify lift availability at specific stations before travel. The MRT subway is generally more accessible than BTS — newer construction with consistent lift access. Major attractions: the Grand Palace area and older temples have significant accessibility challenges (no ramps, uneven surfaces). Bumrungrad and Bangkok International Hospital have full wheelchair accessibility. The honest assessment: Bangkok is manageable for determined wheelchair users with advance planning, but it requires significantly more preparation than cities with established accessibility infrastructure.",
    action: "Contact BTS specifically about lift-available stations (the BTS website has accessibility maps); book hotels at major chains where accessibility is standard (Marriott, Hilton, Hyatt properties confirm accessible room specifications); use Grab for accessible transport (some Grab vehicles accommodate wheelchairs — filter by vehicle type); plan major attraction visits with awareness that indoor modern sections of attractions are more accessible than historic outdoor areas.",
  },
  {
    title: "Sensory & Neurodivergent Considerations",
    emoji: "🧠",
    summary: "Bangkok is a sensory-intense city — this is both its appeal and its challenge for visitors with sensory processing differences, autism spectrum conditions, or anxiety disorders. The sensory environment: loud traffic, diverse smells (street food, car exhaust, incense, durian), dense crowds in markets and public transit, constant activity and visual stimulation. Bangkok's heat and humidity add physiological stress on top of sensory processing demands. The flip side: Bangkok also has excellent resources for sensory downtime — air-conditioned malls provide calm environments, major parks (Lumphini, Benjakitti) provide quieter green space, and the city's scale means quiet corners are accessible if sought. The Thai culture's emphasis on calm and non-confrontation actually makes social navigation somewhat more predictable in formal settings.",
    action: "Plan sensory breaks into activity schedules — use malls as decompression spaces rather than destinations. Hotel room quality matters significantly for sensory rest — invest in a quiet room at a quality hotel (higher floors away from street noise, blackout curtains). Bangkok transport timing: avoiding rush hour (7:30–9am, 5–7:30pm) significantly reduces sensory load in public transit. App-based food ordering (GrabFood, Foodpanda) eliminates restaurant negotiation — useful for those who find unpredictable social interaction taxing.",
  },
  {
    title: "Dietary Restrictions & Allergies in Bangkok",
    emoji: "🍽️",
    summary: "Navigating dietary restrictions in Bangkok requires active communication — Thai food culture is generous but doesn't automatically flag allergens the way many Western restaurants do. Common food allergens in Thai cooking: fish sauce (naam pla) is in almost everything, even vegetarian dishes; shrimp paste (kapi) appears in many curry bases; tree nuts (particularly peanuts and cashews) appear frequently in stir-fries and sauces; shellfish are widely used. Gluten-free navigation: Thai cuisine uses rice rather than wheat predominantly, making it relatively gluten-accessible — but soy sauce (containing wheat) appears in Chinese-influenced dishes, and cross-contamination is common in shared kitchens. For serious allergies: carrying a Thai-language allergy card (available through apps like Chef Card) dramatically improves communication with restaurants.",
    action: "For nut allergies: explicitly state 'mai sai tua lisong' (no peanuts) in Thai — this is critical. For shellfish: 'mai sai goong' (no shrimp), 'mai sai pu' (no crab). 'Jay' (เจ) means vegan/traditional Buddhist fasting food — no meat, fish sauce, eggs, or dairy; recognized at dedicated jay restaurants and temple food stalls. International restaurants in Bangkok cater well to Western dietary needs — Italian, Japanese, and Indian restaurants are typically the most accommodating to Western dietary frameworks.",
  },
];

export function BangkokAccessibility() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        ♿ Accessibility in Bangkok — mobility, sensory needs & dietary restrictions guide
      </div>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-blue-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-blue-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-blue-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-blue-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
