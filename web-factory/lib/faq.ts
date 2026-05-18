// Category-별 FAQ — AEO + Google FAQPage 리치결과.

export type Faq = { q: string; a: string };

// /c/[category] FAQ — supply edition. 각 카테고리별 buyer 관점 FAQ.
export const CUISINE_FAQS: Record<string, Faq[]> = {
  manufacturer: [
    {
      q: "How do I contact a Thai manufacturer directly?",
      a: "Each listing shows the manufacturer's public phone and website where available. We never paywall or gatekeep contact info. Many buyers go through sourcing agents who add 15-30% markup — direct contact saves margin and gives you control of the relationship.",
    },
    {
      q: "What does the Trust Score mean for a manufacturer?",
      a: "Trust Score (0-100) combines Google rating and review volume on a logarithmic scale. Higher score = larger, more established operation with more public reviews. It's a directional signal — pair it with direct due diligence (factory visits, samples, references).",
    },
  ],
  auto_parts: [
    {
      q: "Why is Thailand a top auto-parts hub?",
      a: "Thailand's Eastern Seaboard hosts Toyota, Honda, Mitsubishi, Isuzu, Mazda, and Nissan plants — and the entire Tier 1 / Tier 2 supplier ecosystem around them (Aisin, AGC, Denso, Toyoda Gosei, Summit, Thai Summit Harness, etc.).",
    },
    {
      q: "How do I source from Tier 1 auto parts suppliers?",
      a: "Listings here show direct phone and website. Note that Tier 1 OEM suppliers typically only sell to OEMs — for aftermarket parts, look at Tier 2 / 3 suppliers or local distributors.",
    },
  ],
  industrial_estate: [
    {
      q: "What's the difference between Pinthong, Amata, WHA, and Rojana?",
      a: "All major Thai industrial estate operators. Pinthong (5 estates near Sriracha port), Amata (Chonburi, Rayong, Hanoi VN), WHA / Hemaraj (largest by area, owns 11 estates), Rojana (mixed-use estates across the Eastern Seaboard). Amata and WHA dominate by total leased area.",
    },
    {
      q: "Can I tour an industrial estate?",
      a: "Yes — most estates run buyer / tenant tours by appointment. Contact the estate's leasing office (phone listed here) to arrange. Major estates have visitor centers with sample factory units and infrastructure overviews.",
    },
  ],
  warehouse: [
    {
      q: "What rental rates are typical for warehouses in Chon Buri?",
      a: "Eastern Seaboard warehouse rents typically run THB 150-280 per sqm per month for standard ready-built warehouses, depending on location, ceiling height, and dock count. Premium temperature-controlled facilities run higher.",
    },
    {
      q: "How close should a warehouse be to Laem Chabang port?",
      a: "Most export-focused operations target within 30-45 minutes of Laem Chabang. Sriracha, Bowin, and Bang Lamung corridors are densest. Pinthong, Amata City, and WHA Logistics Park 2 all sit inside this radius.",
    },
  ],
  logistics: [
    {
      q: "Which logistics providers serve Eastern Seaboard manufacturers?",
      a: "Major 3PL operators (Linfox, DHL, Kerry, Yusen, Whale Logistics) all have strong Eastern Seaboard presence. Most can be contacted directly via the phone numbers listed here for facility tours and quotes.",
    },
  ],
  food_mfg: [
    {
      q: "Are Thai food manufacturers HACCP / FSSC 22000 certified?",
      a: "Major Thai food manufacturers (frozen seafood, poultry, ready meals, snacks) are typically HACCP, GMP, and FSSC 22000 certified — Thailand is a top-3 global processed food exporter. Confirm certifications directly with each supplier before contracting.",
    },
  ],
};

export const HOME_FAQS: Faq[] = [
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) combines: Google rating (50% weight) and review volume on logarithmic scale (50%). It's our derived metric — not a Google ranking. We rebuild it continuously from public Google Maps data to surface established operations with public proof.",
  },
  {
    q: "Are these listings sponsored?",
    a: "Organic listings are never paid. Some suppliers buy clearly-labelled Editor's Pick / Recommended / Featured slots, but we never delete or downrank organic listings. Sponsored slots appear with explicit badges.",
  },
  {
    q: "How fresh is this data?",
    a: "Listings and Trust Scores rebuild from Google Maps data. Phone and website fields come from each supplier's own Google Business Profile — we don't republish or cache scraped contact info.",
  },
  {
    q: "Why do I need this site if I can just search Google Maps?",
    a: "Google Maps alone surfaces nearest-N matches, mixing real factories with auto-parts retail stores, butcher shops, and 'factory outlet' malls. We aggressively filter B2C noise so the directory only shows real B2B suppliers — manufacturers, factories, warehouses, industrial estates.",
  },
  {
    q: "Do you broker deals or take commission?",
    a: "No. We're an independent directory. Buyers contact suppliers directly via the phone or website listed. No middleman markup. We monetize via clearly-labelled sponsored slots and (eventually) verified-supplier subscription tiers — never via deal commission.",
  },
  {
    q: "What if my company isn't listed?",
    a: "Visit /for-suppliers — listings are free for verified Thai manufacturers and industrial operators. Verification is a one-time process to confirm operational status.",
  },
];
