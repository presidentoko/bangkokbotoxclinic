const INFO = [
  {
    name: "Vets & Animal Hospitals in Bangkok",
    emoji: "🐾",
    area: "Thonglor (premium vets), Silom, Ratchayothin (Kasetsart-linked clinics)",
    price: "General consultation ฿500–1,500; Specialist/emergency ฿2,000–8,000+; Annual vaccines ฿800–2,000",
    why: "Bangkok has excellent veterinary care at Southeast Asia's best prices — Bangkok's private veterinary hospitals (many staffed by vets trained at Chulalongkorn or abroad in Australia, UK, or US) offer international-standard care at Thai prices. The concentration of pet-owning middle-class and expat residents has driven veterinary quality upward — Thonglor area has multiple premium animal hospitals with 24-hour emergency care, in-house laboratories, ultrasound, and surgical facilities. Thai vets are typically fluent in English in Bangkok's expat-area practices.",
    tip: "Bangkok vet practical tips: registering with a regular vet before emergencies arise is important — it establishes records and allows faster treatment. 24-hour emergency vets in Bangkok: several operate in Sukhumvit and Silom areas — keep their numbers saved. Pet insurance: available in Thailand through Allianz, AIA, and specialist pet insurance providers — worth considering for dogs and cats with health conditions. Spay/neuter programs: multiple non-profit animal welfare organizations (Soi Dog Foundation, SCAD) run low-cost spay/neuter programs accessible to Bangkok residents. Microchipping is standard practice at Bangkok vets.",
  },
  {
    name: "Dog Parks, Pet-Friendly Spaces & Community",
    emoji: "🐕",
    area: "Benjakitti Park (dog area), Lumpini Park dog section, BTS station adjacent parks",
    price: "Park access free; Dog-friendly cafés average ฿200–400/visit",
    why: "Bangkok's pet-friendly public space is limited by Asian city standards but expanding — Benjakitti Park has a dedicated enclosed dog park area, Suan Rot Fai (Railway Park) has good dog-walking space, and several smaller Bangkok parks have been designated dog-friendly zones. Bangkok's dog café culture (cafés explicitly welcoming dogs inside) has grown significantly — often serving both the dog and owner in the same visit. The Bangkok Pet Owner community (Facebook groups, LINE groups by neighborhood) organizes informal dog meetups, pet-friendly restaurant recommendations, and mutual assistance.",
    tip: "Bangkok dog park etiquette: bring waste bags (provided at parks but supply varies) and pick up — Bangkok parks have improved dramatically on waste management. Off-leash areas: Benjakitti's dog area is the most reliable enclosed off-leash space in central Bangkok. Dog-friendly cafés: the hashtag #bangkokdogfriendly on Instagram surfaces current café recommendations — the scene changes as new cafés open and others close. For dog parks outside Bangkok: Bang Krachao (green lung area across the river from Bangkok) is excellent for weekend dog walks — reachable by ferry and bicycle rental.",
  },
  {
    name: "Pet Transport, Travel & Importing Pets",
    emoji: "✈️",
    area: "Suvarnabhumi Airport (USAG), Bangkok's international pet transport services",
    price: "Pet in-cabin ฿2,000–5,000 per flight; Cargo transport ฿8,000–25,000; Import documentation ฿3,000–8,000",
    why: "Bangkok's international pet transport infrastructure is well-developed — several Bangkok-based pet relocation companies handle the complex documentation required for bringing pets to Thailand (health certificates, vaccination records, import permits from Department of Livestock Development) and for exporting pets to other countries. Airlines operating Bangkok routes have varying pet policies — Thai Airways, Emirates, and most major carriers have specific pet transport protocols. The paperwork complexity (different rules per destination country — UK and Australia are especially complex) justifies using a professional pet transport service.",
    tip: "Importing a pet to Thailand: required documents include microchip, rabies vaccination (at least 21 days before travel), veterinary health certificate issued within 7 days, and import permit from Thai Department of Livestock Development. Most Bangkok vets are familiar with the outbound documentation for expats leaving Thailand — start the process 4–6 weeks before departure. Exporting to the EU: requires EU-format health certificate (Form EXPORT HEALTH CERTIFICATE) completed by an accredited vet. Exporting to UK: separate PETS-equivalent documentation now applies post-Brexit. Pet travel companies in Bangkok: several specialize exclusively in international pet relocation and are worth the fee for first-time movers.",
  },
];

export function BangkokPetOwner() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🐾 Pet ownership in Bangkok — vets, dog parks, pet-friendly spaces & travel with pets
      </div>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
