const TOPICS = [
  {
    title: "Bangkok Wheelchair & Mobility Accessibility",
    emoji: "♿",
    summary: "Bangkok presents genuine accessibility challenges for wheelchair users and those with mobility limitations — uneven sidewalks, significant steps, and inconsistent infrastructure require advance planning but don't prevent meaningful travel.",
    action: "Bangkok wheelchair accessibility realistic guide: (1) BTS Skytrain: most BTS stations have elevators, though some older stations do not — checking the BTS accessibility map (available at information counters or online) before planning routes prevents elevator-dependent dead ends; (2) MRT subway: Bangkok's MRT subway has better elevator coverage than BTS and is generally more accessible; (3) Sidewalk reality: Bangkok's footpaths are notoriously uneven, frequently parked on by motorcycles, and riddled with steps and obstructions — wheelchair navigation outside of modern shopping malls and hotel environments requires assistance or significant patience; (4) Accessible transportation: Grab car (the Thai Uber equivalent) provides standard vehicle booking at consistent prices — far more accessible than tuk-tuks or motorbike taxis; air-conditioned taxis are relatively low-entry and accessible for those who can transfer; (5) Wheelchair-friendly hotel selection: luxury international hotels (Marriott, Hilton, Four Seasons, Sofitel) have accessible room configurations, roll-in showers, and accessible common areas; mid-range and budget hotels vary enormously — specific accessibility inquiry before booking is essential; (6) Accessible attractions: Siam Paragon, Central World, and major modern shopping malls have excellent accessibility; Wat Pho and older historic sites have cobblestones, steps, and significant accessibility challenges; (7) Disability travel resources: the 'Accessible Thailand' organization and disability travel blogs specifically covering Bangkok provide current accessibility assessments.",
  },
  {
    title: "Bangkok for Deaf & Hard of Hearing Travelers",
    emoji: "🦻",
    summary: "Bangkok is navigable for Deaf and hard of hearing travelers — visual communication, gesture, and smartphone translation tools bridge most situations; the Thai Deaf community is active and welcoming.",
    action: "Bangkok hearing accessibility guide: (1) Visual communication culture: Bangkok's service industry is practiced at non-verbal communication — pointing, showing prices on phone calculators, and gesture-based interaction are standard practice in markets and with taxi drivers; (2) Thai Sign Language (TSL): Thailand has its own sign language (distinct from ASL); the National Association of the Deaf in Thailand promotes TSL; some Thai Deaf cultural institutions in Bangkok may use TSL interpretation; (3) Smartphone translation tools: Google Translate's camera translation (instant AR overlay of Thai text into English) and typed translation are powerful tools in Bangkok — most service encounters can be navigated through typed exchange; (4) Hotel communication: major international hotels in Bangkok will have written/typed communication protocols for Deaf guests; requesting accommodation confirmation in writing rather than phone is reasonable; (5) Emergency access: Thailand's 191 (police), 1669 (medical emergency), and 199 (fire) emergency lines don't have TTY/TDD equivalents — having hotel staff programmed in phone and using written emergency cards with Thai is recommended; (6) Deaf community Bangkok: the Deaf community around NDAT (National Association of the Deaf in Thailand) and Vocational School for the Deaf in Bangkok maintains a social community; international Deaf travelers have found warm welcome through these community connections.",
  },
  {
    title: "Bangkok for Low Vision & Blind Travelers",
    emoji: "👁️",
    summary: "Bangkok presents real navigation challenges for blind and visually impaired travelers, but a combination of tactile guide services, audio tools, and local assistance makes meaningful travel achievable.",
    action: "Bangkok vision accessibility guide: (1) Tactile paving reality: some Bangkok locations (BTS stations, crosswalks near major sites) have yellow tactile paving for vision-impaired navigation — but inconsistency and obstruction by parked vehicles and street furniture makes independent navigation difficult; (2) Guided tourism: hiring a personal guide for Bangkok (available through tour operators and private guide platforms) is the most effective strategy for vision-impaired travelers — a trusted local guide provides audio description, navigation assistance, and cultural explanation simultaneously; (3) Audio resources: Bangkok's major museums (Bangkok National Museum, Museum of Contemporary Art, various heritage sites) have English audio guides that describe exhibits; requesting audio assistance at attractions often reveals more resources than are publicly advertised; (4) BTS accessibility: BTS station staff are generally willing to assist vision-impaired passengers — approaching any BTS information counter and requesting assistance navigating to your destination is accommodated; (5) Smartphone assistance: iPhone's VoiceOver and Google's TalkBack work in Thailand; offline maps downloaded to phone allow audio navigation without data connectivity; (6) Massage culture: Thailand's long massage tradition has a specific dimension for vision-impaired practitioners — many of Bangkok's reputable traditional Thai massage practitioners are blind, trained through vocational programs; these establishments (often signposted as 'blind massage') provide excellent therapeutic service while supporting blind practitioners' employment.",
  },
  {
    title: "Bangkok Pet-Friendly Travel",
    emoji: "🐕",
    summary: "Thailand has specific pet import requirements that must be addressed before arrival; within Bangkok, pet-friendly hotels, parks, and services have expanded significantly alongside Thailand's growing pet culture.",
    action: "Bangkok pet travel guide: (1) Import documentation (before traveling): bringing a dog or cat to Thailand requires: valid rabies vaccination (at least 30 days before travel, not more than 1 year old), a health certificate from an accredited veterinarian (within 10 days of travel), microchip, and potentially import permits from Thailand's Department of Livestock Development; Thailand has both import approval and quarantine requirements — check the current DLD regulations as these change periodically; (2) Pet-friendly hotels Bangkok: many Bangkok luxury hotels permit small pets (under 10kg typically) with prior notification and a pet deposit; dedicated pet-friendly policies vary significantly — Marriott, Kimpton, and selected boutique hotels have published pet policies; (3) Dog parks and green spaces: Chatuchak Park and some community parks in Bangkok allow dogs on leads; the dog park at Benchasiri Park (Sukhumvit Soi 24) is dedicated dog exercise space; (4) Pet food and supplies: Bangkok's luxury pet store market has expanded significantly — Villa Market, Tops Market, and dedicated pet stores (Pet One, Animal Farm) stock premium international pet food brands; (5) Veterinary care: Bangkok has several international-standard veterinary clinics in expat areas (Sukhumvit, Silom) with English-speaking staff, advanced equipment, and emergency services; quality of care at these facilities is comparable to developed-world standards.",
  },
];

export function BangkokAccessible() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        ♿ Bangkok accessibility & special needs — mobility, Deaf, vision & pet travel
      </h2>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-teal-100 rounded-xl">
            <summary className="cursor-pointer p-3 flex items-center gap-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{t.summary.slice(0, 60)}…</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug border-t border-teal-50 pt-2">
              {t.summary}
              <div className="mt-1 text-teal-700">▶ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
