const TOPICS = [
  {
    title: "Khao Kheow Open Zoo — Thailand's Best Zoo Near Bangkok",
    emoji: "🦁",
    summary: "Khao Kheow Open Zoo (Si Racha, Chonburi) is the primary zoo destination accessible from Bangkok and considered Thailand's premier zoological park: (1) Location and access: Khao Kheow Open Zoo is located in Chonburi Province, approximately 80km from Bangkok (1.5–2 hours by car via Bang Na Expressway and Highway 7); accessible by car, organized tour, or bus from Bangkok's Ekkamai bus terminal to Si Racha then songhthaew; (2) Zoo collection scale: Khao Kheow houses 800+ species and 8,000+ animals on a 1,100-acre open site; the zoo is Thailand's largest; it holds animals originally from the former Dusit Zoo (Bangkok), which closed in 2018 and relocated its collection to Khao Kheow; (3) Penguin exhibit: Khao Kheow's penguin exhibit (African penguins in an air-conditioned facility) became internet-famous when zoo penguin 'Chumchim' was taken to a restaurant to help a sick zoo mate 'Pringles' regain appetite; this heartwarming internet story brought global attention; (4) Night Safari at Khao Kheow: the zoo operates a Night Safari zone (open 6–10pm) with nocturnal animals in their active period; tram tours through the Night Safari are offered as a guided experience; (5) Breeding programs: Khao Kheow maintains endangered species breeding programs (Malayan tapir, clouded leopard, Thai banteng); the zoo's conservation work on endangered Southeast Asian species contributes to regional conservation beyond entertainment function.",
    action: "Khao Kheow Open Zoo (khaokhewopenzoo.com) for ticket pricing (฿500 foreigners, ฿100 Thai nationals); car access: Bang Na Expressway to Chonburi; bus from Ekkamai bus terminal to Si Racha then local transport; Night Safari advance ticket recommended; overnight accommodation: si Racha town hotels + Pattaya is 30km further south for combine trip.",
  },
  {
    title: "Elephant Sanctuaries — Ethical Elephant Experiences Near Bangkok",
    emoji: "🐘",
    summary: "Thailand's relationship with elephants is deep and complex; responsible elephant tourism requires understanding the ethical landscape: (1) Elephant history in Thailand: the Asian elephant (chang in Thai, the national symbol of Thailand) has been central to Thai culture for over 2,000 years; elephants served in warfare, royalty ceremony, and forest logging (logging was banned in 1989); the ban on logging left approximately 3,000–4,000 domesticated elephants (privately owned by mahouts) without forest work, creating the economic pressure that led to urban elephant begging and commercial tourism; (2) The ethical tourism challenge: the elephant tourism industry has significant variation in animal welfare; 'elephant riding' operations (trekking camps) that use saddles, chains, and hooks to control elephants are widely considered unethical by conservation standards; 'sanctuary' operations range from genuine ethical sanctuaries (no riding, natural group behavior, reduced interaction) to 'sanctuary-washing' that uses ethical terminology while still using problematic practices; (3) Genuine ethical sanctuaries near Bangkok: Bangkok day trips to legitimate ethical sanctuaries exist but are longer drives; Save Elephant Foundation (Elephant Nature Park, Chiang Mai) is the gold standard but requires flying or overnight travel from Bangkok; near Bangkok: Samui Elephant Sanctuary model programs exist; Elephant Sanctuary Thailand (Kanchanaburi area, 130km from Bangkok) offers ethical alternatives; (4) Khao Yai elephant encounters: wild elephant encounters in Khao Yai National Park represent the highest welfare option — wild elephants in natural habitat; no contact, observation from vehicle distance; (5) Bangkok's Elephant Museum at Dusit Palace: the Royal Elephant Museum (within Dusit Palace complex) documents Thailand's elephant cultural heritage including documentation of historically auspicious white elephants; this museum-focused encounter has no animal welfare concerns.",
    action: "Save Elephant Foundation (elephantnaturepark.org) for Chiang Mai-based ethical sanctuary visits; Wildlife Friends Foundation Thailand (wfft.org, Phetchaburi Province, 160km from Bangkok) for genuine wildlife rescue center visits; Elephant Conservation Network (elephantconservationnetwork.org) for evaluation resources; World Animal Protection's elephant tourism guide for evaluating specific operations; avoid TripAdvisor reviews alone (operators actively manage reviews); look for operations with 'no riding, no chains' policies.",
  },
  {
    title: "Bangkok's Strays & Urban Wildlife — Street Dogs, Cats & City Animals",
    emoji: "🐕",
    summary: "Bangkok has one of the world's largest urban stray animal populations, creating a distinctive urban ecosystem: (1) Bangkok's stray dog population: estimates suggest 300,000–1,000,000 stray dogs live in Bangkok's streets, temple grounds, markets, and neighborhoods; these animals are typically accepted and often fed by Thai people as a religious merit practice; the stray dog population is a visible daily reality of Bangkok street life; (2) Temple dogs and sterilization programs: many Bangkok temples (wat) serve as de facto refuges for stray dogs; temple monks feed dogs as compassionate practice; government and NGO sterilization programs (Catch-Neuter-Return, CNR) work to control population through humane sterilization rather than culling; international organizations (Soi Dog Foundation, SPCA Bangkok) run Bangkok-specific stray animal programs; (3) Soi Dog Foundation: the Soi Dog Foundation (operated from Phuket but with Bangkok operations) is Thailand's largest dog and cat welfare organization; the foundation operates adoption programs (placing Thai dogs internationally), mobile veterinary clinics, and advocacy for animal welfare law; volunteers visiting Thailand can contribute to Soi Dog Foundation work; (4) Thai cat culture: Thailand has both significant street cat populations and a developed pet cat culture; Thai people share the Buddhist compassion approach to stray cats (feeding, allowing shelter); Thai social media has active cat communities; the distinctive Siamese cat (from Thailand originally) and Khao Manee cat (ancient Thai breed, historically owned by Thai royalty) represent genuine Thai cat heritage; (5) Bangkok's urban birds: Bangkok's urban bird population includes distinctive tropical species visible to visitors; the common myna (imported from South Asia in the 1800s), the Asian koel (distinctive melodic calling), baya weaverbirds at canal areas, and various egrets and herons at waterways represent urban Bangkok bird life observable without equipment.",
    action: "Soi Dog Foundation (soidog.org) for volunteer opportunities, donating, or fostering Thai dogs internationally; SPCA Bangkok for local rescue contact; Bangkok stray dog interaction safety: move slowly, avoid eye contact when uncertain of dog behavior, carry treats to deflect potential aggression; temple visits with stray dogs: respectful but non-interactive approach is the safest; Soi Cat cafés (multiple Bangkok cafés with rescue cats) for cat interaction.",
  },
];

export function BangkokZooWildlife() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🦁 Bangkok wildlife — Khao Kheow Open Zoo, ethical elephant tourism & Bangkok urban animals
      </div>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-green-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-green-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
