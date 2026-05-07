// Bangkok aesthetic clinic guide articles — long-form AEO/SEO content.

export type Faq = { q: string; a: string };

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: Faq[];
  related?: string[];
  updated: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "bangkok-botox-guide",
    title: "Bangkok Botox Guide — What You'll Pay & How to Pick (2026)",
    metaTitle: "Bangkok Botox Guide 2026 — Pricing, Brands, Best Clinics",
    metaDescription:
      "Bangkok botox pricing in 2026, how to verify genuine Allergan/Dysport/Botulax, and choosing English-speaking clinics. Verified review-backed picks.",
    updated: "2026-05-07",
    intro:
      "Bangkok is the cheapest major-city destination for genuine botox — but knowing how to spot fake or diluted product is the difference between a great deal and a wasted trip. This guide walks through the brands, the pricing, and how our Trust Score helps filter the noise.",
    sections: [
      {
        heading: "Genuine brands available in Bangkok",
        body:
          "Allergan (USA) — the original. Most expensive (฿4,500-7,000/area), most predictable. " +
          "Dysport (UK) — close second. Slightly faster onset. ฿3,500-5,500/area. " +
          "Botulax (Korea) — Korean botulinum toxin, very popular for tour clients. ฿2,500-4,000/area. " +
          "Xeomin (Germany) — \"naked\" botox without complexing proteins. ฿4,000-6,000/area. " +
          "Avoid: unbranded \"vials\" and prices significantly below the above ranges.",
      },
      {
        heading: "How clinics fake genuine product",
        body:
          "Common scams: serving Botulax priced as Allergan; diluting authentic vials with saline (\"baby botox\" packaged as full strength); reusing vial labels. " +
          "Defenses: ask to see the unopened vial before injection. Verify the vial against the brand's anti-counterfeit features (Allergan has a hologram). " +
          "Read review patterns — clinics with multiple complaints about \"weak result\" or \"didn't last 3 months\" are flagged in our Trust Score.",
      },
      {
        heading: "Where to go (and what reviewers actually say)",
        body:
          "Sukhumvit / Phrom Phong — high concentration of premium clinics targeting Korean and Singaporean tourists. Higher prices but stronger English support. " +
          "Pratunam — value tier. More volume, less ambiance. Korean tour group friendly. " +
          "Silom / Sathon — established medical district. Older clinics with long track records. " +
          "Our Trust Score combines Google rating, review volume, and Local Guide reviewer ratio — heavily weights established clinics over fly-by-night ones.",
      },
      {
        heading: "Practical visit timeline",
        body:
          "Day 1: consultation (free at most clinics). " +
          "Day 1-2: procedure (15-30 min). No downtime. " +
          "Day 3-5: onset of effect. " +
          "Day 7-10: peak effect. Don't book a follow-up earlier than this. " +
          "Total trip duration for a botox visit: 4-7 days minimum if you want to see result before flying out.",
      },
    ],
    faqs: [
      {
        q: "How much does botox cost in Bangkok vs Korea/USA?",
        a: "Bangkok premium clinic: ฿4,500-7,000/area = $130-200 USD. Same Allergan in Korea: $250-400. USA: $350-600. Bangkok is typically 50-70% of US pricing for the same genuine product.",
      },
      {
        q: "Can I trust 'Korean doctor' marketing?",
        a: "Sometimes. Some clinics employ actual Korean-trained doctors; others just use Korean branding. Check the doctor's medical board registration and whether they're physically there during your visit. Trust Score weights reviewer mentions of specific doctors.",
      },
      {
        q: "Should I do botox same day as filler?",
        a: "Possible but not recommended for first-time visitors. Botox + filler same day = harder to assess what caused which result. Spread over 2 visits if your trip allows.",
      },
    ],
    related: ["bangkok-filler-guide", "korean-medical-tourism"],
  },
  {
    slug: "bangkok-filler-guide",
    title: "Bangkok Filler Guide — HA, Juvederm, Restylane (2026)",
    metaTitle: "Bangkok Dermal Fillers 2026 — Pricing, Brands, Best Clinics",
    metaDescription:
      "Bangkok HA filler pricing — Juvederm, Restylane, Belotero. How to verify genuine product, what to expect by area (lip, cheek, jawline, under-eye).",
    updated: "2026-05-07",
    intro:
      "Bangkok HA filler pricing is roughly half of Korean and Singapore prices for genuine Allergan/Galderma product. The complexity is matching the right product to the right area — and avoiding clinics that overfill.",
    sections: [
      {
        heading: "Brands and where to use them",
        body:
          "Juvederm (Allergan, USA) — Volift / Voluma / Volbella series. Most premium. ฿14,000-22,000/syringe. " +
          "Restylane (Galderma) — Lyft / Defyne / Refyne series. Comparable quality, often slightly cheaper. ฿12,000-18,000. " +
          "Belotero (Merz) — softer, good for fine lines and tear trough. ฿11,000-15,000. " +
          "Korean brands (Neuramis, Yvoire) — ฿8,000-12,000. Quality has caught up; better-value picks. " +
          "Korean tour clients often opt for Korean brands; expat / Western clients trend Juvederm.",
      },
      {
        heading: "Areas + cost reality",
        body:
          "Lip enhancement: 1 syringe = 1ml = full lips. ฿14,000-20,000 typical. " +
          "Cheek augmentation: 2-3ml. ฿28,000-50,000. " +
          "Jawline / chin: 2-4ml. ฿28,000-65,000. " +
          "Tear trough (under-eye): 1ml carefully. ฿15,000-22,000. Highest-skill area — pick experienced clinic. " +
          "Nose (non-surgical rhinoplasty): 1-2ml. ฿18,000-35,000.",
      },
      {
        heading: "Red flags",
        body:
          "Prices below ฿8,000/ml for branded HA = product likely not what's claimed. " +
          "Doctor not present during procedure = cannot do it in Thailand legally. " +
          "Overpromising natural look on extreme volume requests. " +
          "Trust Score on this site flags clinics with frequent reviewer mentions of overfilled or asymmetric results.",
      },
    ],
    faqs: [
      {
        q: "Do filler results last in Bangkok heat?",
        a: "HA filler degradation is metabolic, not heat-related. Lasts 6-18 months depending on area and product. Bangkok heat doesn't shorten longevity.",
      },
      {
        q: "Can I dissolve filler if I don't like it?",
        a: "Yes — hyaluronidase enzyme dissolves HA filler in 24-48 hours. Most reputable clinics offer this service ฿3,000-6,000. Always confirm the clinic stocks hyaluronidase before booking.",
      },
    ],
    related: ["bangkok-botox-guide", "korean-medical-tourism"],
  },
  {
    slug: "korean-medical-tourism",
    title: "Korean Medical Tourism in Bangkok — What Tour Packages Cover",
    metaTitle: "Bangkok Medical Tourism Korean — Packages, Pricing 2026",
    metaDescription:
      "How Korean medical tourism packages to Bangkok work. What's included, typical pricing, language support — plus when going independent saves money.",
    updated: "2026-05-07",
    intro:
      "Bangkok hosts a large Korean medical tourism flow centered on aesthetics. Packages from Korean travel agencies bundle hotel + transfer + clinic visit at a markup that's worthwhile for first-timers but skippable once you know the system.",
    sections: [
      {
        heading: "What packages typically include",
        body:
          "3-5 day trip: airport transfer, 4-star hotel near Sukhumvit, clinic transport, Korean-speaking interpreter, post-procedure follow-up. " +
          "Procedures: typically 1-3 from botox / filler / HIFU / laser / facial menu. " +
          "Total package: ₩2,500,000-5,000,000 ($1,800-3,700) depending on procedure scope.",
      },
      {
        heading: "Independent vs package",
        body:
          "First trip: package wins. Language, logistics, interpreter all handled. " +
          "Second trip onwards: book direct. Same procedures often 30-40% cheaper. " +
          "Hotel: book separately on Booking.com (often 50% cheaper than package rate). " +
          "Transfer: Grab from BKK ฿400-700, vs ฿2,000+ package transfer.",
      },
      {
        heading: "Korean-speaking clinics",
        body:
          "Many top Bangkok aesthetic clinics have Korean-speaking staff (counter, sometimes nurses). Rare to find Korean-speaking doctors, but not necessary — quality of injection technique matters more than chitchat. " +
          "Trust Score on our site flags clinics with high Korean reviewer counts as Korean-friendly defaults.",
      },
    ],
    faqs: [
      {
        q: "한국 의료관광 패키지는 안전한가요?",
        a: "큰 에이전시 (한진관광, 모두투어 의료관광) 통해서 가는 건 보통 안전합니다. 클리닉이 검증된 곳들이고 한국어 통역 보장. 작은 에이전시는 클리닉 수수료 받아서 자기네 제휴 클리닉만 추천하는 경우가 있어요.",
      },
      {
        q: "패키지 가격이 직접 예약보다 비싼가요?",
        a: "네, 보통 30-40% 비쌉니다. 첫 방문이면 편의성 값을 한다고 보고, 재방문이면 직접 예약이 훨씬 경제적입니다. 우리 사이트의 Trust Score로 클리닉 직접 선택해서 호텔 따로 예약하면 비슷한 시술을 더 저렴하게 받을 수 있어요.",
      },
    ],
    related: ["bangkok-botox-guide", "bangkok-filler-guide"],
  },
];

export function findGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}
