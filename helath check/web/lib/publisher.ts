/**
 * Who publishes this site, and what it does and does not claim to be.
 *
 * Health content is held to the strictest quality bar Google applies, and this
 * property had no answer to "who is behind it": no named operator, no author
 * on any of the 119 guides, no editorial policy, and no stated limit on what
 * the site is for. Grepping the whole app for "author", "reviewed by" or any
 * clinical credential returned nothing. Meanwhile 24 hospital names in the
 * city guides turned out not to exist and ran for roughly a year before they
 * were caught (2026-08-26), which is the kind of error that bar exists to
 * punish.
 *
 * Everything here is either a verifiable fact about how the site works or an
 * honest statement of its limits. The operator's name and background are read
 * from the environment rather than written in, because inventing a person — or
 * a medical reviewer the site does not have — would be the same class of
 * mistake as the hospitals that did not exist.
 *
 * Set these in Vercel to turn the named-publisher block on:
 *   NEXT_PUBLIC_PUBLISHER_NAME      e.g. "Yunmin Kim"
 *   NEXT_PUBLIC_PUBLISHER_ROLE      e.g. "Founder and sole operator"
 *   NEXT_PUBLIC_PUBLISHER_BACKGROUND  one or two sentences, plain text
 *   NEXT_PUBLIC_PUBLISHER_LOCATION  e.g. "Bangkok, Thailand"
 *   NEXT_PUBLIC_PUBLISHER_CONTACT   a URL or an email
 *   NEXT_PUBLIC_PUBLISHER_PROFILE   a public profile URL, e.g. LinkedIn
 *
 * PROFILE is the one that does the work. A name on a page proves nothing; a
 * name that resolves to a public professional profile is checkable by a reader
 * and lands in the Person's `sameAs`, which is what schema.org has that field
 * for. It is published as given — LinkedIn serves bots a 999 and an authwall,
 * so the link cannot be read from here and nothing about its contents is
 * restated on the page.
 */

import catalogue from "../data/checkup_db.json";
import profiles from "../data/hospital_profiles.json";

// Counted from the data files at build time. These figures used to be typed
// into the policy text below, and by 2026-10-23 they had drifted: the page
// said 955 of 1,001 priced packages carried their source URL when the files
// held 857 of 1,001 — and 35 of those 1,001 were not read from anywhere at
// all, but cloned from another branch at 95% of its price and deleted that
// day. A policy page whose own numbers are wrong is the last place that can
// afford it.
type Pkg = { price: string | number | null; source_url: string | null };
const priced = (catalogue as { packages: Pkg[] }).packages.filter(
  (p) => p.price != null && parseFloat(String(p.price)) > 0,
);
const PRICED = priced.length;
const WITH_URL = priced.filter((p) => (p.source_url ?? "").startsWith("http")).length;
const LISTINGS = (catalogue as { hospitals: unknown[] }).hospitals.length;
const MATCHED = Object.keys((profiles as { registry_match: Record<string, unknown> }).registry_match).length;
const n = (x: number) => x.toLocaleString("en-US");

export type Publisher = {
  name: string | null;
  role: string | null;
  background: string | null;
  location: string | null;
  contact: string | null;
  profile: string | null;
};

export function publisher(): Publisher {
  const v = (k: string) => {
    const s = process.env[k];
    return s && s.trim() ? s.trim() : null;
  };
  return {
    name: v("NEXT_PUBLIC_PUBLISHER_NAME"),
    role: v("NEXT_PUBLIC_PUBLISHER_ROLE"),
    background: v("NEXT_PUBLIC_PUBLISHER_BACKGROUND"),
    location: v("NEXT_PUBLIC_PUBLISHER_LOCATION"),
    contact: v("NEXT_PUBLIC_PUBLISHER_CONTACT"),
    profile: v("NEXT_PUBLIC_PUBLISHER_PROFILE"),
  };
}

export function hasNamedPublisher(): boolean {
  return !!publisher().name;
}

/**
 * What the site is, in the words a quality rater would use. These are claims
 * the code can back up, which is why each one names the mechanism.
 */
export const EDITORIAL_POLICY: { heading: string; body: string }[] = [
  {
    heading: "Prices are read from the hospital's own page, and we link to it",
    body:
      `${n(WITH_URL)} of the ${n(PRICED)} priced packages on this site carry the exact URL they were read from; the rest name the hospital price feed they were read from, or say plainly that the source was not recorded. That link sits under the price, with the date the file was built, so any figure can be checked against the hospital's own listing. Where a price could not be read, the page says the hospital publishes none rather than estimating one.`,
  },
  {
    heading: "Accreditation and hospital type come from the national register, not from us",
    body:
      `Each hospital page that matches Thailand's official register shows its Ministry of Public Health hospital code, whether it is public or private, its hospital type, and its accreditation status with the certificate date — sourced from the Healthcare Accreditation Institute (Public Organisation) and, for bed counts, Bangkok Metropolitan Administration open data. ${n(MATCHED)} of our ${n(LISTINGS)} listings are matched — by Thai name, or by sharing a map location with the register entry. The rest show nothing in that block rather than an implied endorsement.`,
  },
  {
    heading: "Nothing on this site is paid for",
    body:
      "There are no sponsored listings, no paid placements and no affiliate commission that changes an ordering. Rankings are by price or by the stated criterion, computed from the data. Outbound links to a hospital's own booking page are marked nofollow.",
  },
  {
    heading: "This is a price and directory reference, not medical advice",
    body:
      "The site is operated by one person and no clinician reviews it. It does not recommend a test, interpret a result, or advise whether a check-up is appropriate for you — those are questions for a doctor. What it does is tell you what a hospital charges, where it is, when it opens, and whether it appears on the national register.",
  },
  {
    heading: "When we get something wrong",
    body:
      "In August 2026 a review of the city guides found 24 hospital names that do not exist; they had been published for roughly a year and were removed, and the price ranges in those guides are now labelled as not scraped. In October 2026 two hospital pages were found to be invented: 'Samitivej Nawamin' carried 35 prices copied from another Samitivej branch at 95% and that branch's address, and 'Ramkhamhaeng Hospital Chiang Mai' carried the address and phone number of Ramkhamhaeng Hospital in Bangkok. Neither name is on the national register; both pages were removed. The same review found Bangkok Hospital's headquarters page showing the licence of its Phetchaburi branch, now corrected. Guides carry the date they were last checked. Corrections are welcome through the contact page and are made on the page itself, not quietly.",
  },
];
